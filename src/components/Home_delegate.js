import React, { Component } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    RefreshControl,
    BackHandler,
    Alert,
    FlatList,
    AsyncStorage, Vibration,ActivityIndicator
} from "react-native";
import {Container, Content, Header, Button, Toast} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
import * as Permissions from "expo-permissions";
import axios from "axios";
import CONST from "../consts/colors";
// import {DoubleBounce} from "react-native-loader";
import {connect}         from "react-redux";
import {profile, userLogin} from "../actions";
import {NavigationEvents} from "react-navigation";
import {Notifications} from "expo";
window.navigator.userAgent = 'react-native';
import SocketIOClient from 'socket.io-client';
const LATITUDE_DELTA    = 0.009;
const LONGITUDE_DELTA   = 0.009;
const LATITUDE          = 31.032315899999997;
const LONGITUDE         = 31.396537899999995;
import haversine from "haversine";
import {AnimatedRegion} from "react-native-maps";
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

const height = Dimensions.get('window').height;


class Home_delegate extends Component {
    constructor(props){
        super(props);

        this.state={
            orders                  : [],
            lat                     : null,
            long                    : null,
            is_notification         : 0,
            isLoaded                : true,
            refreshing              : false,
            watchID                 : '',
            latitude                : LATITUDE,
            longitude               : LONGITUDE,
            routeCoordinates        : [],
            distanceTravelled       : 0,
            prevLatLng      : {},
            coordinate      : new AnimatedRegion({
                latitude        : LATITUDE,
                longitude       : LONGITUDE,
                latitudeDelta   : 0,
                longitudeDelta  : 0
            }),

        };
        setInterval(()=> {
            this.check();
        }, 100000)

        this.socket = SocketIOClient('http://195.201.94.112:4333/', {jsonp: false});
    }



    componentWillUnmount() {
        this.backHandler.remove()
    }


    joinRoom(data){
        this.socket.emit('subscribe', { room: data.room });
        this.socket.emit('delegate_Updated', data);
    }



    getLocation() {

        Location.watchPositionAsync({
            enableHighAccuracy  : true,
            distanceInterval    : 20,
            timeInterval        : 5000
        },(position)=> {
           AsyncStorage.getItem('room',(err,data)=>{
                if(data){
                    this.joinRoom({
                        lat    : position.coords.latitude,
                        long   : position.coords.longitude,
                        room   : data
                    })
                }
            });
        });
    }

    async componentDidMount() {
        this.getLocation();
        this.backHandler                    = BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);


        //background
        const locations                     =   await Location.startLocationUpdatesAsync('update_delegate_location', {
            enableHighAccuracy              : true,
            distanceInterval                : 20,
            timeInterval                    : 5000,
            showsBackgroundLocationIndicator: false
        });
        if(locations)
        {
            AsyncStorage.getItem('room',(err,data)=>{
                if(data){
                    this.joinRoom({
                        lat    : locations.coords.latitude,
                        long   : locations.coords.longitude,
                        room   : data
                    })
                }
            });
        }
        //end_background


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
    static navigationOptions = () => ({
        drawerLabel: i18n.t('home') ,
        drawerIcon: (<Image source={require('../../assets/images/noun_home.png')} style={styles.drawerImg} resizeMode={'contain'} /> )
    });

