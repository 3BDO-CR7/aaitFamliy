import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, Dimensions, ActivityIndicator, I18nManager, ImageBackground} from "react-native";
import {Container, Content, Header, Button, Item, Input, Form} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
import {connect}         from "react-redux";
import {profile, userLogin} from "../actions";
import axios from "axios";
import CONST from "../consts/colors";
// import Spinner from "react-native-loading-spinner-overlay";
// import {DoubleBounce} from "react-native-loader";
import HTML from "react-native-render-html";
import {NavigationEvents} from "react-navigation";


const height = Dimensions.get('window').height;

class Policy_client extends Component {
    constructor(props){
        super(props);

        this.state={
            Terms_Conditions: '',
            isLoadeds       : false
        }
    }

    static navigationOptions = () => ({
        drawerLabel:  i18n.t('appPolicy'),
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
                userType         :    (this.props.user) ? this.props.user.userType : 'user',
            },
            headers    : {
                lang              :   (this.props.lang) ? this.props.lang : 'ar',
            }
        }).then(response => {

            this.setState({
                Terms_Conditions  : response.data.data.Terms_Conditions
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
                {
                    this.renderLoader()
                }
                <NavigationEvents onWillFocus={() => this.onFocus()} />
                <Header style={[styles.header ]} noShadow>
                    <View style={styles.directionRow}>
                        <Button onPress={() => this.props.navigation.openDrawer()} transparent style={styles.headerBtn}>
                            <Image source={require('../../assets/images/noun_menu.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                        </Button>

                    </View>

                    <Text style={[styles.headerText ]}>{i18n.t('appPolicy')}</Text>

                    <View style={styles.directionRow}>

                    </View>
                </Header>

                <Content contentContainerStyle={styles.flexGrow} style={{}} >
                    <ImageBackground source={require('../../assets/images/bg.png')} resizeMode={'cover'} style={styles.imageBackground}>
                        <View style={[styles.homeSection , {marginTop:20}]}>
                            <View style={styles.directionColumnCenter}>
                                <Image source={require('../../assets/images/logo.png')} style={[styles.wallet ]} resizeMode={'contain'} />

                                <View style={{flex: 1, flexDirection:'column'}}>
                                    <View style={[{width: '90%'}]}>
                                        <HTML html={  this.state.Terms_Conditions }                           baseFontStyle={{fontSize              : 10,
                                            fontFamily            : 'cairo' , textAlign:'center' , color :   CONST.dark}}
                                              imagesMaxWidth={Dimensions.get('window').width} />
                                    </View>
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

export default connect(mapStateToProps, { userLogin , profile})(Policy_client);



