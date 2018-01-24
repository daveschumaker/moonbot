// Converts nicely formatted dates passed in from CLI interface
// into a Unix timestamp for searching databases or backfilling
// from an exchange.

// Date needs to be in the form of 'yyyymmdd' e.g., 20180101
const formatDate = (date = '') => {
    if (date.length !== 8) {
        throw new Error('date has incorrect format. must be \'yyyymmdd\'');
    }

    date = String(date);
    let newDate = date.slice(0,4) + '.' + date.slice(4,6) + '.' + date.slice(6,8)
    let result = Date.parse(newDate);

    return Number(result);
}

module.exports = formatDate;