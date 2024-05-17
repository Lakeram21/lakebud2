import React, { useState } from "react";
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from "react-native";
import {router, useFocusEffect} from "expo-router"
import { getCurrentBudget } from "../../API/budget";
import {getActualExpense} from "../../API/expense"

const Expenses = () => {
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
    <SafeAreaView className="flex-1 gap-4">
        <View className='flex flex-row justify-between p-4'>
            <TouchableOpacity
            className="border rounded px-4 py-6 bg-green-200"
            onPress={()=>router.push("/viewExpense")}
            >
              <Text>View all Expenses</Text>
            </TouchableOpacity>
            <TouchableOpacity
            className="border rounded px-4 py-6 bg-green-200"
              onPress={()=>router.push("/createExpense")}
            >
              <Text>Add New Expense</Text>
            </TouchableOpacity>
        </View>
        <View className="p-4">
          <View className="gap-2 mb-2">
            <Text>Total Budgeted: </Text>
            <Text>Total Spent: </Text>
            <Text>Total Remaining: </Text>
            <Text>Total Overspent:</Text>
          </View>
          <ScrollView >
            <View className="gap-4">
            {categories?.map((element, index)=>{
              console.log(element)
              if(element.category){
                let budgetCategory = budCategories[element?.id]
                let overspent = false
                let remaining = element?.Remaining
                if(element?.Remaining < 0){
                  overspent = true
                  remaining =remaining*-1
                }
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
                </TouchableOpacity> )
              }
              if(element.outSideExpenses){
                let outSideExpenses = element.outSideExpenses
                let price = 0
                outSideExpenses.map((item, index)=>{
                  console.log(item.amount)
                  price = price + parseFloat(item.amount)
                })
                return(
                  <TouchableOpacity key={index}>
                    <View className="flex flex-row border rounded-lg p-2">
                      <Text className="flex-1 bg-slate-300 p-4">Outside of Budget Expense:</Text>
                      <Text className="flex-1 bg-red-400 p-4 text-center text-lg">${price}</Text>
                    </View>
                  </TouchableOpacity>
                )
              }
            })}
            </View>
          </ScrollView>
        {/* <View className="items-center bg-slate-500 py-4">
           <PieChart
            widthAndHeight={widthAndHeight}
            series={series}
            sliceColor={sliceColor}
            coverRadius={0.60}
            coverFill={'#FFF'}
          />
        </View> */}
        </View>
    </SafeAreaView>
  );
};

export default Expenses;
