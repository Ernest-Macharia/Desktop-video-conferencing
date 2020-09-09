let handleFail = function(err) {
    console.log("Error : ", err);
};

let remoteContainer = document.getElementById(elementId: "remote-container");

function addVideoStream(elementId) {
    let streamDiv = document.createElement( tagName: "div");
    streamDiv.id = elementId;
    streamDiv.style.transform = "rotateY(180deg)";
    remoteContainer.appendChild(streamDiv);
}

function removeVideoStream(elementId) {
    let remDiv = document.getElementById(elementId);
    if(remDiv) remDiv.parentNode.removeChild(remDiv);
}

let client = AgoraRTC.createClient(e:{
    mode: "rtc",
    codec: 'vp8',

});
client.init('029250729b864e369e87073a3fd265');

client.join(separator:null, 'any-channel',
    null, (uid) => {
        let localStream = AgoraRTC.createStream(e: {
            video: true,
            audio: true,

        });
        localStream.init(() => {
            localStream.play('me');
            client.publish(localStream, handleFail);
        }, handleFail);
    }, handleFail);


client.on('stream-added', function(evt) {
    client.subscribe(evt.stream, handleFail);
});

client.on('stream-subscribed', function(evt) {
    let stream = evt.stream;
    let streamId = String(stream.getId());
    addVideoStream(streamId);
    stream.play(streamId);
})

client.on('stream-removed', function(evt) {
    let stream = evt.stream;
    let streamId = String(stream.getId());
    stream.close();
    removeVideoStream(streamId);
});
client.on('peer-leave', function(evt) {
    let stream = evt.stream;
    let streamId = String(stream.getId());
    stream.close();
    removeVideoStream(streamId);
});