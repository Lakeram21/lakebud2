import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { useLocalSearchParams, useFocusEffect, router } from "expo-router";
import { getBudgetById, updateBudget, getCurrentBudget } from "../../API/budget";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatDate } from "../../utils/dateformater";

const ViewBudget = () => {
  const [budget, setBudget] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [currentBudget, setCurrentBudget] = useState(null);

  const params = useLocalSearchParams();

  const setAsCurrentBudgetHandler = async () => {
    try {
      const status = "Active";
      const currentBudget = await getCurrentBudget("Active");
      if (currentBudget?.id !== budget?.id) {
        const result = await updateBudget(budget?.id, { status });
        await updateBudget(currentBudget?.id, { status: "pending" });
        if (result.success) {
          Alert.alert("Success", "All expense entered will now be added to this budget");
        } else {
          console.log("Fail");
        }
      } else {
        Alert.alert("Note", "This is already your current budget");
      }
    } catch {
      console.log("Fail error");
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (params.id) {
        getBudgetById(params.id)
          .then((res) => {
            setBudget(res);
            setEndDate(formatDate(res?.endDate));
            setStartDate(formatDate(res?.startDate));
            setCurrentStatus(res?.status);
          })
          .catch((err) => console.log(err));
      }
      return () => console.log("Screen is unfocused");
    }, [params.id])
  );

  return (
    <SafeAreaView className="flex-1 p-4">
      <View>
        <Text className="text-center text-2xl font-bold">{budget?.name}</Text>
        <Text className="text-center">
          Date: {startDate} to {endDate}
        </Text>

        <View className="flex justify-between gap-2 mt-1">
          <TouchableOpacity
            onPress={setAsCurrentBudgetHandler}
            className="border border-green-400 bg-green-400 p-2 rounded-md"
          >
            <Text className="text-center text-slate-600 font-semibold">Set as Current Budget</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push({ pathname: "/createBudget", params: { id: budget?.id } })}
            className="border border-green-400 bg-green-300 p-2 rounded-md"
          >
            <Text className="text-center text-slate-600 font-semibold">Create New Budget from template</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push({ pathname: "/createBudget", params: { id: budget?.id, mode: "edit" } })}
            className="border border-green-400 bg-green-400 p-2 rounded-md"
          >
            <Text className="text-center text-slate-600 font-semibold">Modify</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-4 bg-green-100 border-green-400 border-b h-30">
          <Text className="text-left text-xl font-bold bg-green-200 px-1 text-green-700">Savings</Text>
         
          <ScrollView className="mt-2">
            {budget?.savings.map((expense, index) => (
              <View className="flex flex-row justify-between mt-2 p-1 border-b border-slate-200" key={index}>
                <Text>{expense?.category}</Text>
                <Text>${expense?.amount}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View className="mt-4 bg-green-100 border-green-400 border-b h-30">
          <Text className="text-left text-xl font-bold bg-green-200 px-1 text-green-700">Incomes</Text>
          {/* <View className="flex flex-row justify-between mt-2 p-1">
            <Text className="font-bold">Category</Text>
            <Text className="font-bold">Amount</Text>
          </View> */}
          <ScrollView className="mt-2">
            {budget?.incomes.map((income, index) => (
              <View className="flex flex-row justify-between mt-2 p-1" key={index}>
                <Text>{income?.category}</Text>
                <Text>${income?.amount}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View className="mt-4 bg-green-100 border-green-400 border-b h-30">
          <Text className="text-left text-xl font-bold bg-green-200 px-1 text-green-700">Expenses</Text>
          
          <ScrollView className="mt-2">
            {budget?.expense.map((expense, index) => (
              <View className="flex flex-row justify-between mt-2 p-1  border-b border-slate-200" key={index}>
                <Text>{expense?.category}</Text>
                <Text>${expense?.amount}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ViewBudget;
