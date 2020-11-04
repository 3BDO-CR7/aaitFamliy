import React, { Component } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    I18nManager,
    ImageBackground,
    Animated, Platform, FlatList
} from "react-native";
import {Container, Content, Header, Button, Item, Input, Form, Toast, Icon} from 'native-base'
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
import {NavigationEvents} from "react-navigation";
import * as Animatable from "react-native-animatable";
import StarRating from "react-native-star-rating";


const height = Dimensions.get('window').height;

class FavoriteChef extends Component {
    constructor(props){
        super(props);

        this.state=
            {
                favorites   : [],
                isLoaded    : false
            }
    }

    static navigationOptions = () => ({
        drawerLabel:  i18n.t('nedChef'),
        drawerIcon: ( <Icon name='hearto' type='AntDesign' style={[ styles.textSize_18 ]} /> )
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
            url        :  CONST.url + 'getfavorites',
            data       :  {
            },
            headers    : {
                lang              :   (this.props.lang) ? this.props.lang : 'ar',
                user_id      :   this.props.user.user_id,
            }
        }).then(response => {

            this.setState({
                favorites  : response.data.data
            })

        }).catch(error => {

        }).then(()=>{
            this.setState({ isLoaded: false });
        });
    }

    onFocus(){
        this.componentWillMount();
    }

    clickFav(i, id){
        this.setState({isLoaded: true});
        axios({
            method     : 'post',
            url        :  CONST.url + 'favoritProviderUser',
            data       :  {
                secondId            :  id,
            },
            headers    : {
                lang                : ( this.props.lang ) ?  this.props.lang : 'ar',
                user_id      :   this.props.user.user_id,
            }
        }).then(response => {

            this.setState({
                isLoaded             : false,
            });

            if (response.data.data.isFav === 'true'){
                this.state.favorites.splice(i,1);
            }

            Toast.show({
                text            : response.data.message,
                duration        : 2000,
                type            : "danger",
                textStyle       : {
                    color           : "white",
                    fontFamily      : 'cairoBold',
                    textAlign       : 'center'
                }
            });
        });
    }


    render() {


        return (
            <Container>

                <NavigationEvents onWillFocus={() => this.onFocus()} />
                { this.renderLoader() }

                <Header style={[styles.header ]} noShadow>
                    <View style={styles.directionRow}>
                        <Button onPress={() => this.props.navigation.openDrawer()} transparent style={styles.headerBtn}>
                            <Image source={require('../../assets/images/noun_menu.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                        </Button>
                    </View>
                    <Text style={[styles.headerText , {right:0} ]}>{ i18n.t('nedChef') }</Text>
                    <View style={styles.directionRow}>
                        <View></View>
                        <Button onPress={() => this.props.navigation.goBack()} transparent  style={styles.headerBtn}>
                            <Image source={require('../../assets/images/arrow_left.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                        </Button>
                    </View>
                </Header>

                <Content contentContainerStyle={styles.flexGrow} style={{}} >


                        {
                            (this.state.favorites.length !== 0) ?
                                <View style={[ styles.rowGroup, styles.paddingVertical_15 ]}>

                                    {
                                        (this.state.favorites.map((fav,i)=>{
                                            return(
                                                <TouchableOpacity onPress={() => {this.props.navigation.navigate('restDet_client',{place_id :fav.place_id, type : 'restaurants_client'})}} style={[ styles.flex_50, styles.paddingHorizontal_10, styles.paddingVertical_10]}>
                                                    <View style={[ styles.position_R , styles.overHidden, styles.Radius_5, styles.border_gray, styles.Border ]}>
                                                        <Image source={{ uri : fav.imageProfile }} style={[styles.Width_100 , styles.height_150]} resizeMode={'cover'} />
                                                        <View style={[ styles.rowGroup, styles.position_A, styles.bottom_0, styles.right_0, styles.Width_100, styles.paddingVertical_5, styles.paddingHorizontal_10, styles.overlay_black ]}>
                                                            <View>
                                                                <Text style={[ styles.textSize_14, styles.textRegular, styles.text_White ]}>{ fav.PlaceName }</Text>
                                                            </View>
                                                            <View>
                                                                <Icon name='heart' type='FontAwesome' style={[ styles.textSize_16, styles.text_red ]} />
                                                            </View>
                                                            {/*<TouchableOpacity onPress={()=> {this.clickFav(i, fav.place_id)}}>*/}
                                                            {/*    <Icon name='heart' type='FontAwesome' style={[ styles.textSize_16, styles.text_red ]} />*/}
                                                            {/*</TouchableOpacity>*/}
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            );
                                        }))
                                    }

                                </View>
                                :
                                <View style={[ styles.flexGrow , styles.flexCenter ]}>
                                    <Image style={{resizeMode : 'contain' , width : 300 , height : 300  }} source={ require('../../assets/images/no_result.png') }/>
                                </View>
                        }

                </Content>
            </Container>

        );
    }
}

const mapStateToProps = ({ auth,profile, lang  }) => {

    return {
        auth       : auth.user,
        user       : profile.user,
        lang       : lang.lang,
    };
};

export default connect(mapStateToProps, { userLogin , profile})(FavoriteChef);


