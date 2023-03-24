import React, {useEffect, useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  ImageBackground,
  ActivityIndicator,
  Modal
} from "react-native";
import bg2 from "../../assets/screenBg/bg2.png";
import shareIcon from "../../assets/common/shareIcon.png";
import pinIcon from "../../assets/common/pinIcon.png"
import pinSaveIcon from "../../assets/common/pinSaveIcon.png"
import profileNoImg from "../../assets/common/noImg/profileNoImg.png"
import advancedDeckIcon from "../../assets/deck/detail/advancedDeckIcon.png";
import beginnerDeckIcon from "../../assets/deck/detail/beginnerDeckIcon.png";
import intermadiateDeckIcon from "../../assets/deck/detail/intermadiateDeckIcon.png";
import { NavigationScreenProp } from "react-navigation";
import { StackActions, useRoute, useIsFocused } from '@react-navigation/native';
import { HomeOption } from "../../types";
import { MaterialIcons , Ionicons, FontAwesome  } from '@expo/vector-icons'; 
import { connect } from "react-redux";
import {ApplicationState} from "../../redux";
import BottomNavigator from "../component/BottomNavigator";
import playIcon from '../../assets/common/playIcon.png'
import Carousel from 'react-native-reanimated-carousel';
import createDeckMediaNoImg from '../../assets/common/noImg/createDeckMediaNoImg.png'
import cardDetailEditIcon from '../../assets/deck/detail/cardDetailEditIcon.png'
import cardDetailTrashIcon from '../../assets/deck/detail/cardDetailTrashIcon.png'
import descActiveIcon from '../../assets/deck/detail/descActiveIcon.png'
import descIcon from '../../assets/deck/detail/descIcon.png'
import previewActiveIcon from '../../assets/deck/detail/previewActiveIcon.png'
import previewIcon from '../../assets/deck/detail/previewIcon.png'
import trashIcon from '../../assets/common/trashIcon.png'
import limitBg from '../../assets/screenBg/limitBg.png'
import playdeckLimitImg from '../../assets/screenBg/playdeckLimitImg.png'
import closeIcon from '../../assets/screenBg/closeIcon.png'
import upgradeBtn from '../../assets/screenBg/upgradeMBtn.png'

import { useFonts,  Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold} from '@expo-google-fonts/montserrat';
import {Inter_500Medium, Inter_700Bold} from '@expo-google-fonts/inter';
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";
import TopBarLeftArrow from "../component/TobBarLeftArrow";
import { scaleX , scaleY} from "../../core/theme/dimensions";
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { getFirestore, addDoc, doc, getDoc, setDoc , collection,deleteDoc, onSnapshot, updateDoc} from 'firebase/firestore';
import  electronIcon from "../../assets/common/electronIcon.png"
import CustomModal from "../component/CustomModal";
import moment from "moment";

const totalStars = 5;

interface Props {
  options: [HomeOption];
  navigation: NavigationScreenProp<any, any>;
  userReducer: any;
}

