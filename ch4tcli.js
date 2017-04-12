var socket = require('socket.io-client')('http://ch4t.ga'),
    util = require('util'),
    colors = require('./colors.js'),
    blessed = require('blessed'),
    contrib = require('blessed-contrib'),
    notify = require('node-notifier');

var username = 'bot';
var customcolor = 99;

var screen = blessed.screen({
    dockBorders: true
});

var main = contrib.log({
    top: 'top',
    left: 'center',
    width: '100%',
    height: '100%-2',
    border: {
	type: 'line'
    },
    tags: true,
    scrollable: true,
    style: {
	fg: 'white',
        bg: '#000000',
	border: {
	    fg: '#f0f0f0',
            bg: '#000000'
	}
    },
    bufferLength: '100%-2'
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
        bg: '#000000',
	border: {
	    fg: '#f0f0f0',
            bg: '#000000'
	}
    }
});

var wireframe_i = 0,
    wireframeReady = 0;

var wireframe = blessed.image({
    file: './wireframe/frame0.png',
    scale: '0.075',
    border: {
        type: 'line'
    },
    top: 'center',
    left: 'center',
    onReady: wireframeReady = 1,
    style: {
	fg: 'white',
        bg: '#000000',
        border: {
            fg: '#f0f0f0',
            bg: '#000000'
        }
    }});

var nameBox = blessed.textarea({
    bottom: 0,
    left: 'center',
    height: 3,
    width: 30,
    autoPadding: true,
    inputOnFocus: true,
    padding: {
        top: 0,
        left: 2
    },
    border: {
	type: 'line'
    },
    label: 'Enter your Name',
    style: {
	fg: 'white',
        bg: '#000000',
	border: {
	    fg: '#f0f0f0',
            bg: '#000000'
	}
    }
});

screen.append(main);
screen.append(wireframe);
screen.append(nameBox);
screen.append(input);
input.hide();
screen.render();
//rendermsg('{blue-fg}Connecting...{/}');
nameBox.focus();
screen.render();

setInterval(function() {
    if(wireframeReady) {
        wireframe_i += 1;
        if(wireframe_i === 8) wireframe_i = 0;
        wireframe.setImage('./wireframe/frame' + wireframe_i + '.png');
        screen.render();
    }
}, 750)

input.key(['escape', 'C-q', 'C-c'], function(ch, key) {
    return process.exit(0);
});

nameBox.key(['escape', 'C-q', 'C-c'], function(ch, key) {
    return process.exit(0);
});

input.key(['enter'], function(ch, key) {
    var data = {
        username: username,
        message: input.getValue().slice(0, -1),
	customcolor: customcolor,
	timestamp: '0'
	};
    var col = '';
    if(data.customcolor === 99) col = colors[Math.floor(Math.random() * colors.length)].code;
    else col = colors[data.customcolor].code;
    socket.emit('new message', data);
    rendermsg(col + data.timestamp + ": " + data.username + ": " + data.message + "{/}");
    this.clearValue();
    screen.render();
});

nameBox.key(['enter'], function(ch, key) {
    username = nameBox.getValue().slice(0,-1);
    customcolor = 99;
    wireframeReady = 0;
    wireframe.hide();
    nameBox.hide();
    input.show();
    screen.render();
    loginToChat();
    input.focus();
});
    

function rendermsg(string) {
    main.log(string);
    screen.render();
};

function loginToChat() {
    socket.emit('add user', username);
    rendermsg('Logging in...');
}

socket.on('connect', function(){
/*	socket.emit('add user', config.username);
	rendermsg('Connected as ' + config.username);
	screen.render();*/
	rendermsg('Connected to Server, awaiting username');
});

socket.on('disconnect', function() {
	rendermsg('{red-fg}Disconnected... REEEEE{/}');
});

socket.on('login', function(data) {
	rendermsg('{cyan-fg}Logged in, Users online: ' + data.numUsers + '{/}');
	rendermsg('{cyan-fg}'+data.userlist+'{/}');
});

socket.on('new message', function (data) {
    var col = '';
    if(data.customcolor === 99) col = colors[Math.floor(Math.random() * colors.length)].code;
    else col = colors[customcolor].code;
    notify.notify({'title': 'ch4t-cli', 'message': data.username + ": " + data.message});
    rendermsg(col + data.timestamp + ": "+ data.username + ": " + data.message + "{/}");
});
