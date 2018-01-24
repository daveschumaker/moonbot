const test = require('tape');

test('app.js', (assert) => {
    const a = 'a';
    const b = 'a';

    assert.equal(a, b, 'given two values, a should equal b');
    assert.end();
})