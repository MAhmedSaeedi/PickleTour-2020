import React,{Component} from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'


const DashboardStack = createMaterialTopTabNavigator()
const MainStack = createStackNavigator()
function AppNavigation(){
    return(
        <NavigationContainer>
            {/* <Stack.Navigator
                headerMode="float"
            >
                <Stack.Screen component={TestScreen} name="Dashboard"/>
            </Stack.Navigator> */}
        </NavigationContainer>
    )
}

export default AppNavigation