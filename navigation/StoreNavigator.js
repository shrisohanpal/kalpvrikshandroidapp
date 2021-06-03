import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import StoreScreen from '../screens/StoreScreen'
import ConfirmStoreScreen from '../screens/StoreConfirmScreen.js'

const Stack = createStackNavigator()

export default function App() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerTintColor: 'white',
                headerStyle: { backgroundColor: '#007bff' },
            }}>
            <Stack.Screen name="Store" component={StoreScreen} />
            <Stack.Screen name="ConformStore" component={ConfirmStoreScreen} />
        </Stack.Navigator>
    );
}