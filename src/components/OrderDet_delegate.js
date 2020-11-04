import React, { Component } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
    Linking,
    AsyncStorage,
} from "react-native";
import {Container, Content, Header, Button, Item, Input, Form, Accordion, Icon, Toast} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
import Communications from 'react-native-communications';
// import {DoubleBounce} from "react-native-loader";
import axios from "axios";
import CONST from "../consts/colors";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import {NavigationEvents} from "react-navigation";
import {connect}         from "react-redux";
import {profile, userLogin} from "../actions";
import * as Notifications from 'expo-notifications';


const height = Dimensions.get('window').height;

const clientArray = [
    { title: i18n.t('customerInfo')},
];
class OrderDet_delegate extends Component {
    constructor(props){
        super(props);

        this.state={
            anotherDetails  : false,
            orderDetails    : '',
            lat             :  null,
            long            :  null,
            order           :  '' ,
            place           :  '',
            LocationName    :  '',
            latitude        :  '',
            isLoaded      : false,
            longitude       :  '',
            user            :  '',
            kindBuy         :  null,
            address         :  null,
            orderStatus     :  null,
            products        :  null,
            orderStatus2    :  null,
            keyDelegate     :  null,
            delegate        :  null,
        }
    }


    async componentWillMount(){
        Notifications.addListener(this.handleNotification.bind(this));
      setTimeout(()=>{
          this._getLocationAsync();
      },2000)
    }
    onFocus(){
        this.componentWillMount();
    }


