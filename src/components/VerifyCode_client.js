import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, ActivityIndicator, ImageBackground, I18nManager , KeyboardAvoidingView} from "react-native";
import {Container, Content, Item, Input, Label, Form, Icon, Toast} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
// import {DoubleBounce} from "react-native-loader";
import axios from "axios";
import CONST from "../consts/colors";
import {connect}         from "react-redux";
import {profile, userLogin} from "../actions";
// import Spinner from "react-native-loading-spinner-overlay";



class activitionCode_client extends Component {
    constructor(props){
        super(props);

        this.state={
            activitionCode   : '',
            password         : '',
            verifypassword   : '',
            spinner          : false,
            showpassword     : true,
            showVerifiedPass : true,
        }

        console.log('-----')
        console.log(this.props.navigation.state.params.activitionCode)
        // alert(this.props.navigation.state.params.activitionCode)

    }


    validate = () => {
        let isError = false;
        let msg = '';

        if (  this.state.activitionCode === '' ) {
            isError = true;
            msg = i18n.t('code_validation');
        }else if(this.state.password === '') {
            isError = true;
            msg = i18n.t('enterpassword');
        }else if(this.state.password.length < 6) {
            isError = true;
            msg = i18n.t('passlen');
        }else if(this.state.verifypassword !== this.state.password) {
            isError = true;
            msg = i18n.t('confirm_password_validation');
        }
        if (msg != ''){
            Toast.show({ text: msg, duration : 2000  ,type :"danger", textStyle: { color: "white",fontFamily : 'cairoBold' ,textAlign:'center' } });
        }
        return isError;
    };


    renderSubmit()
    {
        if (this.state.isLoaded){
            return(
                <View  style={{ justifyContent:'center', alignItems:'center' , marginVertical: 20}}>
                    <ActivityIndicator size="large" color={COLORS.red} />
                </View>
            )
        }

        return (
             <TouchableOpacity onPress={ () => this.onSend()} style={[styles.yellowBtn , styles.mt15, styles.mb100]}>
                <Text style={styles.whiteText}>{ i18n.t('sendButton') }</Text>
             </TouchableOpacity>
        );
    }


    onSend() {
        console.log('type', this.props.navigation.state.params.type)
        const err = this.validate();
        if (!err){
           this.setState({ isLoaded: true });
            axios({
                method     : 'post',
                url        :  CONST.url + 'confirmPassword',
                data       :  {
                    activitionCode   : this.state.activitionCode,
                    newPassword      : this.state.password,
                },
                headers    : {
                    lang             :   this.props.lang,
                    user_id          :   this.props.navigation.state.params.user_id,
                }
            }).then(response => {

                this.setState({ isLoaded: false });

                Toast.show({
                    text: response.data.message,
                    duration : 2000,
                    type : response.data.status === '1' ? "success" : "danger",
                    textStyle: {
                        color: "white",
                        fontFamily : 'cairoBold',
                        textAlign:'center'
                    }
                });

                if(response.data.status === '1'){
                    this.props.navigation.navigate('login_client', {
                        type : this.props.navigation.state.params.type
                    });
                }

                // if(response.data.status === '0')
                // {
                //     Toast.show({
                //         text: response.data.message,
                //         duration : 2000 ,
                //         type :"danger",
                //         textStyle: {
                //             color: "white",fontFamily : 'cairoBold' ,textAlign:'center'
                //         } });
                // }else{
                //     Toast.show({
                //         text: response.data.message,
                //         duration : 2000 ,
                //         type :"success",
                //         textStyle: {
                //             color: "white",fontFamily : 'cairoBold' ,textAlign:'center'
                //         } });
                //     this.props.navigation.navigate('login_client', {
                //         type : this.props.navigation.state.params.type
                //     });
                // }

            }).catch(error => {
                this.setState({ isLoaded: false });
            }).then(()=>{
                this.setState({ isLoaded: false });
            });
        }
    }

