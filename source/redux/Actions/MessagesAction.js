import { CHAT_LIST,BLOCK_USER,  MESSAGE } from '../Types';
//
export const getChatUsers = (users) => async(dispatch,getState) =>{
    dispatch({
        type:CHAT_LIST,
        payload:users
    })
}

export const getBlockUsers = (users) => async(dispatch,getState) =>{
    dispatch({
        type:BLOCK_USER,
        payload:users
    })
}


export const setMessage = (data) => (dispatch, getState) => {
    console.log("SETTT", data, MESSAGE)
    dispatch({
        type : MESSAGE,
        payload : data
    })
}


