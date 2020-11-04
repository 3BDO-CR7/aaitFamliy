import React, { Component } from "react";
import {
    View,
    Text,
    Image,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity,
    ImageBackground, FlatList,
} from "react-native";
import {Container, Content, Header, Button, Toast,} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
// import {DoubleBounce} from "react-native-loader";
import {connect}         from "react-redux";
import {profile, userLogin} from "../actions";
import axios from "axios";
import CONST from "../consts/colors";
import {NavigationEvents} from "react-navigation";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";


const orders=[
    {id:1 , name:'اسم المطعم', date:'9/7/2019', orderNo :'123456' ,  image:require('../../assets/images/blurred.png')},
    {id:2 , name:'اسم الاسرة', date:'9/7/2019', orderNo :'123456' ,  image:require('../../assets/images/blurred.png')},
    {id:3 , name:'اسم المطعم', date:'9/7/2019', orderNo :'123456' ,  image:require('../../assets/images/blurred.png')},
    {id:4 , name:'اسم الاسرة', date:'9/7/2019', orderNo :'123456' ,  image:require('../../assets/images/blurred.png')},
]
const finishedOrders=[
    {id:1 , name:'اسم المطعم', date:'9/7/2019', orderNo :'123456' ,  image:require('../../assets/images/blurred.png')},
    {id:2 , name:'اسم الاسرة', date:'9/7/2019', orderNo :'123456' ,  image:require('../../assets/images/blurred.png')},
    {id:3 , name:'اسم المطعم', date:'9/7/2019', orderNo :'123456' ,  image:require('../../assets/images/blurred.png')},
    {id:3 , name:'اسم الاسرة', date:'9/7/2019', orderNo :'123456' ,  image:require('../../assets/images/blurred.png')},
    {id:4 , name:'اسم المطعم', date:'9/7/2019', orderNo :'123456' ,  image:require('../../assets/images/blurred.png')},
]


const height = Dimensions.get('window').height;

class MyOrders_delegate extends Component {
    constructor(props){
        super(props);

        this.state={
            orderType       : 0,
            lat             : 0,
            long            : 0,
            orders          : [],
            finishedOrders  : [],
        }
    }



    componentWillMount(){
        setTimeout(()=> {
            this._getLocationAsync();
        },2000)
        this.state.orderType = 0;
        this.setState({ orderType  : 0 })
    }

