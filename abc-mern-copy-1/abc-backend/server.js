const express = require('express')
const Socket = require("websocket").server
const http = require("http")
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require("morgan")
const SocketIO = require("socket.io")
const rateLimit = require("express-rate-limit")

require("dotenv/config")
const app = express()

const server = http.createServer((req,res)=>{})

mongoose.connect(process.env.DB_CONNECTION,{
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }).then(() => console.log("Database Connected"))
  .catch((err) => console.log(err))

app.use(cors())
app.use(morgan("tiny"))
app.use(express.json())

const limiter = rateLimit({
  max: 5,
  windowMs: 60 * 60 * 1000,
  message: "Too Many Request Please Try Again After 1 hr",
});
if (process.env.NODE_ENV === "production") {
  app.use("/api/v1/home/login", limiter);
}
const homeRouter = require("./routes/_index")
app.use('/app/v1/home',homeRouter)

const userRouter = require("./routes/user")
app.use('/app/v1/user',userRouter)

app.use('/app/v1/user/call/',(req,res)=>{
  const webSocket = new Socket({httpServer:server})
  let users = []
  webSocket.on("request",(req)=>{
    console.log('ws req',req)
    const connection = req.accept()
    connection.on("message",(message)=>{
      const data = JSON.parse(message.utf8Data)
      const user = findUser(data.username)
      switch(data.type){
        case "store_user":
          if(user !== null) return
          const newUser ={
            conn: connection,
            username:data.username
          }
          users.push(newUser)
          console.log(newUser.username)
          break
        case "store_offer":
          if(user == null) return
          user.offer = data.offer
          break
        case "store_candidate":
          if(user == null) return
          if(user.candidates == null) user.candidates = []
          user.candidates.push(data.candidate)
          break
        case "send_answer": 
          if(user == null) return
          sendData({
            type:"answer",
            answer:data.answer
          },user.conn)
          break
        case "send_candidate":
          if(user == null) return
          sendData({
            type:"candidate",
            candidate: data.candidate
          },user.conn)
          break
        case "join_call":
          if(user == null) return

          sendData({
            type:"offer",
            offer:user.offer
          },connection)

          user.candidates.forEach(candidate=>{
            sendData({
              type:"candidate",
              candidate:candidate
            },connection)

          })
          break
      }
    })

    connection.on("error",(error)=>{
      console.log(error.message)
    })

    connection.on("close",(reason,description)=>{
      users.forEach(user=>{
        if(user.conn == connection){
          users.splice(users.indexOf(user),1)
          return
        }
      })
    })

  })

  const sendData = (data,conn) => {
    conn.send(JSON.stringify(data))
  }

  const findUser = (username) => {
    let size = users.length
    for(let i = 0;i<size;i++){
      if(users[i].username === username) return users[i]
    }
  }

  webSocket.on("connect",(cn)=>{
    console.log('cn',cn)
  })
  
})


const port = process.env.PORT || 5000



const appServer = app.listen(port,()=>console.log(`server listening to port: ${port}`))

const io = SocketIO(appServer)

module.exports = io