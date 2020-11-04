import React, { Component } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    FlatList,
    I18nManager,
    Animated,
    KeyboardAvoidingView
} from "react-native";
import {Container, Content, Header, Button, Item, Input, Form, Accordion, Icon} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'


const height = Dimensions.get('window').height;



class PriceOrderDet_client extends Component {
    constructor(props){
        super(props);

        this.state={
        }
    }

    static navigationOptions = () => ({
        drawerLabel: () => null,
    });



    render() {


        return (
            <Container>

                <Header style={[styles.header ]} noShadow>
                    <View style={styles.directionRow}>
                        <Button onPress={() => this.props.navigation.openDrawer()} transparent style={styles.headerBtn}>
                            <Image source={require('../../assets/images/noun_menu.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                        </Button>
                        <Button onPress={() => this.props.navigation.navigate('notification_client')} transparent style={styles.headerBtn}>
                            <Image source={require('../../assets/images/notification.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                        </Button>
                    </View>

                    <Text style={[styles.headerText , {right:0} ]}>{i18n.t('orderDet')}</Text>

                    <View style={styles.directionRow}>
                        <View>
                            <Button onPress={() => this.props.navigation.navigate('cart_client')} transparent  style={styles.headerBtn}>
                                <Image source={require('../../assets/images/shopping_basket.png')} style={styles.headerMenu} resizeMode={'contain'} />
                            </Button>
                            <View style={styles.cartNum}>
                                <Text style={styles.cartNumText}>12</Text>
                            </View>
                        </View>
                        <Button onPress={() => this.props.navigation.goBack()} transparent  style={styles.headerBtn}>
                            <Image source={require('../../assets/images/arrow_left.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                        </Button>
                    </View>
                </Header>

                <Content contentContainerStyle={styles.flexGrow} style={{}} >
                    <View style={[styles.w100 , styles.mt15 , {flex:1}]}>
                        <View style={[styles.notiBlock , {padding:7 , marginBottom:15 , marginHorizontal:23}]}>
                            <Image source={require('../../assets/images/blurred.png')} resizeMode={'cover'} style={styles.restImg}/>
                            <View style={[styles.directionColumn , {flex:1}]}>
                                <View style={[styles.directionRow ]}>
                                    <Text style={[styles.boldGrayText ]}>اسم الاسرة</Text>
                                </View>
                                <View style={[styles.locationView]}>
                                    <Text style={[styles.grayText , {fontSize:12} ]}>9/7/2019</Text>
                                </View>
                            </View>
                            <View style={[styles.directionColumnCenter , { borderLeftWidth : 1 , borderLeftColor:'#f2f2f2' , paddingLeft:10}]}>
                                <View style={[styles.directionRow ]}>
                                    <Text style={[styles.boldGrayText , {color:COLORS.blue} ]}>{i18n.t('orderNum')}</Text>
                                </View>
                                <View style={[styles.locationView]}>
                                    <Text style={[styles.grayText, {fontSize:12} ]}>12345</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.backTitle}>
                            <Text style={[styles.yellowText, styles.asfs , {fontSize:15}]}>{i18n.t('orderDet')}</Text>
                        </View>

                        <View>
                            <View style={[styles.notiBlock , {paddingHorizontal:30 , paddingVertical:7 , marginTop:5  , marginBottom:0}]}>
                                <View style={{flex:1}}>
                                    <Text style={[styles.boldGrayText , styles.asfs ]}>اسم المنتج</Text>
                                </View>
                                <View style={[styles.directionRow , { borderLeftWidth : 1 , borderLeftColor:'#f2f2f2' , paddingLeft:10}]}>
                                    <Text style={[styles.boldGrayText , {color:COLORS.blue , marginRight:5} ]}>25.00</Text>
                                    <Text style={[styles.boldGrayText ]}>{i18n.t('RS')}</Text>
                                </View>
                            </View>
                            <View style={[styles.notiBlock , {paddingHorizontal:30 , paddingVertical:7 , marginTop:5 , marginBottom:0 }]}>
                                <View style={{flex:1}}>
                                    <Text style={[styles.boldGrayText , styles.asfs]}>اسم المنتج</Text>
                                </View>
                                <View style={[styles.directionRow , { borderLeftWidth : 1 , borderLeftColor:'#f2f2f2' , paddingLeft:10}]}>
                                    <Text style={[styles.boldGrayText , {color:COLORS.blue , marginRight:5} ]}>25.00</Text>
                                    <Text style={[styles.boldGrayText ]}>{i18n.t('RS')}</Text>
                                </View>
                            </View>
                            <View style={[styles.notiBlock , {paddingHorizontal:30 , paddingVertical:7 , marginTop:5 , marginBottom:0 }]}>
                                <View style={{flex:1}}>
                                    <Text style={[styles.boldGrayText , styles.asfs]}>اسم المنتج</Text>
                                </View>
                                <View style={[styles.directionRow , { borderLeftWidth : 1 , borderLeftColor:'#f2f2f2' , paddingLeft:10}]}>
                                    <Text style={[styles.boldGrayText , {color:COLORS.blue , marginRight:5} ]}>25.00</Text>
                                    <Text style={[styles.boldGrayText ]}>{i18n.t('RS')}</Text>
                                </View>
                            </View>


                            <View style={styles.mb15}>
                                <View style={[styles.backTitle , styles.mt25 , styles.mb15]}>
                                    <Text style={[styles.yellowText , styles.asfs, {fontSize:15}]}>{i18n.t('paymentMethod')}</Text>
                                </View>
                                <Text style={[styles.check, styles.asfs , {marginHorizontal: 30}]}>الدفع عند الاستلام</Text>
                            </View>

                            <View style={styles.mb15}>
                                <View style={[styles.backTitle , styles.mb15]}>
                                    <Text style={[styles.yellowText, styles.asfs , {fontSize:15}]}>{i18n.t('deliveryDetails')}</Text>
                                </View>
                                <View style={[ styles.mb15 , {paddingHorizontal:30}]}>
                                    <Text style={[styles.check , styles.asfs, {fontSize: 13}]}>{i18n.t('deliveryLocation')}</Text>
                                    <View style={[styles.directionRowSpace , styles.mt15]}>
                                        <View style={[styles.locationView , {marginTop:0}]}>
                                            <Image source={require('../../assets/images/maps.png')} style={[styles.locationImg]} resizeMode={'contain'} />
                                            <Text style={[styles.grayText , {fontSize:12} ]}>الرياض - المملكة العربية السعودية</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('location_client')}>
                                            <Text style={[styles.grayText , {color:COLORS.blue,fontSize:12} ]}>( {i18n.t('seeLocation')} )</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{paddingHorizontal:30}}>
                                    <Text style={[styles.check , styles.asfs, {fontSize: 13}]}>{i18n.t('deliveryTime')}</Text>
                                    <View style={[styles.directionRowSpace , styles.mt15]}>
                                        <Text style={[styles.grayText , {fontSize:12} ]}>9/7/2020</Text>
                                        <Text style={[styles.grayText , {fontSize:12} ]}>8:00ص</Text>
                                    </View>
                                </View>
                            </View>

                        </View>


                        <TouchableOpacity style={[styles.redBtn , styles.mt50, {borderRadius: 0, height: 50 }]}>
                            <Text style={styles.whiteText}>{i18n.t('cancelOrder')}</Text>
                        </TouchableOpacity>

                    </View>
                </Content>


            </Container>

        );
    }
}

export default PriceOrderDet_client;
