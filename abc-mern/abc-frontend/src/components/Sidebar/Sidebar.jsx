import React,{useState} from 'react'
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import classes from "./Sidebar.module.css"
import {Avatar,IconButton} from "@material-ui/core"
import {SearchOutlined} from "@material-ui/icons"
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import SidebarContacts from './SidebarContacts/SidebarContacts';
// import { Component } from 'react';
// import axios from "axios"
import {connect} from "react-redux"
import { addContact, logout, removeContact } from '../../redux/user/userActions';
import { useEffect } from 'react';
// import Pusher from "pusher-js"


const Sidebar = (props)=> {
    const [contacts,setContacts] = useState({
        contacts:[]
    })
    const [flag,setFlag] = useState({flag:false})
    useEffect(()=>{
        setContacts({contacts:props.user.contacts})
    },[])

    // useEffect(()=>{
    //     const pusher = new Pusher(process.env.REACT_APP_PUSHER_APP_KEY, {
    //         cluster: 'ap2'
    //       });
      
    //       const channel = pusher.subscribe('addContact');
    //       channel.bind('newContactAdded', (data)=> {
    //         // alert(JSON.stringify(data));
    //         console.log('receiived from pusher',data)
    //         setContacts([...contacts,data])
        
    //       });
    //      return ()=>{
    //         channel.unbind('newContactAdded',(data)=>{
    //             console.log('after unbinding add-contact',data)
    //         })
           
    //         pusher.unsubscribe('addContact')
    //      }
    // },[contacts])

    const cb =(contacts)=>{
        setContacts({contacts:contacts})
    }

    const removeContactHandler = (id,email) => {
        // e.preventDefault()
        // e.persist()
        // axios.patch(`http://localhost:5000/user/${props.user._id}?addContact=${e.target.elements.email.value}`,{email:e.target.elements.email.value})
        
        props.removeContact({id:id,email:email},cb)
        // console.log(e.target.elements.email.value)
    }
   
    const addContactHandler = (e) => {
        e.preventDefault()
        e.persist()
        // axios.patch(`http://localhost:5000/user/${props.user._id}?addContact=${e.target.elements.email.value}`,{email:e.target.elements.email.value})
        
        props.addContact({id:props.user._id,email:e.target.elements.email.value},cb)
        console.log(e.target.elements.email.value)
    }
    
    const addContactChangeHandler = (e) => {
        e.preventDefault()
        e.persist()
        // console.log(e.target.value)
        if(e.target.value.length>0){
            setFlag({flag:true})
        }else{
            setFlag({flag:false})
        }
      
    }
    
    const searchContactHandler = e =>{
        e.preventDefault()
        e.persist()
        if(e.target.value.length>0){
            const filteredContacts = contacts.contacts.filter(contact=>{
                if(contact.username.includes(e.target.value)) return contact
            })
            setContacts({contacts:filteredContacts})
        }else{
            setContacts({contacts:props.user.contacts})
        }
    }

    const logoutHandler = (e) =>{
        e.preventDefault()
        e.persist() 
        props.logout()
    }

    return (
        <div className={classes.sidebar}>
            
            <div className={classes.sidebar__header}>
                <div className={classes.sidebar__headerLeft}>
                <Avatar/>
                <h3 >{props.user.username}</h3>
                </div>
                <div className={classes.sidebar__headerRight}>
                   <IconButton onClick={logoutHandler} >
                   <PowerSettingsNewIcon className={classes.sidebar__headerRight__logoutBtn} >Logout</PowerSettingsNewIcon>
                   </IconButton>
                </div>
            </div>
            <div className={classes.sidebar__search}>
                <div className={classes.sidebar__searchContainer}>
                    <SearchOutlined className={classes.sidebar__searchContainer__searchIcon}/>
                    <input type="text" placeholder="search the contacts" onChange={searchContactHandler}/>
                </div>
            </div>
            <div className={classes.sidebar__contacts}>
    {props.user.contacts.map(contact=>{
        console.log('contact',contact)
        let parsedContact = contact
        if(!props.user.chats[parsedContact.username]) props.user.chats[parsedContact.usernamename] = []
        return <SidebarContacts key={parsedContact.username} details={parsedContact} userId={props.user._id} loggedInUser={props.user.username} chats={props.user.chats[parsedContact.username]} removeContact={removeContactHandler} />})}
            </div>
            
                <form className={classes.sidebar__addContact} onSubmit={addContactHandler}>
                <div className={classes.sidebar__addContact__container}>
                    <input type="text" name="email" placeholder="Enter the contact's email" onChange={addContactChangeHandler} />
                </div>
                <IconButton style={flag.flag?{display:"inline-flex"}:{display:"none"}} type="submit" className={classes.sidebar__addContact__btn}  >
                    <PersonAddIcon color="primary"/>
                </IconButton>
                </form>
            
        </div>
    )
}
const mapStateToProps = state => {
    console.log('sidebar state user',state.user.user)
    return {
        user: state.user.user
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addContact: (data,cb)=>dispatch(addContact(data,cb)),
        removeContact: (data,cb)=>dispatch(removeContact(data,cb)),
        logout: ()=>dispatch(logout())
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(Sidebar)
