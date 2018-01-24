const colors = require('colors');
const columnify = require('columnify');

const columnWidths = {
    time: { minWidth: 19, maxWidth: 19 },
    price: { minWidth: 11, maxWidth: 11 },
    diff: { minWidth: 6, maxWidth: 6 },
    vol: { minWidth: 6, maxWidth: 6 },
    rsi: { minWidth: 3, maxWidth: 3 },
    balance: { minWidth: 23, maxWidth: 23 },
    'p/l': { minWidth: 7, maxWidth: 7 },
    hold: { minWidth: 7, maxWidth: 7,
        headingTransform: function(heading) {
            return 'vs.\nHOLD';
        }
    }
};

let showColumnHeaders = true; // Shows column headers on initial load.
const tickerOutput = (options = {}) => {
    let row = columnify([{
        time: options.time,
        price: options.price,
        diff: options.diff,
        vol: options.vol,
        rsi: options.rsi,
        balance: options.balance,
        'p/l': options.profit,
        hold: options.hold
      }], {
          align: 'right',
          columnSplitter: ' | ',
          config: columnWidths,
          showHeaders: showColumnHeaders
      });

    if (showColumnHeaders) {
        showColumnHeaders = false;
    }

    console.log(row);
}

module.exports = tickerOutput;