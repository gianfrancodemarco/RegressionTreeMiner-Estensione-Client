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


export default function LoadDatasetScreen(props) {

    useEffect(() => console.log('Entering LoadDatasetScreen'), [])

    const [state, dispatch] = useContext(Context)

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

    const uploadFile = async () => {
        /* FilePickerManager.showFilePicker(null, (response) => {
             console.log('Response = ', response);

             if (response.didCancel) {
                 console.log('User cancelled file picker');
             }
             else if (response.error) {
                 console.log('FilePickerManager Error: ', response.error);
             }
             else {
                 this.setState({
                     file: response
                 });
             }
         });*/

        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
                //There can me more options as well
                // DocumentPicker.types.allFiles
                // DocumentPicker.types.images
                // DocumentPicker.types.plainText
                // DocumentPicker.types.audio
                // DocumentPicker.types.pdf
            });
            //Printing the log realted to the file
            console.log('res : ' + JSON.stringify(res));
            console.log('URI : ' + res.uri);
            console.log('Type : ' + res.type);
            console.log('File Name : ' + res.name);
            console.log('File Size : ' + res.size);
            //Setting the state to show single file attributes
            this.setState({singleFile: res});
        } catch (err) {
            //Handling any exception (If any)
            if (DocumentPicker.isCancel(err)) {
                //If user canceled the document selection
                alert('Canceled from single doc picker');
            } else {
                //For Unknown Error
                alert('Unknown Error: ' + JSON.stringify(err));
                throw err;
            }
        }
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
                                <CustomIcon name={"upload"} onPress={uploadFile} viewStyle={{paddingLeft: 9}} active/>
                                <Text style={white}>upload .sql/.dat file</Text>
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
