import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, Dimensions, ScrollView, I18nManager, ImageBackground} from "react-native";
import {Container, Content, Header, Button, Item, Input, Form} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
import {connect}         from "react-redux";
import {profile, userLogin} from "../actions";


const height = Dimensions.get('window').height;

class Rate_client extends Component {
    constructor(props){
        super(props);

        this.state={
        }
    }

    static navigationOptions = () => ({
        drawerLabel: () => null,
    });


    render() {


        return (
            <Container>

                <Content contentContainerStyle={styles.flexGrow} style={{}} >
                    <ImageBackground source={require('../../assets/images/bg.png')} resizeMode={'cover'} style={styles.imageBackground}>
                        <View style={[styles.homeSection ]}>
                            <View style={styles.directionColumnCenter}>
                                <Image source={require('../../assets/images/checkmark.png')} style={[styles.checkMark ]} resizeMode={'contain'} />
                                <Text style={[styles.yellowText , styles.mt25 , styles.tAC , styles.mb15]}>{i18n.t('urReview')}</Text>
                                <TouchableOpacity onPress={ () => {
                                    if(this.props.auth.data.userType === 'user'){
                                        this.props.navigation.navigate("home_client")
                                    }else{
                                        this.props.navigation.navigate("home_delegate")
                                    }
                                }} style={[styles.yellowBtn , styles.mt25 , ]}>
                                    <Text style={styles.whiteText}>{i18n.t('home')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ImageBackground>
                </Content>
            </Container>

        );
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
export default connect(mapStateToProps, { userLogin ,profile})(Rate_client);



