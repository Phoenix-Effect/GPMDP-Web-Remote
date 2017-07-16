/**
 * Created by Suhail on 7/14/17.
 */
/* Objects sent to google remote as commands, all titles are self explanatory */



var nextSong = '{"namespace":"playback", "method":"forward"}';
var previousSong = '{"namespace": "playback", "method": "rewind"}';
var playPause = '{"namespace": "playback", "method": "playPause"}';

module.exports = {
    nextSong,
    previousSong,
    playPause
};