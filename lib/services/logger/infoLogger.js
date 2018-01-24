const colors = require('colors');
const columnify = require('columnify');

const infoLogger = function(config, orderStore, session, tradeStore) {
    return function() {
        const { enableOrders, liveTradingMode, periodLength, startTime, stopLossProtection } = session.settings();
        const orders = orderStore.get();

        const { assets, capital, start } = session.balance.get();
        const recentPeriod = tradeStore.get(1);
        const total = (recentPeriod[0].close * assets) + capital;

        const lastTradeTime = new Date(tradeStore.lastTrade());

        console.log('Information:\n');

        const infoWidths = {
            name: {minWidth: 8, maxWidth: 8},
            info: {minWidth: 20, maxWidth: 20}
        }

        const infoTable = columnify([{
            name: 'Start time:',
            info: startTime
        }, {
            name: 'Trading mode:',
            info: liveTradingMode ? 'LIVE TRADING' : 'Paper Trading'
        }, {
            name: 'Period length:',
            info: periodLength + 's'
        }, {
            name: 'Last order:',
            info: orders.lastTradeTime ? orders.lastTradeTime : 'N/A'
        }, {
            name: 'Last API response:',
            info: lastTradeTime.toLocaleString()
        }, {
            name: 'Total trades:',
            info: orders.count
        },  {
            name: 'Total fees:',
            info: orders.fees + ' ' + config.capitalSymbol
        }], {
          showHeaders: false
      });

        console.log(infoTable + '\n');

        const columnWidths = {
            info: { minWidth: 8, maxWidth: 8,
                headingTransform: function(heading) {
                    return '';
                }
            },
            start: { minWidth: 12, maxWidth: 12 },
            current: { minWidth: 12, maxWidth: 12 },
        }

        const row = columnify([{
            info: 'Assets:',
            start: Number(start.assets).toFixed(2) + ` ${config.coinSymbol}`,
            current: Number(assets).toFixed(2) + ` ${config.coinSymbol}`
          }, {
            info: 'Capital:',
            start: Number(start.capital).toFixed(2) + ` ${config.capitalSymbol}`,
            current: Number(capital).toFixed(2) + ` ${config.capitalSymbol}`
          }, {
            info: 'Total:',
            start: Number((start.assets * start.price) + start.capital).toFixed(2) + ` ${config.capitalSymbol}`,
            current: Number(total).toFixed(2) + ` ${config.capitalSymbol}`
          }
          ], {
              align: 'right',
              config: columnWidths,
          });

        const enableOrdersColor = enableOrders ? colors.green('ENABLED') : colors.red('DISABLED');
        const stopLossProtectionColor = stopLossProtection ? colors.green('ENABLED') : colors.red('DISABLED')

        console.log('Settings:');
        console.log('* Automated ordering:', enableOrdersColor);
        console.log('* Loss protection:', stopLossProtectionColor);
        console.log('\n');

        console.log(row + '\n');
    };
}

module.exports = infoLogger;