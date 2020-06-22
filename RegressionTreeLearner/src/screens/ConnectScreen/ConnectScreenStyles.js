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
        borderColor: "#20232a",
        height: 40,
        width: 150,
        padding: 10
    }
});

export default ConnectScreenStyles
