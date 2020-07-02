import React from 'react';
import {SafeAreaView, View, StyleSheet} from 'react-native'
import Tree from '../../components/Tree';

export default function ShowTreeScreen() {

    const data = {
        label:'ciao',
        children: [
            {
                label: 'child1',
                children: [
                    {
                        label: 'nested1',
                        children: [{label:'SUPER NESTED'}]
                    },
                    {
                        label: 'nested2',
                        /*children: [{label:'SUPER NESTED'}]*/
                    },
                ]
            }
        ]
    }

    return (
        <View>
            <Tree data={data} />
        </View>
    );
}
