const Exchange = function(config, db, session, tradeStore) {
    const api = require('binance');
    const formatDate = require('../../utils/dateToTimestamp');
    const TradeDataModel = require('../../models/Trade');

    const binanceRest = new api.BinanceRest({
        key: config.binance.apiKey, // Get this from your account on binance.com
        secret: config.binance.secret, // Same for this
        timeout: 15000, // Optional, defaults to 15000, is the request time out in milliseconds
        recvWindow: 10000, // Optional, defaults to 5000, increase if you're getting timestamp errors
        disableBeautification: false,
        /*
         * Optional, default is false. Binance's API returns objects with lots of one letter keys.  By
         * default those keys will be replaced with more descriptive, longer ones.
         */
        handleDrift: false
        /* Optional, default is false.  If turned on, the library will attempt to handle any drift of
         * your clock on it's own.  If a request fails due to drift, it'll attempt a fix by requesting
         * binance's server time, calculating the difference with your own clock, and then reattempting
         * the request.
         */
    });

    const binanceWS = new api.BinanceWS(true);

    let fromDate = null;

    return {
        backfill({ lastId, since, mode = 'TRADE', symbol } = {}) {
            const { coinSymbol, capitalSymbol } = config;
            const SYMBOL = symbol ? symbol : `${coinSymbol}${capitalSymbol}`
            const ONE_DAY = 3600000;
            const LIMIT = 500;
            let startTime, endTime;
            let options = {};

            // DEBUG STUFF
            // mode = 'BACKFILL';
            // since = '20180101';

            if (mode === 'TRADE' && !lastId) {
                // TODO:
                // One full day gives too many trades.
                // For now, split in half?
                startTime = new Date() - (ONE_DAY / 2);
                endTime = startTime + ONE_DAY;
                options = {
                    symbol: SYMBOL,
                    startTime: startTime,
                    endTime: endTime
                }
            } else if (mode === 'BACKFILL' && !lastId) {
                if (since) {
                    fromDate = formatDate(since);;   // Will use to determine when to stop backfilling.
                } else {
                    console.log('ERROR: No sense.');
                    return;
                }

                options = {
                    symbol: SYMBOL,
                    limit: LIMIT
                }
            } else if (since) {
                fromDate = formatDate(since);   // Will use to determine when to stop backfilling.
                options = {
                    symbol: SYMBOL,
                    limit: LIMIT
                }
            } else if (lastId) {
                options = {
                    symbol: SYMBOL,
                    fromId: lastId,
                    limit: LIMIT
                }
            } else {
                startTime = new Date() - (ONE_DAY / 2);
                endTime = startTime + ONE_DAY;
                options = {
                    symbol: SYMBOL,
                    startTime: startTime,
                    endTime: endTime
                    // limit: LIMIT
                }
            }

            binanceRest.aggTrades(options)
            .then((result = []) => {
                let lastTradeTime;
                let shouldFetchMore = false;

                result.forEach((tradeObj = {}) => {
                    const { info } = tradeObj;

                    const trade = TradeDataModel({
                        id: tradeObj.aggTradeId,
                        symbol: SYMBOL,
                        timestamp: tradeObj.timestamp,
                        amount: tradeObj.quantity,
                        price: tradeObj.price
                    });

                    lastTradeTime = tradeObj.timestamp;
                    tradeStore.add(trade);

                    if (mode === 'BACKFILL') {
                        db.insert(trade);
                    }
                });

                if (mode === 'BACKFILL') {
                    let firstTrade = result[0] || {};
                    if (firstTrade && firstTrade.timestamp >= fromDate) {
                        console.log('Downloading 500 trades from', new Date(firstTrade.timestamp).toLocaleString());
                        const newId = Number(result[0].aggTradeId) - LIMIT;
                        this.backfill({ lastId: newId, mode: 'BACKFILL' });
                    }
                }
            })
            .catch((err) => {
                console.log('ERROR');
                console.log(err);
            })
        },

        fetchTrades() {
            const { coinSymbol, capitalSymbol } = config;

            if (!coinSymbol || !capitalSymbol) {
                throw new Error('Error: config.coinSymbol and config.capitalSymbol must be set');
            }

            const SYMBOL = coinSymbol + capitalSymbol;

            binanceWS.onTrade(SYMBOL, (data) => {
                // console.log(data);

                const trade = TradeDataModel({
                    id: data.tradeId,
                    symbol: SYMBOL,
                    timestamp: data.eventTime,
                    amount: data.quantity,
                    price: data.price
                });

                tradeStore.add(trade);
            });
        }
    }
}

module.exports = Exchange;

