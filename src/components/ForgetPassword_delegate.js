import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, Dimensions, ImageBackground, I18nManager , KeyboardAvoidingView} from "react-native";
import {Container, Content, Item, Input, Label, Form, Icon} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'


const height = Dimensions.get('window').height;

class ForgetPassword_delegate extends Component {
    constructor(props){
        super(props);

        this.state={
            phone: '',
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
                        <View>
                            <Image source={require('../../assets/images/headerlogin.png')} style={styles.headerbg} resizeMode={'cover'} />
                            <Image source={require('../../assets/images/logo.png')} style={styles.headerLogo} resizeMode={'contain'} />
                        </View>
                        <View style={styles.authMainView}>
                            <Text style={[styles.yellowText , styles.mb15]}>{ i18n.t('recoverPass') }</Text>
                            <Text style={[styles.grayText , styles.tAC]}>هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى</Text>

                            <KeyboardAvoidingView behavior={'padding'} style={styles.keyboardAvoid}>
                                <Form style={{ width: '100%' , marginTop:30}}>

                                    <Item style={styles.loginItem} bordered>
                                        <Label style={[styles.label ]}>{ i18n.t('phoneNumber') }</Label>
                                        <Input placeholder={ i18n.t('enterPhone') } placeholderTextColor={COLORS.placeholderColor} onChangeText={(phone) => this.setState({phone})} keyboardType={'number-pad'} style={styles.input}  />
                                    </Item>


                                    <TouchableOpacity onPress={ () => this.props.navigation.navigate("verifyCode_delegate" )} style={[styles.yellowBtn , styles.mt15, styles.mb10]}>
                                        <Text style={styles.whiteText}>{ i18n.t('confirm') }</Text>
                                    </TouchableOpacity>


                                </Form>
                            </KeyboardAvoidingView>
                        </View>
                    </ImageBackground>
                </Content>
            </Container>

        );
    }
}

export default ForgetPassword_delegate;