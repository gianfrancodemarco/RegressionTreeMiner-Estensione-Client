import React from 'react'
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {round} from "react-native-reanimated";


export default function Tree(props) {

    const size = 50
    const contentContainerStyle = {
        justifyContent: "center",
        alignItems: "center",
    }

    const rounded = {
        borderRadius: size,
        width: size,
        height: size,
        backgroundColor: "yellow", //"#AAA",
        marginRight: 0,
        justifyContent: "center",
        alignItems: "center"
    }

    rounded.position = 'relative'
    rounded.marginRight = 0//props.offset ? props.offset * size : 0

    return (
        <View
            contentContainerStyle={contentContainerStyle}
            style={{...rounded}}
            onLayout={props.onLayout}
        >
            <Text>{rounded.marginRight}</Text>
        </View>
    )

}
