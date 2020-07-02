import React, {useContext} from 'react';
import {SafeAreaView, View, Text} from 'react-native';
import MainLayoutStyles from './MainLayoutStyles';
import {Context} from '../../hooks/globalState/Store';
import Spinner from 'react-native-loading-spinner-overlay';

export default function MainLayout(props) {

    const [state, dispatch] = useContext(Context);

    return (
        <SafeAreaView style={MainLayoutStyles.container}>
            <View style={props.customContainer ? props.customContainer : MainLayoutStyles.innerContainer}>
                <Text style={MainLayoutStyles.header}>
                    RegressionTreeLearner
                </Text>
                <Text style={MainLayoutStyles.credits}>
                    by Gianfranco Demarco
                </Text>
            </View>
            {state.isLoading ?
                    (
                    <Spinner
                        visible={true}
                        textContent={'Loading...'}
                        //textStyle={styles.spinnerTextStyle}
                    />
                ) :
                (
                    <View style={props.customInnerContainer ? props.customInnerContainer : MainLayoutStyles.innerContainer}>
                        {props.children}
                    </View>
                )
            }
        </SafeAreaView>
    );

}
