import React from 'react';
import ConnectScreen from './screens/ConnectScreen/ConnectScreen';
import {Router, Scene} from 'react-native-router-flux';
import MainLayout from './screens/MainLayout/MainLayout';
import Store from './hooks/globalState/Store';
import LoadDatasetScreen from './screens/LoadDatasetScreen/LoadDatasetScreen';

const AppRouter = () =>
        <Store>
            <Router>
                <Scene key="root" component={MainLayout}>
                    <Scene key="connectScreen" component={ConnectScreen} hideNavBar initial={true}/>
                    <Scene key="LoadDataset" component={LoadDatasetScreen} hideNavBar />
                </Scene>
            </Router>
        </Store>

export default AppRouter;
