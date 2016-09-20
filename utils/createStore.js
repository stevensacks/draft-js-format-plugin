const createStore = initialState => {
    let state = initialState || {},
        listeners = {};

    const subscribeToItem = (key, callback) => {
        listeners[key] = listeners[key] || [];
        listeners[key].push(callback);
    };

    const unsubscribe = () => {
        listeners = {};
    };

    const updateItem = (key, item) => {
        state = {
            ...state,
            [key]: item,
        };
        if (listeners[key]) {
            listeners[key].forEach(listener => listener(state[key]));
        }
    };

    const getItem = key => state[key];

    return {
        subscribeToItem,
        updateItem,
        getItem,
        unsubscribe
    };
};

export default createStore;
