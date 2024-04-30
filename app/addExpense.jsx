import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { router } from "expo-router";

const AddExpense = () => {
  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [category, setCategory] = useState("Food");

  const handleSubmit = () => {
    // Handle form submission here
    console.log("Submitted:", { item, amount, merchant, category });
    // You can add further processing here, such as sending data to a server
    router.push("/home")
  };

  return (
    <View className="flex-1 justify-center items-center bg-black">
      <View className="bg-white p-8 rounded-lg w-4/5">
        <Text className=" text-xl mb-4">Add Expense</Text>
        <View className="mb-4">
          <Text className="text-orange-500 mb-2">Item:</Text>
          <TextInput
            className="h-10 bg-gray-100 rounded p-2"
            onChangeText={text => setItem(text)}
            value={item}
          />
        </View>
        <View className="mb-4">
          <Text className="text-orange-500 mb-2">Amount:</Text>
          <TextInput
            className="h-10 bg-gray-100 rounded p-2"
            onChangeText={text => setAmount(text)}
            value={amount}
            keyboardType="numeric"
          />
        </View>
        <View className="mb-4">
          <Text className="text-orange-500 mb-2">Merchant:</Text>
          <TextInput
            className="h-10 bg-gray-100 rounded p-2"
            onChangeText={text => setMerchant(text)}
            value={merchant}
          />
        </View>
        <View className="mb-4">
          <Text className="text-orange-500 mb-2">Category:</Text>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
            className="bg-gray-100 rounded"
          >
            <Picker.Item label="Food" value="Food" />
            <Picker.Item label="Clothing" value="Clothing" />
            <Picker.Item label="Electronics" value="Electronics" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>
        <Button title="Submit" onPress={handleSubmit} color="#FFA500" />
      </View>
    </View>
  );
};

export default AddExpense;
