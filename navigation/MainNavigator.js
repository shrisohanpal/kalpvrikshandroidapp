import * as React from 'react'
import { useSelector } from 'react-redux'
import { Text, View, Image } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import MenuNavigator from './MenusNavigator.js'
import StoreNavigator from './StoreNavigator'
import AdminNavigator from './AdminNavigator'
import VendorNavigator from './VendorNavigator'

import Temp from '../screens/tempscreen'

function CustomDrawerContent(props) {
    return (
        <DrawerContentScrollView {...props}>
            <DrawerItem
                label={() => { return (<Image style={{ margin: 0, padding: 0, width: '100%', height: 100 }} source={require('../assets/banners/a.jpg')} />) }}
                onPress={() => { }} />
            <DrawerItemList {...props} />
            <DrawerItem
                label="Share this App"
                onPress={() => { }} />
        </DrawerContentScrollView>
    );
}

const Drawer = createDrawerNavigator();

export default function App() {

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    return (
        <NavigationContainer>
            <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />} initialRouteName="Menu">
                <Drawer.Screen name="Menu" component={MenuNavigator} />
                <Drawer.Screen name="Seller" component={StoreNavigator} />
                {userInfo && userInfo.isAdmin && (
                    <Drawer.Screen name="Admin" component={AdminNavigator} />
                )}
                {userInfo && userInfo.isVendor && (
                    <Drawer.Screen name="Vendor" component={VendorNavigator} />
                )}
                {/*  <Drawer.Screen name="Temp" component={Temp} /> */}
            </Drawer.Navigator>
        </NavigationContainer>
    );
}