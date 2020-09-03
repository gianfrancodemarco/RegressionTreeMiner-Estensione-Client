/**
 * @method Reducer
 *
 * @param state - lo stato attuale dell'app
 * @param action - operazione da eseguire e payload
 *
 *
 * Prende in input un'action e in base a action.type modifica lo stato globale del sistema con il contenuto di action.payload
 */
const Reducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_SOCKET':
            return {
                ...state,
                socket: action.payload.socket
            };
        case 'LOADING':
            return {
                ...state,
                isLoading: action.payload.isLoading
            };
        case 'TREE':
            return {
                ...state,
                tree: action.payload.tree
            };
        case 'RULES':
            return {
                ...state,
                rules: action.payload.rules
            }

        default:
            return state;
    }
};

export default Reducer;
