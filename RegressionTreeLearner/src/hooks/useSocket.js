import React, {useState, useEffect, useMemo} from 'react'
import TcpSocket from 'react-native-tcp-socket';


export default function useSocket(){

    const [host, setHost] = useState()
    const [port, setPort] = useState()

    const [connected, setConnected] = useState(true)
    const [client, setClient] = useState(null)
    const connect = (host, port) => {
        setHost(host)
        setPort(port)
        setConnected(false)
    }

    useEffect(() => {
        if(!connected){
           setConnected(true)
/*           if(client)
               client.destroy()*/
           console.log(client)
           console.log(`[Attempting to connect ${host}:${port}]`)
            setClient(
                TcpSocket.createConnection({
                    port: port,
                    host: host
                }, () => console.log("connected"))
            )
        }
    }, [connected])

    useEffect(() => {
        if(client != null)
            initializeClient()
    }, [client])

    const initializeClient = () => {

        //console.log(client)

        client.on('data', function(data) {
            console.log('message was received',
                new TextDecoder("utf-8").decode(data)
            );
        });

        client.on('error', function(error) {
            console.log(error);
        });

        client.on('close', function() {
            console.log('closed')
        });

        // Write on the socket
        client.write("asdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdas");

    }

    return useMemo(() =>([connected, connect, host, setHost, port, setPort]), [])
}
