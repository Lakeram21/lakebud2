import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Button } from "react-native";

const CreateBudget = () => {

  const [savings, setSavings] = useState([]);
  const [saving, setSaving] = useState("");
  const [savingCategory, setSavingCategory] = useState("");

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
   if (savingCategory.trim() !== "" && saving.trim() !== "") {
      const newSaving = { savingCategory, saving };
      setSavings([...savings, newSaving]);
      setSaving("");
      setSavingCategory("");
      setSavingsModalVisible(false);
    }
  };

  const createBudget = ()=>{
    const budgetObject = {
      incomes,
      expenses,
      savings,
    }
    console.log(budgetObject)
  }

  const editItem = (item, type)=>{
    console.log(item, type)
  }

  return (
    <View className="p-4">
      <Text className="text-2xl font-bold mb-4">Budget</Text>
      <View className="bg-gray-100 rounded-lg p-4 justify-between">
        <View>
            <Text className="text-lg font-semibold mb-2">Budget Summary</Text>
            <Text>Total Income: ${incomes.reduce((acc, curr) => acc + parseFloat(curr.income), 0)}</Text>
            <Text>Total Expenses: ${expenses.reduce((acc, curr) => acc + parseFloat(curr.expense), 0)}</Text>
            <Text>Remaining Budget: ${incomes.reduce((acc, curr) => acc + parseFloat(curr.income), 0) - expenses.reduce((acc, curr) => acc + parseFloat(curr.expense), 0)}</Text>
        </View>
        <View className="mt-2 bg-blue-100 rounded-lg p-2">
            <TouchableOpacity
              className="text-center"
              onPress={() => createBudget()}
            >
                <Text className="text-2xl text-blue font-bold">Create Budget</Text>
            </TouchableOpacity>
        </View>
        <View className="flex-row justify-between">
          <TouchableOpacity
            className="h-10 bg-blue-500 rounded items-center justify-center"
            onPress={() => setIncomeModalVisible(true)}
          >
            <Text className="text-white">Add Income</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="h-10 bg-blue-500 rounded items-center justify-center"
            onPress={() => setExpenseModalVisible(true)}
          >
            <Text className="text-white">Add Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="h-10 bg-blue-500 rounded items-center justify-center"
            onPress={() => setSavingsModalVisible(true)}
          >
            <Text className="text-white">Add Savings</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="bg-gray-100 rounded-lg p-4 mt-4">
        <Text className="text-lg font-semibold mb-2">Income</Text>
         {incomes.map((income, index) => (
          <View key={index} className="flex flex-row justify-between border-b border-gray-300">
            <Text>{income.incomeCategory}</Text>
            <Text>${income.income}</Text>
          </View>
        ))}
        
        <Text className="text-lg font-semibold mb-2">Expenses</Text>
        {expenses.map((expense, index) => (
          <TouchableOpacity
            onPress={()=>editItem(expense)}
            key={index}
          >
            <View key={index} className="flex flex-row justify-between border-b border-gray-300">
              <Text>{expense.expenseCategory}</Text>
              <Text>${expense.expense}</Text>
            </View>
          </TouchableOpacity> 
        ))} 
        
      </View>
      
      {/* Income Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={incomeModalVisible}
        onRequestClose={() => setIncomeModalVisible(false)}
      >
        <View className="flex flex-1 justify-center items-center">
          <View className="bg-gray-300 p-4 rounded-lg w-4/5">
            <TextInput
              className="border border-gray-600 mb-4 p-2 rounded"
              placeholder="Enter income category"
              onChangeText={text => setIncomeCategory(text)}
              value={incomeCategory}
            />
            <TextInput
              className="border border-gray-600 mb-4 p-2 rounded"
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
        <View className="flex flex-1 justify-center items-center">
          <View className="bg-gray-300 p-4 rounded-lg w-4/5">
            <TextInput
              className="border border-gray-600 mb-4 p-2 rounded"
              placeholder="Enter expense category"
              onChangeText={text => setExpenseCategory(text)}
              value={expenseCategory}
            />
            <TextInput
              className="border border-gray-600 mb-4 p-2 rounded"
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
        <View className="flex flex-1 justify-center items-center">
          <View className="bg-gray-300 p-4 rounded-lg w-4/5">
            <TextInput
              className="border border-gray-600 mb-4 p-2 rounded"
              placeholder="Enter Saving Category"
              onChangeText={text => setSavingCategory(text)}
              value={savingCategory}
            />
            <TextInput
              className="border border-gray-600 mb-4 p-2 rounded"
              placeholder="Enter Saving amount"
              onChangeText={text => setSaving(text)}
              value={saving}
            />
            <Button title="Add Saving" onPress={addSavings} />
            <Button title="Close" onPress={() => setSavingsModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CreateBudget;
