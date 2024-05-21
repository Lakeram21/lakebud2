import React, { useEffect, useState } from "react";
import { View, Text, ImageBackground } from "react-native";
import { Tabs } from 'expo-router'; // Assuming this is a custom router component
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook from React Navigation
import { useGlobalContext } from "../../context/GlobalProvider";
import 'react-native-reanimated';
import background from "../../assets/janke-laskowski-jz-ayLjk2nk-unsplash.jpg"; // Correct path to the background image

const TabsLayout = () => {
  const { loading, isLogIn } = useGlobalContext();
  const navigation = useNavigation(); // Hook for accessing navigation object
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null); // Reset error state
    try {
      if (!loading && !isLogIn) {
        navigation.navigate('Login'); // Navigate to the login screen using React Navigation
      }
    } catch (err) {
      console.error("Error in TabsLayout:", err);
      setError(err); // Set error state if an error occurs
    }
  }, [loading, isLogIn, navigation]); // Dependencies include loading, isLogIn, and navigation

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>An error occurred: {error.message}</Text>
        {/* Add additional error handling UI here */}
      </View>
    );
  }

  return (

      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#9BE2CD",
          tabBarInactiveTintColor: '#E9F3F0',
          tabBarStyle: {
            backgroundColor: "#33715E", // Slightly transparent background to show the image
            borderTopWidth: 0.5,
            borderTopColor: "#232533"
          }
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Dashboard",
            headerShown: false,
            tabBarIcon: ({ color, focus }) => (
              <Icon name="home" size={28} color='#FFF' />
            )
          }}
        />
        <Tabs.Screen
          name="stats"
          options={{
            title: "Stats",
            headerShown: false,
            tabBarIcon: ({ color, focus }) => (
              <Icon name="bar-chart" size={28} color='#FFF' />
            )
          }}
        />
        <Tabs.Screen
          name="expense"
          options={{
            title: "Expense",
            headerShown: false,
            tabBarIcon: ({ color, focus }) => (
              <Icon name="dollar" size={28} color='#FFF' />
            )
          }}
        />
        <Tabs.Screen
          name="budget"
          options={{
            title: "Budget",
            headerShown: false,
            tabBarIcon: ({ color, focus }) => (
              <Icon name="money" size={28} color='#FFF' />
            )
          }}
        />
        <Tabs.Screen
          name="createBudget"
          options={{
            title: "CreateBudget",
            headerShown: false,
            tabBarIcon: ({ color, focus }) => (
              <Icon name="money" size={28} color='#FFF' />
            ),
            href: null
          }}
        />
        <Tabs.Screen
          name="viewBudget"
          options={{
            title: "viewbudget",
            headerShown: false,
            href: null
          }}
        />
        <Tabs.Screen
          name="createExpense"
          options={{
            title: "createExpense",
            headerShown: false,
            href: null
          }}
        />
        <Tabs.Screen
          name="viewExpense"
          options={{
            title: "viewExpense",
            headerShown: false,
            href: null
          }}
        />
      </Tabs>
  );
};

export default TabsLayout;
