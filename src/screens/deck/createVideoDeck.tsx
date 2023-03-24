import React, { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  TextInput,
  Platform,
  FlatList,
  ActivityIndicator,
  SafeAreaView
} from "react-native";
import bg3 from "../../assets/screenBg/bg3.png";
import { NavigationScreenProp } from "react-navigation";
import { connect } from "react-redux";
import {ApplicationState} from "../../redux";
import { useRoute , useIsFocused} from '@react-navigation/native';
import unlockEffectBtn from '../../assets/common/unlockEffectBtn.png'
import radioSelect from '../../assets/deck/radioSelect.png'
import radioUnselect from '../../assets/deck/radioUnselect.png'
import createDeckBtn from '../../assets/deck/createDeckBtn.png'
import { Picker as SelectPicker } from '@react-native-picker/picker';
// import RNPickerSelect  from 'react-native-picker-select';
import { AntDesign } from '@expo/vector-icons'; 
import { Video } from 'expo-av';
import { useFonts,  Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold} from '@expo-google-fonts/montserrat';
import {Inter_500Medium, Inter_700Bold} from '@expo-google-fonts/inter';
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { scaleX } from "../../core/theme/dimensions";
import cardBg from '../../assets/deck/createCard/cardBg.png'
import txtareaBg from '../../assets/deck/createCard/txtareaBg.png'
import noImage from '../../assets/deck/noImage.png'
import checkedIcon from '../../assets/deck/checkedIcon.png'

import { getFirestore, addDoc, doc, getDoc,  collection,deleteDoc, onSnapshot} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import updateBtn from '../../assets/deck/updateBtn.png'
import * as ImagePicker from 'expo-image-picker';
import YoutubePlayer from "react-native-youtube-iframe";
import uuid from "uuid";
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

interface Props {
  navigation: NavigationScreenProp<any, any>;
  userReducer: any;
}
let deckImgList: any[]

