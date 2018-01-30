'use strict';
/**
    MOONBOT!
    A cryptocurrency trading bot using the Binance API.

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
    const BackfillService = modules.get('BackfillService');
    const engine = modules.get('engine');
    const exchange = modules.get('exchange');
    const keypress = modules.get('keypress');
    const processArgs = modules.get('processArgs');
    const session = modules.get('session');

    // Set initial settings based on config file.
    session.initSession();

    // Check if user is running moonbot using a specified service such as
    // SIM mode or BACKFILL mode. If so, run dedicated scripts related to
    // those services and prevent the rest of the app from running.
    let service = processArgs.initService();
    if (service === 'SIM') {
        console.log('Running in SIM mode...');
        db.sim();
        return;
    } else if (service === 'BACKFILL') {
        console.log('Running in BACKFILL mode...');
        BackfillService.fetch();
        return;
    }

    // Look for any command line config args passed in on launch
    // and then overwrite them in session settings above.
    processArgs.updateConfig();

    // Backfill orders prior to current time so some
    // technical analysis calculations are immediately
    // available for use in trading strategies.
    // TODO: Should be smart and calculate how much
    // backfill is needed based on user defined period.
    exchange.backfill();

    // Load the websockets connection to Binance and
    // start fetching orders in real time.
    exchange.fetchTrades();

    // Show some initial info at the start of the app.
    session.initialDetails();

    // Listen for any key presses and load some
    // custom commands based on user input.
    keypress.listen();

    // Kick things off and start the trading engine!
    engine.run();
}
