import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ImageBackground,
  ActivityIndicator
} from "react-native";
import mainBg from "../assets/mainBg.png";
import profileBg from "../assets/profile/profileBg.png";
import profileImg from "../assets/common/jojo.png"
import profileCheckIcon from "../assets/common/profileCheckIcon.png"
import ticktokIcon from "../assets/users/social/tiktokIcon.png"
import youtubuIcon from "../assets/users/social/youtubuIcon.png"
import twitterIcon from "../assets/users/social/twitterIcon.png"
import instagramIcon from "../assets/users/social/instagramIcon.png"
import patreonIcon from "../assets/users/social/patreonIcon.png"
import websiteIcon from "../assets/users/social/websiteIcon.png"
import { connect } from "react-redux";
import {ApplicationState, OnUpdateUserData} from "../redux";
import { NavigationScreenProp } from "react-navigation";
import { useIsFocused, useRoute } from '@react-navigation/native';
import addIcon from '../assets/common/addIcon.png'
import { MaterialIcons } from '@expo/vector-icons'; 
import ReadMore from '@fawazahmed/react-native-read-more';
import cardDeck from "../assets/common/cardDeck.png";
import jojo from "../assets/common/jojo.png";
import  videoDeckImg from "../assets/common/videoDeckImg.png"
import backwithBg from '../assets/common/backwithBg.png'
import cProfileNobgImg from "../assets/common/noImg/cProfileNobgImg.png"
import profileNoImg from "../assets/common/noImg/profileNoImg.png"
import mediaDeckNoImg from "../assets/common/noImg/mediaDeckNoImg.png"
import videoDeckNoImg from "../assets/common/noImg/videoDeckNoImg.png"
import seeMoreBtn from "../assets/profile/seeMoreBtn.png"
import profileDeleteBtn from "../assets/profile/profileDeleteBtn.png"
import profileEditBtn from "../assets/profile/profileEditBtn.png"
import coverMask from '../assets/deck/coverMask.png'
import upgradeBtn from "../assets/btns/upgradeBtn.png"
import shadowUpgradeIcon from "../assets/common/shadowUpgradeIcon.png"
import { useFonts,  Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold} from '@expo-google-fonts/montserrat';
import {Inter_500Medium, Inter_700Bold} from '@expo-google-fonts/inter';
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";
import TopBarLeftArrow from "./component/TobBarLeftArrow";
import { scaleX } from "../core/theme/dimensions";
import { getFirestore, addDoc, doc, getDoc,  collection,updateDoc, onSnapshot, query, where, deleteDoc, getDocs} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import * as WebBrowser from 'expo-web-browser';
import CustomModal from "./component/CustomModal";
import creatorImg from '../assets/common/creatorImg.png'
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import uuid from "uuid";
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
const totalStars = 5;

interface Props {
  navigation: NavigationScreenProp<any, any>;
  userReducer: any;
  userId: string;
  fromProfile: boolean;
}

