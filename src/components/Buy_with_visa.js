import React, { Component } from "react";
import {View, Text, Image, ActivityIndicator, Dimensions, StyleSheet, ImageBackground} from "react-native";
import {Container, Content, Header, Button, Item, Footer, Form, FooterTab} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
import axios from "axios";
import CONST from "../consts/colors";
// import Spinner from "react-native-loading-spinner-overlay";
import {connect}         from "react-redux";
import {profile, userLogin} from "../actions";
// import {DoubleBounce} from "react-native-loader";
import HTML from "react-native-render-html";
import { WebView } from 'react-native-webview';


const height = Dimensions.get('window').height;

class Buy_with_visa extends Component {
    constructor(props){
        super(props);

        this.state=
            {
                who_are_we : '',
                isLoaded   : false
            }
    }

    static navigationOptions = () => ({
        drawerLabel:  i18n.t('Buy_with_visa')  ,
        drawerIcon: (<Image source={require('../../assets/images/noun_Info.png')} style={styles.drawerImg} resizeMode={'contain'} /> )
    });



    renderLoader(){
        if (this.state.isLoaded){
            return(
                <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' , alignSelf:'center' , backgroundColor: '#FFF' , width:'100%' , position:'absolute' , zIndex:99,top : 0, right : 0  }}>
                    <ActivityIndicator size="large" color={COLORS.red} />
                </View>
            );
        }
    }



    componentWillMount()
    {
        this.setState({ isLoaded: true });
        axios({
            method     : 'post',
            url        :  CONST.url + 'condition',
            data       :  {
                userType         :    this.props.user.userType,
            },
            headers    : {
                lang              :   (this.props.lang) ? this.props.lang : 'ar',
            }
        }).then(response => {

            this.setState({
                who_are_we  : response.data.data.who_are_we
            })

        }).catch(error => {

        }).then(()=>{
            this.setState({ isLoaded: false });
        });
    }
    render() {


        return (
            <Container>

                <Header style={[styles.header ,{marginBottom : 80}]} noShadow>
                    <View style={styles.directionRow}>
                    </View>
                    <Text style={[styles.headerText ]}>{i18n.t('Buy_with_visa')}</Text>
                    <View style={styles.directionRow}>
                    </View>
                </Header>
                <View style={style.container}>
                    <WebView
                        source= {{uri: 'https://cross.4hoste.com:30019/user/hyperPay/' + this.props.navigation.state.params.id}}
                        style= {style.loginWebView}
                        domStorageEnabled={true}
                        startInLoadingState={true}
                        javaScriptEnabled={true}

                    />
                </View>
                <Footer style={{backgroundColor:'#fff' , position: 'absolute' , bottom : 0 }}>
                    <FooterTab style={{backgroundColor:'#fff'}}>
                        <Button full onPress={ () => this.props.navigation.navigate("home_client" )} style={[styles.yellowBtn , styles.mt15, styles.mb10,{borderRadius:0}]}>
                            <Text style={styles.whiteText}>{ i18n.t('go_home') }</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>

        );
    }
}
const style = StyleSheet.create({
    container: {
        height:'50%',
        width:'100%',
        justifyContent: 'center',
        overflow: 'hidden'
    },
    loginWebView: {
        flex   : 1 ,
        width  : '100%'
    }});
const mapStateToProps = ({ auth,profile, lang  }) => {

    return {
        auth       : auth.user,
        lang       : lang.lang,
        user       : profile.user,
    };
};

export default connect(mapStateToProps, { userLogin , profile})(Buy_with_visa);


