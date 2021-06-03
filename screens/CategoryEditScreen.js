import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { ScrollView, View, Text, TextInput, Button, ActivityIndicator, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Card from '../components/Card'
import { listCategoryDetails, updateCategory, deleteCategory, listCategorys } from '../actions/categoryActions'
import { CATEGORY_UPDATE_RESET, CATEGORY_DELETE_RESET } from '../constants/categoryConstants'
import Colors from '../constants/Colors'

const CategoryEditScreen = ({ route, navigation }) => {

    const categoryId = route.params.id
    const [name, setName] = useState('')

    const dispatch = useDispatch()

    const categoryDetails = useSelector((state) => state.categoryDetails)
    const { loading, error, category } = categoryDetails

    const categoryUpdate = useSelector((state) => state.categoryUpdate)
    const {
        loading: loadingUpdate,
        error: errorUpdate,
        success: successUpdate,
    } = categoryUpdate

    const categoryDelete = useSelector((state) => state.categoryDelete)
    const {
        loading: loadingDelete,
        error: errorDelete,
        success: successDelete,
    } = categoryDelete

    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: CATEGORY_UPDATE_RESET })
            dispatch(listCategorys())
            navigation.navigate('CategoryList')
            //console.log('Called')
        } else {
            if (!category || !category._id || category._id !== categoryId) {
                dispatch(listCategoryDetails(categoryId))
            } else {
                setName(category.name)
            }
        }
        if (successDelete) {
            dispatch({ type: CATEGORY_DELETE_RESET })
            dispatch(listCategorys())
            navigation.navigate('CategoryList')
        }
    }, [dispatch, navigation, categoryId, category, successUpdate, successDelete])

    const submitHandler = () => {
        // e.preventDefault()
        dispatch(
            updateCategory({
                _id: categoryId,
                name
            })
        )
    }

    const deleteHandler = () => {
        dispatch(deleteCategory(categoryId))
    }

    return (
        <ScrollView>
            <Card style={styles.card}>
                {loadingDelete && <ActivityIndicator size="large" color={Colors.primary} />}
                {loadingUpdate && <ActivityIndicator size="large" color={Colors.primary} />}
                {errorUpdate && <Message data={errorUpdate} />}
                {loading ? (
                    <ActivityIndicator size="large" color={Colors.primary} />
                ) : error ? (
                    <Message data={error} />
                ) : (
                    <View>
                        <Text style={styles.title}>Edit Category</Text>
                        <Text style={styles.label}>Name</Text>
                        <TextInput style={styles.textInput}
                            placeholder="Enter name"
                            value={name}
                            onChangeText={setName}
                        />
                        <View style={styles.buttonContainer} >
                            <View style={{ margin: 10 }}>
                                <Button
                                    title="Update"
                                    onPress={submitHandler}
                                />
                            </View>
                            <View style={{ margin: 10 }}>
                                <Button
                                    title="Delete"
                                    color="red"
                                    onPress={deleteHandler}
                                />
                            </View>
                        </View>
                    </View>
                )
                }
            </Card>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    card: {
        margin: 10,
        padding: 20
    },
    title: {
        fontSize: 25,
        margin: 10
    },
    label: {
        fontSize: 20,
        margin: 10
    },
    textInput: {
        fontSize: 18,
        borderWidth: 1,
        backgroundColor: 1,
        padding: 10,
        margin: 10,
        borderRadius: 5
    },
    buttonContainer: {
        margin: 10,
        flexDirection: 'row',
        alignItems: 'flex-start'
    }
})

export default CategoryEditScreen