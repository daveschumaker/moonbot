const Order = function({
    type = '',
    amount = 0,
    price = 0
} = {}) {
    return {
        time: new Date(),
        type: String(type),
        amount: Number(amount).toFixed(2),
        price: Number(price).toFixed(8)
    };
};

module.exports = Order;