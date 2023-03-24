import React, { useState, useEffect } from "react";
import { Dispatch } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  Platform,
  Alert
} from "react-native";
import { TextField } from "../../components";
import { connect } from "react-redux";
import {
  ApplicationState,
  OnUserSignup,
  OnUserSignupWithCredential,
} from "../../redux";

import mainBg from "../../assets/mainBg.png";
import emailIcon from "../../assets/signin/emailIcon.png";
import passIcon from "../../assets/signin/passIcon.png";
import emailActiveIcon from "../../assets/signin/emailActiveIcon.png";
import passActiveIcon from "../../assets/signin/passActiveIcon.png";

import facebookIcon from "../../assets/signin/facebookLoginIcon.png";
import goggleIcon from "../../assets/signin/goggleLoginIcon.png";
import androidGoogleBtn from "../../assets/signin/androidGoogleBtn.png";
import androidFbBtn from "../../assets/signin/androidFbBtn.png";
import appleIcon from "../../assets/signin/appleLoginIcon.png";

import signupBtn from "../../assets/btns/signupBtn.png";
import alertIcon from "../../assets/signin/alertIcon.png";
import emailErrorIcon from "../../assets/signin/emailErrorIcon.png";

import { whiteColor } from "../../core";
import { NavigationScreenProp } from "react-navigation";
import { MyGlobalContext } from "../../context/index";
import { dangerColor } from "../../core/theme/colors";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  FacebookAuthProvider,
  AuthProvider,
  OAuthProvider,
} from "firebase/auth";

import * as WebBrowser from "expo-web-browser";