    resend()
    {
        this.setState({ isLoaded: true });
        axios({
            method     : 'post',
            url        :  CONST.url + 'resendActivition',
            data       :  {

            },
            headers    : {
                lang             :   this.props.lang,
                user_id          :   this.props.navigation.state.params.user_id,
            }
        }).then(response => {

            this.setState({ isLoaded: false });

            if(response.data.status === '0')
            {
                Toast.show({ text: response.data.message, duration : 2000 ,
                    type :"danger",
                    textStyle: {
                        color: "white",fontFamily : 'cairoBold' ,textAlign:'center'
                    } });
            }else{
                alert(response.data.data.activitionCode)
                Toast.show({ text: response.data.message, duration : 2000 ,
                    type :"success",
                    textStyle: {
                        color: "white",fontFamily : 'cairoBold' ,textAlign:'center'
                 } });
            }

        }).catch(error => {
            this.setState({ isLoaded: false });
        }).then(()=>{
            this.setState({ spinner: false });
        });
    }


    render() {
        return (
            <Container>
                {/*<Spinner visible={this.state.spinner}/>*/}

                <Content  contentContainerStyle={styles.flexGrow}>
                    <TouchableOpacity style={styles.authBack} onPress={() => this.props.navigation.goBack()}>
                        <Icon type={'FontAwesome'} name={'angle-right'} style={[styles.transform]} />
                    </TouchableOpacity>
                    <ImageBackground source={require('../../assets/images/bg.png')} resizeMode={'cover'} style={styles.imageBackground}>
                        <View>
                            <Image source={require('../../assets/images/headerlogin.png')} style={styles.headerbg} resizeMode={'cover'} />
                            <Image source={require('../../assets/images/logo.png')} style={styles.headerLogo} resizeMode={'contain'} />
                        </View>
                        <View style={styles.authMainView}>
                            <Text style={[styles.yellowText , styles.mb15]}>{ i18n.t('recoverPass') }</Text>
                            <Text style={[styles.grayText , styles.tAC]}></Text>

                            <KeyboardAvoidingView behavior={'padding'} style={styles.keyboardAvoid}>
                                <Form style={{ width: '100%' , marginTop:30}}>

                                    <Item style={styles.loginItem} bordered>
                                        <Label style={[styles.label ]}>{ i18n.t('activitionCode') }</Label>
                                        <Input placeholder={i18n.t('enteractivitionCode')} placeholderTextColor={COLORS.placeholderColor}  onChangeText={(activitionCode) => this.setState({activitionCode})} keyboardType={'number-pad'} style={styles.input}  />
                                    </Item>

                                    <Item style={styles.loginItem} bordered>
                                        <Label style={[styles.label ]}>{ i18n.t('password') }</Label>
                                        <Input placeholder={i18n.t('enterpassword')} placeholderTextColor={COLORS.placeholderColor} autoCapitalize='none' onChangeText={(password) => this.setState({password})} secureTextEntry={this.state.showpassword === true ? true : false} style={[styles.input , {paddingRight:40}]}  />

                                        <TouchableOpacity style={styles.eye} onPress={() => this.setState({showpassword: !this.state.showpassword})}>
                                            <Icon type={'FontAwesome'} name={ this.state.showpassword === true ? 'eye' : 'eye-slash'} style={[styles.eyeIcon]} />
                                        </TouchableOpacity>
                                    </Item>

                                    <Item style={styles.loginItem} bordered>
                                        <Label style={[styles.label ]}>{ i18n.t('verifyNewPass') }</Label>
                                        <Input placeholder={i18n.t('enterConfirmPass')} placeholderTextColor={COLORS.placeholderColor} autoCapitalize='none' onChangeText={(verifypassword) => this.setState({verifypassword})} secureTextEntry={this.state.showVerifiedPass === true ? true : false} style={[styles.input , {paddingRight:40}]}  />

                                        <TouchableOpacity style={styles.eye} onPress={() => this.setState({showVerifiedPass: !this.state.showVerifiedPass})}>
                                            <Icon type={'FontAwesome'} name={ this.state.showVerifiedPass === true ? 'eye' : 'eye-slash'} style={[styles.eyeIcon]} />
                                        </TouchableOpacity>
                                    </Item>

                                    <TouchableOpacity onPress={()=> { this.resend()}}>
                                      <Text style={[styles.grayText , {fontSize:14 , color:COLORS.blue,textAlign:'center' , marginVertical : 15} ]}>{ i18n.t('resend') }</Text>
                                    </TouchableOpacity>
                                </Form>

                                {this.renderSubmit()}

                            </KeyboardAvoidingView>
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
    };
};

export default connect(mapStateToProps, { userLogin , profile})(activitionCode_client);




