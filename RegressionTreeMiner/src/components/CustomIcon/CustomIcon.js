import Icon from "react-native-vector-icons/FontAwesome";
import {View, TouchableOpacity} from "react-native";
import React from 'react';
import {BoxShadow} from "react-native-shadow";

/**
 * Componente custom per la renderizzazione di icone
 * @class CustomIcon
 *
 */
export default function CustomIcon(props){
    const defaultViewStyle = {
        borderRadius: 60,
        height: 60,
        width: 60,
        backgroundColor: props.active ? 'white' : '#999',
        margin: 15,
        textAlign: "center",
        paddingLeft: 12,
        paddingTop: 4
    }


    const viewStyle = {...defaultViewStyle,  ...props.viewStyle}
    const iconShadow = {
        width: 50,
        height: 30,
        color: "#000",
        border: 10,
        radius: 20,
        opacity: 0.3,
        x: 5,
        y: 5,
        style: {marginVertical: 5}
    }

    return  <TouchableOpacity onPress={props.onPress} borderWidth={1} style={{textAlign: "center"}}>
        <View style={viewStyle} >
            <BoxShadow setting={{...iconShadow, height: 40}}>
                    <Icon name={props.name} size={props.size ? props.size : 45} color={props.color ? props.color : "#1d3557ff"} />
            </BoxShadow>
        </View>
    </TouchableOpacity>

}
