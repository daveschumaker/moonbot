/*
 * Order Store:
 * Track any BUY or SELL orders that the bot has placed.
*/
const orderStore = function(session) {
    const state = {
        buys: [],
        fees: 0,
        buyCount: 0,
        sellCount: 0,
        lastTradeTime: null
    };

    return {
        addFees(obj) {
            const FEE = .001;

            let fees = (obj.amount * obj.price) * FEE;
            state.fees += fees;
        },

        add(type, orderObj) {
            const time = new Date();
            if (type === 'BUY') {
                state.buys.push(orderObj);
                state.buyCount++;

                if (state.buys.length === 1) {
                    session.setInitialPrice(orderObj.price);
                }
            } else if (type === 'SELL') {
                state.sellCount++;
            }

            this.addFees(orderObj);
            state.lastTradeTime = time.toLocaleString();
        },
        valid(sellPrice) {
            const currentAssets = session.balance.get().assets;
            const maxAssetsToSell = Math.floor(currentAssets * (session.settings().maxAssetsToUse / 100));
            const lossProtection = session.settings().stopLossProtection;

            if (state.buys.length === 0) {
                return {
                    status: 'ZERO_AVAIL',
                    num: 0
                };
            }

            let numToSell = 0;
            let lowestBuyPrice = null;
            let updatedArray = [];

            let findValidShares = state.buys.filter((order) => {
                let orderPrice = Number(order.price).toFixed(8);
                let currentPrice = Number(sellPrice).toFixed(8);

                if (lossProtection) {
                    // If lossProtection enabled, ensure order price is less than the current price.
                    if (orderPrice < currentPrice) {
                        numToSell += Number(order.amount);
                    } else {
                        if (!lowestBuyPrice || order.price < lowestBuyPrice) {
                            lowestBuyPrice = order.price;
                        }

                        updatedArray.push(order);
                    }
                } else {
                    // If lossProtection is false, split up initial order if greater than maxAssets,
                    // otherwise, sell stuff!
                    if (numToSell === 0 && order.amount > maxAssetsToSell) {
                        order.amount = order.amount - maxAssetsToSell;
                        numToSell = maxAssetsToSell;
                        updatedArray.push(order);
                    } else if ((numToSell + order.amount) < maxAssetsToSell) {
                        numToSell += order.amount;
                    } else {
                        updatedArray.push(order);
                    }
                }
            });

            if (numToSell > 0) {
                state.buys = [].concat(updatedArray); // Update array to remove old BUY orders.
                return {
                    status: 'VALID',
                    num: numToSell
                }
            } else if (numToSell === 0 && lossProtection) {
                return {
                    status: 'LOSS_PROTECTION',
                    lowestBuyPrice,
                    num: 0
                };
            } else {
                return {
                    status: 'ZERO_AVAIL',
                    num: 0
                };
            }
        },
        get() {
            return {
                buys: state.buys,
                fees: Number(state.fees).toFixed(8),
                count: state.buyCount + state.sellCount,
                lastTradeTime: state.lastTradeTime
            }
        }
    }
};

module.exports = orderStore;