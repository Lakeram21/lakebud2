import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Button, Alert, KeyboardAvoidingView} from "react-native";
import uuid from 'react-native-uuid'
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker"
import {createBudget,updateBudget, getBudgetById} from "../../API/budget"
import {createExpense, getActualExpense, updateExpense} from "../../API/expense"
import {router} from "expo-router"
import {useLocalSearchParams, useFocusEffect} from "expo-router"

const CreateBudget = () => {

  // These are for creating a budget from a template
  const params = useLocalSearchParams()


  // These are for modifying the current Budget
  const [editMode, seteditMode] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null)
  const [editingActualBudget, setEditingActualBudget] = useState(null)

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

  // Create Budget Handler used for new Budget creation and creation from template
  const createBudgetHandler = async()=>{
    const unbudgetedAmount = incomes.reduce((acc, curr) => acc + parseFloat(curr.amount), 0) - expenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0) - savings.reduce((acc, curr) => acc + parseFloat(curr.amount), 0)
    
    // Set the rest of the unbudgeted to savings
    const id = uuid.v4()
    let category = "Unbudgeted"
    let amount = unbudgetedAmount
    const newSaving = { category, amount, id};
    
    let _savings = [...savings, newSaving];
    console.log(_savings)
    if(isFormValid){
      const budgetObject = {
        incomes,
        expenses,
        savings: _savings,
        startDate,
        endDate,
        budgetName,
        status:"pending"
      }
      console.log(budgetObject)
      try{
        const result = await createBudget(budgetObject)
        console.log(result)
        // We create the actual spending with the budget so that we can keep track 
        // from the start
        const newBudgetId = result.success.id
        const additionalproperties = {
          items:[]
        }
        const outSideExpense = {
          outSideExpenses:[]
        }

        let modifiedExpenses = expenses.map(expense=>{
          expense["Remaining"] = expense.amount
          const modifiedExpense = {...expense, ...additionalproperties}
          return modifiedExpense

        })
        modifiedExpenses = [...modifiedExpenses, outSideExpense]

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

  // This handles the edit functionality of a budget and the actual budget
  const editBudgetHandler = async()=>{
    try {
      console.log("editing budget")
      const unbudgetedAmount = incomes.reduce((acc, curr) => acc + parseFloat(curr.amount), 0) - expenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0) - savings.reduce((acc, curr) => acc + parseFloat(curr.amount), 0)
      
        // Set the rest of the unbudgeted to savings
      const id = uuid.v4()
      let category = "Unbudgeted"
      let amount = unbudgetedAmount
      const newSaving = { category, amount, id};
      
      let _savings = [...savings, newSaving];
      console.log(_savings)

      if(isFormValid){
        const budgetObject = {
          incomes,
          expense:expenses,
          savings: _savings,
          startDate,
          endDate,
          name:budgetName,
          status: editingBudget?.status,
          unbudgetedAmount: unbudgetedAmount
        }

        const result = await updateBudget(params?.id, budgetObject)

        if(result?.success){

          // Setting the values inside the actual budget
          // since the budget changes, the actual budget needs the updated values
          let modifiedExpenses = expenses.map(expense=>{
            // check if there are new expense
            let editingActualBudgetExpenses = editingActualBudget?.expense

            let actualExpense = editingActualBudgetExpenses?.find((actual)=>{
              // These will always have the items array
              if(actual.id === expense.id){

                actual.amount = expense.amount,
                actual.category = expense.category
                
                let _spent = 0
                actual.items?.map((item)=>{
                  _spent = _spent + parseFloat(item.amount)
                })

                let _remaining = expense.amount - _spent
                actual.Remaining = _remaining
                return actual
              }
              
            })
            if(actualExpense){
              return actualExpense
            }
            
            // the additionalproperties to the newly added expenses 
            const additionalproperties = {
              items:[]
            }
            expense['Remaining'] = expense.amount
            let _modifiedExpense = {...expense, ...additionalproperties }
            return _modifiedExpense
            
          })
          
          let _outsideExpense = editingActualBudget?.expense.find(expense=>expense.outSideExpenses)
          console.log("outside expnse: ",_outsideExpense)
          // Add the outside expenses
          if(_outsideExpense){
          modifiedExpenses.push(_outsideExpense)
          }
          console.log
          const updatedActualExpenseObject ={
            startDate,
            endDate,
            savings,
            budgetName,
            incomes,
            expense: modifiedExpenses,
            unbudgetedAmount: unbudgetedAmount,
          }

          console.log(updatedActualExpenseObject)
          const result = await updateExpense(editingActualBudget?.id, updatedActualExpenseObject)
          if(result?.success)
          {
            Alert.alert("Success", "Budget has been adjusted. Please check your actual expense. Because these will be adjusted also.")
            setCreateBudgetModalVisible(false)
            router.push("/budget")
          }
          else
          {
            Alert.alert("Fail", "Fail to update budget. Check Network and try again.")
          }
        }
        else
        {
          Alert.alert("Fail", "Fail to update budget. Check Network and try again.")
        }

      }
    } catch (err) 
    {
      Alert.alert("Fail", "Fail to update budget. Check Network and try again.")
    }
    finally{
      setCreateBudgetModalVisible(false)
    }
   
  }


  const editItem = (operation)=>{
    let type = editType
    const targetArray = type === "expense" ? expenses :
                        type === "income" ? incomes :
                        type === "saving" ? savings : [];
    if (operation === "edit") {
      
      targetArray.forEach(item => {
        if (item.id === editId) {
          item.amount = editAmount;
          item.category = editCategory;
        }
      });
    }
    else if (operation === "remove") {
        const newArray = targetArray.filter(item => item.id !== editId);
        if(type === "expense"){
          setExpenses(newArray)
        }
        else if(type === "income"){
          setIncomes(newArray)
        }
        else if(type === "saving"){
          setSavings(newArray)
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


  // This is used to fill up the template if the budget is created based on a template
  // useFocusEffect(
  //       React.useCallback(() => {
  //         if(params.id){
            
  //           getBudgetById(params.id)
  //           .then((res)=>{
  //             // And we just need to set the expense, income and savings
  //             // everything else will be set for the new budget
  //             // we do have unique ids in the expense that will be used back but
  //             // because they are contained within the budget, we shoud be good
  //             setExpenses(res.expense)
  //             setIncomes(res.incomes)
  //             setSavings(res.savings)
  //             if(params.mode == 'edit'){
  //                 console.log("Editing mode")
  //                 // Set the Budget that is being edited
  //                 setEditingBudget(res)
  //                 seteditMode(true)
  //                 setBudgetName(res.name)
                 
  //                 let start = res.startDate
  //                 let _startDate = new Date(start.seconds * 1000)
  //                 setstartDate(_startDate)
  //                 let end = res.endDate
  //                 let _endDate = new Date(end.seconds *1000)
  //                 setEndDate(_endDate)

  //                 // Get actual Budget whene the expenses are stored
  //                 getActualExpense(params?.id)
  //                 .then((res)=>{
  //                   setEditingActualBudget(res)
  //                 }).catch((err)=>{
  //                   console.log(err)
  //                 })

  //             }
  //             else{
  //               console.log("Creating mode")
  //               setEditingBudget(null)
  //               seteditMode(false)
  //               setBudgetName("")

  //             }
  //           }).catch((err)=>{
  //             console.log(err)
  //           })
  //         }
  //         else
  //         {
  //           seteditMode(false)
  //           setEditingActualBudget(null)
  //           setEditingBudget(null)
  //           setErrors({})
  //           setIsFormValid(false)

  //           setEditCategory(null)
  //           setEditAmount(null)
  //           setEditId(null)
  //           setEditType(null)

  //           setIncomes([])
  //           setExpenses([])
  //           setSavings([])

  //           setBudgetName("")
  //           setEndDate(new Date())
  //           setstartDate(new Date())
  //         }
  //         return () => {
  //           console.log('Screen is unfocused');
  //         };
  //       }, [params?.id, editMode])
  //     );
  
  
  useFocusEffect(
  React.useCallback(() => {
    if (params.id) {
      getBudgetById(params.id)
        .then((res) => {
          setExpenses(res.expense);
          setIncomes(res.incomes);
          setSavings(res.savings);

          if (params.mode === 'edit') {
            console.log("Editing mode");
            setEditingBudget(res);
            seteditMode(true);
            setBudgetName(res.name);

            const startDate = new Date(res.startDate.seconds * 1000);
            setstartDate(startDate);
            const endDate = new Date(res.endDate.seconds * 1000);
            setEndDate(endDate);

            getActualExpense(params.id)
              .then((res) => {
                setEditingActualBudget(res);
              })
              .catch((err) => {
                console.log(err);
              });

          } else {
            console.log("Creating mode");
            setEditingBudget(null);
            seteditMode(false);
            setBudgetName("");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      seteditMode(false);
      setEditingActualBudget(null);
      setEditingBudget(null);
      setErrors({});
      setIsFormValid(false);

      setEditCategory(null);
      setEditAmount(null);
      setEditId(null);
      setEditType(null);

      setIncomes([]);
      setExpenses([]);
      setSavings([]);

      setBudgetName("");
      setEndDate(new Date());
      setstartDate(new Date());
    }

    return () => {
      console.log('Screen is unfocused');
    };
  }, [params?.id, params?.mode]) // Make sure the dependency list is correct
);
  
  return (
    <KeyboardAvoidingView>
      <SafeAreaView>
        <View className="p-4 gap-2">
          <View className="justify-between mb-2 border border-green-400 bg-green-200 rounded-md">
            <Text className="text-lg text-green-900 font-semibold bg-green-400 px-1">Budget Summary</Text>
            <View className="flex-shrink p-2">
                <Text><Text className="font-semibold text-green-800">Total Income:</Text> ${incomes.reduce((acc, curr) => acc + parseFloat(curr.amount), 0)}</Text>
                <Text><Text className="font-semibold text-green-800" >Total Expenses:</Text> ${expenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0)}</Text>
                <Text><Text className="font-semibold text-green-800">Remaining Budget:</Text> ${
                incomes.reduce((acc, curr) => acc + parseFloat(curr.amount), 0) - expenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0) - savings.reduce((acc, curr) => acc + parseFloat(curr.amount), 0)
                }</Text>
            </View>
          </View>

          <View className="flex-row justify-between rounded-md">
           <TouchableOpacity className="px-2 border bg-green-300 border-green-500 shadow-sm shadow-green-400 rounded-md  items-center justify-center"                
                  onPress={() => setCreateBudgetModalVisible(true)}
                >
                  {
                    editMode ? <Text className="text-green-900 text-xl text-blue font-bold">Modify Budget</Text>:<Text className="text-green-900 text-xl text-blue font-bold">Create Budget</Text>
                  }
                    
            </TouchableOpacity>
            <View className=" gap-1 rounded-md">
                   <TouchableOpacity
                      className="py-2 px-8 bg-green-300 border border-green-500 rounded items-center justify-center shadow-sm shadow-green-400"
                      onPress={() => setIncomeModalVisible(true)}
                    >
                      <Text className="text-green-900 font-semibold">Add Income</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="py-2 bg-green-300 border border-green-500 rounded items-center justify-center shadow-sm shadow-green-400"
                      onPress={() => setExpenseModalVisible(true)}
                    >
                      <Text className="text-green-900 font-semibold">Add Expense</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="py-2 bg-green-300 border border-green-500 rounded items-center justify-center shadow-sm shadow-green-400"
                      onPress={() => setSavingsModalVisible(true)}
                    >
                      <Text className="text-green-900 font-semibold">Add Savings</Text>
                    </TouchableOpacity>
            </View>
          </View>

       
          <View className="border-b border-green-400 bg-green-100 p-4">
              <Text className="text-green-800 text-left mb-4 font-semibold">Savings</Text>
              <ScrollView>
                  {savings.map((saving, index) => (
                  <TouchableOpacity
                  onPress={()=>popluateEditForm(saving, "saving")}
                    key={index}
                  ><View key={index} className="flex flex-row justify-between border-b border-gray-300 p-2">
                      <Text>{saving.category}</Text>
                      <Text>${saving.amount}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
          </View>

          <View className="border-b border-green-400 bg-green-100 p-4">
            <Text className="text-left text-green-800 mb-4 font-semibold">Income</Text>
            <ScrollView>
                {incomes.map((income, index) => (
                  <TouchableOpacity 
                    onPress={()=>popluateEditForm(income, "income")}
                    key={index}
                  >
                    <View key={index} className="flex flex-row justify-between border-b border-gray-300 p-2">
                      <Text>{income.category}</Text>
                      <Text>${income.amount}</Text>
                    </View>
                  </TouchableOpacity>
                
                ))} 
            </ScrollView>
          </View>

          <View className="border-b border-green-400 bg-green-100 p-4">
            <Text className="text-left text-green-800 mb-4 font-semibold">Expenses</Text>
            <ScrollView>
              {expenses.map((expense, index) => (
                <TouchableOpacity
                  onPress={()=>popluateEditForm(expense, "expense")}
                  key={index}
                >
                  <View key={index} className="flex flex-row justify-between border-b border-gray-300 p-2">
                    <Text>{expense.category}</Text>
                    <Text>${expense.amount}</Text>
                  </View>
                </TouchableOpacity> 
              ))}
            </ScrollView>
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

                <Button title={editMode?"Update Budget":"Create Budget"} onPress={()=>{
                  if(editMode){
                    editBudgetHandler()
                  }
                  else{
                    createBudgetHandler()
                  }
                }} />
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
                  <Button title="Remove" onPress={() =>editItem("remove")} />
                  <Button title="Close" onPress={() => setEditModalVisible(false)} />
                </View>
                
              </View>
            </View>
          </Modal>

        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default CreateBudget;
