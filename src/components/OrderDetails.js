import React, { Component } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,

} from "react-native";
import {Container, Content, Header, Button, Toast } from 'native-base'
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

class OrderDetails extends Component {
    constructor(props){
        super(props);
        this.state   = {
            order         : '',
            place         : '',
            kindBuy       : '',
            orderStatus   : '',
            orderStatus2  : '',
            address_location      : '',
            delegate      : '',
            address       : '',
            selectedId    : 0,
            keyDelegate   : false,
            isLoaded      : false,
            isFamilyOrder : true
        }
    }

    async componentWillMount(){
        this.getResults();
    }
    onFocus(){
        this.componentWillMount();
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
                    address_location: response.data.data.address.address,
                    orderStatus     : response.data.data.orderStatus,
                    products        : response.data.data.products,
                    orderStatus2    : response.data.data.orderStatus2,
                    keyDelegate     : response.data.data.keyDelegate,
                    delegate        : response.data.data.delegate,
                });
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

    _renderContent() {
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

                <View style={styles.mb25}>
                    <View style={[styles.backTitle , styles.mb15]}>
                        <Text style={[styles.yellowText, styles.asfs , {fontSize:15}]}>{i18n.t('deliveryDetails')}</Text>
                    </View>
                    <View style={[ styles.mb15 , {paddingHorizontal:30}]}>
                        <Text style={[styles.check, styles.asfs , {fontSize: 13}]}>{i18n.t('deliveryLocation')}</Text>
                        <View style={[styles.directionRowSpace , styles.mt15]}>
                            <View style={[styles.locationView , {marginTop:0}]}>
                                <Image source={require('../../assets/images/maps.png')} style={[styles.locationImg]} resizeMode={'contain'} />
                                <Text style={[styles.grayText , {fontSize:12} ]}>{  this.state.address_location.slice(0, 45) }</Text>
                            </View>

                        </View>
                    </View>

                            <View style={{paddingHorizontal:30}}>
                                <View style={[styles.directionRowSpace , styles.mt15]}>
                                    <Text style={[styles.check, styles.asfs , {fontSize: 13}]}>{i18n.t('deliveryTime')}</Text>

                                    <Text style={[styles.grayText , {fontSize:12, color :COLORS.blue, fontFamily:'cairoBold' } ]}>{this.state.order.orderHour}</Text>
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
                            <Text style={[styles.grayText , {fontSize:12, color :COLORS.blue , fontFamily:'cairoBold'} ]}>{this.state.order.totalPrice}</Text>
                        </View>
                    </View>


                </View>

            </View>
        );
    }

    cancelConfirmOrder(){
        this.setState({ isLoaded: true });
        axios({
            method     : 'post',
            url        :  CONST.url + 'mangeSettlement',
            data       :  {
                item_id      : this.props.navigation.state.params.item_id,
            },
            headers    : {
                lang                 :     ( this.props.lang ) ?  this.props.lang : 'ar',
                delegate_id          :    this.props.user.user_id  ,
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
                this.props.navigation.navigate('Orders');
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
                        <Button onPress={() => this.props.navigation.goBack()} transparent  style={styles.headerBtn}>
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




                        {this._renderContent()}



                        {
                            (this.props.navigation.state.params.order_type === 'wait')
                                ?
                                <TouchableOpacity onPress={()=> this.cancelConfirmOrder()} style={[styles.redBtn , styles.mt50, {borderRadius: 0, height: 50 }]}>
                                    <Text style={styles.whiteText}>{i18n.t('Settlement')}</Text>
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
        auth       : auth.user,
        lang       : lang.lang,
        user       : profile.user,
    };
};

export default connect(mapStateToProps, { userLogin , profile})(OrderDetails);


