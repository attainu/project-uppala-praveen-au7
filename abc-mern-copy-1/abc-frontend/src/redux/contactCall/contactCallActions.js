import {CALL_CONTACT} from "./contactCallActionTypes"



export const callContact = (data) => {
    return {
        type: MAKE_CALL_SUCCESS,
        payload:data
    }
}

export const makeCall = (data) => {
    return (dispatch) => {
        dispatch(callContact(data))
    }
}