import { View, Text, ImageBackground } from "react-native";
import React from "react";
import { Link } from "expo-router";
import background from "../../assets/janke-laskowski-jz-ayLjk2nk-unsplash.jpg"

const Home = () => {
  return (
     <ImageBackground
      source={background}
      className="flex-1 justify-center"
    >
    <View className="flex-row gap-2 justify-evenly">
      <View className="border p-12 rounded-md bg-slate-400 bg-transparent">
        <Text>Card 1</Text>
      </View>
      <View className="border p-12 rounded-md">
        <Text>Card 1</Text>
      </View>
    </View>
    </ImageBackground>
    
  );
};

export default Home;
