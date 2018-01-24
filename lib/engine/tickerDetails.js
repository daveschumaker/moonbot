const colors = require('colors');
const dateFormat = require('dateformat');
const numbro = require('numbro');
const abbreviate = require('number-abbreviate')

const calcBuyHold = require('../calculations/buyHold');
const calcPriceChange = require('../calculations/priceChange');
const calcProfit = require('../calculations/profitLoss');
const calcRsi = require('../calculations/rsi');
const trimPeriodsArray = require('../utils/trimPeriodsArray');

const tickerDetails = function(config, session, tradeStore) {
    return {
        display() {
            const store = tradeStore;

            const currentPeriodId = session.periodId();
            const recentPeriods = trimPeriodsArray({
                array: tradeStore.get(3),
                periodId: currentPeriodId
            });

            const period0 = recentPeriods[0];
            const period1 = recentPeriods[1];

            let time = new Date(period1.time);
            time = dateFormat(time, 'yyyy-mm-dd HH:MM:ss');
            let priceChangePct = calcPriceChange(period0.close, period1.close);
            priceChangePct = priceChangePct < 0 ?
                colors.red(priceChangePct + '%') :
                colors.green(priceChangePct + '%')

            const balanceDetails = `${(session.balance.get().assets).toFixed(2)} ${config.coinSymbol}  ${(session.balance.get().capital).toFixed(2)} ${config.capitalSymbol}`;
            const rsiVal = calcRsi(currentPeriodId, 14, store.get())
            const profit = calcProfit({
                sessionDetails: session.balance.get(),
                price: period1.close
            });

            // TODO: Don't run this calculation until we actually place our first buy order.
            const bh = calcBuyHold({
                sessionDetails: session.balance.get(),
                price: period1.close
            });

            return {
                time: colors.grey(time),
                price: numbro(period1.close).format('0[.]00000000'),
                diff: priceChangePct,
                vol: period1.volume < 1000 ? Number(period1.volume).toFixed(0) : abbreviate(period1.volume, 1),
                rsi: rsiVal >= 50 ? colors.green(rsiVal) : colors.red(rsiVal),
                balance: balanceDetails,
                profit: profit,
                hold: bh
            }
        }
    }

}

module.exports = tickerDetails;