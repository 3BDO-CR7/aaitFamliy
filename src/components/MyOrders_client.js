import React, { Component } from "react";
import {
    View,
    Text,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    ImageBackground, FlatList,
} from "react-native";
import {Container, Content, Header, Button, Toast,} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
import {connect}         from "react-redux";
import {profile, userLogin} from "../actions";
import axios from "axios";
import CONST from "../consts/colors";
// import {DoubleBounce} from "react-native-loader";
import {NavigationEvents} from "react-navigation";


class MyOrders_client extends Component {
    constructor(props){
        super(props);

        this.state={
            orderType       : 0,
            isLoaded        : false,
            current_orders  : [],
            finishedOrders  : [],
            All_orders      : [],
            type            : 'runPublic'
        }
    }

    componentWillMount(){

        axios({
            method     : 'post',
            url        :  CONST.url + 'getOrdersUser',
            data       :  {
                type   : this.state.type
            },
            headers    : {
                lang             :     ( this.props.lang ) ?  this.props.lang : 'ar',
                user_id          :      this.props.auth.data.user_id,
            }
        }).then(response => {

            if(response.data.status === '1') {
                this.setState({
                    All_orders      : response.data.data,
                });
            }

        }).catch(error => {

        }).then(()=>{
            this.setState({ isLoaded: false });
        });

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

    getResults(type, orderType) {

        this.setState({isLoaded : true,});

        this.state.orderType    = orderType;
        this.state.type         = type;

        axios({
            method     : 'post',
            url        :  CONST.url + 'getOrdersUser',
            data       :  {
                type   : this.state.type
            },
            headers    : {
                lang             :     ( this.props.lang ) ?  this.props.lang : 'ar',
                user_id          :      this.props.auth.data.user_id,
            }
        }).then(response => {

            if(response.data.status === '1') {
                this.setState({
                    All_orders      : response.data.data,
                });
            }

        }).catch(error => {

        }).then(()=>{
            this.setState({ isLoaded: false });
        });

    }

    onFocus(){
        this.componentWillMount();
    }

    static navigationOptions = () => ({
        drawerLabel:  i18n.t('myOrders')  ,
        drawerIcon: (<Image source={require('../../assets/images/noun_order.png')} style={styles.drawerImg} resizeMode={'contain'} /> )
    });

    _keyExtractor = (item, index) => item.id;

    allOrders = (item) => {
        return(
            <TouchableOpacity onPress={() => this.props.navigation.navigate('followOrder_client' ,{
                place_id : item.place_id,
                item_id  : item.item_id
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
    };

    renderOrders(){
        return(
            <View>
                <FlatList
                    data={this.state.All_orders}
                    renderItem={({item}) => this.allOrders(item)}
                    numColumns={1}
                    keyExtractor={this._keyExtractor}
                />

                {
                    (this.state.All_orders.length === 0 && this.state.isLoaded === false)
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

    render() {

        return (
            <Container>

                <NavigationEvents onWillFocus={() => this.onFocus()} />
                { this.renderLoader() }

                <Header style={[styles.header ]} noShadow>
                    <View style={styles.directionRow}>
                        <Button onPress={() => this.props.navigation.openDrawer()} transparent style={styles.headerBtn}>
                            <Image source={require('../../assets/images/noun_menu.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                        </Button>

                    </View>

                    <Text style={[styles.headerText ]}>{i18n.t('myOrders')}</Text>

                    <View style={styles.directionRow}>

                    </View>
                </Header>

                <Content contentContainerStyle={styles.flexGrow} style={{}} >

                    <ImageBackground source={require('../../assets/images/bg.png')} resizeMode={'cover'} style={styles.imageBackground}>


                        <View style={styles.orderTabs}>
                            <TouchableOpacity onPress={ () => this.getResults('runPublic', 0)} style={this.state.orderType === 0 ? styles.activeTab : styles.normalTab}>
                                <Text style={this.state.orderType === 0 ? styles.activeTabText :styles.normalTabText} >{i18n.t('orderInProgress')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={ () => this.getResults('finishPublic', 1)} style={this.state.orderType === 1 ? styles.activeTab : styles.normalTab}>
                                <Text style={this.state.orderType === 1 ? styles.activeTabText :styles.normalTabText} >{i18n.t('finishedOrders')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={ () => this.getResults('cancelPublic', 2)} style={this.state.orderType === 2 ? styles.activeTab : styles.normalTab}>
                                <Text style={this.state.orderType === 2 ? styles.activeTabText :styles.normalTabText} >{i18n.t('cancelorder')}</Text>
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
export default connect(mapStateToProps, { userLogin ,profile})(MyOrders_client);
