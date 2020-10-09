import {FETCH_CONTACT_CHAT} from "./contactChatActionTypes"

export const fetchContactChat = (data) =>{
    return{
        type:FETCH_CONTACT_CHAT,
        payload:data
    }
}

export const specificContactChat = (data) =>{
    return (dispatch)=>{
        dispatch(fetchContactChat(data))
    }
}