import React from 'react';
import ConnectScreen from './screens/ConnectScreen/ConnectScreen';
import {Router, Scene} from 'react-native-router-flux';
import Store from './hooks/globalState/Store';
import LoadDatasetScreen from './screens/LoadDatasetScreen/LoadDatasetScreen';
import ShowTreeScreen from "./screens/ShowTreeScreen/ShowTreeScreen";
import ErrorScreen from "./screens/ErrorScreen/ErrorScreen";

const AppRouter = () =>

        <Store>
            <Router>
                <Scene key="root">
                    <Scene key="connectScreen" component={ConnectScreen} hideNavBar initial={true}/>
                    <Scene key="loadDataset" component={LoadDatasetScreen} hideNavBar/>
                    <Scene key="showTree" component={ShowTreeScreen} hideNavBar/>
                    <Scene key="error" component={ErrorScreen} hideNavBar/>
                </Scene>
            </Router>
        </Store>

export default AppRouter;
