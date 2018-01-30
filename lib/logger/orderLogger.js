const colors = require('colors');
const dateFormat = require('dateformat');

const orderLogger = (details = {}, orderType) => {
    let time = new Date();
    time = dateFormat(time, 'yyyy-mm-dd HH:MM:ss');

    const {type, amount, lowestBuyPrice, price} = details;
    let output = [
        colors.grey(time)
    ];

    if (type === 'STOP_LOSS') {
        output.push(colors.red(`**LOSS PROTECTION** PREVENT SELLING FOR LOSS @ ${Number(price).toFixed(8)}`));
        output.push('\n                   ');
        output.push(colors.red(`(Lowest buy price found: ${Number(lowestBuyPrice).toFixed(8)})`));
    } else {
        if (orderType === 'MANUAL') {
            output.push(colors.cyan(`MANUAL`));
        }

        output.push(colors.cyan(`${type} order placed: ${Number(amount).toFixed(2)} @ ${Number(price).toFixed(8)}`));
        output.push('\n                   ');
        output.push(colors.cyan(`Total price: ${Number(amount * price * 1.001).toFixed(4)}`));
        output.push(colors.cyan(`(Fees: ${Number(amount * price * 0.001).toFixed(8)})\n`));
    }

    console.log(output.join(' '));
};

module.exports = orderLogger;