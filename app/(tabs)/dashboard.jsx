import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";

const Home = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl">Home</Text>
      <Link href='/dashboard'>Add to budget</Link>
    </View>
  );
};

export default Home;
