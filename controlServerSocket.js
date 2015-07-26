'use strict';

var net = require('net');

var CONTROL_SERVER_PORT = 3333;
var client;

module.exports = {
    connect: function(dataFn, errorFn){
        client = net.connect({port: CONTROL_SERVER_PORT}, function(){
            console.log('Control server connected');
        });

        client.setKeepAlive(true, 10000);
        client.on('data', dataFn);
        client.on('end', errorFn);
        client.on('error', errorFn);
    },

    sendCommand: function(command, errorFn){
        try {
            client.write(command + '\r\n');
            console.log('Control server command sent for action', command);
        } catch (error) {
            if (errorFn) {
                errorFn(error);
            }
        }
    },

    endConnection: function(){
        client.end();
    }
};
