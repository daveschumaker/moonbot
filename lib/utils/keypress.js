const colors = require('colors');
const readline = require('readline');
readline.emitKeypressEvents(process.stdin);

const tickerOutput = require('../logger/tickerOutput');

if (process.stdin.isTTY) {
    process.stdin.setRawMode(true)
}

const keypress = function(executeOrder, infoLogger, session, tickerDetails, tradeStore) {
    return {
        listen() {
            let msg = `Press ${colors.black.bgWhite(' h ')} or ${colors.black.bgWhite(' ? ')} for help.\n`;
            console.log(msg);

            // When running via moonbot-dev mode, hot reloading causes multiple event listeners to
            // be attached to process.stdin. For safety, we run this method and remove all event
            // listeners before attaching the listener below.
            process.stdin.removeAllListeners('keypress');

            // Start the keypress listener for the process
            process.stdin.on('keypress', (str, key = {}) => {
                const { enableOrders, stopLossProtection } = session.settings();

                // "Raw" mode so we must do our own kill switch
                if (key.sequence === '\u0003' || key.name === 'x') {
                    process.exit(1);
                }

                if (key.name === 'h' || key.sequence === '?') {
                    console.log('\nAvailable commands:');
                    console.log(`${colors.black.bgWhite(' b ')} - ${colors.green('BUY')}`);
                    console.log(`${colors.black.bgWhite(' s ')} - ${colors.red('SELL')}`);
                    console.log(`${colors.black.bgWhite(' o ')} - ${colors.grey('toggle orders (currently: ' + enableOrders + ')')}`);
                    console.log(`${colors.black.bgWhite(' l ')} - ${colors.grey('toggle loss protection (currently: ' + stopLossProtection + ')')}`);
                    console.log(`${colors.black.bgWhite(' t ')} - ${colors.grey('show ticker')}`);
                    console.log(`${colors.black.bgWhite(' i ')} - ${colors.grey('show info')}`);
                    console.log(`${colors.black.bgWhite(' x ')} - ${colors.grey('exit app')}`);
                    console.log('\n');
                } else if (key.name === 'i') {
                    infoLogger();

                } else if (key.name === 'l') {
                    if (stopLossProtection) {
                        session.updateSettings('stopLossProtection', false);
                        console.log('DISABLING LOSS PROTECTION');
                    } else {
                        session.updateSettings('stopLossProtection', true);
                        console.log('ENABLING LOSS PROTECTION');
                    }
                } else if (key.name === 't') {
                    let tickerObj = tickerDetails.display();
                    tickerOutput(tickerObj);
                } else if (key.name === 'o') {
                    if (enableOrders) {
                        session.updateSettings('enableOrders', false);
                        console.log('DISABLING ORDERS');
                    } else {
                        session.updateSettings('enableOrders', true);
                        console.log('ENABLING ORDERS');
                    }
                } else if (key.name === 'b') {
                    const lastPeriod = tradeStore.get(1);
                    executeOrder.buy(lastPeriod[0].close, 'MANUAL');
                } else  if (key.name === 's') {
                    const lastPeriod = tradeStore.get(1);
                    executeOrder.sell(lastPeriod[0].close, 'MANUAL');
                } else {
                    console.log('key??', key);
                }

                // console.log(str);
                // User has triggered a keypress, now do whatever we want!
                //

            });
        }
    }
}

module.exports = keypress;