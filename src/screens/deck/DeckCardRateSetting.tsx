import React, {useState, useEffect } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageBackground,
  ActivityIndicator
} from "react-native";
import mainBg from "../../assets/mainBg.png";
import notHappyIcon from "../../assets/deck/notHappyIcon.png"
import hardIcon from "../../assets/deck/hardIcon.png"
import happyIcon from "../../assets/deck/happyIcon.png";
import maximumTrackImage from "../../assets/common/maximumTrackImage.png"
import minimumTrackImage from "../../assets/common/minimumTrackImage.png"
import repeatActiveIcon from "../../assets/common/repeatActiveIcon.png";
import repeatDeactiveIcon from "../../assets/common/repeatDeactiveIcon.png";
import rateSettingBg from '../../assets/deck/createCard/rateSettingBg.png'

import sliderThumb from '../../assets/deck/sliderThumb.png'
import topbarBackIcon from '../../assets/common/topbarBackIcon.png'

import { NavigationScreenProp } from "react-navigation";
import { HomeOption } from "../../types";
import { connect } from "react-redux";
import {ApplicationState, OnUpdateUserData} from "../../redux";
import BottomNavigator from "../component/BottomNavigator";
import centerSaveIcon from '../../assets/common/centerSaveIcon.png'
import Slider from '@react-native-community/slider';

import { useFonts,  Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold} from '@expo-google-fonts/montserrat';
import {Inter_500Medium, Inter_700Bold} from '@expo-google-fonts/inter';
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";
import TopBarLeftArrow from "../component/TobBarLeftArrow";
import { scaleX, scaleY } from "../../core/theme/dimensions";

import RangeSlider, { Slider as CustomSlider} from 'react-native-range-slider-expo';
import { StackActions, useRoute } from '@react-navigation/native';
import { getFirestore, setDoc, doc, getDoc,  collection,updateDoc} from 'firebase/firestore';

const deviceWidth = Dimensions.get('window').width;

interface Props {
  options: [HomeOption];
  navigation: NavigationScreenProp<any, any>;
  userReducer: any;
  isSavePlayDeck: any;
  OnUpdateUserData: Function;
}

