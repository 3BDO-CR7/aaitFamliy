import React, { Component } from "react";
import {
    View,
    Text,
    Image,
    Animated,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    FlatList,
    I18nManager, ActivityIndicator
} from "react-native";
import {Container, Content, Header, Button, Item, Input, CheckBox, Icon, Toast} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
import StarRating from 'react-native-star-rating';
import {NavigationEvents} from "react-navigation";
import axios from "axios";
import CONST from "../consts/colors";
// import {DoubleBounce} from "react-native-loader";
import {connect}         from "react-redux";
import {profile, userLogin} from "../actions";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";


const height = Dimensions.get('window').height;

class ProductDet_client extends Component {
    constructor(props){
        super(props);

        this.state  = {
            backgroundColor : new Animated.Value(0),
            availabel       : 0,
            starCount       : 3,
            activeType      : 0,
            value           : 1,
            price           : 0,
            total           : 0,
            count           : 1,
            selectedId      : 0,
            lat             : null,
            long            : null,
            isLoaded        : false,
            checkedBoxCheck : false,
            product         : '',
            price_additions : 0,
            additions       : [],
            selectedItems   : []
        }
    }

    static navigationOptions = () => ({
        drawerLabel: () => null,
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

            });
        }
    };

    onFocus(){
        this.componentWillMount();
    }

    async componentWillMount() {

        this.setState({ isLoaded: true });
        axios({
            method     : 'post',
            url        :  CONST.url + 'detailsProduct',
            data       :  {
                product_id     :     this.props.navigation.state.params.product_id,
                place_id       :     this.props.navigation.state.params.place_id,

            },
            headers    : {
                lang           :     ( this.props.lang ) ?  this.props.lang : 'ar',
            }
        }).then(response => {
            if(response.data.status === '0')
            {
                Toast.show({ text: response.data.message, duration : 2000 ,
                    type :"danger",
                    textStyle: {
                        color: "white",fontFamily : 'cairoBold' ,textAlign:'center'
                    } });
                 this.props.navigation.goBack();
            }else{

                this.setState({
                    product         :   response.data.data,
                    total           :   parseFloat(response.data.data.priceValue),
                    price           :   parseFloat(response.data.data.priceValue),
                    additions       :   response.data.data.addition,
                    price_additions :   0
                });
            }
        }).catch(error => {

        }).then(()=>{
            this._getLocationAsync();
            this.setState({ isLoaded: false });
        });
    }


    addToCart() {

        if(this.props.auth){
            this.setState({ isLoaded: true });
            axios({
                method     : 'post',
                url        :  CONST.url + 'addToCart',
                data       :  {
                    place_id       :     this.props.navigation.state.params.place_id,
                    product_id     :     this.props.navigation.state.params.product_id,
                    addition       :     this.state.selectedItems,
                    orderCounter   :     this.state.count,
                    lat            :     this.state.lat,
                    long           :     this.state.long,
                },
                headers    : {
                    lang           :     ( this.props.lang ) ?  this.props.lang : 'ar',
                    user_id        :      this.props.auth.data.user_id,
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
                        value           : 1,
                        price           : 0,
                        total           : 0,
                        count           : 1,
                        selectedItems   :[],
                        price_additions :   0

                    })
                    this.props.navigation.navigate('orderNow_client',{
                        place_id :  this.props.navigation.state.params.place_id
                    })
                }
            }).catch(error => {

            }).then(()=>{
                this.setState({ isLoaded: false });
            });
        }else{
               Toast.show({ text: i18n.t('sign_in'), duration : 2000 ,
                type :"success",
                textStyle: {
                    color: "white",fontFamily : 'cairoBold' ,textAlign:'center'
                }});
            this.props.navigation.navigate('user');
        }

    }

    checkAdd(addId, price){

        if( this.state.selectedItems.includes(addId)){
           let  index = this.state.selectedItems.findIndex(x => x === addId);
            this.state.selectedItems.splice(index, 1);
            this.setState({
                selectedItems   :  this.state.selectedItems,
                price_additions :  parseFloat(this.state.price_additions) - parseFloat(price)

            });

        }else{
            this.state.selectedItems.push(addId);
            this.setState({
                selectedItems :  this.state.selectedItems,
                price_additions :  parseFloat(this.state.price_additions) + parseFloat(price)
            });
        }
    }

    setAnimate(availabel){
        if (availabel === 0){
            Animated.timing(
                this.state.backgroundColor,
                {
                    toValue: 1,
                    duration: 1000,
                },
            ).start();
            this.setState({ availabel: 1 });
        }else {
            Animated.timing(
                this.state.backgroundColor,
                {
                    toValue: 0,
                    duration: 1000,
                },
            ).start();
            this.setState({ availabel: 0 });
        }

        console.log(availabel);
    }

    headerScrollingAnimation(e){
        if (e.nativeEvent.contentOffset.y > 30){
            console.log(e.nativeEvent.contentOffset.y);
            this.setAnimate(0)
        } else{
            this.setAnimate(1)
        }
    }

    increment(){
        this.setState({
                count   : this.state.count + 1
        });

        setTimeout(()=> {
            this.setState({
                total   : this.state.count  * parseFloat(this.state.price)
            });
        },200)
    }

    decrement(){

        if(this.state.count > 1)
        {
            this.setState({
                count   : parseInt(this.state.count) - 1
            });
        }

        setTimeout(()=> {
            this.setState({
                total   : this.state.count  * parseFloat(this.state.price)
            });
        },200)
    }

    renderLoader(){
        if (this.state.isLoaded){
            return(
                <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' , alignSelf:'center' , backgroundColor: '#FFF' , width:'100%' , position:'absolute' , zIndex:1  }}>
                    <ActivityIndicator size="large" color={COLORS.red} />
                </View>
            );
        }
    }


    orderNow(){
        if(this.props.auth){
        this.setState({ isLoaded: true });
        axios({
            method     : 'post',
            url        :  CONST.url + 'addToCart',
            data       :  {
                place_id       :     this.props.navigation.state.params.place_id,
                product_id     :     this.props.navigation.state.params.product_id,
                addition       :     this.state.selectedItems,
                orderCounter   :     this.state.count,
                lat            :     this.state.lat,
                long           :     this.state.long,
            },
            headers    : {
                lang           :     ( this.props.lang ) ?  this.props.lang : 'ar',
                user_id        :      this.props.auth.data.user_id,
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

                });

                this.setState({
                    value           : 1,
                    price           : 0,
                    total           : 0,
                    count           : 1,
                    selectedItems   :[]
                })
                Toast.show({ text: i18n.t('add_to_cart'), duration : 2000 ,
                    type :"success",
                    textStyle: {
                        color: "white",fontFamily : 'cairoBold' ,textAlign:'center'
                    } });
                 this.props.navigation.navigate('restDet_client',{
                     place_id :  this.props.navigation.state.params.place_id,
                     type     : 'families_client'
                 });
            }
        }).catch(error => {

        }).then(()=>{
            this.setState({ isLoaded: false });
        });

        }else{
            Toast.show({ text: i18n.t('sign_in'), duration : 2000 ,
                type :"success",
                textStyle: {
                    color: "white",fontFamily : 'cairoBold' ,textAlign:'center'
          } });
            this.props.navigation.navigate('user');
        }
    }


    componentWillUnmount(){

    }

    render() {
        const backgroundColor = this.state.backgroundColor.interpolate({
            inputRange: [0, 1],
            outputRange: ['rgba(0, 0, 0, 0)', '#00000099']
        });

        const IS_IPHONE_X = height === 812 || height === 896;

        return (
            <Container>


            {/*<Header style={[styles.header , {backgroundColor:'transparent' , paddingLeft:0 , paddingRight:0} ]} noShadow>*/}
            {/*    <Animated.View style={[styles.animatedHeader ,{ backgroundColor: backgroundColor}]}>*/}
            {/*        <View style={styles.directionRow}>*/}
            {/*            <Button onPress={() => this.props.navigation.openDrawer()} transparent style={styles.headerBtn}>*/}
            {/*                <Image source={require('../../assets/images/noun_menu.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />*/}
            {/*            </Button>*/}

            {/*        </View>*/}

            {/*        <Text style={[styles.headerText , {right:0} ]}>{ i18n.t('productDet') }</Text>*/}

            {/*        <View style={styles.directionRow}>*/}
            {/*            <Button onPress={() => this.props.navigation.goBack()} transparent  style={styles.headerBtn}>*/}
            {/*                <Image source={require('../../assets/images/arrow_left.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />*/}
            {/*            </Button>*/}
            {/*        </View>*/}
            {/*    </Animated.View>*/}
            {/*</Header>*/}




                <NavigationEvents onWillFocus={() => this.onFocus()} />

                { this.renderLoader() }
                <Content contentContainerStyle={styles.flexGrow} style={styles.homecontent} onScroll={e => this.headerScrollingAnimation(e) }>

                    <View style={[ styles.headImg, styles.position_R, { marginTop : 55, height:300 } ]}>

                        <View style={[styles.rowGroup, styles.position_A, styles.Width_100, styles.right_0, styles.top_35, styles.paddingHorizontal_10 ,{ zIndex: 99 } ]} noShadow>
                            <Button onPress={() => this.props.navigation.openDrawer()} transparent style={styles.headerBtn}>
                                <Image source={require('../../assets/images/noun_menu.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                            </Button>
                            <Button onPress={() => this.props.navigation.goBack()} transparent style={styles.headerBtn}>
                                <Image source={require('../../assets/images/arrow_left.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                            </Button>
                        </View>

                        <View style={[ styles.overlay_black, styles.position_A, styles.Width_100, styles.heightFull, styles.top_0, styles.right_0, { zIndex : 7 } ]} />
                        {/*{*/}
                        {/*    (Platform.OS !== 'android' && IS_IPHONE_X)*/}
                        {/*        ?*/}

                        {/*        <View style={{position: 'absolute', top: 45, left: 20, zIndex: 9999}}>*/}
                        {/*            <Button onPress={() => this.props.navigation.openDrawer()} transparent*/}
                        {/*                    style={styles.headerBtn}>*/}
                        {/*                <Image source={require('../../assets/images/noun_menu.png')}*/}
                        {/*                       style={[styles.headerMenu, styles.transform]} resizeMode={'contain'}/>*/}
                        {/*            </Button>*/}
                        {/*        </View>*/}
                        {/*        : null*/}

                        {/*}*/}

                        {/*{*/}
                        {/*    (Platform.OS  !== 'android' && IS_IPHONE_X)*/}
                        {/*        ?*/}

                        {/*        <View style={{position: 'absolute', top: 45, right: 20, zIndex: 9999}}>*/}
                        {/*            <Button onPress={() => this.props.navigation.goBack()} transparent*/}
                        {/*                    style={styles.headerBtn}>*/}
                        {/*                <Image source={require('../../assets/images/arrow_left.png')}*/}
                        {/*                       style={[styles.headerMenu, styles.transform, {zIndex: 999}]}*/}
                        {/*                       resizeMode={'contain'}/>*/}
                        {/*            </Button>*/}
                        {/*        </View>*/}

                        {/*        : null*/}
                        {/*}*/}
                        <Image source={{uri : this.state.product.image}} style={styles.swiperimage} resizeMode={'cover'}/>
                    </View>


                    <View style={[styles.homeSection , {marginTop:20}]}>
                        <View style={[styles.directionColumn , {flex:1}]}>
                            <View style={[styles.directionRowSpace ]}>
                                <Text style={[styles.productName ]}>{ this.state.product.productName }</Text>
                                <Text style={[styles.productName , {color:COLORS.blue} ]}>{this.state.product.price}</Text>
                            </View>
                            <View style={[styles.locationView]}>
                                <Text style={[styles.grayText , {writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',lineHeight:22} ]}>  {this.state.product.details}  </Text>
                            </View>
                        </View>

                        <View style={styles.line}/>

                        <View style={[styles.directionColumn , {flex:1}]}>
                            <View style={[styles.directionRow , styles.locationView , {marginTop:0} ]}>
                                <Text style={[styles.productName ]}>{i18n.t('extras')}</Text>
                                <Text style={[styles.grayText ,{marginLeft:5}]}>({i18n.t('optional')})</Text>
                            </View>
                            <View style={[styles.locationView , styles.directionColumn]}>
                                {
                                    (this.state.additions.map((addition , key)=> {
                                        return (
                                            <TouchableOpacity onPress={ () => this.checkAdd(addition.addition_id , addition.priceValue)} key={key} style={[styles.directionRowSpace  , styles.w100 , styles.mt15]}>
                                                <View style={[ styles.directionRow]}>
                                                    <CheckBox
                                                        checked={ this.state.selectedItems.includes(addition.addition_id) ? true : false }
                                                        color={COLORS.blue} style={styles.quesCheckBox}
                                                        onPress={ () => this.checkAdd(addition.addition_id , addition.priceValue)}
                                                    />
                                                    <Text style={[styles.check]}>{addition.extraName}</Text>
                                                </View>
                                                <Text style={[styles.check, {color:COLORS.blue}]}>{addition.price}</Text>
                                            </TouchableOpacity>
                                        );
                                    }))
                                }

                            </View>
                        </View>

                        <View style={styles.line}/>

                        <View style={[styles.directionColumn , {flex:1}]}>
                            <View style={[styles.locationView , {marginTop:0} ]}>
                                <Text style={[styles.productName ]}>{i18n.t('requiredQuantity')}</Text>
                            </View>
                            <View style={[styles.locationView , styles.directionColumn ]}>
                                <View style={styles.counterParent}>
                                    <TouchableOpacity onPress={() => this.increment()} style={styles.touchPlus}>
                                        <Icon type={'Entypo'} name={'plus'} style={styles.plus} />
                                    </TouchableOpacity>
                                     <Text style={[styles.countText ]}>{this.state.count}</Text>
                                    <TouchableOpacity onPress={() => this.decrement()} style={styles.touchMinus}>
                                        <Icon type={'Entypo'} name={'minus'} style={styles.minus} />
                                    </TouchableOpacity>
                                </View>
                                <View style={[ styles.total]}>
                                    <Text style={[styles.check]}>{i18n.t('total')}</Text>
                                    <Text style={[styles.check, {color:COLORS.blue , marginLeft:10}]}>  { parseFloat(this.state.total) + parseFloat((this.state.price_additions * this.state.count)) }  {i18n.t('rs')} </Text>
                                </View>

                                {/*{*/}
                                    {/*(this.props.navigation.state.params.type === 'restaurants_client')*/}
                                    {/*?*/}

                                        {/*<TouchableOpacity onPress={ () => this.addToCart()} style={[styles.orderNowBtn]}>*/}
                                            {/*<Text style={styles.whiteText}>{i18n.t('orderNow')}</Text>*/}
                                        {/*</TouchableOpacity>*/}


                                        {/*:*/}



                                            <View style={{flex : 1 , width : '100%'}}>
                                                <TouchableOpacity onPress={ () => this.addToCart()} style={[styles.orderNowBtn ,{width : '50%' , alignSelf:'center'}]}>
                                                    <Text style={styles.whiteText}>{i18n.t('orderNow')}</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={ () => this.orderNow()} style={[styles.yellowBtn,{width : '60%' , alignSelf:'center' , marginVertical : 10}]}>
                                                    <Text style={styles.whiteText}>{i18n.t('orderLater')}</Text>
                                                </TouchableOpacity>
                                            </View>

                                {/*}*/}

                            </View>
                        </View>
                    </View>

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

export default connect(mapStateToProps, { userLogin , profile})(ProductDet_client);




