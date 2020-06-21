import React from 'react';
import ConnectScreen from './screens/ConnectScreen/ConnectScreen';
import {Router, Scene} from 'react-native-router-flux';
import SecondScreen from './screens/SecondScreen/SecondScreen';
import styles from './screens/SecondScreen/SecondScreenStyles';
import {SafeAreaView, View, Text} from 'react-native';
import Layout from './screens/Layout';

const AppRouter = () =>
        <Router>
            <Scene key="root" component={Layout}>
                <Scene key="connectScreen" component={ConnectScreen} hideNavBar initial={true}/>
                <Scene key="secondScreen" component={SecondScreen} hideNavBar />
            </Scene>
        </Router>


/*
<SafeAreaView style={styles.container}>
        <View style={styles.innerContainer}>
            <Text style={styles.header}>
                RegressionTreeLearner
            </Text>
            <Text style={styles.credits}>
                by Gianfranco Demarco
            </Text>
        </View>
</SafeAreaView>
 */
export default AppRouter;
