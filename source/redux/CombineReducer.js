import {combineReducers} from 'redux';
import UserReducer from '../redux/Reducers/UserReducer';
import SquadReducer from '../redux/Reducers/SquadReducer';
import EventReducer from '../redux/Reducers/EventReducer';
import MessageReducer from '../redux/Reducers/MessagesReducer';

export default combineReducers({
  user: UserReducer,
  manage_squad: SquadReducer,
  event:EventReducer,
  message : MessageReducer
});
