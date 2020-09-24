import React from 'react'
import classes from "./contact.module.css"

const contact = (props) => {
    const loggedIn = true
    return (
        <div className={classes.contact}>
            <div className={loggedIn?classes.status_active:classes.status_inactive}></div>
            <img className={classes.profile_img} src="https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png" alt="name"></img>
            <p className={classes.profile_name}>name</p>
        </div>
    )
}

export default contact
