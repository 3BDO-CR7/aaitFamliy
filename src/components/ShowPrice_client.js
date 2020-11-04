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
import {Container, Content, Header, Button, Item, Input, Form, Accordion, Icon, Toast, Radio} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
import axios from "axios";
import CONST from "../consts/colors";
import {connect}         from "react-redux";
import {profile, userLogin} from "../actions";
// import {DoubleBounce} from "react-native-loader";
import {NavigationEvents} from "react-navigation";


const height = Dimensions.get('window').height;



class ShowPrice_client extends Component {
    constructor(props){
        super(props);

        this.state = {
            isLoaded : true,
            order           : '' ,
            place           : '',
            kindBuy         : '',
            address         : '',
            orderStatus     : '',
            products        : '',
            orderStatus2    : '',
            keyDelegate     : '',
            delegate        : '',
        }
    }


    async componentWillMount(){
        this.getResults();
    }


    onFocus(){
        this.setState({kindBuy : 'buy_with_Cash'})
        this.componentWillMount();
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
    getResults()
    {

        this.setState({ isLoaded: true });
        axios({
            method     : 'post',
            url        :  CONST.url + 'detailsOrder',
            data       :  {
                item_id      : this.props.navigation.state.params.item_id,
            },
            headers          : {
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
                });
            }

        }).catch(error => {

        }).then(()=>{
            this.setState({ isLoaded: false });
        });
    }



    send(type){


        this.setState({ isLoaded: true });
        axios({
            method     : 'post',
            url        :  CONST.url + 'acceptRejectPrice',
            data       :  {
                item_id          : this.props.navigation.state.params.item_id,
                type             : (type === 1) ? true : false,
            },
            headers          : {
                lang         :     ( this.props.lang ) ?  this.props.lang : 'ar',
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
                Toast.show({ text: response.data.message, duration : 2000 ,
                    type :"success",
                    textStyle: {
                        color: "white",fontFamily : 'cairoBold' ,textAlign:'center'
                    } });
                this.props.navigation.navigate('Buy_with_visa',{id:this.props.navigation.state.params.item_id});
            }

        }).catch(error => {

        }).then(()=>{
            this.setState({ isLoaded: false });
        });

    }
    static navigationOptions = () => ({
        drawerLabel: () => null,
    });


    checkPay(payID){
        this.setState({ kindBuy: payID });
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

                    <Text style={[styles.headerText , {right:0} ]}>{i18n.t('offerPrice')}</Text>

                    <View style={styles.directionRow}>
                        <View>

                        </View>
                        <Button onPress={() => this.props.navigation.goBack()} transparent  style={styles.headerBtn}>
                            <Image source={require('../../assets/images/arrow_left.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                        </Button>
                    </View>
                </Header>
                <NavigationEvents onWillFocus={() => this.onFocus()} />



                <Content contentContainerStyle={styles.flexGrow} style={{}} >

                    {
                        this.renderLoader()
                    }
                    <View style={[styles.w100 , styles.mt15 , {flex:1}]}>
                        <View style={[styles.notiBlock , {padding:7 , marginBottom:15 , marginHorizontal:23}]}>
                            <Image source={{uri : this.state.place.imageProfile}} resizeMode={'cover'} style={styles.restImg}/>
                            <View style={[styles.directionColumn , {flex:1}]}>
                                <View style={[styles.directionRow ]}>
                                    <Text style={[styles.boldGrayText ]}>{ this.state.place.placeName}</Text>
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

                        <View style={[styles.homeSection , styles.directionColumnCenter , styles.mt50]}>
                            <Text style={[styles.boldGrayText , styles.BoldText, {fontSize:19}]}>{i18n.t('priceProvided')}</Text>
                            <Text style={[styles.yellowText ]}>{this.state.order.totalPrice}</Text>
                        </View>


                        <View style={[styles.homeSection , styles.directionColumnCenter , styles.mt15]}>
                            <Text style={[styles.label , {color:COLORS.blue} ]}>{ i18n.t('selectPay') }</Text>
                            <View style={{width : '100%'}}>
                                <View style={[styles.directionRow  , styles.w100 , styles.mt15]}>
                                    <Radio onPress={ () => this.checkPay('buy_with_Cash')} selected={this.state.kindBuy === 'buy_with_Cash' ? true : false}  color={'#575757'} selectedColor={COLORS.blue} style={styles.quesCheckBox} />
                                    <Text onPress={ () => this.checkPay('buy_with_Cash')} style={[styles.check]}>{ i18n.t('recievePay') }</Text>
                                </View>
                                <View style={[styles.directionRow  , styles.w100 , styles.mt15]}>
                                    <Radio onPress={ () => this.checkPay('buy_with_visa')} selected={this.state.kindBuy === 'buy_with_visa' ? true : false} color={'#575757'} selectedColor={COLORS.blue} style={styles.quesCheckBox} />
                                    <Text onPress={ () => this.checkPay('buy_with_visa')} style={[styles.check]}>{ i18n.t('byVisa') }</Text>
                                </View>
                                <View style={[styles.directionRow  , styles.w100 , styles.mt15]}>
                                    <Radio onPress={ () => this.checkPay('buy_with_wallet')} selected={this.state.kindBuy === 'buy_with_wallet' ? true : false}  color={'#575757'} selectedColor={COLORS.blue} style={styles.quesCheckBox} />
                                    <Text onPress={ () => this.checkPay('buy_with_wallet')} style={[styles.check]}>{ i18n.t('byWallet') }</Text>
                                </View>
                            </View>
                        </View>



                        <View style={[styles.homeSection , styles.directionColumnCenter , styles.mt15]}>
                            <TouchableOpacity onPress={ () => this.send(1)} style={[styles.yellowBtn , styles.mt50, styles.mb15]}>
                                <Text style={styles.whiteText}>{i18n.t('accept')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={ ()=> { this.send(2)}} style={[styles.yellowBtn , styles.mb10, {backgroundColor:COLORS.boldGray}]}>
                                <Text style={styles.whiteText}>{i18n.t('refuse')}</Text>
                            </TouchableOpacity>
                        </View>



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
export default connect(mapStateToProps, { userLogin ,profile})(ShowPrice_client);



