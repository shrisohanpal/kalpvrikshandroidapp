import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, Text, Image, Button, StyleSheet, Picker, ScrollView, Alert, TouchableOpacity } from 'react-native'
import Message from '../components/Message'
import { addToCart, removeFromCart } from '../actions/cartActions'
import { baseUrl } from '../urls'

const CartItem = ({ item, dispatch }) => {
    //  console.log(item)
    return (
        <View style={{ padding: 20 }}>
            <Image style={styles.image} source={{ uri: `${baseUrl}/api${item.images[0]}` }} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.text}>Price: ₹{item.price}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                <Text style={styles.text}>
                    Quantity
                    </Text>
                <Picker
                    selectedValue={item.qty}
                    style={{ marginLeft: 10, width: 120 }}
                    onValueChange={(itemValue, itemIndex) => dispatch(
                        addToCart(item.product, Number(itemValue))
                    )}
                >
                    {[...Array(item.countInStock).keys()].map(
                        (x) => (
                            <Picker.Item key={x + 1} label={String(x + 1)} value={x + 1} />
                        )
                    )}
                </Picker>
                <TouchableOpacity onPress={() => dispatch(removeFromCart(item.product))}>
                    <Text>Remove </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const CartScreen = ({ route, navigation }) => {

    const productId = route.params && route.params.id

    const qty = route.params.qty ? route.params.qty : 1

    const dispatch = useDispatch()

    const cart = useSelector((state) => state.cart)
    const { cartItems } = cart

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    useEffect(() => {
        if (productId) {
            dispatch(addToCart(productId, qty))
        }
    }, [dispatch, productId, qty])

    const checkoutHandler = () => {
        //    history.push('/login?redirect=shipping')
        if (userInfo) {
            navigation.navigate('Shipping')
        } else {
            Alert.alert("Login to Continue.", "you are not logged in this app. If you want to continue then you have to login.")
            // navigation.navigate('Login')
        }
    }

    return (
        <View>
            {
                cartItems.length === 0
                    ? <Message data="Your cart is empty" variant="success" />
                    : <ScrollView>
                        {cartItems.map((item) => {
                            return (
                                <CartItem key={item.product} item={item} dispatch={dispatch} />
                            )
                        })}
                        <Text style={styles.text2}>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items</Text>
                        <Text style={styles.text2}>₹{cartItems
                            .reduce((acc, item) => acc + item.qty * item.price, 0)
                            .toFixed(2)}
                        </Text>
                        <View style={{ margin: 10, alignItems: 'flex-start' }}>
                            <Button title="Proceed To Checkout" onPress={checkoutHandler} />
                        </View>
                    </ScrollView>
            }
        </View>
    )

}

const styles = StyleSheet.create({
    image: {
        //   width: width,
        height: 200,
    },
    name: {
        fontSize: 25
    },
    text: {
        fontSize: 18
    },
    text2: {
        fontSize: 25,
        marginVertical: 10,
        marginHorizontal: 20
    }
})

export default CartScreen