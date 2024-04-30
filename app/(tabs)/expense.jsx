import React, { useState } from "react";
import { View, Text, TextInput, SafeAreaView, FlatList } from "react-native";
import PieChart from 'react-native-pie-chart';

const Expenses = () => {
  const [searchCategory, setSearchCategory] = useState("");

  // Sample data for the pie chart
  const widthAndHeight = 180;
  const series = [123, 321, 23];
  const sliceColor = ['#EC3440', '#ffb300', '#3f00ff'];
  const data = [
    {
      key: 1,
      amount: 200, // Total amount
      spent: 150, // Amount spent
      color: "#297373", // Color for the slice
    },
    // Add more data as needed
  ];

  // Dummy expenses data
  const expensesData = [
    { id: 1, category: "Food", merchant: "Restaurant A", item: "Lunch", amount: "$10" },
    { id: 2, category: "Clothing", merchant: "Store B", item: "T-shirt", amount: "$20" },
    { id: 3, category: "Electronics", merchant: "Store C", item: "Headphones", amount: "$50" },
    { id: 4, category: "Food", merchant: "Restaurant D", item: "Dinner", amount: "$15" },
    { id: 5, category: "Food", merchant: "Restaurant A", item: "Lunch", amount: "$10" },
    { id: 6, category: "Clothing", merchant: "Store B", item: "T-shirt", amount: "$20" },
    { id: 7, category: "Electronics", merchant: "Store C", item: "Headphones", amount: "$50" },
    { id: 8, category: "Food", merchant: "Restaurant D", item: "Dinner", amount: "$15" },
    { id: 9, category: "Food", merchant: "Restaurant A", item: "Lunch", amount: "$10" },
    { id: 12, category: "Clothing", merchant: "Store B", item: "T-shirt", amount: "$20" },
    { id: 13, category: "Electronics", merchant: "Store C", item: "Headphones", amount: "$50" },
    { id: 14, category: "Food", merchant: "Restaurant D", item: "Dinner", amount: "$15" },
    { id:15, category: "Food", merchant: "Restaurant A", item: "Lunch", amount: "$10" },
    { id: 16, category: "Clothing", merchant: "Store B", item: "T-shirt", amount: "$20" },
    { id: 17, category: "Electronics", merchant: "Store C", item: "Headphones", amount: "$50" },
    { id: 18, category: "Food", merchant: "Restaurant D", item: "Dinner", amount: "$15" },
  ];

  const filteredExpenses = expensesData.filter(
    expense => expense.category.toLowerCase().includes(searchCategory.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex flex-row bg-zinc-400 rounded-bl-3xl rounded-br-3xl">
        {/* Pie Chart */}
        <View className="flex-1 p-4">
          <PieChart
            widthAndHeight={widthAndHeight}
            series={series}
            sliceColor={sliceColor}
            coverRadius={0.45}
            coverFill={'#FFF'}
          />
        </View>
        {/* Expenses Information */}
        <View className="flex-1 p-4">
          <Text className="text-white mb-2">Rent: $20</Text>
          <Text className="text-white mb-2">Groceries: $405</Text>
          <Text className="text-white mb-2">Utilities: $240</Text>
          <Text className="text-white mb-2">Outside: $45</Text>
        </View>
      </View>

      {/* Expenses List */}
      <View className="bg-black p-4 flex-1 ">
        <Text className="text-white text-2xl mb-4">Expenses</Text>
        <TextInput
          className="h-10 bg-gray-100 rounded p-2 mb-4"
          placeholder="Search by Category"
          onChangeText={text => setSearchCategory(text)}
          value={searchCategory}
        />
        <View className="bg-white rounded-lg overflow-hidden flex-1">
          {/* Table Header */}
          <View className="flex flex-row bg-orange-500 p-4">
            <Text className="flex-1 text-white text-center">Category</Text>
            <Text className="flex-1 text-white text-center">Merchant</Text>
            <Text className="flex-1 text-white text-center">Item</Text>
            <Text className="flex-1 text-white text-center">Amount</Text>
          </View>
          {/* Table Body */}
          <FlatList
            data={filteredExpenses}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <View className="flex flex-row border-b border-gray-300">
                <Text className="flex-1 p-4">{item.category}</Text>
                <Text className="flex-1 p-4">{item.merchant}</Text>
                <Text className="flex-1 p-4">{item.item}</Text>
                <Text className="flex-1 p-4">{item.amount}</Text>
              </View>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Expenses;
