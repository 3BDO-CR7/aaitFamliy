import React, { Component } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    FlatList,
    I18nManager,
    Linking,
    ActivityIndicator,
    KeyboardAvoidingView
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
import {Notifications} from "expo";
import Modal from "react-native-modal";


const height = Dimensions.get('window').height;

const orderDetArray = [
    { title: i18n.t('orderDet') }
];
const delegateArray = [
    { title: i18n.t('delegateInfo')},
];

class FollowOrder_client extends Component {
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
            keyDelegate   : false,
            isLoaded      : false,
            isFamilyOrder : true,
            isModalInfo   : false,
            additionArr   : [],
            productTypeDes: '',
            userCancel    : false
        }
    }

    componentWillMount(){
        Notifications.addListener(this.handleNotification.bind(this));
        this.getResults();
    }


    handleNotification(notification){
        if (notification && notification.origin === 'received') {
            this.componentWillMount();
        }
    }

    onFocus(){
        this.componentWillMount();
    }

    toggleModalInfo(addition, productType){

        this.setState({
            additionArr         : addition.addition,
            productTypeDes      : productType.productType,
        });

        setTimeout(()=> {
            this.setState({
                isModalInfo     : !this.state.isModalInfo,
            });
        },500)

    }

    getResults() {

        this.setState({ isLoaded: true });
        axios({
            method     : 'post',
            url        :  CONST.url + 'detailsOrder',
            data       :  {
                item_id      : this.props.navigation.state.params.item_id,
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
                    delegate        : response.data.data.delegate,
                    userCancel      : response.data.data.userCancel
                });

                console.log('userCancel', this.state.userCancel)

            }

        }).catch(error => {
            console.log('error  => ' , error.message)
        }).then(()=>{
            this.setState({ isLoaded: false });
        });
    }

    static navigationOptions = () => ({
        drawerLabel: () => null,
    });

    orderStep(stepId){
        this.setState({ selectedId: stepId });
    }

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
                                    <View key={key} style={[styles.notiBlock, {paddingHorizontal: 10, paddingVertical: 7, marginTop: 5, justifyContent : 'center'}]}>
                                        <View style={{backgroundColor:COLORS.black, width:20, height:20, justifyContent:'center', alignItems:'center', borderRadius:50,}}>
                                            <Text style={[styles.checkCircle]}>{product.orderCounter}</Text>
                                        </View>
                                        <View style={{flexDirection: 'row', alignItems : 'center', }}>
                                            <View style={{flexDirection: 'row', alignItems : 'center', }}>
                                                <Image
                                                    style={{width: 30, height: 30, borderRadius : 5 , resizeMode: 'cover', marginHorizontal : 5}}
                                                    source={{uri: product.productProfile}}
                                                />
                                                <Text style={{textAlign: 'center',fontFamily : 'cairoBold' , color: COLORS.gray, fontSize : 11}}>
                                                    {product.productName}
                                                </Text>
                                            </View>
                                            <TouchableOpacity
                                                style={{  paddingHorizontal : 10}}
                                                onPress={()=> this.toggleModalInfo({ addition : product.addition }, { productType : product.productTypeDes})}
                                            >
                                                <Text style={{textAlign: 'center',fontFamily : 'cairoBold' , color: COLORS.blue, fontSize : 11}}>
                                                    ( {i18n.t('details')} )
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={[styles.directionRow, {borderLeftWidth: 1, borderLeftColor: '#f2f2f2', paddingHorizontal : 10}]}>
                                            <Text style={{textAlign: 'center',fontFamily : 'cairoBold' , color: COLORS.red, fontSize : 11}}>
                                                {product.price}
                                            </Text>
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

                <View style={styles.mb25}>
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
                                item_id   :  this.props.navigation.state.params.item_id
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
        );
    }

    _renderDelegateHeader(item, expanded) {
        return (
            <View style={[styles.backTitle,styles.directionRowSpace]}>
                <Text style={[styles.yellowText , {color:expanded ? COLORS.blue:'#575757',fontSize:15}]}>{item.title}</Text>
                {expanded
                    ? <Icon style={[styles.arrowIcon , {color:COLORS.blue}]} type={'Ionicons'} name="md-arrow-dropup" />
                    : <Icon style={styles.arrowIcon} type={'Ionicons'} name="md-arrow-dropdown" />}
            </View>
        );
    }

    cancelConfirmOrder(){
        this.setState({ isLoaded: true });
        axios({
            method     : 'post',
            url        :  CONST.url + 'cancelConfirmOrder',
            data       :  {
                item_id      : this.props.navigation.state.params.item_id,
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
            }else {
                this.props.navigation.navigate('specialOrders_client');
            }
        }).catch(error => {
        }).then(()=>{
            this.setState({ isLoaded: false });
        });
    }

    receivedOrder(){
        this.setState({ isLoaded: true });
        axios({
            method     : 'post',
            url        :  CONST.url + 'receivedOrder',
            data       :  {
                item_id      : this.props.navigation.state.params.item_id,
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
            }else {
                this.props.navigation.navigate("addRate_client",{
                    delegate   : this.state.delegate,
                    place      : this.state.place,
                    item_id    : this.props.navigation.state.params.item_id,
                });
                Toast.show({ text: response.data.message, duration : 2000 ,
                    type :"success",
                    textStyle: {
                        color: "white",fontFamily : 'cairoBold' ,textAlign:'center'
                    } });

            }
        }).catch(error => {
        }).then(()=>{
            this.setState({ isLoaded: false });
        });
    }

    _renderDelegateContent(item) {
        return (
            <View style={{paddingHorizontal:30}}>

                <View style={{ flexDirection : 'row' , alignItems:  'center'}}>
                    <View style={{width : '100%'}}>
                        <Text style={[styles.check ,styles.mt8 , styles.mb8, styles.asfs , {fontSize: 13}]}>{i18n.t('delegateName')}</Text>
                        <View style={[styles.backTitle , styles.mb8]}>
                            <Text style={[styles.check, styles.asfs , {fontSize:13}]}>{this.state.delegate.userName}</Text>
                        </View>

                        <Text style={[styles.check ,styles.mt8 , styles.mb8, styles.asfs , {fontSize: 13}]}>{i18n.t('customerPhone')}</Text>
                        <TouchableOpacity onPress={()=> { Linking.openURL('tel://' + this.state.delegate.phoneNo )}} style={[styles.backTitle , styles.mb8]}>
                            <Text style={[styles.check, styles.asfs , {fontSize:13}]}>{this.state.delegate.phoneNo}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity onPress={() => this.props.navigation.navigate('location_client' ,{
                    lat       :  this.state.address.lat,
                    long      :  this.state.address.long,
                    address   :  this.state.address.address,
                    item_id   :  this.props.navigation.state.params.item_id
                })} style={[styles.mb15,{alignSelf:'center'}]}>
                    <Text style={[styles.yellowText , {fontSize:13} ]}>( {i18n.t('delegateTracking')} )</Text>
                </TouchableOpacity>
            </View>
        );
    }

    renderLoader(){
        if (this.state.isLoaded){
            return(
                <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' , alignSelf:'center' , backgroundColor: '#fff' , width:'100%' , position:'absolute' , zIndex:99, top : 0, right: 0  }}>
                    <ActivityIndicator size="large" color={COLORS.red} />
                </View>
            );
        }
    }

    between(x, min, max) {
        return x >= min && x <= max;
    }

    cancelOrder(){

        this.setState({ isLoaded: true });

        axios({
            method     : 'post',
            url        :  CONST.url + 'cancelUserOrder',
            data       :  {
                item_id       :       this.props.navigation.state.params.item_id,
            },
            headers    : {
                lang         :     ( this.props.lang ) ?  this.props.lang : 'ar',
            }
        }).then(response => {
            if(response.data.status === '0')
            {
                Toast.show({
                    text: response.data.message,
                    duration : 2000 ,
                    type :"danger",
                    textStyle: {
                        color: "white",
                        fontFamily : 'cairoBold' ,
                        textAlign:'center'
                    } });
            }else{
                Toast.show({
                    text: response.data.message,
                    duration : 2000 ,
                    type :"success",
                    textStyle: {
                        color: "white",
                        fontFamily : 'cairoBold' ,
                        textAlign:'center'
                    }
                });
                this.props.navigation.navigate("myOrders_client")
            }
        }).catch(error => {

        }).then(()=>{
            this.setState({ isLoaded: false });
        });
    }

    resentOrder(){

        this.setState({ isLoaded: true });

        axios({
            method     : 'post',
            url        :  CONST.url + 'resendUserOrder',
            data       :  {
                item_id       :       this.props.navigation.state.params.item_id,
            },
            headers    : {
                lang         :     ( this.props.lang ) ?  this.props.lang : 'ar',
            }
        }).then(response => {
            if(response.data.status === '0')
            {
                Toast.show({
                    text: response.data.message,
                    duration : 2000 ,
                    type :"danger",
                    textStyle: {
                        color: "white",
                        fontFamily : 'cairoBold' ,
                        textAlign:'center'
                    } });
            }else{
                Toast.show({
                    text: response.data.message,
                    duration : 2000 ,
                    type :"success",
                    textStyle: {
                        color: "white",
                        fontFamily : 'cairoBold' ,
                        textAlign:'center'
                    }
                });
                this.props.navigation.navigate("myOrders_client")
            }
        }).catch(error => {

        }).then(()=>{
            this.setState({ isLoaded: false });
        });
    }

    render() {

        const orderDetArray = [
            { title: i18n.t('orderDet') }
        ];
        const delegateArray = [
            { title: i18n.t('delegateInfo')},
        ];

        return (
            <Container>

                { this.renderLoader() }
                <NavigationEvents onWillFocus={() => this.onFocus()} />

                <Header style={[styles.header ]} noShadow>
                    <View style={styles.directionRow}>
                        <Button onPress={() => this.props.navigation.openDrawer()} transparent style={styles.headerBtn}>
                            <Image source={require('../../assets/images/noun_menu.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                        </Button>
                    </View>
                    <Text style={[styles.headerText , {right:0} ]}>{i18n.t('orderDet')}</Text>
                    <View style={styles.directionRow}>
                        <View></View>
                        <Button onPress={() => this.props.navigation.goBack()} transparent  style={styles.headerBtn}>
                            <Image source={require('../../assets/images/arrow_left.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                        </Button>
                    </View>
                </Header>


                <Content contentContainerStyle={styles.flexGrow}>
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
                            (this.state.isLoaded === false)
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


                                    {
                                        (this.between(this.state.orderStatus2,3,5)) ?
                                            <Accordion
                                                dataArray={delegateArray}
                                                animation={true}
                                                expanded={true}
                                                renderHeader={this._renderDelegateHeader}
                                                renderContent={() => this._renderDelegateContent() }
                                                style={styles.accordion}
                                            /> :<View/>
                                    }


                                    {
                                        (this.state.orderStatus === 'order_send_1' && this.state.userCancel === false )
                                            ?
                                            <TouchableOpacity onPress={ () => this.cancelOrder()} style={[styles.yellowBtn , styles.mt15, styles.mb10]}>
                                                <Text style={styles.whiteText}>{ i18n.t('cancelOrder') }</Text>
                                            </TouchableOpacity>
                                            :<View/>
                                    }

                                    {
                                        (this.state.userCancel === true )
                                            ?
                                            <TouchableOpacity onPress={ () => this.resentOrder()} style={[styles.yellowBtn , styles.mt15, styles.mb10]}>
                                                <Text style={styles.whiteText}>{ i18n.t('resentorder') }</Text>
                                            </TouchableOpacity>
                                            :
                                            <View/>
                                    }


                                    {
                                        (this.between(this.state.orderStatus2,5,5)) ?
                                            <TouchableOpacity onPress={ () => this.receivedOrder()} style={[styles.yellowBtn , styles.mt15, styles.mb10, { backgroundColor : '#F00' }]}>
                                                <Text style={styles.whiteText}>{ i18n.t('end_order') }</Text>
                                            </TouchableOpacity>:<View/>
                                    }


                                    {
                                        (this.state.order.acceptPrice === 'false' && this.state.order.status === "private")
                                            ?
                                            <TouchableOpacity onPress={()=> this.cancelConfirmOrder()} style={[styles.redBtn , styles.mt50, {borderRadius: 0, height: 50 }]}>
                                                <Text style={styles.whiteText}>{i18n.t('cancelOrder')}</Text>
                                            </TouchableOpacity>
                                            :<View/>
                                    }

                                </View>
                                :<View/>

                        }


                    </View>


                    <Modal onBackdropPress={()=> this.setState({ isModalInfo : false })} isVisible={this.state.isModalInfo}>
                        <View style={[styles.modalStyle, {justifyContent:'flex-end'}]}>
                            <View style={styles.modalHead}>
                                <Text style={[styles.whiteText , {fontSize:15}]}>{ i18n.t('details') }</Text>
                            </View>
                            <View style={[ styles.overHidden, styles.Width_100, styles.paddingHorizontal_10, styles.paddingVertical_10 ]}>
                                <View srtyle={[ styles.marginVertical_10, styles.rowRight,  ]}>
                                    <Text style={[styles.text_black, { fontFamily : 'cairoBold',writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'} ]}>{ i18n.t('orer') }</Text>
                                    {
                                        (this.state.additionArr.length !== 0) ?
                                            (this.state.additionArr.map((addition)=> {
                                                return (
                                                    <Text style={[styles.text_gray, { fontFamily : 'cairoBold',writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'}]}>
                                                        {addition}
                                                    </Text>
                                                );
                                            }))
                                            :
                                            <Text style={{ fontFamily : 'cairoBold', color : "#F00", marginVertical : 10,writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'}}>
                                                { i18n.t('noorer') }
                                            </Text>
                                    }
                                </View>
                                <View srtyle={[ styles.marginVertical_10, styles.rowRight ]}>
                                    <Text style={[styles.text_black, { fontFamily : 'cairoBold',writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'} ]}>{ i18n.t('size') }</Text>
                                    <Text style={[styles.text_gray, { fontFamily : 'cairoBold',writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'}]}>
                                        {this.state.productTypeDes}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </Modal>

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
export default connect(mapStateToProps, { userLogin ,profile})(FollowOrder_client);
