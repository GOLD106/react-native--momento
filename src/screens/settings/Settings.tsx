import React, {useEffect, useState} from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import mainBg from "../../assets/mainBg.png";
import logoutMenuIcon from "../../assets/common/logoutMenuIcon.png";
import downloadIcon from "../../assets/common/downloadIcon.png"
import privacyMenuIcon from "../../assets/common/privacyMenuIcon.png";
import profileMenuIcon from "../../assets/common/profileMenuIcon.png";
import termsMenuIcon from "../../assets/common/termsMenuIcon.png"
import uploadImgMenuIcon from "../../assets/common/uploadImgMenuIcon.png"
import usersMenuIcon from "../../assets/common/usersMenuIcon.png"
import categoryMenuIcon from "../../assets/common/categoryMenuIcon.png"
import { NavigationScreenProp } from "react-navigation";
import { connect } from "react-redux";
import {ApplicationState, OnuserLogout, OnUserLogin} from "../../redux";
import { Entypo } from '@expo/vector-icons'; 
import { scaleX } from "../../core/theme/dimensions";

interface Props {
  navigation: NavigationScreenProp<any, any>;
  userReducer: any;
  OnuserLogout: Function;
}


const _Settings: React.FC<Props> = ({
  navigation,
  userReducer,
  OnuserLogout,
}) => { 
 
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {    
    userReducer?.then((userData:any)=>{
      setIsAdmin(userData?.curUser?.isAdmin)
    })
  }, [userReducer]);

  const handleNavigate = (screen: string): void => {
    navigation.navigate(screen);
  };

  const gotoAddDeck = () => {
    handleNavigate('selectdeckType')
  } 

  const logout = async () => {
    console.log('logout')
   
    await OnuserLogout().then(() => {
      console.log('log out')
    })
    
    

  }


  return (
    <View style={styles.container}>
      <ImageBackground source={mainBg} resizeMode="cover" style={styles.mainImgBg}>
        <ScrollView style={styles.contentContainer}>  
          {/* <View style={styles.titleWithBack}>
            <TouchableOpacity onPress={()=> props.navigation.goBack()}>
              <AntDesign name="arrowleft" size={31} color="white" />
            </TouchableOpacity>
          </View> */}
          <View style={styles.menuContent}>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('userProfile', {userId: null})}>
              <Image source={profileMenuIcon} style={styles.listIcon} />
              <Text style={styles.menuTxt}>User Profile</Text>
              <Entypo name="chevron-right" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate('termsAndConditions')}>
              <Image source={termsMenuIcon} style={styles.listIcon} />
              <Text style={styles.menuTxt}>{'Terms & Conditions'}</Text>
              <Entypo name="chevron-right" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}  onPress={() => handleNavigate('privaty')}>
              <Image source={privacyMenuIcon} style={styles.listIcon} />
              <Text style={styles.menuTxt}>Privacy</Text>
              <Entypo name="chevron-right" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}  onPress={() => handleNavigate('savedDecks')}>
              <Image source={downloadIcon} style={styles.listIcon} />
              <Text style={styles.menuTxt}>Saved Decks</Text>
              <Entypo name="chevron-right" size={24} color="white" />
            </TouchableOpacity>
            {isAdmin &&
              <View>
                <TouchableOpacity style={styles.menuItem}  onPress={() => handleNavigate('uploadImg')}>
                  <Image source={uploadImgMenuIcon} style={styles.listIcon} />
                  <Text style={styles.menuTxt}>Image Uploads</Text>
                  <Entypo name="chevron-right" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}  onPress={() => handleNavigate('userManagement')}>
                  <Image source={usersMenuIcon} style={styles.listIcon} />
                  <Text style={styles.menuTxt}>Users</Text>
                  <Entypo name="chevron-right" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}  onPress={() => handleNavigate('categoryList')}>
                  <Image source={categoryMenuIcon} style={styles.listIcon} />
                  <Text style={styles.menuTxt}>Categories</Text>
                  <Entypo name="chevron-right" size={24} color="white" />
                </TouchableOpacity>
              </View>
            }
            <TouchableOpacity style={styles.menuItem}  onPress={() => logout()}>
              <Image source={logoutMenuIcon} style={styles.listIcon} />
              <Text style={styles.menuTxt}>Log Out</Text>
              <Entypo name="chevron-right" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </ScrollView>
        {/* <BottomNavigator 
          navigation={navigation} 
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
    padding: scaleX(25),
  },
  menuItem: {
    flexDirection: 'row',
    flex: 1,
    marginTop: scaleX(22),
    alignItems: 'center'
  },
  menuTxt: {
    flex:1,
    fontSize: scaleX(16),
    fontWeight: '600',
    lineHeight: scaleX(21),
    color: 'white'
  },
  listIcon: {
    width: scaleX(50),
    height: scaleX(50),
    resizeMode: 'contain',
    marginRight: scaleX(16),
  },
});

const mapStateToProps = (state: ApplicationState) => ({
  userReducer: state.userReducer,
});

const Settings = connect(mapStateToProps, { OnuserLogout})(
  _Settings
);

export default Settings;