import {
  useFonts,
  Montserrat_700Bold,
  Montserrat_500Medium,
} from "@expo-google-fonts/montserrat";
import { Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import { scaleX } from "../../core/theme/dimensions";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import errorBg from "../../assets/signin/errorBg.png";
import { getFirestore } from "firebase/firestore";
import { LoginManager, AccessToken } from "react-native-fbsdk-next";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";

WebBrowser.maybeCompleteAuthSession();

interface RegisterProps {
  OnUserLogin: Function;
  OnUserSignup: Function;
  OnUserSignupWithCredential: Function;
  userReducer: object;
  navigation: NavigationScreenProp<any, any>;
}

const _RegisterScreen: React.FC<RegisterProps> = ({
  OnUserSignup,
  navigation,
  OnUserSignupWithCredential,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isAppleLoginAvailable, setIsAppleLoginAvailable] = useState(false);

  useEffect(() => {
    AppleAuthentication.isAvailableAsync().then(setIsAppleLoginAvailable);
  }, []);

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ["email"], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        "861695388348-36udq79ombl1131s7t1u93gk8b195niq.apps.googleusercontent.com", // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    });
  }, []);

  const googleSignOut = async () => {
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      const credential = GoogleAuthProvider.credential(idToken);
      const auth = getAuth();
      const userData: any = await signInWithCredential(auth, credential);
      if (userData) {
        await OnUserSignupWithCredential(
          userData?.user?.uid,
          userData?.user?.email ? userData?.user?.email : userData?.user?.providerData[0]?.email,
          userData?.user?.displayName ? userData?.user?.displayName : userData?.user?.providerData[0]?.displayName,
          userData?.user?.phoneNumber
        ).then((status: any) => {
          setLoading(false);
          if (status) {
            navigation.navigate("introSlider");
          } else {
            setShowError(true);
          }
          googleSignOut();
        });
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.log(error, "error");
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  const handleFacebookSignUp = async () => {
    setLoading(true);
    try {
      const result = await LoginManager.logInWithPermissions([
        "public_profile",
        "email",
      ]);

      if (result.isCancelled) {
        throw "User cancelled the login process";
      }

      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        setShowError(true);
      } else {
        const credential = FacebookAuthProvider.credential(data.accessToken);
        const auth = getAuth();
        const userData: any = await signInWithCredential(auth, credential);
        if (userData) {
          await OnUserSignupWithCredential(
            userData?.user?.uid,
            userData?.user?.email ? userData?.user?.email : userData?.user?.providerData[0]?.email,
            userData?.user?.displayName ? userData?.user?.displayName : userData?.user?.providerData[0]?.displayName,
            userData?.user?.phoneNumber
          ).then((status: any) => {
            setLoading(false);
            if (status) {
              navigation.navigate("introSlider");
            } else {
              setShowError(true);
            }
          });
        }
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.log(error, "error");
    }
  };

  const handleAppleSignUp = async () => {
    setLoading(true);

    try {
      const auth = getAuth();
      const nonce = Math.random().toString(36).substring(2, 10);
      const hashedNonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        nonce
      );
      const appleCredential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce,
      });

      const { identityToken } = appleCredential;
      const provider = new OAuthProvider("apple.com");
      const credential = provider.credential({
        idToken: identityToken!,
        rawNonce: nonce,
      });
     
      const userData: any = await signInWithCredential(auth, credential);

      if (userData) {
        await OnUserSignupWithCredential(
          userData?.user?.uid,
          userData?.user?.email ? userData?.user?.email : userData?.user?.providerData[0]?.email,
          userData?.user?.displayName ? userData?.user?.displayName : userData?.user?.providerData[0]?.displayName,
          userData?.user?.phoneNumber
        ).then((status: any) => {
          setLoading(false);
          if (status) {
            navigation.navigate("introSlider");
          } else {
            setShowError(true);
          }
        });
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.log(error, "error");
    }
  };

  let [fontsLoaded] = useFonts({
    Montserrat_700Bold,
    Montserrat_500Medium,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const onTapAuthenticate = async () => {
    setLoading(true);
    OnUserSignup(email, password)
      .then((success: any) => {
        setLoading(false);
        if (success) {
          navigation.navigate("introSlider");
        } else {
          setShowError(true);
        }
      })
      .catch((e: any) => {
        console.log(e);
        setShowError(false);
      });
  };

  const setEmailText = (txt: string) => {
    setShowError(false);
    setEmail(txt);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={mainBg}
        resizeMode="cover"
        style={styles.mainImgBg}
      >
        <ScrollView style={styles.contentContainer}>
          <Text style={styles.signinTitle}>Sign Up</Text>
          {/* <Text style={styles.signinDesc}>Sign up today using email or social media</Text>    */}
          <View style={styles.body}>
            <Text style={styles.textLabel}>Email</Text>
            <TextField
              placeholder=""
              onTextChange={setEmailText}
              isSecure={false}
              isActive={email != ""}
              isError={showError}
              imgIcon={
                showError
                  ? emailErrorIcon
                  : email == ""
                    ? emailIcon
                    : emailActiveIcon
              }
            />
            <Text style={styles.textLabel}>Password</Text>
            <TextField
              placeholder=""
              onTextChange={setPassword}
              isSecure={true}
              isActive={password != ""}
              imgIcon={password == "" ? passIcon : passActiveIcon}
            />

            {showError && (
              <ImageBackground
                source={errorBg}
                resizeMode="cover"
                imageStyle={styles.imgBgIMgStyle}
                style={styles.errorBgContainer}
              >
                <Image source={alertIcon} style={styles.alertIcon} />
                <Text style={styles.errorTxt}>
                  An account with that email exists already!
                </Text>
              </ImageBackground>
            )}

            <TouchableOpacity
              style={styles.btnStyle}
              onPress={() => onTapAuthenticate()}
            >
              <Image source={signupBtn} style={styles.loginBtn} />
            </TouchableOpacity>

            {loading && (
              <View style={styles.container}>
                <ActivityIndicator />
              </View>
            )}
            {message !== "" && (
              <View
                style={{ backgroundColor: dangerColor, marginTop: scaleX(20) }}
              >
                <Text style={{ color: whiteColor, padding: 10 }}>
                  {message}
                </Text>
              </View>
            )}
            <View style={styles.socialLoginBtnWrapper}>
              <TouchableOpacity                
                onPress={() => handleFacebookSignUp()}
              >
                {
                  Platform.OS === 'ios' ? 
                    <Image source={facebookIcon} style={styles.socialIcon} />
                  : <Image source={androidFbBtn} style={styles.socialIconForAndroid} />
                }
                
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleGoogleSignUp()}
              >
                {
                  Platform.OS === 'ios' ? 
                  <Image source={goggleIcon} style={styles.socialIcon} />
                  : <Image source={androidGoogleBtn} style={styles.socialIconForAndroid} />
                }                
              </TouchableOpacity>
              {isAppleLoginAvailable && (
                <TouchableOpacity
                  onPress={() => handleAppleSignUp()}
                >
                  <Image source={appleIcon} style={styles.socialIcon} />
                </TouchableOpacity>
              )}
            </View>            
            <View style={styles.gotoSingupView}>
              <Text style={styles.gotoSignupTxt}>
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.gotoSignUpWhiteTxt}>Sign In</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.termsAndPolicyBtnContainer}>
              <TouchableOpacity
                onPress={() => {
                  WebBrowser.openBrowserAsync(
                    "https://mementolanguages.com/privacy.html"
                  );
                }}
                style={styles.termsAndPolicyBtn}
              >
                <Text style={styles.termsAndPolicyBtnTxt}>Privacy Policy</Text>
              </TouchableOpacity>
              <Text style={[styles.termsAndPolicyBtnTxt, styles.greyColorTxt]}> and </Text>
              <TouchableOpacity
                onPress={() => {
                  WebBrowser.openBrowserAsync(
                    "https://mementolanguages.com/terms.html"
                  );
                }}
                style={styles.termsAndPolicyBtn}
              >
                <Text style={styles.termsAndPolicyBtnTxt}>Terms & Conditions</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: scaleX(25),
  },
  mainImgBg: {
    flex: 1,
    resizeMode: "cover",
  },
  signinTitle: {
    fontSize: scaleX(32),
    fontWeight: "700",
    color: "white",
    marginTop: scaleX(15),
    fontFamily: "Montserrat_700Bold",
  },
  signinDesc: {
    fontSize: scaleX(17),
    fontWeight: "500",
    lineHeight: scaleX(24),
    marginTop: scaleX(30),
    color: "#A9ABAA",
    fontFamily: "Montserrat_500Medium",
  },
  textLabel: {
    fontSize: scaleX(18),
    fontWeight: "500",
    lineHeight: scaleX(21),
    paddingTop: scaleX(30),
    color: "#ffffff",
    fontFamily: "Montserrat_500Medium",
  },
  body: {
    marginTop: scaleX(20),
    marginBottom: scaleX(50),
  },
  btnStyle: {
    alignItems: "center",
    justifyContent: "center",
    height: scaleX(83),
    marginTop: scaleX(38),
  },
  loginBtn: {
    width: "100%",
    height: scaleX(83),
    resizeMode: "contain",
  },
  gotoSingupView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    marginTop: scaleX(55),
  },
  gotoSignupTxt: {
    fontSize: scaleX(17),
    fontWeight: "700",
    color: "#8B8B8D",
    lineHeight: scaleX(20),
    fontFamily: "Inter_500Medium",
  },
  gotoSignUpWhiteTxt: {
    color: "#ffffff",
    fontSize: scaleX(17),
    fontWeight: "700",
    lineHeight: scaleX(20),
  },
  socialLoginBtnWrapper: {
    marginTop: scaleX(55),
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  socialBtn: {
    width: scaleX(60),
    height: scaleX(60),
    backgroundColor: "#292627",
    borderRadius: scaleX(12.42),
    borderWidth: scaleX(1),
    borderColor: "#A293BE",
    alignItems: "center",
    justifyContent: "center",
  },
  socialIcon: {
    width: scaleX(60),
    height: scaleX(60),
    resizeMode: "contain",
    alignItems: "center",
  },
  socialIconForAndroid: {
    height: scaleX(60),
    resizeMode: "contain",
    alignItems: "center",
  },
  errorBgContainer: {
    padding: scaleX(20),
    marginTop: scaleX(30),
    flexDirection: "row",
  },
  imgBgIMgStyle: {
    borderRadius: scaleX(8),
  },
  alertIcon: {
    width: scaleX(40),
    height: scaleX(40),
    resizeMode: "contain",
    marginRight: scaleX(12),
  },
  errorTxt: {
    fontSize: scaleX(17),
    lineHeight: scaleX(20),
    fontWeight: "500",
    fontFamily: "Poppins_500Medium",
    color: "#E11D48",
    maxWidth: scaleX(256),
  },
  termsAndPolicyBtnContainer: {
    marginVertical: scaleX(20),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: 'center',
  },
  termsAndPolicyBtn: {},
  termsAndPolicyBtnTxt: {
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
    fontSize: scaleX(17),
    lineHeight: scaleX(20),
    color: "#FFFFFF",
  },
  greyColorTxt: {
    color: '#A9ABAA'
  }
});

const mapStateToProps = (state: ApplicationState) => ({
  userReducer: state.userReducer,
});

const RegisterScreen = connect(mapStateToProps, {
  OnUserSignup,
  OnUserSignupWithCredential,
})(_RegisterScreen);

export { RegisterScreen };
