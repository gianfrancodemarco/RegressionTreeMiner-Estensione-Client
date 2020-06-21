import React, {useState, useEffect, useMemo} from 'react'
import TcpSocket from 'react-native-tcp-socket';
import useToast from './useToast';

export default function useSocket(){

    const [options, setOptions] = useState({})
    const [connected, setConnected] = useState(false)
    const [connecting, setConnecting] = useState(false)
    const [client, setClient] = useState(null)
    const [showToast, showToastWithGravity, showToastWithGravityAndOffset] = useToast()

    const connect = ([host, port]) => {
        //console.log("Pressed connect")
        setOptions({host, port})
        setConnecting(true)
        setConnected(false)
        setClient(null)
    }

    //AFTER CONNECT
    useEffect(() => {
        if (!connected && connecting && client == null) {
            console.log(`[Attempting to connect ${options.host}:${options.port}]`)
            setConnecting(true)
            setClient(TcpSocket.createConnection(options))
        }
    }, [connecting]);

    //WHEN CONNECTED
    useEffect(() => {
        console.log("Cheking connected")
        console.log({client})
        console.log(client !== null && client !== undefined)
        if(client !== null && client !== undefined){
            console.debug('Initializing client');
            setConnected(true)
            setConnecting(false)
            initializeClient()
        }
    }, [client])

    const initializeClient = () => {
        client.on('connect', function () {
            console.log(`CONNECTED TO ${options.host}:${options.port}`)
        });

        client.on('data', function (data) {
            showToastWithGravity(`[RECEIVED from ${options.host}:${options.port}] \n ${decodeMessage(data)}`)
        });

        client.on('error', function (error) {
            console.log(error);
            client.end()
            setClient(null)
            setConnecting(false)
            setConnected(false)
        });

        client.on('close', function () {
            console.log('closed');
            setClient(null)
            setConnecting(false)
            setConnected(false)
        });
    }

    //Interface
    const closeConnection = () => client.destroy()
    const sendMessage = (message) => {
        showToast("[SENT to server] -> " + message)
        client.write(message)
    }
    const decodeMessage = (message) => message.toString('utf-8')

    return useMemo(() =>([connected, connect, sendMessage, closeConnection, options, setOptions]), [connected])
}
