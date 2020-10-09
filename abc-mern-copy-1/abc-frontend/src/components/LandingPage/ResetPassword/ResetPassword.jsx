import React,{useState} from 'react'
import validate from "../Signup/SignupValidation"
import classes from "../Signup/Signup.module.css"
import styles from "../VerifyEmail/VerifyEmail.module.css"
import axios from "axios"
import { useEffect } from 'react'

const ResetPassword = (props) => {
    const [state,setState] = useState(()=>({
        username:"",
        password:"",
        token:""
    }))
    useEffect(()=>{
        const token = window.location.pathname.split("resetPassword/")[1]
        if(token){
            setState(prevState=>({...prevState,token:token}))
        }
    },[])
    const changeHandler = (e) =>{
        
        e.preventDefault()
        e.persist()
        const name= String(e.target.name)
        const value = validate[name.toUpperCase()](e.target.value)
        
        if(name === "username" && value)  setState(prevState=>({...prevState,username:e.target.value}))
        else if(name === "password" && value) setState(prevState=>({...prevState,password:e.target.value})) 
            
    }
    let message = ""
    const submitHandler = (e) =>{
        e.preventDefault()
        e.persist()
        if(state.username !== state.password){
            message = "passwords do not match"
            return
        }
        axios.patch("https://abc-app-123.herokuapp.com/app/v1/home/resetPassword",{password:state.password,token:state.token})
        .then(response=>{console.log(response)
            setState((prevState)=>({...prevState,username:"",password:""}))
        if(response.data.success) message = response.data.message
        else message = response.data.error})
        .catch(error=>{console.error(error)
        message = error.message})
        setState((prevState)=>({...prevState,username:"",password:""}))
    }
    return (
        <div className={classes.form_container}>
            <form onSubmit={submitHandler} className={classes.container}>
            <div className={classes.col}>
                <label htmlFor="username"><h3 className={classes.label_name}>New Password <small>*</small></h3></label>
                <input type="text" name="username" id="username"  className={state.username?classes.border_green:classes.border_blue} onChange={changeHandler}/>
                <small className={state.username?classes.small_success:classes.small_error}>must start with alpha and remaining chars can be alphanum,accepts 5 to 15 chars</small>
                </div>
               <div className={classes.col}>
               <label htmlFor="password"><h3 className={classes.label_name}>Re-enter Password <small>*</small></h3></label>
                <input type="password" name="password" id="password"  className={state.password?classes.border_green:classes.border_blue} onChange={changeHandler}/>
                <small className={state.password?classes.small_success:classes.small_error}>must start with alpha and remaining chars can be alphanum,accepts 5 to 15 chars</small>
               </div>
               <button type="submit" className={[classes.signup_btn,styles.submit_btn].join(' ')}>Reset Password</button>
            </form>
            <div className={classes.signup_message}><h3>{message}</h3></div>
        </div>
    )
}

export default ResetPassword
