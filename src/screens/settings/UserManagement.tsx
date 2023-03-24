import React, { useState , useEffect} from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Switch,
  Image,
  ImageBackground,
  TextInput,
  ActivityIndicator
} from "react-native";
import bg4 from "../../assets/screenBg/bg4.png";
import { connect } from "react-redux";
import {ApplicationState} from "../../redux";
import { NavigationScreenProp } from "react-navigation";
import BottomNavigator from "../component/BottomNavigator";
import creatorTabActiveIcon from '../../assets/common/creatorTabActiveIcon.png'
import creatorTabIcon from '../../assets/common/creatorTabIcon.png'
import freeTabActiveIcon from '../../assets/common/freeTabActiveIcon.png'
import freeTabIcon from '../../assets/common/freeTabIcon.png'
import premiumTabIcon from '../../assets/common/premiumTabIcon.png'
import premiumTabActiveIcon from '../../assets/common/premiumTabActiveIcon.png'
import starTabActiveIcon from '../../assets/common/starTabActiveIcon.png'
import starTabIcon from '../../assets/common/starTabIcon.png'
import addIcon from '../../assets/common/addIcon.png'
import cardDeck from "../../assets/common/cardDeck.png";

import creatorBigIcon from "../../assets/users/creatorBigIcon.png";
import creatorIcon from "../../assets/users/creatorIcon.png";
import creatorSmallIcon from "../../assets/users/creatorSmallIcon.png";
import freeAccountIcon from "../../assets/users/freeAccountIcon.png";
import freeActiveIcon from "../../assets/users/freeActiveIcon.png";
import freeIcon from "../../assets/users/freeIcon.png";
import premiumActiveIcon from "../../assets/users/premiumActiveIcon.png";
import premiumIcon from "../../assets/users/premiumIcon.png";
import starAcriveIcon from "../../assets/users/starAcriveIcon.png";
import starIcon from "../../assets/users/starIcon.png";
import subscribedIcon from "../../assets/users/subscribedIcon.png";
import jojo from "../../assets/common/jojo.png";
import usersNoImg from "../../assets/common/noImg/usersNoImg.png"
import searchIcon from "../../assets/common/searchIcon.png";
import cardBg from '../../assets/deck/createCard/cardBg.png'
import switchOffBtn from "../../assets/users/switchOffBtn.png"
import switchOnBtn from "../../assets/users/switchOnBtn.png"
import { useFonts, Montserrat_300Light,  Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold} from '@expo-google-fonts/montserrat';
import {Inter_500Medium, Inter_700Bold} from '@expo-google-fonts/inter';
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { scaleX } from "../../core/theme/dimensions";

import { CustomSwitch } from "../component/CustomSwitch";
import { getFirestore, collection, onSnapshot, doc, updateDoc} from 'firebase/firestore';


interface Props {
  navigation: NavigationScreenProp<any, any>;
  userReducer: object;
}


