import React, {useState, useEffect, useContext} from 'react';
import styles, {shadowContainer} from "./LoadDatasetScreenStyles";
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
import {BoxShadow} from "react-native-shadow";

export default function LoadDatasetScreen() {

    const [state, dispatch] = useContext(Context)
    const [connected, connect, sendMessage, client, closeConnection] = state.socket

    const [learnOption, setLearnOption] = useState(0)
    const [table, setTable] = useState(0)


    const [step, setStep] = useState(1)
    const [tableOptions, setTableOptions] = useState([])
    const [action, setAction] = useState()

    //ADD TABLE LISTENER
    const tableReceivedObserver = (data) => {
        const decoded = decodeMessage(data)
        const identifier = "[DATASETS]"

        if (decoded && decoded.indexOf(identifier) !== -1) {
            let options = decoded.replace(identifier, "").split(";")
            options = options.map((el, index) => ({"label": el.replace('.dmp', ''), "value": index}))
            setTableOptions(options)
            client.off('data', tableReceivedObserver)
            client.on('data', treeReceivedObserver)
            dispatch({type: "LOADING", payload: {isLoading: false}})
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

        if (decoded && decoded.indexOf(identifier) !== -1) {
            client.off('data', tableReceivedObserver)
            dispatch({type: "TREE", payload: {tree: decoded.replace(identifier, '')}})
            client.on('data', rulesReceiverObserver)
            dispatch({type: "LOADING", payload: {isLoading: false}})
        }
    }

    //////////////////////////////////////////////////////////////////////////////

    //ADD TREE LISTENER
    const rulesReceiverObserver = (data) => {
        const decoded = decodeMessage(data)
        const identifier = "[RULES]"

        if (decoded && decoded.indexOf(identifier) !== -1) {
            console.log('Received rules', decoded)
            client.off('data', rulesReceiverObserver)
            dispatch({type: "RULES", payload: {rules: decoded.replace(identifier, '')}})
            Actions.replace('showTree')
        }
    }


    const sendMode = () => {
        dispatch({type: "LOADING", payload: {isLoading: true}})
        sendMessage(learnOption.toString(), () => setStep(2))
    }

    const sendDataset = () => {
        //dispatch({type:"LOADING", payload: {isLoading:true}})
        sendMessage(table.toString())
    }

    const radioGroupStyle = {
        flexGrow: 0.8,
        minWidth: 0.6,
        labelColor: 'white',
        selectedLabelColor: 'white',
        buttonColor: 'hsla(203, 56%, 50%, 1)',
        selectedButtonColor: 'hsla(203, 56%, 50%, 1)',
        marginTop: 10
    }

    const nextButton = {
        title: 'Next',
        disabled: !connected,
        color: 'hsla(215, 67%, 34%, 1)'
    }

    const nextButtonContainer = {
        position: 'absolute',
        bottom: 30,
        width: 200,
        alignSelf: 'center',
    }

    const getRadioButton = () =>  {
        let options

        if (step === 1) options = LEARNOPTIONS
        else if (step === 2) options = tableOptions
        else options = DATASETOPTION

        return options ? <RadioForm
            {...radioGroupStyle}
            labelStyle={{fontFamily:'sans-serif-light'}}
            buttonSize={25}
            radio_props={options.map(el => ({...el, label: el.label.toUpperCase()}))}
            initial={0}
            onPress={(value) => {
                setLearnOption(value)
            }}
        />: <></>

    }

    return (
        <MainLayout style={styles.container}>
            <BoxShadow setting={shadowContainer}>
                <View style={{padding: 15, flex: 1}}>
                    {getRadioButton()}

                    <View style={nextButtonContainer}>
                        <Button {...nextButton} onPress={() => step === 1 ? sendMode() : sendDataset()}/>
                    </View>

                </View>
            </BoxShadow>
        </MainLayout>
    );
}
