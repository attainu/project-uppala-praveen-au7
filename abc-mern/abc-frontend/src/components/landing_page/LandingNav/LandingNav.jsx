import React from 'react'
import {NavLink} from 'react-router-dom'
import classes from "./LandingNav.module.css"
import Logo from "../../Logo/Logo"


const Landing_nav = () => {
    return (
       <div className="nav_bar">
            <nav className={classes.landing_nav}>
                <div className={classes.logo}>{<Logo/>}</div>
            <ul className={classes.links}>
                <NavLink to="/signup" activeClassName={classes.active_link} className={classes.link} ><li>Signup</li></NavLink>
                <NavLink to="/login"  activeClassName={classes.active_link} className={classes.link}><li >Login</li></NavLink>
            </ul>
      </nav>

       </div>
    )
}

export default Landing_nav
