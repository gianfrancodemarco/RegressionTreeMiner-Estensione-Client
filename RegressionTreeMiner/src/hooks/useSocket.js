import React, {useState, useEffect, useMemo} from 'react'
import TcpSocket from 'react-native-tcp-socket';
import useToast from './useToast';
import {Actions} from 'react-native-router-flux'


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
            setClient(TcpSocket.createConnection({...options, timeout:5000}))
            /*setTimeout(() => {
                //TODO - CONNECTED E' SEMPRE FALSE
                console.log({client})
                console.log('check:', {connected})
                if(!connected){
                    console.log("[ERROR] Could not connect to socket");
                    disconnect()
                    setError(true)
                }
            }, 2000)*/
        }
    }, [connecting]);

    //WHEN CONNECTED
    useEffect(() => {
        if(client !== null && client !== undefined){
            setConnecting(false)
            initializeClient()
        }
    }, [client])

    const sendMessage = (message, callback) => {
        //showToast("[SENT to server] -> " + message)
        try{
            client.write(message)
        }catch (e) {
            console.log({e})
            showToast('Ooops, something went wrong. Please select again your dataset!')
            Actions.replace('error')
        }
        if(callback)
            callback()
    }

    const initializeClient = () => {
        client.on('connect', function () {
            console.log(`CONNECTED TO ${options.host}:${options.port}`)
            setConnected(true)
        });

        client.on('data', function (data) {});

        client.on('error', function (error) {
            console.log(error);
            disconnect()
            setError(true)
        });

        client.on('close', function () {
            console.log('CLOSED');
            disconnect()
            setError(true)
        });
    }


    return useMemo(() =>([connected, connect, sendMessage, client, disconnect, error]), [client, connected, error, connecting])
}
