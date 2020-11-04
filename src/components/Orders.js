import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, Dimensions, ActivityIndicator, I18nManager, ImageBackground} from "react-native";
import {Container, Content, Header, Button, Item, Input, Form, Toast,Icon} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
import axios from "axios";
import CONST from "../consts/colors";
// import Spinner from "react-native-loading-spinner-overlay";
import {connect}         from "react-redux";
import {profile, userLogin} from "../actions";
// import {DoubleBounce} from "react-native-loader";
import {NavigationEvents} from "react-navigation";


const height = Dimensions.get('window').height;

class Orders extends Component {
    constructor(props){
        super(props);

        this.state=
            {
                who_are_we : '',
                isLoaded   : false,
                orderType  : 0 ,
                waiting    : [],
                finished   : []
            }
    }

    static navigationOptions = () => ({
        drawerLabel:  i18n.t('orders_')  ,
        drawerIcon: (<Image source={require('../../assets/images/noun_Info.png')} style={styles.drawerImg} resizeMode={'contain'} /> )
    });

    renderLoader(){
        if (this.state.isLoaded){
            return(
                <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' , alignSelf:'center' , backgroundColor: '#FFF' , width:'100%' , position:'absolute' , zIndex:99,top : 0, right : 0  }}>
                    <ActivityIndicator size="large" color={COLORS.red} />
                </View>
            );
        }
    }
    onFocus(){
        this.componentWillMount();
    }

    componentWillUnmount(){
        this.setState({orderType : 0})
    }

