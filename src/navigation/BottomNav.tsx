import React from "react";
import {
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";

import homeIcon from "../assets/bottomNavigator/homeIcon.png";
import homeActiveIcon from "../assets/bottomNavigator/homeActiveIcon.png";
import favIcon from "../assets/bottomNavigator/favIcon.png";
import favActiveIcon from "../assets/bottomNavigator/favActiveIcon.png";
import userIcon from "../assets/bottomNavigator/userIcon.png";
import userActiveIcon from "../assets/bottomNavigator/userActiveIcon.png";
import settingIcon from "../assets/bottomNavigator/settingIcon.png";
import settingActiveIcon from "../assets/bottomNavigator/settingActiveIcon.png";
import navVarBg from "../assets/screenBg/navVarBg.png";
import { scaleX } from "../core/theme/dimensions";
import { connect } from "react-redux";
import {ApplicationState} from "../redux";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SavedDeck from "../screens/SavedDeck";
import ProfileStack from "./ProfileStack";
import SavedDeckStack from "./SavedDeckStack";
import HomeStack from "./HomeStack";
import SettingsStack from "./SettingsStack";
import { Home } from "../screens";
import Profile from "../screens/Profile";
import Settings from "../screens/settings/Settings";

const Tab = createBottomTabNavigator();

function MyTabBar({ state, descriptors, navigation }: {state:any, descriptors:any, navigation:any}) {
  
  return (
    <View style={{ 
      height: scaleX(73)
    }}>   
    <ImageBackground source={navVarBg} resizeMode="cover" 
        style={{
          flex:1,
          flexDirection: 'row',
          alignItems: 'center'    ,
          justifyContent: 'space-between',
        }}>
      {state.routes.map((route:any, index:number) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

            
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, {userId: null});
          }
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            key={index}
            style={{ flex: 1, alignItems:"center" }}
          >
            <Image 
              source={ label == 'home' ? isFocused ? homeActiveIcon : homeIcon :
                label == 'savedDeck' ? isFocused ? favActiveIcon : favIcon :
                label == 'profiletab' ? isFocused ? userActiveIcon : userIcon :
                label == 'settingstab' ? isFocused ? settingActiveIcon : settingIcon : homeIcon                         
              } 
              style={{height: scaleX(27), resizeMode: "contain"}} />
          </TouchableOpacity>
        );
      
      })}
      </ImageBackground>
    </View>
  );
}

const _Tabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="home"
      screenOptions={{ headerShown: false }}
      tabBar={(props:any) => <MyTabBar {...props} />}
    >
      <Tab.Screen 
        name="home"   
        component={Home} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image source={homeIcon} style={{width:26, height: 26}} />
          ),
        }}/>
      <Tab.Screen name="savedDeck" 
          component={SavedDeck} 
          initialParams={{ userId: null }}
          options={{
            unmountOnBlur: true,
          }}/>
      <Tab.Screen name="profiletab" component={Profile} />
      <Tab.Screen name="settingstab" component={Settings} />
    </Tab.Navigator>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  userReducer: state.userReducer,
});

const Tabs = connect(mapStateToProps)(
  _Tabs
);

export default Tabs;
