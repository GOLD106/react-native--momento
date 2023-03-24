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
  TextInput,
  Modal,
} from "react-native";
import mainBg from "../assets/mainBg.png";
import searchIcon from "../assets/common/searchIcon.png";
import searchSettingIcon from "../assets/common/searchSettingIcon.png"
import cardDeck from "../assets/common/cardDeck.png";
import profileNoImg from "../assets/common/noImg/profileNoImg.png";
import mediaDeckNoImg from "../assets/common/noImg/mediaDeckNoImg.png";
import videoDeckNoImg from "../assets/common/noImg/videoDeckNoImg.png";
import  videoDeckImg from "../assets/common/videoDeckImg.png"
import profileCheckIcon from "../assets/common/profileCheckIcon.png"
import searchItemActiveIcon from "../assets/common/searchItemActiveIcon.png"
import searchItemIcon from "../assets/common/searchItemIcon.png"
import upgradeBtn from "../assets/btns/upgradeBtn.png"
import shadowUpgradeIcon from "../assets/common/shadowUpgradeIcon.png"
import searchLialogListIcon from '../assets/common/searchLialogListIcon.png'
import unlockFeature from "../assets/common/unlockFeature.png"
import { NavigationScreenProp } from "react-navigation";
import { MaterialIcons } from '@expo/vector-icons'; 
import { connect } from "react-redux";
import {ApplicationState, OnUpdateUserData} from "../redux";
import { useRoute , useIsFocused} from '@react-navigation/native';
import BottomNavigator from "./component/BottomNavigator";
import coverMask from '../assets/deck/coverMask.png'
import saerchBg from '../assets/btns/saerchBg.png'
import { useFonts, Montserrat_700Bold , Montserrat_500Medium, Montserrat_600SemiBold} from '@expo-google-fonts/montserrat';
import {Inter_500Medium, Inter_700Bold} from '@expo-google-fonts/inter';
import { Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { scaleX } from "../core/theme/dimensions";
import { getFirestore, addDoc, doc, getDoc,  collection,updateDoc, onSnapshot, query, where} from 'firebase/firestore';
import moment from "moment";

const totalStars = 5;

interface Props {
  navigation: NavigationScreenProp<any, any>;
  userReducer: any;
  OnUpdateUserData: Function;
}

const WIDTH_DEVICE = Dimensions.get("window").width;


const _Home: React.FC<Props> = (props: Props) => { 

  const isFocused = useIsFocused();

  const [showSearchModal, setShowSearchModal] = useState(false)
  const [searchActiveItem, setSearchActiveItem] = useState('')
  const [selectedMediaSearchItem, setSelectedMediaSearchItem] = useState('')
  const [selectedVideoSearchItem, setSelectedVideoSearchItem] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [mediaDeckList, setMediaDeckList] = useState<any>([])
  const [videoDeckList, setVideoDeckList] = useState<any>([])
  const [deckList, setDeckList] = useState<any>([])
  const [catList, setCatList] = useState<any>([])
  const [cardCatList, setCardCatList] = useState<any>([])
  const [videoCatList, setVideoCatList] = useState<any>([])
  const [searchTxt, setSearchTxt] = useState('')
  const [curUserId, setCurUserId] = useState('')
  const [curUser, setCurUser] = useState<any>([])
  const [deckDataIndex, setDeckDataIndex] = useState(0)

  useEffect(() => {    
    props.userReducer?.then((userData:any)=>{ 
      setCurUserId(userData?.userId)
      setCurUser(userData?.curUser)
      if(userData?.curUser?.subscription) {
        console.log(userData.curUser.subscription, moment(userData.curUser.subscription.current_period_end),'###sub')
      }
    })
  }, [props.userReducer, isFocused]);

  useEffect(() => {
    const firestore = getFirestore() 
    props.userReducer?.then((userData:any)=>{ 
      const unsub = onSnapshot(doc(firestore, "Users", userData?.userId), (user:any) => {        
        let curUser =  user.data();
        if(curUser) {
          props.OnUpdateUserData(curUser, userData?.userId)
        }
      })
    })
  }, [])

  useEffect(() => {     
      const firestore = getFirestore() 
      onSnapshot(collection(firestore, 'Decks'), (querySnapshot) => {
        let mediaDeckList:any = []
        let videoDeckList:any = []
        let deckList: any = []
        console.log("creator removed ")
        querySnapshot.docs.map(async (snapDoc, index) => {       
          let deckItem = snapDoc.data()
          deckList.push(deckItem)
          setDeckList(deckList)
          await getDoc(doc(firestore, "Users", deckItem?.userId))
          .then((user:any) => {
            let userData = user.data()
            let newData = {
              ...snapDoc.data(),
              uid: snapDoc.id,
              userName: userData?.firstName,
              profileImg: userData?.profileImg,
              isUserOnlyDeck: false,
            }
            if(!deckItem?.isCardDeck) {
              videoDeckList.push(newData)              
            }
            else {
              mediaDeckList.push(newData)              
            }      
          })   
          setVideoDeckList(videoDeckList)  
          setMediaDeckList(mediaDeckList)   
          setDeckDataIndex(index)
        }) 
       
      });

      onSnapshot(collection(firestore, 'Category'), (querySnapshot) => {
        let catList:any[] = []
        let cardCatList:any[] = []
        let videoCatList:any[] = []
        querySnapshot.docs.map(async (snapDoc) => {   
          let catItem = snapDoc.data()
          let newData = {
            ...snapDoc.data(),
            uid: snapDoc.id,
          }
          if(catItem.catType == 'video') {
            videoCatList.push(newData)
          }
          else {
            cardCatList.push(newData)
          }
          catList.push(newData)
        })    
        setCatList(catList)    
        setCardCatList(cardCatList)
        setVideoCatList(videoCatList)
      });          
  },[]);

  

  const handleNavigate = (screen: string): void => {
    props.navigation.navigate(screen);
  };
  
  const renderItem = ({ item, index} : {item: any, index:number}) => (
    <View>
      {((selectedMediaSearchItem == '' || selectedMediaSearchItem == item.deckType) && item?.title?.toLowerCase()?.includes(searchTxt.toLowerCase())) &&
    <TouchableOpacity style={[styles.item, index==0 && styles.firstItem]} 
      disabled={(curUser.userType == 'free' &&  !item.isPublic)}
      onPress={()=>{props.navigation.navigate('deckDetail', {deckId: item.uid, isUserOnlyDeck: item.isUserOnlyDeck})}} key={index}>      
      <ImageBackground 
        source={item.deckImgUrl ? {uri: item.deckImgUrl} : mediaDeckNoImg} 
        resizeMode="cover"      
        style={styles.deckItemBg}   
        imageStyle={[{ borderRadius: scaleX(11), height: scaleX(145), flex: 1},
          item.level === 'beginner' ? styles.beginnerBorder :
          item.level === 'intermediate' ? styles.intermediateBorder:
          styles.premiumBorder]} >
         
            <View style={styles.starContainer}>
              <View style={styles.starContent}>
                {
                  Array.from({length: item.ratingVal}, (x, i) => {
                  return(
                    <MaterialIcons key={i} name="star" size={scaleX(16)} color="#FFCA45"/>
                  )
                  })
                }
                {
                  Array.from({length: totalStars-item.ratingVal}, (x, i) => {
                  return(
                    <MaterialIcons key={i} name="star-border" size={scaleX(16)} color="#FFCA45" />
                  )
                  })
                }
              </View>
            </View>
            <View style={styles.deckcardBottomView}>
              <Image source={item.profileImg ? {uri: item.profileImg} : profileNoImg}  style={styles.profileImg} />
              <Text style={styles.deckItemTitle}>{item.title}</Text>
            </View>   
            {(curUser.userType == 'free' && curUserId !== item.userId && !item.isPublic) &&
              <View style={[styles.upgradeBtnContainer]}>     
                <ImageBackground source={shadowUpgradeIcon}     
                   resizeMode="contain"  
                   style={styles.shadowUpgradeImg}     >                  
                  <TouchableOpacity style={styles.upgradeBtn} onPress={()=> handleNavigate('upgradeAccount')}>
                    <Image source={upgradeBtn} style={styles.upgradeBtnIcon} />
                  </TouchableOpacity>
                </ImageBackground>
              </View>
            }
      </ImageBackground>
    </TouchableOpacity>
}
    </View>
  );

  const renderVideoDeckItem = ({ item, index } : {item: any, index: number}) => (
    <View>
      {((selectedVideoSearchItem == '' || selectedVideoSearchItem == item.deckType) && item?.title?.toLowerCase()?.includes(searchTxt?.toLowerCase())) &&
      <TouchableOpacity style={[styles.videoDeckitem, index ==0 && styles.firstItem]} 
          disabled={(curUser.userType == 'free' &&  !item.isPublic)}
          onPress={()=>{props.navigation.navigate('videoDeckDetail', {deckId: item.uid, isUserOnlyDeck: item.isUserOnlyDeck})}} key={index}>
        <ImageBackground 
          source={item.deckImgUrl ? {uri: item.deckImgUrl} : videoDeckNoImg} 
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
                      Array.from({length: item.ratingVal}, (x, i) => {
                      return(
                        <MaterialIcons key={i} name="star" size={scaleX(28)} color="#FFCA45"/>
                      )
                      })
                    }
                    {
                      Array.from({length: totalStars-item.ratingVal}, (x, i) => {
                      return(
                        <MaterialIcons key={i} name="star-border" size={scaleX(28)} color="#FFCA45" />
                      )
                      })
                    }
                  </View>
                </View>
                <View style={styles.videoDeckTitleContent}>
                  <Text style={styles.videDeckTitleTxt}>{item.title}</Text>
                </View>
            </ImageBackground>
              <View style={styles.videoDeckcardBottomView}>
                <View style={styles.leftSection}>
                  <Image source={item.profileImg ? {uri: item.profileImg,  cache: "force-cache" } : profileNoImg} style={styles.vieoDeckProfileImg} />
                  <View style={styles.leftTextSection}>
                    <View style={styles.nameAndIcon}>
                      <Text style={styles.profileName}>{item.userName}</Text>
                      <Image source={profileCheckIcon} style={styles.profileCheckIcon} />
                    </View>
                    <Text style={styles.flashcardCount}>{item.cards?.length} Flashcards</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={()=>
                     item.userId === curUserId ? props.navigation.navigate('profiletab')  
                   : props.navigation.navigate('creatorProfile', { userId: item.userId })
                  }
                  style={styles.profileBtn}>
                  <Text style={styles.profileTxt}>{'Profile'}</Text>
                </TouchableOpacity>              
              </View> 

              {(curUser.userType == 'free' && curUserId !== item.userId && !item.isPublic) &&
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
      }
    </View>
  );

  const handleChangeSearchCat = (catName:string, isCard: boolean) => {
    if(isCard) {
      if(catName === selectedMediaSearchItem) {
        setSelectedMediaSearchItem('')
      }
      else {
        setSelectedMediaSearchItem(catName)
      }
    }
    else {
      if(catName === selectedVideoSearchItem) {
        setSelectedVideoSearchItem('')
      }
      else {
        setSelectedVideoSearchItem(catName)
      }
    }
   
  }

  const renderSearchListContent = (isCard:boolean) => {
    let arryList = isCard ? cardCatList : videoCatList
    return (
      arryList.map((item:any, index:any) => {
        return (
          <TouchableOpacity 
            onPress={() => handleChangeSearchCat(item.catName, isCard)}
            style={[styles.searchListItem, (selectedMediaSearchItem == item.catName || selectedVideoSearchItem == item.catName) && styles.selectedItem]} key={index}>
            <View style={styles.itemTextContainer}>
              <Text style={[styles.searchItemTitle, (selectedMediaSearchItem == item.catName || selectedVideoSearchItem == item.catName) && styles.selectedItemTxt]}>{item.catName}</Text>
              <Text style={[styles.searchItemDeckCount, (selectedMediaSearchItem == item.catName || selectedVideoSearchItem == item.catName) && styles.selectedItemTxt]}>
                {deckList.filter((obj:any) => obj.deckType === item.catName).length} Decks
              </Text>
            </View>
            <View style={styles.itemImgContainer}>
              <Image source={(selectedMediaSearchItem == item.catName || selectedVideoSearchItem == item.catName) ? searchItemActiveIcon : searchItemIcon} style={styles.searchItemIcon} />
            </View>
          </TouchableOpacity>
        )
      })
    )
  }

  let [fontsLoaded] = useFonts({
    Montserrat_700Bold, Montserrat_600SemiBold, Montserrat_500Medium, 
    Inter_500Medium, Inter_700Bold, 
    Poppins_400Regular, Poppins_700Bold, Poppins_600SemiBold
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={mainBg} resizeMode="cover" style={styles.mainImgBg}>
        <ScrollView style={styles.contentContainer}>  
          <Text style={styles.headerTxt}>A better way to study Japanese</Text>
          <View style={styles.searchContent}>
            <ImageBackground source={saerchBg} resizeMode="cover" style={styles.searchContentGradient}>
              <TouchableOpacity onPress={()=>setShowSearchModal(true)}>
                <Image source={searchIcon} style={styles.searchIcon} />
              </TouchableOpacity>
              <TextInput 
                value={searchTxt}
                onChangeText={(txt) => setSearchTxt(txt)}
                placeholder="Search" 
                placeholderTextColor={'#968FA4'}
                style={styles.searchTxt}/>
                <TouchableOpacity onPress={()=>setShowSearchModal(true)}>
                  <Image source={searchSettingIcon} style={styles.searchSettingIcon} />
                </TouchableOpacity>
            </ImageBackground>
          </View>
          <View style={styles.deckListContent}>
            <Text style={styles.deckTitle}>Card Decks</Text>
            <View style={styles.deckList}>
              <FlatList
                  nestedScrollEnabled 
                  data={mediaDeckList}
                  renderItem={renderItem}
                  horizontal={true}
                  keyExtractor={item => item.uid}
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
                  keyExtractor={item => item.uid}
                  style={{height: scaleX(235)}}
                />
            </View>            
          </View>
        </ScrollView>
        <Modal
            animationType="slide"
            transparent={true}
            visible={showSearchModal}
            onRequestClose={() => {
              setShowSearchModal(false);
            }}
          >
          <View style={styles.searchModalContainer}>        
            <TouchableOpacity onPress={()=> setShowSearchModal(false)} style={styles.modalOutBtn}    />
            <View style={styles.searchModalContent}>
              <TouchableOpacity style={styles.closeModalContainer} onPress={()=>setShowSearchModal(false)}>
                <Image source={searchLialogListIcon} style={styles.closeDialogIcon} />
              </TouchableOpacity>              
              <View style={styles.searchModalScrollContainer}>
                <Text style={styles.searchModalTitle}>Find the perfect deck</Text>
                <ScrollView style={styles.container}>
                  <View style={styles.searchScrollContainer}>
                    <Text style={[styles.deckTitle, {marginVertical: scaleX(37)}]}>Card Decks</Text>
                    {renderSearchListContent(true)}                    
                    <Text style={[styles.deckTitle, {marginBottom: scaleX(37)}]}>Video Decks</Text>
                    {renderSearchListContent(false)}
                  </View>   
                </ScrollView>   
                
                </View>   
                {curUser.userType == 'free' && 
                  <View style={[styles.upgradeBtnContainer, styles.searchContainerUpgradeBtn]}>          
                      <TouchableOpacity style={styles.upgradeBtn} onPress={()=> {setShowSearchModal(false); handleNavigate('upgradeAccount')}}>
                        <Image source={unlockFeature} style={styles.unlockFeatureBtn} />
                      </TouchableOpacity>
                  </View>
                }          
            </View>
            
          </View>
        </Modal>
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
    paddingTop: scaleX(25), 
    // paddingLeft: scaleX(25),    
    paddingBottom: scaleX(80),
  },
  mainImgBg: {
    flex: 1,
    resizeMode: 'cover',
  },
  headerTxt: {
    marginTop: scaleX(55),
    color: 'white',
    fontSize: scaleX(30),
    lineHeight: scaleX(39),
    fontWeight: '700',
    maxWidth: scaleX(280),
    fontFamily: 'Montserrat_700Bold',
    paddingLeft: scaleX(25),    
  },
  searchContent: {
    display: 'flex',
    borderWidth: scaleX(1.2),
    borderColor: '#968FA4',
    borderRadius: scaleX(13),
    marginTop: scaleX(32),
    marginRight: scaleX(25),
    overflow: 'hidden',     
    marginLeft: scaleX(25),    
  },
  searchContentGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: scaleX(20),
  },
  searchIcon : {
    width: scaleX(23.5),
    height: scaleX(23.5),
    resizeMode: 'contain'
  },
  searchTxt: {
    flex: 1,
    marginLeft: scaleX(17),
    marginRight: scaleX(17),
    fontSize: scaleX(20),
    color: '#968FA4'
  },
  searchSettingIcon: {
    width: scaleX(29.6),
    height: scaleX(29.6),
    resizeMode: 'contain'
  },
  deckListContent: {
    marginTop: scaleX(32),
  },
  videoDeckListContent: {
    paddingBottom: scaleX(100),
  },
  deckTitle: {
    fontSize: scaleX(23),
    fontWeight: '700',
    lineHeight: scaleX(33.5),
    color: 'white',
    fontFamily: 'Montserrat_700Bold',
    paddingLeft: scaleX(25),    
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
  firstItem: {
    marginLeft: scaleX(25),
    marginRight: scaleX(11),    
  },
  videoDeckitem: {
    marginVertical: scaleX(8),
    marginHorizontal: scaleX(11),
    width: scaleX(279),
    height: scaleX(214),
    borderRadius: scaleX(20),
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
    position: 'relative',
    borderRadius: scaleX(11)
  },
  leftSection: {
    flexDirection:'row',
    alignItems: 'center',
    flex: 1,
  },
  leftTextSection: {
    marginLeft: scaleX(10),
  },
  profileName: {
    fontSize: scaleX(16),
    lineHeight: scaleX(23),
    fontWeight: '600',
    marginRight: scaleX(5),
    maxWidth: scaleX(90),
    maxHeight: scaleX(23),
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
  bottomNavbarIconContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
    position: 'relative'
  },
  bottomNavbarIcon: {
    justifyContent: 'center',
    alignSelf: 'center',
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
    maxWidth: scaleX(200),
    marginBottom: scaleX(10),
    color: '#F1EEF8',
    fontSize: scaleX(14),
    lineHeight: scaleX(20),
    fontWeight: '700',
    fontFamily: 'Montserrat_700Bold'
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
  searchModalContainer: {
    flex: 1,
  },
  modalOutBtn: {
    width: '100%',
    height: scaleX(90),
  },
  searchModalContent: {
    flex: 1,
    backgroundColor: '#312F36',
    paddingBottom: scaleX(25),
    paddingTop: scaleX(47),
    borderTopLeftRadius: scaleX(45),
    borderTopRightRadius: scaleX(45),
    position: 'relative',    
    
  },
  unlockFeatureBtn: {
    width: scaleX(400),
    height: scaleX(208),
    resizeMode: 'cover'
  },
  closeModalContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: scaleX(25)
  },  
  closeDialogIcon : {
    width: scaleX(79),
    height: scaleX(67),
    resizeMode: 'cover'
  },
  searchModalScrollContainer: {
    flex: 1, 
    position: 'relative',
    paddingHorizontal: scaleX(25)
  },
  searchModalTitle: {
    fontWeight: '700',
    fontSize: scaleX(26),
    lineHeight: scaleX(31),
    color: '#ffffff',
    marginTop: scaleX(30),
  },
  searchListItem: {
    backgroundColor: '#1d1b21',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: scaleX(20),
    borderRadius: scaleX(50),
    marginBottom: scaleX(37),
  },
  selectedItem: {
    borderWidth: scaleX(2),
    borderColor: '#feda4e',
    backgroundColor: 'transparent'
  },
  itemTextContainer: {
    flex: 1,
    paddingLeft: scaleX(17),
    paddingRight: scaleX(10),
  },
  searchItemTitle: {
    fontSize: scaleX(18),
    fontWeight: '600',
    lineHeight: scaleX(22),
    color: '#FFFFFF69'
  },
  selectedItemTxt: {
    color: '#ffffff'
  },
  searchItemDeckCount: {
    fontSize: scaleX(13),
    fontWeight: '500',
    lineHeight: scaleX(16),
    color: '#FFFFFF54'
  },
  itemImgContainer: {
   alignItems: 'center',
   justifyContent: 'center'
  },  
  searchItemIcon: {
    width: scaleX(30),
    height: scaleX(30),
    resizeMode: 'cover'
  },
  searchScrollContainer: {
    paddingBottom: scaleX(50),
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
  shadowUpgradeImg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderRadius: scaleX(11),    
  },
  searchContainerUpgradeBtn: {
    borderTopLeftRadius: scaleX(45),
    borderTopRightRadius: scaleX(45),
  }
});

const mapStateToProps = (state: ApplicationState) => ({
  userReducer: state.userReducer,
});

const Home = connect(mapStateToProps, {OnUpdateUserData })(
  _Home
);

export default Home;
