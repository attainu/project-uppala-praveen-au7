const userRouter = require("express").Router()
const User = require("../model/user")
const jwt = require("jsonwebtoken")
const Pusher = require("pusher")
const mongoose = require("mongoose")
const {tokenVerify} = require("../middlewares/authorization")
const contacts = require("../middlewares/fetchingContacts")
const {StringDecoder} = require("string_decoder")
const io = require("../server")

const decoder = new StringDecoder("hex")

const pusher = new Pusher({
    appId:process.env.PUSHER_APP_ID,
    key:process.env.PUSHER_APP_KEY,
    secret:process.env.PUSHER_APP_SECRET,
    cluster:'ap2',
    useTLS:true
})

userRouter.patch('/:id',async (req,res,next)=>{
  try{
    const token = req.get('Authorization').split(' ')[1]
    jwt.verify(token,process.env.LOGIN_KEY,(err,decoded)=>{
        if(err) {return res.json({success:false,error:'Invalid Token'})}
        req.token = token
        req.email = decoded.email
        req.id = decoded.id
        req.username = decoded.username})
  }catch(err){
      console.log('token error',err.message)
      res.status(500).json({success:false,error:err.message})
  }
    if(req.query.contact && req.query.newMessage){
        // console.log(req.body,req.rawHeaders['authorization'])
        // res.set({"Authorization":"Bearer Token uynvgihgw--65287t"})
        // console.log(res.getHeaders())
      try{
          console.log('message body',req.body)
          pusher.trigger('messages','newmessage',{newMessage:{...req.body},success:true})
            const sender = await User.findOne({username:req.body.sender})
            if(!sender) return res.status(400).json({success:false,error:`couldn't find ${req.body.sender}`,token:req.token})
            const receiver = await User.findOne({username:req.body.receiver})
            if(!receiver) return res.status(400).json({success:false,error:`couldn't find ${req.body.receiver}`,token:req.token})
            let flag = false
            let size = sender.contacts.length
            for(let i=0;i<size;i++){
                if(decoder.write(sender.contacts[i].id) == decoder.write(receiver._id.id)){
                    flag = true
                    break
                }
            }
            if(!flag) return res.status(400).json({success:false,error:`${req.body.receiver} doesn't exist in your contacts list`,token:req.token})
                const senderChats = sender.chats 

                const receiverChats = receiver.chats
                if(senderChats[req.body.receiver]){
                    senderChats[req.body.receiver].push(req.body)
                    
                }else{
                    senderChats[req.body.receiver] = []
                    senderChats[req.body.receiver].push(req.body)
                }
                if(receiverChats[req.body.sender]){
                    receiverChats[req.body.sender].push(req.body)
                    
                }else{
                    receiverChats[req.body.sender] = []
                    receiverChats[req.body.sender].push(req.body)
                }
                const updatedSender = await User.updateOne({username:req.body.sender},{
                    $set:{
                            chats:senderChats
                    }
                })
                const resultSender = await User.findOne({username:req.body.sender}).populate('contacts','email username active lastSeen')
                const updatedReceiver = await User.updateOne({username:req.body.receiver},{
                    $set:{
                        chats: receiverChats
                    }
                })
                const db = mongoose.connection
                const userCollection = db.collection('users')
                const changeStream = userCollection.watch({ fullDocument: 'updateLookup' })
                changeStream.on("change",(change)=>{
                    console.log('new message',change)
                    if(change.operationType=="update"){
                        // io.on("connection",(socket)=>{
                            console.log(change.fullDocument)

                        //     socket.broadcast.emit("newMessage",{...req.body})
                            
                        // })

                       // pusher.trigger('messages','newmessage',{newMessage:{...req.body},success:true})
                    }
                })
            return res.json({success:true,message:"message sent successfully",data:resultSender,token:req.token})
            }catch(err){
                console.log('message error',err.message)
                res.status(500).json({success:false,error:err.message,token:req.token})
            }
    }else if(req.query.addContact){
        try{
            // console.log(mongoose.Types.ObjectId(req.params.id))
            const currentUser = await User.findOne({email:req.email}) 
            if(!currentUser) return res.json({success:false,error:'user doesn\'t exist',token:req.token})
            const newContact = await User.findOne({email:req.body.email})
            if(!newContact) return res.json({success:false,error:`couldn't find ${req.body.email}`,token:req.token})
            const currentUserContacts = currentUser.contacts
            const size = currentUserContacts.length
            
            if(decoder.write(currentUser._id.id)==decoder.write(newContact._id.id)) return res.json({success:false,error:'current-user and new-contact are one and same and operation can\'t be continued',token:req.token})
            for(let i=0;i<size;i++){
                if(decoder.write(currentUserContacts[i].id) == decoder.write(newContact._id.id)) return res.json({success:false,error:`${req.body.email} is already in your contacts list`,token:req.token})
            }
            currentUserContacts.push(newContact._id)
            let updatedChats = currentUser.chats
            if(!currentUser.chats) updatedChats = {}
            console.log('current chats',updatedChats)
            if(!updatedChats[newContact.username]) updatedChats[newContact.username] = []
            const updatedCurrentUser = await User.updateOne({email:currentUser.email},{
                $set:{
                    contacts:currentUserContacts,
                    chats:updatedChats
                }
            })
            let updatedNewContactChats = newContact.chats
            if(!newContact.chats) updatedNewContactChats = {}
            console.log('new contact chats',updatedNewContactChats)
            if(!updatedNewContactChats[currentUser.username]) updatedNewContactChats[currentUser.username] = []
            const updatedNewContact = await User.updateOne({email:req.body.email},{
                $set:{
                    chats:updatedNewContactChats
                }
            })
            const resultUser = await User.findOne({email:currentUser.email}).populate('contacts','email username active lastSeen')
            const addedContact = resultUser.contacts.filter(contact=>contact.email==req.body.email)
            const db = mongoose.connection
            const userCollection = db.collection('users')
            const changeStream = userCollection.watch({ fullDocument: 'updateLookup' })
            changeStream.on("change",(change)=>{
                console.log('contact added',change)
                if(change.operationType== "update"){
                    pusher.trigger("addContact","newContactAdded",{success:true,message:"contact added successfully",data:addedContact[0]})
                   
                }
            })
            
            console.log('result user',resultUser)
            return res.json({success:true,data:resultUser,message:"contact added successfully",token:req.token})
        }catch(err){
            console.log(err.message)
            res.status(500).json({success:false,error:err.message,token:req.token})
        }
    }else if(req.query.removeContact){
        try{
            console.log(req.query)
            const currentUser = await User.findOne({email:req.email})
        if(!currentUser) return res.json({success:false,error:'user doesn\'t exist',token:req.token})
        const newContact = await User.findOne({email:req.body.email})
        if(!newContact) return res.json({success:false,error:`couldn't find ${req.body.email}`,token:req.token})
        let currentUserContacts = currentUser.contacts
        const size = currentUserContacts.length
        // currentUserContacts = currentUserContacts.filter(contactID=>contactID !== newContact._id)
        // console.log(currentUserContacts)
        let userNewContacts = []
        
        console.log('new contact id',newContact._id)
        for(let i =0;i<size;i++){
            console.log(currentUserContacts[i].id,decoder.write(currentUserContacts[i].id),newContact._id.id,decoder.write(newContact._id.id))
            if(decoder.write(currentUserContacts[i].id) != decoder.write(newContact._id.id)){
                
                userNewContacts.push(currentUserContacts[i])
            }
        
        }
        console.log('after removing a contact',userNewContacts)
        const updatedCurrentUser = await User.updateOne({email:currentUser.email},{
            $set:{
                contacts:userNewContacts
            }
        })
         const resultUser = await User.findOne({email:currentUser.email}).populate('contacts','email username active lastSeen')

         
        const db = mongoose.connection
            const userCollection = db.collection('users')
            const changeStream = userCollection.watch({ fullDocument: 'updateLookup' })
           
            changeStream.on("change",(change)=>{
                console.log('contact removed',change)
                if(change.operationType== "update"){
                    pusher.trigger("removeContact","contactRemoved",{success:true,message:"contact removed succefully",data:req.body.email})
                    
                }
            

        }) 
     
        return res.json({success:true,message:"contact removed successfully",data:resultUser,token:req.token})
        }catch(err){
            res.status(500).json({success:false,error:err.message,token:req.token})
        }
    }
})


userRouter.get('/:id',tokenVerify,contacts.fetchAll)

module.exports = userRouter