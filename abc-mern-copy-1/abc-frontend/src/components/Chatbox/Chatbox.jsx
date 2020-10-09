import React,{useState,useEffect, Fragment} from 'react'
import {Avatar,IconButton} from "@material-ui/core"
import classes from "./Chatbox.module.css"
import DuoIcon from '@material-ui/icons/Duo';
import moment from "moment"
import AddLocationIcon from '@material-ui/icons/AddLocation';
import SendIcon from '@material-ui/icons/Send';
import { addNewMessage, newMessageReceived } from '../../redux';
import Pusher from "pusher-js"
import {connect} from "react-redux"
import VideoCallIcon from '@material-ui/icons/VideoCall';
// import io from "socket.io-client"

let finalChats = []
const Chatbox = (props)=> {
  const [message,setMessage] = useState({
    message:""
  })
  // const [data,setData] = useState({data:{}})
  // const [chats,setChats] = useState(props.updatedChats[props.contactChat.contact])
  // const socket = io.connect('http://localhost:5000/app/v1/user')
  // socket.on("newMessage",(data)=>{
  //   console.log('data from socket',data)
  // })
  const [tempContactChats,setTempContactChats] = useState()
  const [chats,setChats] = useState()
  useEffect(()=>{ 
    console.log('chatbox props in useEffect',props)
    setTempContactChats(props.contactChat.chats)
  },[props.contactChat.chats])
  useEffect(()=>{
    console.log('contact chat props',props.contactChat)
    // console.log('chats received directly from user',props.updatedChats)
    // setChats(props.updatedChats[props.contactChat.contact])
  
    // finalChats = [...props.updatedChats[props.contactChat.contact]]
    console.log('on loading',finalChats)
  },[])
  const cb = (newMessage) =>{
    console.log('cb message received ',newMessage)
    console.log('chats as of message sent',tempContactChats)
    setMessage({message:""})
    let currentChats = {
      [Symbol.iterator](){
        return props.contactChat.chats[Symbol.iterator]()
      }
    }
    let iterableCurrentChats = Array.from(currentChats)
    // let newChats = []
    // for(let chat of iterableCurrentChats){
    //     newChats.push(chat)
    // }
    iterableCurrentChats.push(newMessage)
    console.log('chats after sending msg',iterableCurrentChats)
    setTempContactChats(iterableCurrentChats)
  }

  
  useEffect(()=>{
    const pusher = new Pusher(process.env.REACT_APP_PUSHER_APP_KEY, {
        cluster: 'ap2'
      });
  
      const channel = pusher.subscribe('messages');
      channel.bind('newmessage', (data)=> {
        console.log('receiived from pusher',data)
        props.receiveMessage(data.newMessage)
        // setChats([...chats.chats,data.newMessage])
        let currentChats = {
          [Symbol.iterator](){
            return props.contactChat.chats[Symbol.iterator]()
          }
        }
        let iterableCurrentChats = Array.from(currentChats)
        // let updatedChats = []
        // for(let chat of Object.values(chats)){
        //   updatedChats.push(chat)
        // }
        iterableCurrentChats.push(data.newMessage)
        console.log('chats after receiving msg',iterableCurrentChats)
        // console.log('56 up chats', updatedChats)
        // finalChats = updatedChats
        // console.log('58 final chats',finalChats)
        setTempContactChats(iterableCurrentChats)
      });
     return ()=>{
        channel.unbind('newmessage',(data)=>{
            console.log('after unbinding newMessage',data)
        })
       
        pusher.unsubscribe('messages')
     }
})

useEffect(()=>{
  console.log('testing updated chats',chats)
},[chats])




const videoCallHandler = (e) => {
  e.preventDefault()
  e.persist()
  let videoLink = `/user/${props.contactChat.user}/call/${props.contactChat.contact}`
  window.open(videoLink,"_blank")
}

const joinVideoCallHandler = (e) => {
  e.preventDefault()
  e.persist()
  let joinVideoLink = `/user/join/${props.contactChat.user}`
  window.open(joinVideoLink,"_blank")
}

const inputChangeHandler = (e) => {
  e.preventDefault()
  e.persist()
  setMessage({message:e.target.value})
}



 const onNewMessageSent = (e) =>{
    e.preventDefault()
    e.persist()
    
    // e.target.elements.message.value = ""
    const newMessage = {sender:props.contactChat.user,receiver:props.contactChat.contact,message:message.message,timeStamp:moment().format('llll')}
    props.addNewMessage(props.contactChat.id,newMessage,cb)
    
  }  
  const addLocationHandler = (e) =>{ 
    e.preventDefault()
    e.persist()
    navigator.geolocation.getCurrentPosition(pos=>{
      const location = pos.coords
 
      const lat = location.latitude
      const long = location.longitude 
      const newMessage = {sender:props.contactChat.user,receiver:props.contactChat.contact,message:`https://www.google.com/maps?q=${lat},${long}`,timeStamp:moment().format('llll')}
      props.addNewMessage(props.contactChat.id,newMessage,cb)
    },error=>{
      console.warn(`ERROR(${error.code}): ${error.message}`);
    }
   
    )
  }
  // let tempContactChats = props.contactChat.chats
  return (
      <div className={classes.chat}>
        <div className={classes.chat__header}>
        <div className={classes.chat__headerLeft}>
              <Avatar style={{fontSize:"large"}}/>
              <h3>{props.contactChat.contact}</h3>  
          </div>
          <div className={classes.chat__headerRight}>
              <IconButton onClick={videoCallHandler}>
                  <DuoIcon style={{fontSize:"35",color:"indigo"}}>
                    
                  </DuoIcon>
              </IconButton>
              <IconButton onClick={joinVideoCallHandler}>
                  <VideoCallIcon style={{fontSize:"35",color:"black"}}>
                    
                  </VideoCallIcon>
              </IconButton>
          </div>
          
        </div>
        <div className={classes.chat__body}>
          
          {tempContactChats?tempContactChats.map((chat,i)=>{
          if(chat.sender===props.contactChat.user) return (<Fragment key={i}>
            <p className={classes.chat__body__messageReceiver}>
             {chat.message}
               
               <small className={classes.chat__body__messageReceiver__time} >{chat.timeStamp}</small>
             
             </p>
         </Fragment>)
         else if(chat.sender !== props.contactChat.user) return (
           <Fragment key={i}>
                 <p className={classes.chat__body__messageSender}>
             {chat.message}
               
               <small className={classes.chat__body__messageSender__time} >{chat.timeStamp}</small>
               
             </p>
           </Fragment>
         )
        }) :
        props.contactChat.chats.map((chat,i)=>{
          if(chat.sender===props.contactChat.user) return (<Fragment key={i}>
            <p className={classes.chat__body__messageReceiver}>
             {chat.message}
               
               <small className={classes.chat__body__messageReceiver__time} >{chat.timeStamp}</small>
             
             </p>
         </Fragment>)
         else if(chat.sender !== props.contactChat.user) return (
           <Fragment key={i}>
                 <p className={classes.chat__body__messageSender}>
             {chat.message}
               
               <small className={classes.chat__body__messageSender__time} >{chat.timeStamp}</small>
               
             </p>
           </Fragment>
         )
        }) 
        }
            
             
        </div>
        <div className={classes.chat__footer}>
              <IconButton onClick={addLocationHandler}><AddLocationIcon style={{color:"green"}}/></IconButton>
              <form className={classes.chat__footer__post} onSubmit={onNewMessageSent}>
                  <input type="text" name="message" placeholder="Your message" onChange={inputChangeHandler} value={message.message}  />
                  <IconButton style={message.message.length>0?{dispaly:"inline"}:{display:"none"}} type="submit" > <SendIcon  color="primary"  /></IconButton>
              </form>
        </div>
      </div>
  )
}

const mapStateToProps = ({contactChat,user:{user:{totalChats:chats}}}) => {
  console.log('state in chat box',contactChat)
  // console.log(chats)
  return{
    contactChat:contactChat,
    updatedChats:chats
  }
}

const mapDispatchToProps = dispatch =>{
  return{
    addNewMessage: (id,message,cb)=>dispatch(addNewMessage(id,message,cb)),
    receiveMessage: (message) => dispatch(newMessageReceived(message))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Chatbox)
