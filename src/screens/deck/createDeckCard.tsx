import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  ImageBackground,
  TextInput,
  ActivityIndicator,
  Modal,
} from "react-native";
import mainBg from "../../assets/mainBg.png";
import { NavigationScreenProp } from "react-navigation";
import { useRoute } from '@react-navigation/native';
import { connect } from "react-redux";
import {ApplicationState} from "../../redux";
import topbarBackIcon from '../../assets/common/topbarBackIcon.png'
import backIcon from '../../assets/common/backIcon.png'
import removeIcon from '../../assets/common/removeIcon.png'
import trashIcon from '../../assets/common/trashIcon.png'
import cardBg from '../../assets/deck/createCard/cardBg.png'
import cardPlayBg from '../../assets/deck/createCard/cardPlayBg.png'
import txtareaBg from '../../assets/deck/createCard/txtareaBg.png'
import limitCardImg from '../../assets/screenBg/limitCardImg.png'
import upgradeBtn from '../../assets/screenBg/upgradeMBtn.png'
import cofirmIcon from "../../assets/common/cofirmIcon.png"
import saveDeckBtn from '../../assets/btns/saveDeckBtn.png'
import frontActiveBtn from '../../assets/btns/frontActiveBtn.png'
import frontBtn from '../../assets/btns/frontBtn.png'
import noteActiveBtn from '../../assets/btns/noteActiveBtn.png'
import noteBtn from '../../assets/btns/noteBtn.png'
import transActiveBtn from '../../assets/btns/transActiveBtn.png'
import transBtn from '../../assets/btns/transBtn.png'
import { AntDesign , Ionicons} from '@expo/vector-icons'; 
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';
import CustomModal from "../component/CustomModal";
import { useFonts, Montserrat_700Bold , Montserrat_500Medium, Montserrat_600SemiBold} from '@expo-google-fonts/montserrat';
import {Inter_500Medium, Inter_700Bold} from '@expo-google-fonts/inter';
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { getFirestore, addDoc, doc, getDoc, collection,deleteDoc, onSnapshot, updateDoc, setDoc} from 'firebase/firestore';
import { scaleX, scaleY } from "../../core/theme/dimensions";
import { getFunctions, httpsCallable } from 'firebase/functions';
import moment from "moment";

interface Props {
  navigation: NavigationScreenProp<any, any>;
  userReducer: any;
  route: NavigationScreenProp<any, any>;
}


interface deckCardInterface  {
  cardIndex: number; 
  frontTxt: string,
  frontTxtAudio: string,
  audioFileSize: number
  transTxt: string,
  notesTxt: string,
}

