import React, { useState ,useEffect} from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import mainBg from "../../assets/mainBg.png";
import saveBtn from "../../assets/btns/saveBtn.png";
import updatePassBtn from "../../assets/btns/updatePassBtn.png"
import tiktokBg from "../../assets/btns/tiktokBg.png";
import enterBtn from "../../assets/btns/enterBtn.png"
import contentCreatorBtn from '../../assets/settings/contentCreatorBtn.png'
import freePlanBtn from '../../assets/settings/freePlanBtn.png'
import starPlanBtn from '../../assets/settings/starPlanBtn.png'
import premiumPlanBtn from '../../assets/settings/premiumPlanBtn.png'
import adminBtn from '../../assets/settings/adminBtn.png'
import customUploadImg from '../../assets/settings/customUploadImg.png'
import pencilIcon from '../../assets/common/pencilIcon.png'
import whitePencil from '../../assets/common/whitePencil.png'
import saveIcon from '../../assets/common/saveIcon.png'
import { NavigationScreenProp } from "react-navigation";
import { useRoute, useIsFocused } from '@react-navigation/native';
import { connect } from "react-redux";
import {ApplicationState, OnUpdateUserData} from "../../redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
import { useFonts,  Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold} from '@expo-google-fonts/montserrat';
import {Inter_500Medium, Inter_700Bold} from '@expo-google-fonts/inter';
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";
import TopBarLeftArrow from "../component/TobBarLeftArrow";
import { scaleX } from "../../core/theme/dimensions";
import { getFirestore, setDoc, doc, getDoc,  collection,updateDoc} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import uuid from "uuid";
import { updateEmail, updatePassword, reauthenticateWithCredential, getAuth, EmailAuthProvider} from "firebase/auth";
import passIcon from "../../assets/signin/passIcon.png";
import passErrorIcon from "../../assets/signin/passErrorIcon.png";
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

interface Props {
  navigation: NavigationScreenProp<any, any>;
  userReducer: any;
  OnUpdateUserData: Function;
}


