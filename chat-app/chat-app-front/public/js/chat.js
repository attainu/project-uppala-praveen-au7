const socket = io()

socket.on('new-connection',(message)=>{
    console.log(message)
})

socket.on('disconnected',(message)=>{
    console.log(message)
})

document.querySelector('form').addEventListener('submit',(event)=>{
    event.preventDefault()
    document.querySelector('button').setAttribute('disabled','disabled')
    let newMessage = event.target.message.value
    socket.emit('new-message',newMessage,(msg)=>{
        console.log('message delivered',msg)
        document.querySelector('button').removeAttribute('disabled')
        document.querySelector('#message').value = ""
        document.querySelector('#message').focus()
    })
})

socket.on('updated-chat',(chat)=>{
    
    let temp_chat = document.createElement('div')
        temp_chat.className = "chat"
        temp_chat.innerText = chat
        document.querySelector('#chat-display').appendChild(temp_chat)
    
})

document.querySelector('#share-location').addEventListener('click',(event)=>{
    const location = navigator.geolocation
    if(location){
        document.querySelector('#share-location').setAttribute('disabled','disabled')
        location.getCurrentPosition((position)=>{
            console.log(position.coords)
            socket.emit('geoLocationPosition',{longitude:position.coords.longitude,latitude:position.coords.latitude},(msg)=>{
                console.log('message delivered',msg)
                
                
            })
        },(error)=>{
            console.log(error)
        })
    }
})

socket.on('current-position',(coords)=>{
    const pos = document.createElement('div')
    pos.innerHTML = `<a href=https://google.com/maps?q=${coords.latitude},${coords.longitude}>my-location</a>`
    document.querySelector('#chat-display').appendChild(pos) 
    document.querySelector('#share-location').removeAttribute('disabled')
    
})

module.exports = 


