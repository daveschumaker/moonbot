'use strict';

/**
                   *     .--.
                        / /  `
       +               | |
              '         \ \__,
          *          +   '--'  *
              +   /\
 +              .'  '.   *
        *      /======\      +
              ;:.  _   ;
              |:. (_)  |
              |:.  _   |
    +         |:. (_)  |          *
              ;:.      ;
            .' \:.    / `.
           / .-'':._.'`-. \
           |/    /||\    \|
     jgs _..--"""````"""--.._
   _.-'``                    ``'-._
 -'                                '-
 */

module.exports = () => {
    const colors = require('colors');
    const version = require('../package.json').version;

    // Display a helpful welcome message on boot.
    console.log(`-== MoonBot v${version} ==-`.yellow.underline);
    console.log('    ...to the moon! ↗↗\n');

    // Initialize global modules using IoC pattern.
    const modules = require('./modules');
    const db = modules.get('db');
    const engine = modules.get('engine');
    const exchange = modules.get('exchange');
    const keypress = modules.get('keypress');
    const processArgs = modules.get('processArgs');
    const session = modules.get('session');

    // Set initial settings based on config file.
    session.initSession();

    // Look for any command line args passed in on launch
    // and then overwrite them in session settings above.
    let args = processArgs.run() || {};

    // Backfill orders prior to current time so some
    // technical analysis calculations are immediately
    // available for use in trading strategies.
    let bfOptions;
    if (args.backfill) {
        bfOptions = {
            mode: 'BACKFILL',
            since: args.since
        }
    }

    exchange.backfill(bfOptions);

    // Load the websockets connection to Binnace and
    // start fetching orders in real time.
    exchange.fetchTrades();
    // db.sim();

    // Show some initial info at the start of the app.
    session.initialDetails();

    // Listen for any key presses and load some
    // custom commands based on user input.
    keypress.listen();

    // Kick things off and start the trading engine!
    engine.run();
}
