const socket = io();

socket.on('connect', () => {
    const peerConnection = new RTCPeerConnection();

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            document.getElementById('videos-container').innerHTML = `<video id="localVideo" autoplay></video>`;
            document.getElementById('localVideo').srcObject = stream;
            stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
        })
        .catch(error => console.error('Error accessing media devices: ', error));

    socket.on('user-connected', userId => {
        const remoteVideo = document.createElement('video');
        remoteVideo.setAttribute('autoplay', true);
        document.getElementById('videos-container').appendChild(remoteVideo);

        peerConnection.createOffer()
            .then(offer => peerConnection.setLocalDescription(new RTCSessionDescription(offer)))
            .then(() => {
                socket.emit('offer', offer, userId);
            });
    });

    socket.on('offer', (offer, userId) => {
        peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
            .then(() => peerConnection.createAnswer())
            .then(answer => peerConnection.setLocalDescription(new RTCSessionDescription(answer)))
            .then(() => {
                socket.emit('answer', answer, userId);
            });
    });

    socket.on('answer', (answer, userId) => {
        peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    });
});
