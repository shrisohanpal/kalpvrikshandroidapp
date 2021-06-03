import axios from 'axios'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { ScrollView, ActivityIndicator, Text, View, Button, StyleSheet, Alert } from 'react-native'
import Card from '../components/Card'
import Colors from '../constants/Colors'
import { baseUrl } from '../urls'

const StoreConfirmScreen = ({ navigation }) => {

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(false)

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const confirmHandler = async () => {
        setLoading(true)
        await axios.post(`${baseUrl}/api/users/registerseller/${userInfo._id}`)
        setLoading(false)
        setMessage(true)
    }

    return (
        <ScrollView>
            <View style={{ paddingTop: 30 }}>
                {
                    message && (
                        <Card style={styles.card}>
                            <Text style={styles.description}>
                                Your Request has been sent to Admin. you will get conformation very soon.
                            </Text>
                        </Card>
                    )
                }

                <Card style={styles.card}>
                    {loading && <ActivityIndicator size="large" color={Colors.primary} />}
                    <Text style={styles.description}>
                        You Will be able to Add Your Shop and Products with this account when admin will allow you.
                </Text>
                    <Text style={styles.title}>
                        Are you sure ?
                </Text>
                    <Button
                        title="Conform"
                        onPress={confirmHandler}
                        disabled={message}
                    />
                </Card>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    label: {
        fontSize: 25,
        margin: 10
    },
    card: {
        margin: 10,
        padding: 10,
        alignItems: 'center'
    },
    title: {
        fontSize: 20,
        margin: 10,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 10
    },
    description: {
        fontSize: 18,
        margin: 10,
    },
    buttonContainer: {
        margin: 20,
        marginBottom: 100,
        alignItems: 'center',
    }
})

export default StoreConfirmScreen