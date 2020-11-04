import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, ImageBackground,I18nManager} from "react-native";
import {Container, Content} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import * as Animatable from "react-native-animatable";



class User extends Component {
    constructor(props){
        I18nManager.forceRTL(true);
        super(props);
        this.state={
        }
    }


    render() {
        return (
            <Container>
                <Content contentContainerStyle={styles.flexGrow} >
                    <ImageBackground source={require('../../assets/images/bg.png')} resizeMode={'cover'} style={styles.imageBackground}>
                        <ImageBackground source={require('../../assets/images/headerlogin.png')} resizeMode={'cover'} style={[styles.headerbg, styles.flexCenter]}>
                            <Image source={require('../../assets/images/logo.png')} style={[styles.width_150]} resizeMode={'contain'} />
                        </ImageBackground>
                        <View style={[ styles.authMainView , styles.flexCenter, styles.Width_100, styles.paddingHorizontal_20, styles.position_R, { top : -50 } ]}>

                            <Text style={[styles.yellowText , styles.mb25]}>{ i18n.t('register') }</Text>

                            <Animatable.View animation={'zoomIn'} duration={1000} style={[ styles.Width_80, styles.flexCenter ]}>
                                <TouchableOpacity
                                    onPress={ () => this.props.navigation.navigate('login_client', {type : 'user'})}
                                    style={[styles.yellowBtn , styles.marginVertical_10, styles.Width_100]}
                                >
                                    <Text style={styles.whiteText}>{ i18n.t('asUser') }</Text>
                                </TouchableOpacity>
                            </Animatable.View>

                            <Animatable.View animation={'zoomIn'} duration={2000} style={[ styles.Width_80, styles.flexCenter ]}>
                                <TouchableOpacity
                                    onPress={ () => this.props.navigation.navigate('login_client' , {type : 'delegate'})}
                                    style={[styles.redBtn , styles.marginVertical_10, styles.Width_100]}
                                >
                                    <Text style={styles.whiteText}>{ i18n.t('asDelegate') }</Text>
                                </TouchableOpacity>
                            </Animatable.View>

                        </View>
                    </ImageBackground>
                </Content>
            </Container>

        );
    }
}

export default User;
