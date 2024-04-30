import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import {Link, Redirect} from "expo-router"
import GlobalProvider, { useGlobalContext } from "../context/GlobalProvider"

// import { SafeAreaView } from 'react-native-safe-area-context';
export default function App() {
  const {isLoading, isLogIn} = useGlobalContext()
  console.log(isLoading, isLogIn)

   if(!isLoading && isLogIn) return <Redirect href='/dashboard'/>
  return (

    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-3xl">Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
      <Link href="/login">Login</Link>
    </View>

   
  );
}

