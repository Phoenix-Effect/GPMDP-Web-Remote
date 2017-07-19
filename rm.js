/**
 * Created by Suhail on 7/12/17.
 */
const WebSocket = require('ws');
const prompt = require('prompt');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const publicPath = path.join( __dirname, './public');
const func = require('./functions');
const command = require('./commands');

const ws = new WebSocket('ws://localhost:5672');

// Start all the remote control part

//Initial connect command
var talkToIt = {
    namespace: "connect",
    method : "connect",
    arguments: ["GM-Remote"]
};

var currentUser = () => {
    console.log(currentUser.socket);
};

//Used to check if the code is authenticated or not
var authenticated = false;
var currentDataObj = {};

//Latest content
var currentData = (data) => {
    if(data.channel === 'volume'){
        currentDataObj.volume = data.payload;
    }

    if(data.channel === 'time'){
        currentDataObj.currentTime = data.payload.current;
        currentDataObj.totalTime = data.payload.total;
    }

    if(data.channel === 'track'){
        currentDataObj.title = data.payload.title;
        currentDataObj.artist = data.payload.artist;
        currentDataObj.album = data.payload.album;
        currentDataObj.albumArt = data.payload.albumArt;
        console.log(currentDataObj);
    }

    if(data.channel === 'shuffle'){
        currentDataObj.shuffle = data.payload;
        console.log(data);
    }

    try{
        currentUser.socket.emit('currentData', currentDataObj);
    }
    catch(err){
        console.log('No user connected at the moment');
    }
};



//Send the initial connection command
var authIt = (data) => {
    console.log(authIt.AuthData);
    if(data.payload === "CODE_REQUIRED") {
        console.log('Getting code from client');
        currentUser.socket.emit('getCode', undefined);

        currentUser.socket.on('authCode', (data) => {
            console.log('Recived auth code');
            console.log(data);
            talkToIt.arguments.push(data.code);
            ws.send(JSON.stringify(talkToIt));
        });
    }

    else {
        talkToIt.arguments.pop();
        talkToIt.arguments.push(data.payload);
        console.log("Random chars insert", talkToIt);
        ws.send(JSON.stringify(talkToIt));
        console.log("Authenticated");

        //Everything's been authenticated, lets start sending commands.
        if(!authenticated){
            currentUser.socket.emit('authenticated', undefined);
            controlIt();
            authenticated = true;
        }
    }
};

//How to handle data that is returned
ws.on('message', (data) => {

    //Whenever data is received from GMDP
    data = JSON.parse(data);

    //Authentication
    if(data.channel === "connect"){
        {
            console.log('Handing it over to AuthIt');
            authIt(data);
        }
    }

    //else do other things with data
    else{
        currentData(data);
    }
});



// Start all the GUI part
app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    //saves the current socket in external variable so other events can use it
    currentUser.socket = socket;
    currentUser.socket.emit('currentData', currentDataObj);

    if(!authenticated){
            //tells gm to authentication needs to happen
            ws.send(JSON.stringify(talkToIt));
            console.log('Trying to Authenticate');
            //console.log(socket);
            authIt.AuthData = "Auth data from within the client socket";

    } else {

        controlIt();
        console.log('Should render remote');
    }

});

//Start the server
server.listen(8090, () =>{
   console.log('Server up');
});

//remote control
var controlIt = () => {
    console.log('Controlling it');
    currentUser.socket.on('command', (data) => {
        console.log(data);

        switch(data.command) {
            case "nextSong":
                ws.send(command.nextSong);
                console.log('sending command to next song');
                break;

            case "previousSong":
                ws.send(command.previousSong);
                console.log('prev song');
                break;

            case "playPause":
                ws.send(command.playPause);
                console.log('play pause');
                break;
        }

    });
};

