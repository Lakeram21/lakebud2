import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert } from "react-native";
import React, { useState } from "react";
import { router, Link} from "expo-router";
import {signInUser, signup} from "../API/Authentication"
const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async() => {
    // Handle signup logic here
    const userObject = {
      firstName,
      lastName,
      email,
      password,
    }
    const newUser =  await signup(userObject)
    console.log(newUser)
    if(newUser?.["sucess"]){
      router.push("/login")
    }
    else{
      Alert.alert(
        "Failed",
        `unable to create User: ${newUser}`
      )
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 justify-center items-center">
        <View className="w-11/12 bg-white p-6 rounded-lg shadow-md">
          <Text className="text-2xl mb-4 text-center">Sign Up</Text>
          <TextInput
            className="border border-gray-300 px-4 py-2 mb-4 rounded-md"
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            className="border border-gray-300 px-4 py-2 mb-4 rounded-md"
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            className="border border-gray-300 px-4 py-2 mb-4 rounded-md"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            className="border border-gray-300 px-4 py-2 mb-4 rounded-md"
            placeholder="Password (at least 8 characters)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
          <TouchableOpacity
            className="bg-blue-500 px-4 py-2 rounded-md mb-4"
            onPress={handleSignup}
          >
            <Text className="text-white text-center">Sign Up</Text>
          </TouchableOpacity>
        </View>
        <Link href="/login">Link to tab</Link>
      </View>
    </SafeAreaView>
  );
};

export default Signup;
