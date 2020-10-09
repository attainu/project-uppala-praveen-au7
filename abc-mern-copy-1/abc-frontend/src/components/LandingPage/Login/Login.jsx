import React,{Fragment, useState} from 'react'
import {Link} from "react-router-dom"
import { fetchUser } from '../../../redux/user/userActions'
import classes from "../Signup/Signup.module.css"
import {connect} from "react-redux"


import validate from "../Signup/SignupValidation"

const Login = (props) => {
    const [state,setState] = useState(()=>({
        username:null,
        password:null,
      
        
    }))

    const cb = id =>{
        props.history.push(`/user/${id}`)
    }
 
    
    const changeHandler = (e) =>{
       
        e.preventDefault()
        e.persist()
        console.log('login props',props)
        const name= String(e.target.name)
        const value = validate[name.toUpperCase()](e.target.value)
       
       if(name === "username" && value )  setState(prevState=>({...prevState,username:e.target.value}))
        else if(name === "password" && value ) setState(prevState=>({...prevState,password:e.target.value})) 
       
            
    }
    const submitHandler = async (e) =>{
        e.preventDefault()
        e.persist()
        props.fetchUser({username:state.username,password:state.password},cb)
        
         
        // if(props.userId){
        //     props.history.push(`/user/${props.userId}`)
        // }
    }
    return (
        <Fragment>
            <div className={classes.form_container} >
            <form onSubmit={submitHandler} className={classes.container}>
            <div className={classes.col}>
                <label htmlFor="username"><h3 className={classes.label_name}>Username <small>*</small></h3></label>
                <input type="text" name="username" id="username" className={state.username?classes.border_green:classes.border_blue} onChange={changeHandler}/>
                <small className={state.username?classes.small_success:classes.small_error}>must start with alpha and remaining chars can be alphanum,accepts 5 to 15 chars</small>
                </div>
               <div className={classes.col}>
               <label htmlFor="password"><h3 className={classes.label_name}>Password <small>*</small></h3></label>
                <input type="password" name="password" id="password" className={state.password?classes.border_green:classes.border_blue} onChange={changeHandler}/>
                <small className={state.password?classes.small_success:classes.small_error}>must start with alpha and remaining chars can be alphanum,accepts 5 to 15 chars</small>
               </div>
                <br/>
                <button type="submit" className={classes.signup_btn}>login</button>
                <Link className={classes.forgot_password} to="/verifyEmail" >Forgot Password</Link>
            </form>
            
        </div>
        
        </Fragment>
    )
}
const mapStateToProps = state =>{
    return { 
        userId: state.user.user._id
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchUser: (loginData,cb)=>dispatch(fetchUser(loginData,cb))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Login)
