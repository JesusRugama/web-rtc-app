import { firestore } from './firebase';

console.log({ firestore })

const servers = {
    iceServers: [
        {
            urls: [
                'stun:stun.l.google.com:19302',
                'stun:stun1.l.google.com:19302',
                'stun:stun2.l.google.com:19302'
            ],
        },
    ],
    iceCandidatePoolSize: 10,
};

export const pc = new RTCPeerConnection(servers);

const callId = 'UHreFeLzDyGjl9ucNni5';
const callDocRef = firestore.collection('calls').doc(callId);
const callDoc = await callDocRef.get();
const offerCandidates = callDocRef.collection('offerCandidates');
const answerCandidates = callDocRef.collection('answerCandidates');

console.log({offerCandidates});

const startCall = async () => {
    // Get candidates for caller, save to db
    pc.onicecandidate = (event) => {
        console.log('onicecandidate')
        event.candidate && offerCandidates.add(event.candidate.toJSON());
    };

    // Create offer
    const offerDescription = await pc.createOffer();
    const localDescription = await pc.setLocalDescription(offerDescription);

    console.log({localDescription})

    const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
    };

    await callDocRef.set({ offer });

    // Listen for remote answer
    callDocRef.onSnapshot((snapshot) => {
        const data = snapshot.data();
        console.log({data});
        if (!pc.currentRemoteDescription && data?.answer) {
            const answerDescription = new RTCSessionDescription(data.answer);
            pc.setRemoteDescription(answerDescription);

            console.log('setRemoteDescription');
        }
    });

    // When answered, add candidate to peer connection
    answerCandidates.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {

            if (change.type === 'added') {
                const candidate = new RTCIceCandidate(change.doc.data());
                pc.addIceCandidate(candidate);
            }
        });
    });
};

const answer = async () => {
    pc.onicecandidate = (event) => {
        console.log('answerCandidates');
        event.candidate && answerCandidates.add(event.candidate.toJSON());
    };

    const callData = (await callDocRef.get()).data();

    const offerDescription = callData.offer;
    await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

    const answerDescription = await pc.createAnswer();
    await pc.setLocalDescription(answerDescription);

    const answer = {
        type: answerDescription.type,
        sdp: answerDescription.sdp,
    };

    const response = await callDocRef.update({ answer });

    console.log({response});

    offerCandidates.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            console.log(change);

            if (change.type === 'added') {
                let data = change.doc.data();
                pc.addIceCandidate(new RTCIceCandidate(data));

                console.log('addIceCandidate');
            }
        });
    });
};

export const connect = () => {
    const type = localStorage.getItem('type');
    if (type === 'host' || !callDoc.exists) {
        startCall();
        localStorage.setItem('type', 'host');
    } else {
        console.log('guest')
        answer();
        localStorage.setItem('type', 'guest');
    }
}