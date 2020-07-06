import React, {useState, useEffect, useContext} from 'react';
import {
    View,
    Button,
    Text,
    StyleSheet,
    ScrollView
} from 'react-native';
import MainLayout from '../MainLayout/MainLayout';
import {Context} from "../../hooks/globalState/Store";
import {Actions} from 'react-native-router-flux'


export default function ShowTreeScreen() {
    const [state, dispatcher] = useContext(Context)
    const [showRules, setShowRules] = useState(false)
    const [showTree, setShowTree] = useState(false)


    const customContainer = StyleSheet.create({
        flexGrow: 0.2
    })

    const customInnerContainer = StyleSheet.create({
        padding: 50
    })


    return (
        <MainLayout customContainer={customContainer} customInnerContainer={customInnerContainer}>
            <View style={{flex: 0.9}}>
                <View style={{flexDirection: 'row'}}>
                    <Button title={'Show Rules'} onPress={() => {
                        if(!showRules) setShowTree(false)
                        setShowRules(!showRules)
                    }} />
                    <Button title={'Show Tree'}  onPress={() => {
                        if(!showTree) setShowRules(false)
                        setShowTree(!showTree)
                    }} />
                </View>
                <ScrollView>
                    {showTree && <Text>{state.tree}</Text>}
                    {showRules && <Text>{state.rules}</Text>}
                </ScrollView>
                <Button title={'Back'} onPress={() => Actions.replace('loadDataset')} />

            </View>
        </MainLayout>
    );
}
