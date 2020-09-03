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

/**
 * Componente funzionale che renderizza la schermata di connessione al server
 *
 * @class ConnectScreen
 */
export default function ConnectScreen() {

    const [state, dispatch] = useContext(Context)

    const defaultHost = "192.168.1.62:8085"
    const [host, setHost] = useState("192.168.1.62:8085")

    //useGlobalState -> EFFETTUA IL DISPATCH NELLO STATO GLOBALE AGGIORNANDO LA SOCKET
    const [connected, connect,,,, error] = useGlobalState(useSocket(), "UPDATE_SOCKET", "socket")

    /**
     * Hook che in caso di errore renderizza ErrorScreen
     * @method anonimo
     */
    useEffect(() => {
        if(error){
            showLoading(false)
            Actions.replace('error')
        }
    }, [error])

    /**
     * Hook che renderizza la schermata successiva una volta avvenuta la connessione
     * @method anonimo
     */
    useEffect(() => {
        if(connected){
            showLoading(false)
            Actions.replace('loadDataset')
        }
    }, [connected])

    /**
     * Procedura che richiama il metodo connect dell'hook useSocket
     * @param {String} host indirizzo del server nel formato host:port
     * @method connectToServer
     */
    const connectToServer = (host) => {
        showLoading(true)
        connect(host.split(":"))
    }

    return (
            <MainLayout>
                {/*<View style={{width: buttonWidth}}>
                    <Button
                        {...hostButtonProps}
                        onPress={() => connectToServer(defaultHost)}
                        disabled={connected}
                    />
                </View>

                <Text style={{...defaultLabelStyles, color: 'white'}}>
                    or
                </Text>*/}

                <Text style={{...defaultLabelStyles, color: 'white', marginTop: 150}}>
                    Server address:
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
