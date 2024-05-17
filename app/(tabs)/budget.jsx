import { Link, router } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import BudgetList from "../../components/BudgetList"


const Budget = () => {

  return (
    <SafeAreaView className="flex-1">
      <View className="flex p-4">
          <TouchableOpacity
          onPress={()=>router.push("/createBudget")}
          className="border rounded-md p-3 bg-slate-300"
          >
        <Text className="text-center text-lg ">Create New Budget</Text>
        </TouchableOpacity>
      </View>
           
      
      <View className="flex-1 p-4">
        <Text className="text-lg text-center">Budget List</Text>
        <BudgetList/>
      </View>
      
     
    </SafeAreaView>
  );
};

export default Budget;
