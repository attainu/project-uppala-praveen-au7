import jwt from "jsonwebtoken"

export const setToken = (user) =>{
    const token = jwt.sign(user,process.env.REACT_APP_USER_PASSCODE,{expiresIn:"24h"})
    localStorage.setItem("userToken", token);
}

export const getToken = () => {
    return localStorage.getItem("userToken")
}
export const removeToken = () => {
    localStorage.removeItem("userToken")
}

export const setHomeToken = (token) => {
    localStorage.setItem("homeToken",token)
}

export const getHomeToken = (token) =>{
    return localStorage.getItem("homeToken")
}

export const removeHomeToken = () => {
    localStorage.removeItem("homeToken")
}