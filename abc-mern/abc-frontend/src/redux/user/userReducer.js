import {
    FETCH_USER_FAILURE,
    FETCH_USER_REQUEST,
    FETCH_USER_SUCCESS,
    ADD_CONTACT_FAILURE,
    ADD_CONTACT_REQUEST,
    ADD_CONTACT_SUCCESS,
    REMOVE_CONTACT_FAILURE,
    REMOVE_CONTACT_REQUEST,
    REMOVE_CONTACT_SUCCESS,
    LOGOUT,
    ADD_NEWMESSAGE_FAILURE,
    ADD_NEWMESSAGE_REQUEST,
    ADD_NEWMESSAGE_SUCCESS
} from "./userActionTypes"
import {getToken} from "./userTokenActions"
import jwt from "jsonwebtoken"
let initialUserState = {
    loading:false,
    user:{},
    error: "",
    isAuthenticated:false
}

const token = getToken()
if(token){
    try{
    
        let decodedUser = jwt.verify(token,process.env.REACT_APP_USER_PASSCODE)
        console.log("decoded user ",decodedUser)
        initialUserState = {
            loading:false,
            user: decodedUser,
            error: "",
            isAuthenticated: true
        }
    
    }catch(err){
        initialUserState = {
            loading:false,
            user: {},
            error: err.message,
            isAuthenticated: false
        }
    }
}

const userReducer = (state=initialUserState,action) => {
    switch(action.type){
        case FETCH_USER_FAILURE:
            return {
                ...state,
                loading:false,
                error:action.payload,
                user:state.user,
                isAuthenticated:false
            }
        case FETCH_USER_REQUEST:
            return {
                ...state,
                loading:true,
                error:"",
                user:state.user,
                isAuthenticated:false
            }
        case FETCH_USER_SUCCESS:
            return {
                ...state,
                loading:false,
                error:"",
                user:action.payload,
                isAuthenticated:true
            }
        case ADD_CONTACT_FAILURE:
            return {
                ...state,
                loading:false,
                error:action.payload,
                user:state.user,
                isAuthenticated:true
            }
        case ADD_CONTACT_REQUEST:
            return {
                ...state,
                loading:true,
                error:"",
                user:state.user,
                isAuthenticated:true
            }
        case ADD_CONTACT_SUCCESS:
            return {
                ...state,
                loading:false,
                error:"",
                user:action.payload,
                isAuthenticated:true
            }
        case REMOVE_CONTACT_FAILURE:
            return {
                ...state,
                loading:false,
                error:action.payload,
                user:state.user,
                isAuthenticated:true
            }
        case REMOVE_CONTACT_REQUEST:
            return {
                ...state,
                loading:true,
                error:"",
                user:state.user,
                isAuthenticated:true
            }
        case REMOVE_CONTACT_SUCCESS:
            return {
                ...state,
                loading:false,
                error:"",
                user:action.payload,
                isAuthenticated:true
            }
        case LOGOUT:
            return {
                ...state,
                loading:false,
                error:"",
                user: {},
                isAuthenticated:false
            }
        case ADD_NEWMESSAGE_FAILURE:
            return {
                ...state,
                loading:false,
                error:action.payload,
                user:state.user,
                isAuthenticated:true
            }
        case ADD_NEWMESSAGE_REQUEST:
            return {
                ...state,
                loading:true,
                error:"",
                user:state.user,
                isAuthenticated:true
            }
        case ADD_NEWMESSAGE_SUCCESS:
            return {
                ...state,
                loading:false,
                error:"",
                user:action.payload,
                isAuthenticated:true
            }
        default:
            return state
    }
} 

export default userReducer