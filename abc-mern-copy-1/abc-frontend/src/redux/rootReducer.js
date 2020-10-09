import {combineReducers} from "redux"
import userReducer from "./user/userReducer"
import contactChatReducer from "./contactChat/contactChatReducer"

const rootReducer = combineReducers({user:userReducer,contactChat:contactChatReducer})

export default rootReducer