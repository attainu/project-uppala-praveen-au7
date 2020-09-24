const User = require('../models/user')
const bcrypt = require("bcryptjs")


const signup = {
    createUser: async (req,res,next)=>{
        try{
            const userExists = await User.find({email:req.body.email})
           if(userExists.length == 0){
            const password = bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(8))

            const newUser = new User({
                firstName:req.body.firstName,
                lastName:req.body.lastName,
                email:req.body.email,
                username:req.body.username,
                password:password,
            })
            const savedUser = await newUser.save()
            res.json({success:true})
           }
           else{
               res.json({success:false,error:'User already exists'})
           }
        }catch(err){
            res.json({success:false,error:err.message})
        }
        
    }
}

module.exports = signup