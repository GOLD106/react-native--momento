import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {  Home ,SelectDeckType, LoginScreen} from "../screens";
import CreateMediaDeck from "../screens/deck/createMediaDeck";
import CreateVideoDeck from "../screens/deck/createVideoDeck";
import CreateDeckCard from "../screens/deck/createDeckCard";
import Settings from "../screens/settings/Settings";
import UserProfile from "../screens/settings/UserProfile";
import Profile from "../screens/Profile";
import DeckDetail from "../screens/deck/deckDetail";
import VideoDeckDetail from "../screens/deck/videoDeckDetail";
import ContentCreatorProfile from "../screens/contentCreatorProfile";

const Stack = createStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator initialRouteName="profile">     
      <Stack.Screen
        name="profile"
        component={Profile}
        options={{
          headerShown: false,
        }}
      />   
    </Stack.Navigator>
  );
};

export default ProfileStack;
