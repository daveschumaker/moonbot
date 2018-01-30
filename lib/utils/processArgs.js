const parseArgs = require('minimist')(process.argv.slice(2));

const processArgs = function(session) {
    const { backfill, live, since } = parseArgs;

    return {
        // Return all command line arguments that moonbot was launched with.
        get() {
            return parseArgs;
        },

        /**
         * Initializes a particular service based on user option provided at command line. Running
         * Moonbot with one of these options enabled should prevent the rest of the app from loading.
         * e.g.,
         * running 'moonbot sim' from the terminal will return a var that indicates we should run a sim.
         * running 'moonbot backfill -from 20180101' returns a var that indicates we should backfill db data.
         */
        initService() {
            let service = parseArgs._[0];

            if (service) {
                if (String(service).toLowerCase() === 'sim') {
                    return 'SIM';
                } else if (String(service).toLowerCase() === 'backfill') {
                    return 'BACKFILL';
                }
            }
        },

        // Work In Progress...
        // Check for any settings passed in via command line. These will OVERWRITE whatever is defined
        // in the user's config.js file on initial boot:
        // e.g., 'zenbot --symbol NEOETH' should set the session details and exchange order fetching
        // scripts to use NEOETH, despite something like TRXETH set in the config file.
        updateConfig() {
            // console.log(parseArgs);

            if (live) {
                session.updateSettings('liveTradingMode', true);
                return {
                    live: true
                };
            }
        }
    }
};

module.exports = processArgs;