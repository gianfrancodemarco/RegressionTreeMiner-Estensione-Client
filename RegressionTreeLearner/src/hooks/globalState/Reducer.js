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
            }

        default:
            return state;
    }
};

export default Reducer;
