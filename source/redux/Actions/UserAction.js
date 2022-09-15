import {
    USER_INFO,
    ACCESS_TOKEN,
    PLACE_LIST,
    GET_USER_CURRENT_LOCATION,
    EMAIL,
    MOBILE_NUMBER,
    BIRTHDAY,
    NEW_USER,
    FULL_NAME,
    GENDER,
    CURRENT_STATUS,
    RELATIONSHIP_STATUS,
    INTEREST,
    ADD_PICTURE,
    SUBSCRIBE_NEWS_LETTER,
    LOGIN_TYPE,
    DEVICE_TOKEN,
    SOCIAL_ID,
    LOCATION,
    LOG_OUT,
    OTP_CONFIRM_RESULT,
  
} from "../Types";

//
export const setUserInfo = (user) => async(dispatch,getState) =>{
    dispatch({
        type:USER_INFO,
        payload:user
    })
}



export const getToken = (token) => async(dispatch,getState) =>{
    dispatch({
        type:ACCESS_TOKEN,
        payload:token
    })
}

export const getPlaces = (places) => async(dispatch,getState) =>{
    dispatch({
        type:PLACE_LIST,
        payload:places
    })
}

export const getUserCurrentLocation = (data) => async(dispatch,getState) =>{
    dispatch({
        type:GET_USER_CURRENT_LOCATION,
        payload:data
    })
}


export const setDeviceToken = (data) => async(dispatch,getState) => {
    dispatch({
        type:DEVICE_TOKEN,
        payload:data
    })
}

export const setSocialID = (data) => async(dispatch,getState) => {
    dispatch({
        type:SOCIAL_ID,
        payload:data
    })
}


export const setLoginType = (data) => async(dispatch,getState) => {
    dispatch({
        type:LOGIN_TYPE,
        payload:data
    })
}

export const setEmail = (data) => async(dispatch,getState) => {
    dispatch({
        type:EMAIL,
        payload:data
    })
}

export const setSubscribeNewsletter = (data) => async(dispatch,getState) => {
    dispatch({
        type:SUBSCRIBE_NEWS_LETTER,
        payload:data
    })
}

export const setMobileNumber = (data) => async(dispatch,getState) => {
    dispatch({
        type:MOBILE_NUMBER,
        payload:data
    })
}




export const setBirthDate = (data) => async(dispatch,getState) => {
    dispatch({
        type:BIRTHDAY,
        payload:data
    })
}

export const setIsNewUser = (data) => async(dispatch,getState) => {
    // console.log("Get User current location ",data);
    dispatch({
        type:NEW_USER,
        payload:data
    })
}

export const otpConfirmResult = (data) => async(dispatch,getState) => {
    // console.log("Get User current location ",data);
    dispatch({
        type:OTP_CONFIRM_RESULT,
        payload:data
    })
}




export const setFullName = (data) => async(dispatch,getState) => {
    dispatch({
        type:FULL_NAME,
        payload:data
    })
}

export const setGender = (data) => async(dispatch,getState) => {
    dispatch({
        type:GENDER,
        payload:data
    })
}


export const setCurrentStatus = (data) => async(dispatch,getState) => {
    dispatch({
        type:CURRENT_STATUS,
        payload:data
    })
}

export const setRelationShipStatus = (data) => async(dispatch,getState) => {
    dispatch({
        type:RELATIONSHIP_STATUS,
        payload:data
    })
}

export const setInterest = (data) => async(dispatch,getState) => {
    dispatch({
        type:INTEREST,
        payload:data
    })
}


export const setAddPicture = (data) => async(dispatch,getState) => {
    dispatch({
        type:ADD_PICTURE,
        payload:data
    })
}

export const setLocation = (data) => async(dispatch,getState) => {
    dispatch({
        type:LOCATION,
        payload:data
    })
}

export const resetData = (data) => async(dispatch,getState) => {
    dispatch({
        type:LOG_OUT,
        payload:''
    })
}



