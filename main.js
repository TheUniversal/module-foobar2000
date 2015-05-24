'use strict';

var commands = require('the-universal-common/command/Commands');
var controlServerSocket = require('./controlServerSocket');
var parseMessage = require('./parseMessage');

var dispatcher;

function onData(data){
    var message = parseMessage(data.toString('utf-8'));
    //todo: route messages back to core
}

function sendCommand(command) {
    controlServerSocket.sendCommand(command, dispatcher.onError);
}

module.exports = function Foobar2000Module(playerEventDispatcher) {
    dispatcher = playerEventDispatcher;

    return {
        name: 'Foobar2000',
        supportedCommands: [
            commands.PLAYBACK.PLAY,
            commands.PLAYBACK.PAUSE,
            commands.PLAYBACK.STOP
        ],
        onPlaybackCommand: sendCommand,
        onVolumeChange: sendCommand,
        onActivateModule: function(){
            controlServerSocket.connect(onData, dispatcher.onError);
        },
        onDeactivateModule: controlServerSocket.endConnection
    }
};

