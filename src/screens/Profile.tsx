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
  Modal,
} from "react-native";
import bg1 from "../assets/screenBg/bg1.png";
import profileBg from "../assets/profile/profileBg.png";
import profileNoBgImg from "../assets/common/noImg/profileNoBgImg.png"
import profileNoImg from "../assets/common/noImg/profileNoImg.png"
import mediaDeckNoImg from "../assets/common/noImg/mediaDeckNoImg.png"
import videoDeckNoImg from "../assets/common/noImg/videoDeckNoImg.png"
import inProgressActiveBtn from "../assets/btns/inProgressActiveBtn.png"
import inProgressBtn from "../assets/btns/inProgressBtn.png"
import mydeckActiveBtn from "../assets/btns/mydeckActiveBtn.png"
import mydeckBtn from "../assets/btns/mydeckBtn.png"
import savedDeckActiveBtn from "../assets/btns/savedDeckActiveBtn.png"
import savedDeckBtn from "../assets/btns/savedDeckBtn.png"
import coverMask from '../assets/deck/coverMask.png'
import limitBg from '../assets/screenBg/limitBg.png'
import addDeckLimitImg from '../assets/screenBg/addDeckLimitImg.png'
import closeIcon from '../assets/screenBg/closeIcon.png'
import upgradeBtn from '../assets/screenBg/upgradeMBtn.png'
import { connect } from "react-redux";
import { ApplicationState , OnUpdateUserData} from "../redux";
import { NavigationScreenProp } from "react-navigation";
import BottomNavigator from "./component/BottomNavigator";
import addIcon from '../assets/common/addIcon.png'
import { MaterialIcons } from '@expo/vector-icons';
import cardDeck from "../assets/common/cardDeck.png";
import jojo from "../assets/common/jojo.png";
import videoDeckImg from "../assets/common/videoDeckImg.png"
import Slider from '@react-native-community/slider';

