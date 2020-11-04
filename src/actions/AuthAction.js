import axios                from 'axios';
import { AsyncStorage }     from 'react-native';
import CONST                from '../consts/colors';

export const userLogin = (state) => {

    const data = {
        phoneNo     : state.phoneNo,
        password    : state.password,
        deviceID    : state.deviceID,
        userType    : state.userType,
        deviceType  : state.deviceType,
        lang        : state.lang,
    };
     return (dispatch) => {
        dispatch({type: 'user_login'});
         axios({
             method     : 'post',
             url        :  CONST.url + 'sign-in',
             data       :  data,
             headers    : {
                 lang       :  state.lang
             }
         })  .then(response => handelLogin(dispatch, response.data))
             .catch(error =>  console.log(error.message));

     };
};



export const tempAuth = () => {
    return (dispatch) => {
        dispatch({type: 'temp_auth'});
    };
};


const handelLogin = (dispatch, data) => {
    if (data.status !== '1'){
        loginFailed(dispatch, data)
    }else{
        loginSuccess(dispatch, data)
    }
};


const loginSuccess = (dispatch, data) => {

     let result = data;

     if(result.status === '1')
     {
         if(result.data != null)
         {
             AsyncStorage.setItem('yumUserId', JSON.stringify(result.data))
                 .then(() => dispatch({type: 'login_success', result }));

         }else {
             AsyncStorage.setItem('yumUserData', JSON.stringify(result.data))
                 .then(() => dispatch({type: 'login_success', result }));
         }
     }



};

const loginFailed = (dispatch, error) => {
    dispatch({type: 'login_failed', error});
};

