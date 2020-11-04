import React, { Component } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    I18nManager,
    Animated,
    KeyboardAvoidingView
} from "react-native";
import {Container, Content, Header, Button, Item, Input, Form, Label, Radio, Toast} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
import Select2 from 'react-native-select-two';
import axios from "axios";
import CONST from "../consts/colors";
import {connect}         from "react-redux";
import {profile, userLogin} from "../actions";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
// import {DoubleBounce} from "react-native-loader";
import Modal from "react-native-modal";
import MapView from "react-native-maps";
import {NavigationEvents} from "react-navigation";


const height = Dimensions.get('window').height;

class OrderDet_client extends Component {
    constructor(props){
        super(props);

        this.state={
            address                 : '',
            LocationName            : '',
            kindBuy                 : 'buy_with_Cash',
            location                : '',
            textErr                 : '',
            mockData                : [],
            addressStatus           : 0,
            timeStamp               : null,
            data                    : null,
            data_time               : null,
            lat                     : null,
            long                    : null,
            selectedId              : 1,
            time                    : i18n.t('dlevTime'),
            isFamilyProduct         : true,
            initMap                 : true,
            isTimePickerVisible     : false,
            is_ModalVisible         : false,
            mapRegion               : null,
            times                   : []
        }
    }

    async componentWillMount(){
        this.setState({timeStamp : null , times : []},()=>{
            this.setState({times : [
                    {
                        id              : 1,
                        name            : i18n.t('1_hour'),
                        checked         : false
                    },
                    {
                        id              : 2,
                        name            :  i18n.t('2_hour'),
                        checked         : false
                    },
                    {
                        id              : 3,
                        name            :  i18n.t('3_hour'),
                        checked         : false
                    },
                    {
                        id              : 4,
                        name            :  i18n.t('4_hour'),
                        checked         : false
                    },
                    {
                        id              : 5,
                        name            :  i18n.t('5_hour'),
                        checked         : false
                    },
                ]})
        });

        axios({
            method     : 'post',
            url        :  CONST.url + 'allAdress',
            data       :  {

            },
            headers    : {
                lang         :      ( this.props.lang ) ?  this.props.lang : 'ar',
                user_id      :      this.props.auth.data.user_id,
            }
        }).then(response => {
            if(response.data.status === '0')
            {

            }else{
                this.setState({
                    mockData : response.data.data
                });
            }
        }).catch(error => {

        }).then(()=>{
            this.setState({
                isModalVisible  : false,
                isLoaded        : false
            });
        });
    }



    static navigationOptions = () => ({
        drawerLabel: () => null,
    });



    checkPay(payID){
        this.setState({ kindBuy: payID });
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


    async openModal(){

        this.setState({is_ModalVisible : true});

        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status     !== 'granted') {
            alert(i18n.t('open_gps'));
        }else {
            const { coords : { latitude, longitude } } = await Location.getCurrentPositionAsync({});
            const userLocation                         = { latitude, longitude };
            let getCity                                = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
            getCity                                    += userLocation.latitude + ',' + userLocation.longitude;
            getCity                                    += '&key='+ this.props.user.googleKey +'&language=ar&sensor=true';

            console.log(getCity)
            try {
                const { data } = await axios.get(getCity);
                this.setState({
                    mapRegion : userLocation,
                    lat       : latitude,
                    long      : longitude,
                    initMap   : false,
                    location  :  data.results[0].formatted_address,
                });
            } catch (e) {
                alert(e.message);
                console.log(e);
            }
        }
    }

    _handleMapRegionChange  = async (mapRegion) =>  {
        {

            this.setState({ mapRegion });
            let getCity = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
            getCity += mapRegion.latitude + ',' + mapRegion.longitude;
            getCity                                    += '&key='+ this.props.user.googleKey +'&language=ar&sensor=true';

            console.log('locations data', getCity);

            try {
                const { data } = await axios.get(getCity);
                this.setState({
                    location   : data.results[0].formatted_address,
                });

            } catch (e) {
                console.log(e);
            }
        }
    };

