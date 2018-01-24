const _ = require('lodash');
const appRoot = require('app-root-path');
const test = require('tape');

const isEqual = _.isEqual;

test('lib/datastore/session.js', (assert) => {

    const configMock = {
        balance: {
            assets: 0,
            balance: 0.5,
            maxAssetsToUse: 25,
            maxCapitalToUse: 25
        },
        trades: {
            lossProtection: true,
            period: 5
        }
    }

    const expectedSettings = {
        enableOrders: true,
        liveTradingMode: false,
        stopLossProtection: true,
        maxAssetsToUse: 25,
        maxCapitalToUse: 25,
    }

    const session = require(appRoot + '/lib/datastore/session')(configMock);
    session.initSession();

    let sessionSettings = session.settings();
    let sessionBalance = session.balance.get();
    delete sessionSettings['startTime'];

    const settingsEqual = isEqual(sessionSettings, expectedSettings);

    assert.equal(settingsEqual, true, 'should init session with correct settings from config.');
    assert.end();
})