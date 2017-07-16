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

//Used to check if the code is authenticated or not
var authenticated = false;

//Send the initial connection command
ws.on('open', () => {
    //sends initial connect command
    ws.send(JSON.stringify(talkToIt));
});

//this function takes care of sending commands to the music player
var sendCommands = () => {

        prompt.get(['command'], (err, result) =>{
           input = result.command;
           if(input === "q"){
               console.log("Exiting");
               return 0;
           } else{
               console.log(input);

               switch(input){
                   case "n":
                       ws.send(command.nextSong);
                       break;

                   case "p":
                        ws.send(command.previousSong);
                        break;

                   case "t":
                       ws.send(command.playPause);
                       break;

                   default:
                       console.log("Not a valid choice")
               }
               //so it starts over again
               sendCommands();
           }
        });
};

var sendHttpCommand = (command) =>{

};


//How to handle data that is returned
ws.on('message', (data) => {

    //Whenever data is received from GMDP
    data = JSON.parse(data);

    //Authentication
    if(data.channel === "connect"){
        {
            prompt.start();
            console.log(data.payload);
            //Prompt user to enter code if required
            if(data.payload === "CODE_REQUIRED") {
                prompt.get(['code'], (err, result) => {
                    talkToIt.arguments.push(result.code);
                    console.log("Code Insert" , talkToIt);
                    ws.send(JSON.stringify(talkToIt));
                });

                //This means code entered, now to enter the response password
            } else{
                talkToIt.arguments.pop();
                talkToIt.arguments.push(data.payload);
                console.log("Random chars insert" , talkToIt);
                ws.send(JSON.stringify(talkToIt));
                console.log("Authenticated");

                //Everything's been authenticated, lets start sending commands.
                if(!authenticated){
                    sendCommands();
                    authenticated = true;
                }
            }
        }
    }

    //else do other things with data
    else{
        func.saveIt(data);
    }
});



// Start all the GUI part
app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    if(!authenticated){
        ws.on('open', () => {
            ws.send(JSON.stringify(talkToIt));
        });
    } else {
      //  renderRemote();
        console.log('Should render remote');
    }

});

//Start the server
server.listen(8080, () =>{
   console.log('server up');
});
