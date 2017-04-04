var socket = require('socket.io-client')('http://ch4t.ga'),
    util = require('util'),
    colors = require('./colors.js'),
    blessed = require('blessed'),
    config = require('./config.js');

var log = '';

var screen = blessed.screen({
    dockBorders: true
});

var main = blessed.box({
    top: 'top',
    left: 'center',
    width: '100%',
    height: '100%-2',
    border: {
	type: 'line'
    },
    scrollable: true,
    style: {
	fg: 'white',
	border: {
	    fg: '#f0f0f0'
	}
    }
});

var input = blessed.textarea({
    bottom: 0,
    height: 3,
    width: '100%',
    autoPadding: true,
    inputOnFocus: true,
    padding: {
        top: 0,
        left: 2
    },
    border: {
	type: 'line'
    },
    style: {
	fg: 'white',
	border: {
	    fg: '#f0f0f0'
	}
    }
});

screen.append(main);
screen.append(input);
screen.render();
sendmsg('Connecting...');
input.focus();
screen.render();

input.key(['escape', 'C-q', 'C-c'], function(ch, key) {
    return process.exit(0);
});

input.key(['enter'], function(ch, key) {
    var data = {
        username: config.username,
        message: input.getValue(),
	customcolor: config.customcolor,
	timestamp: 'Half Past Ass'
	};
    var col = '';
    if(data.customcolor === '99') col = colors[rand(0,colors.length)].code;
    else col = colors[config.customcolor].code;
    socket.emit('new message', data);
    sendmsg(col + data.timestamp + ": " + data.message + "{/}");
    this.clearValue();
    screen.render();
});

function sendmsg (string) {
    log += string + '\n';
    main.setContent(log);
};

socket.on('connect', function(){
	socket.emit('add user', config.username);
	sendmsg('Connected as ' + config.username);
	screen.render();
});

socket.on('disconnect', function() {
	sendmsg('{red-fg}Disconnected... REEEEE{/}');
	screen.render();
});

socket.on('login', function(data) {
	sendmsg('{cyan-fg}Logged in, Users online: ' + data.numUsers + '{/}');
	sendmsg('{cyan-fg}'+data.userlist+'{/}');
	screen.render();
});

socket.on('new message', function (data) {
    var col = '';
    if(data.customcolor === '99') col = colors[rand(0,colors.length)].code;
    else col = colors[config.customcolor].code;
    socket.emit('new message', data);
    sendmsg(col + data.timestamp + ": "+ data.username + ": " + data.message + "{/}");
    screen.render();
});
