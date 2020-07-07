import React, {useContext} from 'react';
import {Dimensions, ImageBackground, SafeAreaView, StatusBar, Text, View} from 'react-native';
import MainLayoutStyles from './MainLayoutStyles';
import {Context} from '../../hooks/globalState/Store';
import Spinner from 'react-native-loading-spinner-overlay';

export default function MainLayout(props) {

    const [state, dispatch] = useContext(Context);
    return (
        <>
            <StatusBar hidden />
            <ImageBackground source={props.backgroud ? props.backgroud : require('../../assets/121410.jpg')}
                             style={{width: Dimensions.get('window').width, height: Dimensions.get('screen').height}}>
                <SafeAreaView style={MainLayoutStyles.container}>
                    <View style={props.customContainer ? {...MainLayoutStyles.innerContainer, ...props.customContainer} : MainLayoutStyles.innerContainer}>
                        <Text style={MainLayoutStyles.header}>
                            REGRESSION TREE LEARNER
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
                                textStyle={{color: 'white'}}
                            />
                        ) :
                        (
                            <View
                                style={props.customInnerContainer ? props.customInnerContainer : MainLayoutStyles.innerContainer}>
                                {props.children}
                            </View>
                        )
                    }
                </SafeAreaView>
            </ImageBackground>
        </>
    );
}
