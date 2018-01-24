/**
 * Initializes the loops responsible for running the trading and analysis engine.
 * @param {object} session     Session settings and details.
 * @param {object} taskManager Compilation of recent trades received from API.
 */
function Engine(session, taskManager) {
    return {
        /**
         * Quick interval for running calculations or analysis.
         * A global var is used here so that it can be cleared when building
         * in development mode.
         */
        inPeriod() {
            global.IN_PERIOD_INT = setInterval(() => {
                // Do something here that requires a quick interval.
            }, 100)
        },

        /**
         * Tasks run at the end of a user defined period.
         * A global var is used here so that it can be cleared when building
         * in development mode.i
         */
        endPeriod() {
            const periodLength = session.settings.periodLength || 1;

            global.END_PERIOD_INT = setInterval(() => {
                taskManager();
            }, session.settings().periodLength * 1000)
        },

        /**
         * Run short interval loop and user-defined tasks loop.
         */
        run() {
            clearInterval(global.IN_PERIOD_INT);
            clearInterval(global.END_PERIOD_INT);

            this.inPeriod();
            this.endPeriod();
        }
    }
}

module.exports = Engine;