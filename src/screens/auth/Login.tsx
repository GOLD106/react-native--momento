import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  Platform,
  Alert,
} from "react-native";
import { TextField } from "../../components";
import { connect } from "react-redux";
import {
  ApplicationState,
  OnUserLogin,
  OnUserLoginWithCredential
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
import alertIcon from "../../assets/signin/alertIcon.png";
import emailErrorIcon from "../../assets/signin/emailErrorIcon.png";
import passErrorIcon from "../../assets/signin/passErrorIcon.png";
import loginBtn from "../../assets/btns/loginBtn.png";
import { whiteColor } from "../../core";
import { NavigationScreenProp } from "react-navigation";
import { dangerColor, mainBgColor } from "../../core/theme/colors";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  FacebookAuthProvider,
  OAuthProvider,
} from "firebase/auth";

import {
  useFonts,
  Montserrat_700Bold,
  Montserrat_500Medium,
} from "@expo-google-fonts/montserrat";
import { Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import { scaleX } from "../../core/theme/dimensions";
import errorBg from "../../assets/signin/errorBg.png";
import { Poppins_500Medium } from "@expo-google-fonts/poppins";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import * as WebBrowser from "expo-web-browser";
import { LoginManager, AccessToken } from "react-native-fbsdk-next";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";

WebBrowser.maybeCompleteAuthSession();

interface LoginProps {
  OnUserLogin: Function;
  navigation: NavigationScreenProp<any, any>;
  OnUserLoginWithCredential: Function;
}

const _LoginScreen: React.FC<LoginProps> = ({
  OnUserLogin,
  navigation,
  OnUserLoginWithCredential,
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
      webClientId: Platform.OS === 'ios' ?
        "861695388348-1seip50p4ulcgcj7bv4injcbkagj45gr.apps.googleusercontent.com"
        : "861695388348-36udq79ombl1131s7t1u93gk8b195niq.apps.googleusercontent.com", // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    });
  }, []);

  let [fontsLoaded] = useFonts({
    Montserrat_700Bold,
    Montserrat_500Medium,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Poppins_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  const googleSignOut = async () => {
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoogleSignin = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      const credential = GoogleAuthProvider.credential(idToken);
      await OnUserLoginWithCredential(credential).then(
        (status: any) => {
          setLoading(false);
          console.log(status, "========status");
          if (!status) {
            setShowError(true);
          }
          googleSignOut();
        }
      );
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      setShowError(true);
      googleSignOut();
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

  const handleFacebookSignin = async () => {
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
        console.log("credentialcredentialcredential", credential);
        await OnUserLoginWithCredential(credential).then(
          (status: any) => {
            setLoading(false);
            console.log(status, "========status");
            if (!status) {
              setShowError(true);
            }
          }
        );
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.log(error, "error");
    }
  };

  const handleAppleSignIn = async () => {
    setLoading(true);

    try {
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

      await OnUserLoginWithCredential(credential).then(
        (status: any) => {
          setLoading(false);
          console.log(status, "========status");
          if (!status) {
            setShowError(true);
          }
        }
      );

      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.log(error, "error");
    }
  };

  const onTapAuthenticate = async () => {
    setLoading(true);
    await OnUserLogin(email, password)
      .then((status: any) => {
        setLoading(false);
        console.log('======2', status)
        if (!status) {
          setShowError(true);
        }
      })
      .catch((e: any) => {
        console.log(e);
        console.log('======3')
        setLoading(false);
        setShowError(true);
      });

    setLoading(false);
  };
  const setEmailText = (txt: string) => {
    setShowError(false);
    setEmail(txt);
  };
  const setPassTxt = (txt: string) => {
    setShowError(false);
    setPassword(txt);
  };
  return (
    <View style={styles.container}>
      <ImageBackground
        source={mainBg}
        resizeMode="cover"
        style={styles.mainImgBg}
      >
        <ScrollView style={styles.contentContainer}>
          <Text style={styles.signinTitle}>Sign In</Text>
          {/* <Text style={styles.signinDesc}>Log in to the account using email or social media</Text>    */}
          <View style={styles.body}>
            <Text style={styles.textLabel}>Email</Text>
            <TextField
              placeholder="Adresse email"
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
              placeholder="Mot de passe"
              onTextChange={setPassTxt}
              isSecure={true}
              isActive={password != ""}
              isError={showError}
              imgIcon={
                showError
                  ? passErrorIcon
                  : password == ""
                  ? passIcon
                  : passActiveIcon
              }
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
                  Incorrect email or password! Try again.
                </Text>
              </ImageBackground>
            )}
            <TouchableOpacity
              style={styles.btnStyle}
              onPress={() => onTapAuthenticate()}
            >
              <Image source={loginBtn} style={styles.loginBtn} />
            </TouchableOpacity>
            {loading && <ActivityIndicator />}

            {message !== "" && (
              <View style={{ backgroundColor: dangerColor, marginTop: 20 }}>
                <Text style={{ color: whiteColor, padding: 10 }}>
                  {message}
                </Text>
              </View>
            )}
            <View style={styles.socialLoginBtnWrapper}>
              <TouchableOpacity                
                onPress={() => handleFacebookSignin()}
              >
                {
                  Platform.OS === 'ios' ? 
                    <Image source={facebookIcon} style={styles.socialIcon} />
                  : <Image source={androidFbBtn} style={styles.socialIconForAndroid} />
                }
                
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleGoogleSignin()}
              >
                {
                  Platform.OS === 'ios' ? 
                  <Image source={goggleIcon} style={styles.socialIcon} />
                  : <Image source={androidGoogleBtn} style={styles.socialIconForAndroid} />
                }                
              </TouchableOpacity>
              {isAppleLoginAvailable && (
                <TouchableOpacity
                  onPress={() => handleAppleSignIn()}
                >
                  <Image source={appleIcon} style={styles.socialIcon} />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("Forgotpass")}>
              <Text style={styles.forgotTxt}>Forgot Password?</Text>
            </TouchableOpacity>
            <View style={styles.gotoSingupView}>
              <Text style={styles.gotoSignupTxt}>Don’t have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={styles.gotoSignUpWhiteTxt}>Sign Up</Text>
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
    marginTop: scaleX(38),
    height: scaleX(83),
  },
  loginBtn: {
    width: "100%",
    height: scaleX(83),
    resizeMode: "contain",
  },
  forgotTxt: {
    fontSize: scaleX(18),
    fontWeight: "500",
    lineHeight: scaleX(21),
    color: "#A9ABAA",
    marginTop: scaleX(25),
    textAlign: "center",
    fontFamily: "Montserrat_500Medium",
  },
  gotoSingupView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    marginTop: scaleX(35),
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
    fontFamily: "Inter_700Bold",
  },
  socialLoginBtnWrapper: {
    marginTop: scaleX(45),
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

const LoginScreen = connect(mapStateToProps, {
  OnUserLogin,
  OnUserLoginWithCredential,
})(_LoginScreen);

export { LoginScreen };
