import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, Dimensions, ScrollView, I18nManager, ImageBackground} from "react-native";
import {Container, Content, Header, Button, Item, Input, Form, Toast} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
import {connect}         from "react-redux";
import {profile, userLogin} from "../actions";
import axios from "axios";
import CONST from "../consts/colors";
import {NavigationEvents} from "react-navigation";
import { FancyAlert } from 'react-native-expo-fancy-alerts';


const height = Dimensions.get('window').height;

class Wallet_client extends Component {
    constructor(props){
        super(props);
         this.state={
            balance : '',
            showAlert: false
        }
    }

    showAlert = () => {
        this.setState({
            showAlert: true
        });
    };

    hideAlert = () => {
        this.setState({
            showAlert: false
        });
    };
    onFocus(){
        this.componentWillMount();
    }


    async componentWillMount()
    {
        axios({
            method     : 'post',
            url        :  CONST.url + 'getUserBalance',
            data       :  {

            },
            headers    : {
                lang             :   ( this.props.lang ) ?  this.props.lang : 'ar',
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
                console.log('response.data.data.amount ',response.data.data)
                this.setState({balance : response.data.data.amount})
            }

        }).catch(error => {

        }).then(()=>{
            this.setState({ isLoaded: false });
        });
    }
    static navigationOptions = () => ({
        drawerLabel:  i18n.t('wallet')  ,
        drawerIcon: (<Image source={require('../../assets/images/noun_account.png')} style={styles.drawerImg} resizeMode={'contain'} /> )
    });


    money_back(){
        axios({
            method     : 'post',
            url        :  CONST.url + 'returnMoney',
            data       :  {

            },
            headers    : {
                lang             :   ( this.props.lang ) ?  this.props.lang : 'ar',
                delegate_id      :   this.props.user.user_id,
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
                this.showAlert();

            }

        }).catch(error => {

        }).then(()=>{
            this.setState({ isLoaded: false });
        });
    }


    render() {
        const {showAlert} = this.state;

        return (
            <Container>
                <NavigationEvents onWillFocus={() => this.onFocus()} />

                <Header style={[styles.header ]} noShadow>
                    <View style={styles.directionRow}>
                        <Button onPress={() => this.props.navigation.openDrawer()} transparent style={styles.headerBtn}>
                            <Image source={require('../../assets/images/noun_menu.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                        </Button>

                    </View>

                    <Text style={[styles.headerText ]}>{i18n.t('wallet')}</Text>

                    <View style={styles.directionRow}>

                    </View>
                </Header>


                <Content contentContainerStyle={styles.flexGrow} style={{}} >


                    <FancyAlert
                        visible={showAlert}
                        icon={<View style={{
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: COLORS.blue,
                            borderRadius: 5,
                            width: '100%',
                        }}><Text>🤓</Text></View>}
                        style={{ backgroundColor: 'white' }}
                    >
                        <Text style={{ marginTop: -16, marginBottom: 32 , fontFamily : 'cairo' }}>{i18n.t('request_sent')}</Text>
                        <TouchableOpacity onPress={()=> {this.hideAlert()}}  style={[styles.grayBtn , styles.mt8, styles.mb10]}>
                            <Text style={styles.whiteText}>{i18n.t('confirm')}</Text>
                        </TouchableOpacity>
                    </FancyAlert>

                    <ImageBackground source={require('../../assets/images/bg.png')} resizeMode={'cover'} style={styles.imageBackground}>
                        <View style={[styles.homeSection , {marginTop:20}]}>
                            <View style={styles.directionColumnCenter}>
                                <Image source={require('../../assets/images/money.png')} style={[styles.wallet , styles.transform]} resizeMode={'contain'} />
                                <Text style={[styles.yellowText, styles.tAC , styles.mt25 ]}>{i18n.t('currentBalance')}</Text>
                                <View style={[styles.grayBack]}>
                                    <Text style={[styles.yellowText , {fontSize:25} ]}>{ this.state.balance }</Text>
                                </View>
                                <TouchableOpacity onPress={()=> {this.props.navigation.navigate('Recharge')}}  style={[styles.yellowBtn , styles.mt50, styles.mb10]}>
                                    <Text style={styles.whiteText}>{i18n.t('recharge')}</Text>
                                </TouchableOpacity>

                                {
                                    ( this.props.user && this.props.user.userType !== 'user')
                                    ?
                                        <TouchableOpacity onPress={()=> {this.money_back()}}  style={[styles.yellowBtn , styles.mt15, styles.mb10,{backgroundColor:COLORS.red}]}>
                                            <Text style={styles.whiteText}>{i18n.t('money_back')}</Text>
                                        </TouchableOpacity>
                                    :
                                    <View/>
                                }

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

export default connect(mapStateToProps, { userLogin , profile})(Wallet_client);



