import React, {useState, useContext, useEffect} from 'react';
import {
    View,
    Button,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    BackHandler,
    TouchableOpacity
} from 'react-native';
import MainLayout from '../MainLayout/MainLayout';
import {Context, showLoading} from "../../hooks/globalState/Store";
import {BoxShadow} from "react-native-shadow";
import {Actions} from 'react-native-router-flux'
import {decodeMessage} from "../../utils/Utils";
import RadioForm from "react-native-simple-radio-button";
import {MESSAGES} from "../../utils/Dataset";
import {
    customContainer,
    getButtonPredict,
    getButtonRules,
    getButtonTree,
    white
} from "./ShowTreeScreenStyles";
import {
    getNextButton, getRestartButton, nextButtonContainer, nextButtonContainerPredict,
    radioGroupStyle,
    shadowContainer,
    shadowContainerInnerView
} from "../LoadDatasetScreen/LoadDatasetScreenStyles";
import useGlobalState from "../../hooks/globalState/useGlobalState";
import useSocket from "../../hooks/useSocket";
import CustomIcon from "../../components/CustomIcon/CustomIcon";
import Spinner from "react-native-loading-spinner-overlay";


export default function ShowTreeScreen() {
    const [state, dispatch] = useContext(Context)
    const [showRules, setShowRules] = useState(true)
    const [showTree, setShowTree] = useState(false)


    //useGlobalState -> RICOSTRUISCE LA SOCKET PARTENDO DA QUELLA CONSERVATA NELLO STATO
    const [connected, connect, sendMessage, client, closeConnection, error] = useGlobalState(useSocket(
        {
            connected: state.socket[0],
            error: state.socket[5],
            client: state.socket[3]
        }), "UPDATE_SOCKET", "socket")

    //PREDICT CLASS
    const [showPredict, setShowPredict] = useState(false)
    const [options, setOptions] = useState()
    const [split, setSplit] = useState(0)
    const [leafValue, setLeafValue] = useState(null)

    useEffect(() => {
        if(error){
            showLoading(false)
            Actions.replace('error')
        }
    }, [error])

    const clickPredict = () => {
        setShowTree(false)
        setShowRules(false)
        setShowPredict(true)
    }

    const clickRules = () => {
        setShowTree(false)
        setShowPredict(false)
        setShowRules(true)
    }

    const clickTree = () => {
        setShowPredict(false)
        setShowRules(false)
        setShowTree(true)
    }

    const backHandler = () => {
        sendMessage(MESSAGES.INTERRUPT_PREDICTION)
        BackHandler.removeEventListener('hardwareBackPress', backHandler)
        Actions.replace('loadDataset')
    }

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', backHandler)
        sendMessage(MESSAGES.START_PREDICTION)
        client.on('data', predictClassObserver)
    }, [])


    const predictClassObserver = (data) => {
        const decoded = decodeMessage(data)

        console.log(decoded)

        if (decoded && decoded.indexOf(MESSAGES.QUERY) !== -1){
            let options = decoded.replace(MESSAGES.QUERY, '').trim().split('\n').map(el => ({label: el}))
            setOptions(options.map((el, index )=> ({
                value: index,
                label: el.label.substring(el.label.indexOf(':') + 1, el.label.length)})))
        }


        if(decoded && decoded.indexOf(MESSAGES.END) !== -1){
            console.log({decoded})
            setLeafValue(decoded.replace(MESSAGES.END, '').trim())
        }
    }

    const sendPredict = () => sendMessage(split.toString())


    const restartPredict = () => {
        sendMessage("[START PREDICTION]")
        setOptions([])
        setSplit(0)
        setLeafValue(null)
    }

    const predictForm = () => {
        if (options.length === 0) {
            return <Spinner
                visible={true}
                textContent={'Loading...'}
                textStyle={{color: 'white'}}
            />
        }


        else if (leafValue === null)
            return <>
                <ScrollView style={{flexGrow: 0.65}}>
                    <RadioForm
                        {...radioGroupStyle}
                        labelStyle={{fontFamily: 'sans-serif-light'}}
                        buttonSize={30}
                        radio_props={options}
                        initial={0}
                        onPress={setSplit}
                    />
                </ScrollView>
                <View style={nextButtonContainerPredict}>
                    <Button {...getNextButton(connected)} onPress={() => {
                        sendPredict()
                    }}/>
                </View>
            </>


    else return <>
                <View style={{height: Dimensions.get("screen").height * 0.25, alignItems: "center"}}>
                    <Text style={{...white, fontSize: 25, fontStyle: "italic"}}>Predicted value :</Text>
                    <Text style={{...white, fontSize: 40, fontWeight: "bold"}}> {leafValue}</Text>
                </View>
                <View style={nextButtonContainerPredict}>
                    <Button {...getRestartButton(connected)} onPress={restartPredict} />
                </View>
            </>
    }

    return (
        <MainLayout customContainer={customContainer}>
            <View style={{display: "flex", flexDirection: "row"}}>
                <CustomIcon name={"edit"}  active={showRules} onPress={clickRules} viewStyle={{paddingLeft: 9}} />
                <CustomIcon name={"tree"}  active={showTree} onPress={clickTree}  viewStyle={{paddingLeft: 10, paddingTop: 3}} />
                <CustomIcon name={"plus"}  active={showPredict}onPress={clickPredict} />
            </View>
            <BoxShadow setting={{...shadowContainer, height: fullHeight}}>
                <View style={shadowContainerInnerView}>
                    {!showPredict && <ScrollView>
                        {showTree && <ScrollView horizontal={true}>
                            <Text style={white}>{state.tree.concat("\n\n")}</Text>
                        </ScrollView>}
                        {showRules && <ScrollView horizontal={true}>
                            <Text style={white}>{state.rules.concat("\n\n")}</Text>
                        </ScrollView>}
                    </ScrollView>}
                    {showPredict && predictForm()}
                </View>

            </BoxShadow>
        </MainLayout>
    );
}

const fullHeight = Dimensions.get('screen').height * 0.50
