import { Avatar } from '@material-ui/core'
import React from 'react'
import classes from './SidebarContacts.module.css'
import {connect} from "react-redux"
import { specificContactChat } from '../../../redux'
import DeleteIcon from '@material-ui/icons/Delete';
import {IconButton} from "@material-ui/core"



const SidebarContacts = (props)=>{
    console.log('sidebar contacts props',props)
    const contactClickHandler = (e) => {
        e.preventDefault()
        e.persist()
        const data = {
            id:props.userId,
            user: props.loggedInUser,
            contact:props.details.username,
            chats:props.chats
        }
       props.specificContactChat(data)
        
        
    }
   
    return (
        <div className={classes.sidebarContacts} onClick={contactClickHandler}>
            <div className={classes.sidebarContacts__left}>
                <div className={props.details.active?classes.sidebarContacts__left__statusActive:classes.sidebarContacts__left__statusInactive}></div>
                <Avatar/>
            </div>
            <div className={classes.sidebarContacts__right}>
            <div className={classes.sidebarContacts__right__info}>
                <h3>{props.details.username}</h3>
                <p className={props.details.active?classes.sidebarContacts__right__notLastSeen:classes.sidebarContacts__right__lastSeen}>Last seen at {props.details.lastSeen} </p>
            </div>
                <IconButton onClick={()=>props.removeContact(props.userId,props.details.email)}>
                    <DeleteIcon/>
                </IconButton>
            </div>
        </div>
    )
}

const mapDispatchToProps = dispatch =>{
    return{
        specificContactChat:(data)=>dispatch(specificContactChat(data))
    }
}

export default connect(null,mapDispatchToProps)(SidebarContacts)
