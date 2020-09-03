import React from 'react';
import {
    StyleSheet,
    Text,
    Button
} from 'react-native';
import {Actions} from 'react-native-router-flux'
import MainLayout from '../MainLayout/MainLayout';

/**
 * Componente funzionale che renderizza la schermata che viene visualizzata in caso di errore
 *
 * @class ErrorScreen
 */
export default function ErrorScreen() {

    console.log('Rendering error screen')
    console.trace()

    return (
            <MainLayout background={require('../../assets/121411.jpg')}>
                <Text style={textStyle.style}>An error occured during the communication</Text>
                <Button
                    {...backToHome}
                    onPress={() => Actions.replace('connectScreen')}
                />
            </MainLayout>
    );
}

const backToHome = {
    color: 'hsla(215, 67%, 34%, 1)',
    title: "Go back to connect screen",
}

const textStyle = StyleSheet.create({
    style: {
        fontWeight: 'bold',
        fontStyle: 'italic',
        marginTop: 150,
        marginBottom: 10,
        color:'white',
        fontSize: 15
    }
})
