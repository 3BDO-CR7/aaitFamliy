import React, { Component } from "react";
import {
    View,
    Text,
    Image,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity,
    ImageBackground, FlatList,I18nManager
} from "react-native";
import {Container, Content, Header, Button , } from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
// import {DoubleBounce} from "react-native-loader";
import axios from "axios";
import CONST from "../consts/colors";
import {NavigationEvents} from "react-navigation";
import {connect}         from "react-redux";
import {profile, userLogin} from "../actions";
import * as Notifications from 'expo-notifications';

const height = Dimensions.get('window').height;

class SpecialOrders_client extends Component {
    constructor(props){
        super(props);

        this.state={
            orderType:0,
            isLoaded:false,
            current_orders          : [],
            finishedOrders  : [],
            priceOrders     : [],
        }
    }

    async componentWillMount(){
        Notifications.addListener(this.handleNotification.bind(this));
        this.getResults();
    }

    handleNotification(notification){
        if (notification && notification.origin === 'received') {
            this.componentWillMount();
        }
    }

    renderLoader(){
        if (this.state.isLoaded){
            return(
                <View style={{ alignItems: 'center', justifyContent: 'center', height: (height-100) , alignSelf:'center' , backgroundColor: '#FFF' , width:'100%' , position:'absolute' , zIndex:1  }}>
                    <ActivityIndicator size="large" color={COLORS.red} />
                </View>
            );
        }
    }

    getResults() {
        this.setState({ isLoaded: true });
        axios({
            method     : 'post',
            url        :  CONST.url + 'getOrdersUser',
            data       :  {
                type   :'runPrivate'
            },
            headers    : {
                lang             :     ( this.props.lang ) ?  this.props.lang : 'ar',
                user_id          :      this.props.auth.data.user_id,
            }
        }).then(response => {

            this.setState({isLoaded: false});

            axios({
                method     : 'post',
                url        :  CONST.url + 'getOrdersUser',
                data       :  {
                    type   :'finishPrivate'
                },
                headers    : {
                    lang             :     ( this.props.lang ) ?  this.props.lang : 'ar',
                    user_id          :      this.props.auth.data.user_id,
                }
            }).then(response => {
                if(response.data.status === '1')
                {
                    this.setState({
                        finishedOrders               : response.data.data,
                    });
                }

            });

            axios({
                method     : 'post',
                url        :  CONST.url + 'getOrdersUser',
                data       :  {
                    type   :'needPrice'
                },
                headers    : {
                    lang             :     ( this.props.lang ) ?  this.props.lang : 'ar',
                    user_id          :      this.props.auth.data.user_id,
                }
            }).then(response => {
                if(response.data.status === '1')
                {
                    this.setState({
                        priceOrders               : response.data.data,
                    });
                }

            }).then(()=>{
                this.setState({ isLoaded: false });
            });;

            if(response.data.status === '1') {
                this.setState({
                    current_orders: response.data.data,
                });
            }
        }).catch(error => {
            this.setState({isLoaded: false});
        })
    }

    onFocus(){
        this.componentWillMount();
    }

    static navigationOptions = () => ({
        drawerLabel:  i18n.t('specialOrders')  ,
        drawerIcon: (<Image source={require('../../assets/images/noun_orderr.png')} style={styles.drawerImg} resizeMode={'contain'} /> )
    });

    _keyExtractor = (item, index) => item.id;

    priceOrder = (item) => {
        return(
            <TouchableOpacity onPress={() => this.props.navigation.navigate('followOrder_client',{
                item_id : item.item_id
            })} style={[styles.notiBlock , {padding:7}]}>
                <Image source={{uri : item.imageProfile}} resizeMode={'cover'} style={styles.restImg}/>
                <View style={[styles.directionColumn , {flex:1}]}>
                    <View style={[styles.directionRow ]}>
                        <Text style={[styles.boldGrayText ]}>{item.placeName}</Text>
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

    underOrders = (item) => {
        return(
            <TouchableOpacity onPress={() => this.props.navigation.navigate('followOrder_client',{
                item_id : item.item_id
            })} style={[styles.notiBlock , {padding:7}]}>
                <Image source={{uri : item.imageProfile}} resizeMode={'cover'} style={styles.restImg}/>
                <View style={[styles.directionColumn , {flex:1}]}>
                    <View style={[styles.directionRow ]}>
                        <Text style={[styles.boldGrayText ]}>{item.placeName}</Text>
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
            <TouchableOpacity  style={[styles.notiBlock , {padding:7}]}>
                <Image source={{uri : item.imageProfile}} resizeMode={'cover'} style={styles.restImg}/>
                <View style={[styles.directionColumn , {flex:1}]}>
                    <View style={[styles.directionRow ]}>
                        <Text style={[styles.boldGrayText ]}>{item.placeName}</Text>
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

    renderOrders(){
        if(this.state.orderType === 0){
            return(
                <View>
                <FlatList
                    data={this.state.priceOrders}
                    renderItem={({item}) => this.priceOrder(item)}
                    numColumns={1}
                    keyExtractor={this._keyExtractor}
                />
                    {
                        (this.state.priceOrders.length === 0 && this.state.isLoaded === false)
                            ?
                            <View style={{flex : 1, alignSelf:  'center', marginVertical: 30 }}>
                                <Image style={{resizeMode : 'contain' , width : 300 , height : 300  }} source={ require('../../assets/images/no_result.png') }/>
                            </View>
                            :
                            <View/>
                    }
                </View>
            )
        } else if(this.state.orderType === 1){
            return(
                <View>
                <FlatList
                    data={this.state.current_orders}
                    renderItem={({item}) => this.underOrders(item)}
                    numColumns={1}
                    keyExtractor={this._keyExtractor}
                />
                    {
                        (this.state.current_orders.length === 0 && this.state.isLoaded === false)
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
                    <View style={styles.directionRow}>
                        <Button onPress={() => this.props.navigation.openDrawer()} transparent style={styles.headerBtn}>
                            <Image source={require('../../assets/images/noun_menu.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                        </Button>

                    </View>

                    <Text style={[styles.headerText ]}>{i18n.t('specialOrders')}</Text>

                    <View style={styles.directionRow}>

                    </View>
                </Header>
                <NavigationEvents onWillFocus={() => this.onFocus()} />

                <Content contentContainerStyle={styles.flexGrow} style={{}} >
                    <ImageBackground source={require('../../assets/images/bg.png')} resizeMode={'cover'} style={styles.imageBackground}>


                        <View style={[styles.orderTabs]}>
                            <TouchableOpacity onPress={ () => this.setState({orderType:0})} style={[this.state.orderType === 0 ? styles.activeTab : styles.normalTab , {width:'auto'}]}>
                                <Text style={this.state.orderType === 0 ? styles.activeTabText :styles.normalTabText} >{i18n.t('needPrice')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={ () => this.setState({orderType:1})} style={[this.state.orderType === 1 ? styles.activeTab : styles.normalTab , {width:'auto'}]}>
                                <Text style={this.state.orderType === 1 ? styles.activeTabText :styles.normalTabText} >{i18n.t('orderInProgress')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={ () => this.setState({orderType:2})} style={[this.state.orderType === 2 ? styles.activeTab : styles.normalTab , {width:I18nManager.isRTL ?'auto' :'100%'}]}>
                                <Text style={this.state.orderType === 2 ? styles.activeTabText :styles.normalTabText} >{i18n.t('finishedOrders')}</Text>
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
export default connect(mapStateToProps, { userLogin ,profile})(SpecialOrders_client);




