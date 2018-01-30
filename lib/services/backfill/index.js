// Backfill data from Exchange API and add to local database / storage.
const dateFormat = require('dateformat');

const BackfillService = function(config, exchange, processArgs, session, taskManager) {
    const { dateFrom, dateTo, symbol } = processArgs.get();

    return {
        fetch() {
            // TODO: Validate that dateFrom / dateTo are formatted 'YYYYMMDD'
            if (!dateFrom) {
                console.log('ERROR: Missing --dateFrom parameter');
                process.exit();
            }

            console.log('OPTIONS?', processArgs.get());
            const now = new Date();
            let options;
            options = {
                mode: 'BACKFILL',
                since: String(dateFrom),
                to: dateTo ? dateTo : dateFormat(now, "yyyymmdd"),
                symbol: symbol
            }

            console.log('options', options);
            exchange.backfill(options);
        }
    }
}

module.exports = BackfillService;