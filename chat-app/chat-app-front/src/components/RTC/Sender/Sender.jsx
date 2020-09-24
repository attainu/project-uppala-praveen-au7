import React,{useState} from 'react'
import styles from "../Style.module.css"
const Sender = (props) => {
    const [state,setState] = useState(()=>({
        video_on:true,
        audio_on:true,
        username:''
    }))
    const webSocket = new WebSocket('ws://127.0.0.1:5000')
    let localStream;
    let remoteStream;
    let video_call_display=false;
    let peerConnection;

    const saveUsername = (e) =>{
        e.persist()
        setState(prevState=>({...prevState,username:e.target.value}))
    }
    const sendData = (data) =>{
        data.username = state.username
        webSocket.send(JSON.stringify(data))

    }

    const sendUsername = ()=>{
        sendData({type:"store_user"})

    }
    
    const startCall = async () => {
        video_call_display = true
        
        navigator.mediaDevices.getUserMedia({
            video:{
                frameRate:24,
                width:{min:480, ideal:720 , max:1280 },
                aspectRatio: 1.333333
            },
            audio:{echoCancellation:true},   
        },(stream)=>{
            localStream = stream
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
            peerConnection = new RTCPeerConnection(configuration)
            peerConnection.addStream(localStream) // this is used to send media stream to remote peer
            // for(const track of localStream.getTracks()){
            //     peerConnection.addTrack(track,localStream)
            // }
            peerConnection.onaddStream = (e) =>{
                remoteStream = e.stream
                
            }// this is used to receive media stream from remote peer
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
    const createAndSendOffer = () =>{
        // initiates the creation of an SDP (session description protocol) offer for the purpose 
        //of starting a new WebRTC connection to a remote peer
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

    const handleSignallingData = (data) =>{
        switch(data.type){
            case "answer":
                peerConnection.setRemoteDescription(data.answer)
                break
            case "candidate":
                peerConnection.addIceCandidate(data.candidate)
                break
        }
    }

    webSocket.onmessage = (e) =>{
        handleSignallingData(JSON.parse(e.data))
       
    }

    const toggleVideo = () =>{
       const temp_video = state.video_on
       setState(prevState=>({...prevState,video_on:!temp_video}))
       localStream.getVideoTracks()[0].enabled = !temp_video
    }
    const toggleAudio = () =>{
        const temp_audio = state.audio_on
        setState(prevState=>({...prevState,audio_on:!temp_audio}))
        localStream.getAudioTracks()[0].enabled = !temp_audio
    }
    const endCall = () =>{
        
        peerConnection.removeStream(localStream)
        peerConnection.close()
    }
    return (
        <div>
            <div>
                <input type="text" placeholder="enter username" id="username_input" onChange={saveUsername} />
                <button onClick={sendUsername}>send username</button>
                <button onClick={startCall}>start call</button>
            </div>
            <div id={styles.video_call_div} style={video_call_display?{display:"inline"}:{display:"none"}} >
                <video   id={styles.local_video} src={localStream} autoPlay muted ></video>
                <video id={styles.remote_video} src={remoteStream} autoPlay muted ></video>
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