const _DeckCardRatingSetting: React.FC<Props> = (props: Props) => { 
 
  const route:any = useRoute();
  const [curUserData, setCurUserData] = useState<any>({})
  const [curUserId, setCurUserId] = useState('')
  const timeout:any = React.useRef(null);
  const difftimeout:any = React.useRef(null);
  const hardtimeout:any = React.useRef(null);

  useEffect(() => {    
    props.userReducer?.then((userData:any)=>{
      let curUserData = userData?.curUser
      setCurUserData(curUserData)
      setCurUserId(userData?.userId)
      setValue(curUserData.easyRatingVal)
      setDiffVal(curUserData.diffRatingVal)
      setHardVal(curUserData.hardRatingVal)
    })
  }, [props.userReducer]);


  const [isRepeat, setIsRepeat] = useState(false)

  const [fromValue, setFromValue] = useState(0);
  const [toValue, setToValue] = useState(0);
  const [value, setValue] = useState(0);
  const [hardVal, setHardVal] = useState(0);
  const [diffVal, setDiffVal] = useState(0);
  const [loading, setLoading] = useState(false)

  const handleNavigate = (screen: string): void => {
    props.navigation.navigate(screen);
  };

   
  const centeralIconClicked = () => {
    handleNavigate('playDeck')
  }

  
  const updateEasyRatingVal = (easyRatingVal:number) => {   
    setLoading(true)
    clearTimeout(timeout.current);
    setValue(easyRatingVal)
    timeout.current = setTimeout(()=>{
      const firestore = getFirestore();
      updateDoc(doc(firestore, "Users", curUserId), {
        easyRatingVal: value     
      })
      .then(() => {
        setLoading(false)
        if(value) curUserData['easyRatingVal'] = value
        OnUpdateUserData(curUserData, curUserId)
      })
      .catch((e) => {
        setLoading(false)
      })
    }, 3000);    
  }

  const updateDiffRatingVal = (diffRatingVal:number) => {
    setLoading(true)
    clearTimeout(difftimeout.current);
    setDiffVal(diffRatingVal)
    difftimeout.current = setTimeout(()=>{
      const firestore = getFirestore();      
      updateDoc(doc(firestore, "Users", curUserId), {
        diffRatingVal: diffVal     
      })
      .then(() => {
        setLoading(false)
        if(diffVal) curUserData['diffRatingVal'] = diffVal
        OnUpdateUserData(curUserData, curUserId)
      })
      .catch((e) => {
        setLoading(false)
      })
    }, 3000);    
  }

  


  const updateHardRatingVal = (hardRatingVal:number) => {
    setLoading(true)
    clearTimeout(hardtimeout.current);
    const firestore = getFirestore();
    setHardVal(hardRatingVal)
    hardtimeout.current = setTimeout(()=>{      
      updateDoc(doc(firestore, "Users", curUserId), {
        hardRatingVal:hardVal     
      })
      .then(() => {
        setLoading(false)
        if(hardVal) curUserData['hardRatingVal'] = hardVal        
        OnUpdateUserData(curUserData, curUserId)
      })
      .catch((e) => {
        setLoading(false)
      })
    }, 3000);    
  }

  const handleRatingBack = () => {
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
          <TouchableOpacity onPress={()=>handleRatingBack()}>
            <Image source={topbarBackIcon} 
              style={{
                width: scaleX(37),
                height: scaleX(31),
                resizeMode: 'contain'
              }} />
          </TouchableOpacity>
          </View>
          <View style={styles.marginBottom80}>
            <View style={styles.marginTop18}>
              <Text style={styles.titleTxt}>
                Adjust how often you see cards appear
              </Text> 
              {loading && <ActivityIndicator />}
              <View style={styles.cardRateSetContent}>
                <ImageBackground source={rateSettingBg} resizeMode="cover" style={styles.rateSettingBg}>
                  <Text style={styles.subTitle}>Card removed</Text>
                  <View style={styles.sliderContainer}>
                    <View style={styles.easyBarIcon}/>
                    {/* <CustomSlider 
                         min={10} max={30}
                         valueOnChange={value => {'updateEasyRatingVal(value)'}}
                         initialValue={30}
                         knobColor='#ffc54298'
                         valueLabelsBackgroundColor='transparent'
                         inRangeBarColor='#465063'
                         outOfRangeBarColor='#ffc542'
                         showRangeLabels={false}
                         showValueLabels={false}
                         styleSize={'small'}
                         containerStyle={styles.progressSlider}
                    /> */}
                    <Image source={happyIcon} style={styles.cardRateIcon} />
                  </View>
                  {/* <View style={styles.cardRateTxtContainer}>
                    <Text style={styles.cardRateTxt}>20</Text>
                    <Text style={styles.cardRateTxt}>22</Text>
                    <Text style={styles.cardRateTxt}>24</Text>
                    <Text style={styles.cardRateTxt}>26</Text>
                    <Text style={styles.cardRateTxt}>28</Text>
                    <Text style={styles.cardRateTxt}>30</Text>
                  </View> */}
                </ImageBackground>
              </View>
              <View style={styles.cardRateSetContent}>
                <ImageBackground source={rateSettingBg} resizeMode="cover" style={styles.rateSettingBg}>
                  <Text style={styles.subTitle}>Frequency interval</Text>
                  <View style={styles.sliderContainer}>
                    <CustomSlider 
                         min={11} max={20}
                         valueOnChange={value => updateDiffRatingVal(value)}
                         initialValue={diffVal}
                         knobColor='#ffc54298'
                         valueLabelsBackgroundColor='transparent'
                         inRangeBarColor='#465063'
                         outOfRangeBarColor='#ffc542'
                         showRangeLabels={false}
                         showValueLabels={false}
                         styleSize={'small'}
                         containerStyle={styles.progressSlider}
                    />
                    <Image source={hardIcon} style={styles.cardRateIcon} />
                  </View>
                  <View style={styles.cardRateTxtContainer}>
                    <Text style={styles.cardRateTxt}>10</Text>
                    <Text style={styles.cardRateTxt}>12</Text>
                    <Text style={styles.cardRateTxt}>14</Text>
                    <Text style={styles.cardRateTxt}>16</Text>
                    <Text style={styles.cardRateTxt}>18</Text>
                    <Text style={styles.cardRateTxt}>20</Text>
                  </View>
                </ImageBackground>
              </View>
              <View style={styles.cardRateSetContent}>
                <ImageBackground source={rateSettingBg} resizeMode="cover" style={styles.rateSettingBg}>
                  <Text style={styles.subTitle}>Frequency interval</Text>
                  <View style={styles.sliderContainer}>
                      <CustomSlider 
                         min={0} max={10}
                         valueOnChange={value => updateHardRatingVal(value)}
                         initialValue={hardVal}
                         knobColor='#ffc54298'
                         valueLabelsBackgroundColor='transparent'
                         inRangeBarColor='#465063'
                         outOfRangeBarColor='#ffc542'
                         showRangeLabels={false}
                         showValueLabels={false}
                         styleSize={'small'}
                         containerStyle={styles.progressSlider}
                    />
                    <Image source={notHappyIcon} style={styles.cardRateIcon} />
                  </View>
                  <View style={styles.cardRateTxtContainer}>
                    <Text style={styles.cardRateTxt}>0</Text>
                    <Text style={styles.cardRateTxt}>2</Text>
                    <Text style={styles.cardRateTxt}>4</Text>
                    <Text style={styles.cardRateTxt}>6</Text>
                    <Text style={styles.cardRateTxt}>8</Text>
                    <Text style={styles.cardRateTxt}>10</Text>
                  </View>
                </ImageBackground>
              </View> 
              <View style={styles.repeatContent}>
                <Text style={styles.repeatTxt}>Repeat : </Text>
                <TouchableOpacity onPress={()=>setIsRepeat(!isRepeat)}>
                  <Image source={isRepeat ? repeatActiveIcon :repeatDeactiveIcon} style={styles.repeatIcon} />
                </TouchableOpacity>
              </View>
              
            </View>    
          </View>
        </ScrollView>
        {/* <BottomNavigator 
          navigation={props.navigation} 
          centerIcon={centerSaveIcon}
          centerIconPress={centeralIconClicked}
          /> */}
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
    paddingBottom: scaleX(80),
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
    // marginTop: scaleX(30),
  },
  marginTop18: {
    marginTop: scaleX(18),
    justifyContent: 'center',
    alignItems: 'center',
  },
  marginBottom80: {
    marginBottom: scaleX(80),
  },
  titleTxt: {
    fontSize: scaleX(26),
    fontWeight: '700',
    lineHeight: scaleX(39),
    color: '#F4F4F4',
    textAlign: 'center',
    maxWidth: scaleX(287),
    fontFamily: 'Poppins_700Bold'
  },
  cardRateSetContent: {
    marginTop: scaleX(15),
    borderRadius: scaleX(12),
    width: deviceWidth - scaleX(50),
    overflow: 'hidden',
  }, 
  rateSettingBg: {
    padding: scaleX(23),
    flex: 1,
  },
  subTitle: {
    fontSize: scaleX(20),
    fontWeight: '700',
    lineHeight: scaleX(27),
    color: '#ffffff',
    fontFamily: 'Poppins_700Bold'
  }, 
  sliderContainer: {
    // marginTop: scaleX(25),
    flexDirection: 'row',
    // marginBottom: scaleX(15),
    alignItems: 'center',
    // backgroundColor: 'red'
  },
  sliderContent: {
    flex: 1,
    marginRight: scaleX(20),
    height: scaleX(13),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: scaleX(30),
    overflow: 'hidden'

  },
  progressSlider: {
    flex: 1,
    marginLeft: scaleX(-20),
    width: scaleX(317),
    height: scaleY(110),    
  },
  easyBarIcon: {
    width: scaleX(260),
    height: scaleY(10),  
    borderRadius: scaleX(4.2),
    marginVertical: scaleX(38),
    marginRight: scaleX(20),
    backgroundColor: '#5ADBED'
  },
  cardRateIcon: {
    width: scaleX(39),
    height: scaleX(39),
    resizeMode: 'contain'
  }, 
  cardRateTxtContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: scaleX(55),
    marginTop: scaleX(-12)
  },
  cardRateTxt: {
    fontSize: scaleX(16),
    fontWeight: '600',
    lineHeight: scaleX(22),
    color: '#ffffff7D',    
    fontFamily: 'Montserrat_600SemiBold'
  },
  repeatContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scaleX(33),
    width: scaleX(deviceWidth - 50)
  }, 
  repeatTxt: {
    fontSize: scaleX(20),
    fontWeight: '700',
    lineHeight: scaleX(27),
    color: '#EAEBF0',    
    fontFamily: 'Poppins_700Bold'
  },
  confirmTxt: {
    marginTop: scaleX(23),
    color: '#968FA4',
    fontSize: scaleX(18),
    fontWeight: '600',
    lineHeight: scaleX(27),
    fontFamily: 'Poppins_600SemiBold'
  },
  repeatIcon: {
    width: scaleX(37),
    height: scaleX(37),
    resizeMode: 'contain'
  }
});

const mapStateToProps = (state: ApplicationState) => ({
  userReducer: state.userReducer,
  isSavePlayDeck: state.isSavePlayDeck
});

const DeckCardRatingSetting = connect(mapStateToProps, { OnUpdateUserData})(
  _DeckCardRatingSetting
);

export default DeckCardRatingSetting;
