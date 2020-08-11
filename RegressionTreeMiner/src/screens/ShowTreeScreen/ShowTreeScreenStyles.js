import {StyleSheet, StatusBar, Platform, Dimensions} from "react-native";
import {shadowContainerInnerView} from "../LoadDatasetScreen/LoadDatasetScreenStyles";

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
    }
});

const shadowContainer = {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height * 0.45,
    color: "#000",
    border: 10,
    radius: 1,
    opacity: 0.7,
    x: 0,
    y: -3,
    style: {
        marginVertical: 5, padding: 15
    }
}

export const white = {color: 'white'}
export const activeColor = 'hsla(220, 100%, 30%, 0.3)'
export const getButtonRules = (showRules) => ({
    title: 'Show Rules',
    color: showRules ? activeColor : 'hsla(220, 100%, 25%, 0.7)'
})

export const getButtonTree = (showTree) => ({
    title: 'Show Tree',
    color: showTree ? activeColor : 'hsla(220, 100%, 25%, 0.7)'
})

export const getButtonPredict = (showPredict) => ({
    title: 'Predict Class',
    color: showPredict ? activeColor : 'hsla(220, 100%, 25%, 0.7)'
})

export const customContainer = StyleSheet.create({
    flexGrow: 0.5
})

export default styles