const _CreateDeckCard: React.FC<Props> = (props: Props) => {  
  const route:any = useRoute();
  const {deckData, deckId } = route.params;  
  const timeout:any = React.useRef(null);

  const [cardInputType, setCardInputType] = useState('front')
  const [deckCardList, setDeckCardList] = useState<deckCardInterface[]>([])
  const [activeCardIndex, setActiveCardIndex] = useState(0)

  const [frontTxt, setFrontTxt] = useState('')
  const [transTxt, setTransTxt] = useState('')
  const [notesTxt, setNotesTxt] = useState('')
  
  const [showRemoveBtn, setShowRemoveBtn] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [createSuccessModalVisible, setCreateSuccessModalVisible] = useState(false)
  const [userId, setUserId] = useState('')
  const [frontTxtAudio, setFrontTxtAudio] = useState('')
  const [audioFileSize, setAudioFileSize] = useState(0)
  const [isAdmin , setIsAdmin] = useState(false)
  const [curUser, setCurUser] = useState<any>({})  
  const [showLoading, setShowLoading] = useState(false)
  const [newDeckId, setNewDeckId] = useState('')
  const [todayCreatedDeckCount, setTodayCreatedDeckCount] = useState(0)
  const [showCardLimitModal, setShowCardLimitModal] = useState(false)

  useEffect(() => {    
    props.userReducer?.then((userData:any)=>{
      setUserId(userData?.userId)
      setIsAdmin(userData?.curUser?.isAdmin)
      setCurUser(userData?.curUser)
      if(userData?.curUser?.userType === 'free') {
        getTodayCeatedDeckCount(userData?.userId)
      }
      if(deckId) {
        console.log('y', deckId)
        const firestore = getFirestore()    
        if(userData?.curUser?.userType !== 'contentCreator') {
          getDoc(doc(firestore, "Users", userData?.userId, "Decks", deckId))
          .then((deck:any) => {
            let detailData = deck.data();     
            let deteailCardData = detailData?.cards  
            let firstCardItem:any = deteailCardData[0]
            setDeckCardList(deteailCardData)
            setFrontTxt(firstCardItem['frontTxt'])
            setFrontTxtAudio(firstCardItem['frontTxtAudio'])
            setAudioFileSize(firstCardItem['audioFileSize'])
            setTransTxt(firstCardItem['transTxt'])
            setNotesTxt(firstCardItem['notesTxt'])
          })
          .catch((e) => {
              console.log(e)
          });   
        }
        else {
          getDoc(doc(firestore, "Decks", deckId))
          .then((deck:any) => {
            let detailData = deck.data();     
            let deteailCardData = detailData?.cards  
            let firstCardItem:any = deteailCardData[0]
            setDeckCardList(deteailCardData)
            setFrontTxt(firstCardItem['frontTxt'])
            setFrontTxtAudio(firstCardItem['frontTxtAudio'])
            setAudioFileSize(firstCardItem['audioFileSize'])
            setTransTxt(firstCardItem['transTxt'])
            setNotesTxt(firstCardItem['notesTxt'])
          })
          .catch((e) => {
              console.log(e)
          });   
        }        
      }
      else {
        console.log('no id deck card page')
      }
    })
    
  }, [props.userReducer]);

  useEffect(() => {
    const firestore = getFirestore()    
    const unsub = onSnapshot(collection(firestore, 'Category'), (querySnapshot) => {
      let cardCatList:any[] = []
      let videoCatList:any[] = []

      querySnapshot.docs.map((doc) => {       
        let catData = doc.data()
        let newData = {
          ...doc.data(),
          uid: doc.id
        }
        if(catData.catType == 'card') {
          cardCatList.push(newData)
        }
        else {
          videoCatList.push(newData)
        }
      });
    });
    return () => unsub();
  }, [])

  const getTodayCeatedDeckCount = (userId:string) => {
    const firestore = getFirestore()  
    let todayMomentIndex = moment().startOf('day').valueOf()
    getDoc(doc(firestore, "Users", userId, "everyDayCreatedDeckCount", todayMomentIndex+''))
      .then((deckCountData:any) => {    
        let deckCountDetail = deckCountData.data()
        if(deckCountDetail) {
          setTodayCreatedDeckCount(deckCountDetail?.createdCount)
        }
      })  
  }
  /////////////////////for audio and slider ////////////////////

  const [Loaded, SetLoaded] = React.useState(false);
  const [Loading, SetLoading] = React.useState(false);
  const [Playing, SetPlaying] = React.useState(false);
  const [Duration, SetDuration] = React.useState(0);
  const [Value, SetValue] = React.useState(0);
  let sound = React.useRef(new Audio.Sound());

  const addNewSound = async () => {
    if(sound) {
      await sound.current.unloadAsync();
      SetDuration(0)
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
        await sound.current.setPositionAsync(0);
        await sound.current.stopAsync();
        SetValue(0);
        SetPlaying(false);
      }
    } catch (error) {
      console.log('Error');
    }
  };

  const PlayAudio = async () => {
    if(Loading) return
    try {
      const result = await sound.current.getStatusAsync();
      if (result.isLoaded) {
        if (result.isPlaying === false) {
          sound.current.playAsync();
          SetPlaying(true);
        }
      }
    } catch (error) {
      SetPlaying(false);
    }
  };

  const PauseAudio = async () => {
    if(Loading) return
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
    if(Loading) return
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
            { uri: frontTxtAudio },
            {},
            true
          );
          if (result.isLoaded === false) {
            SetLoading(false);
            SetLoaded(false);
          } else {
            sound.current.setOnPlaybackStatusUpdate(UpdateStatus);
            SetLoading(false);
            SetLoaded(true);
            SetDuration(result.durationMillis!);
          }
        } catch (error) {
          console.log(error, 'error ttt')
          SetLoading(false);
          SetLoaded(false);
        }
      } else {
        SetLoading(false);
        SetLoaded(true);
      }
    };
    if(frontTxtAudio) LoadAudio()
    .catch((e) => console.log(e,'load error'));
  }, [frontTxtAudio])

  

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

  const centerIconPress = () => {
    if(showRemoveBtn) {   
      setDeleteModalVisible(true)
    }
    else {
      props.navigation.goBack()
    }    
  }

  const createDeck = () => {    
    if(Loading) return
    setShowLoading(true)    
    const {title, desc, isMale, level, deckType, isCardDeck, videoUrl, 
      spotifyUrl, deckImgUrl, isPublic} = deckData
    const firestore = getFirestore();
    let customDeckList = deckCardList
    if((activeCardIndex === deckCardList.length) && frontTxt) {
      customDeckList = deckCardList.concat({
        cardIndex: activeCardIndex,
        frontTxt,
        frontTxtAudio,
        audioFileSize,
        transTxt,
        notesTxt,
      })      
    }
    else if(deckId) {
      let curDeckCardItem = customDeckList[activeCardIndex]
     if(curDeckCardItem) {
        curDeckCardItem['cardIndex'] = activeCardIndex
        curDeckCardItem['frontTxt'] = frontTxt
        curDeckCardItem['frontTxtAudio'] = frontTxtAudio
        curDeckCardItem['audioFileSize'] = audioFileSize
        curDeckCardItem['transTxt'] = transTxt
        curDeckCardItem['notesTxt'] = notesTxt
        customDeckList[activeCardIndex] = curDeckCardItem    
     }
      
    }

    const saveDeckData:any = {
      title,
      desc,
      isMale,
      level,
      deckType,
      isCardDeck,
      deckImgUrl,
      cards: customDeckList,
      isPublic,
      createdTime: moment().valueOf()
    }
    if(!isCardDeck) {   
      if(curUser?.userType !== 'free') {
        saveDeckData['videoUrl'] = videoUrl
      }      
      saveDeckData['spotifyUrl'] = spotifyUrl      
    }
    if(deckId) {
      if(curUser.userType !== 'contentCreator') {
        updateDoc(doc(firestore, "Users", userId, 'Decks' , deckId), saveDeckData)
        .then(() => {
           setShowLoading(false)
           setCreateSuccessModalVisible(true)
        })
        .catch((e:any) => {
           setShowLoading(false)
           console.log(e, 'add error')
        });
      }
      else {
        updateDoc(doc(firestore, "Decks", deckId), saveDeckData)
        .then(() => {
            setShowLoading(false)
           setCreateSuccessModalVisible(true)
        })
        .catch((e:any) => {
           setShowLoading(false)
           console.log(e, 'add error')
        });
      }
      
    }
    else {
      saveDeckData['ratingVal'] = 0
      saveDeckData['userId'] = userId
      if(curUser.userType !== 'contentCreator') {
        addDoc(collection(firestore, "Users", userId, 'Decks'), saveDeckData)
        .then((docdata:any) => {
          if(curUser?.userType === 'free') {
            let todayMomentIndex = moment().startOf('day').valueOf() + ''            
            setDoc(doc(firestore, 'Users', userId, "everyDayCreatedDeckCount", todayMomentIndex), {
              createdCount:  todayCreatedDeckCount + 1,
            })
            .then(() => {

            })
          }
          setNewDeckId(docdata.id)
          setShowLoading(false)
          setCreateSuccessModalVisible(true)
        })
        .catch((e:any) => {
          setShowLoading(false)
          console.log(e, 'add error')
        });
      }
      else {
        addDoc(collection(firestore, "Decks"), saveDeckData)
        .then((doc:any) => {
          setNewDeckId(doc.id)
          setShowLoading(false)
          setCreateSuccessModalVisible(true)
        })
        .catch((e:any) => {
          setShowLoading(false)
          console.log(e, 'add error')
        });
      }
    }
  }

  const backToLastCard = () => {
    if(activeCardIndex > 0) {
      addNewSound()
      .then(() => {
        let cardDetail = deckCardList[activeCardIndex - 1]
        setFrontTxt(cardDetail?.frontTxt)
        setFrontTxtAudio(cardDetail?.frontTxtAudio)
        setAudioFileSize(cardDetail?.audioFileSize)
        setTransTxt(cardDetail?.transTxt)
        setNotesTxt(cardDetail?.notesTxt)
        setCardInputType('front')
        setActiveCardIndex(activeCardIndex - 1)
        setShowRemoveBtn(true)
      })     
    }
    else {
      setShowRemoveBtn(false)
      props.navigation.goBack()
    }
  }

  const gotoNextCard = () => {    
    if(!frontTxtAudio && curUser?.userType !== 'free') return
    if((curUser?.userType === 'free') && activeCardIndex >= 19 ) {
      setShowCardLimitModal(true)
      return
    }
    ResetPlayer().then(() => {
      addNewSound()
      .then(() => {
        if(deckCardList[activeCardIndex + 1]) {
          let curDeckCardItem = deckCardList[activeCardIndex]
         if(curDeckCardItem) {
          curDeckCardItem['cardIndex'] = activeCardIndex
          curDeckCardItem['frontTxt'] = frontTxt
          curDeckCardItem['frontTxtAudio'] = frontTxtAudio
          curDeckCardItem['audioFileSize'] = audioFileSize
          curDeckCardItem['transTxt'] = transTxt
          curDeckCardItem['notesTxt'] = notesTxt
          deckCardList[activeCardIndex] = curDeckCardItem
          setDeckCardList(deckCardList)
         }
    
          let cardDetail = deckCardList[activeCardIndex + 1]
          setFrontTxt(cardDetail?.frontTxt)
          setFrontTxtAudio(cardDetail?.frontTxtAudio)
          setAudioFileSize(cardDetail?.audioFileSize)
          setTransTxt(cardDetail?.transTxt)
          setNotesTxt(cardDetail?.notesTxt)
          setShowRemoveBtn(true)
        }
        else {
          if((activeCardIndex + 1) !== deckCardList?.length) {      
            deckCardList.push({
              cardIndex: activeCardIndex,
              frontTxt,
              frontTxtAudio,
              audioFileSize,
              transTxt,
              notesTxt,
            })
            setDeckCardList(deckCardList)
          }
          setFrontTxt('')
          setFrontTxtAudio('')
          setAudioFileSize(0)
          setTransTxt('')
          setNotesTxt('')
          setShowRemoveBtn(false)
        }
      })
    })    
      
    setActiveCardIndex(activeCardIndex + 1)
    setCardInputType('front')
    
  }

  const renderSuccessModalTxtContent = () => {
    return (
      <View style={[styles.modalTxtContent, styles.successModalContent]}>
        <Text style={styles.modalContentTxt}>
            You have 
          <Text style={[styles.modalContentTxt, styles.successColorTxt]}> sucessfully</Text>
           {deckId ? ' updated your deck.' : ' created a new deck.' }
        </Text>        
      </View>
    )
  }

  const closeCreateModal = () => {
    setCreateSuccessModalVisible(false)
    handleNavigate('profiletab')
  }

  const gotoEditDeck = () => {
    setCreateSuccessModalVisible(false)
    let deckIdParam = deckId ? deckId : newDeckId
    let screenParam = deckData?.isCardDeck ? 'createMediaDeck' : 'createVideoDeck'
    let isUserOnlyDeck = curUser.userType !== 'contentCreator' ? true : false
    props.navigation.navigate(screenParam, {deckId: deckIdParam, isUserOnlyDeck})
  }

  const rednerDeleteModalTxtContent = () => {
    return (
      <View style={styles.modalTxtContent}>
        <Text style={styles.modalContentTxt}>
          Are you sure you want to permanently 
          <Text style={[styles.modalContentTxt, styles.delColorTxt]}> delete </Text>
          this card?
        </Text>        
      </View>
    )
  }

  const deleteCard = () => {
    ResetPlayer().then(() => {
      addNewSound()      
    })
    let index = deckCardList.indexOf(deckCardList[activeCardIndex])
    if (index !== -1) {
      deckCardList.splice(index, 1);
      let cardDetail = deckCardList[activeCardIndex]
      setFrontTxt(cardDetail?.frontTxt)
      setFrontTxtAudio(cardDetail?.frontTxtAudio)
      setAudioFileSize(cardDetail?.audioFileSize)
      setTransTxt(cardDetail?.transTxt)
      setNotesTxt(cardDetail?.notesTxt)
      setCardInputType('front')

      setDeckCardList(deckCardList)
    }
    else if(activeCardIndex == deckCardList.length) {    
      if(activeCardIndex > 0) {
        let cardDetail = deckCardList[activeCardIndex - 1]
        setFrontTxt(cardDetail?.frontTxt)
        setFrontTxtAudio(cardDetail?.frontTxtAudio)
        setAudioFileSize(cardDetail?.audioFileSize)
        setTransTxt(cardDetail?.transTxt)
        setNotesTxt(cardDetail?.notesTxt)
        setCardInputType('front')
        deckCardList.splice(deckCardList.length - 1, 1);
        setActiveCardIndex(activeCardIndex - 1)
      }
      else {
        setShowRemoveBtn(false)
        props.navigation.goBack()
      }
    }
    
    setDeleteModalVisible(false)
    
  }

  const cancelDelete = () => {
    setDeleteModalVisible(false)
  }

  const getFrontTxtAudio = (txt:string) => {
    let voiceId = deckData?.isMale ? 'ja-JP-NaokiNeural' : 'ja-JP-ShioriNeural'
    let  sendObj:any = new FormData()
    sendObj.append('voice_id',voiceId)
    sendObj.append('transcribe_text[]',txt)
    sendObj.append('engine','neural')
    sendObj.append('title', txt)
    sendObj.append('name', 'momento')
    sendObj.append('transcribe_ssml_spk_rate[]', '90')
    sendObj.append('gender', deckData?.isMale ? 'Male': 'Female')
    SetLoading(true)
    fetch('https://aivoov.com/api/v1/convert', {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Access-Control-Allow-Origin':'*',
        'X-API-KEY': '57e5d11c-4315-47a7-8c53-15374196172e'
      },
      body: sendObj
    })
    .then(response => response.json())
    .then(data => {
      SetLoading(false)
      addNewSound(); 
      getAudioFileSize(data.transcribe_uri)
    })
    .catch((e) => {SetLoading(false);console.log(e,'errorPPP')})
  }
  const getAudioFileSize = async (audioUrl:string) => {
    const functions = getFunctions()    
    SetLoading(true)
    const getFileSize = httpsCallable(functions, 'getFileSize')  ;     
    
    const response:any = await getFileSize({
      fileUrl: audioUrl,
    })
    .catch((e) => {SetLoading(false); console.log(e,'error e')})
    SetLoading(false)
    setAudioFileSize(response?.data)
    setFrontTxtAudio(audioUrl);  
  }
  const onChangeFrontTxt = (txt:string) => {    
    setFrontTxt(txt);
    
    if(curUser?.userType !== 'free') {
      if(txt !== '') {
        clearTimeout(timeout.current);      
        timeout.current = setTimeout(()=>{
          ResetPlayer().then(() => {
            getFrontTxtAudio(txt)
          })
        }, 3000);
      }
      else {
        ResetPlayer().then(() => {
          addNewSound()
        })
      }
    }

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
          <View style={styles.titleWithBack}>
            <TouchableOpacity onPress={()=> backToLastCard()}>
              <Image source={topbarBackIcon} 
                style={{
                  width: scaleX(37),
                  height: scaleX(31),
                  resizeMode: 'contain'
                }} />
            </TouchableOpacity>
            <Text style={styles.createTxt}>Create</Text>
          </View>
          <View style={[styles.cardBgContainer, styles.rowContainer]}>
            <ImageBackground source={cardBg} resizeMode="cover" style={[styles.cardBgSytle, styles.rowContainer]}>
              <Text style={styles.cardTxt}>Card</Text>
              <Text style={[styles.cardTxt,styles.cardNum]}>{activeCardIndex + 1}/{deckCardList.length + 1}</Text>
            </ImageBackground>
          </View>
          <View style={styles.cardInputTypeContainer}>
            <View style={styles.cardTypeTab}>
              <TouchableOpacity onPress={()=>setCardInputType('front')}>
                <Image source={cardInputType == 'front' ? frontActiveBtn: frontBtn} style={styles.frontBtn} />
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>setCardInputType('trans')}>
                <Image source={cardInputType == 'trans' ? transActiveBtn: transBtn} style={styles.transBtn} />
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>setCardInputType('notes')}>
                <Image source={cardInputType == 'notes' ? noteActiveBtn: noteBtn} style={styles.noteBtn} />
              </TouchableOpacity>
            </View>

            {cardInputType == 'front' && 
            <View style={styles.textareaContainer}>
              <ImageBackground source={txtareaBg} resizeMode="cover" style={[styles.txtareabgImg, styles.rowContainer]}>
                <TextInput 
                  placeholder="Card Front" 
                  placeholderTextColor={'#968FA4'}              
                  numberOfLines={8}
                  multiline={true}
                  editable
                  value={frontTxt}
                  onChangeText={(txt) => onChangeFrontTxt(txt)}
                  style={[styles.inputStyle, styles.textAreaStyle]}/>
                </ImageBackground>
            </View>
            }

            {cardInputType == 'trans' && 
              <View style={styles.textareaContainer}>
                <ImageBackground source={txtareaBg} resizeMode="cover" style={[styles.txtareabgImg, styles.rowContainer]}>              
                  <TextInput 
                    placeholder="Translation" 
                    placeholderTextColor={'#968FA4'}              
                    numberOfLines={8}
                    multiline={true}
                    editable
                    value={transTxt}
                    onChangeText={(txt) => setTransTxt(txt)}
                    style={[styles.inputStyle, styles.textAreaStyle]}/>
                  </ImageBackground>
                </View>
            }

            {cardInputType == 'notes' && 
              <View style={styles.textareaContainer}>
                <ImageBackground source={txtareaBg} resizeMode="cover" style={[styles.txtareabgImg, styles.rowContainer]}>
                  <TextInput 
                    placeholder="Notes" 
                    placeholderTextColor={'#968FA4'}              
                    numberOfLines={8}
                    multiline={true}
                    editable
                    value={notesTxt}
                    onChangeText={(txt) => setNotesTxt(txt)}
                    style={[styles.inputStyle, styles.textAreaStyle]}/>
                </ImageBackground>
              </View>
            }
            
          </View>
          {cardInputType == 'front' &&  curUser?.userType !== 'free' &&
          <View style={styles.audioPlayerContainer}>
            <ImageBackground source={cardPlayBg} resizeMode="cover" style={styles.cardPlayBgContainer}>
              <TouchableOpacity 
                disabled={Loading}
                style={styles.audioPlayIcon}            
                onPress={Playing ? () => PauseAudio() : () => PlayAudio()}>
                  {
                    Loading ? <ActivityIndicator /> :
                    Playing ? <Ionicons name="md-pause" size={scaleX(25)} color="white" />
                    : <Ionicons name="md-play" size={scaleX(25)} color="white" />
                  }                
              </TouchableOpacity>
              <Slider
                style={styles.audioSlider}
                minimumValue={0}
                maximumValue={100}
                value={Value}
                onSlidingComplete={(data) => SeekUpdate(data)}
                minimumTrackTintColor={'#FF8C22'}
                maximumTrackTintColor={'#465063'}
                thumbTintColor={'#FF8C2258'}
              />
              <Text style={styles.durationTxt}>
                {Playing
                  ? GetDurationFormat((Value * Duration) / 100)
                  : GetDurationFormat(Duration)}
              </Text>
            </ImageBackground>
          </View>
          }
         
          <View style={styles.createDeckBtnContainer}>
            <TouchableOpacity 
              disabled={Loading || showLoading}
              style={styles.createDeckBtn} onPress={createDeck}>
              <Image source={saveDeckBtn} style={styles.createDeckBtnImg} />
            </TouchableOpacity>
            {showLoading && <ActivityIndicator />}
            <TouchableOpacity 
              disabled={Loading || showLoading || !frontTxt}
              style={styles.createDeckBtn} onPress={()=>gotoNextCard()}>
              <Text style={styles.nextCardTxt}>Next Card <AntDesign name="arrowright" size={18} color="#f4f4f4" /></Text>              
            </TouchableOpacity>
          </View>
        </ScrollView>
        <CustomModal 
          modalVisible={createSuccessModalVisible} 
          modalIcon={cofirmIcon}
          isRating={false}
          ratingVal={0}
          renderModalTxtContent={renderSuccessModalTxtContent}
          modalSubTxt={''}
          primaryBtnTxt={'Exit'}
          cancelBtnTxt={'Edit'}
          primaryAction={closeCreateModal}
          cancelAction={gotoEditDeck}
        />
        <CustomModal 
          modalVisible={deleteModalVisible} 
          modalIcon={trashIcon}
          isRating={false}
          ratingVal={0}
          renderModalTxtContent={rednerDeleteModalTxtContent}
          modalSubTxt='You can’t undo this action.'
          primaryBtnTxt={'Delete'}
          cancelBtnTxt={'Cancel'}
          primaryAction={deleteCard}
          cancelAction={cancelDelete}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={showCardLimitModal}>
            <TouchableOpacity style={styles.centerContainer} onPress={() => setShowCardLimitModal(false)} >
              <TouchableWithoutFeedback style={styles.relativeContainer}>
                <View>
                  <Image source={limitCardImg} style={styles.limitCardImgStyle} />
                  <TouchableOpacity
                    onPress={()=>{setShowCardLimitModal(false) ; handleNavigate('upgradeAccount')}}
                    style={styles.upgradeBtn}
                    >
                    <Image source={upgradeBtn} style={styles.upgradeBtnImg} />
                  </TouchableOpacity>
                </View>
                
              </TouchableWithoutFeedback>              
            </TouchableOpacity>
        </Modal>
        <TouchableOpacity onPress={()=> setDeleteModalVisible(true)} style={styles.actionContainer} >
          <Image source={removeIcon} style={styles.actionIcon} />          
        </TouchableOpacity>       
        
      </ImageBackground>      
    </View>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  relativeContainer: {
    position: 'relative'
  },
  limitCardImgStyle: {
    width: scaleX(261),
    height: scaleX(520),
    resizeMode: 'contain'
  },
  upgradeBtn: {
    position: 'absolute',
    bottom: scaleX(0),
    left: scaleX(0),
    right: scaleX(0),
    justifyContent: 'center',
    alignItems: 'center'
  },
  upgradeBtnImg: {
    width: scaleX(261),
    height: scaleX(139),    
    resizeMode: 'contain',
  },
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
    alignItems: 'center',
    // marginTop: scaleX(20),
    marginBottom: scaleX(50),
    paddingRight: scaleX(37),
  },
  createTxt: {
    flex: 1,
    fontWeight: '600',
    fontSize: scaleX(24),
    color: '#EFEBF6',
    textAlign:'center'
  },
  inputStyle: {
    color: 'white',
    fontSize: scaleX(20),
    fontFamily: 'Montserrat_600SemiBold'
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cardBgContainer: {
    borderWidth: scaleX(1),
    borderColor: '#A293BE',
    height: scaleX(71),
    borderRadius: scaleX(12),
    overflow: "hidden"
  },
  cardBgSytle: {
    flex: 1,
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,    
  },
  textareaContainer: {
    borderWidth: scaleX(1),
    borderColor: '#A293BE',
    height: scaleX(234),
    borderRadius: scaleX(13.8),
    overflow: "hidden",
    marginTop: scaleX(29)
  },
  txtareabgImg: {
    flex: 1,
    padding: 20,
  },
  cardTxt: {
    fontSize: scaleX(24),
    lineHeight: scaleX(33),
    color: '#EEECF4',
    fontWeight: '700',
    fontFamily: 'Inter_700Bold'
  },
  cardNum: {
    color: '#5ADBED',
    fontFamily: 'Inter_700Bold'
  },
  cardInputTypeContainer: {
    marginTop: scaleX(29),
  },
  cardTypeTab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  cardTypeTxt: {
    backgroundColor: '#26273F',
    borderRadius: scaleX(32),
    fontSize: scaleX(14),
    fontWeight: '500',
    lineHeight: scaleX(20),
    paddingTop: scaleX(6),
    paddingBottom: scaleX(6),
    paddingLeft: scaleX(16),
    paddingRight: scaleX(16),
    color: '#A0A0AB',
    fontFamily: 'Poppins_500Medium'
  },
  activeCardTyeTxt: {
    color: '#FFF960'
  },
  textAreaStyle: {
    flex:1,
    height: scaleX(194),
    justifyContent: "flex-start",
    textAlignVertical: 'top',
  },
  createDeckBtnContainer: {
    marginTop: scaleX(7),
    marginBottom: scaleX(90),
    justifyContent: 'center',
    alignItems: 'center'
  },
  createDeckBtn: {
    marginTop:scaleX(23),
    justifyContent: 'center',
    alignItems: 'center'
  },
  createDeckBtnImg: {
    width: scaleX(178),
    height: scaleX(55),
    resizeMode: 'contain'
  },
  audioPlayerContainer: {
    marginTop: scaleX(43),
    borderWidth: scaleX(1),
    borderColor: '#A293BE',
    borderRadius: scaleX(12),
    overflow: "hidden"
  },
  cardPlayBgContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: scaleX(16),
    flex: 1,
  },
  audioPlayIcon: {
    width: scaleX(25),
    marginRight: scaleX(10),
  },
  audioSlider: {
    flex: 1,
    marginRight: scaleX(10),
    //  transform: [{ scaleY: 4 }]
  },
  durationTxt: {
    fontSize: scaleX(12),
    fontWeight: '700',
    lineHeight: scaleX(19),
    color: 'white',
  },
  nextCardTxt: {
    color: '#F4F4F4',
    fontSize: scaleX(18),
    fontWeight: '600',
    lineHeight: scaleX(19),
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Montserrat_600SemiBold'
  },
  modalTxtContent: {
    justifyContent: 'center',
    maxWidth: scaleX(200),
  },
  successModalContent: {
    maxWidth: scaleX(180),
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
    color: '#64FF86',
    fontWeight: '700',
    fontFamily: 'Montserrat_700Bold'
  },
  frontBtn: {
    width: scaleX(68),
    height: scaleX(32),
    resizeMode: 'contain'
  },
  transBtn: {
    width: scaleX(112),
    height: scaleX(32),
    resizeMode: 'contain'
  },
  noteBtn: {
    width: scaleX(73),
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
});

const mapStateToProps = (state: ApplicationState) => ({
  userReducer: state.userReducer,
});

const CreateDeckCard = connect(mapStateToProps, { })(
  _CreateDeckCard
);

export default CreateDeckCard;
