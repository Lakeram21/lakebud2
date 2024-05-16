import { View, Text, Alert, FlatList, TouchableOpacity} from "react-native";
import React, { useEffect, useState, useCallback} from "react";
import { getAllBudgets } from "../API/budget";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, Link, router} from "expo-router";

const BudgetList = () => {
  const [allBudgets, setAllBudgets] = useState(null);
  const fetchData = async () => {
      try {
        const res = await getAllBudgets();
        if (res.success) {
          setAllBudgets(res.success);
        } else {
          Alert.alert("Failed to get all Budgets. Check Network");
        }
      } catch (error) {
        Alert.alert("Failed to get all Budgets. Check Network");
      }
    };
 
    useFocusEffect(
        React.useCallback(() => {
          fetchData()
    
          return () => {
            console.log('Screen is unfocused');
          };
        }, [])
      );
  

  return (
    
    <FlatList 
        data={allBudgets} 
        keyExtractor={(item) => item.id.toString()} 
        renderItem={({ item }) => (
          <TouchableOpacity onPress={()=>router.push({pathname:"/viewBudget", params:{id:item.id}})}>
          <View className="flex-row border border-gray-300 gap-2 mt-4 justify-between bg-red-200">
            <Text className="p-4">{item.name}</Text>
           
       
          </View>
          </TouchableOpacity>
         
        )}
/>


  
  );
};

export default BudgetList;
