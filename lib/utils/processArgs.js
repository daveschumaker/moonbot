const parseArgs = require('minimist')(process.argv.slice(2));

const processArgs = function(session) {
    const { backfill, live, since } = parseArgs;

    return {
        run() {
            // console.log(parseArgs);

            if (live) {
                session.updateSettings('liveTradingMode', true);
                return {
                    live: true
                };
            }

            if (backfill && since) {
                return {
                    backfill: true,
                    since
                }
            } else if (backfill && !since) {
                console.log('ERROR: No argument --since provided. Please add a date.');
                process.exit();
                return;
            }
        }
    }
};

module.exports = processArgs;