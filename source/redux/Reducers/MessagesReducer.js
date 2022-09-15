import { CHAT_LIST,BLOCK_USER, MESSAGE } from "../Types";

const defaultState = {
  arrUsers:{},
  arrBlockUser:[],
  message : {}
}

export default(state=defaultState,action)=>{
    switch(action.type){
        case CHAT_LIST:
          return Object.assign({},state,{arrUsers:action.payload})
        case BLOCK_USER:
            return Object.assign({},state,{arrBlockUser:action.payload})
        case MESSAGE:
          return Object.assign({},state,{message:action.payload})
        default:
          return state;
      }
}