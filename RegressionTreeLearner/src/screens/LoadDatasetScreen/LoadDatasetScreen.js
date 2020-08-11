import React, {useState, useEffect, useContext} from 'react';
import styles, {
    getNextButton,
    nextButtonContainer,
    radioGroupStyle,
    shadowContainer,
    shadowContainerInnerView
} from "./LoadDatasetScreenStyles";
import {
    Dimensions,
    Text,
    View,
    Button,
    BackHandler,
    ScrollView
} from 'react-native';
import {LEARNOPTIONS, MESSAGES} from '../../utils/Dataset';
import RadioForm from 'react-native-simple-radio-button';
import {Context, showLoading} from '../../hooks/globalState/Store';
import {decodeMessage} from '../../utils/Utils';
import MainLayout from '../MainLayout/MainLayout';
import {Actions} from 'react-native-router-flux'
import {BoxShadow} from "react-native-shadow";
import useGlobalState from "../../hooks/globalState/useGlobalState";
import useSocket from "../../hooks/useSocket";
import {white} from "../ShowTreeScreen/ShowTreeScreenStyles";
import CustomIcon from "../../components/CustomIcon/CustomIcon";
import DocumentPicker from "react-native-document-picker";
import useToast from "../../hooks/useToast";

export default function LoadDatasetScreen(props) {

    useEffect(() => console.log('Entering LoadDatasetScreen'), [])

    const [state, dispatch] = useContext(Context)
    const [showToast, showToastWithGravity, showToastWithGravityAndOffset] = useToast()

    //useGlobalState -> RICOSTRUISCE LA SOCKET PARTENDO DA QUELLA CONSERVATA NELLO STATO
    const [connected, connect, sendMessage, client, closeConnection, error] = useGlobalState(useSocket(
        {
                connected: state.socket[0],
                error: state.socket[5],
                client: state.socket[3]
        }), "UPDATE_SOCKET", "socket")


    const [step, setStep] = useState(props.step ? props.step : 1)
    const [options, setOptions] = useState([])
    const [selection, setSelection] = useState(0)

    const [file, setFile] = useState()

    useEffect(() => {
        if(error){
            showLoading(false)
            Actions.replace('error')
        }
    }, [error])

    const backHandler = () => {
        Actions.replace('connectScreen')
        BackHandler.removeEventListener('hardwareBackPress', backHandler)
    }

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

    const selectFile = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles]
            });
            console.log('URI : ' + res.uri);
            console.log('File Name : ' + res.name);

            const extension = res.name.substring(res.name.indexOf('.'), res.name.length).toLowerCase()
            if(extension !== '.sql' && extension !== '.dat')
                throw 'Please select a file with .sql or .dat extension'
            readFile(res.uri, data => uploadFile(data, res.name))
        } catch (err) {
            //Handling any exception (If any)
            if (DocumentPicker.isCancel(err)) console.log('Canceled from single doc picker')
            else showToast(err)
        }
    }

    const readFile = (uri, callback) => {
        const RNFS = require("react-native-fs");
        RNFS.readFile(uri, "base64").then(data => {
            // binary data
            if (callback)
                callback(data)
        });
    }

    //ADD file upload observer
    const fileUploadObserver = (data) => {
        const decoded = decodeMessage(data)
        if (decoded && decoded.indexOf(MESSAGES.UPLOAD) !== -1) {
            client.off('data', fileUploadObserver)
            if(decoded.replace(MESSAGES.UPLOAD, '').trim() === "KO"){
                showToast("Error! Check the file and try again")
            }else showToast("Success")
        }

        showLoading(false)
    }

    const uploadFile = (file, filename) => {
        showLoading(true)
        sendMessage("3")
        setTimeout(() => sendMessage(JSON.stringify({filename, file})), 1000)
        client.on('data', fileUploadObserver)
    }

    return (
        <MainLayout style={styles.container}>
            <BoxShadow setting={shadowContainer}>
                <View style={shadowContainerInnerView}>
                    <ScrollView style={{flexGrow: 0.8}}>
                        {getRadioButton()}
                        {step === 1 &&
                            <View style={{width: Dimensions.get('window').width * 0.82, alignItems: "center"}}>
                                <Text style={white}>or</Text>
                                <CustomIcon name={"upload"} onPress={selectFile} viewStyle={{paddingLeft: 9}} active/>
                                <Text style={white}>upload .sql/.dat file (up to 64kb)</Text>
                            </View>
                        }
                    </ScrollView>
                    <View style={nextButtonContainer}>
                        <Button {...getNextButton(connected)} onPress={() => {sendSelection()}}/>
                    </View>
                </View>
            </BoxShadow>
        </MainLayout>
    );
}
