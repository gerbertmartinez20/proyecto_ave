import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import HomeScreen from '../pages/HomeScreen';
import LinksScreen from '../pages/LinksScreen';
import SettingsScreen from '../pages/SettingsScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
    tabBarLabel: 'Home'
};

const LinksStack = createStackNavigator({
  Links: LinksScreen,
});

LinksStack.navigationOptions = {
    tabBarLabel: 'Links'
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings'
};

export default createBottomTabNavigator({
  HomeStack,
  LinksStack,
  SettingsStack,
});
