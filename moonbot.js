#!/usr/bin/env node

// Boot the main app from here by running "./moonbot.js" from
// the root project directory. This requires the app as an
// IIFE due to how the moonbot-dev.js file needs our app setup
// for hot reloading with the Chokidar library.

try {
    require('./lib/app')();
} catch (err) {
    console.error(err);
}