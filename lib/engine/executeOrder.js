const colors = require('colors');
const Order = require('../models/Order');
const orderLogger = require('../services/logger/orderLogger');

const executeOrder = function(config, orderStore, session) {
	return {
		calcMaxCoinsToBuy(price) {
			const currentAssets = session.balance.get().assets;
			const currentCapital = session.balance.get().capital;
			const maxCapitalToUse = currentCapital * (config.balance.maxCapitalToUse / 100);
			const maxAssetsToUse = currentAssets * (config.balance.maxAssetsToUse / 100);
			const FEE = 1.001;

			if (currentCapital <= 0.01) {
				// Not enough minimum capital to purchase from Exchange.
				console.log('Not enough capital to initiate order.');
				return {
					coinsToBuy: 0,
					totalCost: 0
				};
			}

			let totalCost;
			let coinsToBuy = Math.floor(maxCapitalToUse / price);

			let foundCoins = false;
			while (!foundCoins) {
				totalCost = (coinsToBuy * price) * FEE;
				if (totalCost >= currentCapital) {
					console.log('Too many coins', coinsToBuy, 'reducing by 1...');
					coinsToBuy--;
				} else {
					foundCoins = true;
				}
			}

			if (totalCost <= 0.01) {
				// Not enough to meet minimum purchase from Exchange.
				console.log('Not enough to meet minimum buy.');
				return {
					coinsToBuy: 0,
					totalCost: 0
				};
			}

			return {
				coinsToBuy,
				totalCost
			}
		},

		buy(price, type) {
			let calcCoins = this.calcMaxCoinsToBuy(price);
			const currentAssets = session.balance.get().assets;
			const currentCapital = session.balance.get().capital;

			if (calcCoins.coinsToBuy === 0) {
				return;
			}

			session.balance.update('ASSETS', currentAssets + calcCoins.coinsToBuy);
			session.balance.update('CAPITAL', currentCapital - calcCoins.totalCost);

			let order = Order({
				type: 'BUY',
				amount: calcCoins.coinsToBuy,
				price
			});

			orderStore.add('BUY', order);
			orderLogger(order, type);
		},

		sell(price, type) {
			const currentAssets = session.balance.get().assets;
			const currentCapital = session.balance.get().capital;
			const maxCapitalToUse = currentCapital * (session.settings().maxCapitalToUse / 100);
			const maxAssetsToUse = currentAssets * (session.settings().maxAssetsToUse / 100);

			// Only sell if we can cover the cost of the transaction fee (on Binance, it's 0.1% of transaction)
			price = price * 1.0015;

			if (currentAssets > 0) {
				let assetsToSell = maxAssetsToUse;
				let totalCost = assetsToSell * price;

				let getValid = orderStore.valid(price);

				if (getValid.status === 'LOSS_PROTECTION') {
					orderLogger({
						type: 'STOP_LOSS',
						price,
						lowestBuyPrice: getValid.lowestBuyPrice
					});
					return;
				} else if (getValid.status === 'VALID') {
					assetsToSell = getValid.num;
					totalCost = assetsToSell * price
				} else if (getValid.status === 'ZERO_AVAIL') {
					console.log('Not enough shares...');
					return;
				}

				session.balance.update('ASSETS', currentAssets - assetsToSell);
				session.balance.update('CAPITAL', currentCapital + totalCost);

				let order = Order({
					type: 'SELL',
					amount: assetsToSell,
					price
				});

				orderStore.add('SELL', order);
				orderLogger(order, type);
			} else {
				// Nothing to sell.
			}
		}
	}
}

module.exports = executeOrder;