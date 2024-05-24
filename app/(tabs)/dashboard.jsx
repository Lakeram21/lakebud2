import { View, Text, ImageBackground, ScrollView, TouchableOpacity, FlatList } from "react-native";
import React, { useState } from "react";
import { router, useFocusEffect } from "expo-router";
import background from "../../assets/janke-laskowski-jz-ayLjk2nk-unsplash.jpg";
import { getCurrentBudget } from "../../API/budget";
import { getActualExpense } from "../../API/expense";
import PieChart from 'react-native-pie-chart'
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const [budget, setBudget] = useState(null);
  const [actualBudget, setActualBudget] = useState(null);

  const [plannedSpending, setplannedSpending] = useState(1);
  const [outsideSpending, setoutsideSpending] = useState(1);
  const [available, setAvailable] = useState(1)
  
  const widthAndHeight = 250
  const series = [plannedSpending, outsideSpending, available]
  const sliceColor = ['#2A6FE6', '#E62A2A', '#249066']

  useFocusEffect(
    React.useCallback(() => {
      getCurrentBudget("Active")
        .then((res) => {
          if (res) {
            console.log(res);
            let amount = 0;
            res.expense?.map((element) => {
              if (element.amount != "") {
                amount = parseFloat(element.amount) + amount;
              }
            });
            res.savings?.map((saving) => {
              amount = parseFloat(saving.amount) + amount;
            });
            

            // Get actual Expense budget
            getActualExpense(res.id).then((res) => {
              let _amount = 0;
              let remaining = 0;
              let _outsideSpending = 0;
              // set the category amount
              console.log(res);
              setActualBudget(res);
              res.expense?.map((element) => {
                if (element.amount && element.amount != "") {
                  _amount = amount + parseFloat(element.amount);
                  remaining = remaining + parseFloat(element.Remaining);
                }
                if(element.outSideExpenses){
                  let outSideExpenses = element.outSideExpenses
                  let _price = 0
                  outSideExpenses.map((item, index)=>{
                    console.log(item.amount)
                    _price = _price + parseFloat(item.amount)
                  })
                  setoutsideSpending(_price)
                }
              });

              res.savings?.map((saving) => {
                _amount = parseFloat(saving.amount) + amount;
              });
              setplannedSpending(_amount - remaining)
              setAvailable(remaining);
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
      return () => {
        console.log("Screen is unfocused");
      };
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 justify-center">
    {/* // <ImageBackground source={background} className="flex-1 justify-center"> */}
      <View className="flex-1 px-4 py-6">
        <View className="flex justify-between">
          {/* Monthly Budget Overview */}
          <View className="border 
           border-green-400 bg-green-200 mb-4">
            <Text className="px-2 text-lg font-bold text-slate-700">Budget Overview</Text>
            <View className="py-1 px-3 bg-green-50 m-0">
              <Text className="text-slate-600">Total Available: ${available}</Text>
              <Text className="text-slate-600">Total Planned: ${plannedSpending}</Text>
              <Text className="text-slate-600">Total Outside: ${outsideSpending}</Text>
            </View>
          </View>

          {/* Expense Categories */}
          <View className="border border-green-400 bg-green-100 p-4 mb-4">
            <Text className="text-lg font-bold text-slate-700 mb-2">Expense Overview</Text>
            <View className="flex flex-row gap-1">
              <PieChart 
                widthAndHeight={widthAndHeight}
                series={series}
                sliceColor={sliceColor}
                coverRadius={0.45}
                coverFill={'#FFF'}
              />
              <View>
                <Text><Icon name="circle" size={20} color='#249066' /> Available</Text>
                <Text><Icon name="circle" size={20} color='#2A6FE6' /> Planned</Text>
                <Text><Icon name="circle" size={20} color='#E62A2A' /> Outside</Text>
              </View>
            </View>
            
            <View className="h-40 mt-2">
              <FlatList
              data={actualBudget?.expense}
              keyExtractor={(item) => item.category}
              renderItem={({ item }) => {
                if(item.category){
                  return (
                    <View className="p-2  mb-2 bg-green-50">
                      <Text className="text-lg font-bold text-gray-700">{item.category}: <Text className="text-sm text-gray-500">Bud- ${item.amount}, Spt- ${item.amount - item.Remaining}, Rmg- ${item.Remaining}</Text></Text>
                  </View>
                  )
                }
                if(item.outSideExpenses){
                  let outSideExpenses = item.outSideExpenses
                  let _price = 0
                  outSideExpenses.map((item, index)=>{
                    console.log(item.amount)
                    _price = _price + parseFloat(item.amount)
                  })
                  return(
                    <View className="p-2 mb-2 bg-red-200">
                      <Text className="text-base text-gray-600">
                        <Text className="font-semibold">Outside Expense</Text> ${_price}
                      </Text>
                  </View>
                  )
                  }
                  
              }}
            />
            </View>
          
          </View>
          
        </View>
      </View>

      {/* Add Expense Button */}
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
  );
};

export default Home;
