import React, { Component } from "react";
import {View, Text, Image, ActivityIndicator, Dimensions, ImageBackground} from "react-native";
import {Container, Content, Header, Button } from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
import axios from "axios";
import CONST from "../consts/colors";
import {connect}         from "react-redux";
import {profile, userLogin} from "../actions";
import HTML from "react-native-render-html";
import {NavigationEvents} from "react-navigation";
class AboutApp_client extends Component {
    constructor(props){
        super(props);

        this.state=
            {
                who_are_we : '',
                isLoaded   : false
            }
    }

    static navigationOptions = () => ({
        drawerLabel:  i18n.t('aboutApp')  ,
        drawerIcon: (<Image source={require('../../assets/images/noun_Info.png')} style={styles.drawerImg} resizeMode={'contain'} /> )
    })


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

    onFocus(){
        this.componentWillMount();
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
                    <Text style={[styles.headerText ]}>{i18n.t('aboutApp')}</Text>
                    <View style={styles.directionRow}></View>
                </Header>
                { this.renderLoader() }
                <Content contentContainerStyle={styles.flexGrow} style={{}} >
                    <ImageBackground source={require('../../assets/images/bg.png')} resizeMode={'cover'} style={styles.imageBackground}>
                        <View style={[styles.homeSection , {marginTop:20}]}>
                            <View style={styles.directionColumnCenter}>
                                <Image source={require('../../assets/images/logo.png')} style={[styles.wallet ]} resizeMode={'contain'} />


                                <View style={{flex: 1, flexDirection:'column'}}>
                                    <View style={[{width: '90%'}]}>
                                        <HTML html={  this.state.who_are_we }                           baseFontStyle={{fontSize              : 10,
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

export default connect(mapStateToProps, { userLogin , profile})(AboutApp_client);


