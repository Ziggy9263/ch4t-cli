var socket = require('socket.io-client')('http://ch4t.ga'),
    util = require('util'),
    colors = require('./colors.js'),
    form = {},
    input = {},
    user = {};
blessed = require('blessed');
var settings = require('./settings.js');
var options = {
    language: 'en',
    stall_warnings: 'true'
};
// Create a screen object.
var screen = blessed.screen();

// Create a box perfectly centered horizontally and vertically.
var main = blessed.list({
    top: 'center',
    left: 'center',
    width: '100%',
    height: '100%',
    tags: true,
    keys: true,
    scrollable: true,
    alwaysScroll: true,
    border: {
        type: 'line'
    }
});
var box = blessed.box({
    top: 'center',
    left: 'center',
    width: '50%',
    height: '50%',
    content: '{red-fg}Authenticating...{/red-fg}',
    tags: true,
    border: {
        type: 'line'
    },
    style: {
        fg: 'white',
        bg: 'black',
        border: {
            fg: '#f0f0f0'
        }
    }
});
screen.append(box);
screen.append(main);
screen.render();
main.add('Logging in...');
main.down();
screen.render();

start();

function start() {
    if (!settings.screen_name) {
        main.add('Failed to login.'.bold.red);
        main.add('Please fill settings.js with your screen name!'.bold.red)
        main.down();
        main.add('Press Q to exit');
        main.down();
        main.down();
        screen.render();
    } else {
        main.add('Logged in as @'.blue + settings.screen_name.blue);
        main.down();
        main.down();
        box.setContent('{blue-fg}Logged in as @' + settings.screen_name + '{/blue-fg}');
        screen.render();
        box.hide();
        var list = blessed.list({
            parent: screen,
            width: '75%',
            height: '75%',
            top: 'center',
            left: 'center',
            content: 'Menu',
            align: 'center',
            fg: 'blue',
            border: {
                type: 'line'
            },
            selectedBg: 'green',

            // Allow mouse support
            mouse: true,

            // Allow key support (arrow keys + enter)
            keys: true,

            // Use vi built-in keys
            vi: true
        });
        screen.append(list);
        list.focus();
        list.add('Chat - Join the Discussion!');
        list.add('Help - View the help')
        list.on('select', function (data) {
            if (data.content == 'Help - View the help') {
                list.hide();
                main.add('Help'.bold);
                main.add('ch4tcli is a refined console client for the ch4t.ga socket.io based chat site.')
                main.add('https://github.com/Ziggy9263/ch4t-cli')
                main.add('Controls:')
                main.add('Press CTRL-Q to quit | CTRL-R to return to main menu');
                main.down()
            }
            if (data.content == 'Chat - Join the Discussion!') {
                list.hide();
                chat();
                main.add('Fetching data...')
                main.down();
                screen.render();
            }
            screen.render();
        });
        screen.render();
    

	screen.key(['escape', 'C-q', 'C-c'], function (ch, key) {
	    return process.exit(0);
	});
    }
};
