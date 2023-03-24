import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageBackground,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import mainBg from "../assets/mainBg.png";
import freePlanIcon from "../assets/common/freePlanIcon.png";
import freePlanActiveIcon from "../assets/common/freePlanActiveIcon.png";
import premiumPlanIcon from "../assets/common/premiumPlanIcon.png";
import premiumPlanActiveIcon from "../assets/common/premiumPlanActiveIcon.png";
import starPlanIcon from "../assets/common/starPlanIcon.png";
import starPlanActiveIcon from "../assets/common/starPlanActiveIcon.png";
import mostPopularPlanIcon from "../assets/common/mostPopularPlanIcon.png";
import cardDeck from "../assets/common/cardDeck.png";
import jojo from "../assets/common/jojo.png";
import listItemIcon from "../assets/common/listItemIcon.png";
import deactivateListIcon from "../assets/common/deactivateListIcon.png";
import continueBtn from "../assets/btns/continueBtn.png";
import subscribeBtn from "../assets/btns/subscribeBtn.png";
import { NavigationScreenProp } from "react-navigation";
import { useRoute, useIsFocused } from "@react-navigation/native";
import { HomeOption } from "../types";
import { connect } from "react-redux";
import { ApplicationState, OnUpdateUserData } from "../redux";
import BottomNavigator from "./component/BottomNavigator";
import addIcon from "../assets/common/addIcon.png";
import subscribeListBg from "../assets/btns/subscribeListBg.png";
import deactiveSubscriptionBg from "../assets/btns/deactiveSubscriptionBg.png";
import mostPopularTxt from "../assets/users/mostPopularTxt.png";

