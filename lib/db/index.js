const tableSql = "CREATE TABLE IF NOT EXISTS trades ("
        + " id INTEGER DEFAULT NULL UNIQUE,"
        + " symbol CHAR(10) NULL DEFAULT NULL,"
        + " timestamp INTEGER NULL DEFAULT NULL,"
        + " amount INTEGER NULL DEFAULT NULL,"
        + " price INTEGER NULL DEFAULT NULL"
        + " );"

const dbEngine = function(config, session, taskManager, tradeStore) {
    const appRoot = require('app-root-path');
    const sqlite3 = require('sqlite3').verbose();
    const TradeDataModel = require('../models/Trade');
    const DB_FILENAME = appRoot + '/db/trades_db.sqlite';

    let db = new sqlite3.Database(DB_FILENAME, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
        if (err) {
            console.error(err.message);
        }
    });

    db.run(tableSql);

    return {
        insert(trade) {
            let sql = `INSERT INTO trades (id, symbol, timestamp, amount, price) VALUES (?, ?, ?, ?, ?)`;
            let values = [trade.id, trade.symbol, trade.time, trade.size, trade.price];
            db.run(sql, values, (err) => {
                if (err) {
                    if (err.code === 'SQLITE_CONSTRAINT') {
                        // ignore error since it's trying to add data we already have in database.
                        return;
                    }

                    console.log(err);
                }
            });
        },

        // TODO: From / TO / TOKEN
        sim({from, to, symbol} = {}) {
            let sql = `SELECT * FROM trades WHERE symbol='TRXETH' ORDER BY timestamp ASC`;
            db.each(sql, (err, tradeObj) => {
                // console.log('WHAT IS RESULT');
                // console.log(result);

                const trade = TradeDataModel({
                    id: tradeObj.id,
                    symbol: tradeObj.symbol,
                    timestamp: tradeObj.timestamp,
                    amount: tradeObj.amount,
                    price: tradeObj.price
                });

                tradeStore.add(trade);
                taskManager();
            })
        }
    }
}

module.exports = dbEngine;
