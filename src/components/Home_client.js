import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, Dimensions,BackHandler, ActivityIndicator, I18nManager,Alert, Platform, Vibration} from "react-native";
import {Container, Content, Header, Button, Input, Toast, Icon, Item} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
import Swiper from 'react-native-swiper';
import {DrawerActions, NavigationActions, NavigationEvents} from 'react-navigation'

import {connect}         from "react-redux";
import { userLogin , profile} from "../actions";
import axios from "axios";
import CONST from "../consts/colors";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import * as Animatable from 'react-native-animatable';
import StarRating from "react-native-star-rating";

const height = Dimensions.get('window').height;

class Home_client extends Component {
    constructor(props){
        super(props);

        this.state =
            {
                isLoaded        : false,
                sliders         : [],
                categories      : [],
                cart_count      : 0,
                lat             : null,
                long            : null,
                is_notification : 0,
                id              : 0,
                show            : true,
                page : 1,
                nameSearch      : ''
            };

            setInterval(()=> {
                this.check();
            }, 100000);

         Animatable.createAnimatableComponent(Home_client);
    }

    componentWillUnmount() {
        this.backHandler.remove()
    }

    handleBackButton = () => {
        Alert.alert(
            i18n.t('need_back'),
            i18n.t('will_need_back'),
            [
                {
                    text:  i18n.t('no') ,
                    onPress: () => console.log("Yes, discard changes"),
                    style: "cancel"
                },
                {
                    text:  i18n.t('yes') ,
                    onPress: () =>  {
                        BackHandler.exitApp();
                        return true;
                    }
                }
            ],
            { cancelable: false }
        );
        return true;
    };

