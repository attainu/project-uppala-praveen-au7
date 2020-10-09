import React,{useState} from 'react'
import axios from "axios"
import classes from "./Signup.module.css"

import validate from "./SignupValidation"
const Signup= (props) => {
    const [state,setState] = useState(()=>({
        firstname:"",
        lastname:"",
        email:"",
        username:"",
        password:"",
       error:true,
       fNameError:true,
       lNameError:true,
       emailError:true,
       usernameError:true,
       passwordError:true

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
        setState(prevState=>({...prevState,name:e.target.value}))
        // console.log(name,value)
        // console.log('check',String(name)===String("firstname"))
        if(name==="firstname" && value) {setState(prevState=>({...prevState,firstname:e.target.value,fNameError:false}))}
        else{setState(prevState=>({...prevState,error:true,fNameError:true}))}
        if(name === "lastname" && value) {setState(prevState=>({...prevState,lastname:e.target.value,lNameError:false}))}
        else{setState(prevState=>({...prevState,error:true,lNameError:true}))}           
        if(name === "email" && value) {setState(prevState=>({...prevState,email:e.target.value,emailError:false}))}
        else{setState(prevState=>({...prevState,error:true,emailError:true}))}
        if(name === "username" && value)  {setState(prevState=>({...prevState,username:e.target.value,usernameError:false}))}
        else{setState(prevState=>({...prevState,error:true,usernameError:true}))}
        if(name === "password" && value) {setState(prevState=>({...prevState,password:e.target.value,passwordError:false}))}
        else{setState(prevState=>({...prevState,error:true,passwordError:true}))} 
        // console.log(state) 
          if(
              validate.FIRSTNAME(state.firstname) &&
              validate.LASTNAME(state.lastname) &&
              validate.EMAIL(state.email) &&
              validate.USERNAME(state.username) &&
              validate.PASSWORD(state.password)
          ){
              console.log(state)
              setState(prevState=>({...prevState,error:false}))
          }else{
              setState(prevState=>({...prevState,error:true}))
          }
    }
    let message = ""
    const submitHandler = (e) =>{
        e.preventDefault()
        e.persist()
        console.log(state)
        axios.post("https://abc-app-123.herokuapp.com/app/v1/home/signup",{firstName:state.firstname,lastName:state.lastname,email:state.email,username:state.username,password:state.password})
        .then(response=>{console.log(response)
        message = response.data.message
        setState({firstname:"",lastname:"",email:"",password:"",username:""})
        e.target.elements.firstname.value = ""
        e.target.elements.lastname.value = ""
        e.target.elements.email.value = ""
        e.target.elements.username.value = ""
        e.target.elements.password.value = ""
    })
        .catch(error=>{console.error(error)
        message = error})
    }
    return (
        <div className={classes.form_container}>
            <form onSubmit={submitHandler} className={classes.container}>
                <div className={classes.col} >
                <label htmlFor="firstName"><h3 className={classes.label_name}>First Name <small>*</small> </h3></label>
                <input type="text" name="firstname" id="firstName"  className={state.firstName?classes.border_green:classes.border_blue} onChange={changeHandler} />
                <small className={state.firstname?classes.small_success:classes.small_error} >firstname should contain 3 to 10 alphabet characters lower/upper</small>
                </div>
               <div className={classes.col}>
               <label htmlFor="lastName"><h3 className={classes.label_name}>Last Name <small>*</small> </h3></label>
                <input type="text" name="lastname" id="lastName"  className={state.lastName?classes.border_green:classes.border_blue} onChange={changeHandler}/>
                <small className={state.lastname?classes.small_success:classes.small_error} >lastname should contain 3 to 10 alphabet characters lower/upper</small>
               </div>
                <div className={classes.col}>
                <label htmlFor="email"><h3 className={classes.label_name}>Email <small>*</small></h3></label>
                <input type="email" name="email" id="email"  className={state.email?classes.border_green:classes.border_blue} onChange={changeHandler}/> 
                <small className={state.email?classes.small_success:classes.small_error} >example: hey@domain.com</small>
                </div>
                <div className={classes.col}>
                <label htmlFor="username"><h3 className={classes.label_name}>Username <small>*</small></h3></label>
                <input type="text" name="username" id="username"  className={state.username?classes.border_green:classes.border_blue} onChange={changeHandler}/>
                <small className={state.username?classes.small_success:classes.small_error}>must start with alpha and remaining chars can be alphanum,accepts 5 to 15 chars</small>
                </div>
               <div className={classes.col}>
               <label htmlFor="password"><h3 className={classes.label_name}>Password <small>*</small></h3></label>
                <input type="password" name="password" id="password"  className={state.password?classes.border_green:classes.border_blue} onChange={changeHandler}/>
                <small className={state.password?classes.small_success:classes.small_error}>must start with alpha and remaining chars can be alphanum,accepts 5 to 15 chars</small>
               </div>
                <br/>
                <button style={{display:"block"}} type="submit" className={classes.signup_btn}>signup</button>
            </form>
            <div className={classes.signup_message}><h3>{message}</h3></div>
        </div>
    )
}

export default Signup
