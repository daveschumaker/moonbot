// Running this file via 'npm run dev' or 'node ./moonbot-dev.js' forces
// the moonbot app to run in dev mode, which supports hot reloading.
// Make a change to any file in the /lib folder and the server will
// automatically restart.

const chokidar = require('chokidar');
const colors = require('colors');
const invalidate = require('invalidate-module');
const path = require('path');

function build() {
    try {
        require('./lib/app')();
    } catch (err) {
        console.error(err);
    }
}


const watcher = chokidar.watch('./lib', {
    ignoreInitial: true,
});

build();

watcher.on('all', (event, filename) => {
    console.log('\n');
    console.log('-==== RESTARTING DEV SERVER ====-'.yellow);
    console.log('\n');

    invalidate(path.resolve(filename));
    build();
});