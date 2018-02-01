// Rename to `config.js`
let config = {};

/**
EXCHANGE INFO
**/

// Binance API key.
config.binance = {};
config.binance.apiKey = '';
config.binance.secret = '';

// TODO: Should be smarter and somehow split the symbol above. For now...
// Sets the symbols used for trading and combines them for various markets when needed.
// e.g., If you want to trade LTC/ETH, coinSymbol would be 'LTC' and capitalSymbol would
// be 'ETH'.
config.coinSymbol = 'TRX';        // Symbol for crypto-coin to purchase. e.g., 'LTC'
config.capitalSymbol = 'ETH';    // Symbol for currency used. e.g., 'ETH'

/*
 * ASSETS AND CAPITAL
 */
config.balance = {}
config.balance.capital = 1;         // NUM: Capital used to buy coins / tokens
config.balance.assets = 0;          // NUM: Number of tokens currently in possession.

config.balance.maxAssetsToUse = 50;     // NUM: Max percentage of your total balance to sell at once.
config.balance.maxCapitalToUse = 50;    // NUM: Max percentage of your total capital to buy with at once.

/*
 * GENERAL SETTINGS
 */

config.trades = {};
config.trades.lossProtection = true;    // BOOL: Never sell a coin for less than it was bought.
config.trades.period = 1;            // STRING: Interval time (in seconds!).

module.exports = config;