import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, ImageBackground ,AsyncStorage, KeyboardAvoidingView , ActivityIndicator} from "react-native";
import {Container, Content, Item, Input, Label, Form, Icon, Toast} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
// import {DoubleBounce} from "react-native-loader";
// import Spinner from "react-native-loading-spinner-overlay";
import {connect}         from "react-redux";
import { userLogin , profile} from "../actions";
import * as Notifications from 'expo-notifications';
import *  as Permissions from 'expo-permissions';

class Login_client extends Component {
    constructor(props){
        super(props);
        this.state = {
            password            : '',
            showPass            : true,
            isLoaded            : false,
            spinner             : false,
            phoneNo             : '',
            deviceID            : '000',
            userType            : '',
            lang                : '',
            deviceType          : 'ios',
            routeName           : 'register_client'
        }
    }

/////ExponentPushToken[zMaFSILu-6DsPJHzKzz9iz]
  async  componentWillMount()
    {

        if(this.props.navigation.state.params.type === 'user') {
            this.setState({routeName : 'register_client'})
        }else{
            this.setState({routeName : 'register_delegate'})
        }

        this.setState({
            lang         : this.props.lang,
            type         : this.props.navigation.state.params.type,
            userType     : this.props.navigation.state.params.type,
        });

      // setTimeout(()=>{
      //     this.allowNotification();
      // },12000)

    }
   //
   // async  allowNotification(){
   //      const { status: existingStatus } = await Permissions.getAsync(
   //          Permissions.NOTIFICATIONS
   //      );
   //
   //      let finalStatus = existingStatus;
   //
   //      if (existingStatus !== 'granted') {
   //          const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
   //          finalStatus = status;
   //      }
   //
   //      if (finalStatus !== 'granted') {
   //          return;
   //      }
   //
   //      let token = await Notifications.getExpoPushTokenAsync();
   //
   //      console.log('your token is it  :  ',token)
   //      this.setState({ deviceID : token });
   //
   //
   //      AsyncStorage.setItem('yumDeviceID', token);
   //  }
    validate = () => {
        let isError = false;
        let msg = '';

        if (this.state.phoneNo.length < 10 || this.state.phoneNo === '') {
            isError = true;
            msg = i18n.t('phone_validation');
        }else if (this.state.password.length === 0) {
            isError = true;
            msg = i18n.t('password_validation');
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
                <Text style={styles.whiteText}>{ i18n.t('loginButton') }</Text>
            </TouchableOpacity>
        );
    }


    onSend() {
        const err = this.validate();
        if (!err){
            this.setState({ isLoaded: true });
            this.props.userLogin(this.state);
        }
    }


    componentWillReceiveProps(newProps) {

      if(newProps.auth)
      {
           if(newProps.auth.status === '0')
           {
               Toast.show({ text: newProps.auth.message, duration : 2000 ,
                   type :"danger",
                   textStyle: {
                   color: "white",fontFamily : 'cairoBold' ,textAlign:'center'
               } });
               this.setState({password : ''});

           }else if(newProps.auth.status === '2') {

               Toast.show({
                   text: newProps.auth.message, duration: 2000,
                   type: "success",
                   textStyle: {
                       color: "white", fontFamily: 'cairoBold', textAlign: 'center'
                   }
               });
               this.props.navigation.navigate('accActivation_client', {
                   type : this.props.navigation.state.params.type,
                   user_id : newProps.auth.data.user_id,
                   activitionCode: newProps.auth.data.activitionCode
               });

           }else{

                this.props.profile({
                    user_id     : newProps.auth.data.user_id ,
                    lang        : this.props.lang
                });

                AsyncStorage.setItem('yumUserData',
                   JSON.stringify(newProps.auth.data
                ));

                if(this.props.navigation.state.params.type === 'user')
                {
                    this.props.navigation.navigate('drawerNavigator_client');
                }else{
                    this.props.navigation.navigate('drawerNavigator_delegate');
                }


               Toast.show({ text: newProps.auth.message, duration : 2000 ,
                   type :"success",
                   textStyle: {
                       color: "white",fontFamily : 'cairoBold' ,textAlign:'center'
               }});
           }
          this.setState({ isLoaded: false });
      }
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
                        <ImageBackground source={require('../../assets/images/headerlogin.png')} resizeMode={'cover'} style={[styles.headerbg, styles.flexCenter]}>
                            <Image source={require('../../assets/images/logo.png')} style={[styles.width_120]} resizeMode={'contain'} />
                        </ImageBackground>
                        <View style={styles.authMainView}>
                            <Text style={[styles.yellowText , styles.mb15]}>{ i18n.t('loginButton') }</Text>
                            <Text style={[styles.grayText , styles.tAC]}></Text>

                                <Form style={{ width: '100%' , marginTop:30}}>
                                    <KeyboardAvoidingView behavior={'padding'} style={styles.keyboardAvoid}>

                                        <Item style={styles.loginItem} bordered>
                                            <Label style={[styles.label ]}>{ i18n.t('phoneNumber') }</Label>
                                            <Input placeholder={ i18n.t('enterPhone') } placeholderTextColor={COLORS.placeholderColor} onChangeText={(phoneNo) => this.setState({phoneNo})} value={this.state.phoneNo} keyboardType={'number-pad'} style={styles.input}  />
                                        </Item>

                                        <Item style={styles.loginItem} bordered>
                                            <Label style={[styles.label ]}>{ i18n.t('password') }</Label>
                                            <Input  placeholder={i18n.t('enterPass')} placeholderTextColor={COLORS.placeholderColor} autoCapitalize='none' value={this.state.password} onChangeText={(password) => this.setState({password})} secureTextEntry={this.state.showPass === true ? true : false} style={[styles.input , {paddingRight:40}]}  />

                                            <TouchableOpacity style={styles.eye} onPress={() => this.setState({showPass: !this.state.showPass})}>
                                                <Icon type={'FontAwesome'} name={ this.state.showPass === true ? 'eye' : 'eye-slash'} style={[styles.eyeIcon]} />
                                            </TouchableOpacity>
                                        </Item>


                                            {this.renderSubmit()}

                                        {
                                            (this.props.navigation.state.params.type === 'user') ?
                                                <TouchableOpacity
                                                    onPress={ () => this.props.navigation.navigate('drawerNavigator_client')}
                                                    style={[styles.yellowBtn , styles.mb10 , {backgroundColor:COLORS.grayBtn}]}>
                                                    <Text style={[styles.whiteText , {color: COLORS.boldGray}]}>{ i18n.t('visitor') }</Text>
                                                </TouchableOpacity>
                                                :
                                                <View/>
                                        }

                                        <TouchableOpacity onPress={()=> this.props.navigation.navigate('forgetPassword_client',{
                                            type       : this.props.navigation.state.params.type
                                        })} style={styles.forgetPass}>
                                            <Text style={[styles.grayText , {fontSize:14} ]}>{ i18n.t('forgetPass') }</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={ () => this.props.navigation.navigate(this.state.routeName,{
                                            type : this.props.navigation.state.params.type
                                        })} style={[styles.forgetPass , styles.mb100]}>
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
const mapStateToProps = ({ auth,profile, lang  }) => {

    return {
        auth     : auth.user,
        lang     : lang.lang,
    };
};

export default connect(mapStateToProps, { userLogin , profile})(Login_client);

