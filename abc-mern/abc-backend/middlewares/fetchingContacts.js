const User =  require("../model/user");
const moment = require("moment")

const contacts = {
    fetchAll: async (req,res,next) => {
        try{
            const updatedUser = await User.updateOne({email:req.email},{
                $set:{
                    active:true
                }
            })
            const user = await User.findOne({email:req.email})
                                .populate('contacts','email username active lastSeen')
                                
            const activeUsers = user.activeUsers
            activeUsers.push(user.username)
            // res.set('Authorization',`Bearer ${req.token}`)
            const allUsers = await User.updateMany({},{
                $set:{
                    activeUsers:activeUsers 
                }
            })
            console.log(`loggedin user at ${moment().format('llll')}`,user)
            res.json({success:true,data:user,message:"Login successful",token:req.token})
        }catch(err){
            res.json({success:false,error:err.message})
        }

    }
}
module.exports = contacts