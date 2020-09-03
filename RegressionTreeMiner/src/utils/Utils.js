/**
 *
 * Racchiude metodi di utilità
 * @class Utils
 */


/**
 * @method decodeMessage
 * @param message - il messaggio da decodificare
 *
 * Riceve in input i byte del messaggio e restituisce la stringa utf-8 corrispondente
 */
export const decodeMessage = (message) => message.toString('utf-8')

/**
 * @method decodeMessage
 * @param uri - l'uri della risorsa (file) da leggere
 * @param callback - eventuale funzione di callback da chiamare al termine della lettura della risposta
 *
 * Legge un file dal file system, quindi chiama @callback passando in input i byte letti
 */
export const readFile = (uri, callback) => {
    const RNFS = require("react-native-fs");
    RNFS.readFile(uri, "base64").then(data => {
        // binary data
        if (callback)
            callback(data)
    });
}
