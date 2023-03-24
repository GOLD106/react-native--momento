import React from "react";
import { TouchableOpacity, Image } from "react-native";
import topbarBackIcon from '../../assets/common/topbarBackIcon.png'
import { scaleX } from "../../core/theme/dimensions";

function TopBarLeftArrow({ navigation}: {navigation: any}) { 

  return (   
    <TouchableOpacity onPress={()=> navigation.goBack()}>
      <Image source={topbarBackIcon} 
        style={{
          width: scaleX(37),
          height: scaleX(31),
          resizeMode: 'contain'
        }} />
    </TouchableOpacity>
  );
}


export default TopBarLeftArrow ;