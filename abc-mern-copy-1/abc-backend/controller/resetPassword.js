const User = require("../model/user")
const bcrypt = require("bcryptjs")

const resetPassword = async (req,res,next) => {
    try{
        const isUser = await User.find({email:req.email})
        if(isUser.length == 0) return res.json({success:false,error:"user doesn't exist"})
        const password = bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(8))
        const updateUser = await User.updateOne({email:req.email},{
            $set: {
                password:password
            }
        })
        return res.json({success:true,message:"password is changed succefully"})
    }catch(err){
        res.status(500).json({success:false,error:err.message})
    }
}

module.exports = resetPassword