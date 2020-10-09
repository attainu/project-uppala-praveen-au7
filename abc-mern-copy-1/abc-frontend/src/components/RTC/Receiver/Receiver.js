import React,{useState,useRef} from 'react'
import styles from "../Style.module.css"
import {w3cwebsocket} from "websocket"
const Receiver = (props) => {
    const [state,setState] = useState(()=>({
        video_on:true,
        audio_on:true,
        username:'',
        
    }))
    const [videoCallDisplay,setVideoCallDisplay]=useState(false);
    const [currentLocalStream,setCurrentLocalStream] = useState()
    const [pc,setPC] = useState()
    const webSocket = new w3cwebsocket('ws://192.168.0.197:5000/app/v1/user/call')
    let localStream = useRef();
    let remoteStream = useRef();
    const abc = {}
    

    const saveUsername = (e) =>{
        e.persist()
        setState(prevState=>({...prevState,username:e.target.value}))
    }
    const sendData = (data) =>{
        data.username = state.username
        webSocket.send(JSON.stringify(data))

    }

    const rejectCall = () => {
        navigator.mediaDevices.getUserMedia({video:false,audio:false},
            stream=>
            {
                localStream.current.srcObject = stream
                let configuration = {
                    iceServers:[
                        {
                            "urls":[
                                "stun:stun.l.google.com:19302",
                                "stun:stun1.l.google.com:19302",
                                "stun:stun2.l.google.com:19302",
                                "stun:stun3.l.google.com:19302",
                                "stun:stun4.l.google.com:19302",
                                "stun:stun.ekiga.net",
                                "stun:stun.ideasip.com",
                                "stun:stun.rixtelecom.se",
                                "stun:stun.schlund.de",
                                "stun:stun.stunprotocol.org:3478",
                                "stun:stun.voiparound.com",
                                "stun:stun.voipbuster.com",
                                "stun:stun.voipstunt.com",
                                "stun:stun.voxgratia.org"
                            ]
                        }
                    ]
                }
                let peerConnection = new RTCPeerConnection(configuration)
            
                peerConnection.removeStream(stream)
                peerConnection.close()
            })
    }

    
    
    const joinCall = async () => {
        // let username = state.username
        setVideoCallDisplay(true)        
        navigator.getUserMedia({
            video:{
                frameRate:24,
                width:{min:480, ideal:720 , max:1280 },
                aspectRatio: 1.333333
            },
            audio:{echoCancellation:true},   
        },(stream)=>{
            localStream.current.srcObject = stream
            console.log('stream created',stream)
            abc.localStream = stream
            setCurrentLocalStream(stream)
            let configuration = {
                iceServers:[
                    {
                        "urls":[
                            "stun:stun.l.google.com:19302",
                            "stun:stun1.l.google.com:19302",
                            "stun:stun2.l.google.com:19302",
                            "stun:stun3.l.google.com:19302",
                            "stun:stun4.l.google.com:19302",
                            "stun:stun.ekiga.net",
                            "stun:stun.ideasip.com",
                            "stun:stun.rixtelecom.se",
                            "stun:stun.schlund.de",
                            "stun:stun.stunprotocol.org:3478",
                            "stun:stun.voiparound.com",
                            "stun:stun.voipbuster.com",
                            "stun:stun.voipstunt.com",
                            "stun:stun.voxgratia.org"
                        ]
                    }
                ]
            }
            let peerConnection = new RTCPeerConnection(configuration)
            console.log('peer conn',peerConnection)
            abc.myPC = peerConnection
            setPC(peerConnection)
            peerConnection.addStream(stream) // this is used to send media stream to remote peer
             
            peerConnection.onaddStream = (e) =>{
                console.log('remote stream ',e.stream)
                remoteStream.current.srcObject = e.stream
                
            }// this is used to receive media stream from remote peer
            peerConnection.onremovestream = (e) =>{
                peerConnection.close()
            }
            peerConnection.onicecandidate = (e) =>{ 
                if(e.candidate === null) return
                sendData({
                    type: "send_candidate",
                    candidate: e.candidate
                })
            } // this event occurs whenever local peer wants to send media/stream  to the remote peer
              // here ICE agent negotiates with the remote peer interface  
            sendData({
                type:"join_call"
            })

            
            
                                 
            
        },(error)=>console.log({error:error}))   
    }

    const createAndSendAnswer = () =>{
        console.log('send answer ',pc)
        let peerConnection = abc.myPC
        peerConnection.createAnswer({
            voiceActivityDetection:true
        }).then(answer=>{

            peerConnection.setLocalDescription(answer)
            sendData({
                type:"send_answer",
                answer:answer
            })
        }).catch(error=>console.log({error:error}))
       
    }

    const handleSignallingData = (data) =>{
        let peerConnection = abc.myPC
        switch(data.type){
            case "offer":
                peerConnection.setRemoteDescription(data.offer)
                createAndSendAnswer()
                break
            case "candidate":
                peerConnection.addIceCandidate(data.candidate)
                break
            default:
                break
        }
       
    }

    webSocket.onmessage = (e) =>{
        handleSignallingData(JSON.parse(e.data))
       
    }

    const toggleVideo = () =>{
       const temp_video = state.video_on
       let tempLocalStream = currentLocalStream
       setState(prevState=>({...prevState,video_on:!temp_video}))
       tempLocalStream.getVideoTracks()[0].enabled = !temp_video
    }
    const toggleAudio = () =>{
        const temp_audio = state.audio_on
        let tempLocalStream = currentLocalStream
        setState(prevState=>({...prevState,audio_on:!temp_audio}))
        tempLocalStream.getAudioTracks()[0].enabled = !temp_audio
    }

    const endCall = () =>{
        let peerConnection = abc.myPC
        let tempLocalStream = currentLocalStream
        peerConnection.removeStream(tempLocalStream)
        peerConnection.close()
        setPC(peerConnection)
        window.close()
    }

    return (
        <div>
            <div>
                <input type="text" placeholder="enter username" id="username_input" onChange={saveUsername} />
                <button onClick={joinCall}>join call</button>
                <button onClick={rejectCall}>reject call</button>
                
            </div>
            <div id={styles.video_call_div} style={videoCallDisplay?{display:"inline"}:{display:"none"}} >
                <video   id={styles.local_video} ref={localStream} autoPlay muted ></video>
                <video id={styles.remote_video} ref={remoteStream} autoPlay muted ></video>
                    <div className={styles.controls}>
                        <button className={styles.btn} onClick={toggleVideo}>Toggle Video</button>
                        <button className={styles.btn} onClick={toggleAudio}>Toggle Audio</button>
                        <button className={styles.end_call} onClick={endCall}>End Call</button>
                    </div>
            </div>
        </div>
    )
}

export default Receiver
