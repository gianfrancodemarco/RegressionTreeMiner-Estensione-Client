import React, {useMemo} from "react";
import { ToastAndroid } from "react-native";

/**
 *
 * Fornisce delle API per la visualizzazione di toast(messaggi) su Android
 * @class useToast
 */
export default function useToast(){
    const showToast = (message) => ToastAndroid.show(message, ToastAndroid.LONG);


    const showToastWithGravity = (message) =>
        ToastAndroid.showWithGravity(
            message,
            ToastAndroid.LONG,
            ToastAndroid.CENTER
        );


    const showToastWithGravityAndOffset = (message) =>
        ToastAndroid.showWithGravityAndOffset(
            message,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
        );

    return useMemo(() => [showToast, showToastWithGravity, showToastWithGravityAndOffset])

};
