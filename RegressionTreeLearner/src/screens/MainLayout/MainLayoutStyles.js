import {Platform, StatusBar, StyleSheet} from "react-native";

const MainLayoutStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: Platform?.OS.toLowerCase() === "android" ? StatusBar.currentHeight + 50: 20
    },
    innerContainer: {
        flex: 0.7,
        alignItems: 'center'
    },
    header: {
        fontWeight: 'bold',
        fontSize: 25,
        color: 'hsla(203, 56%, 50%, 1)'
    },

    credits: {
        fontFamily: 'sans-serif-light', //sans-serif-thin
        //color: 'hsla(182, 24%, 86%, 1)',
        fontStyle: 'italic',
        fontSize: 20,
        color: 'white',
        justifyContent: 'center'
    },
    cardContainer: {
        backgroundColor: '#000'
    }
})

export default MainLayoutStyles
