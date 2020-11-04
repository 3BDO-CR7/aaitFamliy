import React, { Component } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    Linking,
    I18nManager,
    ImageBackground,
    KeyboardAvoidingView, ActivityIndicator
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


const height = Dimensions.get('window').height;

class Complaints_client extends Component {
    constructor(props){
        super(props);

        this.state={
            username: '',
            msg: '',
            email: '',
            isLoadeds: false,
            msgSubject: '',
            usernameStatus: 0,
            msgStatus: 0,
            emailStatus: 0,
            msgSubjectStatus: 0,
        }
    }

    static navigationOptions = () => ({
        drawerLabel:  i18n.t('complaints')  ,
        drawerIcon: (<Image source={require('../../assets/images/noun_complaint.png')} style={styles.drawerImg} resizeMode={'contain'} /> )
    })

    activeInput(type){
        if (type === 'username'){
            this.setState({ usernameStatus: 1 })
        }else if (type === 'msg'){
            this.setState({ msgStatus: 1 })
        }else if (type === 'msgSubject'){
            this.setState({ msgSubjectStatus: 1 })
        }else
            this.setState({ emailStatus: 1 })
    }

    unActiveInput(type){
        if (type === 'username'){
            this.setState({ usernameStatus: 0 })
        }else if (type === 'msg'){
            this.setState({ msgStatus: 0 })
        }else if (type === 'msgSubject') {
            this.setState({msgSubjectStatus: 0})
        }else
            this.setState({ emailStatus: 0 })
    }



    validate = () => {
        let isError = false;
        let msg = '';

        if (  this.state.username === '' ) {
            isError = true;
            msg = i18n.t('title_validation');
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

    renderLoader(){
        if (this.state.isLoadeds){
            return(
                <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' , alignSelf:'center' , backgroundColor: '#FFF' , width:'100%' , position:'absolute' , zIndex:99,top : 0, right : 0  }}>
                    <ActivityIndicator size="large" color={COLORS.red} />
                </View>
            );
        }
    }


    onSend() {
        const err = this.validate();
        if (!err){
            this.setState({ isLoadeds: true });
            axios({
                method     : 'post',
                url        :  CONST.url + 'callus_message',
                data       :  {
                    title        : this.state.username,
                    message      : this.state.msg,
                    type         : 0,
                },
                headers    : {
                    lang             :   (this.props.lang) ? this.props.lang : 'ar',
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
                this.setState({ isLoadeds: false });
            });
        }
    }



    render() {


        return (
            <Container>

                <Header style={[styles.header ]} noShadow>
                    <View style={styles.directionRow}>
                        <Button onPress={() => this.props.navigation.openDrawer()} transparent style={styles.headerBtn}>
                            <Image source={require('../../assets/images/noun_menu.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                        </Button>

                    </View>

                    <Text style={[styles.headerText ]}>{i18n.t('complaints')}</Text>

                    <View style={styles.directionRow}>

                    </View>
                </Header>

                {this.renderLoader()}
                <Content contentContainerStyle={styles.flexGrow} style={{}} >
                    <ImageBackground source={require('../../assets/images/bg.png')} resizeMode={'cover'} style={styles.imageBackground}>
                        <View style={[styles.homeSection , {marginTop:20}]}>
                            <View style={styles.directionColumnCenter}>
                                <Image source={require('../../assets/images/logo.png')} style={[styles.wallet ]} resizeMode={'contain'} />

                                    <Form style={{ width: '100%' , marginTop:30}}>

                                        <KeyboardAvoidingView behavior={'padding'} style={styles.keyboardAvoid}>
                                            <Item style={styles.loginItem} bordered>
                                                <Label style={[styles.label ]}>{ i18n.t('title') }</Label>
                                                <Input value={this.state.username} placeholder={ i18n.t('title') } onBlur={() => this.unActiveInput('username')} onFocus={() => this.activeInput('username')} placeholderTextColor={COLORS.placeholderColor}
                                                       onChangeText={(username) => this.setState({username})} autoCapitalize='none'
                                                       style={[styles.input , {borderTopRightRadius:25  ,borderTopLeftRadius:25  ,
                                                           borderColor: this.state.usernameStatus === 1 ? COLORS.blue : COLORS.lightGray ,
                                                           backgroundColor: this.state.usernameStatus === 1 ? '#fff' : COLORS.lightGray }]}  />
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

                                            {this.renderSubmit()}
                                        </KeyboardAvoidingView>
                                    </Form>
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

export default connect(mapStateToProps, { userLogin , profile})(Complaints_client);





