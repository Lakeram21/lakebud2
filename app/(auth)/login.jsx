import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert } from "react-native";
import {auth} from "../../API/config"
import React, { useState } from "react";
import { router } from "expo-router";
import {signInUser} from "../../API/Authentication"
import {getCurrentUser} from "../../API/user"
import { useGlobalContext } from "../../context/GlobalProvider";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUser,   setisLogIn } = useGlobalContext();

  const handleLogin = async () => {
    // Handle login logic here
    console.log("Username:", username);
    console.log("Password:", password);
    const userObject = {
      email:username,
      password
    }
    const signInStatus = await signInUser(userObject)
    console.log("Sign in ststus",signInStatus)
    if(signInStatus?.["sucess"]){
      const result = await getCurrentUser();
      console.log("result", result)
      setUser(result)
      setisLogIn(true)
      router.push("/dashboard")

    }
    else{
      Alert.alert(
        "Failed",
        "Fail to login"
      )
    }
  };

  const handleSignup = () => {
    // Navigate to the signup page
    router.push("/register")
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 justify-center items-center">
        <View className="w-11/12 bg-white p-6 rounded-lg shadow-md">
          <Text className="text-2xl mb-4 text-center">Login</Text>
          <TextInput
            className="border border-gray-300 px-4 py-2 mb-4 rounded-md"
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            className="border border-gray-300 px-4 py-2 mb-4 rounded-md"
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            className="bg-blue-500 px-4 py-2 rounded-md mb-4"
            onPress={handleLogin}
          >
            <Text className="text-white text-center">Login</Text>
          </TouchableOpacity>
          <Text className="text-center">Don't have an account? 
            <Text className="text-blue-500" onPress={handleSignup}> Sign up</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
