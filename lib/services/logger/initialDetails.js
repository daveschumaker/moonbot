const colors = require('colors');
const columnify = require('columnify');

const initialDetails = ({ config, liveTradingMode, balance, settings }) => {
    const currentTime = new Date();
    let tradingModeMsg = '* PAPER trading mode enabled. No actual trades will occur.';

    if (liveTradingMode) {
      tradingModeMsg = '** LIVE ** trading mode enabled. ** REAL TRADES ** will occur.';
    }

    let detailsRow = columnify([{
            descriptor: 'Start Time:',
            value: currentTime.toLocaleString(),
          }, {
            descriptor: 'Trading Pair:',
            value: config.coinSymbol + ' / ' + config.capitalSymbol
          }, {
            descriptor: 'Period:',
            value: settings.periodLength + 's',
          }, {
            descriptor: 'Initial Assets:',
            value: balance.assets.toFixed(2) + ' ' + config.coinSymbol,
          }, {
            descriptor: 'Initial Currency:',
            value: balance.capital.toFixed(2) + ' ' + config.capitalSymbol,
          }], {
              showHeaders: false
          });

    console.log(tradingModeMsg.underline + '\n');
    console.log(detailsRow + '\n');
};

module.exports = initialDetails;