import {FETCH_CONTACT_CHAT} from "./contactChatActionTypes"
import jwt from "jsonwebtoken"
import {getToken} from "../user/userTokenActions"

              

let initialContactChatState = {
    id:"",
    user:"",
    contact:"",
    chats:[]
}
const token = getToken() 
if(token){
    let decodedUser = jwt.verify(token,process.env.REACT_APP_USER_PASSCODE)
    console.log(decodedUser)
    if(decodedUser.contacts.length === 0){
        initialContactChatState = {
            id:decodedUser._id,
            user:decodedUser.username,
            contact:"",
            chats: []
    }
}
else{
    initialContactChatState = {
        user:decodedUser.username,
        contact:decodedUser.contacts[0].username,
        chats: decodedUser.chats[decodedUser.contacts[0].username]
}
}


}


const contactChatReducer = (state=initialContactChatState,action) =>{
    switch(action.type){
        case FETCH_CONTACT_CHAT:
            return {
                id:action.payload.id,
                user:action.payload.user,
                contact:action.payload.contact,
                chats:action.payload.chats
            }
        default:
            return state
    }
}

export default contactChatReducer