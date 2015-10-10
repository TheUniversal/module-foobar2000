'use strict';

var PlaybackStatus = require('the-universal-common/playback/PlaybackStatus');
var Maybe = require('data.maybe');

var VOLUME_CODE = 222;
var INFO_CODE = 999;
var STATUS_LIST = {
    111 : PlaybackStatus.PLAYING,
    112 : PlaybackStatus.STOPPED,
    113 : PlaybackStatus.PAUSED
};
var MESSAGE_STATUS_FIELDS = [
    'status',
    //next two fields are not used by this module
    null,
    null,
    'secondsPlayed',
    'codec',
    'bitrate',
    'artist',
    'album',
    'date',
    'genre',
    'trackNumber',
    'track',
    'trackLength'
];

function parseTrackData(text) {
    var attributes = text.split('|');
    var trackData = {};

    attributes.forEach(function(item, iter) {
        var attribute = MESSAGE_STATUS_FIELDS[iter];
        if (attribute) {
            trackData[attribute] = item;
        }
    });

    return trackData;
}

function messageObject(code, message) {
    var status = STATUS_LIST[code];

    return {
        code: code,
        playbackStatus: Maybe.fromNullable(status),
        currentTrack: status ? Maybe.Just(parseTrackData(message)) : Maybe.Nothing(),
        volume: code === VOLUME_CODE ?  Maybe.Just(message.split('|')[1]) : Maybe.Nothing()
    };
}

module.exports = function parseMessage(message) {
    var messageLines = message.split('\r\n');
    var statusMessages = [];
    var infoMessage = '';
    var errorMessage = '';

    messageLines.filter(function(line) {
       return !!line
    }).forEach(function (line) {
        var code = parseInt(line.substring(0, 3), 10);
        var message = line.substring(3);
        if (code === INFO_CODE) {
            infoMessage += message + '\n';
        } else if (isNaN(code)) {
            errorMessage = line + '\n';
        } else {
            statusMessages.push(messageObject(code, message))
        }
    });

    return {
        statusMessages: statusMessages,
        infoMessage: infoMessage,
        errorMessage: errorMessage
    }
};
