import React from 'react';
import { Tabs } from 'expo-router';
import { BottomTabBar } from '../../components/stockmate/BottomTabBar';
export default function TabLayout() {
  return <Tabs screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true }} tabBar={props => <BottomTabBar {...props} />}>
    <Tabs.Screen name="index" options={{ title: 'Home' }} />
    <Tabs.Screen name="inventory" options={{ title: 'Stock' }} />
    <Tabs.Screen name="sales" options={{ title: 'Sales' }} />
    <Tabs.Screen name="more" options={{ title: 'Reports' }} />
  </Tabs>;
}
