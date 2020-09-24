import React,{useState} from 'react'
import classes from "../Signup/Signup.module.css"
import styles from "../LandingPage.module.css"
import validate from "../Signup/SignupValidation"

const Login = (props) => {
    const [state,setState] = useState(()=>({
        username:null,
        password:null
    }))

    
    const changeHandler = (e) =>{
       
        e.preventDefault()
        e.persist()
        const name= String(e.target.name)
        const value = validate[name.toUpperCase()](e.target.value)
       
       if(name === "username")  setState(prevState=>({...prevState,username:value}))
        else if(name === "password") setState(prevState=>({...prevState,password:value})) 
       
            
    }
    const submitHandler = (e) =>{
        e.preventDefault()
        e.persist()
        console.log(e.target.username.value,'\n',e.target.password.value)
    }
    return (
        <div className={styles.form_container} >
            <form onSubmit={submitHandler} className={classes.container}>
            <div className={classes.col}>
                <label htmlFor="username"><h3 className={classes.label_name}>Username <small>*</small></h3></label>
                <input type="text" name="username" id="username" className={state.username?classes.border_green:classes.border_red} onChange={changeHandler}/>
                <small className={state.username?classes.small_success:classes.small_error}>must start with alpha and remaining chars can be alphanum,accepts 5 to 15 chars</small>
                </div>
               <div className={classes.col}>
               <label htmlFor="password"><h3 className={classes.label_name}>Password <small>*</small></h3></label>
                <input type="password" name="password" id="password" className={state.password?classes.border_green:classes.border_red} onChange={changeHandler}/>
                <small className={state.password?classes.small_success:classes.small_error}>must start with alpha and remaining chars can be alphanum,accepts 5 to 15 chars</small>
               </div>
                <br/>
                <button type="submit" className={classes.signup_btn}>login</button>
            </form>
            
        </div>
    )
}

export default Login
