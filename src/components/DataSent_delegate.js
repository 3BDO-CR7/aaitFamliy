import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, Dimensions, ImageBackground, ActivityIndicator , KeyboardAvoidingView} from "react-native";
import {Container, Content, Item, Input, Label, Form, Icon} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'


const height = Dimensions.get('window').height;

class DataSent_delegate extends Component {
    constructor(props){
        super(props);

        this.state={
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
                            <Text style={[styles.yellowText, styles.tAC , styles.mb15]}>{ i18n.t('dataSent') }</Text>
                            <TouchableOpacity onPress={ () => this.props.navigation.navigate("login_delegate" )} style={[styles.yellowBtn , styles.mt50, styles.mb100]}>
                                <Text style={styles.whiteText}>{ i18n.t('back') }</Text>
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                </Content>
            </Container>

        );
    }
}

export default DataSent_delegate;
