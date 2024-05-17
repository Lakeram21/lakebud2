import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import React, { useEffect, useState, useCallback} from "react";
import {useLocalSearchParams, useFocusEffect, router} from "expo-router"
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
  console.log(params, params.id)

  const setAsCurrentBudgetHandler = async()=>{
    try{
        let status = "Active"
        // Check if this is the same budget as the current
        const currentBudget = await getCurrentBudget("Active")
        if(currentBudget?.id !== budget?.id){
          const result = await updateBudget(budget?.id, {status:status} )
          // set the previous active to pending
          const result2 = await updateBudget(currentBudget?.id, {status:"pending"} )
          if(result["success"]){
            console.log("success")
            Alert.alert("Success", "All expense entered will now be added to this budget")
          }
          else{
            console.log("Fail")
          }
        }
        else{
          Alert.alert("Note", "This has already been as your Current Budget")
          console.log("Already the current budget")
        }
        
    }catch{
      console.log("Fail error")
    }
    
  }

   useFocusEffect(
        React.useCallback(() => {
          if(params.id){
            getBudgetById(params.id)
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
        }, [params.id])
      );
  
  
  return (
    <SafeAreaView>
      <View className="gap-3">
        <Text className="text-center font-bold text-xl">{budget?.name}</Text>
        <View>
          <Text className="text-center">Date: {startDate} to {endDate}</Text>
        </View>

        <View className= "flex flex-row justify-evenly">
          <TouchableOpacity
            onPress={setAsCurrentBudgetHandler}
            className="border rounded-md bg-slate-300 px-2 py-1"
            ><Text className="text-right">Set as Current Budget</Text>
          </TouchableOpacity>
           <TouchableOpacity
            onPress={()=> router.push({pathname:"/createBudget", params:{id:budget?.id}})}
            className="border rounded-md bg-slate-300 px-2 py-1"
          >
            <Text>Create New Budget</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={()=> router.push({pathname:"/createBudget", params:{id:budget?.id, mode:"edit"}})}
            className="border rounded-md bg-slate-300 px-2 py-1"
          >
            <Text>Modify</Text>
          </TouchableOpacity>
         
        </View>

        <View>
          <Text className="text-left font-bold text-lg">Savings</Text>
          <View className="flex flex-row justify-evenly">
            <Text className="font-bold">Category</Text>
            <Text  className="font-bold">Amount</Text>
          </View>
          <ScrollView>
            {budget?.savings.map((expense, index)=>(
                  <View className="flex flex-row justify-evenly"  key={index}>
                    <Text>{expense?.category}</Text>
                    <Text>{expense?.amount}</Text>
                  </View>
            ))}   
          </ScrollView>
        </View>

        <View>
          <Text className="text-left font-bold text-lg" >Incomes</Text>
          <View className="flex flex-row justify-evenly">
            <Text className="font-bold">Category</Text>
            <Text className="font-bold">Amount</Text>
          </View>
          <ScrollView>
            {budget?.incomes.map((income, index)=>(
                <View className="flex flex-row justify-evenly" key={index} >
                  <Text>{income?.category}</Text>
                  <Text>{income?.amount}</Text>
                </View>
            ))} 
          </ScrollView>
        </View>
        
        <View>
          <Text className="text-left font-bold text-lg">Expenses</Text>
          <View className="flex flex-row justify-evenly">
            <Text className="font-bold">Category</Text>
            <Text  className="font-bold">Amount</Text>
          </View>
          <ScrollView >
            {budget?.expense.map((expense, index)=>(
                <View className="flex flex-row justify-evenly"key={index} >
                  <Text>{expense?.category}</Text>
                  <Text>{expense?.amount}</Text>
                </View>
            ))}
          </ScrollView>
        </View>
        
      </View>
    </SafeAreaView>
  );
};

export default viewBudget;