const _UserManagement: React.FC<Props> = (props: Props) => { 
 
  const [userList, setUserList] = useState<any>([])
  const [freeUserList, setFreeUserList] = useState<any>([])
  const [starUserList, setStarUserList] = useState<any>([])
  const [premiumUserList, setPremiumUserList] = useState<any>([])
  const [contentCreatorList, setContentCreatorList] = useState<any>([])
  const [searchTxt, setSearchTxt] = useState('')
  const [showLoading, setShowLoading] = useState(false)

 useEffect(() => {
    const firestore = getFirestore()    
    setShowLoading(true)
    const unsub = onSnapshot(collection(firestore, 'Users'), (querySnapshot) => {
      let freeUserList:any[] = []
      let starUserList:any[] = []
      let premiumUserList:any[] = []
      let contentCreatorList:any[] = []

      const documents = querySnapshot.docs.map((doc) => {
        let userData = doc.data()
        let newData = {
          ...doc.data(),
          uid: doc.id
        }
        if(userData.userType == 'free' && !userData.isAdmin) {
          freeUserList.push(newData)
        }
        if(userData.userType == 'star' && !userData.isAdmin) {
          starUserList.push(newData)
        }
        if(userData.userType == 'premium' && !userData.isAdmin) {
          premiumUserList.push(newData)
        }
        if(userData.userType == 'contentCreator' && !userData.isAdmin) {
          contentCreatorList.push(newData)
        }
        return newData
      });
      setUserList(documents);
      setFreeUserList(freeUserList)
      setStarUserList(starUserList)
      setPremiumUserList(premiumUserList)
      setContentCreatorList(contentCreatorList)
      setShowLoading(false)
    });
    return () => unsub();
  }, [])

  const [activeTab, setActiveTab] = useState('free')
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = (val:any, userId: string) => {
    setShowLoading(true)
    const firestore = getFirestore();
    updateDoc(doc(firestore, "Users",  userId), {        
      userType:  val ? 'contentCreator' : 'free' 
    })
    .then(() => {
      setShowLoading(false)
      setIsEnabled(previousState => !previousState)
    })
    .catch((e) => {
      setShowLoading(false)
      console.log(e, 'error')
    })    
  };

  const handleNavigate = (screen: string): void => {
    props.navigation.navigate(screen);
  };

  const gotoAddDeck = () => {
    handleNavigate('selectdeckType')
  }

  const renderCreators = () => {
    let activeTabData = activeTab == 'free' ? freeUserList : activeTab == 'star' ?  starUserList : activeTab == 'premium' ? premiumUserList : contentCreatorList
    let renderImg = activeTab == 'free' ? freeAccountIcon : activeTab == 'star' ?  subscribedIcon : activeTab == 'premium' ? subscribedIcon : creatorBigIcon
    
    return (
      activeTabData.map((item: any, index: number) => {
        let userEmail = item?.email
        if(userEmail?.toLowerCase()?.includes(searchTxt?.toLowerCase()) || searchTxt === ''){        
          return(
          <View style={styles.inprogressItem} key={index}>
            <TouchableOpacity onPress={()=> props.navigation.navigate(item.userType === 'contentCreator' ? 'creatorProfile' : 'profile', {userId: item?.uid})}>
              <Image source={item?.profileImg ? {uri: item?.profileImg} : usersNoImg} style={styles.inprogressDeckImg} />
            </TouchableOpacity>
            <View style={styles.inprogressItemContent}>
              <View style={styles.titleAndCardsCount}>
                <View style={{flex:1, height: scaleX(60)}}>                  
                  <Image source={renderImg} style={[styles.subscribedIcon, activeTab == 'free' && styles.freeAccountIcon, activeTab == 'creator' && styles.creatorIconStyle]} />
                  <Text style={styles.userItemNametxt} numberOfLines={1} ellipsizeMode='tail' >{item?.firstName + ' ' + item?.lastName}</Text>
                  <Text style={styles.userItemEmailTxt} numberOfLines={1} ellipsizeMode='tail' >{item?.email}</Text>
                </View>
                {
                (activeTab == 'free' || activeTab == 'creator') &&                
                <View style={styles.rightContent}> 
                    <TouchableOpacity onPress={()=>toggleSwitch(item.userType === 'free', item?.uid)} >
                      <Image source={activeTab ==='free' ? switchOffBtn : switchOnBtn}  
                        style={styles.switchImgBtn} />
                    </TouchableOpacity>
                    {/* <CustomSwitch 
                      userId={item?.uid}
                      onValueChange={toggleSwitch}
                      disabled={false}                  
                      activeText= {'On'}
                      inActiveText = {'Off'}
                      backgroundActive={'#5ADBED73'}
                      backgroundInactive={'#82848F36'}
                      borderActive={'#5ADBED73'}
                      borderInactive={'#82848F36'}
                      value={item?.userType == 'contentCreator'} 
                      circleActiveColor={'#5ADBED'}
                      circleInActiveColor={'#252A34'}
                      circleBorderActiveColor = {'#5ADBED'}
                      circleBorderInactiveColor = {'#252A34'}
                      activeTextStyle={{}}
                      inactiveTextStyle={{}}
                      containerStyle={{}}
                      barHeight={scaleX(25)}
                      circleBorderWidth = {1}
                      innerCircleStyle={{
                        borderWidth: 0,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      renderInsideCircle={() => <View />} // custom component to render inside the Switch circle (Text, Image, etc.)
                      changeValueImmediately={false} // if rendering inside circle, change state immediately or wait for animation to complete
                      outerCircleStyle={{}} // style for outer animated circle
                      renderActiveText={false}
                      renderInActiveText={false}
                      switchWidth={scaleX(51)}
                      switchHeight={scaleX(25)}
                      switchLeftPx={3} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
                      switchRightPx={3} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
                      switchWidthMultiplier={1} // multiplied by the `circleSize` prop to calculate total width of the Switch
                      switchBorderRadius={scaleX(30)} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
                    /> */}
                  <Text style={styles.roleTxt}>{'Creator'}</Text>
                </View>
                }
              </View>              
            </View>
          </View>
        )
        }
      })         
    )
  }

  let [fontsLoaded] = useFonts({
    Montserrat_700Bold, Montserrat_600SemiBold, Montserrat_500Medium, Montserrat_400Regular, Montserrat_300Light,
    Inter_500Medium, Inter_700Bold, 
    Poppins_400Regular, Poppins_500Medium,  Poppins_600SemiBold, Poppins_700Bold
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={bg4} resizeMode="cover" style={styles.mainImgBg}>
        <ScrollView style={styles.contentContainer}>  
          <View style={styles.searchContent}>
            <ImageBackground source={cardBg} resizeMode="cover" style={[styles.cardBgSytle]}>
              <Image source={searchIcon} style={styles.searchIcon} />
              <TextInput 
                placeholder="Search Email" 
                onChangeText={(txt) => setSearchTxt(txt)}
                placeholderTextColor={'#968FA4'}
                style={styles.searchTxt}/>
            </ImageBackground>
          </View>
          <View style={styles.mainContent}>   
            <View style={styles.tabList}>
              <TouchableOpacity style={[styles.tabListItem]}
                onPress={() => setActiveTab('free')} >
                  <Image source={activeTab == 'free' ? freeTabActiveIcon : freeTabIcon} style={styles.tabListIcon} />
                  <Image source={activeTab == 'free' ? freeActiveIcon : freeIcon} style={styles.freeIcon} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tabListItem]}
                onPress={() => setActiveTab('star')} >
                  <Image source={activeTab == 'star' ? starTabActiveIcon : starTabIcon} style={styles.tabListIcon} />
                  <Image source={activeTab == 'star' ? starAcriveIcon : starIcon} style={styles.starIcon} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tabListItem]}
                onPress={() => setActiveTab('premium')} >
                  <Image source={activeTab == 'premium' ? premiumTabActiveIcon : premiumTabIcon} style={styles.tabListIcon} />
                  <Image source={activeTab == 'premium' ? premiumActiveIcon : premiumIcon} style={styles.premiumIcon} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tabListItem]}
                onPress={() => setActiveTab('creator')} >
                  <Image source={activeTab == 'creator' ? creatorTabActiveIcon : creatorTabIcon} style={styles.tabListIcon} />
                  <Image source={activeTab == 'creator' ? creatorSmallIcon : creatorIcon} style={styles.creatorIcon} />
              </TouchableOpacity>
            </View> 
            {showLoading && <ActivityIndicator  />}            
            <View style={styles.tabContent}>
              {renderCreators()}
            </View>
          
          </View>
        </ScrollView>
        {/* <BottomNavigator 
          navigation={props.navigation} 
          centerIcon={addIcon}
          centerIconPress={gotoAddDeck}
          /> */}
      </ImageBackground>      
    </View>
  );
};

