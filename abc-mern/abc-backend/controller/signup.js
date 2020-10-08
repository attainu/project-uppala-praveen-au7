const User = require('../model/user')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const moment = require("moment")
 

const signup = {
    createUser: async (req,res,next)=>{
        try{
            const userExists = await User.find({email:req.body.email})
           if(userExists.length == 0){
            const password = bcrypt.hashSync(req.password,bcrypt.genSaltSync(8))
            const signedUpTime = moment().format("llll")
            const newUser = new User({
                firstName:req.firstName,
                lastName:req.lastName,
                email:req.email,
                username:req.username,
                password:password,
                lastSeen:signedUpTime
            })
            const savedUser = await newUser.save()
            res.json({success:true,message:"signed up succefully"})
           }
           else{
               res.json({success:false,error:'User already exists'})
           }
        }catch(err){
            res.json({success:false,error:err.message})
        }
        
    },
    createEmailVerificationLink: async (req,res,next) => {
        const emailVerificationToken = jwt.sign({...req.body},process.env.EMAIL_VERIFICATION_KEY,{expiresIn:"10m"})
        console.log('email token',emailVerificationToken)
        req.token = emailVerificationToken
        next()

    }
}

module.exports = signup