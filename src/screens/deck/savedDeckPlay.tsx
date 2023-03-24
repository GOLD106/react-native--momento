import React, { useState , useEffect, useRef} from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import mainBg from "../../assets/mainBg.png";
import cardSettingIcon from "../../assets/deck/cardSettingIcon.png";
import notHappyIcon from "../../assets/deck/notHappyIcon.png"
import hardIcon from "../../assets/deck/hardIcon.png"
import happyIcon from "../../assets/deck/happyIcon.png";
import notHappyEmptyIcon from "../../assets/deck/notHappyEmptyIcon.png"
import hardEmptyIcon from "../../assets/deck/hardEmptyIcon.png"
import happyEmptyIcon from "../../assets/deck/happyEmptyIcon.png";
import playIcon from "../../assets/common/playIcon.png"
import pauseIcon from "../../assets/common/pauseIcon.png";
import cardBg from "../../assets/deck/cardBg.png";
import playDeckArrowUpIcon from "../../assets/deck/playDeckArrowUpIcon.png"
import heartIcon from '../../assets/deck/heartIcon.png'
import activeHeartIcon from "../../assets/deck/activeHeartIcon.png"
import noteBtn from "../../assets/deck/noteBtn.png"
import activeNoteBtn from "../../assets/deck/activeNoteBtn.png"
import transBtn from "../../assets/deck/transBtn.png"
import activeTransBtn from "../../assets/deck/activeTransBtn.png"
import activeNotesTxt from "../../assets/deck/play/activeNotesTxt.png"
import activeTransTxt from "../../assets/deck/play/activeTransTxt.png"

