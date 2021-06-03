import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TouchableOpacity, View, Text, ActivityIndicator, FlatList, StyleSheet } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

import Message from '../components/Message'
import Card from '../components/Card'
import { listCategorys, createCategory } from '../actions/categoryActions'
import Colors from '../constants/Colors'
import { CATEGORY_CREATE_RESET } from '../constants/categoryConstants'


const Category = ({ category, navigation }) => {
    return (
        <Card style={styles.category}>
            <TouchableOpacity
                onPress={() => navigation.navigate('CategoryEdit', { id: category._id, title: category.name })}
            >
                <Text style={styles.text}>{category.name ? category.name : 'No name'}</Text>
            </TouchableOpacity>
        </Card>
    )
}


const CategoryListScreen = ({ navigation }) => {

    const dispatch = useDispatch()

    const categoryList = useSelector(state => state.categoryList)
    const { loading, error, categorys } = categoryList

    const categoryCreate = useSelector((state) => state.categoryCreate)
    const {
        loading: loadingCreate,
        error: errorCreate,
        success: successCreate,
        category: createdCategory,
    } = categoryCreate

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    useEffect(() => {
        dispatch({ type: CATEGORY_CREATE_RESET })

        if (successCreate) {
            navigation.navigate('CategoryEdit', { id: createdCategory._id, title: createdCategory.name })
        } else {
            dispatch(listCategorys())
        }
    }, [dispatch, navigation, successCreate, createdCategory,])

    const createCategoryHandler = () => {
        dispatch(createCategory())
    }

    React.useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Categories',
            headerRight: () => (
                <View style={{ flexDirection: 'row' }}>
                    <Ionicons
                        name="ios-add"
                        size={40}
                        color='#ffffff'
                        style={{ margin: 10 }}
                        onPress={createCategoryHandler}
                    />
                </View >
            )
        })
    })

    return (
        <View>
            {loading ? <ActivityIndicator size="large" color={Colors.primary} />
                : error
                    ? (<Message data={error} />)
                    : (
                        <FlatList
                            keyExtractor={(item, index) => item._id}
                            data={categorys}
                            renderItem={({ item }) => <Category category={item} navigation={navigation} />}
                            showsHorizontalScrollIndicator={false}
                        />
                    )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    category: {
        margin: 10,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 25
    }
})

export default CategoryListScreen