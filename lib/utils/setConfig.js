const colors = require('colors');

let config;

// Check if custom user config file exists.
// If not, use default config and warn user.
try {
    config = require('../../config');
} catch (err) {
    console.warn('*** WARNING: ***'.red);
    console.warn('*** No config.js file found. Using defaults in config-sample.js ***'.red);
    console.warn(`*** Please copy 'config-sample.js' as 'config.js' ***\n`.red);
    config = require('../../config-sample.js');
}

const setConfig = function() {
    return config;
}

module.exports = setConfig;