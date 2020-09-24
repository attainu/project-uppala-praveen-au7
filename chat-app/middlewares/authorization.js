const jwt = require('jsonwebtoken')
require('dotenv/config')
const moment = require('moment')

const createLoginToken = (req,res,next) =>{
    
 try{
    const loginToken = jwt.sign({email:req.email,id:req.id,username:req.username},process.env.LOGIN_KEY,{expiresIn:'24h'})
    res.set('Authorization',`Bearer ${loginToken}`)
    res.redirect('/user')
 }catch(err){
     res.json({success:false,error:err.message})
 }
}

const createLogoutToken = (req,res,next) => {
    try{
        const logoutToken = jwt.sign({email:"not required"},process.env.LOGOUT_KEY,{expiresIn:'3s'})
        res.set('Authorization',`Bearer ${logoutToken}`)
        res.redirect('/signup')
    }catch(err){
        res.json({success:false,error:err.message})
    }
}

const tokenVerify = (req,res,next) => {
    try{
        const token = req.get('Authorization').split(' ')[1]
        jwt.verify(token,process.env.LOGIN_KEY,(err,decoded)=>{
            if(err) return res.json({success:false,error:'Invalid Token'})
            req.email = decoded.email
            req.id = decoded.id
            req.username = decoded.username
            next()
        })
    }catch(err){
        res.json({success:false,error:err.message})
    }
}

module.exports = {createLoginToken,createLogoutToken,tokenVerify}