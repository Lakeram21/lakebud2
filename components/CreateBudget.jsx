import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Button } from "react-native";

const CreateBudget = () => {
  const [savings, setSavings] = useState("");
  const [totalIncome, setTotalIncome] = useState("");
  const [incomes, setIncomes] = useState([]);
  const [income, setIncome] = useState("");
  const [incomeCategory, setIncomeCategory] = useState("");
  
  const [expenses, setExpenses] = useState([]);
  const [expenseCategory, setExpenseCategory] = useState("");
  const [expense, setExpense] = useState("")

  const [incomeModalVisible, setIncomeModalVisible] = useState(false);
  const [expenseModalVisible, setExpenseModalVisible] = useState(false);
  const [savingsModalVisible, setSavingsModalVisible] = useState(false);

  const addIncome = () => {
    if (incomeCategory.trim() !== "" && income.trim() !== "") {
      const newIncome = { incomeCategory, income };
      setIncomes([...incomes, newIncome]);
      setIncome("");
      setIncomeCategory("");
      setIncomeModalVisible(false);
    }
  };

  const addExpense = () => {
    if (expenseCategory.trim() !== "" && expense.trim() !== "") {
      const newExpense = { expenseCategory, expense };
      setExpenses([...expenses, newExpense]);
      setExpense("");
      setExpenseCategory("");
      setExpenseModalVisible(false);
    }
  };

  const addSavings = () => {
    if (savings.trim() !== "") {
      const total = incomes.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
      setTotalIncome(total + parseFloat(savings));
      setSavings("");
      setSavingsModalVisible(false);
    }
  };

  return (
    <View className="p-4">
      <Text className="text-2xl font-bold mb-4">Budget</Text>
      <View className="bg-gray-100 rounded-lg p-4 flex-row justify-between">
        <View>
            <Text className="text-lg font-semibold mb-2">Budget Summary</Text>
            <Text>Total Income: ${incomes.reduce((acc, curr) => acc + parseFloat(curr.income), 0)}</Text>
            <Text>Total Expenses: ${expenses.reduce((acc, curr) => acc + parseFloat(curr.expense), 0)}</Text>
            <Text>Remaining Budget: ${incomes.reduce((acc, curr) => acc + parseFloat(curr.income), 0) - expenses.reduce((acc, curr) => acc + parseFloat(curr.expense), 0)}</Text>
        </View>
        <View className="mt-2 bg-blue-100 rounded-lg p-2">
            <TouchableOpacity
            className="text-center"
            >
                <Text className="text-2xl text-blue font-bold">Create Budget</Text>
            </TouchableOpacity>
        </View>
      </View>
      <View className="bg-gray-100 rounded-lg p-4 mt-4">
        <Text className="text-lg font-semibold mb-2">Added Expenses</Text>
        {expenses.map((expense, index) => (
          <View key={index} className="flex flex-row justify-between border-b border-gray-300">
            <Text>{expense.expenseCategory}</Text>
            <Text>${expense.expense}</Text>
          </View>
        ))}
      </View>
      <View className="bg-gray-100 rounded-lg p-4 mt-4">
        <TouchableOpacity
          className="h-10 bg-blue-500 rounded items-center justify-center"
          onPress={() => setIncomeModalVisible(true)}
        >
          <Text className="text-white">Add Income</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="h-10 bg-blue-500 rounded items-center justify-center mt-2"
          onPress={() => setExpenseModalVisible(true)}
        >
          <Text className="text-white">Add Expense</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="h-10 bg-blue-500 rounded items-center justify-center mt-2"
          onPress={() => setSavingsModalVisible(true)}
        >
          <Text className="text-white">Add Savings</Text>
        </TouchableOpacity>
      </View>
      {/* Income Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={incomeModalVisible}
        onRequestClose={() => setIncomeModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <View style={{ backgroundColor: "#ffc", padding: 20, borderRadius: 10, width: "80%" }}>
            <TextInput
              style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, backgroundColor:"gray" }}
              placeholder="Enter income category"
              onChangeText={text => setIncomeCategory(text)}
              value={incomeCategory}
            />
            <TextInput
              style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
              placeholder="Enter income amount"
              onChangeText={text => setIncome(text)}
              value={income}
            />
            <Button title="Add Income" onPress={addIncome} />
            <Button title="Close" onPress={() => setIncomeModalVisible(false)} />
          </View>
        </View>
      </Modal>
      {/* Expense Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={expenseModalVisible}
        onRequestClose={() => setExpenseModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10, width: "80%" }}>
            <TextInput
              style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
              placeholder="Enter expense category"
              onChangeText={text => setExpenseCategory(text)}
              value={expenseCategory}
            />
            <TextInput
              style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
              placeholder="Enter expense amount"
              onChangeText={text => setExpense(text)}
              value={expense}
            />
            <Button title="Add Expense" onPress={addExpense} />
            <Button title="Close" onPress={() => setExpenseModalVisible(false)} />
          </View>
        </View>
      </Modal>
      {/* Savings Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={savingsModalVisible}
        onRequestClose={() => setSavingsModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10, width: "80%" }}>
            <TextInput
              style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
              placeholder="Enter savings amount"
              onChangeText={text => setSavings(text)}
              value={savings}
            />
            <Button title="Add Savings" onPress={addSavings} />
            <Button title="Close" onPress={() => setSavingsModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CreateBudget;
