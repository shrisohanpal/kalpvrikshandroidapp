import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import NearMeScreen from '../screens/NearMeScreen'


const Stack = createStackNavigator()

export default function App() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerTintColor: 'white',
                headerStyle: { backgroundColor: '#007bff' },
            }}>
            <Stack.Screen name="NearMe" component={NearMeScreen} />
        </Stack.Navigator>
    );
}