import React, {useState} from 'react'
import {StyleSheet, SafeAreaView, ScrollView} from 'react-native'
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
        flexGrow: 1
    }


    return (
        <SafeAreaView>
            <ScrollView
                bounces={true}
                bouncesZoom={true}
                maximumZoomScale={2.0}
                minimumZoomScale={0.5}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={contentContainerStyle}
            >
                <TreeNode label={props.data.label} />
                <TreeNode label={props.data.label} />
                <TreeNode label={props.data.label} />
                <TreeNode label={props.data.label} />
                <TreeNode label={props.data.label} />
                <TreeNode label={props.data.label} />
                <TreeNode label={props.data.label} />
                <TreeNode label={props.data.label} />
                <TreeNode label={props.data.label} />
                <TreeNode label={props.data.label} />
                <TreeNode label={props.data.label} />
                <TreeNode label={props.data.label} />
                <TreeNode label={props.data.label} />

                {props.data.children && <TreeRow elements={props.data.children} />}
            </ScrollView>
        </SafeAreaView>
    )

}
