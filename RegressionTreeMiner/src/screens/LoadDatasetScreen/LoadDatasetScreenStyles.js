import {Dimensions, StyleSheet} from "react-native";

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

export const shadowContainerInnerView = {padding: 35, flexGrow: 1}


export const shadowContainer = {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height * 0.45,
    color: "#000",
    border: 10,
    radius: 1,
    opacity: 0.5,
    x: 0,
    y: -2,
    style: {marginVertical: 5}
}



export const radioGroupStyle = {
    flexGrow: 0.8,
    minWidth: 0.6,
    labelColor: 'white',
    selectedLabelColor: 'white',
    buttonColor: 'hsla(203, 56%, 50%, 1)',
    selectedButtonColor: 'hsla(203, 56%, 50%, 1)',
    marginTop: 10
}

export const getNextButton = (connected) => ({
    title: 'Next',
    disabled: !connected,
    color: 'hsla(215, 67%, 34%, 1)'
})

export const getRestartButton = (connected) => ({
    title: 'Restart',
    disabled: !connected,
    color: 'hsla(215, 67%, 34%, 1)'
})

export const nextButtonContainer = {
    position: 'absolute',
    bottom: 70,
    width: 200,
    alignSelf: 'center',
}

export const nextButtonContainerPredict = {
    position: 'absolute',
    bottom: 120,
    width: 200,
    alignSelf: 'center',
}


export default styles
