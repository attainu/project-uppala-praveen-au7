import React from 'react'
import CreateRoom from "./create_room/create_room"
import Logout from "./logout/logout"
import classes from "./right_menu.module.css"

const right_menu = (props) => {
    return (
        <div className={classes.right_menu}>
            <CreateRoom/>
            <Logout/>
        </div>
    )
}

export default right_menu
