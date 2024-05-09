import { View, Text, TextInput } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import {getCurrentBudget} from "../../API/budget"

const createExpense = () => {
  const [amount, setAmount] = useState(null);
  const [category, setCategory] = useState(null);
  const [budget, setBudget] = useState(null)
  const [outsideBudgetCategory, setoutsideBudgetCategory] = useState(null);
  const [outsideBudgetAmount, setoutsideBudgetAmount] = useState(null);
  const [currentBudgetExpenseCategory, setcurrentBudgetExpenseCategory] = useState(null);
  
  
  
  


  useFocusEffect(
    React.useCallback(() => {
      // fetchData()
      getCurrentBudget("Active")
      .then((res)=>{
        if(res){
          setBudget(res)
          console.log(res)
        }
      }).catch((err)=>{
        console.log(err)
      })
      return () => {
        console.log('Screen is unfocused');
      };
    }, [])
  );
    
  return (
    <SafeAreaView>
      <View>
        <Text>Add Expense</Text>
      </View>
      <View>
        <TextInput
        placeholder="Enter Amount"
        keyboardType="numeric"
        />
      </View>
    </SafeAreaView>
   
  );
};

export default createExpense;
