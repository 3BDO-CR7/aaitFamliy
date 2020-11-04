import React, { Component } from "react";
import {
    View,
    Text,
    Image,
    Animated,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity,
    FlatList,
    I18nManager
} from "react-native";
import {Container, Content, Header, Button, Item, Input, CheckBox, Icon} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
import StarRating from 'react-native-star-rating';


const height = Dimensions.get('window').height;

class FamilyProductDet_client extends Component {
    constructor(props){
        super(props);

        this.state={
            backgroundColor: new Animated.Value(0),
            availabel: 0,
            starCount:3,
            activeType:0,
            value:1,
            selectedId: 0,
        }
    }

    static navigationOptions = () => ({
        drawerLabel: () => null,
    });
    checkAdd(addId){
        this.setState({ selectedId: addId });

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
        this.setState({value: this.state.value + 1 })
    }

    decrement(){
        if (this.state.value > 1)
            this.setState({value: this.state.value - 1})
    }




    render() {
        const backgroundColor = this.state.backgroundColor.interpolate({
            inputRange: [0, 1],
            outputRange: ['rgba(0, 0, 0, 0)', '#00000099']
        });

        return (
            <Container>

                <Header style={[styles.header , {backgroundColor:'transparent' , paddingLeft:0 , paddingRight:0} ]} noShadow>
                    <Animated.View style={[styles.animatedHeader ,{ backgroundColor: backgroundColor}]}>
                        <View style={styles.directionRow}>
                            <Button onPress={() => this.props.navigation.openDrawer()} transparent style={styles.headerBtn}>
                                <Image source={require('../../assets/images/noun_menu.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                            </Button>
                            <Button onPress={() => this.props.navigation.navigate('notification_client')} transparent style={styles.headerBtn}>
                                <Image source={require('../../assets/images/notification.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                            </Button>
                        </View>

                        <Text style={[styles.headerText , {right:0} ]}>{i18n.t('productDet')}</Text>

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
                    </Animated.View>
                </Header>

                <Content contentContainerStyle={styles.flexGrow} style={styles.homecontent} onScroll={e => this.headerScrollingAnimation(e) }>

                    <View style={[styles.headImg, {borderBottomLeftRadius:25 ,borderBottomRightRadius:25 , height:250 , overflow:'hidden'}]}>
                        <Image source={require('../../assets/images/blurred.png')} style={styles.swiperimage} resizeMode={'cover'}/>
                    </View>


                    <View style={[styles.homeSection , {marginTop:20}]}>
                        <View style={[styles.directionColumn , {flex:1}]}>
                            <View style={[styles.directionRowSpace ]}>
                                <Text style={[styles.productName ]}>اسم المنتج</Text>
                                <Text style={[styles.productName , {color:COLORS.blue} ]}>25 ر.س</Text>
                            </View>
                            <View style={[styles.locationView]}>
                                <Text style={[styles.grayText , {lineHeight:22, writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'} ]}>هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة هذا النص هو مثال لنص يمكن أن يستبدل في نفس</Text>
                            </View>
                        </View>

                        <View style={styles.line}/>

                        <View style={[styles.directionColumn , {flex:1}]}>
                            <View style={[styles.directionRow , styles.locationView , {marginTop:0} ]}>
                                <Text style={[styles.productName ]}>{i18n.t('extras')}</Text>
                                <Text style={[styles.grayText ,{marginLeft:5}]}>({i18n.t('optional')})</Text>
                            </View>
                            <View style={[styles.locationView , styles.directionColumn]}>
                                <View style={[styles.directionRowSpace  , styles.w100 , styles.mt15]}>
                                    <View style={[ styles.directionRow]}>
                                        <CheckBox onPress={ () => this.checkAdd(1)} checked={this.state.selectedId == 1 ? true : false}  color={COLORS.blue} style={styles.quesCheckBox} />
                                        <Text style={[styles.check]}>اسم الاضافة</Text>
                                    </View>
                                    <Text style={[styles.check, {color:COLORS.blue}]}>500 ر.س</Text>
                                </View>
                                <View style={[styles.directionRowSpace  , styles.w100 , styles.mt15]}>
                                    <View style={[ styles.directionRow]}>
                                        <CheckBox onPress={ () => this.checkAdd(2)} checked={this.state.selectedId == 2 ? true : false} color={COLORS.blue} style={styles.quesCheckBox} />
                                        <Text style={[styles.check]}>اسم الاضافة</Text>
                                    </View>
                                    <Text style={[styles.check, {color:COLORS.blue}]}>500 ر.س</Text>
                                </View>
                                <View style={[styles.directionRowSpace  , styles.w100 , styles.mt15]}>
                                    <View style={[ styles.directionRow]}>
                                        <CheckBox onPress={ () => this.checkAdd(3)} checked={this.state.selectedId == 3 ? true : false}  color={COLORS.blue} style={styles.quesCheckBox} />
                                        <Text style={[styles.check]}>اسم الاضافة</Text>
                                    </View>
                                    <Text style={[styles.check, {color:COLORS.blue}]}>500 ر.س</Text>
                                </View>
                                <View style={[styles.directionRowSpace  , styles.w100 , styles.mt15]}>
                                    <View style={[ styles.directionRow]}>
                                        <CheckBox onPress={ () => this.checkAdd(4)} checked={this.state.selectedId == 4 ? true : false}  color={COLORS.blue} style={styles.quesCheckBox} />
                                        <Text style={[styles.check]}>اسم الاضافة</Text>
                                    </View>
                                    <Text style={[styles.check, {color:COLORS.blue}]}>500 ر.س</Text>
                                </View>
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
                                    <Text style={[styles.countText ]}>{this.state.value}</Text>
                                    <TouchableOpacity onPress={() => this.decrement()} style={styles.touchMinus}>
                                        <Icon type={'Entypo'} name={'minus'} style={styles.minus} />
                                    </TouchableOpacity>
                                </View>
                                <View style={[ styles.total]}>
                                    <Text style={[styles.check]}>{i18n.t('total')}</Text>
                                    <Text style={[styles.check, {color:COLORS.blue , marginLeft:10}]}>20.00 ر.س</Text>
                                </View>
                                <TouchableOpacity onPress={ () => this.props.navigation.navigate('orderNow_client')} style={[styles.orderNowBtn , styles.mb15]}>
                                    <Text style={styles.whiteText}>{i18n.t('orderNow')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={ () => this.props.navigation.navigate('orderDet_client')} style={[styles.yellowBtn , {width:'90%'}]}>
                                    <Text style={styles.whiteText}>{i18n.t('bookLater')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                </Content>
            </Container>

        );
    }
}

export default FamilyProductDet_client;
