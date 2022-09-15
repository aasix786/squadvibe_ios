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
  LOG_OUT,
  LOCATION,
  OTP_CONFIRM_RESULT
} from '../Types';

const defaultState = {
  userInfo: '', 
  token: '', 
  currentLocation: '',
  login_type: '',
  social_Id: '',
  device_token: '',
  email: '',
  mobile_number: '',
  birthDate: '',
  isNewUser: false,
  full_name: '',
  gender: '',
  current_status: '',
  relation_ship_status: '',
  interest: '',
  add_picture: [],
  subscribe_newsletter: '',
  otp_confirm_result:''
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case USER_INFO:
      return Object.assign({}, state, { userInfo: action.payload })
    case ACCESS_TOKEN:
      return Object.assign({}, state, { token: action.payload })
    case GET_USER_CURRENT_LOCATION:
      return Object.assign({}, state, { currentLocation: action.payload })
    case LOGIN_TYPE:
      return Object.assign({}, state, { login_type: action.payload })
    case SOCIAL_ID:
      return Object.assign({}, state, { social_Id: action.payload })
    case DEVICE_TOKEN:
      return Object.assign({}, state, { device_token: action.payload })
    case EMAIL:
      return Object.assign({}, state, { email: action.payload })
    case MOBILE_NUMBER:
      return Object.assign({}, state, { mobile_number: action.payload })
    case BIRTHDAY:
      return Object.assign({}, state, { birthDate: action.payload })
    case NEW_USER:
      return Object.assign({}, state, { isNewUser: action.payload })
    case FULL_NAME:
      return Object.assign({}, state, { full_name: action.payload })
    case GENDER:
      return Object.assign({}, state, { gender: action.payload })
    case CURRENT_STATUS:
      return Object.assign({}, state, { current_status: action.payload })
    case RELATIONSHIP_STATUS:
      return Object.assign({}, state, { relation_ship_status: action.payload })
    case INTEREST:
      return Object.assign({}, state, { interest: action.payload })
    case ADD_PICTURE:
      return Object.assign({}, state, { add_picture: action.payload })
    case SUBSCRIBE_NEWS_LETTER:
      return Object.assign({}, state, { subscribe_newsletter: action.payload })
    case LOCATION:
      return Object.assign({}, state, { location: action.payload })
    case LOG_OUT:
        return defaultState
    case OTP_CONFIRM_RESULT:
        return Object.assign({}, state, { otp_confirm_result: action.payload })
        
    default:
      return state;
  }
}