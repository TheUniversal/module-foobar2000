'use strict';

var net = require('net');
var parseMessage = require('./parseMessage');

var CONTROL_SERVER_PORT = 3333;
var client;

function onData(data){
    var message = parseMessage(data.toString('utf-8'));
    //todo: route messages back to core
}

function onError(error){
    //todo send "onError" event
    console.log('Connection to control server was closed. Foobar2000 was possibly closed.', socket.id, error);
}

module.exports = {
    connect: function(){
        client = net.connect({port: CONTROL_SERVER_PORT}, function(){
            console.log('Control server connected', socket.id);
        });

        client.setKeepAlive(true, 10000);
        client.on('data', onData);
        client.on('end', onError);
        client.on('error', onError);
    },

    sendCommand: function(command){
        try {
            client.write(command + '\r\n');
            console.log('Control server command sent for action', command);
        } catch (error) {
            onError(error);
        }
    },

    endConnection: function(){
        client.end();
    }
};
