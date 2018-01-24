// Check the current periods array with the current session period id.
// If they are the same, this means the current period is still actively collecting data
// and is not finished. So, trim it off.

const trimPeriodsArray = ({array, periodId}) => {
        if (array.slice(-1).periodId === periodId) {
            return array.slice(0, array.length -1);
        } else {
            return array;
        }
}

module.exports = trimPeriodsArray;