    handleNotification(notification){
        if (notification && notification.origin !== 'received') {

        }else{
            this.componentWillMount();
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
                    url        :  CONST.url + 'detailsOrderDelegate',
                    data       :  {
                        item_id           :       this.props.navigation.state.params.item_id,
                        lat               :       position.coords.longitude,
                        long              :       position.coords.latitude
                    },
                    headers    : {
                        lang              :      ( this.props.lang ) ?  this.props.lang : 'ar',
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
                        console.log( response.data.data )
                         this.setState({
                             order              :   response.data.data ,
                             place              :   response.data.data.place,
                             user               :   response.data.data.user,
                             kindBuy            :   response.data.data.kindBuy,
                             address            :   response.data.data.address.address.substr(1,35),
                             products           :   response.data.data.products,
                             latitude          :   response.data.data.address.lat,
                             longitude         :   response.data.data.address.long,
                             LocationName      :   response.data.data.LocationName
                        });
                    }

                }).catch(error => {
                }).then(()=>{
                    this.setState({ isLoaded: false });
                });
            });
        }
    };



    acceptOrder () {

               AsyncStorage.setItem('room', this.props.navigation.state.params.item_id);
                this.setState({ isLoaded: true });
                axios({
                    method     : 'post',
                    url        :  CONST.url + 'acceptOrder',
                    data       :  {
                        item_id           :       this.props.navigation.state.params.item_id,
                    },
                    headers    : {
                        lang              :      ( this.props.lang ) ?  this.props.lang : 'ar',
                        delegate_id       :      this.props.auth.data.user_id
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
                       this.props.navigation.navigate('myOrders_delegate');
                    }

                }).catch(error => {
                }).then(()=>{
                    this.setState({ isLoaded: false });
             });
    };


    renderLoader(){
        if (this.state.isLoaded){
            return(
                <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' , alignSelf:'center' , backgroundColor: '#FFF' , width:'100%' , position:'absolute' , zIndex:99,top : 0, right : 0  }}>
                    <ActivityIndicator size="large" color={COLORS.red} />
                </View>
            );
        }
    }




    static navigationOptions = () => ({
        drawerLabel: () => null,
    });


    _renderClientHeader(item, expanded) {
        return (
            <View style={[styles.backTitle,styles.directionRowSpace]}>
                <Text style={[styles.yellowText , {color:expanded ? COLORS.blue:'#575757',fontSize:15}]}>{item.title}</Text>
                {expanded
                    ? <Icon style={[styles.arrowIcon , {color:COLORS.blue}]} type={'Ionicons'} name="md-arrow-dropup" />
                    : <Icon style={styles.arrowIcon} type={'Ionicons'} name="md-arrow-dropdown" />}
            </View>
        );
    }
    _renderClientContent(item) {
        return (
            <View style={{paddingHorizontal:30}}>
                <Text style={[styles.check ,styles.mt15,  styles.asfs , styles.mb15 , {fontSize: 13}]}>{i18n.t('customerName')}</Text>
                <View style={[styles.backTitle , styles.mb15]}>
                    <Text style={[styles.check,  styles.asfs , {fontSize:13}]}>{this.state.user.placeName}</Text>
                </View>
                <Text style={[styles.check,  styles.asfs , styles.mb15 , {fontSize: 13}]}>{i18n.t('phoneNumber')}</Text>
                <View style={styles.directionRowSpace}>
                    <View style={[styles.backTitle , {width:'79%'}]}>
                        <Text style={[styles.check , {fontSize:13 , alignSelf:'flex-start'}]}>{this.state.user.phoneNo}</Text>
                    </View>
                    <TouchableOpacity onPress={() => Communications.phonecall(this.state.user.phoneNo, true)} style={[styles.callBtn]}>
                        <Text style={styles.whiteText}>{i18n.t('call')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
    render() {


        return (
            <Container>


                <Header style={[styles.header ]} noShadow>
                    <Button onPress={() => this.props.navigation.openDrawer()} transparent style={styles.headerBtn}>
                        <Image source={require('../../assets/images/noun_menu.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                    </Button>

                    <Text style={[styles.headerText , {right:-19} ]}>{i18n.t('orderDet')}</Text>

                    <View style={styles.directionRow}>
                        <Button onPress={() => this.props.navigation.navigate('notification_delegate')} transparent style={styles.headerBtn}>
                        </Button>
                        <Button onPress={() => this.props.navigation.navigate('home_delegate')} transparent  style={styles.headerBtn}>
                            <Image source={require('../../assets/images/arrow_left.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                        </Button>
                    </View>
                </Header>
                <NavigationEvents onWillFocus={() => this.onFocus()} />

                {this.renderLoader()}

                <Content contentContainerStyle={styles.flexGrow} style={{}} >
                    <View style={[styles.w100 , styles.mt15 , {flex:1}]}>
                        <View style={[styles.notiBlock , {padding:7 , marginBottom:15 , marginHorizontal:23}]}>
                            <Image source={{ uri : this.state.place.imageProfile}} resizeMode={'cover'} style={styles.restImg}/>
                            <View style={[styles.directionColumn , {flex:1}]}>
                                <View style={[styles.directionRow ]}>
                                    <Text style={[styles.boldGrayText ]}>{ this.state.place.placeName }</Text>
                                </View>
                                <View style={[styles.locationView]}>
                                    <Text style={[styles.grayText , {fontSize:12} ]}>{ this.state.order.time}</Text>
                                </View>
                            </View>
                            <View style={[styles.directionColumnCenter , { borderLeftWidth : 1 , borderLeftColor:'#f2f2f2' , paddingLeft:10}]}>
                                <View style={[styles.directionRow ]}>
                                    <Text style={[styles.boldGrayText , {color:COLORS.blue} ]}>{i18n.t('orderNum')}</Text>
                                </View>
                                <View style={[styles.locationView]}>
                                    <Text style={[styles.grayText, {fontSize:12} ]}>{this.state.order.orderNumber}</Text>
                                </View>
                            </View>
                        </View>


                        <View style={styles.backTitle}>
                            <Text style={[styles.boldGrayText,  styles.asfs , styles.BoldText , {fontSize:15,color:'#575757'}]}>{ i18n.t('place_details') }</Text>
                        </View>

                        <View style={{marginVertical : 10}}>
                            <View style={[ styles.mb15 , {paddingHorizontal:30}]}>
                                <Text style={[styles.check, styles.asfs , {fontSize: 13}]}>{i18n.t('delivery_Location')}</Text>
                                <View style={[styles.directionRowSpace , styles.mt8]}>

                                    {
                                        (this.state.isLoaded)
                                            ?
                                            <View style={[styles.locationView , {marginTop:0}]}>
                                                <Image source={require('../../assets/images/maps.png')} style={[styles.locationImg]} resizeMode={'contain'} />
                                                <Text style={[styles.grayText , {fontSize:12} ]}>{ this.state.address}</Text>
                                            </View>
                                            :<View/>
                                    }

                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('location_delegate' ,{
                                        lat            :  this.state.place.lat,
                                        long           :  this.state.place.long,
                                        address        :  this.state.place.address,
                                    })}>
                                        <Text style={[styles.grayText , {color:COLORS.blue,fontSize:12} ]}>( {i18n.t('seeLocation')} )</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <TouchableOpacity onPress={()=> { Linking.openURL(`tel:${this.state.place.phoneNo}`)}} style={{paddingHorizontal:30}}>
                                <View style={[styles.directionRowSpace , styles.mt8]}>
                                    <Text style={[styles.check, styles.asfs , {fontSize: 13}]}>{i18n.t('phone')}</Text>

                                    <Text style={[styles.grayText , {fontSize:16, color :COLORS.blue , fontFamily:'cairoBold'} ]}>{i18n.t('call')}</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{paddingHorizontal:30}}>

                            </View>


                        </View>


                        <View style={styles.backTitle}>
                            <Text style={[styles.boldGrayText,  styles.asfs , styles.BoldText , {fontSize:15,color:'#575757'}]}>{ i18n.t('orderDet') }</Text>
                        </View>

                        <View>


                            {
                                (this.state.order.status === "public")
                                    ?

                                    (this.state.products.map((product, key) => {
                                        return (
                                            <View>
                                                <View key={key} style={[styles.notiBlock, {
                                                    paddingHorizontal: 30,
                                                    paddingVertical: 7,
                                                    marginTop: 5
                                                }]}>
                                                    <View style={[styles.yellowCircle]}>
                                                        <Text style={[styles.checkCircle]}>{product.orderCounter}</Text>
                                                    </View>
                                                    <View style={{flex: 1, flexDirection: 'row'}}>
                                                        <Text
                                                            style={[styles.boldGrayText, styles.asfs]}>{product.productName}</Text>
                                                    </View>
                                                    <View style={{flex: 1, flexDirection: 'row'}}>
                                                        <Image style={{width: 40, height: 20, resizeMode: 'contain'}}
                                                               source={{uri: product.productProfile}}/>
                                                    </View>

                                                    <View style={[styles.directionRow, {
                                                        borderLeftWidth: 1,
                                                        borderLeftColor: '#f2f2f2',
                                                        paddingLeft: 10
                                                    }]}>
                                                        <Text style={[styles.boldGrayText, {
                                                            color: COLORS.blue,
                                                            marginRight: 5
                                                        }]}>{product.price}</Text>
                                                    </View>
                                                </View>

                                            </View>
                                        );
                                    }))
                                    :null
                            }

                            {
                                (this.state.order.status === "private")
                                    ?
                                    <View>
                                        <Text style={{textAlign: 'center' , color : COLORS.gray , padding: 20 , fontFamily: 'cairo'}}>{ this.state.order.orderDetails}</Text>
                                    </View>
                                    :<View/>

                            }



                            <View style={styles.mb15}>
                                <View style={[styles.backTitle , styles.mt25 , styles.mb15]}>
                                    <Text style={[styles.boldGrayText,  styles.asfs , styles.BoldText, {fontSize:15 , color:'#575757'}]}>{i18n.t('paymentMethod')}</Text>
                                </View>
                                <Text style={[styles.check ,styles.asfs , {marginHorizontal: 30}]}>{ this.state.order.kindBuy }</Text>
                            </View>

                            <View style={styles.mb15}>
                                <View style={[styles.backTitle , styles.mb15]}>
                                    <Text style={[styles.boldGrayText ,  styles.asfs, styles.BoldText, {fontSize:15 , color:'#575757'}]}>{i18n.t('deliveryDetails')}</Text>
                                </View>
                                <View style={[ styles.mb15 , {paddingHorizontal:30}]}>
                                    <Text style={[styles.check, styles.asfs , {fontSize: 13}]}>{i18n.t('deliveryLocation')}</Text>
                                    <View style={[styles.directionRowSpace , styles.mt15]}>

                                        {
                                            (this.state.isLoaded)
                                            ?
                                                <View style={[styles.locationView , {marginTop:0}]}>
                                                    <Image source={require('../../assets/images/maps.png')} style={[styles.locationImg]} resizeMode={'contain'} />
                                                    <Text style={[styles.grayText , {fontSize:12} ]}>{ this.state.address}</Text>
                                                </View>
                                             :<View/>
                                        }

                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('location_delegate' ,{
                                            lat            :  this.state.latitude,
                                            long           :  this.state.longitude,
                                            address        :  this.state.address,
                                        })}>
                                            <Text style={[styles.grayText , {color:COLORS.blue,fontSize:12} ]}>( {i18n.t('seeLocation')} )</Text>
                                        </TouchableOpacity>
                                </View>

                            </View>

                                <View style={{paddingHorizontal:30}}>
                                    <View style={[styles.directionRowSpace , styles.mt15]}>
                                        <Text style={[styles.check, styles.asfs , {fontSize: 13}]}>{i18n.t('deliveryTime')}</Text>

                                        <Text style={[styles.grayText , {fontSize:12, color :COLORS.blue , fontFamily:'cairoBold'} ]}>{this.state.order.orderHour}</Text>
                                    </View>
                                </View>
                                <View style={{paddingHorizontal:30}}>
                                    <View style={[styles.directionRowSpace , styles.mt15]}>
                                        <Text style={[styles.check, styles.asfs , {fontSize: 13}]}>{i18n.t('deliveryPrice')}</Text>
                                        <Text style={[styles.grayText , {fontSize:12 , color :COLORS.blue, fontFamily:'cairoBold'} ]}>{this.state.order.deliveryPrice}</Text>
                                    </View>
                                </View>

                                <View style={{paddingHorizontal:30}}>
                                    <View style={[styles.directionRowSpace , styles.mt15]}>
                                        <Text style={[styles.check, styles.asfs , {fontSize: 13}]}>{i18n.t('total')}</Text>
                                        <Text style={[styles.grayText , {fontSize:12, color :COLORS.blue, fontFamily:'cairoBold'} ]}>{this.state.order.totalPrice}</Text>
                                    </View>
                                </View>
                            </View>

                        </View>



                        {
                            (this.state.isLoaded === false)
                            ?
                                <View>
                                    <Accordion
                                        dataArray={clientArray}
                                        animation={true}
                                        expanded={true}
                                        renderHeader={this._renderClientHeader}
                                        renderContent={() => this._renderClientContent() }
                                        style={styles.accordion}
                                    />



                                    <TouchableOpacity onPress={ () => this.acceptOrder()} style={[styles.yellowBtn , styles.mt15, styles.mb10 , {width:'90%' , alignSelf: 'center'}]}>
                                        <Text style={styles.whiteText}>{i18n.t('deliverOrder')}</Text>
                                    </TouchableOpacity>

                                </View>:<View/>
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
export default connect(mapStateToProps, { userLogin ,profile})(OrderDet_delegate);





