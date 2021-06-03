import React, { useState, useEffect } from 'react';
import { Button, View, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { baseUrl } from '../urls'

export default function ImagePickerExample() {

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            // allowsEditing: true,
            //  aspect: [4, 3],
            quality: 0.1,
            base64: true
        });

        //  console.log(result.base64);

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            }

            const { data } = await axios.post(`${baseUrl}/api/upload/base64`, { imgStr: result.base64 }, config)

            //  console.log("Paratha wala Photo: " + data)                  
        } catch (error) {
            console.log(error)
        }

    };



    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button title="Pick an image from camera roll" onPress={pickImage} />
        </View>
    );
}
