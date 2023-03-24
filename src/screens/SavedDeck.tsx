import React, { useState , useEffect} from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  ImageBackground,
  Modal
} from "react-native";
import mainBg from "../assets/mainBg.png";
import soundGraph from "../assets/deck/soundGraph.png";
import soundGraphSliderThumb from "../assets/deck/soundGraphSliderThumb.png"
import cardDeck from "../assets/common/cardDeck.png";
import jojo from "../assets/common/jojo.png";
import  searchIcon from "../assets/common/searchIcon.png"
import savedDeckPlayICon from "../assets/deck/savedDeckPlayICon.png"
import savedDeckUnselectedPlayIcon from "../assets/deck/savedDeckUnselectedPlayIcon.png"
import savedDeckPauseICon from "../assets/deck/savedDeckPauseICon.png"
import savedDeckRemoveIcon from "../assets/deck/saveDeckRemoveIcon.png"
import { NavigationScreenProp } from "react-navigation";
import { HomeOption } from "../types";
import { connect } from "react-redux";
import {ApplicationState} from "../redux";
import { useIsFocused , useRoute } from '@react-navigation/native';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';
import { useFonts,  Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold} from '@expo-google-fonts/montserrat';
import {Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold} from '@expo-google-fonts/inter';
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";
import TopBarLeftArrow from "./component/TobBarLeftArrow";
import { scaleX , scaleY} from "../core/theme/dimensions";
import limitBg from '../assets/screenBg/limitBg.png'
import playdeckLimitImg from '../assets/screenBg/playdeckLimitImg.png'
import closeIcon from '../assets/screenBg/closeIcon.png'
import upgradeBtn from '../assets/screenBg/upgradeBtn.png'

import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { getFirestore, addDoc, doc, getDoc,  collection, deleteDoc, onSnapshot, updateDoc} from 'firebase/firestore';
import moment from "moment";

const WIDTH_DEVICE = Dimensions.get("window").width;

interface Props {
  options: [HomeOption];
  navigation: NavigationScreenProp<any, any>;
  userReducer: any;
}

