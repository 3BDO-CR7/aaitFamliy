import axios                from 'axios';
import CONST                from '../consts/colors';
import {AsyncStorage}       from "react-native";


export const profile = (result ) => {

    return (dispatch) => {

        axios({
            method     : 'post',
            url        :  CONST.url + 'userProfile',
            data       :  {},
            headers    : {
                lang       :  result.lang,
                user_id    :  result.user_id
            }
        })  .then(response => {
             const data = response.data;
             console.log('profile ' , data);
             dispatch({type: 'profile_data', data});
        })
    }
};



export const updateProfile = (data) => {
    console.log('data.avatar ' ,data.avatar);
    return (dispatch) => {
        axios({
            url: CONST.uri + 'editProfile',
            method: 'POST',
            data: {
                name       : data.name,
                avatar     : data.avatar,
                country_id : data.country_id,
                city_id    : data.city_id,
                password  : data.password,
                mute      : data.mute,
                lang      : data.lang,
                user_id   : data.user_id,
                phone     : data.phone,
                key       : data.key,


            }}).then(response => {

                const data = response.data;
                dispatch({type: 'update_profile', data})


        }).catch(() => {

        })
    }
};


export const logout = () => {
    return (dispatch) =>
    {
        AsyncStorage.clear();
        dispatch({type: 'logout'});
    }
};