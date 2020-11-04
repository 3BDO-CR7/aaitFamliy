import { combineReducers } from "redux"
import lang from './LangReducer';
import auth from './AuthReducer';
import profile from './ProfileReducer';

export default combineReducers({
    lang,
    auth,
    profile
});