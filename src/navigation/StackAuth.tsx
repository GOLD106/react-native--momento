import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen,  RegisterScreen, ForgotPassScreen, IntroSlider} from "../screens";

const Stack = createStackNavigator();

const StackAuthScreens = () => {
  return (
    <Stack.Navigator initialRouteName="Login">      
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Forgotpass"
        component={ForgotPassScreen}
        options={{
          headerShown: false,
        }}
      /> 
      <Stack.Screen
        name="introSlider"
        component={IntroSlider}
        options={{
          headerShown: false,
        }}
      />    
    </Stack.Navigator>
  );
};

export default StackAuthScreens;