    async componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        Notifications.addListener(this.handleNotification.bind(this));
    }

    handleNotification(notification) {

        if (notification.remote) {
            Vibration.vibrate();
            const notificationId = Notifications.presentLocalNotificationAsync({
                title: notification.data.title  ? notification.data.title : i18n.t('newNotification'),
                body: notification.data.body ? notification.data.body : i18n.t('newNotification'),
                ios: { _displayInForeground: true }
            });
        }

        if (notification && notification.origin !== 'received') {
            if (notification.data.key === 'price') {
                this.props.navigation.navigate('showPrice_client', {
                    item_id: notification.data.item_id
                });
            }else if (notification.data.key === 'orderUser') {
                this.props.navigation.navigate('followOrder_client' ,{
                    place_id : null,
                    item_id  : notification.data.item_id
                });
            } else {
                this.props.navigation.navigate('notification_client')
            }

        } else if (notification && notification.origin === 'received') {
            if (notification.data.key === 'price') {
                this.props.navigation.navigate('showPrice_client', {
                    item_id: notification.data.item_id
                });
            } else {

            }
        } else {

        }
    }

    static navigationOptions = () => ({
        drawerLabel: i18n.t('home') ,
        drawerIcon: (<Image source={require('../../assets/images/noun_home.png')} style={styles.drawerImg} resizeMode={'contain'} /> )
    });

    _getLocationAsync = async () => {
        this.setState({ isLoaded: true });
        let {status} = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            Toast.show({
                text        : 'Permission to access location was denied',
                duration    : 4000,
                type        : 'danger',
                textStyle   : {color: "white", textAlign: 'center'}
            });
            this.setState({ isLoaded: false });
        } else {

            return await Location.getCurrentPositionAsync({
                enableHighAccuracy: false,
                maximumAge        : 15000
            }).then((position) => {
                this.setState({
                    lat           :       position.coords.longitude,
                    long          :       position.coords.latitude
                });
                this.setState({ isLoaded: true });
                axios({
                    method     : 'post',
                    url        :  CONST.url + 'homeScreen',
                    data       :  {
                        lat             : position.coords.longitude,
                        long            : position.coords.latitude,
                        page            : this.state.page
                    },
                    headers    : {
                        lang             :  ( this.props.lang ) ?  this.props.lang : 'ar',
                        user_id          :  this.props.auth ? this.props.auth.data.user_id : '',
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
                        this.setState({
                            sliders      : response.data.data.dataAdvertise,
                            categories   : response.data.data.placeData,
                            show         : response.data.show,
                            page         : this.state.page + 1
                        });

                         this.check();

                    }

                }).catch(error => {
                    this.setState({ isLoaded: false });

                }).then(()=>{
                    this.setState({ isLoaded: false });
                });
            });
        }
    };

    check(){
        if(this.props.auth !== null &&  this.state.lat &&  this.state.long){
            axios({
                method     : 'post',
                url        :  CONST.url + 'UserSetting',
                data       :  {
                    lat              :             this.state.lat,
                    long             :             this.state.long
                },
                headers    : {
                    lang             :            ( this.props.lang ) ?  this.props.lang : 'ar',
                    user_id          :             this.props.auth.data.user_id,


                }
            }).then(response => {

                if(response.data.status === '0')
                {

                }else{

                    if( response.data.data.authentication !== 'autenticated'){
                        this.logout();
                    }else {
                        this.setState({
                            cart_count            :  response.data.data.binsOrderNumber,
                        });
                        this.setState({
                            is_notification       :  response.data.data.notificationNumber
                        });
                    }

                }
            })
        }
    }

    async componentWillMount() {
        this._getLocationAsync();
        this.props.navigation.closeDrawer();
        this.setState({ page : 1 });
    }

    logout(){

        axios({
            method     : 'post',
            url        :  CONST.url + 'LogOut',
            data       :  {
                device_ID : '000'
            },
            headers    : {
                lang             :    (this.props.lang) ? this.props.lang : 'ar',
                user_id          :    this.props.user.user_id  ,
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
                this.props.navigation.navigate('user');
                setTimeout(()=>{
                    this.props.logout({ token: this.props.auth.id });
                    this.props.tempAuth();
                },1500)
            }

        }).catch(error => {

        }).then(()=>{
            this.setState({ isLoaded: false });
        });

    }

    onFocus(){
        this.componentWillMount()
    }

    renderLoader(){
        if (this.state.isLoaded){
            return(
                <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' , alignSelf:'center' , backgroundColor: '#FFF' , width:'100%' , position:'absolute' , zIndex:99,top : 0, right : 0  }}>
                    <ActivityIndicator size="large" color={COLORS.red} />
                </View>
            );
        }
    }

    handleKeyUp(keyword) {
        setTimeout(()=>{
            axios({
                method     : 'post',
                url        :  CONST.url + 'searchHome',
                data       :  {
                    search : keyword,
                    lat           :       this.state.lat,
                    long          :       this.state.long
                },
                headers    : {
                    lang         :     ( this.props.lang ) ?  this.props.lang : 'ar',
                }
            }).then( (response)=> {

                Toast.show({
                    text: response.data.message,
                    duration : 2000 ,
                    type : response.data.status === '1' ? 'success' : 'danger',
                    textStyle: {
                        color: "white",
                        fontFamily : 'cairoBold' ,
                        textAlign:'center'
                    }
                });

                this.setState({
                    nameSearch : '',
                    categories : response.data.data
                });


            }).catch( (error)=> {
                this.setState({spinner: false});
            }).then(()=> {
                this.setState({spinner: false});
            });
        },500)
    }

    // search() {
    //
    //     if(this.state.nameSearch !== '') {
    //
    //         axios({
    //             method     : 'post',
    //             url        :  CONST.url + 'searchHome',
    //             data       :  {
    //                 search : this.state.nameSearch,
    //                 lat           :       this.state.lat,
    //                 long          :       this.state.long
    //             },
    //             headers    : {
    //                 lang         :     ( this.props.lang ) ?  this.props.lang : 'ar',
    //             }
    //         }).then(response => {
    //
    //             Toast.show({
    //                 text: response.data.message,
    //                 duration : 2000 ,
    //                 type : response.data.status === '1' ? 'success' : 'danger',
    //                 textStyle: {
    //                     color: "white",
    //                     fontFamily : 'cairoBold' ,
    //                     textAlign:'center'
    //                 }
    //             });
    //
    //             this.setState({
    //                 nameSearch : '',
    //                 categories : response.data.data
    //             });
    //
    //         }).catch(error => {console.log(error)})
    //
    //     }else{
    //
    //         Toast.show({
    //             text: i18n.t('nameSearch'),
    //             duration : 2000 ,
    //             type :"danger",
    //             textStyle: {
    //                 color: "white",
    //                 fontFamily : 'cairoBold' ,
    //                 textAlign:'center'
    //             }
    //         });
    //
    //     }
    //
    //
    // }

    render() {
        return (
            <Container>
                <Header style={[styles.header ]} noShadow>
                    <View style={styles.directionRow}>
                        <Button onPress={() => {
                            if(this.state.lat === null || this.state.long === null)
                            {
                                alert(i18n.t('open_gps'));
                            }else{
                                this.props.navigation.openDrawer()
                            }
                        }} transparent style={styles.headerBtn}>
                            <Image source={require('../../assets/images/noun_menu.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                        </Button>
                        <Button onPress={() => {
                            if(this.props.auth   !== null && this.props.auth  !== undefined)
                            {
                                if(this.state.lat === null || this.state.long === null) {
                                    alert(i18n.t('open_gps'));
                                }else{
                                    this.props.navigation.navigate('notification_client')
                                }
                            }else{
                                this.props.navigation.navigate('user')
                            }
                        }} transparent style={styles.headerBtn}>
                            {
                                (this.state.is_notification >  0)
                                    ?
                                    <Image source={require('../../assets/images/notification.png')} style={styles.headerMenu} resizeMode={'contain'} />
                                    :
                                    <Image source={require('../../assets/images/bell.png')} style={styles.headerMenu} resizeMode={'contain'} />
                            }
                            </Button>
                    </View>
                    <Text style={[styles.headerText ]}>{ i18n.t('home') }</Text>
                    <View style={styles.directionRow}>
                                <Button onPress={() => {

                                    if(this.props.auth  !== null &&  this.props.auth  !== undefined)
                                    {
                                        if(this.state.lat === null || this.state.long === null) {
                                            alert(i18n.t('open_gps'));
                                        }else{
                                            this.props.navigation.navigate('cart_client')
                                        }
                                    }
                                    else{  this.props.navigation.navigate('user')}
                                }} transparent  style={styles.headerBtn}>
                                    <Image source={require('../../assets/images/shopping_basket.png')} style={styles.headerMenu} resizeMode={'contain'} />
                                </Button>
                        <View style={styles.cartNum}>
                            <Text style={styles.cartNumText}>{ this.state.cart_count }</Text>
                        </View>
                    </View>
                </Header>
                <Content contentContainerStyle={styles.flexGrow} style={{}} >
                    {this. renderLoader()}
                    {/*<View style={styles.topHead}/>*/}

                    {
                        (this.state.lat === null && this.state.isLoaded === false)
                            ?
                            <View style={{flex : 1, alignSelf:  'center', marginVertical: 30  , width : '100%'}}>
                                <Image style={{resizeMode : 'contain' , width : 300 , height : 300  }} source={ require('../../assets/images/no_result.png') }/>

                                <TouchableOpacity onPress={ () => this._getLocationAsync()} style={[styles.yellowBtn , styles.mt15, styles.mb10 , {width:'90%' , alignSelf: 'center'}]}>
                                    <Text style={styles.whiteText}>{i18n.t('is_open_gps')}</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            <View/>
                    }
                    <NavigationEvents onWillFocus={() => this.onFocus()} />
                    <View style={[ styles.eventswiper, styles.top_25, styles.flexCenter,{ width : '90%' } ]}>
                        <Swiper     key={this.state.sliders.length}
                                    dotStyle={styles.eventdoteStyle} activeDotStyle={styles.eventactiveDot}
                                    containerStyle={{}} showsButtons={false} autoplay={true}>

                            {
                                this.state.sliders.map((slider , key)=> {
                                    return(
                                        <View  key={key} style={[styles.swiperimageEvent, {width: '100%',}]}>
                                            <Image source={{uri : slider.image}} style={styles.swiperimage} resizeMode={'cover'}/>
                                        </View>
                                    );
                                })
                            }
                        </Swiper>
                     </View>

                    <View style={[ styles.flexCenter, styles.bg_White, styles.paddingVertical_10, styles.Width_100 ]}>
                        <View style={[ styles.Width_90]}>
                            <Item>
                                <Input
                                    autoCapitalize='none'
                                    // onChangeText={(nameSearch) => this.setState({nameSearch})}
                                    onChangeText={(keyword)=> this.handleKeyUp(keyword)}
                                    // value={this.state.nameSearch}
                                    placeholder={ i18n.t('search') }
                                    placeholderTextColor={'#929292'}
                                    style={[ styles.Border, styles.border_gray, styles.height_50, styles.Radius_10, styles.text_gray, styles.textRegular, {writingDirection    : I18nManager.isRTL ? 'rtl' : 'ltr'} ]}
                                />
                            </Item>
                            {/*<TouchableOpacity onPress={ () => this.search()} style={[ { width : 25, height : 25 }, styles.position_A, styles.right_15, styles.flexCenter, styles.top_15 ]}>*/}
                            {/*    <Icon name={'search1'} type='AntDesign' style={[ styles.textSize_16, styles.marginHorizontal_5, styles.text_gray  ]} />*/}
                            {/*</TouchableOpacity>*/}
                        </View>
                    </View>

                    <View style={[styles.homeSection, {marginTop:10,}]}>
                        {
                            this.state.categories.length === 0 ?
                                <View style={[ styles.flexCenter, styles.Width_100, { marginTop : 100 } ]}>
                                    <Image source={require('../../assets/images/no_result.png')} style={[styles.width_150, styles.height_150 ]} resizeMode={'contain'} />
                                    {/*<Text style={[ styles.text_red, styles.textCenter, styles.textRegular, styles.textSize_18]}>*/}
                                    {/*    { i18n.t('ength') }*/}
                                    {/*</Text>*/}
                                </View>
                                :
                                <View/>
                        }
                        {
                            (this.state.categories.map((category,key)=>{
                                return(
                                    <View style={[ styles.overHidden ]}>
                                        <Animatable.View animation={(key % 2 === 0 ) ? 'fadeInUp' : 'fadeInUp'} duration={2000} iterationCount={1}>
                                            <TouchableOpacity
                                                onPress={() => {this.props.navigation.navigate('restDet_client',{place_id :category.place_id, type : 'restaurants_client'})}} style={[styles.notiBlock , {padding:7}]}>
                                                <Image source={{uri : category.imageProfile}} resizeMode={'cover'} style={styles.restImg}/>
                                                <View style={[styles.directionColumn , {flex:1}]}>
                                                    <View style={[styles.directionRowSpace ]}>
                                                        <Text style={[styles.boldGrayText ]}>{category.PlaceName}</Text>
                                                        <StarRating
                                                            disabled={true}
                                                            maxStars={5}
                                                            rating={category.rating}
                                                            fullStarColor={COLORS.yellow}
                                                            starSize={13}
                                                            starStyle={styles.starStyle}
                                                        />
                                                    </View>
                                                    <View style={[styles.Width_100]}>
                                                        <Text style={[styles.grayText , {writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',fontSize:12} ]}>
                                                            {category.distance}
                                                        </Text>
                                                    </View>
                                                    <View style={[ styles.directionRowSpace ]}>
                                                        <View style={[styles.locationView, {marginTop:0}]}>
                                                            <Image source={require('../../assets/images/maps.png')} style={[styles.locationImg]} resizeMode={'contain'} />
                                                            <Text style={[styles.grayText , {writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',fontSize:12} ]}>{category.address}</Text>
                                                        </View>
                                                        <View style={[styles.locationView]}>
                                                            <Icon name={category.isFav === 'true' ? 'heart' : 'heart-o'} type='FontAwesome' style={[ styles.textSize_16, styles.marginHorizontal_5, { color : category.isFav === 'true' ? '#F00' : '#DDD' }  ]} />
                                                            {/*{*/}
                                                            {/*    (category.isFav === true) ?*/}
                                                            {/*        <Icon name='heart' type='FontAwesome' style={[ styles.textSize_16, styles.text_red, styles.marginHorizontal_5 ]} />*/}
                                                            {/*        :*/}
                                                            {/*        <Icon name='heart-o' type='FontAwesome' style={[ styles.textSize_16, styles.text_gray, styles.marginHorizontal_5 ]} />*/}
                                                            {/*}*/}
                                                            <Text style={[styles.grayText , {writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',fontSize:12} ]}>{category.numLike}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </Animatable.View>
                                    </View>
                                );
                            }))
                        }
                    </View>

                </Content>
            </Container>

        );
    }
}
const mapStateToProps = ({ auth,profile, lang  }) => {

    return {

        auth     : auth.user,
        lang     : lang.lang,
        result   : auth.success,
        userId   : auth.user_id,
    };
};
export default connect(mapStateToProps, { userLogin ,profile})(Home_client);




