import React, { useState } from "react";
import { View, Text, TextInput, SafeAreaView, FlatList, TouchableOpacity, ScrollView, ScrollViewBase } from "react-native";
import {router, useFocusEffect} from "expo-router"
import { getCurrentBudget } from "../../API/budget";
import {getActualExpense} from "../../API/expense"




const ViewExpense = () => {
  const [budget, setBudget] = useState(null);
  const [categories, setcategories] = useState([]);
  const [budCategories, setBudCategories] = useState([]);

   useFocusEffect(
    React.useCallback(() => {
      getCurrentBudget("Active")
        .then((res) => {
          if(res) {
            let cateDic = {}
            let budCategories_ = res.expense?.map((element)=>{
              if(element.amount !=""){
                    cateDic[element.id] = element
                    return element
                  }
            })

            setBudCategories(cateDic)

            // Get actual Expense budget
            getActualExpense(res.id).then((res)=>{
              setBudget(res);
              
              //set the category amount
              let categories = res.expense?.map((element)=>{
                  if(element.amount !=""){
                    return element
                  }
              })
              setcategories(categories)
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
    <SafeAreaView>
    <View>
      <Text>All Expenses</Text>
    </View>
    <ScrollView className="p-4">
      <View className="gap-4">
        {categories.map((element, index) => {
          if (element.category) {
            const budgetCategory = budCategories[element.id];
            const overspent = element.Remaining < 0;
            const remaining = overspent ? - element.Remaining : element.Remaining;
            const categoryExpensesData = element.items.map((item, idx) => (
              <View className="flex flex-row justify-between border-b border-gray-200" key={idx}>
                <Text className="flex-1 p-4">{item.name}</Text>
                <Text className="flex-1 p-4">${item.amount}</Text>
                <Text className="flex-1 p-4">{item.merchant}</Text>
              </View>
            ));

            return (
              <TouchableOpacity key={index}>
                <View className="flex flex-col border rounded-lg p-4">
                  <View className="flex flex-row justify-between items-center">
                    <Text className="text-lg font-bold">{element.category}</Text>
                    <Text className="bg-slate-500 rounded-full px-3 py-1 text-white">Budgeted: ${budgetCategory.amount}</Text>
                  </View>
                  <View className="flex flex-row justify-between items-center mt-2">
                    <Text className="bg-green-500 px-3 py-1">Spent: ${budgetCategory.amount - element.Remaining}</Text>
                    <Text className={`rounded-full px-3 py-1 text-white ${overspent ? 'bg-red-400' : 'bg-green-400'}`}>
                      {overspent ? 'Overspent: $' : 'Remaining: $'}{remaining}
                    </Text>
                  </View>
                </View>
                <View className="mt-4">
                  <View className="flex flex-row justify-between border-b border-gray-200 px-4">
                    <Text className="text-lg font-semi-bold">Name</Text>
                    <Text className="text-lg font-semi-bold">Amount</Text>
                    <Text className="text-lg font-semi-bold">Merchant</Text>
                  </View>
                  {categoryExpensesData}
                </View>
              </TouchableOpacity>
            );
          }

          if (element.outSideExpenses) {
            const price = element.outSideExpenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
            const categoryExpensesData = element.outSideExpenses.map((item, idx) => (
              <View className="flex flex-row justify-between border-b border-gray-200" key={idx}>
                <Text className="flex-1 p-4">{item.name}</Text>
                <Text className="flex-1 p-4">${item.amount}</Text>
                <Text className="flex-1 p-4">{item.merchant}</Text>
              </View>))

            return (
              <TouchableOpacity key={index}>
                <View className="flex flex-row justify-between border rounded-lg p-4 bg-red-100">
                  <Text className="text-lg font-bold">Outside of Budget Expense:</Text>
                  <Text className="bg-red-400 rounded-full px-3 py-1 text-white text-lg">${price}</Text>
                </View>
                <View className="mt-4">
                  <View className="flex flex-row justify-between border-b border-gray-200 px-4">
                    <Text className="text-lg font-semi-bold">Name</Text>
                    <Text className="text-lg font-semi-bold">Amount</Text>
                    <Text className="text-lg font-semi-bold">Merchant</Text>
                  </View>
                  {categoryExpensesData}
                </View>
              </TouchableOpacity>
            );
          }
        })}
      </View>
    </ScrollView>

    </SafeAreaView>
  );
};

export default ViewExpense;
