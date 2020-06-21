import React, {useState} from 'react';
import styles from "./SecondScreenStyles";
import {
    Text,
    SafeAreaView,
    View,
    Button,
    TextInput
} from 'react-native';
import {LEARNOPTIONS} from '../../utils/Dataset';
import RadioForm from 'react-native-simple-radio-button';



export default function SecondScreen(props) {

    const [connected, connect, sendMessage, closeConnection] = [...props.data]

    const [learnOption, setLearnOption] = useState(0)
    const [tableName, setTableName] = useState("")
    const sendMessageProps = {
        color: 'hsla(182, 24%, 86%, 1)',
        title: "Send Message",
    }

    const [step, setStep] = useState(1)


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.innerContainer}>
                <Text style={styles.header}>
                    RegressionTreeLearner
                </Text>
                <Text style={styles.credits}>
                    Second Screen
                </Text>
            </View>
            {step == 1 &&
            <View>
                <RadioForm
                    radio_props={learnOptions}
                    initial={0}
                    onPress={(value) => {setLearnOption(value)}}
                />
                <Button title={"Next"} onPress={() => sendMessage(learnOption.toString(), () => setStep(2))} disabled={!connected}/>
            </View>}

            {step == 2 &&
            <View>
                <TextInput
                    style={styles.hostInput}
                    value={tableName}
                    onChangeText={tableName => setTableName(tableName)}
                />
                <Button onPress={() => sendMessage(tableName)} {...sendMessageProps} disabled={!connected}/>
            </View>}


        </SafeAreaView>
    );
}

const learnOptions = [
    {label: LEARNOPTIONS.FROMARCHIVE.label, value: LEARNOPTIONS.FROMARCHIVE.value },
    {label: LEARNOPTIONS.FROMDATA.label, value: LEARNOPTIONS.FROMDATA.value },
];
