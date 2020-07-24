import React, {useState, useEffect, useMemo} from 'react'
import TcpSocket from 'react-native-tcp-socket';
import useToast from './useToast';
import {decodeMessage} from '../utils/Utils';


export default function useSocket(props){

    const [options, setOptions] = useState({})
    const [connected, setConnected] = useState(false)
    const [connecting, setConnecting] = useState(false)
    const [client, setClient] = useState(null)
    const [error, setError] = useState(false)
    const [showToast, showToastWithGravity, showToastWithGravityAndOffset] = useToast()

    if(props && props.client && client === null){
        setClient(props.client)
        setConnected(props.connected ? props.connected : false)
        setError(props.error ? props.error : false)
    }

    const connect = ([host, port]) => {
        setOptions({host, port})
        disconnect()
        setConnecting(true)
    }

    const disconnect = () => {
        if(client !== null){
            client.destroy()
        }

        setClient(null)
        setConnected(false)
        setError(false)
    }

    //CONNECTION REQUESTED
    useEffect(() => {
        if (connecting) {
            console.log(`[Attempting to connect ${options.host}:${options.port}]`)
            setClient(TcpSocket.createConnection(options))
        }
    }, [connecting]);

    //WHEN CONNECTED
    useEffect(() => {
        //console.log("Checking connected")
        if(client !== null && client !== undefined){
            console.debug('Initializing client');
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
        client.on('connect', function () {
            //console.log(`on connect`)
            console.log(`CONNECTED TO ${options.host}:${options.port}`)
            setConnected(true)
        });

        client.on('data', function (data) {
            //console.log(`on data`)
            const decoded = decodeMessage(data)
        });

        client.on('error', function (error) {
            //console.log(`on error`)
            console.log(error);
            disconnect()
            setError(true)
        });

        client.on('close', function () {
            //console.log(`on close`)
            console.log('CLOSED');
            disconnect()
            setError(true)
        });
    }


    return useMemo(() =>([connected, connect, sendMessage, client, disconnect, error]), [client, connected, error])
}