    componentWillMount()
    {

        this.setState({ isLoaded: true });

        axios({
            method     : 'post',
            url        :  CONST.url + 'getAllSettlement',
            data       :  {
                Settlement : true
            },
            headers    : {
                lang                 :    (this.props.lang) ? this.props.lang : 'ar',
                delegate_id          :    this.props.auth.data.user_id ,
            }
        }).then(response => {


            axios({
                method     : 'post',
                url        :  CONST.url + 'getAllSettlement',
                data       :  {
                    Settlement : false
                },
                headers    : {
                    lang                 :    (this.props.lang) ? this.props.lang : 'ar',
                    delegate_id          :    this.props.user.user_id  ,
                }
            }).then(response => {

                if(response.data.status === '1')
                {
                    this.setState({waiting : response.data.data})
                }
            });

            if(response.data.status === '1')
            {
                this.setState({finished : response.data.data})
            }

        }).catch(error => {

        }).then(()=>{
            this.setState({ isLoaded: false });
        });

    }
    render() {
        return (
            <Container>
                <NavigationEvents onWillFocus={() => this.onFocus()} />
                <Header style={[styles.header ]} noShadow>
                    <View style={styles.directionRow}>
                        <Button onPress={() => this.props.navigation.openDrawer()} transparent style={styles.headerBtn}>
                            <Image source={require('../../assets/images/noun_menu.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                        </Button>
                    </View>
                    <Text style={[styles.headerText ]}>{i18n.t('orders_')}</Text>
                    <View style={styles.directionRow}>
                    </View>
                </Header>
                 { this.renderLoader() }
                <Content contentContainerStyle={styles.flexGrow} style={{}} >
                    <ImageBackground source={require('../../assets/images/bg.png')} resizeMode={'cover'} style={styles.imageBackground}>


                        <View style={styles.orderTabs}>
                            <TouchableOpacity onPress={ () => this.setState({orderType:0})} style={this.state.orderType === 0 ? styles.activeTab : styles.normalTab}>
                                <Text style={this.state.orderType === 0 ? styles.activeTabText :styles.normalTabText} >{i18n.t('set_order')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={ () => this.setState({orderType:1})} style={this.state.orderType === 1 ? styles.activeTab : styles.normalTab}>
                                <Text style={this.state.orderType === 1 ? styles.activeTabText :styles.normalTabText} >{i18n.t('not_set_order')}</Text>
                            </TouchableOpacity>
                        </View>
                        {
                            (this.state.orderType === 1)

                            ?
                                <View style={{}}>
                                    <View style={[styles.section]}>
                                        <Text style={styles.texto}>#</Text>
                                        <Text style={styles.texto}>{i18n.t('dlever')}</Text>
                                        <Text style={styles.texto}>{i18n.t('commis')}</Text>
                                        <Text style={styles.texto}>{i18n.t('total')}</Text>
                                        <Text style={styles.texto}>{i18n.t('confirm')}</Text>
                                    </View>

                                    {
                                        (  this.state.waiting.length > 0 )
                                            ?
                                            this.state.waiting.map((order,key)=> {
                                                return(
                                            <View>


                                                <View style={[styles.section]}>
                                                    <Text style={[styles.texto,{color : COLORS.red}]}>{order.SendNumber}</Text>
                                                    <Text style={[styles.texto,{color : COLORS.gray}]}>{order.deliveryPrice}</Text>
                                                    <Text style={[styles.texto,{color : COLORS.gray}]}>{order.appPercent}</Text>
                                                    <Text style={[styles.texto,{color : COLORS.blue}]}>{order.totalPrice}</Text>
                                                    <TouchableOpacity onPress={()=>{this.props.navigation.navigate('OrderDetails',{
                                                        item_id  : order.item_id,
                                                        order_type : 'wait'
                                                    })}}>
                                                        <Text style={[styles.texto, {color : '#00b300'}]}>{i18n.t('accept')}</Text>
                                                    </TouchableOpacity>
                                                </View>


                                            </View>
                                                )
                                            })
                                            :null
                                    }



                                    {
                                        (this.state.waiting.length === 0  )
                                            ?
                                            <View style={{flex : 1, alignSelf:  'center', marginVertical: 30  , width : '100%'}}>
                                                <Image style={{resizeMode : 'contain' , width : 300 , height : 300  }} source={ require('../../assets/images/no_result.png') }/>
                                            </View>
                                            :
                                            <View/>
                                    }



                                </View>
                                :

                                <View style={{marginVertical : 5}}>
                                    {
                                        (this.state.finished.length > 0 )
                                            ?
                                            <View style={[styles.section]}>
                                                <Text style={styles.texto}>#</Text>
                                                <Text style={styles.texto}>{i18n.t('dlever')}</Text>
                                                <Text style={styles.texto}>{i18n.t('commis')}</Text>
                                                <Text style={styles.texto}>{i18n.t('total')}</Text>
                                            </View>
                                            :null
                                    }
                                    {
                                        ( this.state.finished.length === 0)
                                            ?
                                            <View style={{flex : 1, alignSelf:  'center', marginVertical: 30  , width : '100%'}}>
                                                <Image style={{resizeMode : 'contain' , width : 300 , height : 300  }} source={ require('../../assets/images/no_result.png') }/>
                                            </View>
                                            :
                                            <View/>
                                    }
                                    <View style={{marginVertical : 1}}>
                                        {
                                            this.state.finished.map((order,key)=> {
                                                return(
                                                    <TouchableOpacity onPress={()=> this.props.navigation.navigate('OrderDetails',{
                                                        item_id  : order.item_id,
                                                        order_type : 'done'
                                                    })} key={key} style={[styles.homeSections, {marginVertical : 1} ]}>
                                                        <View style={[styles.section]}>
                                                                <Text style={[styles.texto,{color : COLORS.red}]}>{order.SendNumber}</Text>
                                                                <Text style={[styles.texto,{color : COLORS.gray}]}>{order.deliveryPrice}</Text>
                                                                <Text style={[styles.texto,{color : COLORS.gray}]}>{order.appPercent}</Text>
                                                                <Text style={[styles.texto,{color : COLORS.blue}]}>{order.totalPrice}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                )
                                            })
                                        }
                                    </View>

                                </View>

                        }

                    </ImageBackground>
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

export default connect(mapStateToProps, { userLogin , profile})(Orders);


