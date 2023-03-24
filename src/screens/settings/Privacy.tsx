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
import TopBarLeftArrow from "../component/TobBarLeftArrow";
import { useFonts,  Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold} from '@expo-google-fonts/montserrat';
import {Inter_500Medium, Inter_700Bold} from '@expo-google-fonts/inter';
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { scaleX } from "../../core/theme/dimensions";

interface Props {
  navigation: NavigationScreenProp<any, any>;
}


const _Privacy: React.FC<Props> = (props: Props) => { 
 
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
            <Text style={styles.pageTitle}>
              Privacy Policy
            </Text>
            <Text style={styles.pageDesc}>
            PRIVACY NOTICE{"\n"}
            Last updated October 13, 2022 This privacy notice for Memento Languages LLC (doing business as Memento Japanese) ("Memento Japanese," "we," "us," or "our"), describes how and why we might collect, store, use, and/or share ("process") your information when you use our services ("Services"), such as when you: Download and use our mobile application (Memento Japanese), or any other application of ours that links to this privacy notice Engage with us in other related ways, including any sales, marketing, or events Questions or concerns? Reading this privacy notice will help you understand your privacy rights and choices. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at Info@mementolanguages.com.
            {"\n"}{"\n"}
            SUMMARY OF KEY POINTS{"\n"}
            This summary provides key points from our privacy notice, but you can find out more details about any of these topics by clicking the link following each key point or by using our table of contents below to find the section you are looking for. You can also click here to go directly to our table of contents.{"\n"}
            What personal information do we process? When you visit, use, or navigate our Services, we may process personal information depending on how you interact with Memento Japanese and the Services, the choices you make, and the products and features you use. Click here to learn more.{"\n"}
            Do we process any sensitive personal information? We do not process sensitive personal information.{"\n"}
            Do we receive any information from third parties? We do not receive any information from third parties.{"\n"}
            How do we process your information? We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent. We process your information only when we have a valid legal reason to do so. Click here to learn more.{"\n"}
            In what situations and with which types of parties do we share personal information? We may share information in specific situations and with specific categories of third parties. Click here to learn more.{"\n"}
            How do we keep your information safe? We have organizational and technical processes and procedures in place to protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Click here to learn more.{"\n"}
            What are your rights? Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information. Click here to learn more.{"\n"}
            How do you exercise your rights? The easiest way to exercise your rights is by filling out our data subject request form available here: info@mementolanguages.com, or by contacting us. We will consider and act upon any request in accordance with applicable data protection laws.{"\n"}
            Want to learn more about what Memento Japanese does with any information we collect? Click here to review the notice in full.
            {"\n"}{"\n"}
            TABLE OF CONTENTS{"\n"}
            WHAT INFORMATION DO WE COLLECT?{"\n"}
            HOW DO WE PROCESS YOUR INFORMATION?{"\n"}
            WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR PERSONAL INFORMATION?{"\n"}
            WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?{"\n"}
            WHAT IS OUR STANCE ON THIRD-PARTY WEBSITES?{"\n"}
            DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?{"\n"}
            HOW DO WE HANDLE YOUR SOCIAL LOGINS?{"\n"}
            HOW LONG DO WE KEEP YOUR INFORMATION?{"\n"}
            HOW DO WE KEEP YOUR INFORMATION SAFE?{"\n"}
            WHAT ARE YOUR PRIVACY RIGHTS?{"\n"}
            CONTROLS FOR DO-NOT-TRACK FEATURES{"\n"}
            DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?{"\n"}
            DO WE MAKE UPDATES TO THIS NOTICE?{"\n"}
            HOW CAN YOU CONTACT US ABOUT THIS NOTICE?{"\n"}
            HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?{"\n"}
            1. WHAT INFORMATION DO WE COLLECT?{"\n"}
            Personal information you disclose to us{"\n"}
            In Short: We collect personal information that you provide to us.{"\n"}
            We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.{"\n"}
            Personal Information Provided by You. The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:{"\n"}
            names{"\n"}
            email addresses{"\n"}
            usernames{"\n"}
            Sensitive Information. We do not process sensitive information.{"\n"}
            {"\n"}{"\n"}
            Payment Data. We may collect data necessary to process your payment if you make purchases, such as your payment instrument number, and the security code associated with your payment instrument. All payment data is stored by Google Payments and Apple Pay . You may find their privacy notice link(s) here: https://payments.google.com/payments/apis-secure/u/0/get_legal_document?ldo=0&ldt=privacynotice and https://www.apple.com/legal/privacy/data/en/apple-pay/.
            {"\n"}{"\n"}
            Social Media Login Data. We may provide you with the option to register with us using your existing social media account details, like your Facebook, Twitter, or other social media account. If you choose to register in this way, we will collect the information described in the section called "HOW DO WE HANDLE YOUR SOCIAL LOGINS?" below.
            {"\n"}{"\n"}
            Application Data. If you use our application(s), we also may collect the following{"\n"}
            information if you choose to provide us with access or permission:{"\n"}
            Mobile Device Access. We may request access or permission to certain features{"\n"}
            from your mobile device, including your mobile device's storage, and other{"\n"}
            features. If you wish to change our access or permissions, you may do so in your device's settings.{"\n"}
            Mobile Device Data. We automatically collect device information (such as your mobile device ID, model, and manufacturer), operating system, version information and system configuration information, device and application identification numbers, browser type and version, hardware model Internet service provider and/or mobile carrier, and Internet Protocol (IP) address (or proxy server). If you are using our application(s), we may also collect information about the phone network associated with your mobile device, your mobile device’s operating system or platform, the type of mobile device you use, your mobile device’s unique device ID, and information about the features of our application(s) you accessed. Push Notifications. We may request to send you push notifications regarding your account or certain features of the application(s). If you wish to opt out from receiving these types of communications, you may turn them off in your device's settings. This information is primarily needed to maintain the security and operation of our application(s), for troubleshooting, and for our internal analytics and reporting purposes.{"\n"}
            All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.{"\n"}
            Information automatically collected{"\n"}
            In Short: Some information — such as your Internet Protocol (IP) address and/or browser and device characteristics — is collected automatically when you visit our Services.{"\n"}
            We automatically collect certain information when you visit, use, or navigate the Services. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Services, and other technical information. This information is primarily needed to maintain the security and operation of our Services, and for our internal analytics and reporting purposes.{"\n"}
            Like many businesses, we also collect information through cookies and similar technologies.{"\n"}
            {"\n"}{"\n"}
            The information we collect includes:{"\n"}
            Log and Usage Data. Log and usage data is service-related, diagnostic, usage, and performance information our servers automatically collect when you access or use our Services and which we record in log files. Depending on how you interact with us, this log data may include your IP address, device information, browser type, and settings and information about your activity in the Services (such as the date/time stamps associated with your usage, pages and files viewed, searches, and other actions you take such as which features you use), device event information (such as system activity, error reports (sometimes called "crash dumps"), and hardware settings).{"\n"}
            Device Data. We collect device data such as information about your computer, phone, tablet, or other device you use to access the Services. Depending on the device used, this device data may include information such as your IP address (or proxy server), device and application identification numbers, location, browser type, hardware model, Internet service provider and/or mobile carrier, operating system, and system configuration information.{"\n"}
            Location Data. We collect location data such as information about your device's location, which can be either precise or imprecise. How much information we collect depends on the type and settings of the device you use to access the Services. For example, we may use GPS and other technologies to collect geolocation data that tells us your current location (based on your IP address). You can opt out of allowing us to collect this information either by refusing access to the information or by disabling your Location setting on your device. However, if you choose to opt out, you may not be able to use certain aspects of the Services.{"\n"}
            2. HOW DO WE PROCESS YOUR INFORMATION?{"\n"}
            In Short: We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.{"\n"}
            We process your personal information for a variety of reasons, depending on how you interact with our Services, including: To facilitate account creation and authentication and otherwise manage user accounts. We may process your information so you can create and log in to your account, as well as keep your account in working order.
            {"\n"}{"\n"}
            To request feedback. We may process your information when necessary to request feedback and to contact you about your use of our Services.{"\n"}
            To send you marketing and promotional communications. We may process the personal information you send to us for our marketing purposes, if this is in accordance with your marketing preferences. You can opt out of our marketing emails at any time. For more information, see "WHAT ARE YOUR PRIVACY RIGHTS?" below).{"\n"}
            To deliver targeted advertising to you. We may process your information to develop and display personalized content and advertising tailored to your interests, location, and more.{"\n"}
            To protect our Services. We may process your information as part of our efforts to keep our Services safe and secure, including fraud monitoring and prevention. To identify usage trends. We may process information about how you use our Services to better understand how they are being used so we can improve them.{"\n"}
            To determine the effectiveness of our marketing and promotional campaigns. We may process your information to better understand how to provide marketing and promotional campaigns that are most relevant to you.{"\n"}
            To save or protect an individual's vital interest. We may process your information when necessary to save or protect an individual’s vital interest, such as to prevent harm.
            {"\n"}{"\n"}
            3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR INFORMATION?{"\n"}
            In Short: We only process your personal information when we believe it is necessary and we have a valid legal reason (i.e., legal basis) to do so under applicable law, like with your consent, to comply with laws, to provide you with services to enter into or fulfill our contractual obligations, to protect your rights, or to fulfill our legitimate business interests.{"\n"}
            If you are located in the EU or UK, this section applies to you.{"\n"}
            The General Data Protection Regulation (GDPR) and UK GDPR require us to explain the valid legal bases we rely on in order to process your personal information. As such, we may rely on the following legal bases to process your personal information:{"\n"}
            Consent. We may process your information if you have given us permission (i.e., consent) to use your personal information for a specific purpose. You can withdraw your consent at any time. Click here to learn more.{"\n"}
            Legitimate Interests. We may process your information when we believe it is reasonably necessary to achieve our legitimate business interests and those interests do not outweigh your interests and fundamental rights and freedoms. For example, we may process your personal information for some of the purposes described in order to:{"\n"}
            Send users information about special offers and discounts on our products and services Develop and display personalized and relevant advertising content for our users Analyze how our Services are used so we can improve them to engage and retain users Support our marketing activities Diagnose problems and/or prevent fraudulent activities Understand how our users use our products and services so we can improve user experience Legal Obligations. We may process your information where we believe it is necessary for compliance with our legal obligations, such as to cooperate with a law enforcement body or regulatory agency, exercise or defend our legal rights, or disclose your information as evidence in litigation in which we are involved. Vital Interests. We may process your information where we believe it is necessary to protect your vital interests or the vital interests of a third party, such as situations involving potential threats to the safety of any person.{"\n"}
            If you are located in Canada, this section applies to you.{"\n"}
            We may process your information if you have given us specific permission (i.e., express consent) to use your personal information for a specific purpose, or in situations where your permission can be inferred (i.e., implied consent). You can withdraw your consent at any time. Click here to learn more.{"\n"}
            In some exceptional cases, we may be legally permitted under applicable law to process your information without your consent, including, for example: If collection is clearly in the interests of an individual and consent cannot be obtained in a timely way For investigations and fraud detection and prevention For business transactions provided certain conditions are met If it is contained in a witness statement and the collection is necessary to assess, process, or settle an insurance claim For identifying injured, ill, or deceased persons and communicating with next of kin
            If we have reasonable grounds to believe an individual has been, is, or may be victim of financial abuse{"\n"}
            If it is reasonable to expect collection and use with consent would compromise the availability or the accuracy of the information and the collection is reasonable for purposes related to investigating a breach of an agreement or a contravention of the laws of Canada or a province{"\n"}
            If disclosure is required to comply with a subpoena, warrant, court order, or rules of the court relating to the production of records If it was produced by an individual in the course of their employment, business, or profession and the collection is consistent with the purposes for which the information was produced{"\n"}
            If the collection is solely for journalistic, artistic, or literary purposes If the information is publicly available and is specified by the regulations
            {"\n"}{"\n"}
            4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?{"\n"}
            In Short: We may share information in specific situations described in this section and/or with the following categories of third parties.{"\n"}
            Vendors, Consultants, and Other Third-Party Service Providers. We may share your data with third-party vendors, service providers, contractors, or agents ("third parties") who perform services for us or on our behalf and require access to such information to do that work. We have contracts in place with our third parties, which are designed to help safeguard your personal information. This means that they cannot do anything with your personal information unless we have instructed them to do it. They will also not share your personal information with any organization apart from us. They also commit to protect the data they hold on our behalf and to retain it for the period we instruct. The categories of third parties we may share personal information with are as follows: Ad Networks{"\n"}
            Cloud Computing Services{"\n"}
            Data Analytics Services{"\n"}
            Data Storage Service Providers{"\n"}
            Product Engineering & Design Tools{"\n"}
            Sales & Marketing Tools{"\n"}
            Social Networks{"\n"}
            User Account Registration & Authentication Services{"\n"}
            Testing Tools{"\n"}
            We also may need to share your personal information in the following situations:{"\n"}
            Business Transfers. We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.{"\n"}
            Affiliates. We may share your information with our affiliates, in which case we will require those affiliates to honor this privacy notice. Affiliates include our parent company and any subsidiaries, joint venture partners, or other companies that we control or that are under common control with us.{"\n"}
            Business Partners. We may share your information with our business partners to offer you certain products, services, or promotions.
            {"\n"}{"\n"}
            5. WHAT IS OUR STANCE ON THIRD-PARTY WEBSITES?{"\n"}
            In Short: We are not responsible for the safety of any information that you share with third parties that we may link to or who advertise on our Services, but are not affiliated with, our Services.{"\n"}
            The Services may link to third-party websites, online services, or mobile applications and/or contain advertisements from third parties that are not affiliated with us and which may link to other websites, services, or applications. Accordingly, we do not make any guarantee regarding any such third parties, and we will not be liable for any loss or damage caused by the use of such third-party websites, services, or applications. The inclusion of a link towards a third-party website, service, or application does not imply an endorsement by us. We cannot guarantee the safety and privacy of data you provide to any third parties. Any data collected by third parties is not covered by this privacy notice. We are not responsible for the content or privacy and security practices and policies of any third parties, including other websites, services, or applications that may be linked to or from the Services. You should review the policies of such third parties and contact them directly to respond to your questions.
            {"\n"}{"\n"}
            6. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?{"\n"}
            In Short: We may use cookies and other tracking technologies to collect and store your information.{"\n"}
            We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.
            {"\n"}{"\n"}
            7. HOW DO WE HANDLE YOUR SOCIAL LOGINS?{"\n"}
            In Short: If you choose to register or log in to our Services using a social media account, we may have access to certain information about you.{"\n"}
            Our Services offer you the ability to register and log in using your third-party social media account details (like your Facebook or Twitter logins). Where you choose to do this, we will receive certain profile information about you from your social media provider. The profile information we receive may vary depending on the social media provider concerned, but will often include your name, email address, friends list, and profile picture, as well as other information you choose to make public on such a social media platform.{"\n"}
            We will use the information we receive only for the purposes that are described in this privacy notice or that are otherwise made clear to you on the relevant Services. Please note that we do not control, and are not responsible for, other uses of your personal information by your third-party social media provider. We recommend that you review their privacy notice to understand how they collect, use, and share your personal information, and how you can set your privacy preferences on their sites and apps.{"\n"}
            {"\n"}{"\n"}
            8. HOW LONG DO WE KEEP YOUR INFORMATION?
            In Short: We keep your information for as long as necessary to fulfill the purposes outlined in this privacy notice unless otherwise required by law.
            We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements). No purpose in this notice will require us keeping your personal information for longer than the period of time in which users have an account with us.
            When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.
            {"\n"}{"\n"}
            9. HOW DO WE KEEP YOUR INFORMATION SAFE?{"\n"}
            In Short: We aim to protect your personal information through a system of organizational and technical security measures.{"\n"}
            We have implemented appropriate and reasonable technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk. You should only access the Services within a secure environment.{"\n"}
            {"\n"}{"\n"}
            10. WHAT ARE YOUR PRIVACY RIGHTS?{"\n"}
            In Short: In some regions, such as the European Economic Area (EEA), United Kingdom (UK), and Canada, you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time.{"\n"}
            In some regions (like the EEA, UK, and Canada), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability. In certain circumstances, you may also have the right to object to the processing of your personal information. You can make such a request by contacting us by using the contact details provided in the section "HOW CAN YOU CONTACT US ABOUT THIS NOTICE?" below.
            We will consider and act upon any request in accordance with applicable data protection laws.
            If you are located in the EEA or UK and you believe we are unlawfully processing your personal information, you also have the right to complain to your local data protection supervisory authority. You can find their contact details here: https://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm.{"\n"}
            If you are located in Switzerland, the contact details for the data protection authorities are available here: https://www.edoeb.admin.ch/edoeb/en/home.html.{"\n"}
            Withdrawing your consent: If we are relying on your consent to process your personal information, which may be express and/or implied consent depending on the applicable law, you have the right to withdraw your consent at any time. You can withdraw your consent at any time by contacting us by using the contact details provided in the section "HOW CAN YOU CONTACT US ABOUT THIS NOTICE?" below.{"\n"}
            However, please note that this will not affect the lawfulness of the processing before its withdrawal nor, when applicable law allows, will it affect the processing of your personal information conducted in reliance on lawful processing grounds other than consent.{"\n"}
            Opting out of marketing and promotional communications: You can unsubscribe from our marketing and promotional communications at any time by clicking on the unsubscribe link in the emails that we send, or by contacting us using the details provided in the section "HOW CAN YOU CONTACT US ABOUT THIS NOTICE?" below. You will then be removed from the marketing lists. However, we may still communicate with you — for example, to send you service-related messages that are necessary for the administration and use of your account, to respond to service requests, or for other non-marketing purposes.{"\n"}
            Account Information{"\n"}
            If you would at any time like to review or change the information in your account or terminate your account, you can:
            Log in to your account settings and update your user account.{"\n"}
            Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, we may retain some information in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our legal terms and/or comply with applicable legal requirements.
            Cookies and similar technologies: Most Web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove cookies and to reject cookies. If you choose to remove cookies or reject cookies, this could affect certain features or services of our Services. To opt out of interest-based advertising by advertisers on our Services visit http://www.aboutads.info/choices/.
            If you have questions or comments about your privacy rights, you may email us at info@mementolanguages.com.
            {"\n"}{"\n"}
            11. CONTROLS FOR DO-NOT-TRACK FEATURES
            Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this privacy notice.
            {"\n"}{"\n"}
            12. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?{"\n"}
            In Short: Yes, if you are a resident of California, you are granted specific rights regarding access to your personal information.{"\n"}
            California Civil Code Section 1798.83, also known as the "Shine The Light" law, permits our users who are California residents to request and obtain from us, once a year and free of charge, information about categories of personal information (if any) we disclosed to third parties for direct marketing purposes and the names and addresses of all third parties with which we shared personal information in the immediately preceding calendar year. If you are a California resident and would like to make such a request, please submit your request in writing to us using the contact information provided below.{"\n"}
            If you are under 18 years of age, reside in California, and have a registered account with Services, you have the right to request removal of unwanted data that you publicly post on the Services. To request removal of such data, please contact us using the contact information provided below and include the email address associated with your account and a statement that you reside in California. We will make sure the data is not publicly displayed on the Services, but please be aware that the data may not be completely or comprehensively removed from all our systems (e.g., backups, etc.).
            {"\n"}{"\n"}
            CCPA Privacy Notice{"\n"}
            The California Code of Regulations defines a "resident" as:{"\n"}
            (1) every individual who is in the State of California for other than a temporary or transitory purpose and{"\n"}
            (2) every individual who is domiciled in the State of California who is outside the State of California for a temporary or transitory purpose{"\n"}
            All other individuals are defined as "non-residents."{"\n"}
            If this definition of "resident" applies to you, we must adhere to certain rights and obligations regarding your personal information.{"\n"}
            What categories of personal information do we collect?{"\n"}
            We have collected the following categories of personal information in the past twelve (12) months:{"\n"}
            Category Examples Collected{"\n"}
            A. Identifiers{"\n"}
            Contact details, such as real name, alias, postal address, telephone or mobile contact number, unique personal identifier, online identifier, Internet Protocol address, email address, and account name{"\n"}
            YES{"\n"}
            B. Personal information categories listed in the California Customer Records statute{"\n"}
            Name, contact information, education, employment, employment history, and financial information{"\n"}
            NO{"\n"}
            C. Protected classification characteristics under California or federal law Gender and date of birth{"\n"}
            NO{"\n"}
            D. Commercial information Transaction information, purchase history, financial details, and payment information{"\n"}
            YES{"\n"}
            E. Biometric information{"\n"}
            Fingerprints and voiceprints{"\n"}
            NO{"\n"}
            F. Internet or other similar network activity{"\n"}
            Browsing history, search history, online behavior, interest data, and interactions with our and other websites, applications, systems, and advertisements{"\n"}
            YES{"\n"}
            G. Geolocation data{"\n"}
            Device location{"\n"}
            YES{"\n"}
            H. Audio, electronic, visual, thermal, olfactory, or similar information Images and audio, video or call recordings created in connection with our business activities{"\n"}
            NO{"\n"}
            I. Professional or employment-related information Business contact details in order to provide you our Services at a business level or job title, work history, and professional qualifications if you apply for a job with us{"\n"}
            NO{"\n"}
            J. Education Information{"\n"}
            Student records and directory information{"\n"}
            NO{"\n"}
            K. Inferences drawn from other personal information Inferences drawn from any of the collected personal information listed above to create a profile or summary about, for example, an individual’s preferences and characteristics
            NO
            {"\n"}{"\n"}
            We may also collect other personal information outside of these categories through instances where you interact with us in person, online, or by phone or mail in the context of:{"\n"}
            Receiving help through our customer support channels; Participation in customer surveys or contests; and Facilitation in the delivery of our Services and to respond to your inquiries. How do we use and share your personal information?{"\n"}
            Memento Languages LLC collects and shares your personal information through: Targeting cookies/Marketing cookies{"\n"}
            Social media cookies More information about our data collection and sharing practices can be found in this privacy notice.{"\n"}
            You may contact us by email at info@mementolangauages.com, or by referring to the contact details at the bottom of this document.{"\n"}
            If you are using an authorized agent to exercise your right to opt out we may deny a request if the authorized agent does not submit proof that they have been validly authorized to act on your behalf.{"\n"}
            Will your information be shared with anyone else?{"\n"}
            We may disclose your personal information with our service providers pursuant to a written contract between us and each service provider. Each service provider is a for-profit entity that processes the information on our behalf.{"\n"}
            We may use your personal information for our own business purposes, such as for undertaking internal research for technological development and demonstration. This is not considered to be "selling" of your personal information.{"\n"}
            Memento Languages LLC has not sold any personal information to third parties for a business or commercial purpose in the preceding twelve (12) months. Memento Languages LLC has disclosed the following categories of personal information to third parties for a business or commercial purpose in the preceding twelve (12) months:{"\n"}
            Category A. Identifiers, such as contact details like your real name, alias, postal address, telephone or mobile contact number, unique personal identifier, online identifier, Internet Protocol address, email address, and account name.{"\n"}
            {"\n"}{"\n"}
            Category D. Commercial information, such as transaction information, purchase history, financial details, and payment information.{"\n"}
            Category F. Internet or other electronic network activity information, such as browsing history, search history, online behavior, interest data, and interactions with our and other websites, applications, systems, and advertisements.{"\n"}
            Category G. Geolocation data, such as device location.{"\n"}
            The categories of third parties to whom we disclosed personal information for a business or commercial purpose can be found under "WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?".{"\n"}
            Your rights with respect to your personal data{"\n"}
            Right to request deletion of the data — Request to delete{"\n"}
            You can ask for the deletion of your personal information. If you ask us to delete your personal information, we will respect your request and delete your personal information, subject to certain exceptions provided by law, such as (but not limited to) the exercise by another consumer of his or her right to free speech, our compliance requirements resulting from a legal obligation, or any processing that may be required to protect against illegal activities.
            {"\n"}{"\n"}
            Right to be informed — Request to know{"\n"}
            Depending on the circumstances, you have a right to know:{"\n"}
            whether we collect and use your personal information; the categories of personal information that we collect; the purposes for which the collected personal information is used; whether we sell your personal information to third parties; the categories of personal information that we sold or disclosed for a business purpose;{"\n"}
            the categories of third parties to whom the personal information was sold or disclosed for a business purpose; and the business or commercial purpose for collecting or selling personal information.{"\n"}
            In accordance with applicable law, we are not obligated to provide or delete consumer information that is de-identified in response to a consumer request or to re-identify individual data to verify a consumer request.{"\n"}
            Right to Non-Discrimination for the Exercise of a Consumer’s Privacy Rights{"\n"}
            {"\n"}{"\n"}
            We will not discriminate against you if you exercise your privacy rights.{"\n"}
            Verification process{"\n"}
            Upon receiving your request, we will need to verify your identity to determine you are the same person about whom we have the information in our system. These verification efforts require us to ask you to provide information so that we can match it with information you have previously provided us. For instance, depending on the type of request you submit, we may ask you to provide certain information so that we can match the information you provide with the information we already have on file, or we may contact you through a communication method (e.g., phone or email) that you have previously provided to us. We may also use other verification methods as the circumstances dictate.{"\n"}
            We will only use personal information provided in your request to verify your identity or authority to make the request. To the extent possible, we will avoid requesting additional information from you for the purposes of verification. However, if we cannot verify your identity from the information already maintained by us, we may request that you provide additional information for the purposes of verifying your identity and for security or fraud-prevention purposes. We will delete such additionally provided information as soon as we finish verifying you.{"\n"}
            Other privacy rights{"\n"}
            You may object to the processing of your personal information. You may request correction of your personal data if it is incorrect or no longer relevant, or ask to restrict the processing of the information. You can designate an authorized agent to make a request under the CCPA on your behalf. We may deny a request from an authorized agent that does not submit proof that they have been validly authorized to act on your behalf in accordance with the CCPA.{"\n"}
            You may request to opt out from future selling of your personal information to third parties. Upon receiving an opt-out request, we will act upon the request as soon as feasibly possible, but no later than fifteen (15) days from the date of the request submission.{"\n"}
            To exercise these rights, you can contact us by email at info@mementolangauages.com, or by referring to the contact details at the bottom of this document. If you have a complaint about how we handle your data, we would like to hear from you.
            {"\n"}{"\n"}
            13. DO WE MAKE UPDATES TO THIS NOTICE?{"\n"}
            In Short: Yes, we will update this notice as necessary to stay compliant with relevant laws.{"\n"}
            We may update this privacy notice from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible. If we make material changes to this privacy notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this privacy notice frequently to be informed of how we are protecting your information.
            {"\n"}{"\n"}
            14. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?{"\n"}
            If you have questions or comments about this notice, you may email us at info@mementolanguages.com or by post to:{"\n"}
            Memento Languages LLC{"\n"}
            1309 Coffeen Avenue{"\n"}
            STE 1200{"\n"}
            Sheridan, WY 82801{"\n"}
            United States
            {"\n"}{"\n"}
            15. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?{"\n"}
            You have the right to request access to the personal information we collect from you, change that information, or delete it. To request to review, update, or delete your personal information, please visit: info@mementolanguages.com.
            </Text>
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
    alignItems: 'center'
  },
  menuContent: {
    flex: 1,
    padding: scaleX(18),
    backgroundColor: '#292627',
    borderRadius: scaleX(21),
    borderStyle: 'dashed',
    marginTop: scaleX(60),
    borderWidth: scaleX(1),
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

const Privacy = connect(mapStateToProps, { })(
  _Privacy
);

export default Privacy;
