import {StyleSheet, StatusBar, Platform} from "react-native";

const ConnectScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: Platform?.OS.toLowerCase() === "android" ? StatusBar.currentHeight + 50: 20
    },
    background: {
        flex: 1,
        resizeMode: "cover"
    },
    hostInput: {
        borderWidth : 1.5,
        borderColor: 'hsla(215, 67%, 34%, 1)',
        height: 40,
        padding: 10,
        color: 'white',
        textAlign: 'center'
    }
});

export default ConnectScreenStyles
