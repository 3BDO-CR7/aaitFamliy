const INITIAL_STATE = { lang: null };

export default (state = INITIAL_STATE, action) => {
    console.log('action ??????', action)
    console.log('payload ??????', action.payload)
    switch (action.type) {
        case 'chooseLang':
            return { lang: action.payload };
        default:
            return state;
    }
};
