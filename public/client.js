/**
 * Created by Suhail on 7/15/17.
 */

//socket starting
const socket = io.connect();

//events
socket.on('news', (data) => {
    console.log(data);
    socket.emit('otherevent', { my : 'data' });
});

//emit stuff
function nextSong(){
    socket.emit('command', { command: 'nextSong'});
}