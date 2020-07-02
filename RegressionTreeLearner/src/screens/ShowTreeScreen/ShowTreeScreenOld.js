import React from 'react';
import {SafeAreaView, View, StyleSheet} from 'react-native'
import Tree from '../../components/Tree';

export default function ShowTreeScreenOld() {

    const data = {
        label:'ciao',
        children: [
            {
                label: 'nested1',
                children: [
                    {
                        label: 'nested1'
                    },
                    {
                        label: 'nested2'
                    }
                ]
            },
            {
                label: 'nested2'
            },
            {
                label: 'nested1'
            },
            {
                label: 'nested2'
            },
        ]
    }

    return (
        <View>
            <Tree data={data} />
        </View>
    );
}
