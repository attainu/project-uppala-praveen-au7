const express = require('express')
const morgan = require('morgan')
const app = express()
const path = require('path')
const server = require('http').createServer(app)
const socketio = require('socket.io')
const mongoose = require('mongoose')
const io = socketio(server)
const Filter = require('bad-words')
const filter = new Filter()
require('dotenv/config')


mongoose.connect(process.env.DB_CONNECTION,{
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }).then(() => console.log("Database Connected"))
  .catch((err) => console.log(err))
  

app.use(express.static(path.join(__dirname,'public')))
// app.set('view engine','ejs')
app.use(morgan('tiny'))

// let count = 0
let chat = []
let location = []
io.on('connection',(socket)=>{
    console.log('A new connection')
    socket.emit('new-connection','welcome')
    socket.broadcast.emit('new-connection','a new user has joined')
    socket.on('new-message',(message,callback)=>{
        const filteredMessage = filter.clean(message)
        chat.push(filteredMessage)
        console.log(chat)
        io.emit('updated-chat',filteredMessage)
        callback('received')
    })
    socket.on('disconnect',()=>{
        io.emit('disconnected',"a user has left")
    })
    socket.on('geoLocationPosition',(position,callback)=>{
        location.push(position)
        console.log(location)
        io.emit('current-position',{longitude:position.longitude,latitude:position.latitude})
        callback('received')
    })
    
})
const landingPageRoute = require('./routes/_index')
app.use('/',landingPageRoute)

const PORT = process.env.PORT || 5000
server.listen(PORT,()=>{console.log(`server listening to port: ${PORT}`)})

