import React from 'react'
import classes from "../Signup/Signup.module.css"
import axios from "axios"
import styles from "./VerifyEmail.module.css"
const VerifyEmail = (props) => {
    let message = ""
    const emailVerificationHandler = (e) => {
        e.preventDefault()
        e.persist()
        console.log('verify email',e.target)
        axios.post("http://localhost:5000/app/v1/home/verifyEmail",{email:e.target.email.value})
        .then(response=>{console.log(response.data)
        if(response.data.success) message = response.data.message
        else message = response.data.error

    })
        .catch(error=>console.error(error))
        e.target.email.value = ""
    }
    return (
        <div className={classes.form_container}>
            <form onSubmit={emailVerificationHandler} className={classes.container}>
                <div className={classes.col}>
                <label htmlFor="email"><h3 className={classes.label_name}>Email <small>*</small></h3></label>
                <input type="text" name="email" id="email" placeholder="enter your email here" className={[classes.border_blue,styles.email].join(' ')}/>
                </div>
                <button type="submit" className={[classes.signup_btn,styles.submit_btn].join(' ')}>Verify email</button>
            </form>
            <h3 style={message.length>0?{display:"block"}:{display:"none"}}>{message}</h3>
        </div>
    )
}

export default VerifyEmail

