import React, {useState, useEffect, useContext} from 'react';
import styles, {
    getNextButton,
    nextButtonContainer,
    radioGroupStyle,
    shadowContainer,
    shadowContainerInnerView
} from "./LoadDatasetScreenStyles";
import {
    View,
    Button,
    BackHandler
} from 'react-native';
import {LEARNOPTIONS, MESSAGES} from '../../utils/Dataset';
import RadioForm from 'react-native-simple-radio-button';
import {Context, showLoading} from '../../hooks/globalState/Store';
import {decodeMessage} from '../../utils/Utils';
import MainLayout from '../MainLayout/MainLayout';
import {Actions} from 'react-native-router-flux'
import {BoxShadow} from "react-native-shadow";

export default function LoadDatasetScreen(props) {

    const [state, dispatch] = useContext(Context)
    const [connected, connect, sendMessage, client, closeConnection] = state.socket

    const [step, setStep] = useState(props.step ? props.step : 1)
    const [options, setOptions] = useState([])
    const [selection, setSelection] = useState(0)


    const backHandler = () => {
        Actions.replace('connectScreen')
        BackHandler.removeEventListener('hardwareBackPress', backHandler)
    }

    useEffect(() => {
        console.log('Selection', {selection})
    }, [selection])

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', backHandler)
        client.on('data', tableReceivedObserver)
    }, [])

    //FLOW: tables -> tree -> rules ---> Tree Screen

    //ADD TABLE LISTENER
    const tableReceivedObserver = (data) => {
        const decoded = decodeMessage(data)

        if (decoded && decoded.indexOf(MESSAGES.DATASETS) !== -1) {
            let options = decoded.replace(MESSAGES.DATASETS, "").split(";")
            options = options.map((el, index) => ({"label": el.replace('.dmp', '').trim(), "value": index}))
            setOptions(options)
            client.off('data', tableReceivedObserver)
            client.on('data', treeReceivedObserver)
            showLoading(false)
        }
    }
    //////////////////////////////////////////////////////////////////////////////

    //ADD TREE LISTENER
    const treeReceivedObserver = (data) => {
        const decoded = decodeMessage(data)

        if (decoded && decoded.indexOf(MESSAGES.TREE) !== -1) {
            client.off('data', tableReceivedObserver)
            dispatch({type: "TREE", payload: {tree: decoded.replace(MESSAGES.TREE, '')}})
            client.on('data', rulesReceiverObserver)
        }
    }
    //////////////////////////////////////////////////////////////////////////////

    //ADD RULES LISTENER
    const rulesReceiverObserver = (data) => {
        const decoded = decodeMessage(data)

        if (decoded && decoded.indexOf(MESSAGES.RULES) !== -1) {
            client.off('data', rulesReceiverObserver)
            dispatch({type: "RULES", payload: {rules: decoded.replace(MESSAGES.RULES, '')}})
            showLoading(false)
            BackHandler.removeEventListener('hardwareBackPress', backHandler)
            Actions.replace('showTree')
        }
    }

    const sendSelection = () => {
        showLoading(true)
        sendMessage(selection.toString(), () => setStep(step + 1))
        setSelection(0)
    }

    const getRadioButton = () =>  {
        let tmpOptions

        tmpOptions = step === 1 ? LEARNOPTIONS : options

        return options ? <RadioForm
            {...radioGroupStyle}
            labelStyle={{fontFamily:'sans-serif-light'}}
            buttonSize={30}
            radio_props={tmpOptions.map(el => ({...el, label: el.label.toUpperCase()}))}
            initial={0}
            onPress={setSelection}
        />: <></>

    }

    return (
        <MainLayout style={styles.container}>
            <BoxShadow setting={shadowContainer}>
                <View style={shadowContainerInnerView}>
                    {getRadioButton()}
                    <View style={nextButtonContainer}>
                        <Button {...getNextButton(connected)} onPress={() => {sendSelection()}}/>
                    </View>
                </View>
            </BoxShadow>
        </MainLayout>
    );
}
