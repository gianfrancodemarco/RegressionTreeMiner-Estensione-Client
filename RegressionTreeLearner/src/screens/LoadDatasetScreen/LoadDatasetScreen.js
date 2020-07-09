import React, {useState, useEffect, useContext} from 'react';
import styles, {shadowContainer} from "./LoadDatasetScreenStyles";
import {
    View,
    Button,
    BackHandler
} from 'react-native';
import {DATASETOPTION, LEARNOPTIONS, MESSAGES} from '../../utils/Dataset';
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
        BackHandler.addEventListener('hardwareBackPress', backHandler)
    }, [])

    //ADD TABLE LISTENER
    const tableReceivedObserver = (data) => {
        const decoded = decodeMessage(data)

        if (decoded && decoded.indexOf(MESSAGES.DATASETS) !== -1) {
            let options = decoded.replace(MESSAGES.DATASETS, "").split(";")
            options = options.map((el, index) => ({"label": el.replace('.dmp', ''), "value": index}))
            setOptions(options)
            client.off('data', tableReceivedObserver)
            client.on('data', treeReceivedObserver)
            showLoading(false)
        }
    }
    useEffect(() => {
        client.on('data', tableReceivedObserver)
    }, [])
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
            dispatch({type: "RULES", payload: {rules: decoded.replace(MESSAGES.TREE, '')}})
            showLoading(false)
            BackHandler.removeEventListener('hardwareBackPress', backHandler)
            Actions.replace('showTree')
        }
    }

    const sendSelection = () => {
        showLoading(true)
        sendMessage(selection.toString(), () => setStep(step + 1))
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
        let tmpOptions

        tmpOptions = step === 1 ? LEARNOPTIONS : options

        return options ? <RadioForm
            {...radioGroupStyle}
            labelStyle={{fontFamily:'sans-serif-light'}}
            buttonSize={25}
            radio_props={tmpOptions.map(el => ({...el, label: el.label.toUpperCase()}))}
            initial={0}
            onPress={setSelection}
        />: <></>

    }

    return (
        <MainLayout style={styles.container}>
            <BoxShadow setting={shadowContainer}>
                <View style={{padding: 15, flex: 1}}>
                    {getRadioButton()}

                    <View style={nextButtonContainer}>
                        <Button {...nextButton} onPress={() => {sendSelection()}}/>
                    </View>

                </View>
            </BoxShadow>
        </MainLayout>
    );
}
