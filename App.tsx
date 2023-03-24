import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { StripeProvider } from '@stripe/stripe-react-native';
import Main from "./src/navigation/";
import { store } from "./src/redux";
import { Provider } from "react-redux";
import { MyGlobalContext } from "./src/context/index";
import { AccountInfo } from "./src/types";

import { initializeApp } from 'firebase/app';
import {initializeFirestore} from 'firebase/firestore';

import apiKeys from './config/keys';

const app = initializeApp(apiKeys.firebaseConfig);

// initializeApp(apiKeys.firebaseConfig);

initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export default function App() {

  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  return (
    <StripeProvider
      publishableKey="pk_test_51LuZxNGg5YK1Q5KrRsnvbzB5EsXEURxdSiYnf1s5iwcbobFSmmTcjNlxNeMbZrI70tjvHWKBhoy4lYuaqsfs32gQ00whViubI2"
      urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
      merchantIdentifier="merchant.com.plic14.momento" // required for Apple Pay
    >
      {/* <> */}
        <Provider store={store}>
          <MyGlobalContext.Provider value={{ accountInfo, setAccountInfo }}>
            <Main />
          </MyGlobalContext.Provider>
        </Provider>
      {/* </> */}
    </StripeProvider>
  );
}



