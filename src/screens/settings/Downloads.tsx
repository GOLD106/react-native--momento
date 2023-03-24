import React , {useEffect, useState} from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import mainBg from "../../assets/mainBg.png";
import downloadListIcon from "../../assets/deck/downloadListIcon.png";
import downloadedIcon from "../../assets/deck/downloadedIcon.png";
import { connect } from "react-redux";
import {ApplicationState} from "../../redux";
import { NavigationScreenProp } from "react-navigation";
import BottomNavigator from "../component/BottomNavigator";
import unlockFeature from "../../assets/common/unlockFeature.png"
import cardDeck from "../../assets/common/cardDeck.png";
import profileNoBgImg from "../../assets/common/noImg/profileNoBgImg.png"
import profileNoImg from "../../assets/common/noImg/profileNoImg.png"
import mediaDeckNoImg from "../../assets/common/noImg/mediaDeckNoImg.png"
import videoDeckNoImg from "../../assets/common/noImg/videoDeckNoImg.png"
import jojo from "../../assets/common/jojo.png";
import Slider from '@react-native-community/slider';
import { useFonts,  Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold} from '@expo-google-fonts/montserrat';
import {Inter_500Medium, Inter_700Bold} from '@expo-google-fonts/inter';
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";
import TopBarLeftArrow from "../component/TobBarLeftArrow";
import { scaleX, scaleY } from "../../core/theme/dimensions";
import { getFirestore, addDoc, doc, getDoc,  collection,updateDoc, onSnapshot, query, where} from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';

const deckDir = FileSystem.cacheDirectory + 'decks/';
const gifFileUri = (localUrl: string) => deckDir + `frontAudio_${localUrl}_card.mp3`;
const totalStars = 5;

interface Props {
  navigation: NavigationScreenProp<any, any>;
  userReducer: any;
}

