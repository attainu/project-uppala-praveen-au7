const brypt = require("bcryptjs")
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
        type:Boolean
    },
    lastSeen:{
        type:String
    },
    contacts:{
        type:Array
    },
    chats:{
        type:Object
    }
})

User.methods.generateHash = function(password){
    return brypt.hashSync(password,brypt.genSaltSync(8),null)
}

User.methods.validPassword = function(password){
    return brypt.compareSync(password,this.password)
}

module.exports = mongoose.model('User',User)