const joi = require('joi')

const schema = joi.object({
    name:joi.string().min(5).max(20).required(),
    email:joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net','org','in','gov'] } }).required(),
    username:joi.string().alphanum().min(5).max(15).required(),
    password:joi.string().alphanum().min(8).max(15).required()
})
const regex = /^[a-zA-Z]\w{3,9}[a-zA-Z0-9]{1,5}$/

const signupVal = (req,res,next) =>{ 
    if(!regex.test(req.body.username)) return res.json({success:false,error:'username must start with an alphabet, ends with either alphabet or number and in the middle it accepts alphabet,number and "_" and must have 5 to 15 characters'})
    const validation = schema.validate(req.body)
    if(validation.error) return res.status(400).json({success:false,error:validation.error.message})
    next()
} 

module.exports = signupVal