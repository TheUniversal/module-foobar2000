'use strict';

var Commands = require('the-universal-common/command/Commands');
var controlServerSocket = require('./controlServerSocket');
var shellCommand = require('./shellCommand');
var parseMessage = require('./parseMessage');

var dispatcher;

function onData(data){
    var message = parseMessage(data.toString('utf-8'));

    message.statusMessages.forEach(function(message){
        if (message.playbackStatus.isJust) {
            dispatcher.onPlaybackEvent(message.playbackStatus.get())
        }
        if (message.volume.isJust) {
            console.log('volume-level', message.volume.get())
        }
    });
}

module.exports = function Foobar2000Module(playerEventDispatcher) {
    dispatcher = playerEventDispatcher;

    return {
        name: 'Foobar2000',
        supportedCommands: [
            Commands.PLAYBACK.PLAY,
            Commands.PLAYBACK.PAUSE,
            Commands.PLAYBACK.STOP,
            Commands.PLAYBACK.NEXT,
            Commands.PLAYBACK.PREVIOUS,
            Commands.VOLUME.MUTE,
            Commands.VOLUME.DOWN,
            Commands.VOLUME.UP
        ],
        onPlaybackCommand: function(command){
            shellCommand.sendCommand(command);
        },
        onVolumeChange: function(command){
            controlServerSocket.sendCommand(command, dispatcher.onError);
        },
        onActivateModule: function(){
            controlServerSocket.connect(onData, dispatcher.onError);
        },
        onDeactivateModule: controlServerSocket.endConnection
    }
};

