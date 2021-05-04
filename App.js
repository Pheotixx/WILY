import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import{createAppContainer, createSwitchNavigator} from 'react-navigation'
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';
import BookTransaction from './screens/BookTransaction';
import SearchScreen from './screens/SearchScreen';
import LoginScreen from './screens/loginScreen';


export default class App extends React.Component() {
  render(){
   return (
    <AppContainer/>
   );
  }
}

const tabNavigator = createBottomTabNavigator({
  transaction: {screen: BookTransaction} ,
  search: {screen: SearchScreen}
})

defaultNavigationOptions : ({navigation})=>({
  tabBarIcon:({})=>{
    const routeName = navigation.state.routeName
    if(routeName ==='Transaction'){
      return(
        <Image
        source = {require ('./assets/book.png')}
        style={{width:40,height:40}}
        />
      )
    } 
    else if(routeName ==='Search'){
      return(
        <Image
        source = {require ('./assets/searchingbook.png')}
        style={{width:40,height:40}}
        />
      )
    } 
  }
})

//const AppContainer = createAppContainer(tabNavigator);

const AppContainer = createAppContainer(switchNaviagtor);
const switchNavigator = createSwitchNavigator({
  LoginScreen: {screen: LoginScreen},
  tabNavigator: {screen: tabNavigator}
})

