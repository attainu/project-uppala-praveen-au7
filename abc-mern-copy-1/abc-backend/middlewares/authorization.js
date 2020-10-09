const jwt = require('jsonwebtoken')
require('dotenv/config')
const moment = require('moment')
const User = require("../model/user")

const createLoginToken =  (req,res,next) =>{
    
 try{
    const loginToken = jwt.sign({email:req.email,id:req.id,username:req.username},process.env.LOGIN_KEY,{expiresIn:'24h'})
    req.token = loginToken
    next()
    // res.set("Authorization",`Bearer ${loginToken}`)
    // res.status(200).json({success:true,message:"login successful",data:{id:req.id,email:req.email,username:req.username}})
 }catch(err){
     res.json({success:false,error:err.message})
 }
}

const createLogoutToken = async (req,res,next) => {
    try{
        const logoutToken = jwt.sign({id:"not required"},process.env.LOGOUT_KEY,{expiresIn:'3s'})
        // res.set('Authorization',`Bearer ${logoutToken}`)
        const logoutTime = moment().format("llll")
        const updatedUser = await User.updateOne({email:req.email},{
            $set:{
                active :false,
                lastSeen: logoutTime
            }
        })
        const loggedOutUser = await User.findOne({email:req.email})
        console.log(loggedOutUser)
        const activeUsers = loggedOutUser.activeUsers.filter(user=>{if(user!==loggedOutUser.username) return user})
        console.log('active users',activeUsers)
        const updatedActiveUsers = await User.updateMany({},{
            $set:{
                activeUsers:activeUsers
            }
        })
        res.status(200).json({success:true,message:"logout successful",token:logoutToken})
    }catch(err){
        res.json({success:false,error:err.message})
    }
}

const tokenVerify = (req,res,next) => {
    try{
        console.log(req.body)
        const token = req.get('Authorization').split(' ')[1]
        console.log('token verify',token)
        jwt.verify(token,process.env.LOGIN_KEY,(err,decoded)=>{
            if(err) return res.json({success:false,error:'Invalid Token'})
            req.token = token
            req.email = decoded.email
            req.id = decoded.id
            req.username = decoded.username
            next()
        })
    }catch(err){
        res.json({success:false,error:err.message})
    }
}

const emailTokenVerify = async (req,res,next) => {
 try{
     console.log(req.body)
    const token = req.body.token
    jwt.verify(token,process.env.EMAIL_VERIFICATION_KEY,(err,decoded)=>{
        if(err) return res.json({success:false,error:"Invalid Token"})
        req.firstName = decoded.firstName
        req.lastName = decoded.lastName
        req.email = decoded.email
        req.username = decoded.username
        req.password = decoded.password
        next()
    })
 }catch(err){
     res.json({success:false,error:err.message})
 }
}

const resetPasswordTokenVerify = async (req,res,next) => {
    try{
        console.log(req.body)
       const token = req.body.token
       jwt.verify(token,process.env.EMAIL_VERIFICATION_KEY,(err,decoded)=>{
           if(err) return res.json({success:false,error:"Invalid Token"})
           req.email = decoded.email
           next()
       })
    }catch(err){
        res.json({success:false,error:err.message})
    }
   }

module.exports = {createLoginToken,createLogoutToken,tokenVerify,emailTokenVerify,resetPasswordTokenVerify}