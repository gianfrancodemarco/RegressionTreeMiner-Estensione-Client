import React, {useState, useEffect, useContext} from 'react';
import ConnectScreenStyles from "./ConnectScreenStyles";
import {
    Text,
    Button,
    View,
    TouchableOpacity,
    TextInput
} from 'react-native';
import {defaultLabelStyles} from '../GenericStyles'
import useSocket from "../../hooks/useSocket";
import {Actions} from 'react-native-router-flux'
import {Context, showLoading} from '../../hooks/globalState/Store';
import MainLayout from '../MainLayout/MainLayout';
import useGlobalState from "../../hooks/globalState/useGlobalState";
import Icon from 'react-native-vector-icons/FontAwesome';

export default function ConnectScreen() {

    const [state, dispatch] = useContext(Context)

    const defaultHost = "192.168.1.62:8085"
    const [host, setHost] = useState("192.168.1.62:8085")

    //useGlobalState -> EFFETTUA IL DISPATCH NELLO STATO GLOBALE AGGIORNANDO LA SOCKET
    const [connected, connect,,,, error] = useGlobalState(useSocket(), "UPDATE_SOCKET", "socket")
    console.log([connected, connect, error] )

    useEffect(() => {
        if(error){
            showLoading(false)
            Actions.replace('error')
        }
    }, [error])

    useEffect(() => {
        console.log({connected})
        if(connected){
            showLoading(false)
            Actions.replace('loadDataset')
        }
    }, [connected])

    const connectToServer = (host) => {
        showLoading(true)
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