const _ContentCreatorProfile: React.FC<Props> = (props: Props) => {  
  const route:any = useRoute();
  const userId  = route.params?.userId ? route.params.userId: props?.userId;
  const isFocused = useIsFocused()
  const [mediaDeckList, setMediaDeckList] = useState<any>([])
  const [videoDeckList, setVideoDeckList] = useState<any>([])
  const [curUserData, setCurUserData] = useState<any>({})
  const [logedinUserData, setLogedinUserData] = useState<any>({})
  const [curUserId, setCurUserId] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedImgUrl, setSelectedImageUrl] = useState('')
  const [totalCardCount, setTotalCardCount] = useState(0)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showManageBtns, setShowManageBtns] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [activeManageBtn, setActiveManageBtn] = useState('')

  useEffect(() => {    
    props.userReducer?.then((userData:any)=>{
      console.log(userData,'========')
      setIsAdmin(userData?.curUser?.isAdmin)
      setCurUserId(userData?.userId)
      if(!route.params?.userId || route.params?.userId === userData?.userId) {
        setCurUserData(userData?.curUser)
      }
      setLogedinUserData(userData?.curUser);
    })
  }, [props.userReducer]);

  useEffect(() => { 
    console.log(userId,'userId==========', route.params?.userId)
    const firestore = getFirestore()  
    if(userId) {
      getDoc(doc(firestore, "Users", userId))
      .then((user:any) => {
        setCurUserData(user?.data())
      })
      .catch((e) => {
          console.log(e)
      });   
    }
  }, [userId])

  useEffect(() => {    
    const firestore = getFirestore()  
    onSnapshot(query(collection(firestore, 'Decks') , where('userId', '==' , userId)), (querySnapshot) => {
      let mediaDeckList:any[] = []
      let videoDeckList:any[] = []
      let totalCardCount:any = 0
      querySnapshot.docs.map((doc) => {       
        let deckItem = doc?.data()
        let newData:any = {
          ...doc?.data(),
          uid: doc?.id,

        }
        totalCardCount += newData?.cards?.length
        if(deckItem?.isCardDeck) {
          mediaDeckList.push(newData)
        }
        else {
          videoDeckList.push(newData)
        }        
      });
      setTotalCardCount(totalCardCount)
      setMediaDeckList(mediaDeckList)
      setVideoDeckList(videoDeckList)
    });
   setActiveManageBtn('')
  }, [isFocused, userId]);

  const handleNavigate = (screen: string): void => {
    props.navigation.navigate(screen);
  };

  const gotoAddDeck = () => {
    handleNavigate('selectdeckType')
  } 

  const renderItem = ({ item, index} : {item: any, index:number}) => (
    <TouchableOpacity 
      style={styles.item} 
      onPress={()=>{props.navigation.navigate('deckDetailFromProfile', {deckId: item?.uid})}}
      key={index}>
      <ImageBackground 
        source={item?.deckImgUrl ? {uri: item?.deckImgUrl} : mediaDeckNoImg}
        resizeMode="cover"      
        style={styles.deckItemBg}   
        imageStyle={[{ borderRadius: scaleX(11), height: scaleX(145), flex: 1},
          item.level === 'beginner' ? styles.beginnerBorder :
          item.level === 'intermediate' ? styles.intermediateBorder:
          styles.premiumBorder]} >
         
            <View style={styles.starContainer}>
              <View style={styles.starContent}>
                {
                  Array.from({length: item?.ratingVal}, (x, i) => {
                  return(
                    <MaterialIcons key={i} name="star" size={16} color="#FFCA45"/>
                  )
                  })
                }
                {
                  Array.from({length: totalStars-item?.ratingVal}, (x, i) => {
                  return(
                    <MaterialIcons key={i} name="star-border" size={16} color="#FFCA45" />
                  )
                  })
                }
              </View>
            </View>
            <View style={styles.deckcardBottomView}>
              <Image source={curUserData?.profileImg ? {uri: curUserData.profileImg} : profileNoImg}  style={styles.profileImg} />
              <Text style={styles.deckItemTitle}>{item?.title}</Text>
            </View>   
            {(logedinUserData?.userType == 'free' && curUserId !== item?.userId && !item?.isPublic) &&
              <View style={[styles.upgradeBtnContainer]}>     
                <ImageBackground source={shadowUpgradeIcon}     
                   resizeMode="contain"  
                   style={styles.shadowUpgradeImg}>                  
                  <TouchableOpacity style={styles.upgradeBtn} onPress={()=> handleNavigate('upgradeAccount')}>
                    <Image source={upgradeBtn} style={styles.upgradeBtnIcon} />
                  </TouchableOpacity>
                </ImageBackground>
              </View>
            }
      </ImageBackground>
    </TouchableOpacity>
  );

  const renderVideoDeckItem = ({ item, index} : {item: any, index:number}) => (
    <TouchableOpacity style={styles.videoDeckitem} 
      onPress={()=>{props.navigation.navigate('videoDeckDetailFromProfile', {deckId: item?.uid})}}
      key={index}>
      <ImageBackground 
        source={item?.deckImgUrl ? {uri: item.deckImgUrl} : videoDeckNoImg}
        resizeMode="cover"      
        style={styles.deckItemBg}   
        imageStyle={[{ borderRadius: scaleX(20), height: scaleX(214), flex: 1},
          item.level === 'beginner' ? styles.beginnerBorder :
          item.level === 'intermediate' ? styles.intermediateBorder:
          styles.premiumBorder]} >    
          <ImageBackground source={coverMask} style={styles.deckItemBg}   
                imageStyle={[{ borderRadius: scaleX(20), height: scaleX(170), flex: 1, marginHorizontal: scaleX(3)}]}>       
            <View style={styles.starContainer}>
              <View style={styles.starContent}>
                {
                  Array.from({length: item?.ratingVal}, (x, i) => {
                  return(
                    <MaterialIcons key={i} name="star" size={28} color="#FFCA45"/>
                  )
                  })
                }
                {
                  Array.from({length: totalStars-item?.ratingVal}, (x, i) => {
                  return(
                    <MaterialIcons key={i} name="star-border" size={28} color="#FFCA45" />
                  )
                  })
                }
              </View>
            </View>
            <View style={styles.videoDeckTitleContent}>
              <Text style={styles.videDeckTitleTxt}>{item?.title}</Text>
            </View>
          </ImageBackground>
            <View style={styles.videoDeckcardBottomView}>
              <View style={styles.leftSection}>
                <Image source={curUserData?.profileImg ? {uri: curUserData.profileImg} : profileNoImg}  style={styles.vieoDeckProfileImg} />
                <View style={styles.leftTextSection}>
                  <View style={styles.nameAndIcon}>
                    <Text style={styles.profileName}>{curUserData?.firstName}</Text>
                    <Image source={profileCheckIcon} style={styles.profileCheckIcon} />
                  </View>
                  <Text style={styles.flashcardCount}>{item?.cards?.length} Flashcards</Text>
                </View>
              </View>
              {/* <TouchableOpacity onPress={()=>console.log('pressed')} style={styles.profileBtn}>
                <Text style={styles.profileTxt}>{'Profile'}</Text>
              </TouchableOpacity>               */}
            </View>   
            {(logedinUserData?.userType == 'free' && curUserId !== item?.userId && !item?.isPublic) &&
                <View style={[styles.upgradeBtnContainer, styles.videoDeckUpgradeContainer]}>   
                  <ImageBackground source={shadowUpgradeIcon}     
                   resizeMode="cover"  
                   style={styles.shadowUpgradeImg}     >               
                    <TouchableOpacity style={styles.upgradeVideoBtn} onPress={()=> handleNavigate('upgradeAccount')}>
                      <Image source={upgradeBtn} style={styles.upgradeVideoBtnIcon} />
                    </TouchableOpacity>
                  </ImageBackground>
                </View>
              }  
      </ImageBackground>
    </TouchableOpacity>
  );

  const rednerDeleteModalTxtContent = () => {
    return (
      <View style={styles.modalTxtContent}>
        <Text style={styles.modalContentTxt}>
          Are you sure you want to permanently 
          <Text style={[styles.modalContentTxt, styles.delColorTxt]}> delete </Text>
          this creator?
        </Text>        
      </View>
    )
  }

 
  const deleteContentUser = async() => {
    
    setLoading(true)
    const firestore = getFirestore()
    const functions = getFunctions()    
    
    const deleteUser = httpsCallable(functions, 'deleteUser')  ;
    
    deleteUser({uid: userId})
      .then((result) => {
        deleteDoc(doc(firestore, 'Users', userId))
        .then(() => {
          getDocs(query(collection(firestore, 'Decks') , where('userId', '==' , userId)))
          .then((docData) => {
              docData?.docs?.map(async(delDoc:any, index: number) => {
                await deleteDoc(doc(firestore, 'Decks', delDoc?.id))
                .then(() => {
                  if(docData?.docs?.length == index + 1) {
                    setLoading(false)
                    setDeleteModalVisible(false)
                    props.navigation.navigate('home')
                  }
                })
              })
          })
          .catch((e) => {
            setLoading(false)
            setDeleteModalVisible(false)
            console.log(e,'error')
          })
          
        })
        .catch((e) => {
          setLoading(false)
          console.log(e,'delete deck error')
        })
      })
   
    
  }

  const cancelDelete = () => {
    setDeleteModalVisible(false)
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
      resizeImg(result, 600)
    }
  };
  
  const handleImagePicked = async (pickerResult:any) => {
    try {
      setLoading(true)
      const profileBg = await uploadImageAsync(pickerResult.uri);       
      const firestore = getFirestore();
      updateDoc(doc(firestore, "Users", userId), {
        profileBg,
      })
      .then(() => {         
        curUserData['profileBg'] = profileBg    
        setCurUserData(curUserData)
        setSelectedImageUrl(profileBg)
        setLoading(false)
        if(userId === curUserId) {
          OnUpdateUserData(curUserData, userId)
        }
      })
      .catch((e) => {
          console.log(e)
      });
      console.log('image uploaded successfully')
    
    } catch (e) {
      console.log(e, profileBg);
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

  const openWebBrowser = async(link: string) => {
    if(!link.includes('http')){
      link = 'http://' + link
    }
    await WebBrowser.openBrowserAsync(link)
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
       
          <TouchableOpacity onPress={()=> pickImage()} disabled={curUserData?.profileBg || curUserId !== userId}>
            <ImageBackground 
              source={curUserData?.profileBg ? {uri:  curUserData?.profileBg } : cProfileNobgImg} 
              resizeMode="cover" style={styles.profileBgImg}>
              <View style={styles.titleWithBack}>
                {props?.fromProfile ? <View/> :
                <TouchableOpacity onPress={()=>props.navigation.navigate('home')} >
                  <Image source={backwithBg} style={styles.backwithBg} />                
                </TouchableOpacity>
                }
                {isAdmin && 
                <View style={styles.mngBtnWrapper}>
                  <TouchableOpacity onPress={()=>setShowManageBtns(!showManageBtns)} >
                    <Image source={seeMoreBtn} style={styles.seeMoreBtnStyle} />
                  </TouchableOpacity>
                  {showManageBtns &&
                    <View style={styles.mngBtnContainer}>
                      <TouchableOpacity style={[styles.adminEditBtn, activeManageBtn ==='delete' && styles.removeBtn]} 
                        onPress={()=>{setActiveManageBtn('edit'); setShowManageBtns(!showManageBtns); props.navigation.navigate('userProfile', { userId})}} >
                        <Image source={profileEditBtn} style={styles.cardDetailEditIcon} />
                        <Text style={styles.adminManageBtnTxt} >Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.adminEditBtn, activeManageBtn ==='delete' && styles.removeBtn]} onPress={()=>{setActiveManageBtn('delete'); setShowManageBtns(!showManageBtns); setDeleteModalVisible(true)}} >
                        <Image source={profileDeleteBtn} style={styles.cardDetailEditIcon} />
                        <Text style={styles.adminManageBtnTxt} >Delete</Text>
                        {loading && <ActivityIndicator />}
                      </TouchableOpacity>
                    </View>
                  }
                </View>
                }
              </View>
            </ImageBackground>
          </TouchableOpacity>
          <View style={styles.mainContent}>
            <View>
              <Image source={curUserData?.profileImg ? {uri: curUserData.profileImg} : profileNoImg} style={styles.bigProfileImg} />
            </View>
            <View style={styles.titleContainer}>
              <View style={styles.titleWithIcon}>
                <Text style={styles.profileTitle} numberOfLines={1}>{curUserData?.firstName}</Text>                
                <Image source={profileCheckIcon} style={styles.bigProfileCheckIcon} />
              </View>
              <View style={styles.socialBtnContainer}>
                {curUserData?.tiktokUrl &&
                <TouchableOpacity 
                  onPress={() => openWebBrowser(curUserData?.tiktokUrl)} 
                  >
                  <Image source={ticktokIcon} style={styles.socialIcon} />
                </TouchableOpacity>
                }
                {curUserData?.youtubuUrl &&
                <TouchableOpacity 
                  onPress={() => {openWebBrowser(curUserData?.youtubuUrl)}} 
                  >
                  <Image source={youtubuIcon} style={styles.socialIcon} />
                </TouchableOpacity>
                }
                {curUserData?.twitterUrl &&
                <TouchableOpacity 
                  onPress={() => openWebBrowser(curUserData?.twitterUrl)} 
                  >
                  <Image source={twitterIcon} style={styles.socialIcon} />
                </TouchableOpacity>
                }
                {curUserData?.patrionUrl &&
                <TouchableOpacity 
                  onPress={() => openWebBrowser(curUserData?.patrionUrl)} 
                  >
                  <Image source={patreonIcon} style={styles.socialIcon} />
                </TouchableOpacity>
                }
                {curUserData?.instagramUrl &&
                <TouchableOpacity 
                  onPress={() => openWebBrowser(curUserData?.instagramUrl)} 
                  >
                  <Image source={instagramIcon} style={styles.socialIcon} />
                </TouchableOpacity>
                }
                {curUserData?.websiteUrl &&
                <TouchableOpacity 
                  onPress={() => openWebBrowser(curUserData?.websiteUrl)} 
                  >
                  <Image source={websiteIcon} style={styles.socialIcon} />
                </TouchableOpacity>
                }
              </View>
            </View>
            <View>
              <Text style={styles.followersTxt} >
                {totalCardCount} Flashcards
              </Text>
              <View style={styles.readMoreContainer}>
                <ReadMore 
                  numberOfLines={3} 
                  seeMoreStyle={styles.seeMoreStyle}
                  seeLessStyle={styles.seeMoreStyle}
                  style={styles.readMoreTxt}>
                 {curUserData?.bio}
                </ReadMore>
              </View>    
            </View>
            <View style={styles.deckListContent}>
              <Text style={styles.deckTitle}>Card Decks</Text>
              <View style={styles.deckList}>
                <FlatList
                    nestedScrollEnabled 
                    data={mediaDeckList}
                    renderItem={renderItem}
                    horizontal={true}
                    keyExtractor={item => item?.uid}
                    style={{height: scaleX(164)}}
                  />
              </View>
            </View>
            <View style={[styles.deckListContent, styles.videoDeckListContent]}>
              <Text style={styles.deckTitle}>Video Decks</Text>
              <View style={styles.deckList}>
                  <FlatList
                    nestedScrollEnabled 
                    data={videoDeckList}
                    renderItem={renderVideoDeckItem}
                    horizontal={true}
                    keyExtractor={item => item?.uid}
                    style={{height: scaleX(235)}}
                  />
              </View>            
            </View>
          </View>
        </ScrollView>

        <CustomModal 
          modalVisible={deleteModalVisible} 
          modalIcon={creatorImg}
          isRating={false}
          ratingVal={0}
          renderModalTxtContent={rednerDeleteModalTxtContent}
          modalSubTxt='You can’t undo this action.'
          primaryBtnTxt={'Delete'}
          cancelBtnTxt={'Cancel'}
          primaryAction={deleteContentUser}
          cancelAction={cancelDelete}
        />
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
  },
  mainImgBg: {
    flex: 1,
    resizeMode: 'cover',
  },
  titleWithBack: {
    flexDirection: "row",
    // alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: scaleX(40),
    marginLeft: scaleX(24),
    marginRight: scaleX(24)
  },
  backwithBg: {
    width: scaleX(49),
    height: scaleX(49),
    resizeMode: 'contain',
  },
  profileBgImg: {
    height: scaleX(228),
    resizeMode: 'cover'
  },
  mainContent: {
    padding: scaleX(20),
    paddingTop: 0,
    marginTop: scaleX(-50),
  },
  bigProfileImg: {
    width: scaleX(94),
    height: scaleX(94),
    resizeMode: 'cover',
    borderRadius: scaleX(60),
    borderWidth: scaleX(7),
    borderColor: '#1C152A'
  },
  titleContainer: {
    flexDirection: 'row',
    marginTop: scaleX(18),
  },
  titleWithIcon: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: scaleX(20),
  },
  profileTitle: {
    fontSize: scaleX(24),
    fontWeight: '700',
    lineHeight: scaleX(35),
    color: '#ffffff',
    paddingRight: scaleX(10),
    fontFamily: 'Montserrat_700Bold',
    maxWidth: scaleX(180),
  },
  bigProfileCheckIcon: {
    width: scaleX(24),
    height: scaleX(23),
    resizeMode: 'contain'
  },
  socialBtnContainer: {
    flex: 1,
    flexDirection: 'row',
    maxWidth: scaleX(180),
    overflow: 'hidden'
  },
  socialIcon: {
    width: scaleX(40), 
    height: scaleX(40),
    marginHorizontal: scaleX(10),
    resizeMode: 'contain'
  },
  followersTxt: {
    fontSize: scaleX(18),
    fontWeight: '600',
    lineHeight: scaleX(26),
    color: '#FFCE47',
    fontFamily: 'Montserrat_600SemiBold'
  },
  readMoreContainer: {
    marginTop: scaleX(7),
  },
  readMoreTxt: {
    fontSize: scaleX(14),
    fontWeight: '400',
    lineHeight: scaleX(22),
    color: '#FFFFFF',
    paddingBottom: scaleX(20),
    fontFamily: 'Poppins_400Regular'
  },
  seeMoreStyle: {
    color: '#FFCE47',
    fontFamily: 'Poppins_600SemiBold'
  },
  
  deckListContent: {
    marginTop: scaleX(32),
    marginRight: scaleX(-20),
    marginLeft: scaleX(-20)
  },
  videoDeckListContent: {
    paddingBottom: scaleX(100)
  },
  deckTitle: {
    fontSize: scaleX(23),
    fontWeight: '700',
    lineHeight: scaleX(33.5),
    color: 'white',
    fontFamily: 'Montserrat_700Bold',
    marginLeft: scaleX(20)
  },
  deckList: {
    marginTop: scaleX(24),
  },  
  item: {
    marginVertical: scaleX(8),
    marginHorizontal: scaleX(16),
    width: scaleX(122),
    height: scaleX(145),
    borderRadius: scaleX(11),
  },
  videoDeckitem: {
    marginVertical: scaleX(8),
    marginHorizontal: scaleX(16),
    width: scaleX(279),
    height: scaleX(214),
    borderRadius: scaleX(11),
  },
  title: {
    fontSize: scaleX(32),
  },
  starContainer: {
    justifyContent: 'flex-end',
    alignItems : "flex-end",
    alignSelf: 'flex-end',
    paddingTop: scaleX(8),
    paddingRight: scaleX(4),
  },
  starContent: {
    flexDirection : "row",    
    backgroundColor: '#131215BF',
    paddingRight: scaleX(3),
    paddingLeft: scaleX(3),
    borderRadius: scaleX(24),
  },
  deckcardBottomView: {
    flexDirection: 'row',
    backgroundColor: '#482C7E66',
    padding: scaleX(4),
    margin: scaleX(3),
    alignItems:'center',
    borderBottomLeftRadius: scaleX(8),
    borderBottomRightRadius: scaleX(8),
    height: scaleX(42),
  },
  videoDeckcardBottomView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#392364',
    justifyContent: 'space-between',
    padding: scaleX(17),
    margin: scaleX(3),
    borderBottomLeftRadius: scaleX(17),
    borderBottomRightRadius: scaleX(17),
  },
  profileImg: {
    width: scaleX(24),
    height: scaleX(24),
    resizeMode: 'cover',
    borderRadius: scaleX(12),
  },
  vieoDeckProfileImg: {
    width: scaleX(35),
    height: scaleX(35),
    resizeMode: 'cover',
    borderRadius: scaleX(20),
  },
  deckItemTitle: {
    fontSize: scaleX(12),
    fontWeight: '600',
    lineHeight: scaleX(16),
    color: 'white',
    width: scaleX(78),
    marginLeft: scaleX(4),
    fontFamily: 'Poppins_600SemiBold'
  },
  deckItemBg: {
    flex:1,
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection:'row',
    alignItems: 'center'
  },
  leftTextSection: {
    marginLeft: scaleX(10),
  },
  profileName: {
    fontSize: scaleX(16),
    lineHeight: scaleX(23),
    fontWeight: '600',
    marginRight: scaleX(5),
    color: 'white',
    fontFamily: 'Montserrat_600SemiBold'
  },
  profileCheckIcon: {
    width: scaleX(19),
    height: scaleX(18),
    resizeMode: 'contain'
  },
  nameAndIcon: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  flashcardCount: {
    fontSize: scaleX(12),
    fontWeight: '500',
    lineHeight: 17,
    color: '#CAC5D6',
    fontFamily: 'Montserrat_500Medium'
  },
  profileBtn: {
    backgroundColor: '#38C3FF',
    borderRadius: scaleX(24),
  },
  profileTxt: {
    fontSize: scaleX(13),
    lineHeight: scaleX(19),
    fontWeight: '700',
    color: '#ffffff',
    paddingTop: scaleX(6),
    paddingBottom: scaleX(6),
    paddingLeft: scaleX(17),
    paddingRight: scaleX(17),
  },
  bottomNavbarIconContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
    position: 'relative'
  },
  bottomNavbarIcon: {
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor:'red',
    position: 'absolute',
    // bottom: -30,
    zIndex: 2222,
    marginBottom: scaleX(-30)
  },
  videoDeckTitleContent: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingLeft: scaleX(13),
  },
  videDeckTitleTxt: {
    minHeight: scaleX(40),
    maxWidth: scaleX(140),
    marginBottom: scaleX(10),
    color: '#F1EEF8',
    fontSize: scaleX(14),
    lineHeight: scaleX(20),
    fontWeight: '700',
    fontFamily: 'Montserrat_700Bold'
  },
  rowContent: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
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
  beginnerBorder: {
    borderWidth: scaleX(3),
    borderColor: '#5ADBED',
  }, 
  intermediateBorder: {
    borderWidth: scaleX(3),
    borderColor: '#FFBE36',
  } ,
  premiumBorder: {
    borderWidth: scaleX(3),
    borderColor: '#F260FF',
  },
  mngBtnContainer: {
    marginTop: scaleX(5),
    minWidth: scaleX(117),
    borderRadius: scaleX(4),
    overflow:'hidden'
  },
  seeMoreBtnStyle: {
    width: scaleX(46), 
    height: scaleX(46), 
    resizeMode: "contain"
  },
  mngBtnWrapper: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  cardDetailEditIcon: {
    width: scaleX(18), 
    height: scaleX(18), 
    marginRight: scaleX(12),
    resizeMode: "contain"
  },
  adminEditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scaleX(10),
    paddingHorizontal: scaleX(13),
    backgroundColor: '#1C152A'
  },
  removeBtn: {
    backgroundColor: '#5ADBED'
  },
  adminManageBtnTxt: {
    fontFamily: 'Montserrat_500Medium',
    fontWeight: '500',
    fontSize: scaleX(14),
    lineHeight: scaleX(20),
    color: 'white',
  },
  modalTxtContent: {
    justifyContent: 'center',
    maxWidth: scaleX(200),
  },
  modalContentTxt: {
    fontSize: scaleX(14),
    fontWeight: '500',
    lineHeight: scaleX(17),    
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Montserrat_500Medium'
  },
  delColorTxt: {
    color: '#FF517B',
    fontWeight: '700',
    fontFamily: 'Montserrat_700Bold'
  },
  successColorTxt: {
    color: '#64FF86'
  },  
  upgradeBtnContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    zIndex: 22,
    borderRadius: scaleX(11),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#131215A6',
    padding: scaleX(4),
  },
  videoDeckUpgradeContainer: {
    borderRadius: scaleX(20),
  },
  upgradeBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',    
    paddingVertical: scaleX(6),
    paddingHorizontal: scaleX(16),
    borderRadius: scaleX(20),
    maxWidth: scaleX(122),
  },
  upgradeBtnIcon: {
    width: scaleX(113),
    height: scaleX(33.7),
    resizeMode: 'contain'
  },
  upgradeBtnTxt: {
    fontSize: scaleX(12),
    fontWeight: '700',
    lineHeight: scaleX(17),
    color: 'white',
    paddingLeft: scaleX(11),
  },
  upgradeVideoBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',    
    paddingVertical: scaleX(10),
    paddingHorizontal: scaleX(26),
    borderRadius: scaleX(30),
    // maxWidth: scaleX(279),
  },
  upgradeVideoBtnIcon: {
    width: scaleX(183),
    height: scaleX(55),
    resizeMode: 'contain'
  },
  upgradeVideoBtnTxt: {
    fontSize: scaleX(18),
    fontWeight: '700',
    lineHeight: scaleX(26),
    color: 'white',
    paddingLeft: scaleX(18),
  },
  shadowUpgradeImg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderRadius: scaleX(11),    
  },
});

const mapStateToProps = (state: ApplicationState) => ({
  userReducer: state.userReducer,
  isSavePlayDeck: state.isSavePlayDeck
});

const ContentCreatorProfile = connect(mapStateToProps, { OnUpdateUserData})(
  _ContentCreatorProfile
);

export default ContentCreatorProfile;
