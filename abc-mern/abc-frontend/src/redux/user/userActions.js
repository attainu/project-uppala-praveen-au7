import {
    FETCH_USER_FAILURE,
    FETCH_USER_REQUEST,
    FETCH_USER_SUCCESS,
    ADD_CONTACT_FAILURE,
    ADD_CONTACT_REQUEST,
    ADD_CONTACT_SUCCESS,
    ADD_NEWMESSAGE_FAILURE,
    ADD_NEWMESSAGE_REQUEST,
    ADD_NEWMESSAGE_SUCCESS,
    REMOVE_CONTACT_FAILURE,
    REMOVE_CONTACT_REQUEST,
    REMOVE_CONTACT_SUCCESS,
    NEWMESSAGE_RECEIVED_FAILURE,
    NEWMESSAGE_RECEIVED_REQUEST,
    NEWMESSAGE_RECEIVED_SUCCESS,
    LOGOUT
} from "./userActionTypes"
import axios from "axios"
import {setToken,removeToken,setHomeToken,getHomeToken,removeHomeToken,getToken} from "./userTokenActions"
import jwt from "jsonwebtoken"

export const fetchUserRequest = () => {
    return {
        type: FETCH_USER_REQUEST
    }
}

export const fetchUserFailure = (error) => {
    return {
        type: FETCH_USER_FAILURE,
        payload: error
    }
}

export const fetchUserSuccess = (user) => {
    return {
        type:FETCH_USER_SUCCESS,
        payload: user
    }
}


export const fetchUser = ({username,password},cb) =>{
    return (dispatch) =>{
        dispatch(fetchUserRequest())
        axios.post("http://localhost:5000/app/v1/home/login",{username:username,password:password})
        .then(response=>{
            console.log('fetch user response',response.data)
            if(response.data.success){
                let contacts = []
                // let size = response.data.data.contacts.length
                for(let i of response.data.data.contacts){
                    let contact = {}
                    contact.username = i.username
                    contact.email = i.email
                    contact.active = i.active
                    contact.lastSeen = i.lastSeen
                    contacts.push(contact)
                }
                console.log('fetch user contacts',contacts)
                let user = {}
                user = {...response.data.data,contacts:contacts}

                const token = response.data.token
                dispatch(fetchUserSuccess(user))
                console.log(user)
                setToken(user)
                setHomeToken(token)
                cb(user._id)
            }else{
                dispatch(fetchUserFailure(response.data.message))
            }
        }).catch(error=>{
            dispatch(fetchUserFailure(error.message))
        })
    }
}

export const addContactFailure = (error) => {
    return{
        type: ADD_CONTACT_FAILURE,
        payload:error
    }
}

export const addContactRequest = () => {
    return {
        type: ADD_CONTACT_REQUEST,

    }
}

export const addContactSuccess = (user)=>{
    return {
        type: ADD_CONTACT_SUCCESS,
        payload:user
    }
}

export const addContact = ({id,email},cb) => {
    return (dispatch) => {
        dispatch(addContactRequest())
        const token = getHomeToken()
        axios.patch(`http://localhost:5000/app/v1/user/${id}?addContact=${email}`,{email:email},{headers:{'Authorization':`Bearer ${token}`}})
        .then(response=>{
            console.log('add contact response',response.data)
            let contacts = []
            // let size = response.data.data.contacts.length
            for(let i of response.data.data.contacts){
                let contact = {}
                contact.username = i.username
                contact.email = i.email
                contact.active = i.active
                contact.lastSeen = i.lastSeen
                contacts.push(contact)
            }
            console.log('add contact contacts',contacts)
            let user = {}
            user = {...response.data.data,contacts:contacts}
            const homeToken = response.data.token
            if(response.data.success){
                dispatch(addContactSuccess(user))
                setToken(user)
                setHomeToken(homeToken)
                cb(user.contacts)
            }else{
                dispatch(addContactFailure(response.data.message))
                setHomeToken(homeToken)
            }
        })
        .catch(error=>{
            dispatch(addContactFailure(error.message))
        })
    }
}

export const removeContactFailure = (error) => {
    return{
        type: REMOVE_CONTACT_FAILURE,
        payload:error
    }
}

export const removeContactRequest = () => {
    return {
        type: REMOVE_CONTACT_REQUEST,

    }
}

export const removeContactSuccess = (user)=>{
    return {
        type: REMOVE_CONTACT_SUCCESS,
        payload:user
    }
}

