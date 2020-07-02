import React from 'react';
import ConnectScreen from './screens/ConnectScreen/ConnectScreen';
import {Router, Scene} from 'react-native-router-flux';
import MainLayout from './screens/MainLayout/MainLayout';
import Store from './hooks/globalState/Store';
import LoadDatasetScreen from './screens/LoadDatasetScreen/LoadDatasetScreen';
import ShowTreeScreen from "./screens/ShowTreeScreen/ShowTreeScreen";

const AppRouter = () =>
        <Store>
            <Router>
                <Scene key="root" component={MainLayout}>
                    <Scene key="connectScreen" component={ConnectScreen} hideNavBar initial={true} />
                    <Scene key="loadDataset" component={LoadDatasetScreen} hideNavBar />
                    <Scene key="showTree" component={ShowTreeScreen} hideNavBar />
                </Scene>
            </Router>
        </Store>

export default AppRouter;
