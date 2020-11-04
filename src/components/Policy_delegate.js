import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, Dimensions, ActivityIndicator, I18nManager, ImageBackground} from "react-native";
import {Container, Content, Header, Button, Item, Input, Form} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
import axios from "axios";
import CONST from "../consts/colors";
import {connect}         from "react-redux";
import {profile, userLogin} from "../actions";
// import {DoubleBounce} from "react-native-loader";
import HTML from "react-native-render-html";
import {NavigationEvents} from "react-navigation";


const height = Dimensions.get('window').height;

class Policy_delegate extends Component {
    constructor(props){
        super(props);

        this.state={
            isLoadeds : false,
            Terms_Conditions :''
        }
    }

    static navigationOptions = () => ({
        drawerLabel:  i18n.t('appPolicy')  ,
        drawerIcon: (<Image source={require('../../assets/images/noun_policy.png')} style={styles.drawerImg} resizeMode={'contain'} /> )
    })

    renderLoader(){
        if (this.state.isLoadeds){
            return(
                <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' , alignSelf:'center' , backgroundColor: '#FFF' , width:'100%' , position:'absolute' , zIndex:99,top : 0, right : 0  }}>
                    <ActivityIndicator size="large" color={COLORS.red} />
                </View>
            );
        }
    }


    componentWillMount()
    {
        this.setState({ isLoadeds: true });
        axios({
            method     : 'post',
            url        :  CONST.url + 'condition',
            data       :  {
                userType         :    'user',
            },
            headers    : {
                lang              :   (this.props.lang) ? this.props.lang : 'ar',
            }
        }).then(response => {

            this.setState({
                Terms_Conditions  : response.data.data.conditionLogin
            })

        }).catch(error => {

        }).then(()=>{
            this.setState({ isLoadeds: false });
        });
    }

    onFocus(){
        this.componentWillMount();
    }

    render() {


        return (
            <Container>

                <NavigationEvents onWillFocus={() => this.onFocus()} />

                <Header style={[styles.header ]} noShadow>


                    <Text style={[styles.headerText ,{right:-19}]}>{i18n.t('appPolicy')}</Text>

                    <View style={styles.directionRow}>

                        <Button onPress={() => this.props.navigation.goBack()} transparent  style={styles.headerBtn}>
                            <Image source={require('../../assets/images/arrow_left.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                        </Button>
                    </View>
                </Header>

                <Content contentContainerStyle={styles.flexGrow} style={{}} >
                    {this. renderLoader()}

                    <ImageBackground source={require('../../assets/images/bg.png')} resizeMode={'cover'} style={styles.imageBackground}>
                        <View style={[styles.homeSection , {marginTop:20}]}>

                            <View style={{flex: 1, flexDirection:'column'}}>
                                <View style={[{width: '90%'}]}>
                                    <HTML html={  this.state.Terms_Conditions }                           baseFontStyle={{fontSize              : 10,
                                        fontFamily            : 'cairo' , textAlign:'center' , color :   CONST.dark}}
                                          imagesMaxWidth={Dimensions.get('window').width} />
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

export default connect(mapStateToProps, { userLogin , profile})(Policy_delegate);




