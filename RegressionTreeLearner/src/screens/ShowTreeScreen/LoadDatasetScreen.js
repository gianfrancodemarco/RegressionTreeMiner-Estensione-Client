import React, {useState, useEffect, useContext} from 'react';
import styles from "./LoadDatasetScreenStyles";
import {
    View,
    Button
} from 'react-native';
import {LEARNOPTIONS} from '../../utils/Dataset';
import RadioForm from 'react-native-simple-radio-button';
import {Context} from '../../hooks/globalState/Store';
import {decodeMessage} from '../../utils/Utils';
import MainLayout from '../MainLayout/MainLayout';


export default function LoadDatasetScreen() {

    const [state, dispatch] = useContext(Context)
    const [connected, connect, sendMessage, client, closeConnection] = state.socket

    const [learnOption, setLearnOption] = useState(0)
    const [table, setTable] = useState(0)

    const sendMessageProps = {
        color: 'hsla(182, 24%, 86%, 1)',
        title: "Next",
    }

    const [step, setStep] = useState(1)
    const [tableOptions, setTableOptions] = useState()

    //ADD TABLE LISTENER
    const tableReceivedObserver = (data) => {
        const decoded = decodeMessage(data)
        const identifier = "[DATASETS]"

        if(decoded && decoded.indexOf(identifier) !== -1){
            let options = decoded.replace(identifier, "").split(";")
            options = options.map((el, index) => ({"label":el.replace('.dmp', ''), "value": index}))
            setTableOptions(options)
            client.off('data', tableReceivedObserver)
            dispatch({type:"LOADING", payload: {isLoading:false}})
        }
    }

    useEffect(() => {
        client.on('data', tableReceivedObserver)
    }, [])
    //////////////////////////////////////////////////////////////////////////////

    const sendMode = () => {
        dispatch({type:"LOADING", payload: {isLoading:true}})
        sendMessage(learnOption.toString(), () => setStep(2))
    }

    const sendDataset = () => {
        dispatch({type:"LOADING", payload: {isLoading:true}})
        sendMessage(table.toString())
    }

    return (
        <MainLayout style={styles.container}>
            {step == 1 &&
            <View>
                <RadioForm
                    radio_props={learnOptions}
                    initial={0}
                    onPress={(value) => {setLearnOption(value)}}
                />
                <Button title={"Next"} onPress={() => sendMode()} disabled={!connected}/>
            </View>}

            {step == 2 && tableOptions &&
            <View>
                <RadioForm
                    radio_props={tableOptions}
                    initial={0}
                    onPress={(value) => {setTable(value)}}
                />
                <Button onPress={() => sendDataset()} {...sendMessageProps} disabled={!connected}/>
            </View>}
        </MainLayout>
    );
}

const learnOptions = [
    {label: LEARNOPTIONS.FROMDATA.label, value: LEARNOPTIONS.FROMDATA.value },
    {label: LEARNOPTIONS.FROMARCHIVE.label, value: LEARNOPTIONS.FROMARCHIVE.value },
];

const dataSetOptions = [
    {label: LEARNOPTIONS.FROMDATA.label, value: LEARNOPTIONS.FROMDATA.value },
    {label: LEARNOPTIONS.FROMARCHIVE.label, value: LEARNOPTIONS.FROMARCHIVE.value },
];
