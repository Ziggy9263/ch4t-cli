var socket = require('socket.io-client')('http://ch4t.ga'),
    util = require('util'),
    colors = require('./colors.js'),
    blessed = require('blessed'),
    contrib = require('blessed-contrib'),
    notify = require('node-notifier'),
    config = require('./config.js');
//poop
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
	border: {
	    fg: '#f0f0f0'
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
	border: {
	    fg: '#f0f0f0'
	}
    }
});

/*var wireframe_i = 0;

var wireframe = blessed.image({
    file: './wireframe/frame_0_delay-1s.png',
    scale: '0.25',
//    width: '50',
    ascii: true,
//    animate: true,
    border: {
        type: 'line'
    },
    top: 'center',
    left: 'center',
//    onReady: ready,
    style: {
	fg: 'white'
    }});*/

screen.append(main);
screen.append(input);
//screen.append(wireframe);
screen.render();
rendermsg('{blue-fg}Connecting...{/}');
input.focus();
screen.render();

/*setInterval(function() {
    wireframe_i += 1;
    wireframe.setImage('./wireframe/frame_' + wireframe_i + '_delay-1s.png');
    if(wireframe_i === 7) wireframe_i = 0;
    sendmsg(wireframe_i + ' is activated.');
    screen.render();
}, 1000)*/

input.key(['escape', 'C-q', 'C-c'], function(ch, key) {
    return process.exit(0);
});

input.key(['enter'], function(ch, key) {
    var data = {
        username: config.username,
        message: input.getValue(),
	customcolor: config.customcolor,
	timestamp: '0'
	};
    var col = '';
    if(data.customcolor === '99') col = colors[rand(0,colors.length)].code;
    else col = colors[config.customcolor].code;
    socket.emit('new message', data);
    rendermsg(col + data.timestamp + ": " + data.username + ": " + data.message + "{/}");
    this.clearValue();
    screen.render();
});

function rendermsg(string) {
    main.log(string);
};

socket.on('connect', function(){
	socket.emit('add user', config.username);
	rendermsg('Connected as ' + config.username);
	screen.render();
});

socket.on('disconnect', function() {
	rendermsg('{red-fg}Disconnected... REEEEE{/}');
	screen.render();
});

socket.on('login', function(data) {
	rendermsg('{cyan-fg}Logged in, Users online: ' + data.numUsers + '{/}');
	rendermsg('{cyan-fg}'+data.userlist+'{/}');
	screen.render();
});

socket.on('new message', function (data) {
    var col = '';
    if(data.customcolor === '99') col = colors[rand(0,colors.length)].code;
    else col = colors[config.customcolor].code;
notify.notify(data.message);
    socket.emit('new message', data);
    rendermsg(col + data.timestamp + ": "+ data.username + ": " + data.message + "{/}");
    screen.render();
});
