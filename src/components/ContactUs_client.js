import React, { Component } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    Linking,
    ActivityIndicator,
    ImageBackground,
    KeyboardAvoidingView
} from "react-native";
import {Container, Content, Header, Button, Item, Input, Form, Label, Textarea, Toast} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
// import {DoubleBounce} from "react-native-loader";
import axios from "axios";
import CONST from "../consts/colors";
import {connect}         from "react-redux";
import {profile, userLogin} from "../actions";
import {NavigationEvents} from "react-navigation";


const height = Dimensions.get('window').height;

class ContactUs_client extends Component {
    constructor(props){
        super(props);

        this.state={
            username: '',
            msg: '',
            email: '',
            socials: '',
            usernameStatus: 0,
            msgStatus: 0,
            emailStatus: 0,
        }
    }


    componentWillMount()
    {
        axios({
            method     : 'post',
            url        :  CONST.url + 'socialMediaAdmin',
            data       :  {

            },
            headers    : {
                lang             :   ( this.props.lang ) ?  this.props.lang : 'ar',
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
                 this.setState({socials : response.data.data})
            }

        }).catch(error => {

        }).then(()=>{
            this.setState({ isLoaded: false });
        });
    }
    static navigationOptions = () => ({
        drawerLabel:  i18n.t('contactUs')  ,
        drawerIcon: (<Image source={require('../../assets/images/noun_contactus.png')} style={styles.drawerImg} resizeMode={'contain'} /> )
    });

    activeInput(type){
        if (type === 'username'){
            this.setState({ usernameStatus: 1 })
        }else if (type === 'msg'){
            this.setState({ msgStatus: 1 })
        }else
            this.setState({ emailStatus: 1 })
    }

    unActiveInput(type){
        if (type === 'username'){
            this.setState({ usernameStatus: 0 })
        }else if (type === 'msg'){
            this.setState({ msgStatus: 0 })
        }else
            this.setState({ emailStatus: 0 })
    }




    validate = () => {
        let isError = false;
        let msg = '';

        if (  this.state.username === '' ) {
            isError = true;
            msg = i18n.t('title_validation');
        }else if( this.state.email === '' ) {
            isError = true;
            msg = i18n.t('email_validation');
        }else if(this.state.msg === '') {
            isError = true;
            msg = i18n.t('msg_validation');
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


             <TouchableOpacity onPress={ () => this.onSend()} style={[styles.yellowBtn , styles.mb10]}>
               <Text style={styles.whiteText}>{ i18n.t('sendButton') }</Text>
             </TouchableOpacity>
        );
    }


    onSend() {
        const err = this.validate();
        if (!err){
            this.setState({ isLoaded: true });
            axios({
                method     : 'post',
                url        :  CONST.url + 'callus_message',
                data       :  {
                    title        : this.state.username,
                    message      : this.state.msg,
                    email        : this.state.email,
                    type         : 1,
                },
                headers    : {
                    lang             :   this.props.lang,
                    user_id          :   this.props.user.user_id,
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


                    this.setState({
                        username   :'',
                        msg        :'',
                        email      :'',
                    })
                }

            }).catch(error => {

            }).then(()=>{
                this.setState({ isLoaded: false });
            });
        }
    }



    onFocus(){
        this.componentWillMount();
    }


    _linkPressed (url){
        Linking.openURL(url);
    }

