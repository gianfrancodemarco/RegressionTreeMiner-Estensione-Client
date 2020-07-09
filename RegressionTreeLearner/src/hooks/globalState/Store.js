import React, { createContext, useReducer } from "react";
import Reducer from './Reducer'


const initialState = {
    socket: null,
    tree: null,
    isLoading: false,
};

let tmpDispatch
const Store = ({ children }) => {
    const [state, dispatch] = useReducer(Reducer, initialState);
    tmpDispatch = dispatch
    return (
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    )
};

export const Context = createContext(initialState);
export default Store;

export const showLoading = (loading) => tmpDispatch({ type: "LOADING", payload: { isLoading: loading } })
