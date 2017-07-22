/**
 * Created by Suhail on 7/14/17.
 */
/* Objects sent to google remote as commands, all titles are self explanatory */



var nextSong = '{"namespace":"playback", "method":"forward"}';
var previousSong = '{"namespace": "playback", "method": "rewind"}';
var playPause = '{"namespace": "playback", "method": "playPause"}';
var volumeUp = '{"namespace": "volume", "method": "increaseVolume", "arguments":[10]  }';
var volumeDown = '{"namespace": "volume", "method": "decreaseVolume", "arguments":[10] }';

module.exports = {
    nextSong,
    previousSong,
    playPause,
    volumeUp,
    volumeDown
};