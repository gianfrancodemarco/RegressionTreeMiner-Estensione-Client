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
import {decodeMessage, readFile} from '../../utils/Utils';
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

    const [state, dispatch] = useContext(Context)
    const [showToast] = useToast()

    const [step, setStep] = useState(props.step ? props.step : 1)

    const [options, setOptions] = useState([])
    const [selection, setSelection] = useState(0)

    //useGlobalState -> RICOSTRUISCE LA SOCKET PARTENDO DA QUELLA CONSERVATA NELLO STATO
    const [connected, connect, sendMessage, client, closeConnection, error] = useGlobalState(useSocket(
        {
                connected: state.socket[0],
                error: state.socket[5],
                client: state.socket[3]
        }), "UPDATE_SOCKET", "socket")


    useEffect(() => {
        if(error){
            showLoading(false)
            Actions.replace('error')
        }
    }, [error])

    const backHandler = () => {
        if(step === 1){
            Actions.replace('connectScreen')
            BackHandler.removeEventListener('hardwareBackPress', backHandler)
        }else {
            setStep(1)
            setSelection(null)
            setOptions([])
        }
        return true
    }

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', backHandler)
        client.on('data', tableReceivedObserver)
    }, [])

    //FLOW: tables -> rules -> tree ---> Tree Screen

    //ADD TABLE LISTENER
    const tableReceivedObserver = (data) => {
        const decoded = decodeMessage(data)

        if (decoded && decoded.indexOf(MESSAGES.DATASETS) !== -1) {
            let options = decoded.replace(MESSAGES.DATASETS, "")
            console.log(options)
            options = options.trim().length > 0
                ? options.split(";").map((el, index) => ({"label": el.replace('.dmp', '').trim(), "value": index}))
                : []
            setOptions(options)

            if(options.length){
                client.off('data', tableReceivedObserver)
                client.on('data', rulesReceiverObserver)
            }
            showLoading(false)
        }
    }
    //////////////////////////////////////////////////////////////////////////////

    //ADD TREE LISTENER
    const treeReceivedObserver = (data) => {
        const decoded = decodeMessage(data)
        const endTree = () => {
            showLoading(false)
            client.off('data', treeReceivedObserver)
            BackHandler.removeEventListener('hardwareBackPress', backHandler)
            Actions.replace('showTree')
        }

        if (decoded){
            if(decoded.indexOf(MESSAGES.TREE) !== -1){
                if(decoded.indexOf(MESSAGES.END_TREE) !== -1){
                    dispatch({type: "TREE", payload: {tree: decoded.replace(MESSAGES.TREE, '').replace(MESSAGES.END_TREE, '')}})
                    endTree()
                }else dispatch({type: "TREE", payload: {tree: decoded.replace(MESSAGES.TREE, '')}})
            }else if(decoded.indexOf(MESSAGES.END_TREE) !== -1){
                dispatch({type: "TREE", payload: {tree: state.tree.concat(decoded.replace(MESSAGES.END_TREE, ''))}})
                endTree()
            }
        }
    }
    //////////////////////////////////////////////////////////////////////////////

    //ADD RULES LISTENER
    const rulesReceiverObserver = (data) => {
        const decoded = decodeMessage(data)

        if (decoded && decoded.indexOf(MESSAGES.RULES) !== -1) {
            client.off('data', rulesReceiverObserver)
            client.on('data', treeReceivedObserver)
            dispatch({type: "RULES", payload: {rules: decoded.replace(MESSAGES.RULES, '')}})
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

        console.log({tmpOptions})
        if (!state.isLoading && tmpOptions.length === 0){
            showToast('No elements returned by the server')
            setStep(1)
            return <></>
        }

        else return options ? <RadioForm
            {...radioGroupStyle}
            labelStyle={{fontFamily:'sans-serif-light'}}
            buttonSize={30}
            radio_props={tmpOptions.map(el => ({...el, label: el.label.toUpperCase()}))}
            initial={0}
            onPress={setSelection}
        />: <></>

    }

    // ************** ACQUIRE NEW DATASET ************** //
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
            if (DocumentPicker.isCancel(err)) console.log('Canceled from single doc picker')
            else showToast(err)
        }
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
    // ************************************************ //

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
