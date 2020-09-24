 const User = require('../models/user')
 const bcrypt = require('bcryptjs')
 const {createLoginToken} = require('../middlewares/authorization')

 const login = {
     authenticate: async (req,res,next)=>{
        try{
            const existingUser = await User.find({username:req.body.username})
        if(existingUser.length == 1){
            const checkPassword = bcrypt.compareSync(req.body.password,existingUser[0].password)
            if(checkPassword){
                req.email = existingUser[0].email
                req.id = existingUser[0]._id
                req.username = existingUser.username
                createLoginToken(req,res,next)
            }else return res.json({success:false,error:'invalid credentials'})
        }else{
            return res.json({success:false,error:'user does not exists in the database'})
        }
        }catch(err){
            res.json({success:false,error:err.message})
        }
     }
 }

 module.exports = login