import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, ImageBackground , KeyboardAvoidingView,ActivityIndicator} from "react-native";
import {Container, Content, Item, Input, Label, Form, Icon, CheckBox, Toast} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
// import {DoubleBounce} from "react-native-loader";
import axios from "axios";
import CONST from "../consts/colors";
import {connect}         from "react-redux";
import {profile, userLogin} from "../actions";



class Register_client extends Component {
    constructor(props){
        super(props);

        this.state={
            userName            : '',
            phoneNo             : '',
            password            : '',
            email               : '',
            deviceID            : '123',
            userType            : '',
            deviceType          : 'ios',
            showPass            : true,
            checkTerms          : false,
        }
    }


    validate = () => {
        let isError = false;
        let msg = '';

        if (  this.state.userName === '' ) {
            isError = true;
            msg = i18n.t('name_validation');
        }else if(this.state.phoneNo === '') {
            isError = true;
            msg = i18n.t('enterPhone');
        }else if(this.state.phoneNo.length < 10) {
            isError = true;
            msg = i18n.t('phonelen');
        }else if(this.state.email === '') {
            msg = i18n.t('email_validation');
            isError = true;
        }else if(this.state.password === '') {
            isError = true;
            msg = i18n.t('enterpassword');
        }else if(this.state.password.length < 6) {
            isError = true;
            msg = i18n.t('passlen');
        }else if(this.state.checkTerms === false) {
            isError = true;
            msg = i18n.t('checkTerms_validation');
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
            <TouchableOpacity onPress={ () => this.onSend()} style={[styles.yellowBtn , styles.mt15, styles.mb10]}>
                <Text style={styles.whiteText}>{ i18n.t('registerButton') }</Text>
            </TouchableOpacity>
        );
    }


    onSend() {
        const err = this.validate();
        if (!err){
            this.setState({ isLoaded: true });
            axios({
                method     : 'post',
                url        :  CONST.url + 'sign-up',
                data       :  {
                    userName              : this.state.userName,
                    phoneNo               : this.state.phoneNo,
                    password              : this.state.password,
                    email                 : this.state.email,
                    deviceID              : this.state.deviceID,
                    userType              : this.props.navigation.state.params.type,
                    deviceType            : this.state.deviceType,
                },
                headers    : {
                    lang                  :   ( this.props.lang ) ?  this.props.lang : 'ar',
                }
            }).then(response => {

                if(response.data.status === '0')
                {
                    Toast.show({ text: response.data.message, duration : 2000 ,
                        type :"danger",
                        textStyle: {
                            color: "white",fontFamily : 'cairoBold' ,textAlign:'center'
                        } });
                }else{
                    Toast.show({ text: response.data.message, duration : 2000 ,
                        type :"success",
                        textStyle: {
                            color: "white",fontFamily : 'cairoBold' ,textAlign:'center'
                        } });
                    this.props.navigation.navigate('accActivation_client', {
                        type : this.props.navigation.state.params.type,
                        user_id : response.data.data.user_id,
                        activitionCode : response.data.data.activitionCode,
                        phoneNo : this.state.phoneNo,
                        password : this.state.password,
                        userType : this.state.userType,
                     });
                }

            }).catch(error => {
                console.log(error.message)
            }).then(()=>{
                this.setState({ isLoaded: false });
            });
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
                            <Text style={[styles.yellowText , styles.mb15]}>{ i18n.t('registerButton') }</Text>
                            <Text style={[styles.grayText , styles.tAC]}></Text>

                                <Form style={{ width: '100%' , marginTop:30}}>

                                    <KeyboardAvoidingView behavior={'padding'} style={styles.keyboardAvoid}>
                                    <Item style={styles.loginItem} bordered>
                                        <Label style={[styles.label ]}>{ i18n.t('name') }</Label>
                                        <Input placeholder={i18n.t('enterUsername')} value={this.state.userName} placeholderTextColor={COLORS.placeholderColor} onChangeText={(userName) => this.setState({userName})} autoCapitalize='none' style={styles.input}  />
                                    </Item>

                                    <Item style={styles.loginItem} bordered>
                                        <Label style={[styles.label ]}>{ i18n.t('phoneNumber') }</Label>
                                        <Input placeholder={ i18n.t('enterPhone') } value={this.state.phoneNo} placeholderTextColor={COLORS.placeholderColor} onChangeText={(phoneNo) => this.setState({phoneNo})} keyboardType={'number-pad'} style={styles.input}  />
                                    </Item>


                                    <Item style={styles.loginItem} bordered>
                                        <Label style={[styles.label ]}>{ i18n.t('email') }</Label>
                                        <Input placeholder={ i18n.t('enterMail') }  value={this.state.email} placeholderTextColor={COLORS.placeholderColor} onChangeText={(email) => this.setState({email})} keyboardType={'email-address'} style={styles.input} autoCapitalize='none'  />
                                    </Item>

                                    <Item style={styles.loginItem} bordered>
                                        <Label style={[styles.label ]}>{ i18n.t('password') }</Label>
                                        <Input placeholder={i18n.t('enterPass')}  value={this.state.password} placeholderTextColor={COLORS.placeholderColor} autoCapitalize='none' onChangeText={(password) => this.setState({password})} secureTextEntry={this.state.showPass === true ? true : false} style={[styles.input , {paddingRight:40}]}  />

                                        <TouchableOpacity style={styles.eye} onPress={() => this.setState({showPass: !this.state.showPass})}>
                                            <Icon type={'FontAwesome'} name={ this.state.showPass === true ? 'eye' : 'eye-slash'} style={[styles.eyeIcon]} />
                                        </TouchableOpacity>
                                    </Item>

                                    </KeyboardAvoidingView>

                                    <View style={[styles.directionRow , styles.mb15]}>
                                        <CheckBox onPress={() => this.setState({checkTerms: !this.state.checkTerms})} checked={this.state.checkTerms} color={COLORS.blue} style={styles.checkBox} />
                                        <TouchableOpacity onPress={()=>{this.props.navigation.navigate('policy_delegate')}}>
                                            <Text style={[styles.grayText , {fontSize:12} ]}> { i18n.t('byRegister') } <Text  style={styles.termText}>{ i18n.t('terms') }</Text></Text>
                                        </TouchableOpacity>
                                    </View>

                                    {this.renderSubmit()}

                                    <TouchableOpacity onPress={ () => this.props.navigation.navigate('login_client' , {
                                        type : this.props.navigation.state.params.type
                                    })} style={[styles.forgetPass , styles.mb100]}>
                                        <Text style={[styles.grayText , {fontSize:14} ]}>{ i18n.t('haveAcc') } </Text>
                                        <Text style={[styles.grayText , {fontSize:14 , color:COLORS.blue} ]}>{ i18n.t('clickHere') }</Text>
                                    </TouchableOpacity>


                                </Form>
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

export default connect(mapStateToProps, { userLogin , profile})(Register_client);