const _Downloads: React.FC<Props> = (props: Props) => { 
 
  const [userSavedMediaDeckList, setUserSavedMediaDeckList] = useState<any>([])
  const [userSavedVideoDeckList, setUserSavedVideoDeckList] = useState<any>([])
  const [curUserData, setCurUserData] = useState<any>({})
  const [curUserId, setCurUserId] = useState('')
  const [loading, setLoading] =  useState(false)
  const [downloadDeckList, setDownloadDeckList] = useState<any>([])  
  const [localData , setLocalData] = useState<any>([])  

  useEffect (() => {
    AsyncStorage.getItem('downloadDeckList').then((data:any) => {
      if(data) {
        setDownloadDeckList(JSON.parse(data))
      }            
    })
  },[localData])


  useEffect(() => {    
    props.userReducer?.then((userData:any)=>{  
      setCurUserData(userData?.curUser)
      setCurUserId(userData?.userId)
      getUserSavedDeck(userData?.userId)
    })
  }, [props.userReducer]);

  
  const getUserSavedDeck = (userId: string) => {
    const firestore = getFirestore()    
    NetInfo.fetch().then(state => {     
      if(state.isConnected) {
        onSnapshot(collection(firestore, "Users", userId, 'SavedDecks'), (querySnapshot) => {      
          let userSavedMediaDecks:any[] = []
          let userSavedVideoDecks:any[] = []
          querySnapshot.docs.map(async(progressDeckData) => {       
            await getDoc(doc(firestore, 'Decks', progressDeckData?.id))
                  .then((deckData:any) => {
                    if(deckData.data()) {
                      let newData = {
                        ...deckData.data(),
                        uid: deckData.id,
                      }
                      if(deckData.data()?.isCardDeck) {
                        userSavedMediaDecks.push(newData)
                        setUserSavedMediaDeckList(userSavedMediaDecks)
                      }
                      else {
                        userSavedVideoDecks.push(newData)
                        setUserSavedVideoDeckList(userSavedVideoDecks)
                      }               
                    }                        
                  })
          }); 
        })
      }
      else {
        AsyncStorage.getItem('downloadDeckList').then((data:any) => {
          let downloadDeckList = JSON.parse(data)     
          let userSavedMediaDecks:any[] = []
          let userSavedVideoDecks:any[] = []
          downloadDeckList.map((item:any) => {
            if(item.isCardDeck) {
              userSavedMediaDecks.push(item)
              setUserSavedMediaDeckList(userSavedMediaDecks)
            }
            else {
              userSavedVideoDecks.push(item)
              setUserSavedVideoDeckList(userSavedVideoDecks)
            }
          })
        })
       
      }
    });
  }

  const handleNavigate = (screen: string): void => {
    props.navigation.navigate(screen);
  };

  const gotoAddDeck = () => {
    handleNavigate('selectdeckType')
  }
 
  const renderInProgressDecks = ({ item, index }: { item: any, index: number }) => (
          <TouchableOpacity style={styles.inprogressItem} key={index} 
            onPress={() => {props.navigation.navigate('playDeck', {deckDetailData: item, deckId: item?.uid})}}>
            <Image source={item.deckImgUrl ? {uri: item.deckImgUrl} : mediaDeckNoImg} style={styles.inprogressDeckImg} />
            <View style={styles.inprogressItemContent}>
              <View style={styles.titleAndCardsCount}>
                <Text style={styles.inprogressDeckTitle} numberOfLines={1} ellipsizeMode='tail' >{item.title}</Text>
                <Text style={[styles.cardCount, downloadDeckList?.some((el:any) => el.uid === item?.uid) && styles.activeColor]}>{item?.cards?.length} Cards</Text>
              </View>
              <View style={styles.titleAndCardsCount}>
                <View style={styles.container}>
                  <Text style={styles.deckType}> {item.deckType}</Text>
                  <View style={styles.relativeView}>
                    <View style={styles.cardsProgressBar}>
                      <Slider
                          style={styles.progressSlider}
                          minimumValue={0}
                          maximumValue={100}
                          disabled={true}
                          value={downloadDeckList?.some((el:any) => el.uid === item?.uid) ? 100 : 0}                    
                          minimumTrackTintColor={'#5ADBED'}
                          maximumTrackTintColor={'#465063'}
                          thumbTintColor={'#5ADBED58'}
                        />
                      <Text style={[styles.progressPercentTxt, !downloadDeckList?.some((el:any) => el.uid === item?.uid) && styles.downloadTxt]}>{(downloadDeckList?.some((el:any) => el.uid === item?.uid) ? 100 : 0) + '%'}</Text>
                    </View>
                    <View style={styles.overwrapView} />
                  </View>
                </View>
                <View>
                  <TouchableOpacity onPress={() => addMultipleCards(item)}
                    disabled={downloadDeckList?.some((el:any) => el.uid === item?.uid)}
                    >
                    <Image source={downloadDeckList?.some((el:any) => el.uid === item?.uid) ? downloadedIcon : downloadListIcon} style={styles.downloadListIcon} />
                  </TouchableOpacity>
                </View>
              </View>
              
            </View>
          </TouchableOpacity>
  )

// Checks if gif directory exists. If not, creates it
const ensureDirExists = async() => {
  const dirInfo = await FileSystem.getInfoAsync(deckDir);
  if (!dirInfo.exists) {
    console.log("deck directory doesn't exist, creating...");
    await FileSystem.makeDirectoryAsync(deckDir, { intermediates: true });
  }
}

// Downloads all gifs specified as array of IDs
const addMultipleCards = async(deckData: any) => {
  let cards = deckData?.cards
  let deckID = deckData?.uid
  setLoading(true)
  try {
    await ensureDirExists();
    await Promise.all(cards.map((card:any) => FileSystem.downloadAsync(card?.frontTxtAudio, gifFileUri(deckID+card?.cardIndex))));
    console.log('card audio files download Finished')
    
    let promises = cards?.map(async(item:any, index:any) => {
      let frontCardAudio = await getAudioContentUri(deckData?.uid, index, item?.frontTxtAudio)
      cards[index]!.frontTxtAudio = frontCardAudio
    })

    Promise.all(promises).then(function(results) {
      deckData!.cards = cards
      downloadDeckList.push(deckData)
      AsyncStorage.setItem('downloadDeckList', JSON.stringify(downloadDeckList))
      .then(() => {      
        setDownloadDeckList(downloadDeckList)
        setLocalData(downloadDeckList)
      })   
      setLoading(false)
    })
   
    
    
  } catch (e) {
    setLoading(false)
    console.error("Couldn't download audio files:", e);
  }
}

// Returns URI to our local gif file
// If our gif doesn't exist locally, it downloads it
const  getSingleCardAudio = async(deckId: string, cardIndex: string, frontTxtAudio: string) => {
  await ensureDirExists();
  const fileUri = gifFileUri(deckId + cardIndex);
 
  const fileInfo = await FileSystem.getInfoAsync(fileUri);
  if (!fileInfo.exists) {
    console.log("Gif isn't cached locally. Downloading...");
    await FileSystem.downloadAsync(frontTxtAudio, fileUri);
  }

  return fileUri;
}

// Exports shareable URI - it can be shared outside your app
const getAudioContentUri = async(deckId: string, cardIndex: string, frontTxtAudio: string) => {
  return await getSingleCardAudio(deckId, cardIndex, frontTxtAudio);
}

// Deletes whole giphy directory with all its content
const deleteAllCards = async() => {
  console.log('Deleting all Audio files...');
  await FileSystem.deleteAsync(deckDir);
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
        {/* <View style={styles.contentContainer}> */}
        <ScrollView style={styles.contentContainer} nestedScrollEnabled>  
          <View style={styles.titleWithBack}>
            <TopBarLeftArrow navigation={props.navigation} />
            {/* <Text style={styles.pgTitleTxt}>Saved </Text> */}
          </View>
          <View style={styles.mainContent}>         
            {loading && <ActivityIndicator />} 
            {(userSavedMediaDeckList?.length + userSavedVideoDeckList?.length) > 0 ?
            <View>
              <Text style={styles.inprogressTitle}>Card Decks</Text>
              <FlatList
                  nestedScrollEnabled
                  data={userSavedMediaDeckList}
                  renderItem={renderInProgressDecks}
                  horizontal={false}
                  keyExtractor={item => item.uid}
                />
              <Text style={styles.inprogressTitle}>Video Decks</Text>
              <FlatList
                  nestedScrollEnabled
                  data={userSavedVideoDeckList}
                  renderItem={renderInProgressDecks}
                  horizontal={false}
                  keyExtractor={item => item.uid}
                />
            </View>
            :
            <View style={styles.emptyDeckContent}>
              <Text style={styles.emptyDeckTitle}>
              You currently have no decks saved.
              </Text>
              <Text style={styles.emptyDeckSubTitle}>
                When you find a deck you like, hit the save button and it will automatically appear here.
              </Text>
              <Text style={[styles.emptyDeckSubTitle, styles.footerTxt]}>
                Saved decks can be downloaded for offline use.
              </Text>
            </View>
            }
            {/* <View>
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
            </View> */}
          
          </View>
          {curUserData.userType == 'free' && 
            <View style={[styles.upgradeBtnContainer]}>          
                <TouchableOpacity style={styles.upgradeBtn} onPress={()=> { handleNavigate('upgradeAccount')}}>
                  <Image source={unlockFeature} style={styles.unlockFeatureBtn} />
                </TouchableOpacity>
            </View>
          }          
        </ScrollView>
        {/* </View> */}
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
    position: 'relative',
    // paddingVertical: scaleX(25),
  },
  mainImgBg: {
    flex: 1,
    resizeMode: 'cover',
  },
  titleWithBack: {
    flexDirection: "row",
    alignItems: 'center',
    marginTop: scaleX(25),
    marginLeft: scaleX(25),
    paddingRight: scaleX(37),
    position: 'relative',
    zIndex: 333,
  },
  pgTitleTxt: {
    fontSize: scaleX(24),
    fontWeight: '600',
    lineHeight: scaleX(35),
    textAlign: 'center',
    color: '#EFEBF6',
    flex: 1,
    fontFamily: 'Montserrat_600SemiBold'
  },
  mainContent: {        
    paddingTop: 0,
    marginTop: scaleX(50),
    marginBottom: scaleX(80),
    paddingHorizontal: scaleX(25),
    minHeight: scaleY(741)
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
    maxWidth: scaleX(170),
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
  relativeView: {
    position: 'relative'
  },
  overwrapView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  cardsProgressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: scaleX(178),
    position: 'relative'
  },
  progressPercentTxt: {    
    fontSize: scaleX(12),
    fontWeight: '700',
    lineHeight: scaleX(16),
    color: '#5ADBED',
    fontFamily: 'Poppins_700Bold'
  },
  downloadTxt: {
    color: '#465063'
  },
  activeColor: {
    color: '#5ADBED',
  },
  progressSlider: {
    flex: 1,
    marginLeft: scaleX(-10),
  },
  inprogressTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: scaleX(20),
    fontWeight: '700',
    lineHeight: scaleX(26),
    color: '#ffffff',
    marginTop: scaleX(18),
  },
  emptyDeckContent: {
    height: scaleY(596),
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyDeckTitle: {
    marginTop: scaleX(74),
    fontSize: scaleX(26),
    lineHeight: scaleX(31),
    maxWidth: scaleX(314),
    fontWeight: '600',
    textAlign: 'center',
    color: '#F4F4F4'
  },
  emptyDeckSubTitle: {
    marginTop: scaleX(21),
    fontSize: scaleX(18),
    lineHeight: scaleX(22),
    fontWeight: '600',
    textAlign: 'center',
    color: '#968FA4',
    maxWidth: scaleX(247),
  },
  footerTxt: {
    color: '#F4F4F4'
  },
  downloadListIcon: {
    width: scaleX(20),
    height: scaleX(23),
    resizeMode: 'contain',
    marginRight: scaleX(15),
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
    margin: scaleX(2),
    borderBottomLeftRadius: scaleX(20),
    borderBottomRightRadius: scaleX(20),
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
  upgradeBtnContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    zIndex: 222,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#131215A6',
    padding: scaleX(4),
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
  unlockFeatureBtn: {
    width: scaleX(300),
    height: scaleX(150),
    resizeMode: 'cover'
  },
});

const mapStateToProps = (state: ApplicationState) => ({
  userReducer: state.userReducer,
});

const Downloads = connect(mapStateToProps, { })(
  _Downloads
);

export default Downloads;
