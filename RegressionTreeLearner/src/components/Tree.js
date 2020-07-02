import React, {useState} from 'react'
import {StyleSheet, SafeAreaView, ScrollView, Dimensions} from 'react-native'
import TreeNode from './TreeNode';
import TreeRow from "./TreeRow";


export default function Tree(props) {

    const TreeStyle = StyleSheet.create({
        root: {
            alignItems: 'center',
            flex: 1
        }
    })

    const contentContainerStyle = {
        alignItems: 'center',
        backgroundColor: 'blue',
        height: Dimensions.get('window').height
    }


    return (
        <SafeAreaView>
            <ScrollView contentContainerStyle={contentContainerStyle} >
                <TreeNode
                    label={props.data.label}
                />
                <TreeRow elements={props.data.children} />
            </ScrollView>
        </SafeAreaView>
    )

}
