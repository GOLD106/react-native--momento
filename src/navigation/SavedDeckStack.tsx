import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SavedDeck from "../screens/SavedDeck";
import SavedDeckPlay from "../screens/deck/savedDeckPlay";

const Stack = createStackNavigator();

const SavedDeckStack = () => {
  return (
    <Stack.Navigator initialRouteName="savedDeck">     
      <Stack.Screen
        name="savedDeck"
        component={SavedDeck}
        options={{
          headerShown: false,
        }}
      />  
    </Stack.Navigator>
  );
};

export default SavedDeckStack;
