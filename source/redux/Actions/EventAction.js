import {SET_EVENT_PARTICIPANT} from '../Types'

export const setEventParticipant = (users) => async(dispatch,getState) =>{
    dispatch({
        type:SET_EVENT_PARTICIPANT,
        payload:users
    })
}