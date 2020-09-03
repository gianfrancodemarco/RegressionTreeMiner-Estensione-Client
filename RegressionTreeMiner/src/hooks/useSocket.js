import React, {useState, useEffect, useMemo} from 'react'
import TcpSocket from 'react-native-tcp-socket';
import useToast from './useToast';
import {Actions} from 'react-native-router-flux'

/**
 * @class useSocket
 * @param props
 *
 * Fornisce un'interfaccia per comunicare con una socket Java
 *
 */
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

    /**
     * @method connect
     * @param host - indirizzo dell'host a cui connettersi
     * @param port - porta in cui è in ascolto il processo server sull'host
     *
     * Prepara la connessione all'host
     */
    const connect = ([host, port]) => {
        setOptions({host, port})
        disconnect()
        setConnecting(true)
    }


    /**
     * @method disconnect
     *
     * Effettua la connessione della socket
     */
    const disconnect = () => {
        if(client !== null){
            client.destroy()
        }

        setClient(null)
        setConnected(false)
        setError(false)
    }

    /**
     * @method anonimo
     *
     * Effettua la connessione all'host
     */
    //CONNECTION REQUESTED
    useEffect(() => {
        if (connecting) {
            console.log(`[Attempting to connect ${options.host}:${options.port}]`)
            setClient(TcpSocket.createConnection({...options, timeout:5000}))
        }
    }, [connecting]);

    /**
     * @method anonimo
     *
     * Quando è stata stabilita la connessione, chiama initializaClient()
     */
    //WHEN CONNECTED
    useEffect(() => {
        if(client !== null && client !== undefined){
            setConnecting(false)
            initializeClient()
        }
    }, [client])

    /**
     * @method sendMessage
     *
     * @param message - il messaggio da scrivere sulla socket
     * @param callback - funzione da eseguire una volta inviato il messaggio
     */
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

    /**
     * @method initializaClient
     *
     * Inizializza i listener della socket
     */
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
