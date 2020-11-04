import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, Dimensions,  FlatList, I18nManager , ActivityIndicator} from "react-native";
import {Container, Content, Header, Button, Item, Input, Toast} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
import StarRating from 'react-native-star-rating';
import axios from "axios";
import CONST from "../consts/colors";
import {connect}         from "react-redux";
import {profile, userLogin} from "../actions";
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
// import {DoubleBounce} from "react-native-loader";
import * as Animatable from "react-native-animatable";
import {NavigationEvents} from "react-navigation";

const height = Dimensions.get('window').height;



class Restaurants_client extends Component {
    constructor(props){
        super(props);

        this.state={
            search               : '',
            restaurants          : [],
            starCount            : 3,
            lat                  : null,
            long                 : null,
            page                 : 1,
            specialId            : null,
        }
        Animatable.createAnimatableComponent(Restaurants_client);
    }

    static navigationOptions = () => ({
        drawerLabel: () => null,
    });

    componentWillMount() {
        this._getLocationAsync();
        this.setState({
            page      : 1
        });
    }

    componentWillUnmount() {
        this.setState({
            page      : 1
        });
        console.log('page', this.state.page)
    }

    _getLocationAsync = async () => {

        this.setState({ isLoaded: true });

        let {status} = await Permissions.askAsync(Permissions.LOCATION);

        if (status !== 'granted') {
            Toast.show({
                text        : 'Permission to access location was denied',
                duration    : 4000,
                type        : 'danger',
                textStyle   : {color: "white", textAlign: 'center'}
            });
            this.setState({ isLoaded: false });
        } else {

            return await Location.getCurrentPositionAsync({
                enableHighAccuracy: false,
                maximumAge        : 15000
            }).then((position) => {
                this.setState({
                    lat           :       position.coords.longitude,
                    long          :       position.coords.latitude
                });
               setTimeout(()=> {
                   this.getResults();
                   console.log('restaurants =========', this.state.restaurants)
               },1000)
             });
        }
    };


    search(placeName)
    {
        if(placeName)
        {
            axios({
                method     : 'post',
                url        :  CONST.url + 'searchPlaces',
                data       :  {
                    departmentId    : this.props.navigation.state.params.departement_id,
                    lat             : this.state.lat,
                    long            : this.state.long,
                    placeName       : placeName,
                },
                headers    : {
                    lang            : ( this.props.lang ) ?  this.props.lang : 'ar',
                }
            }).then(response => {

                if(response.data.status === '0') {

                    Toast.show({
                        text: response.data.message,
                        duration : 2000,
                        type : "danger",
                        textStyle: {
                            color: "white",
                            fontFamily : 'cairoBold',
                            textAlign:'center'
                        }
                    });

                }else{

                    this.setState({
                        restaurants : response.data.data,
                        page        : this.state.page + 1
                    });

                    console.log('response', response.data.data)
                    console.log('restaurants', this.state.restaurants)

                }
            }).catch(error => {

            }).then(()=>{});
        }else{
            this.setState({
                page      : 1
            });

            setTimeout(()=> {
                this.getResults();
            },1000)
        }
    }

    getResults() {

        this.setState({ isLoaded: true });

        axios({
            method     : 'post',
            url        :  CONST.url + 'allFamily-restaurant',
            data       :  {
                departmentId    : this.props.navigation.state.params.departement_id,
                lat             : this.state.lat,
                long            : this.state.long,
                page            : this.state.page
            },
            headers    : {
                lang            : ( this.props.lang ) ?  this.props.lang : 'ar',
            }
        }).then(response => {
            if(response.data.status === '0')
            {
                Toast.show({
                    text: response.data.message,
                    duration : 2000 ,
                    type :"danger",
                    textStyle: {
                        color: "white",
                        fontFamily : 'cairoBold' ,
                        textAlign:'center'
                    } });
            }else{
                this.setState({
                    // restaurants: this.state.restaurants.concat(response.data.data.placeData) ,
                    restaurants: response.data.data.placeData ,
                    page       : this.state.page + 1
                });
            }

        }).catch(error => {

        }).then(()=>{
            this.setState({ isLoaded: false });
        });
    }

    handleLoadMore = () => {

        if(this.state.restaurants.length > 12){
                this.getResults();
        }

    };

    renderLoader(){
        if (this.state.isLoaded){
            return(
                <View style={{ alignItems: 'center', justifyContent: 'center', height: (height-100) , alignSelf:'center' , backgroundColor: '#fff' , width:'100%' , position:'absolute' , zIndex:1  }}>
                    <ActivityIndicator size="large" color={COLORS.red} />
                </View>
            );
        }
    }

    _keyExtractor = (item, index) => item.place_id;

    renderItems = (item,key) => {
        return(
            <View style={[ styles.overHidden ]}>
                <Animatable.View animation={(key % 2 === 0 ) ? 'slideInUp' : 'slideInUp'} duration={1500} iterationCount={1}>

                    <TouchableOpacity onPress={() => {this.props.navigation.navigate('restDet_client',{place_id :item.place_id, type : 'restaurants_client'})}} style={[styles.notiBlock , {padding:7}]}>
                        <Image source={{uri : item.imageProfile}} resizeMode={'cover'} style={styles.restImg}/>
                        <View style={[styles.directionColumn , {flex:1}]}>
                            <View style={[styles.directionRowSpace ]}>
                                <Text style={[styles.boldGrayText ]}>{item.PlaceName}</Text>
                                <StarRating
                                    disabled={true}
                                    maxStars={5}
                                    rating={item.rating}
                                    fullStarColor={COLORS.blue}
                                    starSize={13}
                                    starStyle={styles.starStyle}
                                />
                            </View>
                            <View style={[styles.locationView]}>
                                <Image source={require('../../assets/images/maps.png')} style={[styles.locationImg]} resizeMode={'contain'} />
                                <Text style={[styles.grayText , {writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',fontSize:12} ]}>{item.address}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Animatable.View>
            </View>
        );
    };

    onFocus(){
        this.componentWillMount();
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
                    <Text style={[styles.headerText , {right:0} ]}>{ i18n.t('restaurants') }</Text>
                    <View style={styles.directionRow}>
                        <Button onPress={() => this.props.navigation.goBack()} transparent  style={styles.headerBtn}>
                            <Image source={require('../../assets/images/arrow_left.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                        </Button>
                    </View>
                </Header>

                <Content contentContainerStyle={styles.flexGrow} style={{}}>

                    {this.renderLoader()}

                    <View style={styles.topHead}>
                        <View style={styles.inputView}>
                            <Item  style={styles.inputItem} bordered>
                                <Input autoCapitalize='none' onChangeText={(search) => this.search( search )} placeholder={ i18n.t('search') } placeholderTextColor={'#fff'} style={styles.modalInput}   />
                            </Item>
                            <Image source={require('../../assets/images/magnifying.png')} style={[styles.searchImg , styles.transform]} resizeMode={'contain'}/>
                        </View>
                    </View>
                    <View style={[styles.homeSection , {marginTop:20}]}>

                        <FlatList
                            onEndReached = { this.handleLoadMore }
                            data={this.state.restaurants}
                            renderItem={({item}) => this.renderItems(item)}
                            numColumns={1}
                            extraData={this.state}
                            keyExtractor={this._keyExtractor}
                        />

                        {
                            (this.state.restaurants.length === 0 && this.state.isLoaded === false)
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

export default connect(mapStateToProps, { userLogin , profile})(Restaurants_client);



