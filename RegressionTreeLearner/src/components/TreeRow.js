import TreeNode from "./TreeNode"
import React, {useState} from 'react'
import {SafeAreaView, View} from "react-native";


export default function TreeRow(props) {
    const [rootLayout, setRootLayout] = useState()
    const rowDetails = {
        numberOfNodes: props.elements.length,
        childrenPerNodes: [props.elements?.map(el => el.children?.length ?? 0)]
    }
    console.log({rootLayout})

    const style = props.rootLayout ? {position: 'absolute', top: props.rootLayout?.y + 150} : {}
    style.backgroundColor = 'red'

    let offset = (-props.elements.length/2)

    return (
        <View style={style}>
            <View style={{flexDirection: 'row'}}>
                {props.elements.map((el,index) => (
                    <TreeNode
                        offset={offset-index}
                        label={props.elements.length/*el.label*/}
                        onLayout={event => setRootLayout(event.nativeEvent.layout)}
                    />
                ))}
            </View>
                {props.elements.map(el => (el.children &&
                    <TreeRow elements={el.children} rootLayout={rootLayout}/>
                ))}
        </View>
    )
}
