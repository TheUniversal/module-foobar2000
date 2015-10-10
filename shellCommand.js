'use strict';

var Commands = require('the-universal-common/command/Commands');

var exec = require('child_process').exec;
var fs = require('fs');

var foobarPath = 'C:/Program Files (x86)/foobar2000/';

if (fs.readdirSync(foobarPath).indexOf('foobar2000.exe') === -1) {
    throw 'Foobar2000.exe was not found';
}

module.exports = {
    sendCommand: function(command) {
        exec('foobar2000.exe /' + (command  === Commands.PLAYBACK.PREVIOUS ?  'prev' : command),
            { cwd: foobarPath });
    },

    launchFoobar: function() {
        exec('foobar2000.exe', { cwd: foobarPath });
    }
};

