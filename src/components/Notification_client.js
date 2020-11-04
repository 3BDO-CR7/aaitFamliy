import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, Dimensions,  ActivityIndicator, I18nManager} from "react-native";
import {Container, Content, Header, Button, Item, Input, Toast} from 'native-base'
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

class Notification_client extends Component {
    constructor(props){
        super(props);

        this.state={
            notifications    : [],
            isLoaded         : false,
        }
    }

    static navigationOptions = () => ({
        drawerLabel: () => null,
    });


    onFocus(){
        this.componentWillMount();
    }

   async componentWillMount()
    {
        this.setState({ isLoaded: true });

        axios({
            method     : 'post',
            url        :  CONST.url + 'getNotification',
            data       :  {

            },
            headers    : {
                lang             :     ( this.props.lang ) ?  this.props.lang : 'ar',
                user_id          :      this.props.user.user_id
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
                this.setState({notifications : response.data.data})
            }

        }).catch(error => {

        }).then(()=>{
            this.setState({ isLoaded: false });
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

                    <Text style={[styles.headerText ]}>{ i18n.t('notifications') }</Text>

                    <View style={styles.directionRow}>

                    </View>
                </Header>

                <Content contentContainerStyle={styles.flexGrow} style={{}} >
                    <NavigationEvents onWillFocus={() => this.onFocus()} />

                    {this.renderLoader()}

                    <View style={[styles.homeSection , {marginTop:20}]}>

                        {
                            this.state.notifications.map((notification , key)=>{
                                return(
                                    <TouchableOpacity key={key} onPress={()=> this.open(notification)} style={styles.notiBlock}>
                                        <Image source={{ uri : notification.data.image}} resizeMode={'cover'} style={styles.notiImg}/>
                                        <Text style={[styles.grayText , {flex:1,writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'} ]}>{ notification.notification}</Text>
                                    </TouchableOpacity>
                                );
                            })
                        }

                        {
                            (this.state.notifications.length === 0 && this.state.isLoaded === false)
                                ?
                                <View style={{flex : 1, alignSelf:  'center', marginVertical: 30 }}>
                                    <Image style={{resizeMode : 'contain' , width : 300 , height : 300  }} source={ require('../../assets/images/no_result.png') }/>
                                </View>
                                :
                                <View/>
                        }

                    </View>
                </Content>
            </Container>

        );
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

    open(notification){
        if(notification.key === 'price'){
            this.props.navigation.navigate('showPrice_client' , {
                item_id : notification.item_id
            })
        }else if (notification.key === 'orderDelegate') {

                this.props.navigation.navigate('orderDet_delegate',{
                    item_id : notification.item_id
                })

        } else if(notification.key === 'delete' || notification.key === 'block'){
            this.logout();
        }else if (notification.key === 'orderUser') {

                this.props.navigation.navigate('followOrder_client', {
                    place_id: null,
                    item_id: notification.item_id
                });

        }else {
        }
    }


    logout(){
        axios({
            method     : 'post',
            url        :  CONST.url + 'LogOut',
            data       :  {
                device_ID : '000'
            },
            headers    : {
                lang             :    (this.props.lang) ? this.props.lang : 'ar',
                user_id          :    this.props.user.user_id  ,
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
                this.props.navigation.navigate('user');
                setTimeout(()=>{
                    this.props.logout({ token: this.props.auth.id });
                    this.props.tempAuth();
                },1500)
            }

        }).catch(error => {

        }).then(()=>{
            this.setState({ isLoaded: false });
        });
    }
}
const mapStateToProps = ({ auth,profile, lang  }) => {

    return {
        auth       : auth.user,
        lang       : lang.lang,
        user       : profile.user,
    };
};

export default connect(mapStateToProps, { userLogin , profile})(Notification_client);