import { NavigationScreenProp } from "react-navigation";
import { useIsFocused , useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons'; 
import { connect } from "react-redux";
import {ApplicationState} from "../../redux";
import soundIcon from '../../assets/common/soundIcon.png'
import momentoLogo from "../../assets/common/momentoLogo.png"
import CustomModal from "../component/CustomModal";
import { useFonts,  Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold} from '@expo-google-fonts/montserrat';
import {Inter_500Medium, Inter_700Bold} from '@expo-google-fonts/inter';
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { scaleX, scaleY } from "../../core/theme/dimensions";
import { Audio } from 'expo-av';
import { getFirestore, addDoc, doc, getDoc, setDoc , collection, deleteDoc, onSnapshot, updateDoc} from 'firebase/firestore';
import topbarBackIcon from '../../assets/common/topbarBackIcon.png'
import CardStack, { Card } from 'react-native-card-stack-swiper';
import NetInfo from '@react-native-community/netinfo';
import moment from "moment";

export const delay = (ms:any) => new Promise((res) => setTimeout(res, ms));

interface Props {
  navigation: NavigationScreenProp<any, any>;
  userReducer: any;
}

const _SavedDeckPlay: React.FC<Props> = (props: Props) => { 
  const isFocused = useIsFocused();
  const route:any = useRoute();
  const {savedCards, activeIndex, fromDownlaod } = route.params;

  const sliderRef:any = useRef(null);

  const [activeCardIndex, setActiveCardIndex] = useState(activeIndex)
  const [transActive, setTransActive] = useState(true)
  const [isFinishCard, setIsFinishCard] = useState(false)
  const [ratingCount, setRatingCount] = useState(0)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [activeTab , setActiveTab] = useState('trans')
  const [isFav, setIsFav] = useState(true)
  const [cardList, setCardList] = useState<any>([])

  const [easyVal, setEasyVal] = useState(0);
  const [hardVal, setHardVal] = useState(0);
  const [diffVal, setDiffVal] = useState(0);
  const [curUserId, setCurUserId] = useState('');
  const [curUser, setCurUser] = useState<any>({});
  const [savedCardList, setSavedCardList] = useState<any>([])

  const [activeEmoji, setActiveEmoji] = useState('')
  const [lastCardLoaded, setLastCardLoaded] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [progressDeck, setProgressDeck] = useState<any>({})
  const [isNetConneted, setIsNetConnected] = useState(true)
  const [todayPlayDeckCount, setTodayPlayDeckCount] = useState(0)
  const [emojiLoading, setEmojiLoading] = useState(false)

  useEffect(() => {
    NetInfo.fetch().then((state:any) => {     
      setIsNetConnected(state.isConnected) 
    })
  }, [])
  useEffect(() => {
   if(savedCards) { 
    setCardList(savedCards)
   }
  }, [savedCards])

  useEffect(() => {    
    props.userReducer?.then((userData:any)=>{
      let curUserData = userData?.curUser
      setCurUserId(userData?.userId)
      setCurUser(curUserData)
      setEasyVal(curUserData.easyRatingVal)
      setDiffVal(curUserData.diffRatingVal)
      setHardVal(curUserData.hardRatingVal)
      if(!fromDownlaod) {
        getSavedCards(userData?.userId)
      }      
      if(curUserData?.userType === 'free') {
        const firestore = getFirestore();
        let todayMomentIndex = moment().startOf('day').valueOf() + ''            
        setDoc(doc(firestore, 'Users', userData?.userId, "everyDayPlayDeckCount", todayMomentIndex), {
          playDeckCount:  todayPlayDeckCount + 1,
        })
        .then(() => {
          console.log('added play deck count')
        })
      }
    })
  }, [props.userReducer, isFocused]);

 
  const getSavedCards = (userId: string) => {
    const firestore = getFirestore()    
    onSnapshot(collection(firestore, "Users", userId, 'SavedCards'), (querySnapshot) => {      
      let savedCards:any[] = []
      querySnapshot.docs.map((doc) => {       
        let newData = {
          ...doc.data(),
          uid: doc.id,
        }
        savedCards.push(newData)          
      });      
      setSavedCardList(savedCards)  
      
      
    });
  }
   /////////////////////for audio and slider ////////////////////

   const [Loaded, SetLoaded] = React.useState(false);
   const [Loading, SetLoading] = React.useState(false);
   const [Playing, SetPlaying] = React.useState(false);
   const [Duration, SetDuration] = React.useState(0);
   const [Value, SetValue] = React.useState(0);
   let sound = React.useRef(new Audio.Sound());
 
   const addNewSound = () => {
     if(sound) {
       sound.current.unloadAsync();
     }
   }
   const UpdateStatus = async (data:any) => {
     try {
       if (data.didJustFinish) {
         ResetPlayer();
       } else if (data.positionMillis) {
         if (data.durationMillis) {
           SetValue((data.positionMillis / data.durationMillis) * 100);
         }
       }
     } catch (error) {
       console.log('Error');
     }
   };
 
   const ResetPlayer = async () => {
     try {
       const checkLoading = await sound.current.getStatusAsync();
       if (checkLoading.isLoaded === true) {
         SetValue(0);
         SetPlaying(false);
         await sound.current.setPositionAsync(0);
         await sound.current.stopAsync();
       }
     } catch (error) {
       console.log('Error');
     }
   };
 
   const PlayAudio = async () => {
     try {
       const result = await sound.current.getStatusAsync();
       if (result.isLoaded) {
         if (result.isPlaying === false) {
           sound.current.playAsync();
           SetPlaying(true);
         }
         else {
          setError('play audio error already load')
         }
       }
     } catch (error) {
        console.log(error)
        setError('play audio error')
        SetPlaying(false);
     }
   };
 
   const PauseAudio = async () => {
     try {
       const result = await sound.current.getStatusAsync();
       if (result.isLoaded) {
         if (result.isPlaying === true) {
           sound.current.pauseAsync();
           SetPlaying(false);
         }
       }
     } catch (error) {
       SetPlaying(true);
     }
   };
 
   const SeekUpdate = async (data:any) => {
     try {
       const checkLoading = await sound.current.getStatusAsync();
       if (checkLoading.isLoaded === true) {
         const result = (data / 100) * Duration;
         await sound.current.setPositionAsync(Math.round(result));
       }
     } catch (error) {
       console.log('Error');
     }
   };  
 
   useEffect(() => {
    let curActiveItem = cardList[activeCardIndex]
     const LoadAudio = async () => {
     
       SetLoading(true);
       const checkLoading = await sound.current.getStatusAsync();       
       if (checkLoading.isLoaded === false) {
        
         try {
           const result = await sound.current.loadAsync(
             { uri: curActiveItem?.frontTxtAudio },
             {},
             true
           );
           
           if (result.isLoaded === false) {
             SetLoading(false);
             SetLoaded(false);
             console.log('Error in Loading Audio');
           } else {
             sound.current.setOnPlaybackStatusUpdate(UpdateStatus);
             SetLoading(false);
             SetLoaded(true);
             SetDuration(result.durationMillis!);
             PlayAudio()
           }
         } catch (error) {
          setError('load audio error')
           console.log(error, 'error')
           SetLoading(false);
           SetLoaded(false);
         }
       } else {
         SetLoading(false);
         SetLoaded(true);
       }
     };
     if(curActiveItem?.frontTxtAudio) LoadAudio()
     .catch((e) => console.log(e,'load error'));
   }, [cardList[activeCardIndex]])
 
   
 
   const GetDurationFormat = (duration:any) => {
     let time = duration / 1000;
     let minutes = Math.floor(time / 60);
     let timeForSeconds = time - minutes * 60;
     let seconds = Math.floor(timeForSeconds);
     let secondsReadable = seconds > 9 ? seconds : `0${seconds}`;
     return `${minutes}:${secondsReadable}`;
   };
 
   //////////////////////end for audio and slider /////////////////////////////

  const handleNavigate = (screen: string): void => {
    props.navigation.navigate(screen);
  };

   
  const centeralIconClicked = () => {
    handleNavigate('playDeck')
  }
  
  const replayDeck = () => {
    setShowConfirmDialog(false)
    setIsFinishCard(false)
    setCardList(savedCards)
  }
  const exitModal = () => {
    setShowConfirmDialog(false)
    props.navigation.goBack()
  }

  const renderSuccessModalTxtContent = () => {
    return (
      <View style={styles.modalTxtContent}>
        <Text style={styles.modalContentTxt}>
            Thank you for  
          <Text style={[styles.modalContentTxt, styles.successColorTxt]}> rating </Text>
            this deck
        </Text>        
      </View>
    )
  }

  const deleteFromSavedCard = (deckId: string) => {
    SetLoading(true)  
    const firestore = getFirestore()
    deleteDoc(doc(firestore, "Users", curUserId, "SavedCards", deckId))
    .then(() => {
      SetLoading(false)         
    })
    .catch((e) => {
      SetLoading(false)
    })
  }

  const emojiIconClick = async(type: string) => {
    let curCardItem = cardList[activeCardIndex]
    let firstSubArray:any = []
    let secondSubArray:any = []
    let repeatVal = type === 'hard' ? hardVal : type === 'diff' ? diffVal : easyVal
    setActiveEmoji(type)    
    setEmojiLoading(true)
    await delay(2000);    
    if(type ==='hard' || type === 'diff') {
      firstSubArray =  cardList.slice(0, repeatVal + activeCardIndex)
      firstSubArray.push(curCardItem)
      secondSubArray = cardList.slice(repeatVal + activeCardIndex, cardList.length)
      let newarray = firstSubArray.concat(secondSubArray)
      setCardList(newarray)
      sliderRef.current?.swipeLeft();
    }
    else {
      deleteFromSavedCard(curCardItem?.uid)
      sliderRef.current?.swipeRight();
    }
    setEmojiLoading(false)
    setActiveEmoji('');
  }
  const setSnapItem = (index: number) => {
    addNewSound(); 
    let activeCardItem:any
    let cardIndex:number
    if(index+1 === cardList.length) {
      activeCardItem = cardList[0]
      cardIndex =  0
    }
    else {
      activeCardItem = cardList[index + 1]
      cardIndex = index + 1
    }
    const foundItem = savedCardList.find((el:any) =>{ return el.deckId === activeCardItem?.deckId && el.cardIndex === activeCardItem?.cardIndex})
    if(foundItem) {
      setIsFav(true)
    }
    else {
      setIsFav(false)
    }
    setActiveCardIndex(cardIndex);
    
  }
  const addToSavedDeck = () => {
    const firestore = getFirestore()
    if(cardList) {
      let activeCardItem = cardList[activeCardIndex]
      const foundItem = savedCardList?.find((el:any) =>{ return el.deckId === activeCardItem?.deckId && el.cardIndex === activeCardItem?.cardIndex})

      if(foundItem) {
        deleteDoc(doc(firestore, "Users", curUserId, "SavedCards", foundItem?.uid))
        .then(() => {
          setLoading(false)       
          setIsFav(false) 
        })
        .catch((e) => {
          setLoading(false)
        })
      }
      else {     
        addDoc(collection(firestore, 'Users', curUserId, 'SavedCards'), {
          deckId:activeCardItem?.deckId,
          cardIndex: activeCardItem?.cardIndex,
          frontTxt: activeCardItem?.frontTxt,
          frontTxtAudio: activeCardItem?.frontTxtAudio,
          audioFileSize: activeCardItem?.audioFileSize,
          notesTxt: activeCardItem?.notesTxt,
          transTxt: activeCardItem?.transTxt,
          createdTime: activeCardItem?.createdTime
        })
        .then(() => {
          // setShowLoading(false)
          console.log('added saved card')
          setIsFav(true)
        })
        .catch((e:any) => {
          // setShowLoading(false)
          console.log(e, 'add error')
        });
      }
    }
  }

  const handleBackNavigate = () => { 
          props.navigation.goBack()
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
      <ImageBackground source={mainBg} resizeMode="cover" style={styles.mainImgBg}>
        <ScrollView style={styles.contentContainer}>  
          <View style={[styles.spaceBetweenRow, styles.titleWithBack]}>
          <TouchableOpacity onPress={()=> handleBackNavigate()}>
            <Image source={topbarBackIcon} 
              style={{
                width: scaleY(37),
                height: scaleY(31),
                resizeMode: 'contain'
              }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => props.navigation.navigate('deckCardRateSetting')} >
            <Image source={cardSettingIcon} style={styles.shareIconStyle} />
          </TouchableOpacity>
          </View>
          <View style={styles.marginBottom80}>
            <View style={styles.marginTop27}>
              <CardStack style={styles.cardStackContent} 
                 duration={500}     
                 initialIndex = {activeIndex}            
                 loop={true}
                 onSwipedAll={()=> setIsFinishCard(true)}
                 onSwiped={(index)=> setSnapItem(index) }
                 ref={sliderRef}>
                  {
                    cardList.map((item:any, index:number) => 
                    <Card style={styles.cardItemStyle} data={Playing} key={index + Playing}>
                      <ImageBackground source={cardBg} resizeMode="cover" style={styles.cardBgSyle} >
                        <View style={styles.sliderTxtContent}> 
                          <Text style={[styles.sliderCardTxt]}>
                              {transActive ? item.frontTxt : item.noteTxt}
                          </Text>
                        </View>
                        {
                        curUser?.userType !== 'free' &&
                        <View style={styles.cardBtnCotainer}>
                          <TouchableOpacity onPress={Playing ? () => PauseAudio() : () => PlayAudio()}>
                            
                            <Image source={Playing ? pauseIcon : playIcon} style={styles.playIconstyle} />
                          </TouchableOpacity>
                        </View>
                        }
                      </ImageBackground>
                    </Card>
                    )
                  }
                       
              </CardStack>              
            </View>       
            <View style={styles.cardRatesIconContainer}>
              <TouchableOpacity 
                onPress={()=> emojiIconClick('hard')}
                disabled={Playing || emojiLoading}
                style={styles.cardRateBtn} >
                  {activeEmoji == 'hard' &&
                  <View style={styles. repeatValTxtContainer}><Text style={styles.repeatValTxt}>+{hardVal}</Text></View>
                  }
                  <Image source={activeEmoji == 'hard' ? notHappyIcon : notHappyEmptyIcon} style={styles.cardRateIcon} />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={()=> emojiIconClick('diff')}
                disabled={Playing || emojiLoading}
                style={styles.cardRateBtn} >
                  {activeEmoji == 'diff' &&
                  <View style={styles. repeatValTxtContainer}><Text style={styles.repeatValTxt}>+{diffVal}</Text></View>
                  }
                  <Image source={activeEmoji == 'diff' ? hardIcon : hardEmptyIcon} style={styles.cardRateIcon} />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={()=> emojiIconClick('easy')}
                disabled={Playing || emojiLoading}
                style={styles.cardRateBtn} >                 
                  <Image source={activeEmoji == 'easy' ? happyIcon : happyEmptyIcon} style={styles.cardRateIcon} />
              </TouchableOpacity>
            </View>
            <View style={styles.bottomtransContainer} >
              <TouchableOpacity
                style={styles.transArrowBtn}
                onPress={() => setShowModal(true)}
              >
                <Image source={playDeckArrowUpIcon} style={styles.playDeckArrowUpIcon} />
                <Text style={styles.notesAndTransTxt}>NOTES / TRANSLATION </Text>
              </TouchableOpacity>     
              <View style={styles.transBtnContainer}         >
                {(fromDownlaod && !isNetConneted) ? <View /> :
                <TouchableOpacity onPress={()=> addToSavedDeck()}>
                  <Image source={isFav ? activeHeartIcon : heartIcon} style={styles.hardIconStyle} />
                </TouchableOpacity>
                }
                <View style={styles.transAndNotebtn}>
                  <TouchableOpacity onPress={()=>setActiveTab('trans')}>
                    <Image source={activeTab == 'trans' ? activeTransBtn : transBtn} style={styles.transIconStyle} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>setActiveTab('notes')}>
                    <Image source={activeTab == 'trans' ? noteBtn : activeNoteBtn} style={styles.transIconStyle} />
                  </TouchableOpacity>
                </View>
              </View>   
              <View style={styles.tabContainer}>
                <Image source={activeTab =='trans' ? activeTransTxt : activeNotesTxt}  style={activeTab == 'trans' ? styles.transImgTxt : styles.notesImgTxt}/>
                <Text style={styles.descTxt}>
                  {activeTab =='trans' ?  cardList[activeCardIndex]?.transTxt : cardList[activeCardIndex]?.notesTxt}
                </Text>
              </View>
            </View>
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
    paddingTop: scaleY(25),
    paddingBottom: 0,
    // paddingBottom: scaleY(80),    
  },
  mainImgBg: {
    flex: 1,
    resizeMode: 'cover',
  },
  spaceBetweenRow: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleWithBack: {
    marginTop: scaleY(24),
    paddingHorizontal: scaleY(25),
  },
  shareIconStyle: {
    width: scaleY(31),
    height: scaleY(27),
    resizeMode: 'contain'
  },
  marginTop27: {
    marginTop: scaleY(37),
    alignItems: 'center'
  },
  marginBottom80: {
    marginBottom: scaleY(80),
    minHeight: scaleY(816),
    justifyContent: 'center',
  },
  sliderContentItem: {
    padding: scaleY(10),
    // padding: 20,
    width: scaleY(352),
    borderRadius: scaleY(18),
    justifyContent: 'center',    
    flex: 1,    
    alignSelf: 'center'
  },
  sliderTxtContent: {
    justifyContent: 'flex-start',    
    flex: 1,
    paddingTop: scaleY(50),
    // backgroundColor: 'red',
    // alignSelf: 'center',
    
  },
  sliderCardTxt: {
    fontSize: scaleY(35),
    fontWeight: '400',
    lineHeight: scaleY(52.5),
    color: '#4A5770',
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
  },
  cardRatesIconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',  
    height: scaleY(97.3),
    marginTop: scaleY(40),
    paddingHorizontal: scaleY(25),
    flex: 1,
  },
  cardRateBtn: {
    position: 'relative',
  },
  repeatValTxtContainer: {
    backgroundColor: '#38AB25',
    position: 'absolute',
    zIndex: 22,
    right: scaleY(-15),
    top: scaleY(-30),
    width: scaleY(45),
    height: scaleY(30),
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scaleY(15),
  },
  repeatValTxt: {
  //  paddingVertical: scaleY(6),
  //  paddingHorizontal: scaleY(11),
    fontSize: scaleY(18),
    fontWeight: '600',
    lineHeight: scaleY(22),
    color: 'white',
  },
  cardRateIcon: {
    width: scaleY(78),
    height: scaleY(78),
    resizeMode: 'contain'
  },
  notesTxt: {

  },
  cardBtnCotainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCardBtn: {
    backgroundColor: '#5ADBED'
  },
  cardBtnTxt: {
    fontSize: scaleY(8),
    fontWeight: '700',
    lineHeight: scaleY(10),
    color: '#AAA9AE',
    marginBottom: scaleY(10),
    fontFamily: 'Montserrat_700Bold',
  }, 
  cardBtn: {
    width: scaleY(120),
    height: scaleY(61),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ECECEE'
  },
  transBtn: {
    borderTopLeftRadius: scaleY(18),
    borderBottomLeftRadius: scaleY(18),
  },
  notesBtn: {
    borderTopRightRadius: scaleY(18),
    borderBottomRightRadius: scaleY(18),
  },
  transIcon: {
    width: scaleY(14),
    height: scaleY(14),
    resizeMode: 'contain'
  },
  notesIcon: {
    width: scaleY(20),
    height: scaleY(15),
    resizeMode: 'contain'
  },
  activeCardBtnTxt: {
    color: 'white'
  },
  emptyDeckContent: {
    flex: 1,
    height: Dimensions.get("window").height - scaleY(200),
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyDeckTitle: {
    fontSize: scaleY(26),
    lineHeight: scaleY(39),
    fontWeight: '600',
    textAlign: 'center',
    color: '#F4F4F4',
    maxWidth: scaleY(320),
  },
  emptyDeckSubTitle: {
    marginTop: scaleY(21),
    fontSize: scaleY(18),
    lineHeight: scaleY(27),
    fontWeight: '600',
    textAlign: 'center',
    color: '#968FA4',
    maxWidth: scaleY(247),
  },  
  starContainer: {
    paddingTop: scaleY(8),
    paddingRight: scaleY(4),
    marginTop: scaleY(65),
    marginBottom: scaleY(50),
  },
  starContent: {
    flexDirection : "row",    
    paddingRight: scaleY(3),
    paddingLeft: scaleY(3),
    borderRadius: scaleY(24),
  },
  skipTxt: {
    fontSize: scaleY(18),
    lineHeight: scaleY(28),
    fontWeight: '500',
    color: 'white'
  },  
  modalTxtContent: {
    justifyContent: 'center',
    maxWidth: scaleY(200),
  },
  modalContentTxt: {
    fontSize: scaleY(14),
    fontWeight: '600',
    lineHeight: scaleY(17),    
    color: 'white',
    textAlign: 'center'
  },
  delColorTxt: {
    color: '#FF517B'
  },
  successColorTxt: {
    color: '#FFF960'
  },
  cardBgSyle: {
    flex:1,
    padding: scaleY(50),
  },  
  bottomtransContainer: {
    marginTop: scaleY(51),
    marginBottom: scaleY(80),
    marginHorizontal: scaleY(12),
    padding: scaleY(15),
    borderRadius: scaleY(38.66),
    backgroundColor: '#373046',
    alignItems: 'center',
  },
  transArrowBtn: {
    alignItems: 'center',
    marginBottom: scaleY(23),
  },
  playDeckArrowUpIcon: {
    width: scaleY(38),
    height: scaleY(5),
    resizeMode: 'contain'
  },
  notesAndTransTxt: {
    fontFamily: 'Montserrat_500Medium',
    fontWeight: '500',
    fontSize: scaleY(12),
    lineHeight: scaleY(14.63),
    color: '#968FA4',
    marginTop: scaleY(10),    
  },
  transBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: scaleY(10),
  },
  hardIconStyle: {
    width: scaleY(27),
    height: scaleY(25),
    resizeMode: 'contain'
  },
  transAndNotebtn: {
    flexDirection: 'row'
  },
  transIconStyle: {
    width: scaleY(40),
    height: scaleY(40),
    marginLeft: scaleY(10),
    resizeMode: 'contain'
  },
  tabContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentTitle: {
    color: '#FFF960',
    fontFamily: 'Poppins_500Medium',
    fontSize: scaleY(18),
    fontWeight: '500',
    textAlign: 'center'
  },
  descTxt: {
    fontFamily: 'Poppins_400Regular',
    fontWeight: '400',
    fontSize: scaleY(16),
    lineHeight: scaleY(25.28),
    marginTop: scaleY(15),
    color: '#C3C3CA',
    paddingBottom: scaleY(95),
    width: '100%',
  },
  playIconstyle: {
    width: scaleY(58),
    height: scaleY(58),
    resizeMode: 'contain',
  },
  transImgTxt: {
    width: scaleY(103),
    height: scaleY(25),
    resizeMode: 'contain',
  },
  notesImgTxt: {
    width: scaleY(52),
    height: scaleY(25),
    resizeMode: 'contain',
  },
  cardStackContent:{
    flex: 1,
    width: scaleY(352),
    height: scaleY(529),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardItemStyle:{   
    height: scaleY(529),
    width: scaleY(340),
  },
  card1: {
    backgroundColor: '#FE474C',
  },
  label: {
    lineHeight: 400,
    textAlign: 'center',
    fontSize: 55,
    fontFamily: 'System',
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  momentoLogoIcon: {
    width: scaleX(292),
    height: scaleX(313),
    resizeMode: 'contain',
    marginTop: scaleX(36),
    marginBottom: scaleX(62),
  },
  replayBtn: {
    marginTop: scaleX(58)
  }
});

const mapStateToProps = (state: ApplicationState) => ({
  userReducer: state.userReducer,
});

const SavedDeckPlay = connect(mapStateToProps, { })(
  _SavedDeckPlay
);

export default SavedDeckPlay;
