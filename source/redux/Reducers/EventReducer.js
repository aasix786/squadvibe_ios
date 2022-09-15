import {SET_EVENT_PARTICIPANT} from '../Types'

const defaultState = {arrEventParticipant:[]}

export default(state=defaultState,action)=>{
    switch(action.type){
        case SET_EVENT_PARTICIPANT:
          return Object.assign({},state,{arrEventParticipant:action.payload})
        default:
          return state;
      }
}