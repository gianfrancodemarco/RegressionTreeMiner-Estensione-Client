import {Dimensions, StyleSheet, StatusBar, Platform} from "react-native";

const styles = StyleSheet.create({
    innerContainer: {
        flex: 0.7,
        alignItems: 'center'
    },
    header: {
        fontSize: 25,
        color: 'hsla(203, 56%, 62%, 1)'
    },
    credits: {
        color: 'hsla(182, 24%, 86%, 1)',
        justifyContent: 'center'
    },
});


export const shadowContainer = {
    width: Dimensions.get('screen').width * 0.85,
    height: Dimensions.get('screen').height * 0.35,
    color: "#000",
    border: 10,
    radius: 1,
    opacity: 0.3,
    x: 0,
    y: -10,
    style: {marginVertical: 5}
}


export default styles
