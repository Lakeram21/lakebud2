import React, { useState } from "react";
import { View, Text, TextInput, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import CreateBudget from "../../components/CreateBudget";

const Budget = () => {
 

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CreateBudget/>
    </SafeAreaView>
  );
};

export default Budget;
