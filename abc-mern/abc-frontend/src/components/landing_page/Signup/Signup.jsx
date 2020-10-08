import React,{useState} from 'react'
import axios from "axios"
import classes from "./Signup.module.css"

import validate from "./SignupValidation"
const Signup= (props) => {
    const [state,setState] = useState(()=>({
        firstName:null,
        lastName:null,
        email:null,
        username:null,
        password:null
    }))

    // const fNameVal = validate.FIRSTNAME(value)
    // const lNameVal = validate.LASTNAME(value)
    // const emailVal = validate.EMAIL(value)
    // const usernameVal = validate.USERNAME(value)
    // const passwordVal = validate.PASSWORD(value)
    const changeHandler = (e) =>{
        // console.log(e.target.name.toUpperCase())
        e.preventDefault()
        e.persist()
        const name= String(e.target.name)
        const value = validate[name.toUpperCase()](e.target.value)
        // console.log(name,value)
        // console.log('check',String(name)===String("firstname"))
        if(name==="firstname" && value) setState(prevState=>({...prevState,firstName:e.target.value}))
        else if(name === "lastname" && value) setState(prevState=>({...prevState,lastName:e.target.value}))           
        else if(name === "email" && value) setState(prevState=>({...prevState,email:e.target.value}))
        else if(name === "username" && value)  setState(prevState=>({...prevState,username:e.target.value}))
        else if(name === "password" && value) setState(prevState=>({...prevState,password:e.target.value})) 
        // console.log(state) 
            
    }
    let message = ""
    const submitHandler = (e) =>{
        e.preventDefault()
        e.persist()
        console.log(state)
        axios.post("http://localhost:5000/app/v1/home/signup",{firstName:state.firstName,lastName:state.lastName,email:state.email,username:state.username,password:state.password})
        .then(response=>{console.log(response)
        message = response.data.message})
        .catch(error=>{console.error(error)
        message = error})
    }
    return (
        <div className={classes.form_container}>
            <form onSubmit={submitHandler} className={classes.container}>
                <div className={classes.col} >
                <label htmlFor="firstName"><h3 className={classes.label_name}>First Name <small>*</small> </h3></label>
                <input type="text" name="firstname" id="firstName" className={state.firstName?classes.border_green:classes.border_blue} onChange={changeHandler} />
                <small className={state.firstName?classes.small_success:classes.small_error} >firstname should contain 3 to 10 alphabet characters lower/upper</small>
                </div>
               <div className={classes.col}>
               <label htmlFor="lastName"><h3 className={classes.label_name}>Last Name <small>*</small> </h3></label>
                <input type="text" name="lastname" id="lastName" className={state.lastName?classes.border_green:classes.border_blue} onChange={changeHandler}/>
                <small className={state.lastName?classes.small_success:classes.small_error} >lastname should contain 3 to 10 alphabet characters lower/upper</small>
               </div>
                <div className={classes.col}>
                <label htmlFor="email"><h3 className={classes.label_name}>Email <small>*</small></h3></label>
                <input type="email" name="email" id="email" className={state.email?classes.border_green:classes.border_blue} onChange={changeHandler}/> 
                <small className={state.email?classes.small_success:classes.small_error} >example: hey@domain.com</small>
                </div>
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
                <button type="submit" className={classes.signup_btn}>signup</button>
            </form>
            <div className={classes.signup_message}><h3>{message}</h3></div>
        </div>
    )
}

export default Signup
