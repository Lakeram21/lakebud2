import { Link, router } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, SafeAreaView, ScrollView, TouchableOpacity, ImageBackground } from "react-native";
import BudgetList from "../../components/BudgetList"
import background from "../../assets/janke-laskowski-jz-ayLjk2nk-unsplash.jpg";

const Budget = () => {
  return (
      <SafeAreaView className="flex-1">
        <View className="flex flex-row p-2">
          <TouchableOpacity
          className="border border-green-400 bg-green-300 p-2 rounded-md"
          >
            <Text>View Current Budget</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-1">
          <BudgetList/>
        </View>
        
        {/* Create button */}
        <View className="absolute bottom-0 left-0 right-0 p-4 bg-transparent">
          <TouchableOpacity
          onPress={()=>router.push("/createBudget")}
          >
            <View className="border rounded-lg bg-green-300 px-6 py-4 border-green-500 shadow-sm shadow-green-400">
              <Text className="text-center text-green-900 font-semibold text-lg">Create New Budget</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    
  );
};

export default Budget;