export const removeContact = ({id,email},cb) => {
    return (dispatch) => {
        dispatch(removeContactRequest())
        const token = getHomeToken()
        axios.patch(`http://localhost:5000/app/v1/user/${id}?removeContact=${email}`,{email:email},{headers:{'Authorization':`Bearer ${token}`}})
        .then(response=>{
            const homeToken = response.data.token
            if(response.data.success){
                let contacts = []
                // let size = response.data.data.contacts.length
                for(let i of response.data.data.contacts){
                    let contact = {}
                    contact.username = i.username
                    contact.email = i.email
                    contact.active = i.active
                    contact.lastSeen = i.lastSeen
                    contacts.push(contact)
                }
                console.log('remove contact contacts',contacts)
                let user = {}
                user = {...response.data.data,contacts:contacts}
                
                dispatch(removeContactSuccess(user))
                setToken(user)
                setHomeToken(homeToken)
                cb(user.contacts)
            }else{
                dispatch(removeContactFailure(response.data.message))
                setHomeToken(homeToken)
            }
        })
        .catch(error=>{
            dispatch(removeContactFailure(error.message))
        })
    }
}

export const addNewMessageRequest = () => {
    return {
        type: ADD_NEWMESSAGE_REQUEST
    }
}

export const addNewMessageFailure = (error) =>{
    return{
        type:ADD_NEWMESSAGE_FAILURE,
        payload:error
    }
}

export const addNewMessageSuccess = (user)=>{
    return {
        type:ADD_NEWMESSAGE_SUCCESS,
        payload:user
    }
}

export const addNewMessage = (id,newMessage,cb) => {
    return (dispatch) => {
        dispatch(addNewMessageRequest())
        const token = getHomeToken()
        const userToken = getToken()
        const decodedUser = jwt.verify(userToken,process.env.REACT_APP_USER_PASSCODE)
        axios.patch(`http://localhost:5000/app/v1/user/${decodedUser._id}?contact=${newMessage.receiver}&newMessage=${newMessage.message}`,{...newMessage},{
            headers:{"Authorization":`Bearer ${token}`}
        })
        .then(response=>{
            console.log(response.data)
            const homeToken = response.data.token
            if(response.data.success){
                let contacts = []
                // let size = response.data.data.contacts.length
                console.log('add message contacts before extraction',response.data.data.contacts)
                
                for(let i of response.data.data.contacts){
                    let contact = {}
                    contact.username = i.username
                    contact.email = i.email
                    contact.active = i.active
                    contact.lastSeen = i.lastSeen
                    contacts.push(contact)
                }
                console.log('add message contacts',contacts)
                let user = {}
                user = {...response.data.data,contacts:contacts}
                // let index = user.chats.length -1
                let nMessageSize = user.chats[newMessage.receiver].length
                let nMessage = user.chats[newMessage.receiver][nMessageSize-1]
                dispatch(addNewMessageSuccess(user))
                setToken(user)
                setHomeToken(homeToken)
                cb(nMessage)
            }else{
                console.log('some error while adding message', response.data)
                dispatch(addNewMessageFailure(response.data.message))
                setHomeToken(homeToken)
            }
        })
        .catch(error=>{
            dispatch(addNewMessageFailure(error.message))
        })
    }
}


export const newMessageReceivedFailure = (error) => {
    return {
        type:NEWMESSAGE_RECEIVED_FAILURE,
        payload:error
    }
}

export const newMessageReceivedRequest = () => {
    return {
        type: NEWMESSAGE_RECEIVED_REQUEST
    }
}

export const newMessageReceivedSuccess = (user) => {
    return {
        type: NEWMESSAGE_RECEIVED_SUCCESS,
        payload:user
    }
} 

export const newMessageReceived = (newMessage) => {
    return (dispatch) => {
        dispatch(newMessageReceivedRequest())
        try{
            const userToken = getToken()
            const decodedUser = jwt.verify(userToken,process.env.REACT_APP_USER_PASSCODE)
            const createdUser = {...decodedUser}
            console.log('new message received in user actions ',decodedUser,decodedUser.chats,newMessage,createdUser)

            createdUser.chats[newMessage.newMessage.sender].push(newMessage)
            let user = {}
            console.log('keys ',Object.keys(createdUser))
            let userKeys = Object.keys(createdUser)
            userKeys.splice(userKeys.indexOf('iat'),1)
            userKeys.splice(userKeys.indexOf('exp'),1)
            console.log(`index of iat ${userKeys.indexOf('iat')} and index of exp ${userKeys.indexOf('exp')}`)
            for(let i of userKeys){
                if(String(i) !== "iat" || String(i)!== "exp"){
                    console.log(i)
                     user[i] = createdUser[i]}
            }
            dispatch(newMessageReceivedSuccess(user))
            console.log('final user',user)
            setToken(user)
        }catch(err){
            dispatch(newMessageReceivedFailure(err.message))
        }

    }
}


export const logout = () => {
    return{
        type: LOGOUT
    }
}

export const logoutUser = () =>{
    return (dispatch)=>{
        const token = getHomeToken()
        axios.patch('http://localhost:5000/app/v1/home/logout/',{token:token},{headers:{
            "Authorization": `Bearer ${token}`
        }})
        .then(response=>{
            dispatch(logout())
            removeToken()
            removeHomeToken()
            localStorage.clear()
            console.log(response)
        })
    }
}