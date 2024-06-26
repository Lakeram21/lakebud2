import { Text, View } from "react-native";
import React from "react";
import {Redirect, Slot, Stack} from 'expo-router'
import GlobalProvider from "../context/GlobalProvider"
import 'react-native-reanimated'
const RootLayout = () => {



  return (
    <GlobalProvider>
      <Stack>
        <Stack.Screen name = "index" options={{headerShown:false}}/>
        <Stack.Screen name = "(auth)" options={{headerShown: false}}/>
        <Stack.Screen name = "(tabs)" options={{headerShown: false}}/>
      </Stack>
    </GlobalProvider>
  );
};

export default RootLayout;
