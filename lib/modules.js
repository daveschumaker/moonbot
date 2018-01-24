const ModuleLoader = require('./module-loader/ModuleLoader');

// Global Modules
const config = require('./utils/setConfig');
const engine = require('./engine');
const exchange = require('./exchanges/binance');
const executeOrder = require('./engine/executeOrder');
const infoLogger = require('./services/logger/infoLogger');
const keypress = require('./utils/keypress');
const orderStore = require('./datastore/orders');
const processArgs = require('./utils/processArgs');
const session = require('./datastore/session');
const strategy = require('./strategy/default');
const taskManager = require('./engine/taskManager');
const tickerDetails = require('./engine/tickerDetails');
const tradeStore = require('./datastore/trades');

// ModuleLoader Class
const modules = new ModuleLoader();

// Register components.
modules.register('config', config);
modules.singleton('engine', engine, ['session', 'taskManager']);
modules.singleton('exchange', exchange, ['config', 'session', 'tradeStore']);
modules.singleton('executeOrder', executeOrder, ['config', 'orderStore', 'session']);
modules.singleton('infoLogger', infoLogger, ['config', 'orderStore', 'session', 'tradeStore']);
modules.singleton('keypress', keypress, ['executeOrder', 'infoLogger', 'session', 'tickerDetails', 'tradeStore']);
modules.singleton('orderStore', orderStore, ['session']);
modules.singleton('processArgs', processArgs, ['session']);
modules.singleton('session', session, ['config']);
modules.singleton('strategy', strategy, ['config', 'session', 'tradeStore']);
modules.singleton('taskManager', taskManager, ['config', 'executeOrder', 'session', 'tickerDetails', 'tradeStore']);
modules.singleton('tickerDetails', tickerDetails, ['config', 'session', 'tradeStore']);
modules.singleton('tradeStore', tradeStore, ['config', 'session']);

module.exports = modules;