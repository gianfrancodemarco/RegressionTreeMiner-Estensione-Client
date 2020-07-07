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


export default function ShowTreeScreen() {
    const [state, dispatch] = useContext(Context)
    const [showRules, setShowRules] = useState(true)
    const [showTree, setShowTree] = useState(false)


    const customContainer = StyleSheet.create({
        flexGrow: 0.5
    })


    const clickRules = () => {
        setShowTree(false)
        setShowRules(true)
    }

    const clickTree = () => {
        setShowRules(false)
        setShowTree(true)
    }

    const shadowContainer = {
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height * 0.45,
        color: "#000",
        border: 10,
        radius: 1,
        opacity: 0.7,
        x: 0,
        y: -3,
        style: {
            marginVertical: 5, padding: 15
        }
    }

    const white = {color: 'white'}
    const activeColor = 'hsla(220, 100%, 30%, 0.3)'
    const buttonRules = {
        title: 'Show Rules',
        color: showRules ? activeColor : 'hsla(220, 100%, 25%, 0.7)'
    }

    const buttonTree =  {
        title: 'Show Tree',
        color: showTree ? activeColor : 'hsla(220, 100%, 25%, 0.7)'
    }

    const buttonBack = {
        title: 'Back',
        color: 'hsla(220, 100%, 25%, 0.9)',
    }

    const buttonBackStyles = {
        color: 'white',
        width: 100,
        position: 'absolute',
        right: 0
    }

    const backHandler = () => {
        BackHandler.removeEventListener('hardwareBackPress', backHandler)
        Actions.replace('loadDataset')
    }

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', backHandler)
    }, [])

    return (
        <MainLayout customContainer={customContainer}>
                <View style={{width: Dimensions.get('window').width}}>
                        <View style={{flexDirection:'row', color: 'white'}}>
                            <Button {...buttonRules}  onPress={clickRules} />
                            <Button {...buttonTree}  onPress={clickTree} />
                        </View>
                        {/*<View style={buttonBackStyles}>
                            <Button {...buttonBack} onPress={() => Actions.replace('loadDataset', {step: 3} )} />
                        </View>*/}
                </View>
            <BoxShadow setting={shadowContainer}>
                <ScrollView style={{flex: 1}}>
                    {showTree && <Text style={white}>{state.tree}</Text>}
                    {showRules && <Text style={white}>{state.rules}</Text>}
                </ScrollView>
            </BoxShadow>
        </MainLayout>
    );
}
