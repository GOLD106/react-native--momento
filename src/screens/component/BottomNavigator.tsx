import React, {useState} from "react";
import {
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  Keyboard,
} from "react-native";
import { useRoute } from '@react-navigation/native';

import homeIcon from "../../assets/bottomNavigator/homeIcon.png";
import homeActiveIcon from "../../assets/bottomNavigator/homeActiveIcon.png";
import favIcon from "../../assets/bottomNavigator/favIcon.png";
import favActiveIcon from "../../assets/bottomNavigator/favActiveIcon.png";
import userIcon from "../../assets/bottomNavigator/userIcon.png";
import userActiveIcon from "../../assets/bottomNavigator/userActiveIcon.png";
import settingIcon from "../../assets/bottomNavigator/settingIcon.png";
import settingActiveIcon from "../../assets/bottomNavigator/settingActiveIcon.png";
import navVarBg from "../../assets/screenBg/navVarBg.png";

import { scaleX } from "../../core/theme/dimensions";

const settingsUrls = ['settings', 'userProfile', 'termsAndConditions', 'privaty', 'downloads', 'uploadImg', 'userManagement']
const homeUrls = ['home', 'deckDetail', 'videoDeckDetail', 'playDeck', 'deckCardRateSetting']
const profileUrls = ['profile', 'contentCreatorProfile']

function BottomNavigator({ navigation , centerIcon, centerIconPress }: {navigation: any, centerIcon: object, centerIconPress: Function}) { 

  const route = useRoute();
  let curRoute = route.name; 
  const [isShowKeyboard, setIsShowKeyboard] = useState(false)

  const handleNavigate = (screen: string): void => {
    navigation.navigate(screen);
  };

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsShowKeyboard(true)
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsShowKeyboard(false)
      },
    );

    return () => {
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
    };
  }, []);


  return (   
    <View style={{backgroundColor: '#2e263c'}}>
      {isShowKeyboard ? <View />
      :
      <View style={{ 
          height: scaleX(73),
          
        }}>   
        <ImageBackground source={navVarBg} resizeMode="cover" 
            style={{
              flex:1,
              flexDirection: 'row',
              height: scaleX(73),
              paddingTop: scaleX(22),
              paddingBottom: scaleX(22),      
              justifyContent: 'space-between',
            }}>
          <TouchableOpacity
              onPress={()=>{handleNavigate('home')}}
              style={{ flex: 1 ,  justifyContent: 'center', alignItems: 'center'}} >
              <Image source={homeUrls.includes(curRoute) ? homeActiveIcon : homeIcon} style={{height: scaleX(27), resizeMode: "contain"}} />
          </TouchableOpacity>
          <TouchableOpacity
              onPress={()=>{handleNavigate('savedDecks')}}
              style={{ flex: 1 ,  justifyContent: 'center', alignItems: 'center'}} >
              <Image source={curRoute == 'savedDecks' ? favActiveIcon : favIcon} style={{height: scaleX(27), resizeMode: "contain"}} />
          </TouchableOpacity>

          <TouchableOpacity
              onPress={()=>centerIconPress()}
              style={{ flex: 1 , marginTop: scaleX(-50), justifyContent: "center", alignContent: "center"}}
          >
              <View style={{
                  backgroundColor: '#1C152A80', 
                  display: "flex", 
                  flexWrap: 'wrap', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  borderRadius: scaleX(50),
                  width: scaleX(78),
                  padding: scaleX(10),
                  alignContent: 'center'}}>
                  <Image source={centerIcon} style={{height: scaleX(58), resizeMode: "contain"}} />
              </View>            
          </TouchableOpacity>

          <TouchableOpacity
              onPress={()=>{handleNavigate('profile')}}
              style={{ flex: 1 ,  justifyContent: 'center', alignItems: 'center'}} >
              <Image source={profileUrls.includes(curRoute)? userActiveIcon : userIcon} style={{height: scaleX(27), resizeMode: "contain"}} />
          </TouchableOpacity>
          <TouchableOpacity
              onPress={()=>{handleNavigate('settings')}}
              style={{ flex: 1 ,  justifyContent: 'center', alignItems: 'center'}} >
              <Image source={settingsUrls.includes(curRoute)? settingActiveIcon : settingIcon} style={{height: scaleX(27), resizeMode: "contain"}} />
          </TouchableOpacity>
        </ImageBackground>
        
          
      </View>
      }
    </View>
  );
}


export default BottomNavigator ;