const _UserProfile: React.FC<Props> = (props: Props) => { 
  const route:any = useRoute();
  const activeUserId  = route.params?.userId;
  const isFocused = useIsFocused();

  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isEditFN, setIsEditFN] = useState(false);
  const [email, setEmail] = useState('');
  const [isEditEmail, setIsEditEmail] = useState(false);
  const [pass, setPass] = useState('');
  const [isEditPass, setIsEditPass] = useState(false);
  const [bio, setBio] = useState('');
  const [isEditBio, setIsEditBio] = useState(false);
  const [tiktokUrl, setTiktokUrl] = useState('');
  const [isEditTicktok, setIsEditTicktok] = useState(false);
  const [twitterUrl, setTwitterUrl] = useState('');
  const [isEditTwitterUrl, setIsEditTwitterUrl] = useState(false);  
  const [youtubuUrl, setYoutubuUrl] = useState('');
  const [isEditYoutubuUrl, setIsEditYoutubuUrl] = useState(false);  
  const [instagramUrl, setInstagramUrl] = useState('');
  const [isEditInstagramUrl, setIsEditInstagramUrl] = useState(false);  
  const [patrionUrl, setPatrionUrl] = useState('');
  const [isEditPatrionUrl, setIsEditPatrionUrl] = useState(false);  
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isEditWebsiteUrl, setIsEditWebsiteUrl] = useState(false)
  const [userData, setUserData] = useState<any>({})
  const [userId , setUserId] = useState('')
  const [addPassDialogVisible, setAddPassDialogVisible] = useState(false)
  const [showChangePassDialog, setShowChangePassDialog] = useState(false)
  const [curPass, setCurPass] = useState('')
  const [newPasswd, setNewPasswd] = useState('')
  const [loading, setLoading] = useState(false)
  const [showLoading, setShowLoading] = useState(false)
  const [showError, setShowError] = useState(false)

  useEffect(() => {    
    props.userReducer?.then((userData:any)=>{
      if(!activeUserId) {
        let curUser = userData.curUser
        setUserId(userData.userId)
        setUserData(curUser)
        setSelectedImageUrl(curUser.profileImg)
        setFirstName(curUser.firstName)
        setEmail(curUser.email)
        setBio(curUser.bio)
        setTiktokUrl(curUser.tiktokUrl)
        setTwitterUrl(curUser.twitterUrl)
        setYoutubuUrl(curUser.youtubuUrl)
        setInstagramUrl(curUser.instagramUrl)
        setPatrionUrl(curUser.patrionUrl)
        setWebsiteUrl(curUser.websiteUrl)
      }
    })
  }, [props.userReducer]);

  useEffect(() => {
    if(activeUserId) {
      const firestore = getFirestore()  
      getDoc(doc(firestore, "Users", activeUserId))
      .then((deck:any) => {
        let curUser = deck.data()
        setUserId(activeUserId)
        setUserData(curUser)
        setSelectedImageUrl(curUser.profileImg)
        setFirstName(curUser.firstName)
        setEmail(curUser.email)
        setBio(curUser.bio)
        setTiktokUrl(curUser.tiktokUrl)
        setTwitterUrl(curUser.twitterUrl)
        setYoutubuUrl(curUser.youtubuUrl)
        setInstagramUrl(curUser.instagramUrl)
        setPatrionUrl(curUser.patrionUrl)
        setWebsiteUrl(curUser.websiteUrl)
      })
      .catch((e) => {
          console.log(e)
      }); 
    }
  },[activeUserId, isFocused])
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

  const resizeImg = async (result:any, targetWidth: number) => {
    const manipResult = await manipulateAsync(
      result.uri,
      [{resize: {width: targetWidth}}],
      {format: SaveFormat.JPEG}
    )
    const fileInfo:any = await FileSystem.getInfoAsync(manipResult.uri)
    if(fileInfo.size > 75000) {
      resizeImg(result, targetWidth - 50)
    }
    else {
      setSelectedImageUrl(manipResult.uri)
      handleImagePicked(manipResult)     
    }
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
    
    if (!result.cancelled) {
      resizeImg(result, 300)
    }
  };

  const handleImagePicked = async (pickerResult:any) => {
    try {
      setLoading(true)
      const profileImg = await uploadImageAsync(pickerResult.uri);
      const firestore = getFirestore();
      updateDoc(doc(firestore, "Users", userId), {
          profileImg,
      })
      .then(() => {         
        userData['profileImg'] = profileImg    
        if(!activeUserId)  {
          props.OnUpdateUserData(userData, userId)
        }       
      })
      .catch((e) => {
          console.log(e)
      });     
    } catch (e) {
      console.log(e);
      alert("Upload failed, sorry :(");
    } finally {
     setLoading(false)
    }
  };

  const uploadImageAsync = async (imgUri:string) => {
    const blob:any = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", imgUri, true);
      xhr.send(null);
    });
  
    const fileRef = ref(getStorage(), uuid.v4());
    const result = await uploadBytes(fileRef, blob);
  
    // We're done with the blob, close and release it
    blob.close();
  
    return await getDownloadURL(fileRef);
  }

  let [fontsLoaded] = useFonts({
    Montserrat_700Bold, Montserrat_600SemiBold, Montserrat_500Medium, Montserrat_400Regular,
    Inter_500Medium, Inter_700Bold, 
    Poppins_400Regular, Poppins_500Medium,  Poppins_600SemiBold, Poppins_700Bold
  });

  if (!fontsLoaded) {
    return null;
  }

  const updateProfile = () => {
    setShowLoading(true)
    const firestore = getFirestore();
    updateDoc(doc(firestore, "Users",  activeUserId ? activeUserId : userId), {
        firstName: firstName ? firstName : '',
        bio: bio ? bio : '',
        tiktokUrl: tiktokUrl ? tiktokUrl : '',
        twitterUrl: twitterUrl ? twitterUrl : '',
        youtubuUrl:  youtubuUrl ? youtubuUrl : '',
        instagramUrl: instagramUrl ? instagramUrl : '',
        patrionUrl: patrionUrl ? patrionUrl : '',
        websiteUrl: websiteUrl ? websiteUrl : ''
    })
    .then(() => {
      setShowLoading(false)
      if(firstName) userData['firstName'] = firstName
      if(bio) userData['bio'] = bio
      if(tiktokUrl) userData['tiktokUrl'] = tiktokUrl
      if(twitterUrl) userData['twitterUrl'] = twitterUrl
      if(youtubuUrl) userData['youtubuUrl'] = youtubuUrl
      if(instagramUrl) userData['instagramUrl'] = instagramUrl
      if(patrionUrl) userData['patrionUrl'] = patrionUrl
      if(websiteUrl) userData['websiteUrl'] = websiteUrl
      if(!activeUserId) {
       props.OnUpdateUserData(userData, userId)
      }
    })
    .catch((e) => {
      setShowLoading(false)
       console.log(e)
    });
  }

  const showPasaDialogForEmail = () => {
    if(isEditEmail) {
      setAddPassDialogVisible(true)
    }
    else {
      setIsEditEmail(true)
    }
  }

  const reauthenticate = async () => {
    console.log("reauth")
    const auth:any = getAuth();
    const credential = EmailAuthProvider.credential(auth.currentUser.email, curPass)
    const result = await reauthenticateWithCredential(auth.currentUser, credential)
    return result
  }
  
  const handleUpdateEmail = async () => {
    reauthenticate().then(() => {
      const auth:any = getAuth();
      let user = auth.currentUser;
      updateEmail(user, email).then(() => {
        const firestore = getFirestore();
        updateDoc(doc(firestore, "Users", userId), {
           email,
        })
        .then(() => {
           userData['email'] = email          
           if(!activeUserId)  {
            props.OnUpdateUserData(userData, userId)
           }
            setAddPassDialogVisible(false)
            setIsEditEmail(false),
            console.log('email Updated')
        })
        .catch((e) => {
          console.log(e)
        });       
      })
      .catch((e) => {        
        setAddPassDialogVisible(false)
        console.log(e,'update error')
      })      
    })
    .catch((e) => {
      // setAddPassDialogVisible(false)
      setShowError(true)
      console.log(e, 'reauthenticate error')
    })
  }

  const handleUpdatePass = async() => {
    reauthenticate().then(() => {
      const auth:any = getAuth();
      let user = auth.currentUser;
      updatePassword(user, newPasswd).then(() => {
        setShowChangePassDialog(false)     
        console.log('pass updated') 
      })
      .catch((e) => {        
        setShowChangePassDialog(false)      
        console.log(e,'update error')
      })      
    })
    .catch((e) => {
      // setShowChangePassDialog(false)  
      setShowError(true)    
      console.log(e, 'reauthenticate error')
    })
  }
  return (
    <View style={styles.container}>
      <ImageBackground source={mainBg} resizeMode="cover" style={styles.mainImgBg}>
        <ScrollView style={styles.contentContainer}>  
          <View style={styles.titleWithBack}>
            <TopBarLeftArrow navigation={props.navigation} />            
            <Image source={
              userData?.isAdmin ? adminBtn 
              : userData.userType == 'contentCreator' ?  contentCreatorBtn
              : userData.userType == 'premium' ?  premiumPlanBtn
              : userData.userType == 'star' ?  starPlanBtn
              : freePlanBtn
            }                 
            style={
              userData?.isAdmin ? styles.adminBtnStyle 
              : userData.userType == 'contentCreator' ?  styles.contentCreatorBtn
              : userData.userType == 'premium' ?  styles.premiumPlanBtn
              : userData.userType == 'star' ?  styles.starPlanBtn
              : styles.freePlanBtn
            } />
          </View>
          <View style={styles.dataContent}>
            <TouchableOpacity onPress={()=>pickImage()} style={styles.selectImgBtn} >
              <Image source={selectedImageUrl ? {uri: selectedImageUrl } : customUploadImg} style={styles.uplaodImgStyle} />
              {loading && <ActivityIndicator />}
            </TouchableOpacity>            
          </View>
          <View style={styles.userDataItem}>
            <View style={[styles.leftBar, styles.goldBar]} />
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>First Name</Text>
              <View style={styles.inputContent}>
                <TextInput    
                  value={firstName}           
                  onChangeText={(txt) => setFirstName(txt)}
                  placeholder="First Name" 
                  editable={isEditFN}
                  placeholderTextColor={'#968FA4'}
                  style={styles.inputStyle}/>
                
                <TouchableOpacity onPress={() => setIsEditFN(!isEditFN)} style={styles.pencilBtn}>
                  <Image source={isEditFN ? whitePencil :pencilIcon} style={styles.pencilIcon} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.userDataItem}>
            <View style={[styles.leftBar, styles.emailBar]} />
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Email Address</Text>
              <View style={styles.inputContent}>
                <TextInput    
                  value={email}           
                  onChangeText={(txt) => setEmail(txt)}
                  placeholder="your email" 
                  editable={isEditEmail}
                  placeholderTextColor={'#968FA4'}
                  style={styles.inputStyle}/>
                
                <TouchableOpacity disabled={activeUserId ?  true : false} onPress={() => showPasaDialogForEmail()} style={styles.pencilBtn}>
                  <Image source={isEditEmail ? saveIcon : pencilIcon} style={styles.pencilIcon} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <TouchableOpacity  disabled={activeUserId ?  true : false}  style={styles.updateBtnContainer} onPress={() => setShowChangePassDialog(true)}>
            <Image source={updatePassBtn} style={styles.updatePassBtn} />
          </TouchableOpacity>
          {
            userData.userType === 'contentCreator' &&
          <View>
            <View style={styles.userDataItem}>
              <View style={[styles.leftBar, styles.bioBar]} />
              <View style={styles.itemContent}>
                <View style={styles.titleWithIcon}>
                  <Text style={styles.itemTitle}>Profile BIO</Text>
                  <TouchableOpacity onPress={() => setIsEditBio(!isEditBio)} style={styles.pencilBtn}>
                    <Image source={isEditBio ? whitePencil : pencilIcon} style={styles.pencilIcon} />
                  </TouchableOpacity>
                </View>
                <View style={styles.inputContent}>
                  <TextInput    
                    value={bio}           
                    onChangeText={(txt) => setBio(txt)}         
                    numberOfLines={8}
                    multiline={true}
                    placeholder="bio..." 
                    editable={isEditBio}
                    placeholderTextColor={'#968FA4'}
                    style={[styles.inputStyle, styles.textAreaStyle]}/> 
                </View>
              </View>
            </View>
        
            <Text style={styles.socialLinksTxt}>Choose up to 3 links from below:</Text>
            <View style={styles.userDataItem}>
              <Image source={tiktokBg} style={styles.leftBarBg} />
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>Tik Tok URL</Text>
                <View style={styles.inputContent}>
                  <TextInput    
                    value={tiktokUrl}           
                    onChangeText={(txt) => setTiktokUrl(txt)}
                    placeholder="url" 
                    editable={isEditTicktok}
                    placeholderTextColor={'#968FA4'}
                    style={styles.inputStyle}/>
                  
                  <TouchableOpacity onPress={() => setIsEditTicktok(!isEditTicktok)} style={styles.pencilBtn}>
                    <Image source={isEditTicktok ? whitePencil:  pencilIcon} style={styles.pencilIcon} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.userDataItem}>
              <View style={[styles.leftBar, styles.twitterBar]} />
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>Twitter URL</Text>
                <View style={styles.inputContent}>
                  <TextInput    
                    value={twitterUrl}           
                    onChangeText={(txt) => setTwitterUrl(txt)}
                    placeholder="url" 
                    editable={isEditTwitterUrl}
                    placeholderTextColor={'#968FA4'}
                    style={styles.inputStyle}/>
                  
                  <TouchableOpacity onPress={() => setIsEditTwitterUrl(!isEditTwitterUrl)} style={styles.pencilBtn}>
                    <Image source={isEditTwitterUrl ? whitePencil:  pencilIcon} style={styles.pencilIcon} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.userDataItem}>
              <View style={[styles.leftBar, styles.youtubuBar]} />
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>Youtube URL</Text>
                <View style={styles.inputContent}>
                  <TextInput    
                    value={youtubuUrl}           
                    onChangeText={(txt) => setYoutubuUrl(txt)}
                    placeholder="url" 
                    editable={isEditYoutubuUrl}
                    placeholderTextColor={'#968FA4'}
                    style={styles.inputStyle}/>
                  
                  <TouchableOpacity onPress={() => setIsEditYoutubuUrl(!isEditYoutubuUrl)} style={styles.pencilBtn}>
                    <Image source={isEditYoutubuUrl ? whitePencil:  pencilIcon} style={styles.pencilIcon} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.userDataItem}>
              <Image source={tiktokBg} style={styles.leftBarBg} />
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>Instagram URL</Text>
                <View style={styles.inputContent}>
                  <TextInput    
                    value={instagramUrl}           
                    onChangeText={(txt) => setInstagramUrl(txt)}
                    placeholder="url" 
                    editable={isEditInstagramUrl}
                    placeholderTextColor={'#968FA4'}
                    style={styles.inputStyle}/>
                  
                  <TouchableOpacity onPress={() => setIsEditInstagramUrl(!isEditInstagramUrl)} style={styles.pencilBtn}>
                    <Image source={isEditInstagramUrl ? whitePencil:  pencilIcon} style={styles.pencilIcon} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.userDataItem}>
              <View style={[styles.leftBar, styles.patreonBar]} />
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>Patreon</Text>
                <View style={styles.inputContent}>
                  <TextInput    
                    value={patrionUrl}           
                    onChangeText={(txt) => setPatrionUrl(txt)}
                    placeholder="url" 
                    editable={isEditPatrionUrl}
                    placeholderTextColor={'#968FA4'}
                    style={styles.inputStyle}/>
                  
                  <TouchableOpacity onPress={() => setIsEditPatrionUrl(!isEditPatrionUrl)} style={styles.pencilBtn}>
                    <Image source={isEditPatrionUrl ? whitePencil:  pencilIcon} style={styles.pencilIcon} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.userDataItem}>
              <View style={[styles.leftBar, styles.websiteBar]} />
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>Website URL</Text>
                <View style={styles.inputContent}>
                  <TextInput    
                    value={websiteUrl}           
                    onChangeText={(txt) => setWebsiteUrl(txt)}
                    placeholder="url" 
                    editable={isEditWebsiteUrl}
                    placeholderTextColor={'#968FA4'}
                    style={styles.inputStyle}/>
                  
                  <TouchableOpacity onPress={() => setIsEditWebsiteUrl(!isEditWebsiteUrl)} style={styles.pencilBtn}>
                    <Image source={isEditWebsiteUrl ? whitePencil:  pencilIcon} style={styles.pencilIcon} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            </View>
          }

          <View style={styles.createDeckBtnContainer}>
            <TouchableOpacity style={styles.createDeckBtn} onPress={()=>updateProfile()}>
              <Image source={saveBtn} style={styles.createDeckBtnImg} />
            </TouchableOpacity>
            {showLoading && <ActivityIndicator />}
          </View>

          <View style={styles.bottomContainer} />
          <Modal
            animationType="slide"
            transparent={true} 
            visible={addPassDialogVisible}>
              <TouchableOpacity style={styles.modalContainer}
                  onPressOut={() => {setAddPassDialogVisible(false)}}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Please enter your password</Text>
                  <Text style={styles.modalSubTxt}>Password required to update email address </Text>
                  <View style={[styles.passInputContainer, showError && styles.errorInputStyle]}>
                    <Image source={showError ? passErrorIcon : passIcon} style={styles.passIcon} />
                    <TextInput    
                      value={curPass}          
                      onChangeText={(txt) =>{setShowError(false); setCurPass(txt)}}
                      placeholder="" 
                      secureTextEntry={true}
                      placeholderTextColor={'#968FA4'}
                      style={[styles.inputStyle]}/>
                  </View>
                  <TouchableOpacity onPress={()=>handleUpdateEmail()} style={styles.enterBtnContainer} >
                    <Image source={enterBtn} style={styles.enterBtn} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true} 
            visible={showChangePassDialog}>
               <TouchableOpacity style={styles.modalContainer}
                  onPressOut={() => {setShowChangePassDialog(false)}}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Please enter your password</Text>
                  <Text style={styles.modalSubTxt}>Password required to update  password</Text>

                  <View style={[styles.passInputContainer, showError && styles.errorInputStyle]}>
                    <Image source={showError ? passErrorIcon : passIcon} style={styles.passIcon} />
                    <TextInput    
                      value={curPass}          
                      onChangeText={(txt) =>{setShowError(false); setCurPass(txt)}}
                      placeholder="Old Password" 
                      secureTextEntry={true}
                      placeholderTextColor={'#968FA4'}
                      style={styles.inputStyle}/>
                  </View>
                  <View style={styles.passInputContainer}>
                    <Image source={passIcon} style={styles.passIcon} />
                    <TextInput    
                      value={newPasswd}          
                      onChangeText={(txt) =>{setNewPasswd(txt)}}
                      placeholder="New Password" 
                      secureTextEntry={true}
                      placeholderTextColor={'#968FA4'}
                      style={styles.inputStyle}/>
                  </View>
                  <TouchableOpacity onPress={()=>handleUpdatePass()} style={styles.enterBtnContainer} >
                    <Image source={enterBtn} style={styles.enterBtn} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
          </Modal>
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
  titleWithBack: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginTop: scaleX(30),
  },
  contentCreatorBtn: {
    width: scaleX(177),
    height: scaleX(55),
    resizeMode: 'contain',
  },
  premiumPlanBtn: {
    width: scaleX(110),
    height: scaleX(38),
    resizeMode: 'contain',
  },
  starPlanBtn: {
    width: scaleX(110),
    height: scaleX(38),
    resizeMode: 'contain',
  },
  freePlanBtn: {
    width: scaleX(110),
    height: scaleX(38),
    resizeMode: 'contain',
  },
  adminBtnStyle: {
    width: scaleX(131),
    height: scaleX(55),
    resizeMode: 'contain',
  },
  dataContent: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scaleX(45),    
    marginBottom: scaleX(26)
  },
  selectImgBtn: {
    position: 'relative'
  },
  uplaodImgStyle: {
    width: scaleX(240),
    height: scaleX(202),
    resizeMode: 'cover',
    borderRadius: scaleX(21),
  },
  userDataItem: {
    marginTop: scaleX(18),
    flex: 1,  
    flexDirection: 'row'  ,
    backgroundColor: '#252A34',
    borderRadius: scaleX(14),
    padding: scaleX(16),
  },
  leftBar: {
    width: scaleX(4),
    borderRadius: scaleX(4),
    height: scaleX(53),
  },
  leftBarBg: {
    width: scaleX(4),
    height: scaleX(53),
    resizeMode: 'contain'
  },
  goldBar: {
    backgroundColor: '#FEDD71'
  },
  emailBar: {
    backgroundColor: '#A6F3A0'
  },
  passBar: {
    backgroundColor: '#FBA4FD'
  },
  bioBar: {
    backgroundColor: '#53D6FF'
  },
  tickTockBar: {
    backgroundColor: '#FF0050'
  },
  twitterBar: {
    backgroundColor: '#00ACEE'
  },
  youtubuBar: {
    backgroundColor: '#FF0000'
  },
  instagramBar: {
    backgroundColor: '#515ED4'
  },
  patreonBar: {
    backgroundColor: '#F96854'
  },
  websiteBar: {
    backgroundColor: '#6B7488'
  },
  forgotPassTxt: {
    fontSize: scaleX(16),
    fontWeight: '600',
    lineHeight: scaleX(19),
    color:'white',
    marginTop: scaleX(28),
    marginBottom: scaleX(10),
  },
  itemContent: {
    flex: 1,
    marginLeft: scaleX(16),
  },
  itemTitle: {
    fontSize: scaleX(18),
    fontWeight: '700',
    lineHeight: scaleX(25),
    color: 'white',
    fontFamily: 'Montserrat_700Bold'
  },
  inputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: scaleX(30),
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: scaleX(30)
  },
  inputStyle: {
    height: scaleX(25),
    padding: scaleX(2),
    fontSize: scaleX(14),
    color: 'white',
    flex: 1,
    marginRight: scaleX(10),
    fontFamily: 'Montserrat_600SemiBold',
  },
  textAreaStyle: {
    height: scaleX(188),
    textAlignVertical: 'top',
  },
  socialLinksTxt: {
    fontSize: scaleX(16),
    fontWeight: '600',
    lineHeight: scaleX(19),
    color: '#ffffff',
    marginTop: scaleX(42),
    marginBottom: scaleX(24),
  },
  pencilIcon: {
    width: scaleX(12),
    height: scaleX(12),
    resizeMode: 'contain',    
  },
  bottomContainer: {
    height: scaleX(120),
  },
  pencilBtn: {
    paddingVertical: scaleX(5),
    paddingHorizontal: scaleX(10),
  },
  createDeckBtnContainer: {
    marginTop: scaleX(7),
    marginBottom: scaleX(90),
    justifyContent: 'center',
    alignItems: 'center'
  },
  createDeckBtn: {
    marginTop:scaleX(23),
    justifyContent: 'center',
    alignItems: 'center'
  },
  createDeckBtnImg: {
    width: scaleX(178),
    height: scaleX(55),
    resizeMode: 'contain'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1A1A1A',
    borderColor: '#FFFFFF0D',
    borderRadius: scaleX(16),
    maxWidth: scaleX(261),
    padding: scaleX(17),
    alignItems: 'center'
  },
  modalTitle: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: scaleX(16),
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: scaleX(15)
  },
  modalSubTxt: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: scaleX(12),
    fontWeight: '400',
    color: '#FFFFFFD9',
    textAlign: 'center',
    maxWidth: scaleX(201)
  },
  passInputContainer: {
    height: scaleX(46),
    borderRadius: scaleX(16),
    borderWidth: scaleX(1),
    marginTop: scaleX(22),
    borderColor: '#FFFFFF8C',
    width: scaleX(243),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorInputStyle: {
    borderColor: 'red'
  },
  passIcon: {
    width: scaleX(20),
    height: scaleX(23),
    marginLeft: scaleX(15),
    marginRight: scaleX(10),
    resizeMode: 'contain',

  },
  enterBtnContainer: {
    marginTop: scaleX(24),
    marginBottom: scaleX(4),
  },
  enterBtn: {
    width: scaleX(110),
    height: scaleX(38),
    resizeMode: 'contain'
  },
  updateBtnContainer: {
    alignItems: 'center',
    marginTop: scaleX(40),
  },
  updatePassBtn: {
    width: scaleX(177.5),
    height: scaleX(55),
    resizeMode: 'contain'
  }
});

const mapStateToProps = (state: ApplicationState) => ({
  userReducer: state.userReducer,
});

const UserProfile = connect(mapStateToProps, {OnUpdateUserData })(
  _UserProfile
);

export default UserProfile;
