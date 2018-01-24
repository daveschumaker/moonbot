const state = {
    initialLoad: true
}

const appState = {
    get(key) {
        return state[key];
    },

    set(key, value) {
        state[key] = value;
    }
};

module.exports = appState;