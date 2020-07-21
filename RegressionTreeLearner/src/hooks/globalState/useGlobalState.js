import React, {useContext, useMemo, useEffect} from 'react'
import {Context} from "./Store";

export default function useGlobalState(props, action, object) {
    const [state, dispatch] = useContext(Context)

    let payload = {}
    payload[object] = [...props]

    useEffect(() => {
        dispatch({type: action, payload: payload})
    }, [...props])

    return useMemo(() => [...props], [...props])
}
