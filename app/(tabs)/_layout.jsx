import { View, Text } from "react-native";
import React from "react";
import {Tabs, Redirect} from 'expo-router'
import Icon from 'react-native-vector-icons/FontAwesome'
import { useGlobalContext } from "../../context/GlobalProvider";

const TabsLayout = () => {
  const { loading, isLogIn } = useGlobalContext();

  if (!loading && !isLogIn) return <Redirect href="/login" />;
  return (
    <>
    <Tabs
    screenOptions={{
      // tabBarShowLabel:false,
      tabBarActiveTintColor:"#FFA001",
      tabBarInactiveTintColor:'#CDCDE0',
      tabBarStyle:{
        backgroundColor:"#161622",
        borderTopWidth:1.5,
        borderTopColor:"#232533"
      }
    }}
    >
      <Tabs.Screen
      name="dashboard"
      options={{
        title:"Dashboard",
        headerShown:false,
        tabBarIcon:({color, focus})=>(
          <Icon name="home" size={28}color='#FFF'/>
        )
      }}
      />
      <Tabs.Screen
      name="stats"
      options={{
        title:"Stats",
        headerShown:false,
        tabBarIcon:({color, focus})=>(
          <Icon name="bar-chart" size={28}color='#FFF'/>
        )
      }}
      />
      <Tabs.Screen
      name="expense"
      options={{
        title:"Expense",
        headerShown:false,
        tabBarIcon:({color, focus})=>(
          <Icon name="dollar" size={28}color='#FFF'/>
        )
      }}
      />
      <Tabs.Screen
      name="budget"
      options={{
        title:"Budget",
        headerShown:false,
        tabBarIcon:({color, focus})=>(
          <Icon name="money" size={28} color='#FFF'/>
        )
      }}
      />
       <Tabs.Screen
      name="createBudget"
      options={{
        title:"CreateBudget",
        headerShown:false,
        tabBarIcon:({color, focus})=>(
          <Icon name="money" size={28} color='#FFF'/>
        ),
        href:null
      }}
      />
      <Tabs.Screen
      name="viewBudget"
      options={{
        title:"viewbudget",
        headerShown:false,
        tabBarIcon:({color, focus})=>(
          <Icon name="money" size={28} color='#FFF'/>
        ),
        href:null
      }}
      />
    </Tabs>
    </>
  );
};

export default TabsLayout;
