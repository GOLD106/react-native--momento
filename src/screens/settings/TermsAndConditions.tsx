import React from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  ImageBackground,
} from "react-native";
import mainBg from "../../assets/mainBg.png";
import { NavigationScreenProp } from "react-navigation";
import { connect } from "react-redux";
import {ApplicationState} from "../../redux";
import BottomNavigator from "../component/BottomNavigator";
import addIcon from '../../assets/common/addIcon.png'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts,  Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold} from '@expo-google-fonts/montserrat';
import {Inter_500Medium, Inter_700Bold} from '@expo-google-fonts/inter';
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";
import TopBarLeftArrow from "../component/TobBarLeftArrow";
import { scaleX } from "../../core/theme/dimensions";

interface Props {
  navigation: NavigationScreenProp<any, any>;
}


const _TermsAndConditions: React.FC<Props> = (props: Props) => { 
 
  const handleNavigate = (screen: string): void => {
    props.navigation.navigate(screen);
  };

  const gotoAddDeck = () => {
    handleNavigate('selectdeckType')
  }

  const logout = () => {
    console.log('logout')
    AsyncStorage.removeItem('user')
    .then(() => {
      props.navigation.navigate('Login')
    })    
  }

  
  let [fontsLoaded] = useFonts({
    Montserrat_700Bold, Montserrat_600SemiBold, Montserrat_500Medium, Montserrat_400Regular,
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
            <TopBarLeftArrow navigation={props.navigation} />
          </View>
          <View style={styles.menuContent}>
            <View>
              <Text style={styles.pageTitle}>
                Terms & Conditions
              </Text>
              <Text style={styles.pageDesc}>
              Thank you for using Memento Languages ("Memento Japanese"). These are the terms of use ("Terms"), which apply to your use of the Memento Japanese application ("App") and the services available to you on the app ("Services"). By using our App and/or when using any of our features, you (“User”) engage in our Services and agree to be bound by the following Terms including those additional terms and conditions and policies referenced herein and/or available by hyperlink. These Terms and Conditions apply to all users of the site, including without limitation users who are contributors of content (“Content Creators”).For information on how information is gathered and used at the App please go to our privacy policy found at //www.mementolanguages.com/privacy.html The Privacy Policy is incorporated into these Terms by reference. If you do not agree to these Terms, you must discontinue using the App and terminate your registration with us. The App is owned by Memento Languages LLC.
              {"\n"}{"\n"}
              Registration{"\n"}
              When you register with Memento Japanese, you will be asked to provide us with personally identifiable information that we may request, all of which will become part of your profile and which you can add to or change from time to time. You will also be asked to select a screen name and password which will serve to identify you as a registered user each time you visit the App and allow you to access your account. You may not (i) select or use a screen name of another person with intent to impersonate that person, (ii) use a screen name in which another person has rights without authorization from that person, or (iii) use a screen name that Memento Japanese, at its sole discretion, deems offensive. You agree to provide (i) true, accurate, current and complete information about yourself as prompted by the registration form, and (ii) maintain and properly update your profile to keep it true, accurate, current and complete. If you provide information that is untrue, inaccurate, not current or incomplete, or Memento Japanese has reasonable grounds to suspect that you have, we have the right to suspend or terminate your registration status and deny you future use of the App and the Services (or any portion thereof). You must be at least 14 years old to register and to use the Services. Th e App and Services are not intended for children under the age of 14. Use of the App: This App and the Services offered are intended for your personal, non-commercial use in accordance with these terms. You agree that you will not (i) copy, display or distribute any part of the App, in any medium, for any commercial purposes, or (ii) alter or modify any part of the App other than as may be reasonably necessary to use the App for its intended purpose. You further agree that you will not use any automated devices, such as spiders, robots or data mining techniques to catalog, download, store or otherwise reproduce, store or distribute content available on the App, or to manipulate the App or the Services, or otherwise exceed the limited access granted to you by Memento Japanese. Personal Profile
              {"\n"}{"\n"}
              Personal Profile:{"\n"}
              By creating a User profile and accessing content on the App that information and your activity on the App may be visible to other users of the App. Memento Languages makes every effort to ensure that your profile and posts are kept private. However, mistakes can happen. If you believe that your profile or activities are being displayed in a manner that you did not authorize, you can notify us of the error by emailing info@mementolanguages.com and we will correct the problem promptly. However, you agree that your sole remedy against us if we were to make such a mistake is to require us to remove any and all personal information from our servers. By creating a Content Creator profile and accessing content on the App you agree that information and your activity on the App is visible to everyone who uses the App. Content Creator Submissions Some of the content on Memento Japanese is submitted by our Content Creators. We encourage you to take advantage of the many opportunities to interact with Memento Japanese registered Content Creators by viewing content and visiting any external links which they may display. You acknowledge that by using the App, you may be exposed to content that you find objectionable, indecent or offensive or which is inaccurate, misleading or incomplete. We are not responsible for the accuracy, completeness or usefulness of any content, nor do we endorse such content. We do not verify the identity of people using our App. You use the App and the content at your own risk.
              {"\n"}{"\n"}
              User Policies{"\n"}
              All content that you post to Memento Japanese, including videos and any other content that you upload, must comply with these Terms. You take sole responsibility for all content that you post on the App and the consequences of posting that content. You are responsible for obtaining all necessary rights to upload, post and distribute the content. You agree that you will not upload, email, transmit, or otherwise make available any content that: is threatening, defamatory, abusive, obscene, pornographic, or any material that would give rise to any civil or criminal liability under applicable law; could infringe any copyright, trademark, publicity or privacy right or any other intellectual property right of any person or entity unless you have first received permission from the owner of those rights to use the materials; contains slurs, hate speech or which attack an individual or group on the basis of race, color, religion, national origin, or sexual preferences; constitutes spam; is a solicitation or advertisement for any commercial product or activity; constitutes behavior that does not support a safe and comfortable environment for all users; or contains any materials that encourage inappropriate or unlawful conduct.
              {"\n"}{"\n"}
              We may, at our sole discretion, immediately terminate your access to the App should your conduct fail to conform with these Terms. You understand that you are personally responsible for your behavior while on the App and agree to indemnify and hold Memento Japanese, and its affiliates, business partners, and their respective officers, directors, employees, and agents, harmless from and against any loss, damage, liability, cost, or expense of any kind (including attorneys' fees) that we may incur in connection with a third party claim or otherwise, in relation to your use of the Services or access to or use of the App, or your violation of either these Terms, applicable law, or the rights of any third party. We have the right to view and monitor any content posted to this App and we reserve the right, but not the obligation, to monitor, edit or remove any content at any time and without notice if we believe that the content violates these Terms, removal is necessary to protect the rights, property or personal safety of Memento Japanese, its users and the public, if required to do so by law, or if we believe in our sole discretion that doing so will improve our App and the experience of our users.
              {"\n"}{"\n"}
              If you believe that any postings on the App violate these Terms, please let us know by emailing us at
              info@mementolanguages.com
              {"\n"}{"\n"}
              Use of your Information:{"\n"}
              By using the service and submitting content to the App, you grant to Memento Languages, and its successors in business, a perpetual, worldwide, royalty-free, and non-exclusive license to reproduce, distribute, modify, edit, display, adapt, create derivative works from your content, for any commercial purposes, and in any medium now existing or hereinafter developed, without your prior approval or the payment of any compensation.
              {"\n"}{"\n"}
              Memento Japanese Intellectual Property:{"\n"}
              The App and, with the exception of material posted by registered users and third party content, all material published on the App, including, but not limited to text, photographs, video, text, graphics, music, audio, sounds, messages, ratings, and other materials is owned by Memento Japanese or its licensors and is protected by copyright, patents, trademarks, trade secrets and/or other proprietary rights, including under the United States copyright laws. Memento Japanese owns a copyright in the selection, coordination, arrangement and enhancement of such content and a copyright in the App. All trademarks appearing on this App ("Marks") are trademarks of their respective owners, including Memento Japanese and its partners. Users are prohibited from using any Marks without the written permission of Memento Japanese or such third party that may own the Marks.
              {"\n"}{"\n"}
              All content on the App is provided AS IS for your information and personal use only. You may not copy, publish, transmit, distribute, perform, sell, create derivative works of, or in any way exploit, any of the content, in whole or in part, without Memento Japanese’s prior written consent. You may download content for your personal, non-commercial use only as provided in these Terms, provided that you keep intact all copyright and other proprietary notices. Copying or storing of content for other than personal use is expressly prohibited without prior permission from us or the copyright holder identified in the copyright notice contained in the content.
              {"\n"}{"\n"}
              You shall not (directly or indirectly): (i) decipher, decompile, disassemble, reverse engineer or otherwise attempt to derive any source code or underlying ideas or algorithms of any part of the App, except to the limited extent applicable laws specifically prohibit such restriction, (ii) modify, translate, or otherwise create derivative works of any part of the Service, or (iii) copy, rent, lease, distribute, or otherwise transfer any of the rights that you receive hereunder. You shall abide by all applicable local, state, national and international laws and regulations.
              {"\n"}{"\n"}
              Emails from Us{"\n"}
              By registering for Memento Japanese, you will receive online communications from Memento Japanese. To unsubscribe from any Memento Japanese email list, simply click on the "Unsubscribe" link at the bottom of the email and your name will be removed from our emailing list.
              {"\n"}{"\n"}
              YouTube{"\n"}
              By agreeing to our Terms of Service, you also agree to be bound by YouTube's Terms of Service: https://www.youtube.com/t/terms. Disclaimer of Warranties
              {"\n"}{"\n"}
              YOU UNDERSTAND THAT YOUR USE OF THE APP AND SERVICES (INCLUDING ANY DOWNLOADS OR ANY LOSS OF DATA OR OTHER DAMAGE TO YOUR COMPUTER SYSTEM YOU EXPERIENCE FROM USING THE APP AND SERVICES) IS AT YOUR SOLE RISK. YOU UNDERSTAND THAT THE APP AND SERVICES AND ALL INFORMATION, PRODUCTS AND OTHER CONTENT (INCLUDING THIRD PARTY INFORMATION, PRODUCTS AND CONTENT INCLUDED IN OR ACCESSIBLE FROM THE APP OR SERVICES, ARE PROVIDED ON AN "AS IS" "WHERE-IS" AND "WHERE AVAILABLE" BASIS, AND ARE SUBJECT TO CHANGE AT ANY TIME WITHOUT NOTICE TO YOU. YOU ACKNOWLEDGE THAT MEMENTO JAPANESE MAKES NO WARRANTY THAT THE APP OR SERVICES WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE. YOU UNDERSTAND THAT MEMENTO JAPANESE DOES NOT WARRANT THAT THE RESULTS OBTAINED FROM YOUR USE OF THE APP OR SERVICES WILL MEET YOUR EXPECTATIONS. NO WARRANTY OF ANY KIND, WHETHER ORAL OR WRITTEN, CAN MODIFY THE TERMS OF THE DISCLAIMER SET FORTH IN THIS DOCUMENT.
              {"\n"}{"\n"}
              YOUR USE AND BROWSING OF THE APP IS AT YOUR OWN RISK. IF YOU ARE DISSATISFIED WITH ANY OF THE MATERIALS CONTAINED IN THE APP OR SERVICES, OR WITH ANY OF THESE TERMS, YOUR SOLE AND EXCLUSIVE REMEDY IS TO DISCONTINUE ACCESSING AND USING THE APP AND SERVICES. TO THE FULLEST EXTENT PERMITTED BY LAW, MEMENTO JAPANESE DISCLAIMS ALL REPRESENTATIONS, WARRANTIES, AND CONDITIONS OF ANY KIND (EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT OF PROPRIETARY RIGHTS) AS TO THE SITE AND SERVICES AND ALL INFORMATION, PRODUCTS, AND OTHER CONTENT (INCLUDING THIRD PARTY INFORMATION, PRODUCTS, AND CONTENT) INCLUDED IN OR ACCESSIBLE FROM THE APP AND SERVICES.
              {"\n"}{"\n"}
              ALL CONTENT, PRODUCTS AND THIRD PARTY SERVICES ON THE APP, OR OBTAINED FROM A WEBSITE TO WHICH THE APP IS LINKED ARE PROVIDED TO YOU "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE, TITLE, NON-INFRINGEMENT, SECURITY OR ACCURACY. MEMENTO JAPANESE DOES NOT ENDORSE AND IS NOT RESPONSIBLE FOR THE ACCURACY OR RELIABILITY OF ANY OPINION, ADVICE OR STATEMENT MADE THROUGH USERS OF THE SITE, ANY CONTENT PROVIDED ON THE APP AND ANY LINKED SITES OR THE CAPABILITIES OR RELIABILITY OF ANY PRODUCT OR SERVICE OBTAINED FROM THE APP OR A LINKED SITE.
              {"\n"}{"\n"}
              OTHER THAN AS REQUIRED BY LAW, UNDER NO CIRCUMSTANCE WILL MEMENTO JAPANESE BE LIABLE FOR ANY LOSS OR DAMAGE CAUSED BY YOUR RELIANCE ON INFORMATION OBTAINED THROUGH THE APP OR A LINKED SITE, OR YOUR RELIANCE ON ANY PRODUCT OR SERVICE OBTAINED FROM THE APP OR A LINKED SITE. IT IS YOUR RESPONSIBILITY TO EVALUATE THE ACCURACY, COMPLETENESS OR USEFULNESS OF ANY OPINION, ADVICE OR OTHER CONTENT AVAILABLE THROUGH THE APP OR OBTAINED FROM A LINKED SITE.
              {"\n"}{"\n"}
              Liability Limitation{"\n"}
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT WILL MEMENTO JAPANESE OR ITS AFFILIATES BE LIABLE TO YOU (OR ANY THIRD PARTY MAKING CLAIMS THROUGH YOU) FOR ANY DAMAGES WHATSOEVER, INCLUDING BUT NOT LIMITED TO ANY DIRECT, INDIRECT, SPECIAL, CONSEQUENTIAL, PUNITIVE OR INCIDENTAL DAMAGES, OR DAMAGES FOR LOSS OF USE, PROFITS, DATA, OR OTHER INTANGIBLES, OR THE COST OF PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES, UNAUTHORIZED ACCESS TO AND TAMPERING WITH YOUR PERSONAL INFORMATION OR TRANSMISSIONS, ARISING OUT OF OR RELATED TO THE USE, INABILITY TO USE, UNAUTHORIZED USE, PERFORMANCE, OR NON-PERFORMANCE OF THE APP OR THE SERVICES, EVEN IF MEMENTO JAPANESE HAS BEEN ADVISED PREVIOUSLY OF THE POSSIBILITY OF SUCH DAMAGES AND WHETHER SUCH DAMAGES ARISE IN CONTRACT, NEGLIGENCE, TORT, UNDER STATUTE, IN EQUITY, AT LAW, OR OTHERWISE. UNLESS LIMITED OR MODIFIED BY APPLICABLE LAW, THE FOREGOING DISCLAIMERS, WAIVERS AND LIMITATIONS SHALL APPLY TO THE MAXIMUM EXTENT PERMITTED, EVEN IF ANY REMEDY FAILS ITS ESSENTIAL PURPOSE. MEMENTO JAPANESE LICENSORS AND CONTRACTORS ARE INTENDED THIRD-PARTY BENEFICIARIES OF THESE DISCLAIMERS.
              {"\n"}{"\n"}
              If any part of these warranty disclaimers or limitations of liability is found to be invalid or unenforceable for any reason, then Memento Japanese’s aggregate liability for all claims under such circumstances for liabilities shall not exceed fifty dollars ($50).
              {"\n"}{"\n"}
              Termination{"\n"}
              We can suspend or terminate you as a registered user and your access to the App or the Services, in whole or in part, at any time, immediately and without notice if, at Memento Japanese’s sole discretion, you fail to comply with any of the Terms.
              {"\n"}{"\n"}
              General{"\n"}
              These Terms are the entire agreement between you and Memento Japanese. They supersede any and all prior or contemporaneous agreements between you and Memento Japanese relating to your use of the App or the Services. If any part of these Terms is determined to be invalid or unenforceable, it will not impact any other provision of these Terms, all of which will remain in full force and effect. The failure of Memento Japanese to partially or fully exercise any rights or the waiver of Memento Japanese of any breach of these Terms by you, shall not prevent a subsequent exercise of such right by Memento Japanese or be deemed a waiver by Memento Japanese of any subsequent breach by you of the same or any other term of these Terms. The rights and remedies of Memento Japanese under these Terms and any other applicable agreement between you and Memento Japanese shall be cumulative, and the exercise of any such right or remedy shall not limit Memento Japanese right to exercise any other right or remedy. These Terms are governed by, and will be interpreted in accordance with, the laws of the State of Wyoming, without regard to any choice of law provisions. You agree that, with the exception of injunctive relief sought by Memento Japanese for any violation of Memento Japanese’s proprietary or other rights, any and all disputes relating to these Terms, your use of the App or the Services shall be resolved by arbitration in accordance with the then-current rules of the American Arbitration Association (the "AAA") before an independent arbitrator designated by the AAA. The location of arbitration shall be Wyoming, USA.
              {"\n"}{"\n"}
              Modification of Terms{"\n"}
  We may change the Terms from time to time by updating this posting and changing the Effective Date referenced below. Please visit the Terms area each time you visit the App to keep up to date with the current terms regarding your use of the App. Your continued use of the App constitutes an affirmative acknowledgment by you of the Terms modifications and your agreement to abide and be bound by the Terms as modified.
              </Text>
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
  titleWithBack: {
    flexDirection: "row",
    alignItems: 'center',
  },
  menuContent: {
    flex: 1,
    padding: scaleX(18),
    backgroundColor: '#292627',
    borderRadius: 21,
    borderStyle: 'dashed',
    marginTop: scaleX(60),
    borderWidth: 1,
    borderColor: '#fece26CE'    ,
    marginBottom: scaleX(80),
  },
  pageTitle: {
    fontSize: scaleX(15),
    fontWeight: '600',
    lineHeight: scaleX(19),
    color: '#FFFFFF',
    marginTop: scaleX(51),
    textAlign: 'center',
    fontFamily: 'Montserrat_600SemiBold'
  },
  pageDesc: {
    fontSize: scaleX(15),
    fontWeight: '400',
    lineHeight: scaleX(22.5),
    color: '#FFFFFF',
    marginTop: scaleX(53),
    marginBottom: scaleX(82),
    textAlign: 'center',
    fontFamily: 'Montserrat_400Regular'
  }
});

const mapStateToProps = (state: ApplicationState) => ({
  userReducer: state.userReducer,
});

const TermsAndConditions = connect(mapStateToProps, { })(
  _TermsAndConditions
);

export default TermsAndConditions;
