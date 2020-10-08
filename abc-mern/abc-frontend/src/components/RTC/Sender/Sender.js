import React,{useState,useRef,useEffect} from 'react'
import styles from "../Style.module.css"
import {w3cwebsocket} from "websocket"


const Sender = (props) => {
    const [state,setState] = useState(()=>({
        video_on:true,
        audio_on:true,
        username:'',
        videoDisplay:false,
        localStream:null,
        remoteStream:null,
        prConnection:null
    }))
    const [localStream,setLocalStream]=useState(null)
    const [pc,setPC] = useState(null)
    const localVideo = useRef()
    const remoteVideo = useRef()
    const abc = {}
    // useEffect(()=>{
    //     setState((prevState)=>({...prevState,username:""}))
    // })
    const webSocket = new w3cwebsocket('ws://192.168.0.197:5000/app/v1/user/call')
  
    
    
    // let video_call_display;
    

    const saveUsername = (e) =>{
        e.persist()
        setState(prevState=>({...prevState,username:e.target.value}))
    }
    const sendData = (data) =>{
        // data.username = state.username
        // webSocket.send(JSON.stringify(data))

    }

    const sendUsername = ()=>{
        sendData({type:"store_user"})

    }
    
    const startCall = async () => {
        // video_call_display = true
        setState((prevState)=>({...prevState,videoDisplay:true}))
        navigator.getUserMedia({
            video:{
                frameRate:24,
                width:{min:480, ideal:720 , max:1280 },
                aspectRatio: 1.333333
            },
            audio:{echoCancellation:true},   
        },async (stream)=>{
            console.log('stream',stream)
            // setState((prevState)=>({...prevState,localStream:stream}))
            // localStream = stream
            abc.localStream = stream
            setLocalStream(stream)
            if(localVideo.current){
                localVideo.current.srcObject = stream
            }
            // document.querySelector(".localVideo").srcObject
            console.log('local stream',localStream)
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
            abc.myPC = peerConnection
            if(peerConnection){
                setPC(peerConnection)

                console.log(peerConnection,'abcdvs')
            console.log('abc',pc)}
            peerConnection.addStream(stream) // this is used to send media stream to remote peer
            // for(const track of localStream.getTracks()){
            //     peerConnection.addTrack(track,localStream)
            // }
            peerConnection.onaddStream = (e) =>{
                remoteVideo.current.srcObject = e.stream
                
            }
            // this is used to receive media stream from remote peer
            peerConnection.onremovestream = (e) =>{
                peerConnection.close()
            }
            
            peerConnection.onicecandidate = (e) =>{
                if(e.candidate === null) return
                sendData({
                    type: "store_candidate",
                    candidate: e.candidate
                })
            } // this event occurs whenever local peer wants to send media/stream  to the remote peer
              // here ICE agent negotiates with the remote peer interface  

            
            createAndSendOffer() // this function will start gathering ICE (Internet Connectivity Establishment) candidates 
                                 
            
        },(error)=>console.log(error))   
    }
    
    useEffect(() => {
        if(localStream){
        console.log('localStream',localStream)}
        console.log(pc)
      });

    
    const createAndSendOffer = () =>{
        // initiates the creation of an SDP (session description protocol) offer for the purpose 
        //of starting a new WebRTC connection to a remote peer
        console.log('create and send offer',abc.myPC)        
        let peerConnection = abc.myPC
        
        if(peerConnection){
        peerConnection.createOffer({
            offerToReceiveAudio:true,
            offerToReceiveVideo:true,
            voiceActivityDetection:true,
            iceRestart:false,
        })
        .then(offer=>{
            sendData({
                type:"store_offer",
                offer: offer
            })
            peerConnection.setLocalDescription(offer).then(success=>console.log({success:success}),failure=>console.log({failure:failure}))
        }).catch(error=>console.log({error:error})) 
    }
        
    }

    const handleSignallingData = (data) =>{
        let peerConnection = abc.myPC
        switch(data.type){
            case "answer":
                peerConnection.setRemoteDescription(data.answer)
                break
            case "candidate":
                peerConnection.addIceCandidate(data.candidate)
                break
            default:
                break
        }

        
    }
    // useEffect(()=>{
    //     console.log(pc)
    // })

    webSocket.onmessage = (e) =>{
        handleSignallingData(JSON.parse(e.data))
       
    }

    const toggleVideo = () =>{
        let tempLocalStream = localStream
       const temp_video = state.video_on
       setState(prevState=>({...prevState,video_on:!temp_video}))
       tempLocalStream.getVideoTracks()[0].enabled = !temp_video
       setLocalStream(tempLocalStream)
    }
    const toggleAudio = () =>{
        const temp_audio = state.audio_on
        let tempLocalStream = localStream
        setState(prevState=>({...prevState,audio_on:!temp_audio}))
        tempLocalStream.getAudioTracks()[0].enabled = !temp_audio
        setLocalStream(tempLocalStream)
    }
    const endCall = () =>{
        window.close()
        let peerConnection = abc.myPC
        let tempLocalStream = localStream
        peerConnection.removeStream(tempLocalStream)
        peerConnection.close()
        
    }
    return (
        <div>
            <div>
                <input type="text" placeholder="enter username" id="username_input" onChange={saveUsername} />
                <button onClick={sendUsername}>send username</button>
                <button onClick={startCall}>start call</button>
            </div>
            <div id={styles.video_call_div} style={state.videoDisplay?{display:"block"}:{display:"none"}} >
                <video   id={styles.local_video} className="localVideo" ref={localVideo} autoPlay muted ></video>
                <video id={styles.remote_video} ref={remoteVideo} autoPlay muted ></video>
                    <div className={styles.controls}>
                        <button className={styles.btn} onClick={toggleVideo}>Toggle Video</button>
                        <button className={styles.btn} onClick={toggleAudio}>Toggle Audio</button>
                        <button className={styles.end_call} onClick={endCall}>End Call</button>
                    </div>
            </div>
        </div>
    )
}

export default Sender