const _SavedDeck: React.FC<Props> = (props: Props) => { 

  const isFocused = useIsFocused();
  const handleNavigate = (screen: string): void => {
    props.navigation.navigate(screen);
  };

  const [selectedCardItem, setSelectedCardItem] = useState<any>({});  
  const [curUserId, setCurUserId] = useState<any>({})
  const [curUserData, setCurUserData] = useState<any>({})
  const [savedCardList, setSavedCardList] = useState<any>([])
  const [dataLoaded, setDataLoaded] = useState(false)
  const [todayPlayDeckCount, setTodayPlayDeckCount] = useState(0)
  const [showLimitModal, setShowLimitModal] = useState(false)

  useEffect(() => {    
    props.userReducer?.then((userData:any)=>{
      setCurUserId(userData?.userId)
      setCurUserData(userData?.curUser)
      getSavedCards(userData?.userId)
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

  const getSavedCards = (userId: string) => {
    const firestore = getFirestore()    
    setDataLoaded(true)
    onSnapshot(collection(firestore, "Users", userId, 'SavedCards'), async (querySnapshot) => {      
      let savedCards:any[] = []
      querySnapshot.docs.map((doc) => {       
        let newData = {
          ...doc.data(),
          uid: doc.id,
        }
        savedCards.push(newData)
          
      });      
      setDataLoaded(false)
      if(savedCards) {
        setSavedCardList(savedCards)  
        setSelectedCardItem(savedCards[0])    
      }      
    });
  }

  /////////////////////for audio and slider ////////////////////

  const [Loaded, SetLoaded] = React.useState(false);
  const [Loading, SetLoading] = React.useState(false);
  const [Playing, SetPlaying] = React.useState(false);
  const [Duration, SetDuration] = React.useState(0);
  const [Value, SetValue] = React.useState(0);
  const sound = React.useRef(new Audio.Sound());

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
    console.log('play audoo')
    try {
      const result = await sound.current.getStatusAsync();
      if (result.isLoaded) {
        if (result.isPlaying === false) {
          sound.current.playAsync();
          SetPlaying(true);
        }
      }
      else {
        console.log('isLoaded false')
      }
    } catch (error) {
      console.log(error, 'play error')
      SetPlaying(false);
    }
  };

  const PauseAudio = async () => {
    console.log('pause audoo')
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
     const LoadAudio = async () => {
     
       SetLoading(true);
       const checkLoading = await sound.current.getStatusAsync();       
       if (checkLoading.isLoaded === false) {
        
         try {
           const result = await sound.current.loadAsync(
             { uri: selectedCardItem?.frontTxtAudio },
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
           }
         } catch (error) {          
           console.log(error, 'error')
           SetLoading(false);
           SetLoaded(false);
         }
       } else {
         SetLoading(false);
         SetLoaded(true);
       }
     };
     if(selectedCardItem?.frontTxtAudio) LoadAudio()
     .catch((e) => console.log(e,'load error'));
   }, [selectedCardItem])

  

  const GetDurationFormat = (duration:any) => {
    let time = duration / 1000;
    let minutes = Math.floor(time / 60);
    let timeForSeconds = time - minutes * 60;
    let seconds = Math.floor(timeForSeconds);
    let secondsReadable = seconds > 9 ? seconds : `0${seconds}`;
    return `${minutes}:${secondsReadable}`;
  };

  //////////////////////end for audio and slider /////////////////////////////

  const deleteFromSavedCard = (deckId: string) => {
    const firestore = getFirestore()
    deleteDoc(doc(firestore, "Users", curUserId, "SavedCards", deckId))
    .then(() => {
      SetLoading(false)   
    })
    .catch((e) => {
      SetLoading(false)
    })
  }

  const gotoSavedDeckPlay = (savedCardList:any, index: any ) => {
    if((curUserData?.userType === 'free') && (todayPlayDeckCount > 0)) {
      setShowLimitModal(true)
    }
    else {
      let selectedItem = savedCardList[index]
      savedCardList.splice(index, 1)
      savedCardList.unshift(selectedItem)      
      props.navigation.navigate('savedDeckPlay', {savedCards: savedCardList, activeIndex: 0})
    }
  }
  
  const renderSavedDeckList = () => {
    return (
      savedCardList.map((item:any, index:number) => {
        return (
          <LinearGradient
            colors={[selectedCardItem?.uid == item.uid ? '#FFE152' : '#1D1B21', selectedCardItem?.uid == item.uid ? '#FF9929' : '#1D1B21']}
            start={{x: 0.5, y: 0.5}} end={{x: 0.52, y: 1.0}}
            style={{ alignItems: 'center', justifyContent: 'center',
            marginBottom: scaleX(10),
            marginTop: scaleX(15),borderRadius: scaleX(12)}}
            key={index} >
          <TouchableOpacity 
            onPress={() => {setSelectedCardItem(item)}}
            style={[styles.savedDeckListItem]} >
            <View style={styles.savedDeckListItemTxtContainer}>
              
              <MaskedView
                  style={styles.maskViewContainer}
                  maskElement={
                    <View
                      style={styles.maskViewContent}
                    >
                      <Text style={[styles.itemTitle]} numberOfLines={1} ellipsizeMode='tail' >{item.frontTxt}</Text>
                    </View>
                  }
                >
                  <LinearGradient
                    colors={[selectedCardItem?.uid == item.uid ? '#FFD84D' : '#BBBBBB', selectedCardItem?.uid == item.uid ? '#FFA832' : '#BBBBBB']}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ flex: 1 }}
                  />
              </MaskedView>           
              <Text style={styles.itemTimeTxt}>{moment(item.createdTime).format('DD-MM-YYYY') + ' ' + (item?.audioFileSize / parseFloat('1000')).toFixed(2) + 'KB'}</Text>
            </View>
            <View style={styles.actionContainer}>
              <TouchableOpacity onPress={() => deleteFromSavedCard(item.uid)} style={styles.removeBtnContainer}>
                <Image source={savedDeckRemoveIcon} style={styles.savedDeckRemoveIcon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {gotoSavedDeckPlay(savedCardList, index)}}>
                <Image source={ selectedCardItem?.uid == item.uid ? savedDeckPlayICon : savedDeckUnselectedPlayIcon} style={styles.savedDeckPlayIcon} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          </LinearGradient>
        )
      })
    )
  }
  const gotoAddDeck = () => {
    handleNavigate('selectdeckType')
  }
  
  let [fontsLoaded] = useFonts({
    Montserrat_700Bold, Montserrat_600SemiBold, Montserrat_500Medium, Montserrat_400Regular,
    Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold,
    Poppins_400Regular, Poppins_500Medium,  Poppins_600SemiBold, Poppins_700Bold
  });

  if (!fontsLoaded) {
    return null;
  }


  return (
    <View style={styles.container}>
      <ImageBackground source={mainBg} resizeMode="cover" style={styles.mainImgBg}>
        <ScrollView style={styles.contentContainer}>  
          {/* <View style={styles.titleWithBack}>
            <TopBarLeftArrow navigation={props.navigation} />
          </View> */}
          {
            savedCardList.length > 0   ?
          <View style={styles.mainContent}>
            {/* <Text style={styles.titleTxt}>
              {selectedCardItem?.frontTxt}
            </Text>
            <Text style={styles.subTitle}>
              {moment(selectedCardItem?.createdTime).format('DD MMM YYYY')}  • {(selectedCardItem?.audioFileSize / parseFloat('1000')).toFixed(2)} KB 
            </Text>
            <View style={styles.soundGraphContainer}>
              <Image source={soundGraph} style={styles.soundGraph} />
              <Slider
                  style={styles.audioSlider}
                  minimumValue={0}
                  maximumValue={100}
                  value={Value}
                  onSlidingComplete={(data) => SeekUpdate(data)}
                  minimumTrackTintColor={'transparent'}
                  maximumTrackTintColor={'transparent'}
                  thumbImage={soundGraphSliderThumb}
                />
            </View> */}
            
              {/* <View style={[styles.spaceBetweenContainer, styles.timeContainer]}>
                <Text style={styles.timeTxt}>00:00</Text>
                <Text style={styles.timeTxt}>
                  {Playing
                    ? GetDurationFormat((Value * Duration) / 100)
                    : GetDurationFormat(Duration)}
                </Text>
              </View> */}
              <View style={[styles.spaceBetweenContainer, styles.middleTitle]}>
                <Text style={styles.middleTitleTxt}>Saved</Text>
                {/* <View style={styles.searchIconContainer}>
                  <Image source={searchIcon} style={styles.searchIcon} />
                </View> */}
              </View>
              <View>
                {renderSavedDeckList()}
              </View>
          </View>
          :
          <View style={styles.emptyDeckContent}>
              <View style={styles.centerContainer}>
                <Text style={styles.emptyDeckTitle}>
                  You currently have no saved cards.
                </Text>
                <Text style={styles.emptyDeckSubTitle}>
                  When you find a card you like, hit the like button and it will automatically appear here.
                </Text>
              </View>
          </View>
          }
        </ScrollView>
        {/* <BottomNavigator 
          navigation={props.navigation} 
          centerIcon={addIcon}
          centerIconPress={gotoAddDeck}
          /> */}
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
            <View style={styles.limitModalCenterContainer}>
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
  titleWithBack: {
    flexDirection: "row",
    alignItems: 'center'
  },
  mainContent: {
    marginTop: scaleX(38),
    marginBottom: scaleX(80)
  },
  titleTxt: {
    fontSize: scaleX(24),
    fontWeight: '700',
    lineHeight: scaleX(33),
    color: '#EEECF4',
    maxWidth: scaleX(310),
    fontFamily: 'Poppins_700Bold'
  },
  subTitle: {
    fontSize: scaleX(16),
    fontWeight: '500',
    lineHeight: scaleX(26),
    color: '#6F6F71',
    fontFamily: 'Inter_500Medium'
  },
  soundGraphContainer: {
    marginTop: scaleX(46),
    width: '100%',
    height: scaleX(97),
    overflow: 'hidden',
    borderRadius: scaleX(12),
  },
  soundGraph: {
    width: 'auto',
    height: scaleX(97),
    resizeMode: 'cover'
  },
  audioSlider: {
    marginTop: scaleX(-48.5),    
    marginLeft: scaleX(-10),
    marginRight: scaleX(-10),
  },
  spaceBetweenContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',    
  },
  timeTxt: {
    fontSize: scaleX(16),
    fontWeight: '600',
    lineHeight: scaleX(26),
    color: '#B7B7B7',
    fontFamily: 'Inter_600SemiBold'
  },
  middleTitleTxt: {
    fontSize: scaleX(24),
    fontWeight: '700'  ,
    lineHeight: scaleX(29),
    color: '#EEECF4',
    fontFamily: 'Inter_700Bold'
  },
  timeContainer: {
    marginTop: scaleX(17),
  },
  middleTitle: {
    marginTop: scaleX(46),
  },
  searchIconContainer: {
    padding: scaleX(12),
    backgroundColor: '#323038',
    borderRadius: scaleX(9),
  },
  searchIcon: {      
    width: scaleX(20),
    height: scaleX(20),
  },
  savedDeckListItem: {
    flex:1,
    width: WIDTH_DEVICE - scaleX(52),
    margin: scaleX(1),
    padding: scaleX(15),
    backgroundColor: '#1D1B21',
    borderRadius: scaleX(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  selectedListItem: {
    borderWidth: scaleX(1),
    borderColor: '#FFF960',
  },
  selectedItemTitle: {
    color: '#FFF960',
  },
  savedDeckListItemTxtContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: scaleX(18),
    fontWeight: '500',
    lineHeight: scaleX(26),
    color: '#BBBBBB',
    maxWidth: scaleX(200),
    fontFamily: 'Inter_500Medium',
  },
  itemTimeTxt: {
    fontSize: scaleX(13),
    fontWeight: '400',
    lineHeight: scaleX(26),
    color: '#817F86',
    fontFamily: 'Inter_400Regular'
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  savedDeckPlayIcon: {
    width: scaleX(50),
    height: scaleX(50),
    resizeMode: 'cover',
    borderRadius: scaleX(10),
    marginLeft: scaleX(25)
  },
  emptyDeckContent: {
    flex: 1,
    height: scaleX(Dimensions.get("window").height - 150),
    justifyContent: 'center',
    alignItems: 'center'
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyDeckTitle: {
    fontSize: scaleX(26),
    lineHeight: scaleX(31),
    fontWeight: '600',
    textAlign: 'center',
    color: '#F4F4F4',
    maxWidth: scaleX(320),
    fontFamily: 'Poppins_600SemiBold'
  },
  emptyDeckSubTitle: {
    marginTop: scaleX(21),
    fontSize: scaleX(18),
    lineHeight: scaleX(22),
    fontWeight: '600',
    textAlign: 'center',
    color: '#968FA4',
    maxWidth: scaleX(247),
    fontFamily: 'Poppins_600SemiBold'
  },
  savedDeckRemoveIcon: {
    width: scaleX(20),
    height: scaleX(22),
    resizeMode: 'cover',
  },
  removeBtnContainer: {
    paddingVertical: scaleX(20),
    paddingHorizontal: scaleX(5)
  },
  maskViewContainer: {
    flex: 1,
    flexDirection: 'row',
    height: '100%',
  },
  maskViewContent: {
    backgroundColor: 'transparent',
    flex: 1,
    maxWidth: scaleX(200),
    justifyContent: 'center',    
    // alignItems: 'center',
    // backgroundColor: 'red'
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
  limitModalCenterContainer: {
    flex: 1,
    alignItems: 'center',
  },
  limitTitle: {
    marginTop: scaleY(20),
    fontSize: scaleY(30),
    lineHeight: scaleY(45),
    maxWidth: scaleY(320),
    fontFamily: 'Poppins_700Bold',
    fontWeight: '700',
    color: '#EFEBF6',
    textAlign:'center'
  },
  limitSubTitle: {
    marginTop: scaleY(51),
    fontSize: scaleY(18),
    lineHeight: scaleY(27),
    maxWidth: scaleY(340),
    fontFamily: 'Poppins_500Medium',
    fontWeight: '500',
    color: '#E3E1E7',
    textAlign:'center'
  },
  upgradeBtn: {
    marginTop: scaleY(37),
    maxWidth: scaleY(320),
  },
  upgradeBtnImg: {
    width: scaleY(320),
    height: scaleY(96),
    resizeMode: 'contain'
  },
});

const mapStateToProps = (state: ApplicationState) => ({
  userReducer: state.userReducer,
});

const SavedDeck = connect(mapStateToProps, { })(
  _SavedDeck
);

export default SavedDeck;