import { useFonts, Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { Lato_700Bold } from "@expo-google-fonts/lato";
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

import { scaleX, scaleY } from "../core/theme/dimensions";
import { getFirestore, addDoc, doc, getDoc,  collection,updateDoc, onSnapshot, query, where} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import uuid from "uuid";
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import ContentCreatorProfile from "./contentCreatorProfile";
import { useRoute, useIsFocused } from '@react-navigation/native';
import moment from 'moment'

const totalStars = 5;
const WIDTH_DEVICE = Dimensions.get("window").width;

interface Props {
  navigation: NavigationScreenProp<any, any>;
  userReducer: any;
  isSavePlayDeck: any
}


const _Profile: React.FC<Props> = (props: Props) => {
  const route:any = useRoute();
  const userId = route.params?.userId;
  const isFocused = useIsFocused();

  const [selectedTab, setSelectedTab] = useState('mydecks')
  const [mediaDeckList, setMediaDeckList] = useState<any>([])
  const [videoDeckList, setVideoDeckList] = useState<any>([])
  const [userOnlyMediaDeckList, setUserOnlyMediaDeckList] = useState<any>([])
  const [userOnlyVideoDeckList, setUserOnlyVideoDeckList] = useState<any>([])
  const [curUserData, setCurUserData] = useState<any>({})
  const [curUserId, setCurUserId] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedImgUrl, setSelectedImageUrl] = useState('')
  const [deckDataIndex, setDeckDataIndex] = useState(0)
  const [userProgressMediaDeckList, setUserProgressMediaDeckList] = useState<any>([])
  const [userProgressVideoDeckList, setUserProgressVideoDeckList] = useState<any>([])
  const [userSavedMediaDeckList, setUserSavedMediaDeckList] = useState<any>([])
  const [userSavedVideoDeckList, setUserSavedVideoDeckList] = useState<any>([])
  const [dataLoaded, setDataLoaded] = useState(false)
  const [todayCreatedDeckCount, setTodayCreatedDeckCount] = useState(0)
  const [showLimitModal, setShowLimitModal] = useState(false)
  const [todayPlayDeckCount, setTodayPlayDeckCount] = useState(0)

  useEffect(() => {    
    if(userId) {
      const firestore = getFirestore()    
      getDoc(doc(firestore, 'Users', userId))
      .then((userData:any) => {       
        const userDetail:any = userData?.data()     
        setCurUserData(userDetail)        
        setDataLoaded(true)
        if(userDetail?.userType !== 'contentCreator') {
          getUserDecks(userId)
          getUserOnlyDeck(userId, userDetail)
          getUserProgressDeck(userId)
          getUserSavedDeck(userId) 
        }         
      })   
    }
    else {
      props.userReducer?.then((userData:any)=>{      
        setCurUserData(userData?.curUser)
        setCurUserId(userData?.userId)
        setDataLoaded(true)
        if(userData.curUser?.userType !== 'contentCreator') {
          getUserDecks(userData?.userId)
          getUserOnlyDeck(userData?.userId, userData?.curUser)
          getUserProgressDeck(userData?.userId)
          getUserSavedDeck(userData?.userId)
          if(userData.curUser?.userType === 'free') {
            getTodayCeatedDeckCount(userData?.userId)
          }          
        }      
      })
    }
    
    props.userReducer?.then((userData:any)=>{    
      if(userData?.curUser?.userType === 'free') {
        getTodayPlayDeckCount(userData?.userId)
      }     
    })
  }, [props?.userReducer, userId]);  

  const getTodayPlayDeckCount = (userId:string) => {
    const firestore = getFirestore()  
    let todayMomentIndex = moment().startOf('day').valueOf()
    onSnapshot(doc(firestore, "Users", userId, "everyDayPlayDeckCount", todayMomentIndex+''), (playDeckCountData:any) => {
      let playDeckCountDetail = playDeckCountData.data()
      if(playDeckCountDetail) {
        setTodayPlayDeckCount(playDeckCountDetail?.playDeckCount)
      }
    })
  }

  const getTodayCeatedDeckCount = (userId:string) => {
    const firestore = getFirestore()  
    let todayMomentIndex = moment().startOf('day').valueOf()
    onSnapshot(doc(firestore, "Users", userId, "everyDayCreatedDeckCount", todayMomentIndex+''), (deckCountData:any) => {
      let deckCountDetail = deckCountData.data()
      if(deckCountDetail) {
        setTodayCreatedDeckCount(deckCountDetail?.createdCount)
      }
    })
  }

  const getUserSavedDeck = (userId: string) => {
    const firestore = getFirestore()    
    onSnapshot(collection(firestore, "Users", userId, 'SavedDecks'), (querySnapshot) => {      
      let userSavedMediaDecks:any[] = []
      let userSavedVideoDecks:any[] = []
      querySnapshot.docs.map(async(progressDeckData) => {  
        await getDoc(doc(firestore, 'Decks', progressDeckData?.id))
              .then((deckData:any) => {     
                if(deckData.data())   {
                  const deckItem:any = deckData?.data()         
                  getDoc(doc(firestore, "Users", deckItem?.userId))
                  .then((user:any) => {
                    if(user.data()) {
                      let userData = user.data()
                      let newData = {
                        ...deckData.data(),
                        uid: deckData?.id,
                        userData: userData,
                        isSavedDeck: true,
                      }
                      if(deckData?.data()?.isCardDeck) {
                        userSavedMediaDecks.push(newData)
                        setUserSavedMediaDeckList(userSavedMediaDecks)
                      }
                      else {
                        userSavedVideoDecks.push(newData)
                        setUserSavedVideoDeckList(userSavedVideoDecks)
                      }    
                    }
                  })
                }          
              })        
      }); 
    });
  }

  const getUserProgressDeck = (userId: string) => {
    const firestore = getFirestore()    
    onSnapshot(collection(firestore, "Users", userId, 'InProgressDecks'), (querySnapshot) => {      
      let userProgressMediaDecks:any[] = []
      let userProgressVideoDecks:any[] = []
      querySnapshot?.docs.map(async(progressDeckData) => {       
        let deckItem = progressDeckData?.data()
        if(deckItem?.isUserOnlyDeck) {
          await getDoc(doc(firestore, "Users", userId, 'Decks', progressDeckData?.id))
          .then((deckData:any) => {
            if(deckData.data()) {
              let newData = {
                ...deckData?.data(),
                uid: deckData?.id,
                playPercent: deckItem?.playPercent,
                playCardCount: deckItem?.playCardCount,
              }
              if(deckData?.data()?.isCardDeck) {
                userProgressMediaDecks.push(newData)
              }
              else {
                userProgressVideoDecks.push(newData)
              }    
            }            
          })
        }
        else {
          await getDoc(doc(firestore, 'Decks', progressDeckData?.id))
              .then((deckData:any) => {
                if(deckData.data()) {
                  let newData = {
                    ...deckData?.data(),
                    uid: deckData?.id,
                    playPercent: deckItem?.playPercent,
                    playCardCount: deckItem?.playCardCount,
                  }
                  if(deckData?.data()?.isCardDeck) {
                    userProgressMediaDecks.push(newData)
                  }
                  else {
                    userProgressVideoDecks.push(newData)
                  }           
                }
              })
        }        
        setUserProgressMediaDeckList(userProgressMediaDecks)
        setUserProgressVideoDeckList(userProgressVideoDecks)
      }); 
    });
  }
  const getUserOnlyDeck = (userId:string, curUser:any) => {
    if(curUser?.userType !== 'contentCreator') {
      const firestore = getFirestore()    
      onSnapshot(collection(firestore, "Users", userId, 'Decks'), (querySnapshot) => {
        let userOnlyMediaDeckList:any[] = []
        let userOnlyVideoDeckList:any[] = []
        querySnapshot.docs.map((doc) => {       
          let deckItem = doc?.data()
          let newData = {
            ...doc.data(),
            uid: doc?.id,
            isUserOnlyDeck: true
          }
          if(deckItem?.isCardDeck) {
            userOnlyMediaDeckList.push(newData)
          }
          else {
            userOnlyVideoDeckList.push(newData)
          }        
        });      
        setUserOnlyMediaDeckList(userOnlyMediaDeckList)
        setUserOnlyVideoDeckList(userOnlyVideoDeckList)
        
      });
    }
  }
  
  const getUserDecks = (userId:string) => {
    const firestore = getFirestore()    
    console.log(userId)
    onSnapshot(query(collection(firestore, 'Decks') , where('userId', '==' , userId)), (querySnapshot) => {
      let mediaDeckList:any[] = []
      let videoDeckList:any[] = []
      querySnapshot.docs.map((doc) => {       
        let deckItem = doc?.data()
        let newData = {
          ...doc.data(),
          uid: doc.id,
          isUserOnlyDeck: false
        }
        if(deckItem?.isCardDeck) {
          mediaDeckList.push(newData)
        }
        else {
          videoDeckList.push(newData)
        }        
      });      
      setMediaDeckList(mediaDeckList)
      setVideoDeckList(videoDeckList)   
    });
  };

  const handleNavigate = (screen: string): void => {
    props.navigation.navigate(screen);
  };

  const gotoAddDeck = () => {
    
    if((curUserData?.userType === 'free') && todayCreatedDeckCount > 0) {
      setShowLimitModal(true)
    }
    else {
      handleNavigate('selectdeckType')
    }
  }

  const resizeImg = async (result:any, targetWidth: number) => {
    const manipResult = await manipulateAsync(
      result.uri,
      [{resize: {width: targetWidth}}],
      {format: SaveFormat.JPEG}
    )
    const fileInfo:any = await FileSystem.getInfoAsync(manipResult.uri)
    if(fileInfo.size > 75000) {
      console.log(targetWidth ,'targetwidth')
      resizeImg(result, targetWidth - 50)
    }
    else {
      console.log(manipResult,'manipResult')
      setSelectedImageUrl(manipResult?.uri)
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

    if (!result?.cancelled) {
      resizeImg(result, 600)
    }
  };
  
  const handleImagePicked = async (pickerResult:any) => {
    let profileUserId = userId ?  userId : curUserId
    try {
      setLoading(true)
      const profileBg = await uploadImageAsync(pickerResult?.uri);       
      const firestore = getFirestore();
      updateDoc(doc(firestore, "Users", profileUserId), {
        profileBg,
      })
      .then(() => {         
        curUserData['profileBg'] = profileBg    
        setCurUserData(curUserData)
        setSelectedImageUrl(profileBg)
        setLoading(false)
        if((userId === curUserId) || !userId) {
          OnUpdateUserData(curUserData, curUserId)
        }        
        
      })
      .catch((e) => {
          console.log(e)
      });
      console.log('image uploaded successfully')
    
    } catch (e) {
      console.log(e);
      // alert("Upload failed, sorry :(");
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

  const centeralIconClicked = (deckDetailData:any, deckId:any) => {
    if((curUserData?.userType === 'free') && (todayPlayDeckCount > 0) && (deckDetailData?.uid !== curUserId)) {
      setShowLimitModal(true)
    }
    else {
      props.navigation.navigate('playDeck', {deckDetailData, deckId})
    }
  }

  const renderItem = ({ item, index }: { item: any, index: number }) => (
    <TouchableOpacity style={[styles.item, index == 0 && styles.firstItem]} 
          key={item.uid}
          onPress={() => { props.navigation.navigate('deckDetailFromProfile', {deckId: item.uid, isUserOnlyDeck: item.isUserOnlyDeck, userId: item?.userId}) }} >
      <ImageBackground
        source={item.deckImgUrl ? {uri: item.deckImgUrl} : mediaDeckNoImg}
        resizeMode="cover"
        style={styles.deckItemBg}
        imageStyle={[{ borderRadius: scaleX(11), height: scaleX(145), flex: 1 },
          item.level === 'beginner' ? styles.beginnerBorder :
          item.level === 'intermediate' ? styles.intermediateBorder:
          styles.premiumBorder]} >
       
        <View style={styles.starContainer}>
        {
          !item?.isUserOnlyDeck &&

          <View style={styles.starContent}>
            {
              Array.from({ length: item?.ratingVal }, (x, i) => {
                return (
                  <MaterialIcons key={i} name="star" size={scaleX(16)} color="#FFCA45" />
                )
              })
            }
            {
              Array.from({ length: totalStars - item?.ratingVal }, (x, i) => {
                return (
                  <MaterialIcons key={i} name="star-border" size={scaleX(16)} color="#FFCA45" />
                )
              })
            }
          </View>
            }
        </View>
       
        <View style={styles.deckcardBottomView}>
          {
            item?.isSavedDeck ? 
            <Image source={item?.userData?.profileImg ? {uri: item?.userData?.profileImg} : profileNoImg} style={styles.profileImg} />
            : <Image source={curUserData?.profileImg ? {uri: curUserData.profileImg} : profileNoImg} style={styles.profileImg} />
          }          
          <Text style={styles.deckItemTitle}>{item.title}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  const renderVideoDeckItem = ({ item, index }: { item: any, index: number }) => (
    <TouchableOpacity style={[styles.videoDeckitem, index == 0 && styles.firstItem]} 
        key={item.uid}
        onPress={() => { props.navigation.navigate('videoDeckDetailFromProfile', {deckId: item.uid, isUserOnlyDeck: item.isUserOnlyDeck, userId: item?.userId}) }}>
      <ImageBackground
        source={item?.deckImgUrl ? {uri: item?.deckImgUrl} : videoDeckNoImg}
        resizeMode="cover"
        style={styles.deckItemBg}
        imageStyle={[{ borderRadius: scaleX(20), height: scaleX(214), flex: 1 },
          item.level === 'beginner' ? styles.beginnerBorder :
          item.level === 'intermediate' ? styles.intermediateBorder:
          styles.premiumBorder]} >
       <ImageBackground source={coverMask} style={styles.deckItemBg}   
                imageStyle={[{ borderRadius: scaleX(20), height: scaleX(170), flex: 1, marginHorizontal: scaleX(3)}]}>  
        <View style={styles.starContainer}>
          {
          !item?.isUserOnlyDeck &&
          <View style={styles.starContent}>
            {
              Array.from({ length: item?.ratingVal }, (x, i) => {
                return (
                  <MaterialIcons key={i} name="star" size={scaleX(28)} color="#FFCA45" />
                )
              })
            }
            {
              Array.from({ length: totalStars - item?.ratingVal }, (x, i) => {
                return (
                  <MaterialIcons key={i} name="star-border" size={scaleX(28)} color="#FFCA45" />
                )
              })
            }
          </View>
          } 
        </View>
        <View style={styles.videoDeckTitleContent}>
          <Text style={styles.videDeckTitleTxt}>{item?.title}</Text>
        </View>
      </ImageBackground>
        <View style={styles.videoDeckcardBottomView}>
          <View style={styles.leftSection}>
          {
            item?.isSavedDeck ? 
            <Image source={item?.userData?.profileImg ? {uri: item?.userData?.profileImg} : profileNoImg} style={styles.profileImg} />
            : <Image source={curUserData?.profileImg ? {uri: curUserData.profileImg} : profileNoImg} style={styles.profileImg} />
          }          
            <View style={styles.leftTextSection}>
              <View style={styles.nameAndIcon}>
                <Text style={styles.profileName}>{item?.isSavedDeck ? item?.userData?.firstName : curUserData?.firstName}</Text>
                {/* <Image source={profileCheckIcon} style={styles.profileCheckIcon} /> */}
              </View>
              <Text style={styles.flashcardCount}>{item.cards?.length} Flashcards</Text>
            </View>
          </View>
          {/* <TouchableOpacity onPress={()=>console.log('pressed')} style={styles.profileBtn}>
                <Text style={styles.profileTxt}>{'Profile'}</Text>
              </TouchableOpacity>               */}
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  const renderInProgressDecks = (isMediaDeck:boolean) => {
    let renderProgressDecks = isMediaDeck ? userProgressMediaDeckList : userProgressVideoDeckList
    return (
      renderProgressDecks?.map((item: any, index: number) => {
        return (
          <TouchableOpacity 
              onPress={() => centeralIconClicked(item, item?.uid)}
              style={styles.inprogressItem} 
              key={index}>
            <Image source={{uri: item.deckImgUrl}} style={styles.inprogressDeckImg} />
            <View style={styles.inprogressItemContent}>
              <View style={styles.titleAndCardsCount}>
                <Text style={styles.inprogressDeckTitle} numberOfLines={1} ellipsizeMode='tail' >{item?.title}</Text>
                <Text style={styles.cardCount}>{item?.playCardCount + '/' + item?.cards?.length} Cards</Text>
              </View>
              <Text style={styles.deckType}> {item?.deckType}</Text>
              <View style={styles.cardsProgressBar}>
                <View style={styles.overloadView} />
                <Slider
                  style={styles.progressSlider}
                  minimumValue={0}
                  maximumValue={100}
                  disabled={true}
                  value={item.playCardCount ? item.playCardCount * 100 / item?.cards?.length : 0}
                  minimumTrackTintColor={'#ffc542'}
                  maximumTrackTintColor={'#465063'}
                  thumbTintColor={'#ffc54258'}
                />
                <MaskedView
                  style={styles.maskViewContainer}
                  maskElement={
                    <View
                      style={styles.maskViewContent}
                    >
                      <Text style={styles.progressPercentTxt}>{Math.round(item?.playCardCount * 100 / item?.cards?.length) + '%'}</Text>
                    </View>
                  }
                >
                  <LinearGradient
                    colors={['#FFF960', '#FF8C22']}
                    start={{ x: 0.4, y: 0 }}
                    end={{ x: 0.45, y: 1 }}
                    style={{ flex: 1 }}
                  />
                </MaskedView>
              </View>
            </View>
          </TouchableOpacity>
        )
      })
    )
  }


  let [fontsLoaded] = useFonts({
    Montserrat_700Bold, Montserrat_600SemiBold, Montserrat_500Medium, Montserrat_400Regular,
    Inter_500Medium, Inter_700Bold,
    Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold,
    Lato_700Bold
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <View style={styles.container}>
      {curUserData?.userType ==='contentCreator' && dataLoaded ?
      <ContentCreatorProfile navigation={props.navigation} userId={userId? userId: curUserId} fromProfile={true}/>
      :
      <ImageBackground source={bg1} resizeMode="cover" style={styles.mainImgBg}>
        <ScrollView style={styles.contentContainer}>
          {curUserData?.profileBg ? 
          <ImageBackground source={{uri: curUserData?.profileBg}} resizeMode="cover" style={styles.profileBgImg} />
          : <TouchableOpacity onPress={()=> pickImage()}>
              <ImageBackground source={selectedImgUrl ? {uri: selectedImgUrl} : profileNoBgImg} resizeMode="cover" style={styles.profileBgImg} />
              {loading && <ActivityIndicator style={styles.indicatorStyle}/>}
          </TouchableOpacity>
          }
          
          <View style={styles.mainContent}>
            <View>
              <Image source={curUserData?.profileImg ? {uri: curUserData?.profileImg} : profileNoImg} style={styles.bigProfileImg} />
            </View>
            <View style={styles.titleContainer}>
              <View style={styles.titleWithIcon}>
                <Text style={styles.profileTitle}>{curUserData?.firstName}</Text>
              </View>
            </View>
            <View style={[styles.rowContent, styles.tabbtnCotainer]}>
              <TouchableOpacity
                onPress={() => setSelectedTab('mydecks')}
                style={[styles.rowContent, styles.tabBtn]}>
                <Image source={selectedTab == 'mydecks' ? mydeckActiveBtn : mydeckBtn} style={styles.mydeckBtn} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSelectedTab('inprogress')}
                style={[styles.rowContent, styles.tabBtn]}>
                <Image source={selectedTab == 'inprogress' ? inProgressActiveBtn : inProgressBtn} style={styles.inProgressBtn} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSelectedTab('savedDecks')}
                style={[styles.rowContent, styles.tabBtn]}>
                <Image source={selectedTab == 'savedDecks' ? savedDeckActiveBtn : savedDeckBtn} style={styles.savedDeckBtn} />
              </TouchableOpacity>
            </View>
            {selectedTab == 'mydecks' &&
              <View>
                <View style={styles.deckListContent}>
                  <Text style={styles.deckTitle}>Card Decks</Text>
                  <View style={styles.deckList}>
                    <FlatList
                      nestedScrollEnabled
                      data={mediaDeckList.concat(userOnlyMediaDeckList)}
                      renderItem={renderItem}
                      horizontal={true}
                      keyExtractor={item => item.uid}
                      style={{ height: scaleX(160) }}
                    />
                  </View>
                </View>
                <View style={[styles.deckListContent, styles.videoDeckListContent]}>
                  <Text style={styles.deckTitle}>Video Decks</Text>
                  <View style={styles.deckList}>
                    <FlatList
                      nestedScrollEnabled
                      data={videoDeckList.concat(userOnlyVideoDeckList)}
                      renderItem={renderVideoDeckItem}
                      horizontal={true}
                      keyExtractor={item => item.uid}
                      style={{ height: scaleX(235) }}
                    />
                  </View>
                </View>
              </View>
            } 
            {selectedTab == 'inprogress' &&
              <View>
                <Text style={styles.inprogressTitle}>Card Decks</Text>
                <View style={styles.cardDeckContainer}>
                  {renderInProgressDecks(true)}
                </View>
                <Text style={styles.inprogressTitle}>Video Decks</Text>
                <View  style={styles.cardDeckContainer}>
                  {renderInProgressDecks(false)}
                </View>
              </View>
            }
            {selectedTab == 'savedDecks' &&
              <View>
                {(userSavedMediaDeckList?.length + userSavedVideoDeckList?.length) > 0 ?
                  <View>
                    <View style={styles.deckListContent}>
                      <Text style={styles.deckTitle}>Card Decks</Text>
                      <View style={styles.deckList}>
                        <FlatList
                          nestedScrollEnabled
                          data={userSavedMediaDeckList}
                          renderItem={renderItem}
                          horizontal={true}
                          keyExtractor={item => item.uid}
                          style={{ height: scaleX(160) }}
                        />
                      </View>
                    </View>
                    <View style={[styles.deckListContent, styles.videoDeckListContent]}>
                      <Text style={styles.deckTitle}>Video Decks</Text>
                      <View style={styles.deckList}>
                        <FlatList
                          nestedScrollEnabled
                          data={userSavedVideoDeckList}
                          renderItem={renderVideoDeckItem}
                          horizontal={true}
                          keyExtractor={item => item.uid}
                          style={{ height: scaleX(235) }}
                        />
                      </View>
                    </View>
                  </View>
                  :
                  <View style={styles.emptyDeckContent}>
                    <Text style={styles.emptyDeckTitle}>
                      You haven’t saved any decks yet.
                    </Text>
                    <Text style={styles.emptyDeckSubTitle}>
                      It is easy to do, let’s get started.
                    </Text>
                  </View>
                }
              </View>
            }
          </View>
          
        </ScrollView>        
      </ImageBackground>
      }
      <Modal
        animationType="slide"
        transparent={true}
        visible={showLimitModal}>
          <ImageBackground source={limitBg} resizeMode="cover" style={styles.mainImgBg}>
            <TouchableOpacity 
              onPress={()=>setShowLimitModal(false)}
              style={styles.limitModalCloseBtn}>
              <Image source={closeIcon} style={styles.closeIcon} />
            </TouchableOpacity>
            <View style={styles.centerContainer}>
              <Image source={addDeckLimitImg} style={styles.playDeckLimitImgStyle} />
              <Text style={styles.limitTitle}>You have reached your limit</Text>
              <Text style={styles.limitSubTitle}>To increase the number of decks you can create, and have access to our premium AI voice feature please consider upgrading your account</Text>
              <TouchableOpacity 
                onPress={()=>{setShowLimitModal(false); handleNavigate('upgradeAccount')}}
                style={styles.upgradeBtn}
                >
                <Image source={upgradeBtn} style={styles.upgradeBtnImg} />
              </TouchableOpacity>
            </View>
          </ImageBackground>
      </Modal>
      <TouchableOpacity onPress={()=> gotoAddDeck()} style={styles.actionContainer} >
          <Image source={addIcon} style={styles.actionIcon} />
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({  
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  mainImgBg: {
    flex: 1,
    resizeMode: 'cover',
  },
  titleWithBack: {
    flexDirection: "row",
    alignItems: 'center'
  },
  profileBgImg: {
    height: scaleX(228),
    resizeMode: 'cover'
  },
  mainContent: {
    padding: scaleX(20),
    paddingTop: scaleX(0),
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
    flexDirection: 'row'
  },
  titleWithIcon: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: scaleX(20),
    marginTop: scaleX(18),
  },
  profileTitle: {
    fontSize: scaleX(24),
    fontWeight: '700',
    lineHeight: scaleX(35),
    color: '#ffffff',
    paddingRight: scaleX(10),
    fontFamily: 'Montserrat_700Bold'
  },
  bigProfileCheckIcon: {
    width: scaleX(24),
    height: scaleX(23),
    resizeMode: 'contain'
  },
  socialBtnContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
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
    marginHorizontal: scaleX(11),
    width: scaleX(122),
    height: scaleX(145),
    borderRadius: scaleX(11),
  },
  videoDeckitem: {
    marginVertical: scaleX(8),
    marginHorizontal: scaleX(11),
    width: scaleX(279),
    height: scaleX(214),
    borderRadius: scaleX(20),
  },
  firstItem: {
    marginLeft: scaleX(20),
    marginRight: scaleX(11),
  },
  title: {
    fontSize: scaleX(32),
  },
  starContainer: {
    justifyContent: 'flex-end',
    alignItems: "flex-end",
    alignSelf: 'flex-end',
    paddingTop: scaleX(8),
    paddingRight: scaleX(4),
  },
  starContent: {
    flexDirection: "row",
    backgroundColor: '#131215BF',
    paddingRight: scaleX(3),
    paddingLeft: scaleX(3),
    borderRadius: scaleX(24),
  },
  deckcardBottomView: {
    flexDirection: 'row',
    backgroundColor: '#482C7E66',
    padding: scaleX(4),
    alignItems: 'center',
    height: scaleX(42),
    margin: scaleX(3),
    borderBottomLeftRadius: scaleX(8),
    borderBottomRightRadius: scaleX(8),
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
    // height: scaleX(34),
    width: scaleX(78),
    marginLeft: scaleX(6),
    fontFamily: 'Poppins_600SemiBold'
  },
  deckItemBg: {
    flex: 1,
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
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
    lineHeight: scaleX(17),
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
  },
  rowContent: {
    // flex: 1,
    // minWidth: 110,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  tabbtnCotainer: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: scaleX(34),
  },
  tabBtn: {
    justifyContent: 'center'
  },
  tabTxt: {
    fontSize: scaleX(14),
    fontWeight: '500',
    lineHeight: scaleX(19.8),
    color: '#A0A0AB',
    textAlign: 'center',
    fontFamily: 'Poppins_500Medium',
  },
  activeTabColor: {
    color: '#FFF960'
  },
  inprogressItem: {
    flexDirection: 'row',
    marginTop: scaleX(18),
    padding: scaleX(15),
    borderRadius: scaleX(14),
    backgroundColor: '#1D1B21'
  },
  inprogressDeckImg: {
    width: scaleX(55),
    height: scaleX(55),
    resizeMode: 'cover',
    borderRadius: scaleX(12),
  },
  inprogressItemContent: {
    marginLeft: scaleX(17),
    flex: 1,
  },
  titleAndCardsCount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  inprogressDeckTitle: {
    fontSize: scaleX(18),
    fontWeight: '600',
    lineHeight: scaleX(27),
    color: 'white',
    maxWidth: WIDTH_DEVICE - scaleX(225),
    fontFamily: 'Poppins_600SemiBold'
  },
  cardCount: {
    fontSize: scaleX(14),
    fontWeight: '700',
    lineHeight: scaleX(19),
    color: '#6B7488',
    fontFamily: 'Poppins_700Bold'
  },
  deckType: {
    fontSize: scaleX(14),
    fontWeight: '600',
    lineHeight: scaleX(19),
    color: '#6B7488',
    fontFamily: 'Poppins_600SemiBold'
  },
  cardsProgressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: scaleX(178),
    position: 'relative',
  },
  overloadView: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 12
  },
  progressPercentTxt: {
    fontSize: scaleX(12),
    fontWeight: '700',
    lineHeight: scaleX(16),
    color: '#ffc542',
    fontFamily: 'Lato_700Bold'
  },
  progressSlider: {
    flex: 4,
    marginLeft: scaleX(-10),
  },
  inprogressTitle: {
    fontSize: scaleX(23),
    fontWeight: '700',
    lineHeight: scaleX(33.5),
    color: '#ffffff',
    marginTop: scaleX(32),
    fontFamily: 'Poppins_700Bold'
  },
  cardDeckContainer: {
    minHeight: scaleX(160),
  },
  emptyDeckContent: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyDeckTitle: {
    marginTop: scaleX(74),
    fontSize: scaleX(26),
    lineHeight: scaleX(31),
    fontWeight: '600',
    textAlign: 'center',
    color: '#F4F4F4',
    fontFamily: 'Montserrat_600SemiBold'
  },
  emptyDeckSubTitle: {
    marginTop: scaleX(21),
    fontSize: scaleX(18),
    lineHeight: scaleX(22),
    fontWeight: '600',
    textAlign: 'center',
    color: '#968FA4',
    maxWidth: scaleX(247),
    marginBottom: scaleX(80),
    fontFamily: 'Montserrat_600SemiBold'
  },
  maskViewContainer: {
    flex: 1,
    flexDirection: 'row',
    height: '100%',
  },
  maskViewContent: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red'
  },
  mydeckBtn: {
    width: scaleX(99),
    height: scaleX(32),
    resizeMode: 'contain'
  },
  inProgressBtn: {
    width: scaleX(104),
    height: scaleX(32),
    resizeMode: 'contain'
  },
  savedDeckBtn: {
    width: scaleX(116),
    height: scaleX(32),
    resizeMode: 'contain'
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
  indicatorStyle: {
    position: 'absolute',
    top: scaleX(180),
    left: scaleX(210)
  },
  playDeckLimitImgStyle: {
    marginTop: scaleY(41),
    width: scaleY(318),
    height: scaleY(406),
    resizeMode: 'contain',
  },
  limitModalCloseBtn: {
    position: 'absolute',
    top: scaleY(35),
    right: scaleY(30),
    zIndex: 222
  },
  closeIcon: {
    width: scaleY(30),
    height: scaleY(30),
    resizeMode: 'contain'
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  limitTitle: {
    marginTop: scaleY(20),
    fontSize: scaleY(30),
    lineHeight: scaleY(45),
    maxWidth: scaleY(280),
    fontFamily: 'Poppins_700Bold',
    fontWeight: '700',
    color: '#EFEBF6',
    textAlign:'center'
  },
  limitSubTitle: {
    marginTop: scaleY(51),
    fontSize: scaleY(18),
    lineHeight: scaleY(27),
    maxWidth: scaleY(400),
    fontFamily: 'Poppins_500Medium',
    fontWeight: '500',
    color: '#E3E1E7',
    textAlign:'center'
  },
  upgradeBtn: {
    // marginTop: scaleY(37),
    maxWidth: scaleY(414),
  },
  upgradeBtnImg: {
    width: scaleY(414),
    height: scaleY(220),
    resizeMode: 'contain'
  },
});

const mapStateToProps = (state: ApplicationState) => ({
  userReducer: state.userReducer,
  isSavePlayDeck: state.isSavePlayDeck
});

const Profile = connect(mapStateToProps, {OnUpdateUserData})(
  _Profile
);

export default Profile;
