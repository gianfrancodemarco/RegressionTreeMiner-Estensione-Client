import React, {useState, useEffect, useContext} from 'react';
import ConnectScreenStyles from "./ConnectScreenStyles";
import {
    Text,
    SafeAreaView,
    Button,
    View,
    TextInput,
    StatusBar
} from 'react-native';
import {defaultLabelStyles} from '../GenericStyles'
import useSocket from "../../hooks/useSocket";
import {Actions} from 'react-native-router-flux'
import {Context} from '../../hooks/globalState/Store';
import MainLayout from '../MainLayout/MainLayout';

export default function ConnectScreen() {

    const [state, dispatch] = useContext(Context)

    const defaultHost = "192.168.1.156:8080"
    const [host, setHost] = useState("192.168.1.156:8080")
    const [connected, connect, sendMessage, client, closeConnection, error] = useSocket()

    useEffect(() => {
        if(error){
            dispatch({type:"LOADING", payload: {isLoading:false}})
            Actions.replace('error')
        }
    }, [error])

    useEffect(() => {
        console.log({connected})
        if(connected){
            dispatch({type:"UPDATE_SOCKET", payload:{socket: [connected, connect, sendMessage, client, closeConnection]}})
            dispatch({type:"LOADING", payload: {isLoading: false}})
            Actions.replace('loadDataset')
        }
    }, [connected])

    const connectToServer = (host) => {
        dispatch({type:"LOADING", payload: {isLoading:true}})
        connect(host.split(":"))
    }


    return (

            <MainLayout>
                <View style={{width: buttonWidth}}>
                    <Button
                        {...hostButtonProps}
                        onPress={() => connectToServer(defaultHost)}
                        disabled={connected}
                    />
                </View>

                <Text style={{...defaultLabelStyles, color: 'white'}}>
                    or
                </Text>

                <View style={{width: buttonWidth}}>
                    <View style={{flexDirection:"column"}}>
                        <TextInput
                            style={ConnectScreenStyles.hostInput}
                            value={host}
                            onChangeText={host => setHost(host)}
                        />
                        <Button disabled={connected} onPress={() => connectToServer(host)} {...connectButtonProps}/>
                    </View>
                </View>

            </MainLayout>
    );
}

const buttonWidth = 220
const hostButtonProps = {
    color: 'hsla(215, 67%, 34%, 1)',
    title: "Connect to hosted server",
}

const connectButtonProps = {
    color: 'hsla(215, 67%, 34%, 1)',
    title: "Connect",
}
