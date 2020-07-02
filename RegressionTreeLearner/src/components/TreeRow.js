import TreeNode from "./TreeNode"
import React, {useState} from 'react'
import {SafeAreaView, View} from "react-native";


export default function TreeRow(props) {
    const [rootLayout, setRootLayout] = useState()
    console.log({rootLayout})

    const style = props.rootLayout ? {position: 'absolute', top: props.rootLayout?.y + 100} : {}
    style.backgroundColor = 'red'

    let baseOffset = props.elements.length % 2 === 0 ? 0.5 : 0
    let halfElements = Math.floor(props.elements.length/2)
    //working formula
    //halfElements - (props.elements.length - index) + baseOffset

    return (
        <View style={style}>
            <View style={{flexDirection: 'row'}}>
                {props.elements.map((el, index) => <TreeNode
                            index={index}
                            offset={(halfElements - (props.elements.length - index) + baseOffset)}
                            label={el.label}
                            onLayout={event => setRootLayout(event.nativeEvent.layout)}
                        />
                    )
                }
            </View>
                {props.elements.map(el => (el.children &&
                    <TreeRow
                        elements={el.children}
                        rootLayout={rootLayout}
                    />
                ))}
        </View>
    )
}