    saveLocation(){
        if(this.state.LocationName !== '' && this.state.location !== ''){
            this.setState({ isLoaded: true });
            axios({
                method     : 'post',
                url        :  CONST.url + 'addAdress',
                data       :  {
                    lat          :    this.state.lat,
                    long         :    this.state.long,
                    address      :    this.state.location,
                    LocationName :    this.state.LocationName,
                },
                headers    : {
                    lang         :      ( this.props.lang ) ?  this.props.lang : 'ar',
                    user_id      :      this.props.auth.data.user_id,
                }
            }).then(response => {
                if(response.data.status === '0')
                {

                    this.setState({textErr : response.data.message})
                }else{
                    this.setState({textErr : '', LocationName : ''});
                    Toast.show({ text: response.data.message, duration : 2000 ,
                        type :"success",
                        textStyle: {
                            color: "white",fontFamily : 'cairoBold' ,textAlign:'center'
                        } });


                    this.setState({
                        location     : '',
                        LocationName : '',
                        mockData     : this.state.mockData.concat( response.data.data).reverse()
                    })
                }
            }).catch(error => {

            }).then(()=>{
                this.setState({ isLoaded: false, is_ModalVisible: false ,initMap : true });
            });
        }else{
            this.setState({textErr :i18n.t('some_fields_required')});
        }
    }

    confirmOrder() {

        this.setState({ isLoaded: true });
        axios({
            method     : 'post',
            url        :  CONST.url + 'confirmOrder',
            data       :  {
                place_id          :    this.props.navigation.state.params.place_id,
                kindBuy           :    this.state.kindBuy,
                totalPrice        :    this.props.navigation.state.params.totalPrice,
                couponCode        :    this.props.navigation.state.params.copun,
                address_id        :    this.state.data[0],
                orderHour         :    this.state.timeStamp[0],
                status            :    'public',
                deliveryPrice     :    this.props.navigation.state.params.DeliveryPriceValue,
            },
            headers    : {
                lang         :      ( this.props.lang ) ?  this.props.lang : 'ar',
                user_id      :      this.props.auth.data.user_id,
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

                if(this.state.kindBuy === 'buy_with_visa'){
                    this.props.navigation.navigate("Buy_with_visa",{id : response.data.data.item_id});
                }else{
                    this.props.navigation.navigate("orderSent_client",{});
                }
            }
        }).catch(error => {

        }).then(()=>{
            this.setState({ isLoaded: false, is_ModalVisible: false ,initMap : true });
        });
    }

    confirm_Order(){
        this.setState({isLoaded: true});
        axios({
            method     : 'post',
            url        :  CONST.url + 'confirmOrder',
            data       :  {
                place_id     :  this.props.navigation.state.params.place_id,
                kindBuy      :  this.state.kindBuy,
                orderDetails :  this.props.navigation.state.params.orderDetails,
                status       : 'private',
                address_id   : this.state.data[0],
                orderHour    : this.state.timeStamp[0],
            },
            headers    : {
                lang         : ( this.props.lang ) ?  this.props.lang : 'ar',
                user_id      : this.props.auth.data.user_id,

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
            this.props.navigation.navigate("home_client");
        }}
        ).catch(error => {

        }).then(()=>{
            this.setState({ isLoaded: false, is_ModalVisible: false ,initMap : true });
        });
    }


