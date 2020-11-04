import React, { Component } from "react";
import { Image} from "react-native";
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import {connect}         from "react-redux";
import {profile, userLogin} from "../actions";


class Logout_delegate extends Component {
    constructor(props){
        super(props);

        this.state={

        }
    }

    static navigationOptions = () => ({
        drawerLabel:  i18n.t('logout')  ,
        drawerIcon: (<Image source={require('../../assets/images/logout.png')} style={[styles.drawerImg , styles.transform ]} resizeMode={'contain'} /> )
    });

    render() {
        return false
    }
}
const mapStateToProps = ({ auth,profile, lang  }) => {

    return {

        auth     : auth.user,
        lang     : lang.lang,
        result   : auth.success,
        userId   : auth.user_id,
    };
};
export default connect(mapStateToProps, { userLogin ,profile})(Logout_delegate);




