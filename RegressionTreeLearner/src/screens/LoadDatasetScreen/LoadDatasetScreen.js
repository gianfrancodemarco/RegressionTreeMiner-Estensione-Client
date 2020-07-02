import React, {useState, useEffect, useContext} from 'react';
import styles from "./LoadDatasetScreenStyles";
import {
    View,
    Button
} from 'react-native';
import {DATASETOPTION, LEARNOPTIONS} from '../../utils/Dataset';
import RadioForm from 'react-native-simple-radio-button';
import {Context} from '../../hooks/globalState/Store';
import {decodeMessage} from '../../utils/Utils';
import MainLayout from '../MainLayout/MainLayout';
import {Actions} from 'react-native-router-flux'


export default function LoadDatasetScreen() {

    const [state, dispatch] = useContext(Context)
    const [connected, connect, sendMessage, client, closeConnection] = state.socket

    const [learnOption, setLearnOption] = useState(0)
    const [table, setTable] = useState(0)


    const [step, setStep] = useState(1)
    const [tableOptions, setTableOptions] = useState()
    const [action, setAction] = useState()

    //ADD TABLE LISTENER
    const tableReceivedObserver = (data) => {
        const decoded = decodeMessage(data)
        const identifier = "[DATASETS]"

        if(decoded && decoded.indexOf(identifier) !== -1){
            let options = decoded.replace(identifier, "").split(";")
            options = options.map((el, index) => ({"label":el.replace('.dmp', ''), "value": index}))
            setTableOptions(options)
            client.off('data', tableReceivedObserver)
            client.on('data', treeReceivedObserver)
            dispatch({type:"LOADING", payload: {isLoading:false}})
        }
    }

    useEffect(() => {
        client.on('data', tableReceivedObserver)
    }, [])
    //////////////////////////////////////////////////////////////////////////////

    //ADD TREE LISTENER
    const treeReceivedObserver = (data) => {
        const decoded = decodeMessage(data)
        const identifier = "[TREE]"

        if(decoded && decoded.indexOf(identifier) !== -1){
            client.off('data', tableReceivedObserver)
            dispatch({type:"TREE", payload: {tree: decoded.replace(identifier, '')}})
            client.on('data', rulesReceiverObserver)
            dispatch({type:"LOADING", payload: {isLoading:false}})
        }
    }

    //////////////////////////////////////////////////////////////////////////////

    //ADD TREE LISTENER
    const rulesReceiverObserver = (data) => {
        const decoded = decodeMessage(data)
        const identifier = "[RULES]"

        if(decoded && decoded.indexOf(identifier) !== -1){
            console.log('Received rules', decoded)
            client.off('data', rulesReceiverObserver)
            dispatch({type:"RULES", payload: {rules: decoded.replace(identifier, '')}})
            Actions.showTree()
        }
    }

    //////////////////////////////////////////////////////////////////////////////


    const sendMode = () => {
        dispatch({type:"LOADING", payload: {isLoading:true}})
        sendMessage(learnOption.toString(), () => setStep(2))
    }

    const sendDataset = () => {
        //dispatch({type:"LOADING", payload: {isLoading:true}})
        sendMessage(table.toString())
    }

    const radioGroupStyle = {
        flexGrow: 0.8,
        minWidth: 0.6
    }

    return (
        <MainLayout style={styles.container}>
            {step === 1 &&
            <View>
                <RadioForm style={radioGroupStyle}
                    radio_props={LEARNOPTIONS}
                    initial={0}
                    onPress={(value) => {setLearnOption(value)}}
                />
                <Button title={"Next"} onPress={() => sendMode()} disabled={!connected}/>
            </View>}

            {step === 2 && !state.isLoading &&
            <View>
                <RadioForm style={radioGroupStyle}
                    radio_props={tableOptions}
                    initial={0}
                    onPress={(value) => {setTable(value)}}
                />
                <Button title={"Next"} onPress={() => sendDataset()} disabled={!connected}/>
            </View>}

            {step === 3 &&
            <View>
                <RadioForm style={radioGroupStyle}
                    radio_props={DATASETOPTION}
                    initial={0}
                    onPress={(value) => {setAction(value)}}
                />
                <Button title={"Next"} onPress={() => sendDataset()} disabled={!connected}/>
            </View>}
        </MainLayout>
    );
}
