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
      <Text className='text-center'>Expense</Text>
      <View className='flex flex-row justify-evenly'>
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
            <Text>Add New Expenses</Text>
          </TouchableOpacity>
      </View>
      <View className="">
        <Text className="text-center">At A Glance</Text>
        <ScrollView>
          <View className="gap-4">
          {categories?.map((element, index)=>{
            console.log(element)
            if(element.category){
              let budgetCategory = budCategories[element?.id]
              let overspent = false
              let remaining = element?.amount
              if(element?.amount < 0){
                overspent = true
                remaining =remaining*-1
              }
              return (
              <TouchableOpacity>
              
            
              <View className="flex flex-row border rounded-lg p-2" key={index}>
                <Text className="flex-1 bg-slate-300 p-4">{element?.category}</Text>
                <Text className="flex-1 bg-green-500 p-4">Budgeted: ${budgetCategory?.amount}</Text>
                <Text className="flex-1 bg-green-300 p-4">Spent: ${budgetCategory?.amount - element?.amount}</Text>
                {overspent ? (
                  <Text className="flex-1 bg-red-400 p-4">Overspent: ${remaining}</Text>
                ) : (
                  <Text className="flex-1 bg-green-400 p-4">Remaining: ${remaining}</Text>
                )}
              </View>
              </TouchableOpacity> )
            }
            if(element.outSideExpenses){
              let outSideExpenses = element.outSideExpenses
              let price = 0
              outSideExpenses.map((item)=>{
                console.log(item.amount)
                price = price + parseFloat(item.amount)
              })
              return(
                <TouchableOpacity>
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
      <View>

      </View>
    </SafeAreaView>
  );
};

export default Expenses;
