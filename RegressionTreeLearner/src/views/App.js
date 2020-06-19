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

export default function App() {

    const [host, setHost] = useState("")
    const [connected, connect] = useSocket()

    const defaultHost = "192.168.1.156"
    const defaultPort = "8080"

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



            <Button {...hostButtonProps}
                onPress={() => {
                    connect(defaultHost, defaultPort)
                }}
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
                <Button
                    onPress={() => connect(host.split(":")[0], host.split(":")[1])}
                    {...goButtonProps}/>
            </View>

        </SafeAreaView>
    );
}
