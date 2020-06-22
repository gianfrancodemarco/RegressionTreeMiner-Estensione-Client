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
            }
        default:
            return state;
    }
};

export default Reducer;
