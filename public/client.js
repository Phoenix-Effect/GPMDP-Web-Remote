/**
 * Created by Suhail on 7/15/17.
 */

//socket starting
const socket = io.connect();

//events
//got request from server to authenticate
socket.on('getCode', (data) =>{
   console.log('Please send authentication data');
   /*
    document.addEventListener("DOMContentLoaded", function(event) {
        document.getElementById("auth-form").style.display="inline";
        console.log("DOM fully loaded and parsed");
    });
    */
   document.getElementById("auth-form").style.display="inline";
});

//when authenticated
socket.on('authenticated', (data) =>{
    console.log('Authenticated!');
    document.getElementById("auth-form").style.display="none";
});

socket.on('currentData', (data) =>{
    console.log('Got current data!');
    console.log(data);
    document.getElementById("currentlyPlaying").innerText = data.title;
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