import { useEffect, useRef } from "react";
import { pc, connect } from "../rtc";

const LocalVideo = () => {
    const videoRef = useRef();

    const startVideo = async () => {
        const localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            // audio: true,
        });

        localStream.getTracks().forEach((track) => {
            pc.addTrack(track, localStream);
        });

        connect();

        videoRef.current.srcObject = localStream;
    }

    useEffect(() => {
        startVideo();
    }, [])

    return (
        <video ref={videoRef} autoPlay playsInline />
    )
}

export default LocalVideo;