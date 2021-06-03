import React, { useState, useEffect } from 'react'
import { View, FlatList, ActivityIndicator, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Order from '../components/ListOrder'
import { getUserDetails } from '../actions/userActions'
import { listMyOrders } from '../actions/orderActions'
import Colors from '../constants/Colors'


const MyOrdersScreen = ({ navigation }) => {

    const dispatch = useDispatch()

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const orderListMy = useSelector((state) => state.orderListMy)
    const { loading: loadingOrders, error: errorOrders, orders } = orderListMy

    useEffect(() => {
        dispatch(getUserDetails('profile'))
        dispatch(listMyOrders())
    }, [dispatch, userInfo])

    return (
        <View>
            {loadingOrders ? (
                <ActivityIndicator size="large" color={Colors.primary} />
            ) : errorOrders ? (
                <Message data={errorOrders} />
            ) : (
                <FlatList
                    keyExtractor={(item, index) => item._id}
                    data={orders}
                    renderItem={({ item }) => <Order order={item} navigation={navigation} />}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    profile: {
        flex: 1,
    },
    card: {
        marginVertical: 5,
        paddingVertical: 10,
        marginHorizontal: 10
    },
    text: {
        fontSize: 18,
        marginHorizontal: 10
    }
})

export default MyOrdersScreen