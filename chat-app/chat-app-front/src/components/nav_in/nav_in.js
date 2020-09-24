import React from 'react'
import classes from "./nav_in.module.css"
import Self from "./self-card/self-card"
import RightMenu from "./right_menu/right_menu"


const nav_in = (props) => {
    return (
        <div className={classes.nav_in}>
            <Self/>
            <RightMenu/>
        </div>
    )
}

export default nav_in
