import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import RNPickerSelect from 'react-native-picker-select';
import { useFocusEffect } from "expo-router";
import { getCurrentBudget } from "../../API/budget";
import {getActualExpense, updateExpense} from "../../API/expense"

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
    try{
    console.log("this is curretn amiout: ",currentCategoryAmount)
    let categoryRemainingAmount = parseFloat(currentCategoryAmount) - parseFloat(amount)
    console.log("Here", category)
    budget?.expense.map((element)=>{
      if(category && category != "Other"){
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
      }
      if (category && category === "Other" && element.outSideExpenses){
        element.outSideExpenses.push(
          {
              merchant,
              name,
              amount
          }
        )
      }})

    const result = await updateExpense(budget.id, budget)
    console.log(result)
    if(result.success){
      setAmount(null)
      setName(null)
      setCategory(null)
      setmerchant(null)
      Alert.alert("Success", "Your Expense has been added to the current Budget")
    }
    }
    catch(err){
      console.log(err)
    }
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

  useFocusEffect(
    React.useCallback(()=>{
      return ()=>{

      }
    },[amount])
  )
    
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
            value={name}
          />
          <TextInput
            className="border border-gray-600 mb-2 p-2 rounded"
            placeholder="Amount"
            keyboardType="numeric"
            placeholderTextColor="gray"
            onChangeText={text=>setAmount(text)}
            value={amount}
          />
          <View  className="border border-gray-600 mb-2 p-2 rounded">
         
            <RNPickerSelect
                placeholder={placeholder}
                items={[
                  { label: "Other", value: "Other", key: "Other" }, // Adding key for the "Other" option
                  ...(budgetCategories?.filter(item => item.category).map((item, index) => ({
                    label: item?.category,
                    value: item?.category,
                    key: `category_${index}` // Adding key for each budget category
                  })) || [])
                ]}
                onValueChange={(value) => {
                  setCategory(value);
                  let category_ = budgetCategories.filter((item) => item.category === value);
                  console.log("This is caaegory: ",category_)
                  if (category_ && category_.length > 0) {
                    setcurrentCategoryAmount(category_[0].amount);
                  }
                  console.log(category_)
                }}
                value={category}
              />
           
          </View>
           {/* {currentCategoryAmount === null ? null :<Text>The Current amount is: ${currentCategoryAmount}. Not including the current Expense</Text>} */}
        </View>

        <TextInput
          className="border border-gray-600 mb-2 p-2 rounded"
          placeholder="Merchant"
          placeholderTextColor="gray"
          onChangeText={text=>setmerchant(text)}
          value={merchant}
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
