import React, {useState, useContext, useEffect} from 'react';
import {
    View,
    Button,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    BackHandler
} from 'react-native';
import MainLayout from '../MainLayout/MainLayout';
import {Context} from "../../hooks/globalState/Store";
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
import {radioGroupStyle, shadowContainer, shadowContainerInnerView} from "../LoadDatasetScreen/LoadDatasetScreenStyles";


export default function ShowTreeScreen() {
    const [state, dispatch] = useContext(Context)
    const [showRules, setShowRules] = useState(true)
    const [showTree, setShowTree] = useState(false)


    //PREDICT CLASS
    const [connected, connect, sendMessage, client, closeConnection] = state.socket
    const [showPredict, setShowPredict] = useState(false)
    const [options, setOptions] = useState()
    const [split, setSplit] = useState(0)

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

        if (decoded && decoded.indexOf(MESSAGES.QUERY) !== -1){
            let options = decoded.replace(MESSAGES.QUERY, '').trim().split('\n').map(el => ({label: el}))
            setOptions(options.map((el, index )=> ({
                value: index,
                label: el.label.substring(el.label.indexOf(':') + 1, el.label.length)})))
        }


        if(decoded && decoded.indexOf(MESSAGES.END) !== -1){

        }
    }


    const predictForm =
            <RadioForm
                {...radioGroupStyle}
                radio_props={options}
                initial={0}
                onPress={setSplit}
            />


    return (
        <MainLayout customContainer={customContainer}>
                <View style={{width: Dimensions.get('window').width}}>
                        <View style={{flexDirection:'row', ...white}}>
                            <Button {...getButtonRules(showRules)}  onPress={clickRules} />
                            <Button {...getButtonTree(showTree)}  onPress={clickTree} />
                            <Button {...getButtonPredict(showPredict)}  onPress={clickPredict} />
                        </View>
                </View>
            <BoxShadow setting={{...shadowContainer, height: fullHeight}}>
                <View style={shadowContainerInnerView}>
                    <ScrollView>
                        {showTree && <Text style={white}>{state.tree}</Text>}
                        {showRules && <Text style={white}>{state.rules}</Text>}
                        {showPredict && predictForm}
                    </ScrollView>
                </View>
            </BoxShadow>
        </MainLayout>
    );
}

const fullHeight = Dimensions.get('screen').height * 0.50
