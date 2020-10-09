import React from 'react'
import myLogo from "./myTeam.jpg"
import classes from "./Logo.module.css"

const Logo = () => {
    return (
        <img className={classes.logo} src={myLogo} alt="ABC"/>
    )
}

export default Logo
