import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import mainBg from "../../assets/mainBg.png";
import { NavigationScreenProp } from "react-navigation";
import { connect } from "react-redux";
import {ApplicationState} from "../../redux";
import BottomNavigator from "../component/BottomNavigator";
import removeIcon from '../../assets/common/removeIcon.png'
import customUploadImg from '../../assets/settings/customUploadImg.png'
import * as ImagePicker from 'expo-image-picker';
import CustomModal from "../component/CustomModal";
import trashIcon from '../../assets/common/trashIcon.png'
import { useFonts,  Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold} from '@expo-google-fonts/montserrat';
import {Inter_500Medium, Inter_700Bold} from '@expo-google-fonts/inter';
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";
import TopBarLeftArrow from "../component/TobBarLeftArrow";
import { getFirestore, addDoc, doc, getDoc,  collection,deleteDoc, onSnapshot} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import uuid from "uuid";
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import { scaleX } from "../../core/theme/dimensions";
import * as FileSystem from 'expo-file-system';

interface Props {
  navigation: NavigationScreenProp<any, any>;
  userReducer: object;
}

const _UploadImages: React.FC<Props> = (props: Props) => {  

  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [localImgUrl, setLocalImgUrl] = useState('')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploadImageList, setUploadImageList] = useState<any>([])
  const [selectedImageId, setSelectedImageId] = useState('')

  useEffect(() => {
    const firestore = getFirestore()    
    const unsub = onSnapshot(collection(firestore, 'UploadImages'), (querySnapshot) => {
      let uploadImageList:any[] = []

      querySnapshot.docs.map((doc) => {       
        let catData = doc.data()
        let newData = {
          ...doc.data(),
          uid: doc.id
        }
        uploadImageList.push(newData)
        
      });
      console.log(uploadImageList)
      setUploadImageList(uploadImageList)
    });
    return () => unsub();
  }, [])

  const resizeImg = async (result:any, targetWidth: number) => {
    const manipResult = await manipulateAsync(
      result.uri,
      [{resize: {width: targetWidth}}],
      {format: SaveFormat.JPEG}
    )
    const fileInfo:any = await FileSystem.getInfoAsync(manipResult.uri)
    if(fileInfo.size > 75000) {
      resizeImg(result, targetWidth - 50)
    }
    else {
      setSelectedImageUrl(manipResult.uri)
      handleImagePicked(manipResult)     
    }
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.cancelled) {
      resizeImg(result, 320)
    }
  };

  const handleImagePicked = async (pickerResult:any) => {
    try {
      setLoading(true)
      const uploadImgUrl = await uploadImageAsync(pickerResult.uri);
      const firestore = getFirestore();
      addDoc(collection(firestore, "UploadImages"), {
        uploadImgUrl,
      })
      .then((data) => {
        console.log('image uploaded successfully')
      })
      .catch((e) => {
        console.log(e, 'add error')
      });
    } catch (e) {
      console.log(e);
      alert("Upload failed, sorry :(");
    } finally {
     setLoading(false)
    }
  };

  const uploadImageAsync = async (imgUri:string) => {
    const blob:any = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", imgUri, true);
      xhr.send(null);
    });
  
    const fileRef = ref(getStorage(), uuid.v4());
    const result = await uploadBytes(fileRef, blob);
  
    // We're done with the blob, close and release it
    blob.close();
  
    return await getDownloadURL(fileRef);
  }

  const handleNavigate = (screen: string): void => {
    props.navigation.navigate(screen);
  };  

  const gotoBack = () => {
    props.navigation.goBack()
  }

  const slectImg = (item:any) => {
    if(item.uploadImgUrl == selectedImageUrl) {      
      setSelectedImageUrl('')
      setSelectedImageId('')
    }
    else {
      setSelectedImageUrl(item.uploadImgUrl)
      setSelectedImageId(item.uid)
    }
  }

  const renderItem = ({ item, index} : {item: any, index: any}) => (
    <View style={item.uploadImgUrl == selectedImageUrl ? styles.imgListSelectedItem : styles.imgListItem} key={index}>
      <TouchableOpacity onPress={()=> slectImg(item)}>
        <Image source={{uri: item.uploadImgUrl}} style={item.uploadImgUrl == selectedImageUrl ? styles.imgListItemSelectedImg : styles.imgListItemImg} />
      </TouchableOpacity>     
    </View>
  );

  const renderDeleteImgTxt = () => {
    return (
      <View style={styles.modalTxtContent}>
        <Text style={styles.modalContentTxt}>
          Are you sure you want to permanently 
          <Text style={[styles.modalContentTxt, styles.delColorTxt]}> delete </Text>
          this image?
        </Text>        
      </View>
    )
  }

  const removeImg = () => {
    if(selectedImageId !== '') {
      setShowDeleteDialog(true)
    }    
  }

  const deleteImg = () => {
    const firestore = getFirestore();
    deleteDoc(doc(firestore, 'UploadImages', selectedImageId))
    .then(() => {      
      setShowDeleteDialog(false)
      console.log('removed')
    })
    .catch((e:any) => {
      console.log(e, 'delete error')
    })
    
  }

  const cancelDialog = () => {
    setShowDeleteDialog(false)
  }

  let [fontsLoaded] = useFonts({
    Montserrat_700Bold, Montserrat_600SemiBold, Montserrat_500Medium, Montserrat_400Regular,
    Inter_500Medium, Inter_700Bold, 
    Poppins_400Regular, Poppins_500Medium,  Poppins_600SemiBold, Poppins_700Bold
  });

  if (!fontsLoaded) {
    return null;
  }


  return (
    <View style={styles.container}>
      <ImageBackground source={mainBg} resizeMode="cover" style={styles.mainImgBg}>
        <ScrollView style={styles.contentContainer}>  
          <View style={styles.titleWithBack}>
            <TopBarLeftArrow navigation={props.navigation} />
          </View>
          <View style={styles.dataContent}>
            <TouchableOpacity onPress={()=>pickImage()} style={styles.selectImgBtn} >
              <Image source={localImgUrl ? {uri: localImgUrl } : customUploadImg} style={styles.uplaodImgStyle} />
            </TouchableOpacity>       
            {loading && <ActivityIndicator />}     
          </View>
          <Text style={styles.addPhotoTxt}>Images</Text>
          <View style={styles.selectImgList}>             
              <View style={styles.imgListContainer}>
                <FlatList
                  nestedScrollEnabled 
                  data={uploadImageList}
                  renderItem={renderItem}
                  horizontal={true}
                  extraData={selectedImageUrl}
                  keyExtractor={item => item.uid}
                />        
              </View>
          </View>          
        </ScrollView>
        <CustomModal 
          modalVisible={showDeleteDialog} 
          modalIcon={trashIcon}
          isRating={false}
          ratingVal={0}
          renderModalTxtContent={renderDeleteImgTxt}
          modalSubTxt={'You can’t undo this action.'}
          primaryBtnTxt={'Delete'}
          cancelBtnTxt={'Cancel'}
          primaryAction={deleteImg}
          cancelAction={cancelDialog}
        />
      </ImageBackground>     
      <TouchableOpacity onPress={()=> removeImg()} style={styles.actionContainer} >
          <Image source={removeIcon} style={styles.actionIcon} />
        </TouchableOpacity> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  contentContainer: {
    flex:1,
    paddingVertical: scaleX(25),
  },
  mainImgBg: {
    flex: 1,
    resizeMode: 'cover',
  },
  addPhotoTxt: {
    color: '#ffffff',
    fontSize: scaleX(23),
    lineHeight: scaleX(33),
    fontWeight: '700',
    marginTop: scaleX(60),
    marginBottom: scaleX(20),
    fontFamily: 'Montserrat_700Bold',
    paddingLeft: scaleX(25)
  },
  selectImgList: {
    flexDirection: 'row',
    flex: 1,
  },
  imgListContainer: {
    flex: 1,
    height: scaleX(145),
  },
  imgListItem: {
    borderRadius: scaleX(11),
    marginLeft: scaleX(20),  
    backgroundColor: 'transparent',
    padding: scaleX(2),
    position: 'relative',   
    height: scaleX(145),
  },
  imgListSelectedItem: {
    borderRadius: scaleX(11),
    marginLeft: scaleX(20), 
    position: 'relative',   
    backgroundColor: 'white',
    padding: scaleX(2),
    height: scaleX(145),
    borderWidth: scaleX(2),
    borderColor: '#ffffff'
  },
  imgListItemImg: {    
    height: scaleX(141),
    width: scaleX(122),
    resizeMode: 'cover',
    borderRadius: scaleX(11),
  },
  imgListItemSelectedImg: {
    height: scaleX(137),
    width: scaleX(118),
    resizeMode: 'cover',
    borderRadius: scaleX(11),
  },  
  dataContent: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scaleX(45),    
    marginBottom: scaleX(26)
  },
  selectImgBtn: {},
  uplaodImgStyle: {
    width: scaleX(240),
    height: scaleX(202),
    resizeMode: 'cover',
    borderRadius: scaleX(21),
  },
  titleWithBack: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: scaleX(20),
  },
  modalTxtContent: {
    justifyContent: 'center',
    maxWidth: scaleX(200),
  },
  modalContentTxt: {
    fontSize: scaleX(14),
    fontWeight: '600',
    lineHeight: scaleX(17),    
    color: 'white',
    textAlign: 'center'
  },
  delColorTxt: {
    color: '#FF517B'
  },
  actionContainer: {
    position: 'absolute',
    bottom: scaleX(20),
    right: scaleX(20),
  },
  actionIcon: {
    width: scaleX(58), 
    height: scaleX(58), 
    resizeMode: "contain"
  },
});

const mapStateToProps = (state: ApplicationState) => ({
  userReducer: state.userReducer,
});

const UploadImages = connect(mapStateToProps, { })(
  _UploadImages
);

export default UploadImages;
