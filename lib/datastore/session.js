/*
 * Session Detail Store:
 * Holds various global variables used throughout the app.
 */

const session = function(config = {}) {
    const timebucket = require('timebucket');
    const logInitialDetails = require('../services/logger/initialDetails');
    const state = {
        start: {
            assets: 0,
            capital: 0,
            price: 0,
            time: 0
        },
        balance: {
            assets: 0,
            capital: 0
        },
        settings: {
            enableOrders: true,         // Determine whether bot will place (real or fake) orders.
            liveTradingMode: false,     // liveTradingMode true means bot will use REAL money.
            stopLossProtection: true,   // Prevent selling anything below its buy price.
            maxAssetsToUse: 0,          // Max percentage of assets to sell at any one time. (0 to 100)
            maxCapitalToUse: 0,          // Max percentage of capital to buy with at any one time. (0 to 100)
            periodLength: 1
        },
        numTrades: 0,
        currentPeriodId: '',
        periodLength: ''
    }

    return {
        initSession() {
            const startTime = new Date();
            state.periodLength = config.trades.period + 's';
            state.start.assets = config.balance.assets;
            state.start.capital = config.balance.capital;
            state.start.time = startTime.toLocaleString();

            state.balance.assets = config.balance.assets;
            state.balance.capital = config.balance.capital;

            // Import settings from the config file.
            state.settings.stopLossProtection = config.trades.lossProtection;
            state.settings.maxAssetsToUse = config.balance.maxAssetsToUse;
            state.settings.maxCapitalToUse = config.balance.maxCapitalToUse;
            state.settings.periodLength = config.trades.period;

            this.setPeriodId();
            this.initPeriodIdInterval();
        },

        initialDetails() {
            logInitialDetails({
                config,
                liveTradingMode: state.settings.liveTradingMode,
                balance: state.start,
                settings: this.settings()
            });
        },

        setInitialPrice(price) {
            if (state.start.price === 0) {
                state.start.price = price;
            }

            return;
        },

        initPeriodIdInterval() {
            clearInterval(global.SET_PERIOD_ID_INT);

            global.SET_PERIOD_ID_INT = setInterval(() => {
                this.setPeriodId();
            }, 100);
        },

        setPeriodId(timestamp) {
            let timestampToSet = 2;

            if (timestamp) {
                timestampToSet = timestamp;
            }

            state.currentPeriodId = timebucket(timestampToSet).resize(this.periodLength()).toString();
        },

        settings() {
            let settings = Object.assign({}, state.settings);
            settings.startTime = state.start.time;

            return settings;
        },

        updateSettings(setting, value) {
            state.settings[setting] = value;
        },

        periodLength() {
            return state.periodLength;
        },

        periodId() {
            return state.currentPeriodId;
        },

        balance: {
            get() {
                return {
                    assets: state.balance.assets,
                    capital: state.balance.capital,
                    start: {
                        assets: state.start.assets,
                        capital: state.start.capital,
                        price: state.start.price,
                    }
                }
            },
            update(type, num) {
                if (type === 'CAPITAL') {
                    state.balance.capital = num;
                } else if (type === 'ASSETS') {
                    state.balance.assets = num;
                }
            }
        }
    }
};

module.exports = session;