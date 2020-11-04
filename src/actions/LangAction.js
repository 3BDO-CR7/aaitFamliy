import {
    I18nManager  as RNI18nManager,
    AsyncStorage
} from 'react-native';
import i18n from '../../locale/i18n';
import {Updates} from 'expo'

export const chooseLang = lang => {

     if (lang === 'en') {
        RNI18nManager.forceRTL(false);
    } else {
        RNI18nManager.forceRTL(true);
    }

    i18n.locale = lang;
    setLang(lang);

    return {
        type   : 'chooseLang',
        payload: lang
    }
};

const setLang = async lang => {
        await AsyncStorage.setItem('lang', lang).then (() =>{
            Updates.reload()
        });
};