    check(){
        if(this.props.auth !== null&&  this.state.lat &&  this.state.long){
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


    logout() {

        if(this.props.user)
        {
            axios({
                method: 'post',
                url: CONST.url + 'LogOut',
                data: {
                    device_ID: '000'
                },
                headers: {
                    lang: (this.props.lang) ? this.props.lang : 'ar',
                    user_id: this.props.user.user_id,
                }
            }).then(response => {

                if (response.data.status === '0') {
                    Toast.show({
                        text: response.data.message, duration: 2000,
                        type: "danger",
                        textStyle: {
                            color: "white", fontFamily: 'cairoBold', textAlign: 'center'
                        }
                    });
                } else {
                    this.props.navigation.navigate('user');
                    setTimeout(() => {
                        this.props.logout({token: this.props.auth.id});
                        this.props.tempAuth();
                    }, 1500)
                }

            }).catch(error => {

            }).then(() => {
                this.setState({isLoaded: false});
            });
        }else{
            this.props.navigation.navigate('user');
        }
    }

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
           // alert(i18n.t('open_gps'));
            this.setState({ isLoaded: false });
        } else {

            this.setState({
                orders   : [],
            });

            return await Location.getCurrentPositionAsync({
                enableHighAccuracy: false,
                maximumAge        : 15000
            }).then((position) => {
                this.setState({
                    lat           :       position.coords.longitude,
                    long          :       position.coords.latitude
                });

                if(this.state.lat !== null && this.state.long !== null)
                {
                    this.setState({ isLoaded: true });
                    axios({
                        method     : 'post',
                        url        :  CONST.url + 'getNearPlaces',
                        data       :  {
                            lat           :       position.coords.longitude,
                            long          :       position.coords.latitude
                        },
                        headers    : {
                            lang             :   ( this.props.lang ) ?  this.props.lang : 'ar',
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
                                orders   : response.data.data,
                            });

                            this.check()
                        }
                    }).catch(error => {

                    }).then(()=>{
                        this.setState({ isLoaded: false, refreshing: false });
                    });
                }else{
                    this.setState({ isLoaded: false , refreshing: false});
                   // alert(i18n.t('open_gps'));
                }
            });
        }
    };

    async componentWillMount(){
        Notifications.addListener(this.handleNotification.bind(this));
        this._getLocationAsync();
    }

    handleNotification(notification){

        if (notification.remote) {
            Vibration.vibrate();
            const notificationId = Notifications.presentLocalNotificationAsync({
                title: notification.data.title  ? notification.data.title : i18n.t('newNotification'),
                body: notification.data.body ? notification.data.body : i18n.t('newNotification'),
                ios: { _displayInForeground: true }
            });
        }

            if (notification && notification.origin !== 'received') {
                if (notification.data.key === 'nearOrder') {
                    this.props.navigation.navigate('home_delegate');
                }else if (notification.data.key === 'orderDelegate') {
                    this.props.navigation.navigate('orderDet_delegate',{
                        item_id : notification.data.item_id
                    })
                } else if(notification.data.key === 'delete' || notification.data.key === 'block'){
                    this.logout();
                }else {
                    this.props.navigation.navigate('notification_client')
                }
            }

            if (notification && notification.origin === 'received') {
                this.componentWillMount();
            }
    }

    onFocus(){
        this.componentWillMount();
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

    renderOrders = (item , key) => {
        return(

            <TouchableOpacity key={key} onPress={() => this.props.navigation.navigate('orderDet_delegate',{
                item_id : item.item_id
            })} style={[styles.notiBlock , {padding:7}]}>
                <Image source={{uri : item.place.imageProfile}} resizeMode={'cover'} style={styles.restImg}/>
                <View style={[styles.directionColumn , {flex:1}]}>
                    <View style={[styles.directionRow ]}>
                        <Text style={[styles.boldGrayText ]}>{item.place.placeName}</Text>
                    </View>
                    <View style={[styles.locationView]}>
                        <Text style={[styles.grayText , {fontSize:12} ]}>{item.time}</Text>
                    </View>
                </View>
                <View style={[styles.directionColumnCenter , { borderLeftWidth : 1 , borderLeftColor:'#f2f2f2' , paddingLeft:10}]}>
                    <View style={[styles.directionRow ]}>
                        <Text style={[styles.boldGrayText , {color:COLORS.blue} ]}>{ i18n.t('orderNum') }</Text>
                    </View>
                    <View style={[styles.locationView]}>
                        <Text style={[styles.grayText, {fontSize:12} ]}>{item.orderNumber}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    _onRefresh(){
        this.setState({refreshing: true});
        this.componentWillMount();
    }

    render() {

        return (
            <Container>

                <Header style={[styles.header ]} noShadow>
                    <Button onPress={() =>

                    {
                        if(this.props.auth)
                        {
                            if(this.state.lat === null || this.state.long === null) {
                             //   alert(i18n.t('open_gps'));
                            }else{
                                this.props.navigation.openDrawer()
                            }
                        }
                        else{ this.props.navigation.openDrawer()}}

                     } transparent style={styles.headerBtn}>
                        <Image source={require('../../assets/images/noun_menu.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                    </Button>

                    <Text style={[styles.headerText , {right:0} ]}>{ i18n.t('home') }</Text>

                    <Button onPress={() =>{
                        if(this.props.auth)
                        {
                            if(this.state.lat === null || this.state.long === null) {
                               // alert(i18n.t('open_gps'));
                            }else{
                                this.props.navigation.navigate('notification_client')
                            }
                        }
                        else{ this.props.navigation.navigate('user') }

                    } } transparent style={styles.headerBtn}>
                        {
                            (this.state.is_notification >  0)
                                ?
                                <Image source={require('../../assets/images/notification.png')} style={styles.headerMenu} resizeMode={'contain'} />
                                :
                                <Image source={require('../../assets/images/bell.png')} style={styles.headerMenu} resizeMode={'contain'} />
                        }
                        </Button>
                </Header>

                { this.renderLoader() }

                <Content contentContainerStyle={styles.flexGrow} style={{}} refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh.bind(this)}
                    />
                } >
                    <NavigationEvents onWillFocus={() => this.onFocus()} />

                    <View style={[styles.homeSection, {marginTop:20} ]}>
                        <FlatList
                            data={this.state.orders}
                            renderItem={({item}) => this.renderOrders(item)}
                            numColumns={1}
                            keyExtractor={this._keyExtractor}
                        />

                        {
                            (this.state.orders.length === 0 && this.state.isLoaded === false)
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
                    </View>
                </Content>
            </Container>

        );
    }
}


TaskManager.defineTask('update_delegate_location', ({ data, error }) => {

    if (error) {
        console.log(error);
        return;
    }
    if (data) {
        console.log(data)
    }
});


const mapStateToProps = ({ auth,profile, lang  }) => {

    return {

        auth     : auth.user,
        lang     : lang.lang,
        result   : auth.success,
        userId   : auth.user_id,
    };
};
export default connect(mapStateToProps, { userLogin ,profile})(Home_delegate);



