/**
 * Created by Suhail on 7/15/17.
 */

//socket starting
const socket = io.connect();

//helpful functions
var milToMin = (millis)  => {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
};

//events
//got request from server to authenticate
socket.on('getCode', (data) =>{
    console.log('Please send authentication data');
    document.getElementById("auth-box").style.display="inline";
});

socket.on('authenticated', (data) =>{
    console.log('Authenticated!');
    document.getElementById("auth-box").style.display="none";
});

socket.on('currentData', (data) =>{
    console.log('Got current data!');
    console.log(data);
    document.getElementById("album-box").style.backgroundImage = 'url('+data.albumArt+')';
    document.getElementById("song-name").innerText = data.title;
    document.getElementById("artist-name").innerText = data.artist;
    document.getElementById("current-volume").innerText = data.volume;
});

socket.on('currentTime', (data) => {
    document.getElementById("current-time").innerText = milToMin(data.currentTime);
    document.getElementById("total-time").innerText = milToMin(data.totalTime);
    document.getElementById("progress-bar").max = data.totalTime;
    document.getElementById("progress-bar").value = data.currentTime;
});

//emit stuff
var nextSong = () => {
    socket.emit('command', { command: 'nextSong'});
    console.log('client sent command');
};

var prevSong = () => {
    socket.emit('command', { command: 'previousSong'});
    console.log('client sent command');
};

var playPause = () => {
    socket.emit('command', { command: 'playPause'});
    console.log('client sent command');
};

var sendCode = () => {
    var authCodeInput = document.getElementById("authCode").value;
    console.log(authCodeInput);
    socket.emit('authCode', { code: authCodeInput });
};

var volumeUp = () => {
    socket.emit('command', { command: 'volumeUp'});
};

var volumeDown = () => {
    socket.emit('command', { command: 'volumeDown'});
};