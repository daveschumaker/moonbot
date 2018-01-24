/*
 * Trade Store:
 * Place trades received from the exchange into buckets based on
 * period of time set in config.js file. This will be be the basis
 * for technical analysis calculations used later.
*/

/**
 * Partition list of trades into buckets based on user-defined period.
 * @param {Object} options - Handles injected dependencies.
 * @param {Object} options.config - General configuration settings.
 */
const tradeStore = function(config, session) {
    const PERIODS_TO_KEEP = 100; // Will probably want to customize this in the future. For now...
    const timebucket = require('timebucket');
    const Period = require('../models/Period');

    const state = {
        recentPeriods: [],
        periods: {},
        lastTimeReceived: null  // Record time of last trade (to check for any websocket issues)
    };

    return {
        add(trade = {}) {
            state.lastTimeReceived = trade.time;

            // Creates a unique id for a particular time period
            // so we can group similar trades into buckets.
            let periodInfo;
            const getPeriodId = timebucket(trade.time).resize(session.periodLength()).toString();

            if (!state.periods[getPeriodId]) {
                trade.periodId = getPeriodId;
                trade.open = trade.price;
                trade.high = trade.price;
                trade.close = trade.price;
                trade.low = trade.price;
                trade.volume = trade.size;

                periodInfo = Period(trade);

                // Add to obj data structure (quick lookups) and to ordered array (sorted)
                state.periods[getPeriodId] = periodInfo;
                state.recentPeriods.push(getPeriodId);
                state.recentPeriods = state.recentPeriods.slice(-PERIODS_TO_KEEP);
            } else {
                // If periodId already exists, check time to see if we
                // need to update prices and closing time for periodInfo.
                let periodToCheck = Object.assign({}, state.periods[getPeriodId]);

                if (trade.time > periodToCheck.time) {
                    periodToCheck.time = trade.time;
                    periodToCheck.price = trade.price;
                    periodToCheck.close = trade.price;
                }

                if (trade.time < periodToCheck.time) {
                    periodToCheck.open = trade.price;
                }

                if (trade.price > periodToCheck.high) {
                    periodToCheck.high = trade.price;
                }

                if (trade.price < periodToCheck.low) {
                    periodToCheck.low = trade.price;
                }

                periodToCheck.volume = Number(periodToCheck.volume) + Number(trade.size);
                periodInfo = Period(periodToCheck);

                // Update object in obj data structure and in ordered array
                state.periods[getPeriodId] = periodInfo;
            }
        },

        get(num) {
            let recentPeriodIds;

            if (num) {
                recentPeriodIds = state.recentPeriods.slice(-num);
            } else {
                recentPeriodIds = state.recentPeriods;
            }

            if (recentPeriodIds.length === 0) {
                return [];
            }

            return recentPeriodIds.map((periodId) => {
                return state.periods[periodId];
            });
        },

        lastTrade() {
            return state.lastTimeReceived;
        }
    }
}

module.exports = tradeStore;