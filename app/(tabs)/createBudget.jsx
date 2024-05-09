import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Button, Alert} from "react-native";
import uuid from 'react-native-uuid'
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker"
import {createBudget} from "../../API/budget"
import {createExpense} from "../../API/expense"
import {router} from "expo-router"

const CreateBudget = () => {
  const [totalIncome, setTotalIncome] = useState("");

  // budget varibles
  const [errors, setErrors] = useState({});
  const [formErrorMessage, setFormErrorMessage] = useState("")
  const [isFormValid, setIsFormValid] = useState(false);

  // Edit Item
  const [editCategory, setEditCategory] = useState(null)
  const [editAmount, setEditAmount] = useState(null)
  const [editId, setEditId] = useState(null)
  const [editType, setEditType] = useState(null)



  // Form Data
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [savings, setSavings] = useState([]);

  const [budgetName, setBudgetName] = useState("")
  const [endDate, setEndDate] = useState(new Date());
  const [startDate, setstartDate] = useState(new Date());

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  
  const [incomeModalVisible, setIncomeModalVisible] = useState(false);
  const [expenseModalVisible, setExpenseModalVisible] = useState(false);
  const [savingsModalVisible, setSavingsModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  
  const [creatBudgetModalVisible, setCreateBudgetModalVisible] = useState(false)
  
  const addIncome = () => {
    if (category.trim() !== "" && amount.trim() !== "") {
      const id = uuid.v4()
      const newIncome = { category, amount, id };
      setIncomes([...incomes, newIncome]);

      setAmount("");
      setCategory("");

      setIncomeModalVisible(false);
    }
    else{
      Alert.alert("Invalid", "You need both a Catgory and Amount")
    }
  };

  const addExpense = () => {
    if (category.trim() !== "" && amount.trim() !== "") {
      const id = uuid.v4()
      const newExpense = { category, amount, id};
      setExpenses([...expenses, newExpense]);

      setAmount("");
      setCategory("");

      setExpenseModalVisible(false);
    }
    else{
      Alert.alert("Invalid", "You need both a Catgory and Amount")
    }
  };

  const addSavings = () => {
   if (category.trim() !== "" && amount.trim() !== "") {
      const id = uuid.v4()
      const newSaving = { category, amount, id};
      setSavings([...savings, newSaving]);

      setAmount("");
      setCategory("");

      setSavingsModalVisible(false);
    }
    else{
      Alert.alert("Invalid", "You need both a category and amount")
    }
  };

  const validateData = ()=>{
    let errors = {}
    if(!budgetName.trim() || budgetName.trim() == ""){
      errors.budgetName = "Budget must have a Name"
    }
    if(incomes.length === 0){
      errors.income = "You need an Income in a budget"
    }
    if(expenses.length === 0){
      errors.expense = "You need an expense in a budget"
    }
    if(!startDate){
      errors.startDate = "You need an start date for the budget"
    }
    if(!endDate){
      errors.startDate = "You need an end date for the budget"
    }
    setErrors(errors)
    setIsFormValid(Object.keys(errors).length === 0)
  }
  const createBudgetHandler = async()=>{
    const unbudgetedAmount = incomes.reduce((acc, curr) => acc + parseFloat(curr.amount), 0) - expenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0) - savings.reduce((acc, curr) => acc + parseFloat(curr.amount), 0)
  
    if(isFormValid){
      const budgetObject = {
        incomes,
        expenses,
        savings,
        startDate,
        endDate,
        budgetName,
        status:"pending",
        unbudgetedAmount: unbudgetedAmount
      }

      

      try{
        const result = await createBudget(budgetObject)
        // We create the actual spending with the budget so that we can keep track 
        // from the start
        const newBudgetId = result.success.id
        const additionalproperties = {
          items:[
            {
              name:"",
              merchant: "",
              price:""
            }
          ]
        }
        const outSideExpense = {
          outSideExpenses:[
            {
              name:"",
              merchant: "",
              price: ""
            }
          ]
        }

        let modifiedExpenses = expenses.map(expense=>{
          const modifiedExpense = {...expense, ...additionalproperties, ...outSideExpense}
          return modifiedExpense

        })

        const actualExpenseObject ={
          startDate,
          endDate,
          savings,
          budgetName,
          incomes,
          expenses: modifiedExpenses,
          unbudgetedAmount: unbudgetedAmount,
          budgetId: newBudgetId
        }
        console.log(actualExpenseObject)
        
        if(result.success){
          const result = await createExpense(actualExpenseObject)
          Alert.alert("Success", "Your Budget was successfully created!")
          setCreateBudgetModalVisible(false)
          
          setBudgetName("")
          
          // router.push("/budget")
          
        }
        else{
          Alert.alert("Failed", "Your Budget was not created.")
        }
      }
      catch(error){
        console.log(error)
      }
    }
    else{
      let message = ''
      {Object.values(errors).map((error, index) => ( 
                message =  message+" "+error
            ))} 
      Alert.alert("Invalid", message)
    }
    
  }

  const editItem = (operation)=>{
    let type = editType
    if(operation =="edit"){
      if(type == "expense"){
        expenses.map((expense)=>{
          if(expense.id === editId){
            expense.amount = editAmount
            expense.category = editCategory
          }
          return expense
        })
      }
      if(type == "income"){
        incomes.map((income)=>{
          if(income.id === editId){
            income.amount = editAmount
            income.category = editCategory
          }
          return income
        })
      }
      if(type == "saving"){
        savings.map((saving)=>{
          if(saving.id === editId){
            saving.amount = editAmount
            saving.category = editCategory
          }
          return saving
        })
      }
    }
    setEditModalVisible(false)
    console.log(expenses)

  }
  const popluateEditForm = (item, type)=>{
      setEditAmount(item.amount)
      setEditCategory(item.category)
      setEditId(item.id)
      setEditModalVisible(true)
      setEditType(type)
  }

  useEffect(()=>{
    validateData()
  }, [budgetName, incomes, expenses, startDate, endDate])

  return (
    <SafeAreaView>
      
      <View className="p-4">
        <View className="bg-gray-100 rounded-lg p-4 justify-between">
          
          <View>
              <Text className="text-lg font-semibold mb-2">Budget Summary</Text>
              <Text>Total Income: ${incomes.reduce((acc, curr) => acc + parseFloat(curr.amount), 0)}</Text>
              <Text>Total Expenses: ${expenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0)}</Text>
              <Text>Remaining Budget: ${incomes.reduce((acc, curr) => acc + parseFloat(curr.amount), 0) - expenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0) - savings.reduce((acc, curr) => acc + parseFloat(curr.amount), 0)}</Text>
          </View>
          <View className="mt-2 bg-blue-100 rounded-lg p-2">
              <TouchableOpacity
                className="text-center"
                onPress={() => setCreateBudgetModalVisible(true)}
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
          <Text className="text-lg font-semibold mb-2">Savings</Text>
          {savings.map((saving, index) => (
            <TouchableOpacity
             onPress={()=>popluateEditForm(saving, "saving")}
              key={index}
            ><View key={index} className="flex flex-row justify-between border-b border-gray-300">
                <Text>{saving.category}</Text>
                <Text>${saving.amount}</Text>
              </View>
            </TouchableOpacity>
          ))}
          <Text className="text-lg font-semibold mb-2">Income</Text>
          {incomes.map((income, index) => (
            <TouchableOpacity 
              onPress={()=>popluateEditForm(income, "income")}
              key={index}
            >
               <View key={index} className="flex flex-row justify-between border-b border-gray-300">
                <Text>{income.category}</Text>
                <Text>${income.amount}</Text>
              </View>
            </TouchableOpacity>
           
          ))}
          
          <Text className="text-lg font-semibold mb-2">Expenses</Text>
          {expenses.map((expense, index) => (
            <TouchableOpacity
              onPress={()=>popluateEditForm(expense, "expense")}
              key={index}
            >
              <View key={index} className="flex flex-row justify-between border-b border-gray-300">
                <Text>{expense.category}</Text>
                <Text>${expense.amount}</Text>
              </View>
            </TouchableOpacity> 
          ))} 
          
        </View>
        {/* Create Budget model */}
        
         <Modal
          animationType="slide"
          transparent={true}
          visible={creatBudgetModalVisible}
          onRequestClose={() => setCreateBudgetModalVisible(false)}
        >
          <View className="flex flex-1 justify-center items-center">
            <View className="bg-gray-300 p-4 rounded-lg w-4/5">
              <TextInput
                className="border border-gray-600 mb-4 p-2 rounded"
                placeholder="Give your Budget a Name"
                onChangeText={text => setBudgetName(text)}
                value={budgetName}
                placeholderTextColor="gray"
              />
              <Text className="border border-gray-600 mb-4 p-2 rounded">Start Date: <DateTimePicker 
              mode="date" 
              value={startDate} 
              minimumDate={new Date(2000, 0, 1)}
              onChange={(event, selectedDate)=>{
                setstartDate(selectedDate)
              }}
              /></Text>
              <Text className="border border-gray-600 mb-4 p-2 rounded">End Date: <DateTimePicker
              mode="date" 
              value={endDate}  
              minimumDate={new Date(2000, 0, 1)}
              onChange={(event, selectedDate)=>{
                setEndDate(selectedDate);
              }}
              /></Text>

              <Button title="Create Budget" onPress={createBudgetHandler} />
              <Button title="Close" onPress={() => setCreateBudgetModalVisible(false)} />
            </View>
          </View>
        </Modal>
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
                onChangeText={text => setCategory(text)}
                value={category}
              />
              <TextInput
                className="border border-gray-600 mb-4 p-2 rounded"
                placeholder="Enter income amount"
                keyboardType='numeric'
                onChangeText={text => setAmount(text)}
                value={amount}
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
                onChangeText={text => setCategory(text)}
                value={category}
              />
              <TextInput
                className="border border-gray-600 mb-4 p-2 rounded"
                placeholder="Enter expense amount"
                keyboardType='numeric'
                onChangeText={text => setAmount(text)}
                value={amount}
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
                onChangeText={text => setCategory(text)}
                value={category}
              />
              <TextInput
                className="border border-gray-600 mb-4 p-2 rounded"
                placeholder="Enter Saving amount"
                keyboardType='numeric'
                onChangeText={text => setAmount(text)}
                value={amount}
              />
              <Button title="Add Saving" onPress={addSavings} />
              <Button title="Close" onPress={() => setSavingsModalVisible(false)} />
            </View>
          </View>
        </Modal>
        {/* Edit Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={editModalVisible}
          onRequestClose={() => setEditModalVisible(false)}
        >
          <View className="flex flex-1 justify-center items-center">
            <View className="bg-gray-300 p-4 rounded-lg w-4/5">
              <TextInput
                className="border border-gray-600 mb-4 p-2 rounded"
                placeholder="Enter Saving Category"
                onChangeText={text => setEditCategory(text)}
                value={editCategory}
              />
              <TextInput
                className="border border-gray-600 mb-4 p-2 rounded"
                placeholder="Enter Saving amount"
                keyboardType='numeric'
                onChangeText={text => setEditAmount(text)}
                value={editAmount}
              />
              <View className="flex flex-row justify-evenly">
                <Button title="Change" onPress={()=>editItem("edit")}/>
                <Button title="Remove" onPress={() => setEditModalVisible(false)} />
                <Button title="Close" onPress={() => setEditModalVisible(false)} />
              </View>
              
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default CreateBudget;
