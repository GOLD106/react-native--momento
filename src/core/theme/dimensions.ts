import {
    ScrollView,
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    ImageBackground,
  } from "react-native";

  let deviceWidth = Dimensions.get("window").width
  let deviceHeight = Dimensions.get("window").height

 export const scaleX = (size:number) => {
    return (size * deviceWidth / 414)
  }

  export const scaleY = (size:number) => {
    return (size * deviceHeight / 896)
  }
