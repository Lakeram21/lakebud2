import { Link } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import BudgetList from "../../components/BudgetList"


const Budget = () => {

  return (
    <SafeAreaView className="flex-1">
       <View className="">
        <Link href="/createBudget"><Text>Create Budget</Text></Link>
      </View>
      <View className="justify-evenly">
        <TouchableOpacity
        className='px-2'
        ><Text>List of Budget</Text></TouchableOpacity>
        <TouchableOpacity
         className='px-2'
        ><Text>Current Budget</Text></TouchableOpacity>
      </View>
      <View className="flex-1">
          <Text className="text-lg text-center">Budget List</Text>
         <BudgetList/>
      </View>
     
      {/* 
        
      <View className="justify-evenly">
        <TouchableOpacity
        className='px-2'
        ><Text>List of Budget</Text></TouchableOpacity>
        <TouchableOpacity
         className='px-2'
        ><Text>Current Budget</Text></TouchableOpacity>
        <TouchableOpacity
         className='px-2'
        ><Text>Set as Current Budget</Text></TouchableOpacity>
      </View>
      <View>
        <View><Text>Stats on the Current Budget</Text></View>

        <View><Text>Layout</Text></View>
      
           <BudgetList/>
    
      </View> */}
    </SafeAreaView>
  );
};

export default Budget;
