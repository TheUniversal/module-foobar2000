'use strict';

var Maybe = require('data.maybe');

var VOLUME_CODE = 222;
var INFO_CODE = 999;
var STATUS_CODES = {
    'playing': 111,
    'stopped': 112,
    'paused': 113
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

function getStatusNameByCode(code) {
    for (var status in STATUS_CODES) {
        if (STATUS_CODES.hasOwnProperty(status) && STATUS_CODES[status] === code) {
            return status;
        }
    }
}

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
    var status = getStatusNameByCode(code);

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

    messageLines.forEach(function (line) {
        var code = parseInt(line.substring(0, 3), 10);
        var message = line.substring(3);
        if (code === INFO_CODE) {
            infoMessage += message + '\n';
        } else {
            statusMessages.push(messageObject(code, message))
        }
    });

    return {
        statusMessages: statusMessages,
        infoMessage: infoMessage
    }
};
