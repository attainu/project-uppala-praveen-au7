const joi = require('joi')

const schema = joi.object({
    username:joi.string().alphanum().min(5).max(15).required(),
    password:joi.string().alphanum().min(8).max(15).required()
})
const regex = /^[a-zA-Z]\w{3,9}[a-zA-Z0-9]{1,5}$/

const loginVal = (req,res,next) =>{ 
        console.log(req.body,regex.test(req.body.username))
    if(!regex.test(req.body.username)) return res.json({success:false,error:'username must start with an alphabet, ends with either alphabet or number and in the middle it accepts alphabet,number and "_" and must have 5 to 15 characters'})
    const validation = schema.validate(req.body)
    if(validation.error) return res.status(400).json({succes:false,error:validation.error.message})
    next()
} 

module.exports = loginVal

// console.log(regex.test('abcmern1'))