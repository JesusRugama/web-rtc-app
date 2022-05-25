import { useEffect, useRef } from "react";
import { pc, connect } from "../rtc";

const RemoteVideo = () => {
    const videoRef = useRef(null);

    useEffect(() => {
        const remoteStream = new MediaStream();

        pc.ontrack = event => {
            event.streams[0].getTracks().forEach(track => {
                remoteStream.addTrack(track);
            })
        }

        connect();

        videoRef.current.srcObject = remoteStream;
    }, [])

    return (
        <video ref={videoRef} autoPlay playsInline />
    )
}

export default RemoteVideo;