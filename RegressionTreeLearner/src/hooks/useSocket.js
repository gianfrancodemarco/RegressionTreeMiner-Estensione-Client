import React, {useState, useEffect, useMemo} from 'react'
import TcpSocket from 'react-native-tcp-socket';
import useToast from './useToast';
import {decodeMessage} from '../utils/Utils';


export default function useSocket(){

    const [options, setOptions] = useState({})
    const [connected, setConnected] = useState(false)
    const [connecting, setConnecting] = useState(false)
    const [client, setClient] = useState(null)
    const [showToast, showToastWithGravity, showToastWithGravityAndOffset] = useToast()

    const connect = ([host, port]) => {
        setOptions({host, port})
        setConnecting(true)
        setConnected(false)
        setClient(null)
    }

    //CONNECTING
    useEffect(() => {
        if (!connected && connecting && client == null) {
            console.log(`[Attempting to connect ${options.host}:${options.port}]`)
            setConnecting(true)
            setClient(TcpSocket.createConnection(options))
        }
    }, [connecting]);

    //WHEN CONNECTED
    useEffect(() => {
        console.log("Checking connected")
        if(client !== null && client !== undefined){
            console.debug('Initializing client');
            setConnected(true)
            setConnecting(false)
            initializeClient()
        }
    }, [client])

    const sendMessage = (message, callback) => {
        showToast("[SENT to server] -> " + message)
        client.write(message)
        if(callback)
            callback()
    }

    const initializeClient = () => {
        client.on('ready', function () {
            console.log(`CONNECTED TO ${options.host}:${options.port}`)
        });

        client.on('data', function (data) {
            const decoded = decodeMessage(data)
            console.log((`[RECEIVED from ${options.host}:${options.port}] \n ${decoded}`))
            //showToastWithGravity(`[RECEIVED from ${options.host}:${options.port}] \n ${decoded}`)
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
    const closeConnection = () => client.destroy()

    return useMemo(() =>([connected, connect, sendMessage, client, closeConnection, options, setOptions]), [connected])
}
