import React, { useState }  from "react";
import { View, StyleSheet, Text, Image , ImageBackground, Dimensions } from "react-native";
import { NavigationScreenProp } from "react-navigation";
import AppIntroSlider from 'react-native-app-intro-slider';
import mainBg from "../../assets/mainBg.png";
import introsliderImg1 from "../../assets/signin/introsliderImg1.png";
import introslider2subBg from "../../assets/signin/appslider2subBg.png";
import introsliderImg3 from "../../assets/signin/introsliderImg3.png";
import indicator1 from "../../assets/signin/indicator1.png";
import indicator2 from "../../assets/signin/indicator2.png";
import indicator3 from "../../assets/signin/indicator3.png";
import bottomCircleImg from "../../assets/signin/bottomCircleImg.png";
import nextBtn from "../../assets/btns/nextBtn.png";
import getStartedBtn from "../../assets/btns/getStartedBtn.png";
import { useFonts, Montserrat_700Bold , Montserrat_500Medium} from '@expo-google-fonts/montserrat';
import {Inter_500Medium, Inter_700Bold} from '@expo-google-fonts/inter';
import { Poppins_400Regular, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { scaleY , scaleX} from "../../core/theme/dimensions";

import { connect } from "react-redux";
import {ApplicationState, FinishIntroSlider} from "../../redux";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


interface IntroSliderProps {
  navigation: NavigationScreenProp<any, any>;
  userReducer: any;
  FinishIntroSlider: Function;
  ref: React.ForwardedRef<AppIntroSlider>;
}

const slides = [
  {
    key: 1,
    text1: null,
    goldText: null,
    text2: null,
    textSubdesc: null,
    title: 'Learn with Music, TV and Movies',
    image: introsliderImg1,
    titleBg: null,
    indicatorImg: indicator1,
    desc: "It's time to put down the textbooks",
    btnTxt: 'Next',
    bottomCircleImg: bottomCircleImg,
  },
  {
    key: 2,
    text1: 'Change the way you ',
    goldText: 'learn',
    text2: ' Japanese forever',
    textSubdesc: "Learn Japanese in a fun and interactive way – there's no other app like it!",
    title: 'Flashcards with a twist',
    image: null,
    titleBg: introslider2subBg,
    indicatorImg: indicator2,
    bottomCircleImg: bottomCircleImg,
    desc: ' Learn anywhere and anytime.',
    btnTxt: 'Next'
  },
  {
    key: 3,
    text1: null,
    goldText: null,
    text2: null,
    textSubdesc: null,
    title: 'Learn Japanese in a flash',
    image: introsliderImg3,
    titleBg: null,
    indicatorImg: indicator3,
    bottomCircleImg: null,
    desc: "Get inspired by your favorite TV shows and music artists",
    btnTxt: 'Get Started'
  }
];

const _IntroSlider: React.FC<IntroSliderProps> = ({ navigation, ref, userReducer , FinishIntroSlider}) => {   

  const [curUserId, setCurUserId] = useState('')
  const [curUser, setCurUser] = useState<any>({})

  React.useEffect(() => {  
    userReducer.then((userData: any) => {
      setCurUserId(userData.userId)
      setCurUser(userData.curUser)
    })
  },[]);

  const _renderItem = ({ item }: any) => {
    return (
      <View style={styles.slide} key={item.key}>
        {item.text1 && <Image source={item.titleBg} style={styles.titlgeCircleBg} />}
        {item.text1 && <View style={styles.secondSliderTitleConent}><Text style={styles.text1}>{item.text1}<Text style={[styles.text1, styles.goldTxt]}>{item.goldText}</Text>{item.text2}</Text></View> }
        {item.image && <Image source={item.image} style={item.key== 3 ? styles.thirdImgStyle : styles.imgStyle}/>}
        {item.textSubdesc && <View style={styles.textSubDescContainer}><Text style={styles.textSubdesc}>{item.textSubdesc}</Text></View>}
        {/* <Image source={item.indicatorImg} style={styles.indicatorImgStyle}/> */}
        <View style={styles.indicatorStyle} />
        <Text style={item.key== 1 ? styles.firstTitle : item.key== 2 ? styles.secondTitle : styles.title}>{item.title}</Text>
        <Text style={styles.descTxt}>{item.desc}</Text>
        {item.bottomCircleImg &&
        <Image source={item.bottomCircleImg } style={styles.bottomCircleImg} />
        }
      </View>
    );
  }
  const _onDone = () => {
    FinishIntroSlider(curUserId, curUser)
    
  }
  const onTapAuthenticate = () => {
    console.log('on tab')
  }
 
  const _renderNextButton = () => {
    return (
      <View />
    );
  };

  const _renderDoneButton = () => {
    return (
      <View style={styles.btn}>
        <Image source={getStartedBtn} style={styles.introBtn} />
      </View>
    );
  };

  let [fontsLoaded] = useFonts({
    Montserrat_700Bold,
    Montserrat_500Medium, Inter_500Medium, Inter_700Bold, Poppins_400Regular, Poppins_700Bold
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    
    <View style={styles.container}>
      <ImageBackground source={mainBg} resizeMode="cover" style={styles.mainImgBg}>
        <View style={styles.contentContainer}>    
          <AppIntroSlider 
            renderItem={_renderItem} 
            data={slides} 
            dotStyle={{backgroundColor: '#A293BE', bottom: windowHeight - scaleY(530), width: scaleY(16), height: scaleY(16), borderRadius: scaleY(16)}}
            activeDotStyle={{backgroundColor: '#53D6FF', bottom: windowHeight - scaleY(530), width: scaleY(16), height: scaleY(16), borderRadius: scaleY(8)}}
            renderDoneButton={_renderDoneButton}
            renderNextButton={_renderNextButton}
            // bottomButton
            onDone={_onDone}/>
        </View>
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
  slide: {
    flex:1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'relative',
  },
  title: {
    fontSize: scaleY(30),
    lineHeight: scaleY(45),
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: scaleY(40),
    maxWidth: scaleY(314),
    fontFamily: 'Poppins_700Bold'
  },
  firstTitle: {
    fontSize: scaleY(33),
    lineHeight: scaleY(44),
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: scaleY(60),
    maxWidth: scaleY(314),
    fontFamily: 'Poppins_700Bold'
  },
  secondTitle: {
    fontSize: scaleY(33),
    lineHeight: scaleY(44),
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: scaleY(75),
    maxWidth: scaleY(314),
    fontFamily: 'Poppins_700Bold'
  },
  textSubDescContainer: {
    width: scaleX(414),
    marginTop: scaleY(20),
    alignItems: 'center',
  },
  textSubdesc: {   
    width: scaleY(414),
    fontSize: scaleY(20),
    lineHeight: scaleY(29),
    color: 'white',
    maxWidth: scaleY(314),
    fontFamily: 'Poppins_400Regular'
  },
  descTxt: {
    fontSize: scaleY(18),
    lineHeight: scaleY(26),
    fontWeight: '400',
    color: '#E3E1E7',
    textAlign: 'center',
    marginTop: scaleY(20),
    maxWidth: scaleY(270),
    fontFamily: 'Poppins_400Regular'
  },
  imgStyle: {
    width: scaleY(370),
    height: scaleY(353),
    marginTop: scaleY(65),
    resizeMode: "contain",
    justifyContent: 'center',
    alignItems: 'center',
  },
  thirdImgStyle: {
    width: scaleY(318.5),
    height: scaleY(319),
    marginTop: scaleY(100),
    resizeMode: "contain",
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorImgStyle: {
    height: scaleY(6),
    resizeMode: 'contain',
    marginTop: scaleY(43),
  },
  indicatorStyle: {
    height: scaleY(50),    
  },
  startBtn: {
    backgroundColor: 'white',
    borderRadius: scaleY(60),
    marginTop: scaleY(30),
    marginBottom: scaleY(40),
  },
  btnTxt: {
    color: '#282c34',
    fontSize: scaleY(40),
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: scaleY(60),
    paddingVertical: scaleY(3),
  },
  desc: {
    color: '#282c34',
    textAlign: 'center' ,
    fontSize: scaleY(20),
  },
  btn: {
    flex: 1,
    width: windowWidth,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: scaleY(10),
    right: -scaleY(18),
    bottom: scaleY(40),
  },
  introBtn: {
    width: scaleY(226),
    height: scaleY(88),
    resizeMode: 'cover'
  },
  secondSliderTitleConent: {
    width: scaleX(320),
    alignItems: 'center',
    marginTop: scaleY(40),    
  },
  text1: {    
    // paddingRight: scaleY(38),
    fontSize: scaleY(50),
    lineHeight: scaleY(64),
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'Inter_700Bold',
    maxWidth: scaleX(359),
  },
  goldTxt: {
    marginTop: 0,
    color: '#FE8E26',
    fontFamily: 'Inter_700Bold'
  },
  bottomCircleImg: {
    width: scaleY(225),
    height: scaleY(260),
    bottom: 0,
    right: 0,
    resizeMode: 'contain',
    position: 'absolute',
  },
  titlgeCircleBg: {
    width: scaleY(267),
    height: scaleY(332),
    left: 0,
    top: 0,
    resizeMode: 'contain',
    position: 'absolute',
  }
});

const mapStateToProps = (state: ApplicationState) => ({
  userReducer: state.userReducer,
  isSavePlayDeck: state.isSavePlayDeck
});

const IntroSlider = connect(mapStateToProps, {FinishIntroSlider })(
  _IntroSlider
);

export default IntroSlider;
