import React from 'react'
import {View, Text, StyleSheet, ScrollView} from 'react-native';


export default function Tree(props) {

    const size = 75
    const contentContainerStyle = {
        justifyContent: "center",
        alignItems: "center",
    }

    const rounded = {
        borderRadius: size,
        width: size,
        height: size,
        backgroundColor: "yellow", //"#AAA",
        marginRight: 20,
    }

    const style = props.offset ? {position: 'relative', right: parseInt(props.offset) * size} : {}
    console.log({style})

    return (
        <View
            contentContainerStyle={contentContainerStyle}
            style={{...rounded, ...style}}
            onLayout={props.onLayout}
        >
            <Text>{style.right}</Text>
        </View>
    )

}
