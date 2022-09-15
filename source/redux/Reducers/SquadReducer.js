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

const defaultState = {
  create_squad: {},
  arrSelectedUser: [],
  group_name: '',
  group_images: [],
  group_city: '',
  group_zipCode: '',
  group_radius: '',
  group_interest: '',
  group_we_are: '',
  group_looking_for: '',
}


export default (state = defaultState, action) => {
  switch (action.type) {
    case CREATE_SQUAD:
      return Object.assign({}, state, { create_squad: action.payload })
    case SELECTED_USER:
      return Object.assign({}, state, { arrSelectedUser: action.payload })
    case SET_GROUP_NAME:
      return Object.assign({}, state, { group_name: action.payload })
    case SET_GROUP_IMAGES:
      return Object.assign({}, state, { group_images: action.payload })
    case SET_GROUP_CITY:
      return Object.assign({}, state, { group_city: action.payload })
    case SET_GROUP_ZIP_CODE:
      return Object.assign({}, state, { group_zipCode: action.payload })
    case SET_GROUP_RADIUS:
      return Object.assign({}, state, { group_radius: action.payload })
    case SET_GROUP_INTEREST:
      return Object.assign({}, state, { group_interest: action.payload })
    case SET_GROUP_WE_ARE:
      return Object.assign({}, state, { group_we_are: action.payload })
    case SET_GROUP_LOOKING_FOR:
      return Object.assign({}, state, { group_looking_for: action.payload })

    default:
      return state;
  }
}