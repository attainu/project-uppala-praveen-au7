
const mongoose = require('mongoose')

const User = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    username:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        unique:true,
        required:true
    },
    active:{
        type:Boolean,
        default: false
        
    },
    lastSeen:{
        type:String,
        default: ""
    },
    contacts:{
        type:[{type:mongoose.Schema.Types.ObjectId,ref:"user"}]
    },
    chats:{
        type:Object,
        
    },
    activeUsers:{
        type:Array
    }
})



module.exports = mongoose.model('user',User)