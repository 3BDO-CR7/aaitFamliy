import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, Dimensions, ImageBackground, I18nManager , KeyboardAvoidingView} from "react-native";
import {Container, Content, Item, Input, Label, Form, Icon} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'


const height = Dimensions.get('window').height;

class Login_delegate extends Component {
    constructor(props){
        super(props);

        this.state={
            phone: '',
            password: '',
            showPass:true
        }
    }


    render() {
        return (
            <Container>
                <Content  contentContainerStyle={styles.flexGrow}>
                    <TouchableOpacity style={styles.authBack} onPress={() => this.props.navigation.goBack()}>
                        <Icon type={'FontAwesome'} name={'angle-right'} style={[styles.transform]} />
                    </TouchableOpacity>
                    <ImageBackground source={require('../../assets/images/bg.png')} resizeMode={'cover'} style={styles.imageBackground}>
                        <ImageBackground source={require('../../assets/images/headerlogin.png')} resizeMode={'cover'} style={[styles.headerbg, styles.flexCenter]}>
                            <Image source={require('../../assets/images/logo.png')} style={[styles.width_120]} resizeMode={'contain'} />
                        </ImageBackground>
                        <View style={styles.authMainView}>
                            <Text style={[styles.yellowText , styles.mb15]}>{ i18n.t('loginButton') }</Text>
                            <Text style={[styles.grayText , styles.tAC]}>هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى</Text>

                                <Form style={{ width: '100%' , marginTop:30}}>

                                    <KeyboardAvoidingView behavior={'padding'} style={styles.keyboardAvoid}>
                                    <Item style={styles.loginItem} bordered>
                                        <Label style={[styles.label ]}>{ i18n.t('phoneNumber') }</Label>
                                        <Input placeholder={ i18n.t('enterPhone') } placeholderTextColor={COLORS.placeholderColor} onChangeText={(phone) => this.setState({phone})} keyboardType={'number-pad'} style={styles.input}  />
                                    </Item>

                                    <Item style={styles.loginItem} bordered>
                                        <Label style={[styles.label ]}>{ i18n.t('password') }</Label>
                                        <Input placeholder={i18n.t('enterPass')} placeholderTextColor={COLORS.placeholderColor} autoCapitalize='none' onChangeText={(password) => this.setState({password})} secureTextEntry={this.state.showPass === true ? true : false} style={[styles.input , {paddingRight:40}]}  />

                                        <TouchableOpacity style={styles.eye} onPress={() => this.setState({showPass: !this.state.showPass})}>
                                            <Icon type={'FontAwesome'} name={ this.state.showPass === true ? 'eye' : 'eye-slash'} style={[styles.eyeIcon]} />
                                        </TouchableOpacity>
                                    </Item>


                                    <TouchableOpacity onPress={ () => this.props.navigation.navigate('drawerNavigator_delegate')} style={[styles.yellowBtn , styles.mt15, styles.mb10]}>
                                        <Text style={styles.whiteText}>{ i18n.t('loginButton') }</Text>
                                    </TouchableOpacity>


                                    <TouchableOpacity onPress={()=> this.props.navigation.navigate('forgetPassword_delegate')} style={styles.forgetPass}>
                                        <Text style={[styles.grayText , {fontSize:14} ]}>{ i18n.t('forgetPass') }</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={ () => this.props.navigation.navigate('register_delegate')} style={[styles.forgetPass , styles.mb100]}>
                                        <Text style={[styles.grayText , {fontSize:14} ]}>{ i18n.t('haveNoAcc') } </Text>
                                        <Text style={[styles.grayText , {fontSize:14 , color:COLORS.blue} ]}>{ i18n.t('clickHere') }</Text>
                                    </TouchableOpacity>


                                    </KeyboardAvoidingView>
                                </Form>
                        </View>
                    </ImageBackground>
                </Content>
            </Container>

        );
    }
}

export default Login_delegate;