const _CreateVideoDeck: React.FC<Props> = (props: Props) => {  
  const route:any = useRoute();
  const deckId = route.params?.deckId;
  const userId = route.params?.userId;
  const isUserOnlyDeck = route.params?.isUserOnlyDeck;
  const isFocused = useIsFocused();

  const [maleSelect, setMaleSelect] = useState(true)
  const [deckType, setDeckType] = useState('music')
  const [videoUrl, setVideoUrl] = useState('')
  const [youtubuId, setYoutubuId] = useState('')
  const [level, setLevel] = useState('beginner')
  const [videoCatList, setVideoCatList] = useState<any>([])
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [spotifyUrl, setSpotifyUrl] = useState('')  
  const [uploadImageList, setUploadImageList] = useState<any>([])
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [loading, setLoading] = useState(false)
  const [playing, setPlaying] = useState(false);
  const [curUser, setCurUser] = useState<any>({})
  const [isPublic, setIsPublic] = useState(false)

  useEffect(() => {    
    props.userReducer?.then((userData:any)=>{ 
      setCurUser(userData?.curUser)
      getDeckDetailData(userData?.userId)
    })
  }, [props.userReducer, isFocused]);

  const onStateChange = useCallback((state:any) => {
    if (state === "ended") {
      setPlaying(false);      
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);

  useEffect(() => {
    const firestore = getFirestore()    
    const unsub = onSnapshot(collection(firestore, 'UploadImages'), (querySnapshot) => {
      let uploadImageList:any[] = []

      querySnapshot.docs.map((doc) => {    
        let newData = {
          ...doc.data(),
          uid: doc.id
        }
        uploadImageList.push(newData)
        
      });
      deckImgList= uploadImageList
      setUploadImageList(uploadImageList)
    });
    return () => unsub();
  }, [])

  useEffect(() => {
    const firestore = getFirestore()    
    const uncatsub = onSnapshot(collection(firestore, 'Category'), (querySnapshot) => {
      let cardVideoList:any[] = []
      querySnapshot.docs.map((doc) => {       
        let catData = doc.data()
        let newData = {
          ...doc.data(),
          uid: doc.id,
          label: doc.data().catName,
          value: doc.data().catName,

        }
        if(catData.catType !== 'card') {
          cardVideoList.push(newData)
        }        
      });
      setVideoCatList(cardVideoList)
    });
    return () => uncatsub();
  }, [])

  const getDeckDetailData = (logedUserId:any) => {
    if(deckId) {
     console.log('yesId')
     const firestore = getFirestore()    
     if(isUserOnlyDeck) {
      getDoc(doc(firestore, "Users",  userId ? userId : logedUserId, "Decks", deckId))
      .then((deck:any) => {      
        let detailData = deck.data();       
        setTitle(detailData?.title);
        setDesc(detailData?.desc);
        setMaleSelect(detailData?.isMale);
        setLevel(detailData?.level);
        setDeckType(detailData?.deckType);
        setSelectedImageUrl(detailData?.deckImgUrl)
        setVideoUrl(detailData?.videoUrl);
        setYoutubuId(detailData?.videoUrl);
        setSpotifyUrl(detailData?.spotifyUrl);
        setIsPublic(detailData?.isPublic)
        if(detailData?.deckImgUrl) {
          if(deckImgList.filter((obj:any) => obj.uploadImgUrl === detailData?.deckImgUrl).length === 0) {
            console.log('eee')
            deckImgList.unshift({
                uid: 'fromPicker',
                uploadImgUrl: detailData?.deckImgUrl
              })
            }
            setUploadImageList(deckImgList)
        }
      })
      .catch((e) => {
          console.log(e)
      });   
    }
    else {
      getDoc(doc(firestore, "Decks", deckId))
      .then((deck:any) => {
        let detailData = deck.data();       
        setTitle(detailData?.title);
        setDesc(detailData?.desc);
        setMaleSelect(detailData?.isMale);
        setLevel(detailData?.level);
        setDeckType(detailData?.deckType);
        setSelectedImageUrl(detailData?.deckImgUrl)
        setVideoUrl(detailData?.videoUrl);
        setYoutubuId(detailData?.videoUrl);
        setSpotifyUrl(detailData?.spotifyUrl);
        setIsPublic(detailData?.isPublic)
        if(detailData?.deckImgUrl) {
          if(deckImgList.filter((obj:any) => obj.uploadImgUrl === detailData?.deckImgUrl).length === 0) {
            console.log('eee')
            deckImgList.unshift({
                uid: 'fromPicker',
                uploadImgUrl: detailData?.deckImgUrl
              })
            }
            setUploadImageList(deckImgList)
        }
      })
      .catch((e) => {
          console.log(e)
      });   
     }
    }
    else {
     setTitle('');
     setDesc('');
     setMaleSelect(true);
     setLevel('beginner');
     setDeckType('');
     setSelectedImageUrl('')
     setVideoUrl('');
     setSpotifyUrl('');
     setIsPublic(false)
    }
    
   }

  const handleNavigate = (screen: string): void => {
    props.navigation.navigate(screen);
  };  

  const gotoBack = () => {
    props.navigation.goBack()
  }

  const handleYoutubuUrl = (youtubuUrl:string) => {
    setVideoUrl(youtubuUrl)
    let rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
    let youtubuInfo:any = youtubuUrl.match(rx)
    if(youtubuInfo) {
      setYoutubuId(youtubuInfo[1])
    }
    else {
      setYoutubuId(youtubuUrl)
    }
    
  }
  const createDeck = () => {
   
    const deckData = {
      title,
      desc,
      isMale: maleSelect,
      level,
      isPublic,
      deckType,
      isCardDeck: false,
      videoUrl: youtubuId,
      spotifyUrl,
      deckImgUrl: selectedImageUrl
    } 
    props.navigation.navigate('createDeckCard', {deckData, deckId})
   
  }

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
      setSelectedImageUrl(uploadImgUrl)
      uploadImageList.unshift({
      uid: 'fromPicker',
      uploadImgUrl
      })
      console.log('image uploaded successfully')
      
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


  const slectImg = (item:any) => {
    if(item.uploadImgUrl == selectedImageUrl) {
      if(item.uid == 'fromPicker') {
        uploadImageList.shift()
      }
      setSelectedImageUrl('')
    }
    else {
      setSelectedImageUrl(item.uploadImgUrl)
    }
  }

  const renderItem = ({ item, index} : {item: any, index:any}) => (
    <View style={item.uploadImgUrl == selectedImageUrl ? styles.imgListSelectedItem : styles.imgListItem} key={index}>
      <TouchableOpacity onPress={()=> slectImg(item)}>
        <Image source={{uri: item.uploadImgUrl}} style={styles.imgListItemImg} />
      </TouchableOpacity>
      {item.uploadImgUrl == selectedImageUrl && 
        <View style={styles.checkedIconContainer}>
          <Image source={checkedIcon}  style={styles.checkedIcon} />
        </View>
      }
    </View>
  );

  let [fontsLoaded] = useFonts({
    Montserrat_700Bold, Montserrat_600SemiBold, Montserrat_500Medium, 
    Inter_500Medium, Inter_700Bold, 
    Poppins_400Regular, Poppins_500Medium,  Poppins_600SemiBold, Poppins_700Bold
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={bg3} resizeMode="cover" style={styles.mainImgBg}>
        <ScrollView style={styles.contentContainer}>  
          <Text style={styles.addPhotoTxt}>Add photo</Text>
          <View style={styles.selectImgList}>
              <TouchableOpacity onPress={pickImage} style={styles.pickBtnContainer}>
                <Image source={noImage} style={styles.pickBtnImg} />
                {loading && <ActivityIndicator />}
              </TouchableOpacity>
              <View style={styles.imgListContainer}>
                <FlatList
                  nestedScrollEnabled 
                  data={uploadImageList}
                  renderItem={renderItem}
                  horizontal={true}
                  extraData={selectedImageUrl}
                  keyExtractor={(item:any) => item.uid}
                />        
              </View>
          </View>
       
          {videoUrl !=='' ?         
          <View style={[styles.videoPreviewContainer, styles.noBorder]}>           
           <YoutubePlayer
              webViewStyle={{opacity: 0.99}}
              height={scaleX(203)}
              play={playing}
              videoId={youtubuId}
              onChangeState={onStateChange}
            />   
          </View>  
         
          : 
          <View style={styles.videoPreviewContainer} />
          }
          
          <Text style={[styles.descriptionTxt]}>Video URL</Text>
          <View style={styles.inputareaContainer}>
            <ImageBackground source={cardBg} resizeMode="cover" style={[styles.txtareabgImg]}>            
              <TextInput    
                  value={videoUrl}           
                  onChangeText={(txt) => handleYoutubuUrl(txt)}
                  placeholder="Youtubu Id : iee2TATGMyI" 
                  placeholderTextColor={'#968FA4'}
                  style={styles.inputStyle}/>
            </ImageBackground>
          </View>
              
          <Text style={styles.descriptionTxt}>Description</Text>
          <View style={styles.inputareaContainer}>
            <ImageBackground source={cardBg} resizeMode="cover" style={[styles.txtareabgImg]}>            
              <TextInput 
                  value={title}           
                  onChangeText={(txt) => setTitle(txt)}              
                  placeholder="Title" 
                  placeholderTextColor={'#968FA4'}
                  style={styles.inputStyle}/>
            </ImageBackground>
          </View>
          <View style={styles.textareaContainer}>
            <ImageBackground source={txtareaBg} resizeMode="cover" style={[styles.txtareabgImg, styles.descTxtImgBg]}>              
              <TextInput 
                  value={desc}           
                  onChangeText={(txt) => setDesc(txt)}
                  placeholder="Description" 
                  placeholderTextColor={'#968FA4'}              
                  numberOfLines={8}
                  multiline={true}
                  editable
                  style={[styles.inputStyle, styles.textAreaStyle]}/>
            </ImageBackground>
          </View>
          {
            deckType == 'Music' &&
            <View>
              <Text style={styles.descriptionTxt}>Spotify Link</Text>
              <View style={styles.inputareaContainer}>
                <ImageBackground source={cardBg} resizeMode="cover" style={[styles.txtareabgImg]}>            
                  <TextInput 
                      value={spotifyUrl}           
                      onChangeText={(txt) => setSpotifyUrl(txt)}
                      placeholder="url" 
                      placeholderTextColor={'#968FA4'}
                      style={styles.inputStyle}/>
                </ImageBackground>
              </View>
          </View>
          }
          <View style={styles.relativeView}>
            <Text style={styles.voiceTxt}>Voice</Text>
            <View style={styles.maleSelectContainer}>
              <Text style={styles.maleTxt}>Male</Text>
              <TouchableOpacity onPress={()=> setMaleSelect(true)}>
                <Image source={maleSelect ? radioSelect :radioUnselect} style={styles.radioBtnImg} />
              </TouchableOpacity>
              <Text style={styles.maleTxt}>Female</Text>
              <TouchableOpacity onPress={()=> setMaleSelect(false)}>
                <Image source={maleSelect ? radioUnselect : radioSelect} style={styles.radioBtnImg} />
              </TouchableOpacity>
            </View>
              {curUser.userType == 'free' && 
                <View style={[styles.upgradeBtnContainer]}>                
                  <TouchableOpacity style={styles.upgradeBtn} onPress={()=> handleNavigate('upgradeAccount')}>
                    <Image source={unlockEffectBtn} style={styles.upgradeBtnIcon} />
                  </TouchableOpacity>
                </View>
              }
          </View>
          <Text style={styles.voiceTxt}>Level</Text>
          <View style={styles.levelSelectContainer}>
            <View style={styles.levelItem}>
              <Text style={styles.maleTxt}>Beginner</Text>
              <TouchableOpacity onPress={()=> setLevel('beginner')}>
                <Image source={level == 'beginner' ? radioSelect :radioUnselect} style={styles.radioBtnImg} />
              </TouchableOpacity>
            </View>
            <View  style={styles.levelItem}>
              <Text style={styles.maleTxt}>Intermediate</Text>
              <TouchableOpacity onPress={()=> setLevel('intermediate')}>
                <Image source={level == 'intermediate' ? radioSelect : radioUnselect } style={styles.radioBtnImg} />
              </TouchableOpacity>
            </View>
            <View  style={styles.levelItem}>
              <Text style={styles.maleTxt}>Advanced</Text>
              <TouchableOpacity onPress={()=> setLevel('advanced')}>
                <Image source={level == 'advanced' ? radioSelect : radioUnselect} style={styles.radioBtnImg} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.pickerContainer}>
            {/* <RNPickerSelect
              onValueChange={(value) => setDeckType(value)}
              value={deckType}
              style={{
                inputIOS: {
                  color: 'white',
                  fontSize: scaleX(20),
                },
                inputAndroid: {
                  color: 'white',
                  fontSize: scaleX(20),
                },
                iconContainer: {
                  top: scaleX(Platform.OS == 'ios' ? 0 : 18),
                  right: scaleX(12),
                },
              }}
              items={videoCatList}
              Icon={() => {
                return (<AntDesign name="caretdown" size={scaleX(18)} color="white" />)
              }}
            />  */}
            <SelectPicker
                style={{flex: 1, width: '100%', height: scaleX(65), color: 'white'}}
                dropdownIconColor={'#ffffff'}
                selectedValue={deckType}
                onValueChange={(itemValue:any, itemIndex:any) =>
                  setDeckType(itemValue)
                }>
                  {videoCatList.map((item:any, index:any) => {
                    return <SelectPicker.Item label={item.label} value={item.value} key={index}/>
                  })}
            </SelectPicker> 
          </View>
          {curUser?.isAdmin &&
            <View>
              <Text style={styles.voiceTxt}>Type</Text>
              <View style={styles.maleSelectContainer}>
                <View style={styles.levelItem}>
                  <Text style={styles.maleTxt}>Public</Text>
                  <TouchableOpacity onPress={()=> setIsPublic(true)}>
                    <Image source={isPublic  ? radioSelect :radioUnselect} style={styles.radioBtnImg} />
                  </TouchableOpacity>
                </View>
                <View  style={styles.levelItem}>
                  <Text style={styles.maleTxt}>Private</Text>
                  <TouchableOpacity onPress={()=> setIsPublic(false)}>
                    <Image source={!isPublic ? radioSelect : radioUnselect } style={styles.radioBtnImg} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            }
          <View style={styles.createDeckBtnContainer}>
            <TouchableOpacity style={styles.createDeckBtn} 
              disabled={title == '' || desc == '' || videoUrl == ''}
              onPress={createDeck}>
              <Image source={deckId ? updateBtn : createDeckBtn} style={styles.createDeckBtnImg} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={gotoBack}>
              <Text style={styles.cancelTxt}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  contentContainer: {
    flex:1,
    padding: scaleX(25),
  },
  mainImgBg: {
    flex: 1,
    resizeMode: 'cover',
  },
  videoPreviewContainer: {
    height: scaleX(203),
    flex:1,
    backgroundColor: '#292627',
    borderRadius: scaleX(21),
    borderStyle: 'dashed',
    marginTop: scaleX(60),
    borderWidth: scaleX(1),
    borderColor: '#fece26CE',
    // overflow: 'hidden'
  },
  noBorder: {
    borderWidth: scaleX(0),    
  },
  addPhotoTxt: {
    color: '#ffffff',
    fontSize: scaleX(23),
    lineHeight:scaleX(33),
    fontWeight: '700',
    marginTop: scaleX(60),
    marginBottom: scaleX(20),
  },
  selectImgList: {
    flexDirection: 'row',
    flex: 1
  },
  pickBtnContainer: {
    height: scaleX(145),
    width: scaleX(122),
    borderRadius: scaleX(11),
    margin: scaleX(2),
  },
  pickBtnImg: {
    height: scaleX(141),
    width: scaleX(122),
    resizeMode: 'contain'
  },
  imgListContainer: {
    flex: 1,
    height: scaleX(145),
    width: scaleX(120),
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
  },
  imgListItemImg: {    
    height: scaleX(141),
    width: scaleX(122),
    resizeMode: 'cover',
    borderRadius: scaleX(11),
  },
  checkedIconContainer: {
    position: 'absolute',
    top: scaleX(6),
    right: scaleX(6),
    width: scaleX(32),
    height: scaleX(32),
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    borderRadius: scaleX(16),
    backgroundColor: 'white'
  },
  checkedIcon: {    
    width: scaleX(12),
    resizeMode: 'contain',
  },
  descriptionTxt: {
    fontSize: scaleX(23),
    fontWeight: '600',
    color: '#ffffff',
    marginTop: scaleX(24),
    fontFamily: 'Montserrat_600SemiBold'
  },
  inputStyle: {
    color: 'white',
    fontFamily: 'Montserrat_500Medium',
    fontSize: scaleX(19.7),
    fontWeight: '500',
  },
  textAreaStyle: {
    height: scaleX(194),
    justifyContent: "flex-start",
    textAlignVertical: 'top',
  },
  voiceTxt: {
    fontSize: scaleX(23),
    fontWeight: '600',
    color: '#ffffff',
    marginTop: scaleX(38),
    marginBottom: scaleX(15),
    fontFamily: 'Poppins_600SemiBold'

  },
  maleSelectContainer: {
    flexDirection: 'row',
    marginBottom: scaleX(50),
    alignContent: 'center',
    alignItems: 'center',
  },
  maleTxt: {
    fontSize: scaleX(18),
    lineHeight: scaleX(22),
    fontWeight: '500',
    color: '#F4F4F4',
    marginRight: scaleX(15),
  },
  radioBtnImg: {
    width: scaleX(16),
    height: scaleX(16),
    resizeMode: 'contain',
    marginRight: scaleX(30),
  },
  pickerContainer: {
    borderWidth: scaleX(1),
    borderColor: '#A293BE',
    height: scaleX(65),
    borderRadius: scaleX(14),
    paddingLeft: scaleX(15),
    paddingRight: scaleX(15),
    overflow: "hidden",
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectStyle: {
    height: scaleX(65),
    color: '#968FA4',
  },
  selectItemStyle: {
  },
  createDeckBtnContainer: {
    marginTop: scaleX(30),
    marginBottom: scaleX(90),
    justifyContent: 'center',
    alignItems: 'center'
  },
  createDeckBtn: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  createDeckBtnImg: {
    width: scaleX(178),
    height: scaleX(55),
    resizeMode: 'contain'
  },
  textareaContainer: {
    borderWidth: scaleX(1),
    borderColor: '#A293BE',
    height: scaleX(234),
    borderRadius: scaleX(13.8),
    overflow: "hidden",
    marginTop: scaleX(29)
  },
  inputareaContainer: {
    borderWidth: scaleX(1),
    borderColor: '#A293BE',
    height: scaleX(67),
    borderRadius: scaleX(13.8),
    overflow: "hidden",
    marginTop: scaleX(24)
  },
  txtareabgImg: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: scaleX(20),
  },
  cancelBtn: {
    marginTop: scaleX(25)
  },
  cancelTxt: {
    fontWeight: '500',
    fontSize: scaleX(18),
    lineHeight: scaleX(28),
    fontFamily: 'Poppins_500Medium',
    color: '#F4F4F4'
  },
  descTxtImgBg: {
    padding: scaleX(20)
  },
  levelSelectContainer: {
    marginBottom: scaleX(15)
  },
  levelItem: {
    flexDirection: 'row',
    marginBottom: scaleX(15)
  },
  relativeView: {
    position: 'relative',
  },  
  upgradeBtnContainer: {
    position: 'absolute',
    top: scaleX(0),
    right: 0,
    left: 0,
    bottom: 0,
    zIndex: 22,
    borderRadius: scaleX(11),
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#131215A6',
    padding: scaleX(4),
  },
  upgradeBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',    
    paddingVertical: scaleX(6),
    paddingHorizontal: scaleX(16),
    borderRadius: scaleX(20),
    maxWidth: scaleX(183),
  },
  upgradeBtnIcon: {
    width: scaleX(280),
    height: scaleX(145),
    resizeMode: 'cover'
  },
});

const mapStateToProps = (state: ApplicationState) => ({
  userReducer: state.userReducer,
});

const CreateVideoDeck = connect(mapStateToProps, { })(
  _CreateVideoDeck
);

export default CreateVideoDeck;
