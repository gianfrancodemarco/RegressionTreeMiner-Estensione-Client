import React, {useState, useEffect, useContext} from 'react';
import styles from "./ShowTreeScreenStyles";
import {
    View,
    Button,
    Text,
    SafeAreaView,
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
                <Button title={'Show Rules'} onPress={() => setShowRules(!showRules)} />
                <Button title={'Show Tree'}  onPress={() => setShowTree(!showTree)} />

                {showRules && <ScrollView>
                    <Text>{state.rules}</Text>
                </ScrollView>}

                {showTree && <ScrollView>
                    <Text>{state.tree}</Text>
                </ScrollView>}
            </View>
            <Button title={'Back'} onPress={Actions.loadDataset} />
        </MainLayout>
    );
}
