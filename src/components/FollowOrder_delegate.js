import React, { Component } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    FlatList,
    ActivityIndicator,
    Linking,
    Animated,
    KeyboardAvoidingView, AsyncStorage
} from "react-native";
import {Container, Content, Header, Button, Item, Input, Form, Accordion, Icon, Toast} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
import {connect}         from "react-redux";
import {profile, userLogin} from "../actions";
import axios from "axios";
import CONST from "../consts/colors";
// import {DoubleBounce} from "react-native-loader";
import {NavigationEvents} from "react-navigation";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import Communications from "react-native-communications";
import {Notifications} from "expo";


const height = Dimensions.get('window').height;

const orderDetArray = [
    { title: i18n.t('orderDet') }
];
const delegateArray = [
    { title: i18n.t('delegateInfo')},
];

class FollowOrder_delegate extends Component {
    constructor(props){
        super(props);
        this.state   = {
            order         : '',
            place         : '',
            kindBuy       : '',
            orderStatus   : '',
            orderStatus2  : '',
            delegate      : '',
            address       : '',
            selectedId    : 0,
            lat           : null,
            long          : null,
            keyDelegate   : false,
            isLoaded      : false,
            isFamilyOrder : true
        }
    }

    async componentWillMount(){
        this._getLocationAsync();
        Notifications.addListener(this.handleNotification.bind(this));
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
            alert(i18n.t('open_gps'));
        } else {

            return await Location.getCurrentPositionAsync({
                enableHighAccuracy: false,
                maximumAge        : 15000
            }).then((position) => {
                this.setState({
                    lat           :       position.coords.longitude,
                    long          :       position.coords.latitude
                });

                axios({
                    method     : 'post',
                    url        :  CONST.url + 'detailsOrderDelegate',
                    data       :  {
                        item_id       :       this.props.navigation.state.params.item_id,
                        lat           :       position.coords.longitude,
                        long          :       position.coords.latitude
                    },
                    headers    : {
                        lang         :     ( this.props.lang ) ?  this.props.lang : 'ar',
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
                            order           : response.data.data ,
                            place           : response.data.data.place,
                            kindBuy         : response.data.data.kindBuy,
                            address         : response.data.data.address,
                            orderStatus     : response.data.data.orderStatus,
                            products        : response.data.data.products,
                            orderStatus2    : response.data.data.orderStatus2,
                            keyDelegate     : response.data.data.keyDelegate,
                            delegate        : response.data.data.user,
                        });
                    }

                }).catch(error => {

                }).then(()=>{
                    this.setState({ isLoaded: false });
                });

            });
        }
    };

    static navigationOptions = () => ({
        drawerLabel: () => null,
    });

    _renderHeader(item, expanded) {
        return (
            <View style={[styles.backTitle,styles.directionRowSpace]}>
                <Text style={[styles.yellowText , {color:expanded ? COLORS.blue:'#575757',fontSize:15}]}>{item.title}</Text>
                {expanded
                    ? <Icon style={[styles.arrowIcon , {color:COLORS.blue}]} type={'Ionicons'} name="md-arrow-dropup" />
                    : <Icon style={styles.arrowIcon} type={'Ionicons'} name="md-arrow-dropdown" />}
            </View>
        );
    }

    _renderContent(item) {
        return (
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
                        <Text style={[styles.yellowText, styles.asfs , {fontSize:15}]}>{i18n.t('paymentMethod')}</Text>
                    </View>
                    <Text style={[styles.check, styles.asfs , {marginHorizontal: 30}]}>{this.state.kindBuy}</Text>
                </View>
                <View style={styles.mb15}>
                    <View style={[styles.backTitle , styles.mb15]}>
                        <Text style={[styles.yellowText, styles.asfs , {fontSize:15}]}>{i18n.t('deliveryDetails')}</Text>
                    </View>
                    <View style={[ styles.mb15 , {paddingHorizontal:30}]}>
                        <Text style={[styles.check, styles.asfs , {fontSize: 13}]}>{i18n.t('deliveryLocation')}</Text>
                        <View style={[styles.directionRowSpace , styles.mt15]}>

                            <View style={[styles.locationView , {marginTop:0}]}>
                                <Image source={require('../../assets/images/maps.png')} style={[styles.locationImg]} resizeMode={'contain'} />
                                <Text style={[styles.grayText , {fontSize:12} ]}>{  this.state.address.address.slice(0, 30) }</Text>
                            </View>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('location_delegate' ,{
                                lat       :  this.state.address.lat,
                                long      :  this.state.address.long,
                                address   :  this.state.address.address,
                            })}>
                                <Text style={[styles.grayText , {color:COLORS.blue,fontSize:14} ]}>( {i18n.t('seeLocation')} )</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.directionRowSpace , styles.mt15]}>
                            <View style={[styles.locationView , {marginTop:0}]}>
                                <Icon name="user"  type="AntDesign" style={{color : COLORS.blue ,fontSize:13 , fontFamily:'cairoBold'}}/>
                                <Text style={[styles.grayText , {fontSize:14 , marginHorizontal :8} ]}>{  this.state.delegate.placeName }</Text>
                            </View>
                        </View>
                        <View style={[styles.directionRowSpace , styles.mt15]}>
                            <View style={[styles.locationView , {marginTop:0}]}>
                                <Icon name="phone-call"  type="Feather" style={{color : COLORS.blue ,fontSize:13 , fontFamily:'cairoBold'}}/>
                                <Text style={[styles.grayText , {fontSize:14 , marginHorizontal :8} ]}>{  this.state.delegate.phoneNo }</Text>
                            </View>
                            <TouchableOpacity onPress={() => Communications.phonecall(this.state.delegate.phoneNo, true)} style={[styles.callBtns]}>
                                <Text style={styles.whiteText}>{i18n.t('call')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    change_status(type){
        this.setState({ isLoaded: true });
        axios({
            method     : 'post',
            url        :  CONST.url + 'changeOrderstaus',
            data       :  {
                item_id       :       this.props.navigation.state.params.item_id,
                status        :       type
            },
            headers    : {
                lang         :     ( this.props.lang ) ?  this.props.lang : 'ar',
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
                Toast.show({ text: response.data.message, duration : 2000 ,
                    type :"success",
                    textStyle: {
                        color: "white",fontFamily : 'cairoBold' ,textAlign:'center'
                } });

                if(type === 'order_received_5'){
                    AsyncStorage.removeItem('room');
                    this.props.navigation.navigate("addRate_client",{
                        delegate   : this.state.delegate,
                        place      : this.state.place,
                        item_id    : this.props.navigation.state.params.item_id,
                    });
                    console.log('delegate go -=-=-=-=-', this.state.delegate)
                }else{
                    this.componentWillMount();
                }
            }
        }).catch(error => {

        }).then(()=>{
            this.setState({ isLoaded: false });
        });
    }


    renderLoader(){
        if (this.state.isLoaded){
            return(
                <View style={{ alignItems: 'center', justifyContent: 'center', height: (height-100) , alignSelf:'center' , backgroundColor: '#fff' , width:'100%' , position:'absolute' , zIndex:1  }}>
                    <ActivityIndicator size="large" color={COLORS.red} />
                </View>
            );
        }
    }
    between(x, min, max) {
        return x >= min && x <= max;
    }
    render() {
        return (
            <Container>
                { this.renderLoader() }
                <Header style={[styles.header ]} noShadow>
                    <View style={styles.directionRow}>
                        <Button onPress={() => this.props.navigation.openDrawer()} transparent style={styles.headerBtn}>
                            <Image source={require('../../assets/images/noun_menu.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                        </Button>

                    </View>
                    <NavigationEvents onWillFocus={() => this.onFocus()} />

                    <Text style={[styles.headerText , {right:0} ]}>{i18n.t('orderDet')}</Text>

                    <View style={styles.directionRow}>
                        <View>

                        </View>
                        <Button onPress={() => this.props.navigation.navigate('home_delegate')} transparent  style={styles.headerBtn}>
                            <Image source={require('../../assets/images/arrow_left.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                        </Button>
                    </View>
                </Header>

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
                            <Text style={[styles.yellowText , styles.asfs , {fontSize:15}]}>{i18n.t('followOrder')}</Text>
                        </View>


                        <View style={styles.followBlock}>
                            <View style={styles.followStep}>
                                <View style={[styles.yellowCircle ,
                                    {backgroundColor: this.between(this.state.orderStatus2,1,5) ?COLORS.blue :'#fff',
                                        borderColor:  this.between(this.state.orderStatus2,1,5) ?COLORS.blue :COLORS.boldGray}]}>
                                    <Icon type={'Feather'} name={'check'} style={[styles.checkCircle]} />
                                </View>
                                <Text style={[styles.check]}>{i18n.t('orderHasReceived')}</Text>
                                <View style={[styles.stepLine ,
                                    {backgroundColor: this.between(this.state.orderStatus2,1,5)  ?COLORS.blue :COLORS.boldGray,}]}/>
                            </View>
                            <View style={[styles.followStep ]}>
                                <View style={[styles.yellowCircle ,
                                    {backgroundColor: this.between(this.state.orderStatus2,2,5) ?COLORS.blue :'#fff',
                                        borderColor: this.between(this.state.orderStatus2,2,5)  ?COLORS.blue :COLORS.boldGray}]}>
                                    <Icon type={'Feather'} name={'check'} style={[styles.checkCircle]} />
                                </View>
                                <Text style={[styles.check]}>{i18n.t('processOrder')}</Text>
                                <View style={[styles.stepLine ,
                                    {backgroundColor: this.between(this.state.orderStatus2,2,5) ?COLORS.blue :COLORS.boldGray,}]}/>
                            </View>
                            <View style={[styles.followStep ]}>
                                <View style={[styles.yellowCircle ,
                                    {backgroundColor: this.between(this.state.orderStatus2,3,5) ?COLORS.blue :'#fff',
                                        borderColor: this.between(this.state.orderStatus2,3,5)  ?COLORS.blue :COLORS.boldGray}]}>
                                    <Icon type={'Feather'} name={'check'} style={[styles.checkCircle]} />
                                </View>
                                <Text style={[styles.check]}>{i18n.t('orderRecieve')}</Text>
                                <View style={[styles.stepLine ,
                                    {backgroundColor: this.between(this.state.orderStatus2,3,5)  ?COLORS.blue :COLORS.boldGray,}]}/>
                            </View>
                            <View style={[styles.followStep ]}>
                                <View style={[styles.yellowCircle ,
                                    {backgroundColor: this.between(this.state.orderStatus2,4,5) ?COLORS.blue :'#fff',
                                        borderColor: this.between(this.state.orderStatus2,4,5)  ?COLORS.blue :COLORS.boldGray}]}>
                                    <Icon type={'Feather'} name={'check'} style={[styles.checkCircle]} />
                                </View>
                                <Text style={[styles.check]}>{i18n.t('on_way')}</Text>
                                <View style={[styles.stepLine ,
                                    {backgroundColor: this.between(this.state.orderStatus2,4,5)  ?COLORS.blue :COLORS.boldGray,}]}/>
                            </View>
                            <View style={[styles.followStep ]}>
                                <View style={[styles.yellowCircle ,
                                    {backgroundColor:   this.between(this.state.orderStatus2,5,5) ?COLORS.blue :'#fff',
                                        borderColor: this.between(this.state.orderStatus2,5,5)  ?COLORS.blue :COLORS.boldGray}]}>
                                    <Icon type={'Feather'} name={'check'} style={[styles.checkCircle]} />
                                </View>
                                <Text style={[styles.check]}>{i18n.t('orderHasSent')}</Text>
                            </View>

                        </View>

                        {
                            (this.state.isLoaded === false )
                                ?
                                <View>
                                    <Accordion
                                        dataArray={orderDetArray}
                                        animation={true}
                                        expanded={true}
                                        renderHeader={this._renderHeader}
                                        renderContent={() => this._renderContent()}
                                        style={styles.accordion}
                                    />
                                </View>
                                :<View/>

                        }


                        {
                            (this.between(this.state.orderStatus2,3,3)  )
                                ?
                                <TouchableOpacity onPress={ () => this.change_status('order_in_theWay_4')} style={[styles.yellowBtn , styles.mt15, styles.mb10]}>
                                        <Text style={styles.whiteText}>{ i18n.t('processing') }</Text>
                                </TouchableOpacity>
                                :<View/>
                        }

                        {
                            (this.between(this.state.orderStatus2,4,4)  )
                                ?
                                <TouchableOpacity onPress={ () => this.change_status('order_received_5')} style={[styles.yellowBtn , styles.mt15, styles.mb10]}>
                                        <Text style={styles.whiteText}>{ i18n.t('orderHasSent') }</Text>
                                </TouchableOpacity>
                                :<View/>
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
export default connect(mapStateToProps, { userLogin ,profile})(FollowOrder_delegate);
