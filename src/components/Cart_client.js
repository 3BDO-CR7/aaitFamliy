import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, Dimensions, I18nManager, ActivityIndicator,FlatList} from "react-native";
import {Container, Content, Header, Button, Toast} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import axios from "axios";
import CONST from "../consts/colors";
import {connect}         from "react-redux";
import {profile, userLogin} from "../actions";
// import {DoubleBounce} from "react-native-loader";
import {NavigationEvents} from "react-navigation";


const height = Dimensions.get('window').height;

class Cart_client extends Component {
    constructor(props){
        super(props);

        this.state={
            search      : '',
            lat         : '',
            isLoaded    : true,
            long        : '',
            restaurants : [],
        };
    }

    static navigationOptions = () => ({
        drawerLabel: i18n.t('cart') ,
        drawerIcon: (<Image source={require('../../assets/images/noun_basket.png')} style={styles.drawerImg} resizeMode={'contain'} /> )
    });

    _getLocationAsync = async () => {

        let {status} = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            Toast.show({
                text: 'Permission to access location was denied',
                duration: 4000,
                type: 'danger',
                textStyle: {color: "white", textAlign: 'center'}
            });
            this.setState({ isLoaded: false });
        } else {

            return await Location.getCurrentPositionAsync({
                enableHighAccuracy: false,
                maximumAge: 15000
            }).then((position) => {
                this.setState({
                    lat         :       position.coords.longitude,
                    long        :       position.coords.latitude
                });
                setTimeout(()=> {
                    this.getResults();
                },1000)
            }).catch(error => {
                Toast.show({
                    text: i18n.t('clickMap'),
                    duration: 4000,
                    type: 'danger',
                    textStyle: {
                        color: "white",
                        fontFamily : 'cairoBold' ,
                        textAlign:'center'
                    }
                });
                this.setState({
                    isLoaded: false ,
                    lat         : null,
                    long        : null,
                });
            });
        }
    };


   async componentWillMount(){
       this._getLocationAsync();
    }

    onFocus(){
        this.setState({
            restaurants : []
        });
        this.componentWillMount();
    }


    componentWillUnmount(){
       this.setState({
           restaurants : []
       });
    }

    getResults(){
        this.setState({isLoaded: true});
        axios({
            method     : 'post',
            url        :  CONST.url + 'getAllOrderInCarts',
            data       :  {
                lat          : this.state.lat,
                long         : this.state.long,
            },
            headers    : {
                lang                 :       ( this.props.lang ) ?  this.props.lang : 'ar',
                user_id              :       this.props.auth.data.user_id,

            }
        }).then(response => {
            if( response.data.data.length > 0){
                this.setState({
                    restaurants          : response.data.data,
                });
            }

        }).catch(()=> {
            this.setState({ isLoaded: false });
        }).then(()=>{
            this.setState({ isLoaded: false });
        });
    }

    _keyExtractor = (item, index) => item.id;

     renderItems = (item , key) => {
        return(
            <TouchableOpacity  key={key} onPress={() => this.props.navigation.navigate('orderNow_client',{
                place_id : item.place_id
            })} style={[styles.notiBlock , {padding:7}]}>
                <Image source={{uri : item.familyProfile}} resizeMode={'cover'} style={styles.restImg}/>
                <View style={[styles.directionColumn , {flex:1}]}>
                    <View style={[styles.directionRowSpace ]}>
                        <Text style={[styles.boldGrayText ]}>{item.familyName}</Text>
                    </View>
                    <View style={[styles.locationView]}>
                        <Image source={require('../../assets/images/maps.png')} style={[styles.locationImg]} resizeMode={'contain'} />
                        <Text style={[styles.grayText , {writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',fontSize:12} ]}>{item.distance}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
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

    render() {

        return (
            <Container>

                <Header style={[styles.header ]} noShadow>
                    <View style={styles.directionRow}>
                        <Button onPress={() => this.props.navigation.openDrawer()} transparent style={styles.headerBtn}>
                            <Image source={require('../../assets/images/noun_menu.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                        </Button>

                    </View>

                    <Text style={[styles.headerText ]}>{i18n.t('cart')}</Text>

                    <View style={styles.directionRow}>

                    </View>
                </Header>
                <Content contentContainerStyle={styles.flexGrow} style={{}} >
                    <NavigationEvents onWillFocus={() => this.onFocus()} />

                    { this.renderLoader() }

                    {
                        (this.state.lat === null && this.state.isLoaded === false)
                            ?
                            <View style={{flex : 1, alignSelf:  'center', marginVertical: 30  , width : '100%' ,justifyContent :'center' , alignItems:'center'}}>
                                <Image style={{  width : 300 , height : 300  }} source={{uri :'https://cdn4.iconfinder.com/data/icons/maps-and-navigation-10/66/13-512.png'}} />
                                <TouchableOpacity onPress={ () => this._getLocationAsync()} style={[styles.yellowBtn , styles.mt15, styles.mb10 , {width:'90%' , alignSelf: 'center'}]}>
                                    <Text style={styles.whiteText}>{i18n.t('is_open_gps')}</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            <View/>
                    }

                    <View style={[styles.homeSection , {marginTop:20}]}>
                        <FlatList
                            data={this.state.restaurants}
                            renderItem={({item}) => this.renderItems(item)}
                            numColumns={1}
                            keyExtractor={this._keyExtractor}
                        />

                        {
                            (this.state.restaurants.length === 0 && this.state.lat !== null && this.state.isLoaded === false)
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
}
const mapStateToProps = ({ auth,profile, lang  }) => {

    return {
        auth       : auth.user,
        lang       : lang.lang,
        user       : profile.user,
    };
};

export default connect(mapStateToProps, { userLogin , profile})(Cart_client);




