import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import HomeScreen from '../screens/HomeScreen'
import CategoryDetail from "../screens/CategoryDetail"
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
    return (
        <NavigationContainer >
            <Stack.Navigator >
                <Stack.Screen options={{headerShown:false}} name='Home' component={HomeScreen} />
                <Stack.Screen options={{headerShown:false}} name='CategoryDetail' component={CategoryDetail} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default RootNavigator