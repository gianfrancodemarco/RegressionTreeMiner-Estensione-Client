import React from 'react';
import {
    StyleSheet,
    Text,
    Button
} from 'react-native';
import {Actions} from 'react-native-router-flux'
import MainLayout from '../MainLayout/MainLayout';

export default function ErrorScreen() {

    console.log('Rendering error screen')
    console.trace()

    return (
            <MainLayout>
                <Text style={textStyle.style}>An error occured acquiring socket connection</Text>
                <Button
                    {...backToHome}
                    onPress={() => Actions.replace('connectScreen')}
                />
            </MainLayout>
    );
}

const backToHome = {
    color: 'hsla(215, 67%, 34%, 1)',
    title: "Go to connect screen",
}

const textStyle = StyleSheet.create({
    style: {
        fontWeight: 'bold',
        fontStyle: 'italic',
        marginBottom: 10,
        color:'white',
        fontSize: 15
    }
})
