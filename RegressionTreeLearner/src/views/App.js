import React, {useState} from 'react';
import styles from "./AppStyles";
import {
    Text,
    SafeAreaView,
    Button,
    View,
    TextInput
} from 'react-native';
import {defaultLabelStyles} from './GenericStyles'
import useSocket from "./../hooks/useSocket";

const hostButtonProps = {
    color: 'hsla(215, 67%, 34%, 1)',
    title: "Connect to hosted server",
}

const goButtonProps = {
    color: 'hsla(215, 67%, 34%, 1)',
    title: "Go",
}

const sendMessageProps = {
    color: 'hsla(182, 24%, 86%, 1)',
    title: "Send Message",
}

export default function App() {

    const defaultHost = "192.168.1.156:8080"
    const [host, setHost] = useState("192.168.1.156:8080")
    const [connected, connect, sendMessage, closeConnection] = useSocket()


    //DEBUG PURPOUSE
    const [message, setMessage] = useState("")

    console.log({connected})


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.innerContainer}>
                <Text style={styles.header}>
                    RegressionTreeLearner
                </Text>
                <Text style={styles.credits}>
                    by Gianfranco Demarco
                </Text>
            </View>
            <Button
                    {...hostButtonProps}
                    onPress={() => connect(defaultHost.split((":")))}
                    disabled={connected}
            />
            <Text style={defaultLabelStyles}>
                or
            </Text>
            <View style={{flexDirection:"column"}}>
                <TextInput
                    style={styles.hostInput}
                    value={host}
                    onChangeText={host => setHost(host)}
                />
                <Button disabled={connected} onPress={() => connect(host.split((":")))} {...goButtonProps}/>
            </View>

            <View style={{flexDirection:"column", marginTop: 20}}>
                <TextInput
                    style={styles.hostInput}
                    value={message}
                    onChangeText={message => setMessage(message)}
                />
                <Button onPress={() => sendMessage(message)} {...sendMessageProps} disabled={!connected}/>
            </View>
        </SafeAreaView>
    );
}