import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import TopBarLeftArrow from "./component/TobBarLeftArrow";
import { scaleX } from "../core/theme/dimensions";
import {
  getFirestore,
  addDoc,
  doc,
  getDoc,
  collection,
  updateDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import * as WebBrowser from "expo-web-browser";

import {
  GooglePayButton,
  useGooglePay,
  ApplePayButton,
  useApplePay,
} from "@stripe/stripe-react-native";

import { getFunctions, httpsCallable } from "firebase/functions";

interface Props {
  options: [HomeOption];
  navigation: NavigationScreenProp<any, any>;
  userReducer: any;
}

const _UpgradeAccount: React.FC<Props> = (props: Props) => {
  const {
    isGooglePaySupported,
    initGooglePay,
    presentGooglePay,
    loading,
    createGooglePayPaymentMethod,
  } = useGooglePay();

  const { presentApplePay, confirmApplePayPayment, isApplePaySupported } =
    useApplePay();

  const [curUserData, setCurUserData] = useState<any>({});
  const [curUserId, setCurUserId] = useState("");
  const [stripeCustomerId, setStripeCustomerId] = useState("");

  const [initialized, setInitialized] = useState(false);
  const [priceId, setPriceId] = useState("");
  const isFocused = useIsFocused();
  const [showLoading, setShowLoading] = useState(false);
  const [disabledGooglePay, setDisabledGooglePay] = useState(true);

  useEffect(() => {
    props?.userReducer?.then((userData: any) => {
      setCurUserData(userData?.curUser);
      setCurUserId(userData?.userId);
      if (userData?.curUser?.stripeCustomerId) {
        setStripeCustomerId(userData?.curUser?.stripeCustomerId);
      } else {
        setUserStripeCustomerId(userData?.userId, userData?.curUser);
      }
      if (userData?.curUser?.subscription) {
        setPriceId(userData?.curUser?.subscription?.planPrice);
      }
    });
  }, [props.userReducer, isFocused]);

  useEffect(() => {
    async function initPage() {
      Platform.OS === "ios" ? "initializeApplePay()" : initializeGooglePay();
    }
    initPage();
  }, []);

  useEffect(() => {
    console.log('isApplePaySupported',isApplePaySupported);
  }, [isApplePaySupported]);

  const createStripeCustomerId = async (curUserData: any) => {
    const functions = getFunctions();
    const stripeCreateCustomer = httpsCallable(
      functions,
      "stripeCreateCustomer"
    );

    const response: any = await stripeCreateCustomer({
      email: curUserData.email,
      firstName: curUserData.firstName,
      uid: curUserId,
    }).catch((e) => console.log(e));

    const { id } = await response.data;

    return id;
  };
  const setUserStripeCustomerId = async (userId: string, userData: any) => {
    const stripeCustomerNewId = await createStripeCustomerId(userData).catch(
      (e) => console.log(e)
    );
    setStripeCustomerId(stripeCustomerNewId);
    console.log(stripeCustomerNewId, "created id");
    const firestore = getFirestore();
    updateDoc(doc(firestore, "Users", userId), {
      stripeCustomerId: stripeCustomerNewId,
    })
      .then(() => {
        curUserData["stripeCustomerId"] = stripeCustomerNewId;
        OnUpdateUserData(curUserData, curUserId);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  // const fetchPaymentIntentClientSecret = async () => {
  //   const functions = getFunctions()
  //   const paymentSubscriptionIntent = httpsCallable(functions, 'paymentSubscriptionIntent')  ;

  //   const response:any = await paymentSubscriptionIntent()

  //   const { client_secret } = await response.data;

  //   return client_secret;
  // };

  const fetchCreateSubscription = async () => {
    const functions = getFunctions();
    const createSubscription = httpsCallable(functions, "createSubscription");

    const response: any = await createSubscription({
      stripeCustomerId,
      price: priceId,
      uid: curUserId,
    });

    console.log(response, "@@@create subscription");
    const { data } = await response;

    return data;
  };

  const payWithGoogle = async () => {
    setShowLoading(true);
    const responseData = await fetchCreateSubscription();
    const { client_secret } = await responseData?.latest_invoice
      ?.payment_intent;
    const { error } = await presentGooglePay({
      clientSecret: client_secret,
      forSetupIntent: false,
    });

    if (error) {
      Alert.alert(error.code, error.message);
      setShowLoading(false);
      // Update UI to prompt user to retry payment (and possibly another payment method)
      return;
    }
    const firestore = getFirestore();
    updateDoc(doc(firestore, "Users", curUserId), {
      userType:
        priceId == "price_1MGvPkGg5YK1Q5KrrOnbBqkl" ? "star" : "premium",
      subscription: {
        id: responseData?.id,
        current_period_end: responseData?.current_period_end,
        current_period_start: responseData?.current_period_start,
        planPrice: responseData?.plan?.id,
      },
    })
      .then(() => {
        curUserData["subscription"] = {
          id: responseData.id,
          current_period_end: responseData?.current_period_end,
          current_period_start: responseData?.current_period_start,
          planPrice: responseData?.plan?.id,
        };
        curUserData["userType"] =
          priceId == "price_1MGvPkGg5YK1Q5KrrOnbBqkl" ? "star" : "premium";
        setShowLoading(false);
        OnUpdateUserData(curUserData, curUserId);
        handleNavigate("home");
      })
      .catch((e) => {
        setShowLoading(false);
        console.log(e);
      });
    Alert.alert("Success", "The payment was confirmed successfully.");
  };

  const payWithApple = async () => {
    console.log("payWithApple");
    if (!isApplePaySupported) return;
    setShowLoading(true);
    const { error } = await presentApplePay({
      cartItems: [
        {
          label: "payment cart items",
          amount:
            priceId == "price_1MGvPkGg5YK1Q5KrrOnbBqkl" ? "14.99" : "96.00",
          type: "final",
        },
      ],
      country: "US",
      currency: "USD",
      // shippingMethods: [
      //   {
      //     amount: '20.00',
      //     identifier: 'DPS',
      //     label: 'Courier',
      //     detail: 'Delivery',
      //     type: 'final',
      //   },
      // ],
      requiredShippingAddressFields: ["emailAddress", "phoneNumber"],
      requiredBillingContactFields: ["phoneNumber", "name"],
    });
    if (error) {
      setShowLoading(false);
      Alert.alert("Apple payment error");
      return;
    } else {
      const responseData = await fetchCreateSubscription();
      const clientSecret = await responseData?.latest_invoice?.payment_intent
        ?.client_secret;

      const { error: confirmError } = await confirmApplePayPayment(
        clientSecret
      );

      if (confirmError) {
        setShowLoading(false);
        Alert.alert("Confirm error");
        return;
      } else {
        console.log("Apple pay successed");
        const firestore = getFirestore();
        updateDoc(doc(firestore, "Users", curUserId), {
          userType:
            priceId == "price_1MGvPkGg5YK1Q5KrrOnbBqkl" ? "star" : "premium",
          subscription: {
            id: responseData?.id,
            current_period_end: responseData?.current_period_end,
            current_period_start: responseData?.current_period_start,
            planPrice: responseData?.plan?.id,
          },
        })
          .then(() => {
            curUserData["subscription"] = {
              id: responseData.id,
              current_period_end: responseData?.current_period_end,
              current_period_start: responseData?.current_period_start,
              planPrice: responseData?.plan?.id,
            };
            curUserData["userType"] =
              priceId == "price_1MGvPkGg5YK1Q5KrrOnbBqkl" ? "star" : "premium";
            setShowLoading(false);
            OnUpdateUserData(curUserData, curUserId);
            handleNavigate("home");
          })
          .catch((e) => {
            setShowLoading(false);
            console.log(e);
          });
      }
    }
  };
  const initializeGooglePay = async () => {
    setShowLoading(true);
    if (!(await isGooglePaySupported({ testEnv: true }))) {
      console.log("disable google pay");
      setShowLoading(false);
      setDisabledGooglePay(true);
      Alert.alert("Google Pay is not supported.");
      return;
    }

    console.log("enable google pay");
    const { error } = await initGooglePay({
      testEnv: true,
      merchantName: "Test",
      countryCode: "US",
      billingAddressConfig: {
        format: "FULL",
        isPhoneNumberRequired: true,
        isRequired: false,
      },
      existingPaymentMethodRequired: false,
      isEmailRequired: true,
    });

    setShowLoading(false);
    if (error) {
      Alert.alert(error.code, error.message);
      return;
    }
    setDisabledGooglePay(false);
    setInitialized(true);
  };

  const handleNavigate = (screen: string): void => {
    props.navigation.navigate(screen);
  };

  const renderTermsAndPolicyTxt = () => {
    return (
      <View style={styles.termsAndPolicyContainer}>
        <Text style={styles.termsAndPolicyDescTxt}>
          {Platform.OS === "ios"
            ? "Payment will be charged to your Itunes account at confrimation of purchase. Subscriptions automatically renew unless auto-renew is turned off at least 24-hours prior to the end of the current period. Subscriptions may be managed by the user and auto-renewal may be turned off by going to the user’s account settings of the App Store after purchase."
            : "Payment will be charged to your Google Play Account at confrimation of purchase. Subscriptions automatically renew unless auto-renew is turned off at least 24-hours prior to the end of the current period. Subscriptions may be managed by the user and auto-renewal may be turned off by going to the subscription settings after purchase."}
        </Text>
        <View style={styles.termsAndPolicyBtnContainer}>
          <TouchableOpacity
            onPress={() => {
              WebBrowser.openBrowserAsync(
                "https://mementolanguages.com/terms.html"
              );
            }}
            style={styles.termsAndPolicyBtn}
          >
            <Text style={styles.termsAndPolicyBtnTxt}>Terms of Use</Text>
          </TouchableOpacity>
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
        </View>
      </View>
    );
  };

  let [fontsLoaded] = useFonts({
    Montserrat_700Bold,
    Montserrat_600SemiBold,
    Montserrat_500Medium,
    Montserrat_400Regular,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={mainBg}
        resizeMode="cover"
        style={styles.mainImgBg}
      >
        <ScrollView style={styles.contentContainer}>
          <View style={styles.titleWithBack}>
            <TopBarLeftArrow navigation={props?.navigation} />
          </View>
          <View style={styles.mainContent}>
            <Text style={styles.titleTxt}>Upgrade Account</Text>
            <Text style={styles.subTitle}>
              Premium upgrade to unlock more decks and features.
            </Text>

            <View style={[styles.spaceBetweenContainer, styles.middleTitle]}>
              <Text style={styles.middleTitleTxt}>Choose Plan:</Text>
              {priceId === "price_1MGvRiGg5YK1Q5KrYnlLgSMp" && (
                <View style={styles.txtAndBg}>
                  <Image
                    source={mostPopularTxt}
                    style={styles.mostPopularTxt}
                  />
                  <Image
                    source={mostPopularPlanIcon}
                    style={styles.mostPopularPlanIcon}
                  />
                </View>
              )}
            </View>
            <View>
              <TouchableOpacity
                onPress={() => setPriceId("")}
                style={styles.deckListItemContainer}
              >
                <ImageBackground
                  source={
                    priceId == "" ? subscribeListBg : deactiveSubscriptionBg
                  }
                  resizeMode="cover"
                  style={styles.savedDeckListItem}
                >
                  <Image
                    source={priceId == "" ? freePlanActiveIcon : freePlanIcon}
                    style={styles.planIcon}
                  />
                  <View style={styles.savedDeckListItemTxtContainer}>
                    <View>
                      <Text
                        style={[
                          styles.itemTitle,
                          priceId == "" && styles.selectedItemTitle,
                        ]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        Free
                      </Text>
                      <Text
                        style={[
                          styles.itemTimeTxt,
                          priceId == "" && styles.selectedItemTimeTxt,
                        ]}
                      >
                        Forever
                      </Text>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setPriceId("price_1MGvPkGg5YK1Q5KrrOnbBqkl")}
                style={styles.deckListItemContainer}
              >
                <ImageBackground
                  source={
                    priceId == "price_1MGvPkGg5YK1Q5KrrOnbBqkl"
                      ? subscribeListBg
                      : deactiveSubscriptionBg
                  }
                  resizeMode="cover"
                  style={styles.savedDeckListItem}
                >
                  <Image
                    source={
                      priceId == "price_1MGvPkGg5YK1Q5KrrOnbBqkl"
                        ? starPlanActiveIcon
                        : starPlanIcon
                    }
                    style={styles.planIcon}
                  />
                  <View style={styles.savedDeckListItemTxtContainer}>
                    <View>
                      <Text
                        style={[
                          styles.itemTitle,
                          priceId == "price_1MGvPkGg5YK1Q5KrrOnbBqkl" &&
                            styles.selectedItemTitle,
                        ]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        Star
                      </Text>
                      <Text
                        style={[
                          styles.itemTimeTxt,
                          priceId == "price_1MGvPkGg5YK1Q5KrrOnbBqkl" &&
                            styles.selectedItemTimeTxt,
                        ]}
                      >
                        Billed monthly
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.priceTxt,
                        priceId == "price_1MGvPkGg5YK1Q5KrrOnbBqkl" &&
                          styles.selectedItemTitle,
                      ]}
                    >
                      $14.99
                    </Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setPriceId("price_1MGvRiGg5YK1Q5KrYnlLgSMp")}
                style={styles.deckListItemContainer}
              >
                {priceId == "price_1MGvRiGg5YK1Q5KrYnlLgSMp" && (
                  <View style={styles.discountContainer} ><Text style={styles.discountTxt}>-46%</Text></View>
                )}
                <ImageBackground
                  source={
                    priceId == "price_1MGvRiGg5YK1Q5KrYnlLgSMp"
                      ? subscribeListBg
                      : deactiveSubscriptionBg
                  }
                  resizeMode="cover"
                  style={styles.savedDeckListItem}
                >
                  <Image
                    source={
                      priceId == "price_1MGvRiGg5YK1Q5KrYnlLgSMp"
                        ? premiumPlanActiveIcon
                        : premiumPlanIcon
                    }
                    style={styles.planIcon}
                  />
                  <View style={styles.savedDeckListItemTxtContainer}>
                    <View>
                      <Text
                        style={[
                          styles.itemTitle,
                          priceId == "price_1MGvRiGg5YK1Q5KrYnlLgSMp" &&
                            styles.selectedItemTitle,
                        ]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        Premium
                      </Text>
                      <Text
                        style={[
                          styles.itemTimeTxt,
                          priceId == "price_1MGvRiGg5YK1Q5KrYnlLgSMp" &&
                            styles.selectedItemTimeTxt,
                        ]}
                      >
                        Billed Yearly $96.00 
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.priceTxt,
                        priceId == "price_1MGvRiGg5YK1Q5KrYnlLgSMp" &&
                          styles.selectedItemTitle,
                      ]}
                    >
                      $8.00
                    </Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>

              <View style={styles.featureContainer}>
                <Text style={styles.featureTxt}>Features:</Text>
                {priceId === "" ? (
                  <View>
                    <View style={styles.featureItem}>
                      <Image
                        source={listItemIcon}
                        style={styles.listItemIcon}
                      />
                      <Text style={styles.listItemTxt}>
                        {"Access Free Decks"}
                      </Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Image
                        source={listItemIcon}
                        style={styles.listItemIcon}
                      />
                      <Text style={styles.listItemTxt}>
                        {"Limited Plays Per Day"}
                      </Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Image
                        source={listItemIcon}
                        style={styles.listItemIcon}
                      />
                      <Text style={styles.listItemTxt}>
                        {"Create Your Own Deck"}
                      </Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Image
                        source={deactivateListIcon}
                        style={styles.listItemIcon}
                      />
                      <Text
                        style={[
                          styles.listItemTxt,
                          styles.deactivateFeatureTxt,
                        ]}
                      >
                        {"No Ads"}
                      </Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Image
                        source={deactivateListIcon}
                        style={styles.listItemIcon}
                      />
                      <Text
                        style={[
                          styles.listItemTxt,
                          styles.deactivateFeatureTxt,
                        ]}
                      >
                        {"Full Access to all Decks"}
                      </Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Image
                        source={deactivateListIcon}
                        style={styles.listItemIcon}
                      />
                      <Text
                        style={[
                          styles.listItemTxt,
                          styles.deactivateFeatureTxt,
                        ]}
                      >
                        {"Offline (Download) Mode"}
                      </Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Image
                        source={deactivateListIcon}
                        style={styles.listItemIcon}
                      />
                      <Text
                        style={[
                          styles.listItemTxt,
                          styles.deactivateFeatureTxt,
                        ]}
                      >
                        {"Create unlimited decks"}
                      </Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Image
                        source={deactivateListIcon}
                        style={styles.listItemIcon}
                      />
                      <Text
                        style={[
                          styles.listItemTxt,
                          styles.deactivateFeatureTxt,
                        ]}
                      >
                        {"Full AI Voice Features"}
                      </Text>
                    </View>
                    <View style={styles.continueBtnContainer}>
                      <TouchableOpacity
                        onPress={() => handleNavigate("home")}
                        style={styles.continueBtn}
                      >
                        <Image
                          source={continueBtn}
                          style={styles.subscribeIcon}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View>
                    <View style={styles.featureItem}>
                      <Image
                        source={listItemIcon}
                        style={styles.listItemIcon}
                      />
                      <Text style={styles.listItemTxt}>{"No Ads"}</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Image
                        source={listItemIcon}
                        style={styles.listItemIcon}
                      />
                      <Text style={styles.listItemTxt}>
                        {"Full Access to all Decks"}
                      </Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Image
                        source={listItemIcon}
                        style={styles.listItemIcon}
                      />
                      <Text style={styles.listItemTxt}>
                        {"Offline (Download) Mode"}
                      </Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Image
                        source={listItemIcon}
                        style={styles.listItemIcon}
                      />
                      <Text style={styles.listItemTxt}>
                        Create unlimited decks
                      </Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Image
                        source={listItemIcon}
                        style={styles.listItemIcon}
                      />
                      <Text style={styles.listItemTxt}>
                        Full AI Voice Features
                      </Text>
                    </View>
                    <View style={styles.continueBtnContainer}>
                      <TouchableOpacity
                        onPress={() =>
                          Platform.OS === "ios"
                            ? payWithApple()
                            : payWithGoogle()
                        }
                        disabled={!isApplePaySupported && disabledGooglePay}
                        style={styles.continueBtn}
                      >
                        <Image
                          source={subscribeBtn}
                          style={styles.subscribeIcon}
                        />
                      </TouchableOpacity>
                      {showLoading && <ActivityIndicator />}
                      {/* <GooglePayButton
                      disabled={!initialized || loading}
                      style={styles.standardButton}
                      type="standard"
                      onPress={payWithGoogle}
                    /> */}
                    </View>
                    {renderTermsAndPolicyTxt()}
                  </View>
                )}
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
  titleWithBack: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  mainContent: {
    marginTop: scaleX(38),
    marginBottom: scaleX(80),
  },
  titleTxt: {
    fontSize: scaleX(24),
    fontWeight: "700",
    lineHeight: scaleX(33),
    color: "#EEECF4",
    maxWidth: scaleX(310),
    fontFamily: "Inter_700Bold",
  },
  spaceBetweenContainer: {
    flexDirection: "row",
    // justifyContent: 'space-between',
    alignItems: "center",
  },
  middleTitleTxt: {
    fontSize: scaleX(20),
    fontWeight: "700",
    lineHeight: scaleX(33),
    color: "#EEECF4",
    fontFamily: "Inter_700Bold",
  },
  middleTitle: {
    marginTop: scaleX(46),
  },
  deckListItemContainer: {
    borderRadius: scaleX(12),
    // overflow: "hidden",
    marginTop: scaleX(25),
  },
  savedDeckListItem: {
    padding: scaleX(15),
    backgroundColor: "#1D1B21",
    borderRadius: scaleX(12),
    // marginTop: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    position: "relative",
  },
  discountContainer: {
    paddingHorizontal: scaleX(12),
    paddingVertical: scaleX(2),
    position: "absolute",
    top: scaleX(-13),
    right: scaleX(40),
    backgroundColor: "#FD5828",
    borderRadius: scaleX(20),
    zIndex:222,
  },
  discountTxt: {
    fontSize: scaleX(14),
    fontWeight: "600",
    lineHeight: scaleX(21),
    color: "#ffffff",   
  },
  selectedListItem: {
    // backgroundColor: '#FF8718'
  },
  selectedItemTitle: {
    color: "white",
  },
  savedDeckListItemTxtContainer: {
    flex: 1,
    marginLeft: scaleX(20),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemTitle: {
    fontSize: scaleX(22),
    fontWeight: "700",
    lineHeight: scaleX(24),
    color: "#47454A",
    maxWidth: scaleX(200),
  },
  itemTimeTxt: {
    fontSize: scaleX(13),
    fontWeight: "600",
    lineHeight: scaleX(24),
    color: "#47454A",
    fontFamily: "Inter_600SemiBold",
  },
  selectedItemTimeTxt: {
    color: "#FFE3B9",
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  savedDeckPlayIcon: {
    width: scaleX(50),
    height: scaleX(50),
    resizeMode: "cover",
    borderRadius: scaleX(10),
    marginLeft: scaleX(25),
  },
  emptyDeckContent: {
    flex: 1,
    height: scaleX(Dimensions.get("window").height - 150),
    justifyContent: "center",
    alignItems: "center",
  },
  centerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  emptyDeckTitle: {
    fontSize: scaleX(26),
    lineHeight: scaleX(31),
    fontWeight: "600",
    textAlign: "center",
    color: "#F4F4F4",
    maxWidth: scaleX(320),
  },
  emptyDeckSubTitle: {
    marginTop: scaleX(21),
    fontSize: scaleX(18),
    lineHeight: scaleX(22),
    fontWeight: "600",
    textAlign: "center",
    color: "#968FA4",
    maxWidth: scaleX(247),
  },
  subTitle: {
    fontSize: scaleX(18),
    lineHeight: scaleX(24),
    fontWeight: "400",
    color: "#AEADAF",
    marginTop: scaleX(24),
    fontFamily: "Inter_400Regular",
  },
  curPlanTxt: {
    fontSize: scaleX(20),
    lineHeight: scaleX(33),
    fontWeight: "700",
    color: "#FFF960",
    marginLeft: scaleX(10),
    marginRight: scaleX(10),
    fontFamily: "Inter_700Bold",
  },
  mostPopularPlanIcon: {
    width: scaleX(34),
    height: scaleX(29),
    resizeMode: "contain",
  },
  planIcon: {
    width: scaleX(65),
    height: scaleX(65),
    resizeMode: "cover",
  },
  priceTxt: {
    fontSize: scaleX(27),
    fontWeight: "700",
    color: "#47454A",
    fontFamily: "Inter_700Bold",
  },
  featureContainer: {
    marginTop: scaleX(53),
  },
  featureTxt: {
    fontSize: scaleX(20),
    lineHeight: scaleX(33),
    fontWeight: "700",
    color: "#EEECF4",
    marginBottom: scaleX(28),
    fontFamily: "Inter_700Bold",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  listItemIcon: {
    width: scaleX(14),
    height: scaleX(14),
    resizeMode: "cover",
  },
  listItemTxt: {
    fontSize: scaleX(18),
    lineHeight: scaleX(33),
    fontWeight: "600",
    color: "#959598",
    marginLeft: scaleX(19),
    fontFamily: "Inter_600SemiBold",
  },
  deactivateFeatureTxt: {
    textDecorationLine: "line-through",
  },
  continueBtnContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  continueBtn: {
    marginTop: scaleX(27),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: scaleX(183),
    height: scaleX(55),
  },
  subscribeIcon: {
    width: scaleX(183),
    height: scaleX(55),
    resizeMode: "cover",
  },
  maskViewContainer: {
    flex: 1,
    flexDirection: "row",
    height: 30,
    backgroundColor: "red",
    // width: 200,
  },
  maskViewContent: {
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  mostPopularTxt: {
    width: scaleX(143),
    height: scaleX(19.7),
    resizeMode: "contain",
    marginTop: scaleX(7),
    marginRight: scaleX(10),
  },
  txtAndBg: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 1,
  },
  standardButton: {
    width: 90,
    height: 40,
  },
  applePayButton: {
    width: "65%",
    height: 50,
    marginTop: 60,
    alignSelf: "center",
  },
  termsAndPolicyContainer: {
    marginTop: scaleX(40),
  },
  termsAndPolicyDescTxt: {
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
    fontSize: scaleX(12),
    lineHeight: scaleX(20),
    color: "#959598",
  },
  termsAndPolicyBtnContainer: {
    marginTop: scaleX(5),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  termsAndPolicyBtn: {},
  termsAndPolicyBtnTxt: {
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
    fontSize: scaleX(12),
    lineHeight: scaleX(33),
    color: "#959598",
    textDecorationLine: "underline",
  },
});

const mapStateToProps = (state: ApplicationState) => ({
  userReducer: state.userReducer,
});

const UpgradeAccount = connect(mapStateToProps, { OnUpdateUserData })(
  _UpgradeAccount
);

export default UpgradeAccount;