    _getLocationAsync = async ()=>{

        this.setState({ isLoaded: true });
        let {status} = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            Toast.show({
                text        : 'Permission to access location was denied',
                duration    :  4000,
                type        : 'danger',
                textStyle   : {color: "white", textAlign: 'center'}
            });
            this.setState({ isLoaded: false });
            alert(i18n.t('open_gps'));
        } else {

            return await Location.getCurrentPositionAsync({
                enableHighAccuracy  : false,
                maximumAge          : 15000
            }).then((position) => {
                this.setState({
                    lat : position.coords.longitude,
                    long: position.coords.latitude
                });
                     axios({
                        method     : 'post',
                        url        :  CONST.url + 'getOrdersDelegate',
                        data       :  {
                            type   :'stillRun',
                            lat    : position.coords.longitude,
                            long   : position.coords.latitude
                        },
                        headers    : {
                            lang             :     ( this.props.lang ) ?  this.props.lang : 'ar',
                            delegate_id    :       this.props.auth.data.user_id,
                        }
                    }).then(response => {

                        axios({
                            method     : 'post',
                            url        :  CONST.url + 'getOrdersDelegate',
                            data       :  {
                                type   :'finishRun',
                                lat    : position.coords.longitude,
                                long   : position.coords.latitude
                            },
                            headers    : {
                                lang             :     ( this.props.lang ) ?  this.props.lang : 'ar',
                                delegate_id    :     this.props.auth.data.user_id
                            }
                        }).then(response => {
                            if(response.data.status === '1')
                            {
                                this.setState({
                                    finishedOrders               : response.data.data,
                                });
                            }
                        });

                        if(response.data.status === '1') {
                            this.setState({
                                orders  : response.data.data,
                            });
                        }
                    }).catch(error => {

                    }).then(()=>{
                        this.setState({ isLoaded: false });
                    });
            });

        }
    };


    renderLoader(){
        if (this.state.isLoaded){
            return(
                <View style={{ alignItems: 'center', justifyContent: 'center', height: (height-100) , alignSelf:'center' , backgroundColor: COLORS.transparent , width:'100%' , position:'absolute' , zIndex:1  }}>
                    <ActivityIndicator size="large" color={COLORS.red} />
                </View>
            );
        }
    }

    onFocus(){
        this.componentWillMount();
    }

    static navigationOptions = () => ({
        drawerLabel:  i18n.t('orders')  ,
        drawerIcon: (<Image source={require('../../assets/images/noun_order.png')} style={styles.drawerImg} resizeMode={'contain'} /> )
    });

    _keyExtractor = (item, index) => item.id;


    renderLoader(){
        if (this.state.isLoaded){
            return(
                <View style={{ alignItems: 'center', justifyContent: 'center', height: (height-100) , alignSelf:'center' , backgroundColor: COLORS.transparent , width:'100%' , position:'absolute' , zIndex:1  }}>
                    <ActivityIndicator size="large" color={COLORS.red} />
                </View>
            );
        }
    }


    underOrders = (item) => {
        return(
            <TouchableOpacity onPress={() => this.props.navigation.navigate('followOrder_delegate' ,{
                place_id : item.place_id,
                item_id  : item.item_id
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
                        <Text style={[styles.boldGrayText , {color:COLORS.blue} ]}>{i18n.t('orderNum')}</Text>
                    </View>
                    <View style={[styles.locationView]}>
                        <Text style={[styles.grayText, {fontSize:12} ]}>{item.orderNumber}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    finishedOrder = (item) => {
        return(
            <TouchableOpacity style={[styles.notiBlock , {padding:7}]}>
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
                        <Text style={[styles.boldGrayText , {color:COLORS.blue} ]}>{i18n.t('orderNum')}</Text>
                    </View>
                    <View style={[styles.locationView]}>
                        <Text style={[styles.grayText, {fontSize:12} ]}>{item.orderNumber}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };




    renderOrders(){
        if(this.state.orderType === 0){
            return(
                <View>
                <FlatList
                    data={this.state.orders}
                    renderItem={({item}) => this.underOrders(item)}
                    numColumns={1}
                    keyExtractor={this._keyExtractor}
                />
                    {
                        (this.state.orders.length === 0 && this.state.isLoaded === false)
                            ?
                            <View style={{flex : 1, alignSelf:  'center', marginVertical: 30 }}>
                                <Image style={{resizeMode : 'contain' , width : 300 , height : 300  }} source={ require('../../assets/images/no_result.png') }/>
                            </View>
                            :
                            <View/>
                    }
                </View>
            )
        }   else {
            return(
                <View>
                <FlatList
                    data={this.state.finishedOrders}
                    renderItem={({item}) => this.finishedOrder(item)}
                    numColumns={1}
                    keyExtractor={this._keyExtractor}
                />
                    {
                        (this.state.finishedOrders.length === 0 && this.state.isLoaded === false)
                            ?
                            <View style={{flex : 1, alignSelf:  'center', marginVertical: 30 }}>
                                <Image style={{resizeMode : 'contain' , width : 300 , height : 300  }} source={ require('../../assets/images/no_result.png') }/>
                            </View>
                            :
                            <View/>
                    }
                </View>
            )
        }
    }



    render() {


        return (
            <Container>


                {this.renderLoader()}

                <Header style={[styles.header ]} noShadow>
                    <Button onPress={() => this.props.navigation.openDrawer()} transparent style={styles.headerBtn}>
                        <Image source={require('../../assets/images/noun_menu.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                    </Button>

                    <Text style={[styles.headerText , {right:0} ]}>{i18n.t('myOrders')}</Text>

                    <Button   transparent style={styles.headerBtn}>
                    </Button>
                </Header>
                <NavigationEvents onWillFocus={() => this.onFocus()} />

                <Content contentContainerStyle={styles.flexGrow} style={{}} >
                    <ImageBackground source={require('../../assets/images/bg.png')} resizeMode={'cover'} style={styles.imageBackground}>


                        <View style={styles.orderTabs}>
                            <TouchableOpacity onPress={ () => this.setState({orderType:0})} style={this.state.orderType === 0 ? styles.activeTab : styles.normalTab}>
                                <Text style={this.state.orderType === 0 ? styles.activeTabText :styles.normalTabText} >{i18n.t('orderInProgress')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={ () => this.setState({orderType:1})} style={this.state.orderType === 1 ? styles.activeTab : styles.normalTab}>
                                <Text style={this.state.orderType === 1 ? styles.activeTabText :styles.normalTabText} >{i18n.t('finishedOrders')}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.homeSection, {marginTop:20} ]}>
                            { this.renderOrders() }
                        </View>
                    </ImageBackground>
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
export default connect(mapStateToProps, { userLogin ,profile})(MyOrders_delegate);

