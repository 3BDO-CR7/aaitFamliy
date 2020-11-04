import React, { Component } from "react";
import {View, Text, Image, Share, TouchableOpacity} from "react-native";
import {Container, Content, Toast} from 'native-base';
import {DrawerItems} from 'react-navigation';
import styles from "../../assets/styles";
import {connect}         from "react-redux";
import { userLogin, profile ,logout ,tempAuth} from '../actions'
import axios from "axios";
import CONST from "../consts/colors";
import i18n from '../../locale/i18n'

class DrawerCustomization_client extends Component {
    constructor(props){
        super(props);
        this.state={
            user         : [],
            name         : i18n.t('guest'),
            imageProfile : 'https://cross.4hoste.com:30011/images/defaultUser.jpg',
        }
    }

    componentWillMount()
    {

    }

    logout(){
        if(this.props.user)
        {
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
        }else{
            this.props.navigation.navigate('user');
        }



    }

    onShare = async () => {
        try {
            const result = await Share.share({
                message:'http://s.ll.sa/comming',
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {}
    };

    render() {
        return (
            <Container>
                <Content style={{backgroundColor:'#fff'}}>
                    <View style={styles.sideView}>
                         <Image source={require('../../assets/images/bgsidemenu.png')} resizeMode={'cover'} style={styles.bgSideMenu}/>
                         <View style={styles.sideImgView}>
                             <View style={styles.sideProfileImg}>
                                 <Image source={{uri : (this.props.user) ? this.props.user.imageProfile :'https://cross.4hoste.com:30011/images/defaultUser.jpg' }} resizeMode={'cover'} style={styles.swiperimage}/>
                             </View>
                             <Text style={styles.sideName}>{ ( this.props.user) ?  this.props.user.userName :  i18n.t('guest')}</Text>
                         </View>
                    </View>
                    <DrawerItems {...this.props}
                                 onItemPress={
                                     (route, focused) => {
                                         if (route.route.key === 'logout_client') {
                                             this.logout()
                                         }else if(route.route.key === 'shareApp_client'){
                                            this.onShare();
                                         }else if(route.route.key === 'login'){
                                            this.props.navigation.navigate('user');
                                         }else {
                                             this.props.navigation.navigate(route.route.key)
                                         }
                                     }
                                 }
                                 animationEnabled={true}
                                 activeBackgroundColor='transparent' inactiveBackgroundColor='transparent' activeLabelStyle={{color:'#5d5d5d'}}
                                 labelStyle={styles.drawerLabel} iconContainerStyle ={styles.drawerIcon}
                                 itemStyle  = {styles.drawerItemStyle} itemsContainerStyle ={{}}
                                 items={ this.props.items.filter((item) =>  this.filterItems(item) ) }

                    />

                    {
                        (!this.props.user) ?

                            <View>
                                <TouchableOpacity style={[styles.bg_red, styles.height_50, styles.Width_100, styles.flexCenter, styles.marginVertical_5 ]} onPress={ () => this.props.navigation.navigate('login_client', {type : 'user'})}>
                                    <Text style={[styles.textRegular, styles.textSize_16, styles.text_White, styles.textCenter]}>{i18n.translate('asUser')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.bg_red , styles.height_50, styles.Width_100, styles.flexCenter, styles.marginVertical_5 ]} onPress={ () => this.props.navigation.navigate('login_client' , {type : 'delegate'})}>
                                    <Text style={[styles.textRegular, styles.textSize_16, styles.text_White, styles.textCenter]}>{i18n.translate('asDelegate')}</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            <View />

                    }

                    </Content>

            </Container>
        );
    }


    filterItems(item){
      if(this.props.user){
          if(this.props.user.userType === 'user'){
              return item.routeName !== 'home_delegate' && item.routeName !== 'orderDet_delegate' && item.routeName !== 'profile_delegate'
                  && item.routeName !== 'myOrders_delegate' && item.routeName !== 'followOrder_delegate'  && item.routeName !== 'Orders'  && item.routeName !== 'location_delegate'&& item.routeName !== 'login'||  item.routeName == 'wallet_client'|| item.routeName === 'logout_client'
          }else{
              return item.routeName !== 'home_client'  && item.routeName !== 'profile_client' && item.routeName !== 'myOrders_client'
                  && item.routeName !== 'specialOrders_client' && item.routeName !== 'cart_client'  && item.routeName !== 'Locations' && item.routeName !== 'login' &&  item.routeName == 'wallet_client' || item.routeName === 'logout_client'
          }
      }else{
          return item.routeName === 'home_client' || item.routeName === 'language_client' || item.routeName === 'policy_client' ||  item.routeName === 'shareApp_client' ||  item.routeName === 'login'  ;
      }
    }
}
const mapStateToProps = ({ auth,profile, lang  }) => {

    return {
        auth        : auth.user,
        lang        : lang.lang,
        user        : profile.user,

    };
};

export default connect(mapStateToProps, { userLogin , profile,tempAuth ,logout})(DrawerCustomization_client);




