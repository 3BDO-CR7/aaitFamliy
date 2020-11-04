import React, { Component } from "react";
import {
    View,
    Text,
    Image,
    Dimensions,
    ActivityIndicator,
    ImageBackground,
} from "react-native";
import {Container, Content, Header, Button, Radio, Toast} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
import { connect } from 'react-redux';
import { chooseLang } from '../actions';
import axios from "axios";
import CONST from "../consts/colors";


const height = Dimensions.get('window').height;

class Language_client extends Component {
    constructor(props){
        super(props);
        this.onChooseLang = this.onChooseLang.bind(this)

        this.state={
            lang: this.props.lang,
            isLoaded   : false,
        }
        console.log('this.props.lang', this.props.lang)
    }
    renderLoader(){
        if (this.state.isLoaded){
            return(
                <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' , alignSelf:'center' , backgroundColor: '#FFF' , width:'100%' , position:'absolute' , zIndex:1  }}>
                    <ActivityIndicator size="large" color={COLORS.red} />
                </View>
            );
        }
    }

    onChooseLang(lang) {

        if( this.props.user) {
            this.setState({ isLoaded: true });

            axios({
                method     : 'post',
                url        :  CONST.url + 'changeLanguage',
                data       :  {

                },
                headers    : {
                    lang             :    lang,
                    user_id          :    this.props.user.user_id  ,
                }
            }).then(response => {

                Toast.show({
                    text: response.data.message,
                    duration : 2000 ,
                    type : response.data.status === '1' ?  "success" : "danger",
                    textStyle: {
                        color: "white",
                        fontFamily : 'cairoBold' ,
                        textAlign:'center'
                    }
                });

                if(response.data.status === '1') {
                    this.props.chooseLang(lang);
                    // if (this.props.user.userType === "user") {
                    //     this.props.navigation.navigate('home_client');
                    // }else {
                    //     this.props.navigation.navigate('home_delegate');
                    // }
                }

            }).catch(error => {

            }).then(()=>{
                this.setState({ isLoaded: false });
            });
        }else{
           this.props.chooseLang(lang);
            // if (this.props.user.userType === "user") {
            //     this.props.navigation.navigate('home_client');
            // }else {
            //     this.props.navigation.navigate('home_delegate');
            // }
        }

    };


    static navigationOptions = () => ({
        drawerLabel:  i18n.t('appLang')  ,
        drawerIcon: (<Image source={require('../../assets/images/world.png')} style={styles.drawerImg} resizeMode={'contain'} /> )
    });


    render() {


        return (
            <Container>
                {this.renderLoader()}
                <Header style={[styles.header ]} noShadow>
                    <View style={styles.directionRow}>
                        <Button onPress={() => this.props.navigation.openDrawer()} transparent style={styles.headerBtn}>
                            <Image source={require('../../assets/images/noun_menu.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                        </Button>
                    </View>
                    <Text style={[styles.headerText ]}>{i18n.t('appLang')}</Text>
                    <View style={styles.directionRow}/>
                </Header>

                <Content contentContainerStyle={styles.flexGrow} style={{}} >
                    <ImageBackground source={require('../../assets/images/bg.png')} resizeMode={'cover'} style={styles.imageBackground}>
                        <View style={[styles.backTitle, {marginTop:20}]}>
                            <Text style={[styles.titleText , styles.asfs]}>{i18n.t('chooseLang')}</Text>
                        </View>
                        <View style={[styles.homeSection, {marginTop:20} ]}>

                            <View style={[styles.directionRow , styles.mb15]}>
                                <Radio onPress={() => this.onChooseLang('ar')} color={'#575757'} selectedColor={COLORS.blue} selected={this.state.lang === 'ar' ? true : false} />
                                <Text onPress={() => this.onChooseLang('ar')} style={[styles.titleText , styles.ml10 ]}>العربية</Text>
                            </View>

                            <View style={styles.directionRow}>
                                <Radio onPress={() => this.onChooseLang('en')} color={'#575757'} selectedColor={COLORS.blue} selected={this.state.lang === 'en' ? true : false} />
                                <Text onPress={() => this.onChooseLang('en')} style={[styles.titleText , styles.ml10 ]}>English</Text>
                            </View>

                        </View>
                    </ImageBackground>
                </Content>
            </Container>

        );
    }
}
const mapStateToProps = ({ auth, profile, lang }) => {
    return {
        auth: auth.user,
        user: profile.user,
        lang: lang.lang
    };
};

export default connect(mapStateToProps, { chooseLang })(Language_client);


