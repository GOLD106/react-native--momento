import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StackAuthScreens from "./StackAuth";
import HomeStack from "./HomeStack"
import { connect } from "react-redux";
import {ApplicationState} from "../redux";
import Tabs from "./BottomNav";
import MainStack from "./MainStack";
const _Main = (userReducer:any) => {

  const [loggedinUser, setLoggedinUser] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {    
    userReducer?.userReducer.then((userData:any)=>{
      if(userData.isLoggedIn && userData.finishIntro) {
        
        setLoggedinUser(true)
      }
      else {
        setLoggedinUser(false)
      }
      setLoaded(true)
    })
  }, [userReducer]);
  
  return (
    <NavigationContainer>
      {loaded ?
        loggedinUser ? <MainStack /> :  <StackAuthScreens /> : <StackAuthScreens />
      }
    </NavigationContainer>
  );
};


const mapStateToProps = (state: ApplicationState) => ({
  userReducer: state.userReducer,
});

const Main = connect(mapStateToProps, { })(
  _Main
);

export default Main;
