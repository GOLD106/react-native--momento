import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageBackground,
} from "react-native";
import mainBg from "../../assets/mainBg.png";
import mediaDeckType from "../../assets/deck/mediaDeckType.png"
import videoDeckType from "../../assets/deck/videoDeckType.png"
import { AntDesign } from '@expo/vector-icons'; 

import { NavigationScreenProp } from "react-navigation";
import BottomNavigator from "../component/BottomNavigator";
import backIcon from '../../assets/common/backIcon.png'

import { scaleX } from "../../core/theme/dimensions";
import TopBarLeftArrow from "../component/TobBarLeftArrow";

interface Props {
  navigation: NavigationScreenProp<any, any>;
}

const WIDTH_DEVICE = Dimensions.get("window").width;

const SelectDeckType: React.FC<Props> = (props: Props) => { 
  
  const handleNavigate = (screen: string): void => {
    props.navigation.navigate(screen,{deckId: null});
  };

  const gotoBack = () => {
    props.navigation.goBack()
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={mainBg} resizeMode="cover" style={styles.mainImgBg}>
        <View style={styles.contentContainer}>  
          <TopBarLeftArrow navigation={props.navigation} />
          <TouchableOpacity style={styles.container} onPress={()=>handleNavigate('createMediaDeck')}>
            <Image source={mediaDeckType}  style={styles.deckTypeImg} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.container} onPress={()=>handleNavigate('createVideoDeck')}>
            <Image source={videoDeckType}  style={styles.deckTypeImg} />
          </TouchableOpacity>
        </View>
        {/* <BottomNavigator 
          navigation={props.navigation} 
          centerIcon={backIcon}
          centerIconPress={gotoBack}
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
  },
  mainImgBg: {
    flex: 1,
    resizeMode: 'cover',
  },
  deckTypeImg: {
    flex:1,
    width: WIDTH_DEVICE - scaleX(50),
    resizeMode: 'contain',
  }
});


export default SelectDeckType;