const styles = StyleSheet.create({
  freeIcon: {
    width: scaleX(28),
    height: scaleX(15),
    marginTop: scaleX(14),
    resizeMode: 'contain'
  },
  starIcon: {
    width: scaleX(26),
    height: scaleX(15),
    marginTop: scaleX(14),
    resizeMode: 'contain'
  },
  premiumIcon: {
    width: scaleX(60),
    height: scaleX(15),
    marginTop: scaleX(14),
    resizeMode: 'contain'
  },
  creatorIcon: {
    width: scaleX(48),
    height: scaleX(15),
    marginTop: scaleX(14),
    resizeMode: 'contain'
  },
  freeAccountIcon: {
    width: scaleX(91),
    height: scaleX(16),
    resizeMode: 'contain'
  },
  subscribedIcon: {
    width: scaleX(77),
    height: scaleX(16),
    resizeMode: 'contain'
  },
  creatorIconStyle: {
    width: scaleX(51),
    height: scaleX(16),
    resizeMode: 'contain'
  },
  container: {
    flex:1,
  },
  contentContainer: {
    flex:1,
    padding: scaleX(20),
  },
  mainImgBg: {
    flex: 1,
    resizeMode: 'cover',
  },
  titleWithBack: {
    flexDirection: "row",
    alignItems: 'center',
    marginTop: scaleX(10)
  },
  pgTitleTxt: {
    fontSize: scaleX(24),
    fontWeight: '600',
    lineHeight: scaleX(35),
    textAlign: 'center',
    color: '#EFEBF6',
    flex: 1,
  },
  mainContent: {    
    paddingTop: 0,
    marginTop: scaleX(50),
    marginBottom: scaleX(80),
  },
  inprogressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scaleX(18),
    padding: scaleX(15),
    borderRadius: scaleX(14),
    backgroundColor: '#1D1B21'
  },
  inprogressDeckImg: {
    width: scaleX(71),
    height: scaleX(71),
    resizeMode: 'cover',
    borderRadius: scaleX(9),
  },
  inprogressItemContent: {
    marginLeft: scaleX(17),
    flex: 1,
  },
  titleAndCardsCount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userItemRolTxt: {
    fontSize: scaleX(13),
    fontWeight: '500',
    lineHeight: scaleX(16),
    color: 'white ',
    maxWidth: scaleX(170),
  },
  creatorTxt: {
    color: '#29AED8',
  },
  userItemRoletxt: {
    fontSize: scaleX(13),
    fontWeight: '500',
    lineHeight: scaleX(16),
    color: '#FF8C22',
    maxWidth: scaleX(170),
    fontFamily: 'Montserrat_500Medium'
  },
  userItemNametxt: {
    fontSize: scaleX(16),
    fontWeight: '300',
    lineHeight: scaleX(19.5),
    color: '#ffffff',
    maxWidth: scaleX(170),
    marginTop: scaleX(2),
    marginBottom: scaleX(4),
    fontFamily: 'Montserrat_300Light'
  },
  userItemEmailTxt: {
    fontSize: scaleX(13),
    fontWeight: '500',
    lineHeight: scaleX(16),
    color: '#A4B0BE',
    maxWidth: scaleX(170),
    fontFamily: 'Montserrat_400Regular'
  },
  rightContent: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: scaleX(70), 
  },
  roleTxt: {
    fontSize: scaleX(12),
    fontWeight: '600',
    lineHeight: scaleX(14),
    marginTop: scaleX(19),
    color: '#47454A',
    fontFamily: 'Montserrat_600SemiBold'
  },
  deckType: {
    fontSize: scaleX(14),
    fontWeight: '600',
    lineHeight: scaleX(19),
    color: '#6B7488'
  },
  cardsProgressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: scaleX(178),
  },
  progressPercentTxt: {    
    fontSize: scaleX(12),
    fontWeight: '700',
    lineHeight: scaleX(16),
    color: '#5ADBED'
  },
  progressSlider: {
    flex: 1,
    marginLeft: scaleX(-10),
  },
  inprogressTitle: {
    fontSize: scaleX(20),
    fontWeight: '700',
    lineHeight: scaleX(26),
    color: '#ffffff',
    marginTop: scaleX(18),
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
    marginBottom: scaleX(80)
  },
  downloadListIcon: {
    width: scaleX(20),
    height: scaleX(23),
    resizeMode: 'contain',
    marginRight: scaleX(15),
  },
  
  searchContent: {
    display: 'flex',
    borderWidth: scaleX(2),
    borderColor: '#443365',
    borderRadius: scaleX(13),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: scaleX(50),
    overflow: 'hidden'
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
    color: '#968FA4',
    fontSize: scaleX(20),
    lineHeight: scaleX(28),
    fontWeight: '500',
    fontFamily: 'Montserrat_500Medium'
  },
  tabList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  tabListIcon: {
    width: scaleX(54),
    height: scaleX(54),
    resizeMode: 'cover'
  },
  tabListItem: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: scaleX(62),
  },
  tabListTxt: {
    fontSize: scaleX(12),
    lineHeight: scaleX(15),
    fontWeight: '600',
    textAlign: 'center',
    color: '#47454A',
    marginTop: scaleX(12),
    fontFamily: 'Montserrat_500Medium'  
  },
  tabContent: {
    marginTop: scaleX(40),
  },
  activeTxt: {
    color: '#FF8C22'
  },
  activeCreatorTxt: {
    color: '#29AED8'
  },  
  maskViewContainer: {
    flex: 1,
    flexDirection: 'row',
    height: '100%',
    paddingTop: scaleX(6),
    maxWidth: scaleX(91),
  },
  maskViewContent: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red'
  },
  alignItemStart: {
    alignItems: 'flex-start',
  },
  cardBgSytle: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    flexDirection: 'row',
  },
  switchImgBtn: {
    width: scaleX(52),
    height: scaleX(25),
    resizeMode: 'cover'
  }
});

const mapStateToProps = (state: ApplicationState) => ({
  userReducer: state.userReducer,
});

const UserManagement = connect(mapStateToProps, { })(
  _UserManagement
);

export default UserManagement;