const _DeckDetail: React.FC<Props> = (props: Props) => {  
  const route:any = useRoute();
  const {deckId, isUserOnlyDeck, userId } = route.params;
  const isFocused = useIsFocused();

  const [selectDescTab, setSelectDescTab] = useState(true)
  const [activeCardIndex, setActiveCardIndex] = useState(0)
  const [savedDeckCount, setSavedDeckCount] = useState(0)
  const [deckDetailData, setDeckDetailData] = useState<any>({})
  const [deckUserData , setDeckUserData] = useState<any>({})
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [isAdmin , setIsAdmin] = useState(false)
  const [curUserId, setCurUserId] = useState<any>({})
  const [curUserData, setCurUserData] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [callingApi, setCallingApi] = useState(false)
  const [loadDeckData, setLoadDeckData] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [todayPlayDeckCount, setTodayPlayDeckCount] = useState(0)
  const [showLimitModal, setShowLimitModal] = useState(false)

  useEffect(() => {    
    props.userReducer?.then((userData:any)=>{
      setIsAdmin(userData?.curUser?.isAdmin)
      setCurUserId(userData?.userId)
      setCurUserData(userData?.curUser)
      getDeckDatailData(userData)
      checkUserHaveSavedDeck(userData?.userId)
      if(userData?.curUser?.userType === 'free') {
        getTodayPlayDeckCount(userData?.userId)
      }
    })
  }, [props.userReducer, isFocused]);

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

  const checkUserHaveSavedDeck = (userId: string) => {
    const firestore = getFirestore()
    getDoc(doc(firestore, "Users", userId, "SavedDecks", deckId))
    .then((deck:any) => {  
      let userSavedDeck = deck.data()      
      if(userSavedDeck) {
        setIsSaved(true)
      }
    })
    .catch((e) => {
      console.log(e)
    })
  }

  const getDeckDatailData = (curUserData:any) => {
    const firestore = getFirestore()  
    if(isUserOnlyDeck)   {
      getDoc(doc(firestore, "Users", userId, "Decks", deckId))
      .then((deck:any) => {      
        getDoc(doc(firestore, "Users", userId))
        .then((user:any) => {
          setDeckUserData(user.data())
          setDeckDetailData(deck?.data());     
          setLoadDeckData(true)
        })            
      })
      .catch((e) => {
          console.log(e)
      });   
    }
    else {      
      getDoc(doc(firestore, "Decks", deckId))
      .then((deck:any) => {      
        let deckUserId = deck?.data().userId;
        setDeckDetailData(deck?.data());  
        setSavedDeckCount(deck?.data().savedCount ? deck?.data().savedCount : 0)   
        getDoc(doc(firestore, "Users", deckUserId))
        .then((user:any) => {
          setDeckUserData(user.data())
          setLoadDeckData(true)
        })    
      })
      .catch((e) => {
          console.log(e)
      });   
    }
  }

  const handleNavigate = (screen: string): void => {
    props.navigation.navigate(screen);
  };

 
  const renderStarContent = () => {
    return (
      <View style={styles.starContainer}>
        <View style={styles.starContent}>
          {
            Array.from({length: deckDetailData?.ratingVal}, (x, i) => {
            return(
              <MaterialIcons key={i} name="star" size={24} color="#FFCA45"/>
            )
            })
          }
          {
            Array.from({length: totalStars-deckDetailData?.ratingVal}, (x, i) => {
            return(
              <MaterialIcons key={i} name="star-border" size={24} color="#FFCA45" />
            )
            })
          }
        </View>
      </View>
    )
  };

  const deleteDeck = () => {
    setLoading(true)
    const firestore= getFirestore()
    if(isUserOnlyDeck) {
      deleteDoc(doc(firestore, "Users", curUserId, "Decks", deckId))
      .then(() => {
        setLoading(false)
        setDeleteModalVisible(false)
        props.navigation.goBack()
      })
      .catch((e) => {
        setLoading(false)
        setDeleteModalVisible(false)
        console.log(e,'delete deck error')
      })
    }
    else {
      deleteDoc(doc(firestore, 'Decks', deckId))
      .then(() => {
        setLoading(false)
        setDeleteModalVisible(false)
        props.navigation.goBack()
      })
      .catch((e) => {
        setLoading(false)
        setDeleteModalVisible(false)
        console.log(e,'delete deck error')
      })
    }
    
  }

  const addOrRemoveSavedDeck = () => {
    if(selectDescTab) {      
      setCallingApi(true)
      const firestore = getFirestore()
      if(isSaved) {
        deleteDoc(doc(firestore, 'Users', curUserId, 'SavedDecks', deckId))
        .then(() => {
          updateDoc(doc(firestore, 'Decks', deckId), {
            savedCount:  savedDeckCount - 1,
          })
          .then(() => {
            setSavedDeckCount(savedDeckCount - 1)
            setCallingApi(false)
          })
          .catch((e) => setCallingApi(false))
          setIsSaved(false)
        })  
        .catch((e) => setCallingApi(false))
      }
      else {
        setDoc(doc(firestore, 'Users', curUserId, 'SavedDecks', deckId), {
          isSaved:  true,
        })
        .then(() => {
          updateDoc(doc(firestore, 'Decks', deckId), {
            savedCount:  savedDeckCount + 1,
          })
          .then(() => {
            setSavedDeckCount(savedDeckCount + 1)
            setCallingApi(false)
          })
          .catch((e) => setCallingApi(false))
          setIsSaved(true)
        })  
        .catch((e) => setCallingApi(false))
      }
    }
  }

  const centeralIconClicked = () => {
    if((curUserData?.userType === 'free') && (todayPlayDeckCount > 0) && (deckDetailData?.uid !== curUserId)) {
      setShowLimitModal(true)
    }
    else {
      let stackAction:any = StackActions.push('playDeck', {deckDetailData, deckId})      
      props.navigation.dispatch(
        stackAction
        )
    }
  }

  const cancelDelete = () => {
    setDeleteModalVisible(false)
  }

  const rednerDeleteModalTxtContent = () => {
    return (
      <View style={styles.modalTxtContent}>
        <Text style={styles.modalContentTxt}>
          Are you sure you want to permanently 
          <Text style={[styles.modalContentTxt, styles.delColorTxt]}> delete </Text>
          this deck?
        </Text>        
      </View>
    )
  }

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
      <ImageBackground source={bg2} resizeMode="cover" style={styles.mainImgBg}>
        <ScrollView nestedScrollEnabled={true}  style={styles.contentContainer}>  
          <View style={[styles.spaceBetweenRow, styles.titleWithBack, styles.paddingStyle]}>
            <TopBarLeftArrow navigation={props.navigation} />
            <Image source={
                  deckDetailData?.level === 'beginner' ? beginnerDeckIcon :
                  deckDetailData?.level === 'intermediate' ? intermadiateDeckIcon :
                  advancedDeckIcon
                } 
              style={styles.shareIconStyle} /> 
          </View>
          <View style={[
            styles.deckImgContent, 
            styles.paddingStyle,
           
            ]}>
            <Image source={deckDetailData?.deckImgUrl ? {uri: deckDetailData.deckImgUrl} : createDeckMediaNoImg} 
                  style={[
                    styles.cardDeckImg,
                    deckDetailData?.level === 'beginner' ? styles.beginnerBorder :
                    deckDetailData?.level === 'intermediate' ? styles.intermediateBorder:
                    styles.premiumBorder
                    ]} />
          </View>
          <View style={[styles.spaceBetweenRow, styles.marginTop27, styles.paddingStyle]}>
              <View style={[styles.rowContent, {alignItems: 'center'}]}>
                <TouchableOpacity 
                    onPress={() => addOrRemoveSavedDeck()} 
                    disabled={(!selectDescTab || callingApi)} 
                    style={styles.rowContent}>
                  <Image source={selectDescTab ? isSaved ? pinSaveIcon : pinIcon : electronIcon} style={selectDescTab ? styles.pinIcon :styles.electronIcon} />
                  <Text style={styles.favCountTxt}>{selectDescTab ? loadDeckData ? savedDeckCount : ' ' : deckDetailData?.cards?.length} {selectDescTab ? ' ' : deckDetailData.cards?.length > 1 ? 'Cards' : 'Card'}</Text>
                </TouchableOpacity>                
                
              </View>
              <View style={{flex:1}}>
                  <MaskedView
                    style={styles.maskViewContainer}
                    maskElement={
                      <View
                        style={styles.maskViewContent}
                      >
                        <Text style={styles.cardTypeTxt} >
                          {deckDetailData?.deckType}
                        </Text>
                      </View>
                    }
                  >
                    <LinearGradient
                        colors={['#FFC844', '#FFAB33']}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.6, y: 1 }}
                        style={{ flex: 1, height: '100%' }}
                      />
                  </MaskedView>
              </View>
          </View>
          <Text style={[styles.deckTitleTxt, styles.paddingStyle]}>
            {deckDetailData?.title}
          </Text>
          <View style={[styles.rowContent, styles.marginTop27, styles.paddingStyle,{justifyContent: 'space-between'}]}>
            <View style={styles.rowContent}>
              <TouchableOpacity 
                style={styles.tabBtn}
                onPress={() => setSelectDescTab(true)} >
                  <Image source={selectDescTab ? descActiveIcon : descIcon} style={styles.descIcon}/>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.tabBtn}
                onPress={() => setSelectDescTab(false)} >
                  <Image source={selectDescTab ? previewIcon : previewActiveIcon} style={styles.previewIcon}/>
              </TouchableOpacity>   
            </View>
            {(isAdmin || curUserId === deckDetailData?.userId) &&       
            <TouchableOpacity 
              onPress={() =>  props.navigation.navigate('createMediaDeck', {deckId, isUserOnlyDeck, userId})} >
                <Image source={cardDetailEditIcon} style={styles.editBtnIcon} />           
            </TouchableOpacity>
            }
            {(isAdmin || curUserId === deckDetailData?.userId) &&    
            <TouchableOpacity 
              onPress={() => setDeleteModalVisible(true)} >
                <Image source={cardDetailTrashIcon} style={styles.trashIcon} />
            </TouchableOpacity>
            }
            {loading && <ActivityIndicator />}
          </View>
          <View>
            {selectDescTab ?
            <View>
              <View style={[styles.rowContent, styles.marginTop27, styles.paddingStyle, {justifyContent: 'space-between'}]}>
                <TouchableOpacity style={styles.rowContent} onPress={()=>{ props.navigation.navigate(deckUserData?.userType ==='contentCreator' ? 'creatorProfile' : 'profile', { userId: deckDetailData?.userId })}}>
                  <Image source={deckUserData?.profileImg ? {uri: deckUserData.profileImg} : profileNoImg} style={styles.userProfileImg} />
                  <Text style={styles.creatorNameTxt} numberOfLines={1} >{deckUserData?.firstName}</Text>
                </TouchableOpacity>
                { deckDetailData?.ratingVal > 0 && renderStarContent() }
              </View>
              <View style={styles.marginTop27}>
                  <Text style={[styles.deckDescTxt, styles.paddingStyle]}>
                    {deckDetailData?.desc}
                  </Text>
              </View>
            </View>
            : <View style={styles.marginTop27}>
              <Carousel
                  style={{
                    width: '100%',
                    height: scaleX(270),
                    justifyContent: 'center',
                  }}
                  width={scaleX(165)}
                  height={scaleX(250)}
                  pagingEnabled={true}
                  snapEnabled={true}
                  vertical={false}
                  // mode={'horizontal-stack'}
                  loop={true}
                  autoPlay={false}
                  autoPlayReverse={false}
                  data={deckDetailData?.cards}
                  onSnapToItem={(index) => setActiveCardIndex(index)}
                  // modeConfig={{
                  //     snapDirection: 'left',
                  //     stackInterval: 18,
                  // }}
                  // customConfig={() => ({ type: 'positive', viewCount: 3 })}
                  renderItem={({ item, index } : {item:any, index: any}) => (
                      <View
                        key={index}
                          style={[styles.sliderContentItem, index == activeCardIndex && styles.activesliderContentItem]}
                      >
                          <Text style={[styles.sliderCardTxt, index == activeCardIndex && styles.activeCardTxt]}>
                              {item.frontTxt}
                          </Text>
                      </View>
                  )}
              />
            </View>
            }
          </View>
        </ScrollView>
        {deckDetailData?.cards &&
          <TouchableOpacity onPress={()=> centeralIconClicked()} style={styles.actionContainer} >
            <Image source={playIcon} style={styles.actionIcon} />
          </TouchableOpacity>
        }
          <CustomModal 
            modalVisible={deleteModalVisible} 
            modalIcon={trashIcon}
            isRating={false}
            ratingVal={0}
            renderModalTxtContent={rednerDeleteModalTxtContent}
            modalSubTxt='You can’t undo this action.'
            primaryBtnTxt={'Delete'}
            cancelBtnTxt={'Cancel'}
            primaryAction={deleteDeck}
            cancelAction={cancelDelete}
          />
      </ImageBackground>    
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
              <Image source={playdeckLimitImg} style={styles.playDeckLimitImgStyle} />
              <Text style={styles.limitTitle}>It’s seems as though you have reached your daily limit</Text>
              <Text style={styles.limitSubTitle}>To continue playing please consider upgrading your account or come back tomorrow</Text>
              <TouchableOpacity 
                onPress={()=>{setShowLimitModal(false); handleNavigate('upgradeAccount')}}
                style={styles.upgradeBtn}
                >
                <Image source={upgradeBtn} style={styles.upgradeBtnImg} />
              </TouchableOpacity>
            </View>
          </ImageBackground>
      </Modal>  
    </View>
  );
};

