import React,{useEffect} from 'react'
import {Switch,Route} from "react-router-dom"

import Login from "./Login/Login"
import Signup from "./Signup/Signup"
import LandingNav from "./LandingNav/LandingNav"
import classes from "./LandingPage.module.css"
import axios from 'axios'
import VerifyEmail from './VerifyEmail/VerifyEmail'
import ResetPassword from './ResetPassword/ResetPassword'


const LandingPage = (props) => {
    let notification = ""
    let message = ""
    let error = ""
    useEffect(()=>{
        console.log(window.location)
        if(window.location.search || window.location.pathname.includes('resetPassword')){
   if(window.location.search.split("=")[0]==="?register"){
        const obtainedToken = window.location.search.split("=")[1]
        if(obtainedToken){
            axios.post("https://abc-app-123.herokuapp.com/app/v1/home/register",{token:obtainedToken})
        .then(response=>{
            if(response.data.success){message = response.data.message
                error = ""}
            else {error = response.data.error
                message=""}})
        .catch(error=>{console.error(error)
            error = error.message
            message = ""
        })
        }
        notification = message.length>0?message:error
   }else if(window.location.pathname.includes("resetPassword")){
    const obtainedToken = window.location.pathname.split("resetPassword/")[1]
    // if(obtainedToken){
    //     axios.post("http://localhost:5000/app/v1/home/resetPassword",{token:obtainedToken})
    // .then(response=>{
    //     if(response.data.success){
    //         message = response.data.message
    //         error=""}

    //     else {error = response.data.error
    //         message=""}
    //     })
    // .catch(error=>{console.error(error)
    //     error = error.message
    //     message = ""
    // })
    // }
    // notification = message.length>0?message:error
    props.history.push(`/resetPassword/${obtainedToken}`)
   }
    
}
else {
    props.history.push('/login')
} 
},[])
    return (
        
            <div className={classes.landing_page}>
                <LandingNav/>
            <Switch>
                <Route path="/" exact render={(props)=>{
                    console.log('start props',props)
                    return <LandingPage {...props} />}} ><div style={message.length>0 || error.length>0?{display:"block"}:{display:"none"}} className={message.length>0?classes.verification_message:classes.verification_error}><h3 className={classes.message}>{notification}</h3></div></Route>
                <Route path="/signup" exact render={(props)=><Signup {...props}/>}  />
                <Route path="/login" exact  render={(props)=><Login {...props}/>} />
                <Route path="/verifyEmail" exact render = {(props)=><VerifyEmail {...props}/>}/>
                <Route path="/resetPassword"  render={(props)=><ResetPassword {...props}/>}/>
               
            </Switch>
            
            </div>
      
    )
}

export default LandingPage
