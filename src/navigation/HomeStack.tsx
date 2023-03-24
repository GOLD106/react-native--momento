import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {  Home ,SelectDeckType, LoginScreen} from "../screens/";
import CreateMediaDeck from "../screens/deck/createMediaDeck";
import CreateVideoDeck from "../screens/deck/createVideoDeck";
import CreateDeckCard from "../screens/deck/createDeckCard";
import Settings from "../screens/settings/Settings";
import UserProfile from "../screens/settings/UserProfile";
import Profile from "../screens/Profile";
import DeckDetail from "../screens/deck/deckDetail";
import VideoDeckDetail from "../screens/deck/videoDeckDetail";
import ContentCreatorProfile from "../screens/contentCreatorProfile";
import SavedDeck from "../screens/SavedDeck";
import PlayDeck from "../screens/deck/playDeck";
import DeckCardRatingSetting from "../screens/deck/DeckCardRateSetting";
import Downloads from "../screens/settings/Downloads";
import TermsAndConditions from "../screens/settings/TermsAndConditions";
import Privacy from "../screens/settings/Privacy";
import UpgradeAccount from "../screens/UpgradeAccount";
import UploadImages from "../screens/settings/UploadImages";
import UserManagement from "../screens/settings/UserManagement";
import IntroSlider from "../screens/auth/IntroSlider";
import Tabs from "./BottomNav";

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName="home">     
      <Stack.Screen
        name="home"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
