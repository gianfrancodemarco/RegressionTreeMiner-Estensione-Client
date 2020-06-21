import {StyleSheet, StatusBar, Platform} from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 0.8,
        alignItems: 'center',
        marginTop: Platform?.OS.toLowerCase() === "android" ? StatusBar.currentHeight + 50: 20
    },
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

export default styles
