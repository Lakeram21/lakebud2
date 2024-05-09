import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState, useCallback} from "react";
import {useLocalSearchParams, useFocusEffect} from "expo-router"
import {getBudgetById, updateBudget, getCurrentBudget} from "../../API/budget"
import { SafeAreaView } from "react-native-safe-area-context";
import {formatDate} from "../../utils/dateformater"


const viewBudget = () => {
  const [budget, setbudget] = useState(null);
  const [startDate, setstartDate] = useState(null);
  const [endDate, setendDate] = useState(null);
  const [currentStatus, setcurrentStatus] = useState(null);
  const [currentBudget, setCurrentBudget] = useState(null)
  
  
  
  const params = useLocalSearchParams()
  const {id} = params;
 
  const setAsCurrentBudgetHandler = async()=>{
    try{
        let status = "Active"
        // Check if this is the same budget as the current
        const currentBudget = await getCurrentBudget("Active")
        if(currentBudget?.id != budget?.id){
          const result = await updateBudget(budget?.id, {status:status} )
          console.log(result)
          if(result["success"]){
            console.log("success")
          }
          else{
            console.log("Fail")
          }
        }
        else{
          console.log("Already the current budget")
        }
        
    }catch{
      console.log("Fail error")
    }
    
  }

   useFocusEffect(
        React.useCallback(() => {
          if(id){
            console.log("Here", id)
            getBudgetById(id)
            .then((res)=>{
              setbudget(res)
              let endDate = res?.endDate
              endDate = formatDate(endDate)
              setendDate(endDate)

              let startDate = res?.startDate
              startDate = formatDate(startDate)
              setstartDate(startDate)

              setcurrentStatus(res?.status)

            }).catch((err)=>{
              console.log(err)
            })
          }
    
          return () => {
            console.log('Screen is unfocused');
          };
        }, [])
      );
  
  // useFocusEffect(()=>{
    
  //   if(id){
  //     console.log("Here", id)
  //     getBudgetById(id)
  //     .then((res)=>{
  //       setbudget(res)
  //       let endDate = res?.endDate
  //       endDate = formatDate(endDate)
  //       setendDate(endDate)

  //       let startDate = res?.startDate
  //       startDate = formatDate(startDate)
  //       setstartDate(startDate)

  //       setcurrentStatus(res?.status)

  //     }).catch((err)=>{
  //       console.log(err)
  //     })
  //   }
   
  // }, [])
  return (
    <SafeAreaView>
      <View>
        <Text className="text-center font-bold text-xl">{budget?.name}</Text>
        <View>
          <Text>{startDate} to {endDate}</Text>
        </View>
        <TouchableOpacity
        onPress={setAsCurrentBudgetHandler}
        ><Text className="text-right bg-slate-300 border">Set as Current Budget</Text>
        </TouchableOpacity>
        <Text className="text-left font-bold text-lg" >Incomes</Text>
        <View className="flex flex-row justify-evenly">
          <Text className="font-bold">Category</Text>
          <Text className="font-bold">Amount</Text>
        </View>
        {budget?.incomes.map((income)=>(
          <View className="flex flex-row justify-evenly">
            <Text>{income?.category}</Text>
            <Text>{income?.amount}</Text>
          </View>
        ))}
        <Text className="text-left font-bold text-lg">Expenses</Text>
         <View className="flex flex-row justify-evenly">
          <Text className="font-bold">Category</Text>
          <Text  className="font-bold">Amount</Text>
        </View>
        {budget?.expense.map((expense)=>(
          <View className="flex flex-row justify-evenly">
            <Text>{expense?.category}</Text>
            <Text>{expense?.amount}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default viewBudget;
