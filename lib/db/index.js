const appRoot = require('app-root-path');
const sqlite3 = require('sqlite3').verbose();
const DB_FILENAME = appRoot + '/db/trades_db.sqlite';

let db = new sqlite3.Database(DB_FILENAME, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err.message);
    }
});

let tableSql = "CREATE TABLE IF NOT EXISTS trades ("
        + " id INTEGER DEFAULT NULL UNIQUE,"
        + " symbol CHAR(10) NULL DEFAULT NULL,"
        + " timestamp INTEGER NULL DEFAULT NULL,"
        + " amount INTEGER NULL DEFAULT NULL,"
        + " price INTEGER NULL DEFAULT NULL"
        + " );"

db.run(tableSql);

function insert(trade) {
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
}

function load() {
    // TODO: use db.each -- each result returns a callback
    // https://github.com/mapbox/node-sqlite3/issues/686
}

module.exports = {
    insert
};