import React from 'react'
import {NavLink} from 'react-router-dom'
import classes from "./LandingNav.module.css"


const Landing_nav = () => {
    return (
        <nav className={classes.landing_nav}>
            <div className={classes.logo}>Logo</div>
            <ul className={classes.links}>
                <NavLink to="/signup" ><li className={classes.link}>Signup</li></NavLink>
                <NavLink to="/login" ><li className={classes.link}>Login</li></NavLink>
            </ul>
      </nav>
    )
}

export default Landing_nav
