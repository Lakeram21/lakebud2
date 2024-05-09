import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import RNPickerSelect from 'react-native-picker-select';
import { useFocusEffect } from "expo-router";
import { getCurrentBudget } from "../../API/budget";
import {getActualExpense} from "../../API/expense"

const CreateExpense = () => {
  const [amount, setAmount] = useState(null);
  const [name, setName] = useState(null);
  
  const [category, setCategory] = useState(null);
  const [budgetCategories, setBudgetCategories] = useState([]);
  const [currentCategoryAmount, setcurrentCategoryAmount] = useState(null);
  const [budget, setBudget] = useState(null);
  const [outsideBudgetCategory, setOutsideBudgetCategory] = useState(null);
  const [outsideBudgetAmount, setOutsideBudgetAmount] = useState(null);
  const [merchant, setmerchant] = useState(null);
  

  const [selectedValue, setSelectedValue] = useState(null);

  const placeholder = {
    label: 'Select a Category...',
    value: null,
  };

  const handleExpenseAdder = async()=>{
    let categoryRemainingAmount = parseFloat(currentCategoryAmount) - parseFloat(amount)
    console.log(budget)
    const updatedbudget = budget?.expense.map((element)=>{
      if(element?.category === category){
        console.log(element)
        element.amount = categoryRemainingAmount
        element.items.push(
          {
            merchant,
            name,
            amount
          }
        )
        console.log(element)
      }
    })
    
  }

  useFocusEffect(
    React.useCallback(() => {
      getCurrentBudget("Active")
        .then((res) => {
          if(res) {
            getActualExpense(res.id).then((res)=>{
              setBudget(res);
              setBudgetCategories(res.expense);
            })
          }
        })
        .catch((err) => {
          console.log(err);
        });
      return () => {
        console.log('Screen is unfocused');
      };
    }, [])
  );
    
  return (
    <SafeAreaView className="flex-1">
      <View className="p-4">
        <Text className="text-lg font-bold mb-4">Add Expense</Text>
        
        <View className="mb-4">
          <TextInput
            className="border border-gray-600 mb-2 p-2 rounded"
            placeholder="Name of Item"
            placeholderTextColor="gray"
            onChangeText={text=>setName(text)}
          />
          <TextInput
            className="border border-gray-600 mb-2 p-2 rounded"
            placeholder="Amount"
            keyboardType="numeric"
            placeholderTextColor="gray"
            onChangeText={text=>setAmount(text)}
          />
          <View  className="border border-gray-600 mb-2 p-2 rounded">
            <RNPickerSelect
             
              placeholder={placeholder}
              items={[
                { label: "Other", value: "Other" },
                ...(budgetCategories?.map((item) => ({
                  label: item?.category,
                  value: item?.category
                })) || [])
              ]}
              onValueChange={(value) => {
                setCategory(value)
                let category = budgetCategories.filter((item)=>item.category === value)
                if(category[0])
                {
                  setcurrentCategoryAmount(category[0]?.amount)
                }
               
              }}
              value={category}
            />
           
          </View>
           {currentCategoryAmount&&<Text>The Current amount is: ${currentCategoryAmount}. Not including the current Expense</Text>}
        </View>

        <TextInput
          className="border border-gray-600 mb-2 p-2 rounded"
          placeholder="Merchant"
          placeholderTextColor="gray"
          onChangeText={text=>setmerchant(text)}
        />

        <TouchableOpacity
          className="border bg-green-200 py-2 px-4 rounded"
          onPress={() =>handleExpenseAdder()}
        >
          <Text className="text-center">Add Expense</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreateExpense;