    render() {
        return (
            <Container>

                <Header style={[styles.header ]} noShadow>
                    <View style={styles.directionRow}>
                        <Button onPress={() => this.props.navigation.openDrawer()} transparent style={styles.headerBtn}>
                            <Image source={require('../../assets/images/noun_menu.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                        </Button>

                    </View>

                    <Text style={[styles.headerText , {right:0} ]}>{i18n.t('orderDet')}</Text>

                    <View style={styles.directionRow}>
                        <View>

                        </View>
                        <Button onPress={() => this.props.navigation.goBack()} transparent  style={styles.headerBtn}>
                            <Image source={require('../../assets/images/arrow_left.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                        </Button>
                    </View>
                </Header>



                <Content contentContainerStyle={styles.flexGrow} style={{}} >
                    {this.renderLoader()}
                    <View style={[styles.homeSection , {marginTop:20 }]}>

                        <KeyboardAvoidingView behavior={'padding'} style={styles.keyboardAvoid}>
                            <View style={[styles.directionColumnCenter , {marginBottom: 15,width : '40%' , alignSelf : 'flex-end'}]}>
                                <TouchableOpacity onPress={()=> this.openModal()}  style={[styles.yellowBtn , styles.mb10 , {borderRadius : 3}]}>
                                    <Text style={styles.whiteText}>{ i18n.t('add_places') }</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.container ]}>
                                <Select2
                                    isSelectSingle
                                    selectedTitlteStyle={{fontFamily :'cairo',textAlign : 'left'}}
                                    buttonStyle={{fontFamily :'cairo'}}
                                    cancelButtonText={i18n.t('cancel')}
                                    searchPlaceHolderText={i18n.t('search')}
                                    listEmptyTitle={i18n.t('no_result')}
                                    selectButtonText={i18n.t('confirm')}
                                    buttonTextStyle={{fontFamily :'cairo'}}
                                    style       ={{ borderRadius: 5 ,fontFamily :'cairo' , borderColor :COLORS.gray }}
                                    colorTheme  ={'black'}
                                    popupTitle  ={i18n.t('choose_saved')}
                                    title       ={i18n.t('Select_item')}
                                    data        ={this.state.mockData}
                                    onSelect    ={(data) => {
                                        this.setState({ data });
                                    }}
                                    onRemoveItem={data => {
                                        this.setState({ data });
                                    }}
                                />
                            </View>

                                <View style={{marginVertical : 8}}/>

                                    <View style={[styles.container ]}>
                                        <Select2
                                            isSelectSingle
                                            selectedTitlteStyle={{fontFamily :'cairo',textAlign : 'left'}}
                                            buttonStyle={{fontFamily :'cairo'}}
                                            cancelButtonText={i18n.t('cancel')}
                                            searchPlaceHolderText={i18n.t('search')}
                                            listEmptyTitle={i18n.t('no_result')}
                                            selectButtonText={i18n.t('confirm')}
                                            buttonTextStyle={{fontFamily :'cairo'}}
                                            style       ={{ borderRadius: 5 ,fontFamily :'cairo' , borderColor :COLORS.gray }}
                                            colorTheme  ={'black'}
                                            popupTitle  ={i18n.t('choose_time')}
                                            title       ={i18n.t('Select_time')}
                                            data        ={this.state.times}
                                            onSelect    ={(timeStamp) => {
                                                this.setState({ timeStamp });
                                            }}
                                            onRemoveItem={timeStamp => {
                                                this.setState({ timeStamp });
                                            }}
                                        />
                                    </View>



                            <View style={{marginVertical : 8}}/>


                        </KeyboardAvoidingView>
                        {
                            (this.props.navigation.state.params.status !== 'private')
                                ?
                        <Text style={[styles.label , {color:'#575757'} ]}>{ i18n.t('selectPay') }</Text>
                                :
                                <View/>
                        }

                        <View style={[styles.locationView , styles.directionColumn]}>


                            {
                                (this.props.navigation.state.params.status !== 'private')
                                ?
                                    <View style={{width : '100%'}}>
                                        <View style={[styles.directionRow  , styles.w100 , styles.mt15]}>
                                            <Radio onPress={ () => this.checkPay('buy_with_Cash')} selected={this.state.kindBuy == 'buy_with_Cash' ? true : false}  color={'#575757'} selectedColor={COLORS.blue} style={styles.quesCheckBox} />
                                            <Text onPress={ () => this.checkPay('buy_with_Cash')} style={[styles.check]}>{ i18n.t('recievePay') }</Text>
                                        </View>
                                        <View style={[styles.directionRow  , styles.w100 , styles.mt15]}>
                                            <Radio onPress={ () => this.checkPay('buy_with_visa')} selected={this.state.kindBuy == 'buy_with_visa' ? true : false} color={'#575757'} selectedColor={COLORS.blue} style={styles.quesCheckBox} />
                                            <Text onPress={ () => this.checkPay('buy_with_visa')} style={[styles.check]}>{ i18n.t('byVisa') }</Text>
                                        </View>
                                        <View style={[styles.directionRow  , styles.w100 , styles.mt15]}>
                                            <Radio onPress={ () => this.checkPay('buy_with_wallet')} selected={this.state.kindBuy == 'buy_with_wallet' ? true : false}  color={'#575757'} selectedColor={COLORS.blue} style={styles.quesCheckBox} />
                                            <Text onPress={ () => this.checkPay('buy_with_wallet')} style={[styles.check]}>{ i18n.t('byWallet') }</Text>
                                        </View>
                                    </View>
                                    :
                                    <View/>
                            }



                        </View>

                        {
                            (this.props.navigation.state.params.status !== 'private')
                                ?
                                <TouchableOpacity disabled={(this.state.timeStamp === null || this.state.data === null) ? true : false} onPress={ () => this.confirmOrder()} style={[(this.state.timeStamp === null || this.state.data === null) ? styles.grayBtn : styles.yellowBtn , styles.mt50, styles.mb10]}>
                                    <Text style={styles.whiteText}>{ i18n.t('confirm') }</Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity disabled={( this.state.data === null) ? true : false} onPress={ () => this.confirm_Order()} style={[( this.state.data === null) ? styles.grayBtn : styles.yellowBtn , styles.mt50, styles.mb10]}>
                                    <Text style={styles.whiteText}>{ i18n.t('confirm') }</Text>
                                </TouchableOpacity>
                        }

                    </View>
                </Content>

                <Modal onBackdropPress={()=> this.setState({ is_ModalVisible : false , initMap : true , LocationName : ''  })} isVisible={this.state.is_ModalVisible}>
                    <View style={styles.modalStyle}>
                        <View style={styles.modalHead}>
                            <Text style={[styles.whiteText , {fontSize:15}]}>{ i18n.t('detect_location') }</Text>
                        </View>
                        <Form style={{ width: '100%' , padding:20}}>

                            <Item style={styles.loginItem} bordered>
                                <Label style={[styles.label ]}>{ i18n.t('LocationName') }</Label>
                                <Input value={this.state.LocationName} placeholder={i18n.t('LocationName')} placeholderTextColor={COLORS.placeholderColor} onChangeText={(LocationName) => this.setState({LocationName})} autoCapitalize='none' style={styles.input}  />
                            </Item>

                            <Text style={{ fontFamily: I18nManager.isRTL ? 'cairo' : 'openSans' , fontSize : 14, textAlign : 'center', color : '#F00', }}>
                                { this.state.textErr }
                            </Text>

                            {
                                !this.state.initMap ? (
                                    <MapView
                                        style={{ width: '100%', height: 300, borderRadius: 5, marginBottom : 10 }}
                                        initialRegion={{
                                            latitude:  this.state.mapRegion.latitude,
                                            longitude:  this.state.mapRegion.longitude,
                                            latitudeDelta: 0.0922,
                                            longitudeDelta: 0.0421,
                                        }}
                                    >
                                        <MapView.Marker draggable
                                                        coordinate={this.state.mapRegion}
                                                        onDragEnd={(e) =>  this._handleMapRegionChange(e.nativeEvent.coordinate)}
                                        >
                                            <Image source={require('../../assets/images/maps.png')} resizeMode={'contain'} style={{ width: 50, height: 50 }}/>
                                        </MapView.Marker>
                                    </MapView>
                                ) : (<View />)
                            }

                            <Item style={styles.loginItem} bordered>
                                <Input value={this.state.location} placeholder={i18n.t('location')} placeholderTextColor={COLORS.placeholderColor}   onChangeText={(location) => this.setState({location})}  style={[styles.input  ,{borderTopRightRadius:25,paddingRight:40}]}  />
                            </Item>

                            <View style={{justifyContent:'space-between' , flexDirection:'row' ,  alignItems : 'center' }}>
                                <TouchableOpacity  onPress={()=> { this.saveLocation() }}  style={[styles.yellowBtn , styles.mb10 ,{width : '40%'}]}>
                                    <Text style={styles.whiteText}>{ i18n.t('confirm') }</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=> { this.setState({is_ModalVisible : false, initMap : true , LocationName : '' })}} style={[styles.redBtn , styles.mb10,{width : '40%'}]}>
                                    <Text style={styles.whiteText}>{ i18n.t('cancel') }</Text>
                                </TouchableOpacity>
                            </View>

                        </Form>
                    </View>
                </Modal>
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

export default connect(mapStateToProps, { userLogin , profile})(OrderDet_client);


