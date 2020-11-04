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
import {Container, Content, Header, Button, Item, Input, Form, Label, Textarea} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'


const height = Dimensions.get('window').height;

class Complaints_delegate extends Component {
    constructor(props){
        super(props);

        this.state={
            username: '',
            msg: '',
            email: '',
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



    _linkPressed (url){
        Linking.openURL(url);
    }

    render() {


        return (
            <Container>

                <Header style={[styles.header ]} noShadow>
                    <Button onPress={() => this.props.navigation.openDrawer()} transparent style={styles.headerBtn}>
                        <Image source={require('../../assets/images/noun_menu.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                    </Button>

                    <Text style={[styles.headerText ,{right:-19}]}>{ i18n.t('complaints') }</Text>

                    <View style={styles.directionRow}>
                        <Button onPress={() => this.props.navigation.navigate('notification_delegate')} transparent style={styles.headerBtn}>
                            <Image source={require('../../assets/images/notification.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                        </Button>
                        <Button onPress={() => this.props.navigation.goBack()} transparent  style={styles.headerBtn}>
                            <Image source={require('../../assets/images/arrow_left.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                        </Button>
                    </View>
                </Header>

                <Content contentContainerStyle={styles.flexGrow} style={{}} >
                    <ImageBackground source={require('../../assets/images/bg.png')} resizeMode={'cover'} style={styles.imageBackground}>
                        <View style={[styles.homeSection , {marginTop:20}]}>
                            <View style={styles.directionColumnCenter}>
                                <Image source={require('../../assets/images/logo.png')} style={[styles.wallet ]} resizeMode={'contain'} />

                                    <Form style={{ width: '100%' , marginTop:30}}>

                                        <KeyboardAvoidingView behavior={'padding'} style={styles.keyboardAvoid}>
                                            <Item style={styles.loginItem} bordered>
                                                <Label style={[styles.label ]}>{ i18n.t('username') }</Label>
                                                <Input placeholder={ i18n.t('enterUsername') } onBlur={() => this.unActiveInput('username')} onFocus={() => this.activeInput('username')} placeholderTextColor={COLORS.placeholderColor}
                                                       onChangeText={(username) => this.setState({username})} autoCapitalize='none'
                                                       style={[styles.input , {borderTopRightRadius:25  ,borderTopLeftRadius:25  ,
                                                           borderColor: this.state.usernameStatus === 1 ? COLORS.blue : COLORS.lightGray ,
                                                           backgroundColor: this.state.usernameStatus === 1 ? '#fff' : COLORS.lightGray }]}  />
                                            </Item>


                                            <Item style={[styles.loginItem]} bordered>
                                                <Label style={[styles.label ]}>{ i18n.t('email') }</Label>
                                                <Input placeholder={ i18n.t('enterMail') } onBlur={() => this.unActiveInput('email')} onFocus={() => this.activeInput('email')} placeholderTextColor={COLORS.placeholderColor}
                                                       onChangeText={(email) => this.setState({email})} keyboardType={'email-address'}
                                                       style={[styles.input , {borderTopRightRadius:25 ,borderTopLeftRadius:25  ,
                                                           borderColor: this.state.emailStatus === 1 ? COLORS.blue : COLORS.lightGray ,
                                                           backgroundColor: this.state.emailStatus === 1 ? '#fff' : COLORS.lightGray }]}  />
                                            </Item>


                                            <Item style={styles.loginItem} bordered>
                                                <Label style={[styles.label ]}>{ i18n.t('msgSubject') }</Label>
                                                <Input placeholder={ i18n.t('enterMsgSubject') } onBlur={() => this.unActiveInput('msgSubject')} onFocus={() => this.activeInput('msgSubject')} placeholderTextColor={COLORS.placeholderColor}
                                                       onChangeText={(msgSubject) => this.setState({msgSubject})} autoCapitalize='none'
                                                       style={[styles.input , {borderTopRightRadius:25  ,borderTopLeftRadius:25  ,
                                                           borderColor: this.state.msgSubjectStatus === 1 ? COLORS.blue : COLORS.lightGray ,
                                                           backgroundColor: this.state.msgSubjectStatus === 1 ? '#fff' : COLORS.lightGray }]}  />
                                            </Item>


                                            <Item style={[styles.loginItem]} bordered>
                                                <Label style={[styles.label ]}>{ i18n.t('msg') }</Label>
                                                <Textarea onBlur={() => this.unActiveInput('msg')} onFocus={() => this.activeInput('msg')} placeholderTextColor={COLORS.placeholderColor}
                                                          onChangeText={(msg) => this.setState({msg})} autoCapitalize='none'
                                                          style={[styles.input , {borderTopRightRadius:25 ,borderTopLeftRadius:25  ,
                                                              borderColor: this.state.msgStatus === 1 ? COLORS.blue : COLORS.lightGray ,
                                                              backgroundColor: this.state.msgStatus === 1 ? '#fff' : COLORS.lightGray ,
                                                              height:120 , paddingVertical:10}]} placeholder={ i18n.t('typeMsg') } />
                                            </Item>

                                            <TouchableOpacity  style={[styles.yellowBtn , styles.mb10]}>
                                                <Text style={styles.whiteText}>{ i18n.t('sendButton') }</Text>
                                            </TouchableOpacity>
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

export default Complaints_delegate;
