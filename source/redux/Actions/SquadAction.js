
import {
    CREATE_SQUAD,
    SELECTED_USER,
    SET_GROUP_NAME,
    SET_GROUP_IMAGES,
    SET_GROUP_CITY,
    SET_GROUP_ZIP_CODE,
    SET_GROUP_RADIUS,
    SET_GROUP_INTEREST,
    SET_GROUP_WE_ARE,
    SET_GROUP_LOOKING_FOR
  } from "../Types";


export const setCreateSquad = (data) => async(dispatch,getState) =>{
    dispatch({
        type:CREATE_SQUAD,
        payload:data
    })
}

export const setSelectedUserId = (data) => async(dispatch,getState) =>{
    dispatch({
        type:SELECTED_USER,
        payload:data
    })
}

export const setGroupName = (data) => async(dispatch,getState) =>{
    dispatch({
        type:SET_GROUP_NAME,
        payload:data
    })
}

export const setGroupImages = (data) => async(dispatch,getState) =>{
    dispatch({
        type:SET_GROUP_IMAGES,
        payload:data
    })
}

export const setGroupCity = (data) => async(dispatch,getState) =>{
    dispatch({
        type:SET_GROUP_CITY,
        payload:data
    })
}


export const setGroupZipCode = (data) => async(dispatch,getState) =>{
    dispatch({
        type:SET_GROUP_ZIP_CODE,
        payload:data
    })
}

export const setGroupRadius = (data) => async(dispatch,getState) =>{
    dispatch({
        type:SET_GROUP_RADIUS,
        payload:data
    })
}

export const setGroupInterest = (data) => async(dispatch,getState) =>{
    dispatch({
        type:SET_GROUP_INTEREST,
        payload:data
    })
}

export const setGroupWeAre = (data) => async(dispatch,getState) =>{
    dispatch({
        type:SET_GROUP_WE_ARE,
        payload:data
    })
}

export const setGroupLookingFor = (data) => async(dispatch,getState) =>{
    dispatch({
        type:SET_GROUP_LOOKING_FOR,
        payload:data
    })
}