    render() {


        return (
            <Container>

                <NavigationEvents onWillFocus={() => this.onFocus()} />

                <Header style={[styles.header ]} noShadow>
                    <View style={styles.directionRow}>
                        <Button onPress={() => this.props.navigation.openDrawer()} transparent style={styles.headerBtn}>
                            <Image source={require('../../assets/images/noun_menu.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                        </Button>

                    </View>

                    <Text style={[styles.headerText ]}>{i18n.t('contactUs')}</Text>

                    <View style={styles.directionRow}>

                    </View>
                </Header>

                <Content contentContainerStyle={styles.flexGrow} style={{}} >
                    <ImageBackground source={require('../../assets/images/bg.png')} resizeMode={'cover'} style={styles.imageBackground}>
                        <View style={[styles.homeSection , {marginTop:20}]}>
                            <View style={styles.directionColumnCenter}>
                                <Text style={[styles.yellowText ]}>{ i18n.t('sendMsg') }</Text>
                                {/*<Text style={[styles.grayText , styles.tAC , styles.mt15]}>هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى</Text>*/}

                                <KeyboardAvoidingView behavior={'padding'} style={styles.keyboardAvoid}>
                                    <Form style={{ width: '100%' , marginTop:30}}>

                                        <Item style={styles.loginItem} bordered>
                                            <Label style={[styles.label ]}>{ i18n.t('title') }</Label>
                                            <Input value={this.state.username}  placeholder={ i18n.t('title') } onBlur={() => this.unActiveInput('username')} onFocus={() => this.activeInput('username')} placeholderTextColor={COLORS.placeholderColor}
                                                   onChangeText={(username) => this.setState({username})} autoCapitalize='none'
                                                   style={[styles.input , {borderTopRightRadius:25  ,borderTopLeftRadius:25  ,
                                                       borderColor: this.state.usernameStatus === 1 ? COLORS.blue : COLORS.lightGray ,
                                                       backgroundColor: this.state.usernameStatus === 1 ? '#fff' : COLORS.lightGray }]}  />
                                        </Item>


                                        <Item style={[styles.loginItem]} bordered>
                                            <Label style={[styles.label ]}>{ i18n.t('email') }</Label>
                                            <Input value={this.state.email} placeholder={ i18n.t('enterMail') } onBlur={() => this.unActiveInput('email')} onFocus={() => this.activeInput('email')} placeholderTextColor={COLORS.placeholderColor}
                                                   onChangeText={(email) => this.setState({email})} keyboardType={'email-address'}
                                                   style={[styles.input , {borderTopRightRadius:25 ,borderTopLeftRadius:25  ,
                                                       borderColor: this.state.emailStatus === 1 ? COLORS.blue : COLORS.lightGray ,
                                                       backgroundColor: this.state.emailStatus === 1 ? '#fff' : COLORS.lightGray }]}  />
                                        </Item>

                                        <Item style={[styles.loginItem]} bordered>
                                            <Label style={[styles.label ]}>{ i18n.t('msg') }</Label>
                                            <Textarea value={this.state.msg} onBlur={() => this.unActiveInput('msg')} onFocus={() => this.activeInput('msg')} placeholderTextColor={COLORS.placeholderColor}
                                                      onChangeText={(msg) => this.setState({msg})} autoCapitalize='none'
                                                      style={[styles.input , {borderTopRightRadius:25 ,borderTopLeftRadius:25  ,
                                                          borderColor: this.state.msgStatus === 1 ? COLORS.blue : COLORS.lightGray ,
                                                          backgroundColor: this.state.msgStatus === 1 ? '#fff' : COLORS.lightGray ,
                                                          height:120 , paddingVertical:10}]} placeholder={ i18n.t('typeMsg') } />
                                        </Item>




                                        {
                                            this.renderSubmit()
                                        }
                                    </Form>
                                </KeyboardAvoidingView>

                                <Text style={[styles.yellowText , styles.mt25 , {fontSize:16} ]}>{ i18n.t('throughSocial') }</Text>
                                {/*<Text style={[styles.grayText , styles.tAC , styles.mt15]}>هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى</Text>*/}

                                <View style={[styles.directionRow , styles.mt25]}>
                                    {/*<TouchableOpacity  style={styles.directionRow} onPress={()=> this._linkPressed(this.state.socials[0].linkUrl)}>*/}
                                        {/*<Image source={require('../../assets/images/facebook.png')} style={[styles.social]} resizeMode={'contain'} />*/}
                                    {/*</TouchableOpacity>*/}
                                    <TouchableOpacity  style={styles.directionRow} onPress={()=> this._linkPressed(this.state.socials[3].linkUrl)}>
                                        <Image source={require('../../assets/images/twitter.png')} style={[styles.social]} resizeMode={'contain'} />
                                    </TouchableOpacity>
                                    <TouchableOpacity  style={styles.directionRow} onPress={()=> this._linkPressed(this.state.socials[2].linkUrl)}>
                                        <Image source={require('../../assets/images/insta.png')} style={[styles.social]} resizeMode={'contain'} />
                                    </TouchableOpacity>
                                    <TouchableOpacity  style={styles.directionRow} onPress={()=> this._linkPressed('http://api.whatsapp.com/send?phone=' + this.state.socials[1].linkUrl)}>
                                        <Image source={require('../../assets/images/whats.png')} style={[styles.social]} resizeMode={'contain'} />
                                    </TouchableOpacity>
                                </View>

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
        auth       : auth.user,
        lang       : lang.lang,
        user       : profile.user,
    };
};

export default connect(mapStateToProps, { userLogin , profile})(ContactUs_client);




