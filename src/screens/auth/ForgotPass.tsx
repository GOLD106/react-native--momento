import React, { useState, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator
} from "react-native";
import { TextField } from "../../components";
import { connect } from "react-redux";
import { ApplicationState, OnUserForgotPass} from "../../redux";
import mainBg from "../../assets/mainBg.png";
import emailIcon from "../../assets/signin/emailIcon.png";
import emailActiveIcon from "../../assets/signin/emailActiveIcon.png";

import alertIcon from "../../assets/signin/alertIcon.png";
import emailErrorIcon from "../../assets/signin/emailErrorIcon.png";
import errorBg from '../../assets/signin/errorBg.png' 

import loginBtn from "../../assets/btns/loginBtn.png";
import resetBtn from "../../assets/btns/resetBtn.png";
import { whiteColor } from "../../core";
import { NavigationScreenProp } from "react-navigation";
import { MyGlobalContext } from "../../context/index";
import { dangerColor } from "../../core/theme/colors";

import { useFonts, Montserrat_700Bold , Montserrat_500Medium} from '@expo-google-fonts/montserrat';
import {Inter_500Medium, Inter_700Bold} from '@expo-google-fonts/inter';
import {Poppins_600SemiBold} from '@expo-google-fonts/poppins';
import { scaleX } from "../../core/theme/dimensions";
import { string } from "prop-types";


interface ForgotPassProps {
  OnUserForgotPass: Function,
  navigation: NavigationScreenProp<any, any>;
}

const _ForgotPassScreen: React.FC<ForgotPassProps> = ({
  navigation,
  OnUserForgotPass
}) => {
  
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const [showError, setShowError] = useState(false);

  let [fontsLoaded] = useFonts({
    Montserrat_700Bold,
    Montserrat_500Medium, Inter_500Medium, Inter_700Bold, Poppins_600SemiBold
  });

  if (!fontsLoaded) {
    return null;
  }

  const sendForgotPass = async () => {
    setLoading(true);
    OnUserForgotPass(email)
    .then((success:any) => {
      setLoading(false);
      if(success) {
        setShowError(false)
        setEmailSent(true)
        setLoading(false);
      }
      else {
        setShowError(true)
        setEmailSent(false)
        setLoading(false);
      }
    })  
  };
  const gotoLoginPage = () => {
    navigation.navigate("Login")
  }
  const typeEmail = (emailTxt:string) => {
    setShowError(false),
    setEmail(emailTxt)
  }
  return (
    <View style={styles.container}>
      <ImageBackground source={mainBg} resizeMode="cover" style={styles.mainImgBg}>
        <ScrollView style={styles.contentContainer}>
            <Text style={styles.signinTitle}>Forgot Password</Text>   
            <Text style={styles.signinDesc}>Enter the email address associated with your account</Text>   
            {emailSent ? 
              <View style={styles.betweenBody}>
                <View >
                  <Text style={styles.emailSentTitle}>Email Sent</Text>
                  <Text style={styles.emailSentSubTitle}>Instructions on how to reset your password have been sent to your registered email account</Text>
                </View>
                <TouchableOpacity style={styles.btnStyle} onPress={()=> gotoLoginPage()}>
                  <Image source={loginBtn} style={styles.loginBtn} />
                </TouchableOpacity>    
              </View>
              :
              <View style={styles.body}>
                <Text style={styles.textLabel}>Email</Text>   
                <TextField
                  placeholder=""
                  onTextChange={typeEmail}
                  isSecure={false}
                  isActive={email != ''}
                  isError={showError}
                  imgIcon={showError ? emailErrorIcon : email == '' ? emailIcon : emailActiveIcon}
                />
                {showError && 
                <ImageBackground source={errorBg} resizeMode="cover" imageStyle={styles.imgBgIMgStyle}  style={styles.errorBgContainer}>
                  <Image source={alertIcon} style={styles.alertIcon} />
                  <Text style={styles.errorTxt}>No account exists with that email address!</Text>
                </ImageBackground>
                }
                <TouchableOpacity style={styles.btnStyle} onPress={()=> sendForgotPass()}>
                  <Image source={resetBtn} style={styles.loginBtn} />
                </TouchableOpacity>   
                {loading && <ActivityIndicator />}
                <View style={styles.gotoSingupView}> 
                  <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.gotoSignUpWhiteTxt}>Cancel</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ backgroundColor: dangerColor, marginTop: 20 }}>
                  {message !== "" && (
                    <Text style={{ color: whiteColor, padding: 10 }}>{message}</Text>
                  )}
                </View>
              </View>
            }
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
    padding: scaleX(25),
  },
  mainImgBg: {
    flex: 1,
    resizeMode: 'cover',
  },
  signinTitle: {
    fontSize: scaleX(32),
    fontWeight: '700',
    color: 'white',
    marginTop: scaleX(75),
    fontFamily: 'Montserrat_700Bold'
  },
  signinDesc: {
    fontSize: scaleX(17),
    fontWeight: '500',
    lineHeight: scaleX(24),
    marginTop: scaleX(30),
    color: '#A9ABAA',
    fontFamily: 'Montserrat_500Medium'
  },
  textLabel: {
    fontSize: scaleX(18),
    fontWeight: '500',
    lineHeight: scaleX(21),
    paddingTop: scaleX(30),
    color: '#ffffff',
    fontFamily: 'Montserrat_500Medium'
  },
  body: {
    marginTop: scaleX(100),
    marginBottom: scaleX(50),
  },
  betweenBody: {
    marginTop: scaleX(100),
    marginBottom: scaleX(50),
    flex: 1,
    justifyContent: 'space-between',
    minHeight: scaleX(300),
  },
  emailSentTitle: {
    fontSize: scaleX(26),
    lineHeight: scaleX(39),
    color: '#f4f4f4',
    marginBottom: scaleX(11),
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold'
  },
  emailSentSubTitle: {
    fontSize: scaleX(18),
    fontWeight: '600',
    lineHeight: scaleX(27),
    color: '#968FA4',
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold'
  },
  btnStyle: {
    height: scaleX(83),
    marginTop: scaleX(38),    
  },
  loginBtn: {
    width: '100%',
    height: scaleX(83),
    resizeMode: 'contain'
  },
  gotoSingupView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: scaleX(55),
  },
  gotoSignUpWhiteTxt: {
    color: '#ffffff',    
    fontSize: scaleX(17),
    fontWeight: '700',
    lineHeight: scaleX(20),
    fontFamily: 'Montserrat_700Bold',
  },
  errorBgContainer: {
    padding: scaleX(20),
    marginTop: scaleX(30),
    flexDirection: 'row'
  },
  imgBgIMgStyle: {
    borderRadius: scaleX(8),
  },
  alertIcon: {
    width: scaleX(40),
    height: scaleX(40),
    resizeMode: 'contain',
    marginRight: scaleX(12)
  },
  errorTxt: {
    fontSize: scaleX(17),
    lineHeight: scaleX(20),
    fontWeight: '500',
    fontFamily: 'Poppins_500Medium',
    color: '#E11D48',
    maxWidth: scaleX(256),
  }
});

const mapStateToProps = (state: ApplicationState) => ({
  userReducer: state.userReducer,
});

const ForgotPassScreen = connect(mapStateToProps, { OnUserForgotPass})(
  _ForgotPassScreen
);

export { ForgotPassScreen };
