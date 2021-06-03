import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { ScrollView, View, Text, TextInput, Button, ActivityIndicator, Picker, Alert, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { baseUrl } from '../urls'
import Message from '../components/Message'
import Card from '../components/Card'
import { listShopDetails, updateShop, deleteShop, listShops } from '../actions/shopActions'
import { SHOP_UPDATE_RESET, SHOP_DELETE_RESET } from '../constants/shopConstants'
import Colors from '../constants/Colors'


const ShopEditScreen = ({ navigation, route }) => {

    const shopId = route.params.id

    const [name, setName] = useState('')
    const [image, setImage] = useState('')
    const [category, setCategory] = useState('')
    const [address, setAddress] = useState('')
    const [latitude, setLatitude] = useState(0)
    const [longitude, setLongitude] = useState(0)
    const [aadharNumber, setAadharNumber] = useState('')
    const [panNumber, setPanNumber] = useState('')
    const [gstNumber, setGstNumber] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [description, setDescription] = useState('')
    const [uploading, setUploading] = useState(false)

    const [isFetching, setIsFetching] = useState(false);

    const dispatch = useDispatch()

    const shopDetails = useSelector((state) => state.shopDetails)
    const { loading, error, shop } = shopDetails

    const shopUpdate = useSelector((state) => state.shopUpdate)
    const {
        loading: loadingUpdate,
        error: errorUpdate,
        success: successUpdate,
    } = shopUpdate

    const shopDelete = useSelector((state) => state.shopDelete)
    const {
        loading: loadingDelete,
        error: errorDelete,
        success: successDelete,
    } = shopDelete

    const categoryList = useSelector((state) => state.categoryList)
    const { loading: categoryLoading, error: categoryError, categorys } = categoryList

    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: SHOP_UPDATE_RESET })
            dispatch(listShops)
            navigation.goBack()
        } else {
            if (!shop || !shop._id || shop._id !== shopId) {
                dispatch(listShopDetails(shopId))
            } else {
                setName(shop.name)
                setImage(shop.image)
                setCategory(shop.category && categorys.find(c => c._id === shop.category).name)
                setAddress(shop.address)
                setLatitude(shop.latitude)
                setLongitude(shop.longitude)
                setAadharNumber(shop.aadharNumber)
                setPanNumber(shop.panNumber)
                setGstNumber(shop.gstNumber)
                setPhone(shop.phone)
                setEmail(shop.email)
                setDescription(shop.description)
            }
        }
        if (successDelete) {
            dispatch({ type: SHOP_DELETE_RESET })
            dispatch(listShops)
            navigation.navigate('ShopList')
        }
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need Media Library permissions to make this work!');
                }
            }
        })();
    }, [dispatch, navigation, shopId, shop, successUpdate, successDelete])

    const uploadFileHandler = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            quality: 0.1,
            base64: true
        });
        setUploading(true)
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            const { data } = await axios.post(`${baseUrl}/api/upload/base64`, { imgStr: result.base64 }, config)
            setImage(data)
            setUploading(false)
        } catch (error) {
            console.log(error)
            setUploading(false)
        }
    }

    const submitHandler = () => {
        //  e.preventDefault()
        dispatch(
            updateShop({
                _id: shopId,
                name,
                image,
                category: categorys && categorys.find(c => c.name === category) && categorys.find(c => c.name === category)._id,
                address,
                latitude,
                longitude,
                aadharNumber,
                panNumber,
                gstNumber,
                phone,
                email,
                description,
            })
        )
    }

    const deleteHandler = () => {
        dispatch(deleteShop(shopId))
        //console.log('Yahah tk to thik hai')
    }


    const verifyLocationPermission = async () => {
        const result = await Permissions.askAsync(Permissions.LOCATION);
        if (result.status !== 'granted') {
            Alert.alert(
                'Insufficient permissions!',
                'You need to grant location permissions to use this app.',
                [{ text: 'Okay' }]
            );
            return false;
        }
        return true;
    };

    const getLocationHandler = async () => {
        const hasPermission = await verifyLocationPermission();
        if (!hasPermission) {
            return;
        }

        try {
            setIsFetching(true);
            const location = await Location.getCurrentPositionAsync({
                timeout: 5000
            });
            setLatitude(location.coords.latitude)
            setLongitude(location.coords.longitude)
            props.onLocationPicked({
                lat: location.coords.latitude,
                lng: location.coords.longitude
            });
        } catch (err) {
            Alert.alert(
                'Could not fetch location!',
                'Please try again later.',
                [{ text: 'Okay' }]
            );
        }
        setIsFetching(false);
    };

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
                        <Text style={styles.title}>Edit Shop</Text>
                        <Text style={styles.label}>Name</Text>
                        <TextInput style={styles.textInput}
                            placeholder="Enter name"
                            value={name}
                            onChangeText={setName}
                        />
                        {uploading && <ActivityIndicator size="large" color={Colors.primary} />}

                        <Text style={styles.label}>Image</Text>
                        <TextInput style={styles.textInput}
                            placeholder="Enter image url"
                            value={image}
                            onChangeText={setImage}
                        />
                        <View style={{ marginHorizontal: 10, marginBottom: 20 }} >
                            <Button title="Browse image" onPress={uploadFileHandler} />
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.label}>Select Category</Text>
                            <Picker
                                selectedValue={category}
                                style={{ marginLeft: 10, width: 120 }}
                                onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}>
                                {!categoryLoading && !categoryError && (
                                    categorys.map((category) => (
                                        <Picker.Item key={category._id} label={category.name} value={category.name} />
                                    ))
                                )}
                            </Picker>
                        </View>

                        <Text style={styles.label}>Address</Text>
                        <TextInput style={styles.textInput}
                            placeholder="Enter Address"
                            value={address}
                            onChangeText={setAddress}
                        />

                        {isFetching && <ActivityIndicator size="large" color={Colors.primary} />}
                        <View style={{ marginVertical: 10, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.label}>Location</Text>
                            <Button title="Pick Location" onPress={getLocationHandler} />
                        </View>
                        <Text style={styles.label}>Aadhar Number</Text>
                        <TextInput style={styles.textInput}
                            placeholder="Enter Aadhar Number"
                            value={aadharNumber}
                            keyboardType='numeric'
                            onChangeText={setAadharNumber}
                        />

                        <Text style={styles.label}>PAN Number</Text>
                        <TextInput style={styles.textInput}
                            placeholder="Enter PAN Number"
                            value={panNumber}
                            onChangeText={setPanNumber}
                        />

                        <Text style={styles.label}>GST Number</Text>
                        <TextInput style={styles.textInput}
                            placeholder="Enter GST Number"
                            value={gstNumber}
                            onChangeText={setGstNumber}
                        />

                        <Text style={styles.label}>Phone Number</Text>
                        <TextInput style={styles.textInput}
                            placeholder="Enter Phone Number"
                            value={phone}
                            keyboardType='numeric'
                            onChangeText={setPhone}
                        />

                        <Text style={styles.label}>Email</Text>
                        <TextInput style={styles.textInput}
                            placeholder="Enter Email"
                            value={email}
                            onChangeText={setEmail}
                        />

                        <Text style={styles.label}>Description</Text>
                        <TextInput style={styles.textInput}
                            placeholder="Enter Description"
                            value={description}
                            onChangeText={setDescription}
                        />
                        {loadingDelete && <ActivityIndicator size="large" color={Colors.primary} />}
                        {loadingUpdate && <ActivityIndicator size="large" color={Colors.primary} />}
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
        padding: 10
    },
    title: {
        fontSize: 25,
        margin: 10
    },
    label: {
        fontSize: 18,
        margin: 10
    },
    textInput: {
        fontSize: 15,
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

export default ShopEditScreen