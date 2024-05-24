import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { getCurrentBudget } from "../../API/budget";
import { getActualExpense } from "../../API/expense";
import background from "../../assets/janke-laskowski-jz-ayLjk2nk-unsplash.jpg";

const Expense = () => {
  const [budget, setBudget] = useState(null);
  const [categories, setCategories] = useState([]);
  const [budCategories, setBudCategories] = useState({});

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const res = await getCurrentBudget("Active");
          console.log(res)
          if (res) {
            const cateDic = {};
            res.expense?.forEach((element) => {
              if (element.amount !== "") {
                cateDic[element.id] = element;
              }
            });
            setBudCategories(cateDic);

            const expenseRes = await getActualExpense(res.id);
            console.log(expenseRes)
            setBudget(expenseRes);

            const categoryData = expenseRes.expense?.filter(
              (element) => element?.amount !== ""
            );
            setCategories(categoryData);
          }
        } catch (err) {
          console.log("this",err);
        }
      };

      fetchData();
      return () => console.log("Screen is unfocused");
    }, [])
  );

  return (
    // <ImageBackground source={background} className="flex-1 justify-center">
      <SafeAreaView className="flex-1">
        <View className="p-4">
          <Text className="text-center text-2xl font-bold">All Expenses</Text>
        </View>
        <ScrollView className="p-4 mb-24">
          <View className="gap-4">
            {categories?.map((element, index) => {
              if (element.category){

              const budgetCategory = budCategories[element.id];
              const overspent = element.Remaining < 0;
              const remaining = Math.abs(element.Remaining);
              const categoryExpensesData = element.items?.map((item, idx) => (
                <View
                  className="flex flex-row justify-between border-b border-gray-200 p-4"
                  key={idx}
                >
                  <Text className="flex-1">{item?.name}</Text>
                  <Text className="flex-1">${item?.amount}</Text>
                  <Text className="flex-1">{item?.merchant}</Text>
                </View>
              ));
                

              return (
                <TouchableOpacity key={index}>
                  <View className="flex flex-col border-b border-l p-4 bg-green-100   border-green-400 shadow-sm">
                    <View className="flex flex-row justify-between items-center">
                      <Text className="text-lg font-bold">
                        {element.category}
                      </Text>
                      <Text className="bg-slate-500 rounded-full px-3 py-1 text-white">
                        Budgeted: ${budgetCategory.amount}
                      </Text>
                    </View>
                    <View className="flex flex-row justify-between items-center mt-2">
                      <Text className="bg-green-500 px-3 py-1 text-white">
                        Spent: ${budgetCategory.amount - element.Remaining}
                      </Text>
                      <Text
                        className={`rounded-full px-3 py-1 text-white ${
                          overspent ? "bg-red-400" : "bg-green-600"
                        }`}
                      >
                        {overspent ? "Overspent: $" : "Remaining: $"}
                        {remaining}
                      </Text>
                    </View>
                  </View>
                  <View className="mt-4">
                    <View className="flex flex-row justify-between border-b border-gray-200 px-4">
                      <Text className="text-lg font-semibold">Name</Text>
                      <Text className="text-lg font-semibold">Amount</Text>
                      <Text className="text-lg font-semibold">Merchant</Text>
                    </View>
                    {categoryExpensesData}
                  </View>
                </TouchableOpacity>
              );
              }
              if (element.outSideExpenses) {
              const price = element.outSideExpenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
              const categoryExpensesData = element.outSideExpenses?.map((item, idx) => (
                <View className="flex flex-row justify-between border-b border-gray-200" key={idx}>
                  <Text className="flex-1 p-4">{item?.name}</Text>
                  <Text className="flex-1 p-4">${item?.amount}</Text>
                  <Text className="flex-1 p-4">{item?.merchant}</Text>
                </View>))

                  return (
                  <TouchableOpacity key={index}>
                    <View className="flex flex-row justify-between border-b border-l p-4 bg-red-200 border-red-400">
                      <Text className="text-lg text-slate-800 font-bold">Outside of Budget Expense:</Text>
                      <Text className="bg-red-400 rounded-full px-3 py-1 text-white text-lg">${price}</Text>
                    </View>
                    <View className="mt-4">
                      <View className="flex flex-row justify-between border-b border-gray-200  px-4">
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
       <View className="absolute bottom-0 left-0 right-0 p-4 bg-transparent">
        <TouchableOpacity
        onPress={()=> router.push("/createExpense")}
        >
          <View className="border rounded-lg bg-green-300 px-6 py-4 border-green-500 shadow-sm shadow-green-400">
            <Text className="text-center text-green-900 font-semibold text-lg">Add Expense</Text>
          </View>
        </TouchableOpacity>
        
      </View>
      </SafeAreaView>
    // </ImageBackground>
  );
};

export default Expense;
