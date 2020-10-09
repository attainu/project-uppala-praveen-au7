import React from 'react'
import Chatbox from '../Chatbox/Chatbox'
import Sidebar from '../Sidebar/Sidebar'
import classes from "./User.module.css"


const UserPage = (props) => {
    return (
        <div className={classes.user}>
           <div className={classes.user__body}>
           <Sidebar {...props} />
            <Chatbox {...props} />
           </div>
        </div>
    )
}

export default UserPage
