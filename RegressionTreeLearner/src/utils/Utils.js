export const decodeMessage = (message) => message.toString('utf-8')
export const readFile = (uri, callback) => {
    const RNFS = require("react-native-fs");
    RNFS.readFile(uri, "base64").then(data => {
        // binary data
        if (callback)
            callback(data)
    });
}
