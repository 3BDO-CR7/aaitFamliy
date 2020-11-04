const INIT_STATE = { user: null , result : null,user_id : null,updated:null};


export default ( state = INIT_STATE, action ) => {
    switch (action.type) {

        case ('profile_data'):
            return ({ ...state, user: action.data.data ,updated:1});
        case ('update_profile'):
            console.log('update_profile')
        case ('logout'):
            console.log('i have logged out');
            return ({ ...state, user: null ,result : null ,user_id :null, logout : 1 });
        default :
            return state;
    }}