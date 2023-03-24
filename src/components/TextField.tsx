/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet, Image , ImageBackground} from "react-native";
import authBg from '../assets/btns/authBg.png'
import authActiveBg from '../assets/btns/authActiveBg.png'
import errorBg from '../assets/signin/errorBg.png' 
import { scaleX } from "../core/theme/dimensions";

interface TextFieldProps {
  placeholder: string;
  isSecure?: boolean;
  imgIcon?: object;
  isActive?: boolean;
  isError?: boolean;
  onTextChange: (text: string) => void;
}

export const TextField: React.FC<TextFieldProps> = ({
  placeholder,
  isSecure = false,
  isActive = false,
  isError = false,
  imgIcon,
  onTextChange,
}) => {
  const [isPassword, setIsPassword] = useState(false);

  useEffect(() => {
    setIsPassword(isSecure);
  }, []);

  return (
    <View style={[styles.contentContainer, isActive && styles.activeContent, isError && styles.errorContainer]}>
      <ImageBackground source={isError ? errorBg : !isActive ?  authBg : authActiveBg} resizeMode="cover"  style={styles.container}>

        {imgIcon && <Image source={imgIcon} style={styles.imgIconStyle}/>}
        <TextInput
          autoCapitalize="none"
          secureTextEntry={isPassword}
          onChangeText={(text) => onTextChange(text)}
          style={[styles.textField, isError && styles.errorInput]}
        />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    height:scaleX(77), 
    borderRadius: scaleX(16),
    justifyContent: "center",
    alignItems: "center",
    marginTop:scaleX(20),
    borderWidth: scaleX(1),
    borderColor: '#FFF9601A',
    overflow: "hidden"
  },
  activeContent: {
    borderColor: '#ffd74c'
  },
  errorContainer: {
    borderColor: '#FF517B'
  },
  container: {
    flex:1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  textField: {
    flex: 1,
    height: scaleX(77),
    fontSize: scaleX(14),
    color: 'white',
  },
  errorInput: {
    color: '#FF517B'
  },
  imgIconStyle: {
    width: scaleX(25),
    // height: 29,
    resizeMode: 'contain',
    alignItems: 'center',
    margin: scaleX(20),
  }
});