const styles = StyleSheet.create({
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
  container: {
    flex:1,
  },
  contentContainer: {
    flex:1,
    paddingBottom: scaleX(80),
  },
  mainImgBg: {
    flex: 1,
    resizeMode: 'cover',
  },
  starContainer: {
    justifyContent: 'center'
  },
  starContent: {
    flexDirection : "row",   
  },  
  spaceBetweenRow: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleWithBack: {
    marginTop: scaleX(25),
  },
  shareIconStyle: {
    width: scaleX(75),
    height: scaleX(70),
    resizeMode: 'contain'
  },
  deckImgContent: {

  },
  cardDeckImg: {
    width: 'auto',
    height: scaleX(203),
    resizeMode: 'cover',
    borderRadius: scaleX(8),
    marginTop: scaleX(42),
  },
  marginTop27: {
    marginTop: scaleX(27),
  },
  rowContent: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  favCountTxt: {
    fontSize: scaleX(15),
    fontWeight: '600',
    lineHeight: scaleX(21),
    color: 'white',
    marginLeft: scaleX(9),
    fontFamily: 'Poppins_600SemiBold'
  },
  cardTypeTxt: {
    fontSize: scaleX(15),
    fontWeight: '600',
    lineHeight: scaleX(21),
    color: '#FFF960',
    fontFamily: 'Poppins_600SemiBold'
  },
  deckTitleTxt: {
    fontSize: scaleX(24),
    fontWeight: '700',
    lineHeight: scaleX(34),
    color: 'white',
    marginTop: scaleX(26),
    fontFamily: 'Poppins_700Bold'
  },
  tabBtn: {
   marginRight: scaleX(10),
  },
  tabTxt: {
    fontSize: scaleX(14),
    fontWeight: '500',
    lineHeight: scaleX(19.8),
    color: '#A0A0AB',
    fontFamily: 'Poppins_500Medium'
  },
  activeTabColor: {
    color: '#FFF960'
  },
  tabbtnCotainer: {
    flex: 7,
    justifyContent: 'space-between',
    paddingRight: scaleX(14),
  },
  userProfileImg: {
    width: scaleX(32),
    height: scaleX(32),
    borderRadius: scaleX(16),
    resizeMode: 'cover',
  },
  creatorNameTxt: {
    marginLeft: scaleX(11),
    fontSize: scaleX(16),
    fontWeight: '600',
    lineHeight: scaleX(22),
    maxWidth: scaleX(180),
    color: 'white',
    fontFamily: 'Poppins_600SemiBold'
  },
  deckDescTxt: {
    fontSize: scaleX(16),
    fontWeight: '400',
    lineHeight: scaleX(25),
    color: '#C3C3CA',  
    fontFamily: 'Poppins_400Regular'  ,
    paddingBottom: scaleX(120)
  },
  marginBottom80: {
    marginBottom: scaleX(80),
  },
  sliderContentItem: {
    marginVertical: scaleX(30),
    // marginHorizontal: 2,
    padding: scaleX(20),
    borderRadius: scaleX(18),
    borderWidth: scaleX(1),
    borderColor: '#F4F4F5',
    justifyContent: 'center',    
    width: scaleX(118),
    height: scaleX(190),
    backgroundColor: 'white',
    alignSelf: 'center'
  },
  activesliderContentItem: {
    // marginVertical: scaleX(10),
    // // marginHorizontal: 2,
    // width: scaleX(145),
    // height: scaleX(230),
  },
  sliderCardTxt: {
    fontSize: scaleX(13.7),
    fontWeight: '400',
    lineHeight: scaleX(25),
    textAlign: 'center',
    color: '#4A5770',
    fontFamily: 'Poppins_400Regular'
  },
  activeCardTxt: {
    // fontSize: scaleX(17),
  },
  pinIcon: {
    width: scaleX(14),
    height: scaleX(22),
    resizeMode: 'contain'
  },
  maskViewContainer: {
    width: '100%',     
    flexDirection: 'row', 
    height: scaleX(25),
  },
  maskViewContent: {
    backgroundColor: 'transparent',
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  editBtnIcon: {
    width: scaleX(100),
    height: scaleX(35),
    resizeMode: 'contain'
  },
  trashIcon: {
    width: scaleX(35),
    height: scaleX(35),
    resizeMode: 'contain'
  },
  descIcon: {
    width: scaleX(99),
    height: scaleX(32),
    resizeMode: 'contain'
  },
  previewIcon: {
    width: scaleX(83),
    height: scaleX(32),
    resizeMode: 'contain'
  },
  paddingStyle: {
    paddingLeft: scaleX(25),  
    paddingRight: scaleX(25),
  },
  descSahpeBg: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    width: scaleX(414),
    height: scaleX(180),
    marginRight: -50,
    resizeMode: 'cover',
    // backgroundColor: 'red',
    zIndex: 22
  },
  textScrollView: {
    height: scaleX(200),
  },
  electronIcon: {
    width: scaleX(17),
    height: scaleX(22),
    resizeMode: 'contain'
  },
  beginnerBorder: {
    borderWidth: scaleX(5),
    borderColor: '#5ADBED',
  }, 
  intermediateBorder: {
    borderWidth: scaleX(5),
    borderColor: '#FFBE36',
  } ,
  premiumBorder: {
    borderWidth: scaleX(5),
    borderColor: '#F260FF',
  },
  modalTxtContent: {
    justifyContent: 'center',
    maxWidth: scaleX(180),
  },
  modalContentTxt: {
    fontSize: scaleX(14),
    fontWeight: '500',
    lineHeight: scaleX(17),    
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Montserrat_500Bold'
  },
  delColorTxt: {
    color: '#FF517B',
    fontWeight: '700',
    fontFamily: 'Montserrat_700Bold'
  },
  successColorTxt: {
    color: '#64FF86'
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
    maxWidth: scaleY(361),
    fontFamily: 'Poppins_700Bold',
    fontWeight: '700',
    color: '#EFEBF6',
    textAlign:'center'
  },
  limitSubTitle: {
    marginTop: scaleY(51),
    fontSize: scaleY(18),
    lineHeight: scaleY(27),
    maxWidth: scaleY(350),
    fontFamily: 'Poppins_500Medium',
    fontWeight: '500',
    color: '#E3E1E7',
    textAlign:'center'
  },
  upgradeBtn: {
    // marginTop: scaleY(12),
    maxWidth: scaleY(450),
  },
  upgradeBtnImg: {
    width: scaleY(414),
    height: scaleY(220),
    resizeMode: 'contain'
  },
});

const mapStateToProps = (state: ApplicationState) => ({
  userReducer: state.userReducer,
});

const DeckDetail = connect(mapStateToProps, { })(
  _DeckDetail
);

export default DeckDetail;
