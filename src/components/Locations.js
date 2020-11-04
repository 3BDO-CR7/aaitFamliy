import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, Dimensions, ActivityIndicator, I18nManager, ImageBackground} from "react-native";
import {Container, Content, Header, Button, Item, Input, Form, Toast, Icon, Label} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
import axios from "axios";
import CONST from "../consts/colors";
// import Spinner from "react-native-loading-spinner-overlay";
import {connect}         from "react-redux";
import {profile, userLogin} from "../actions";
import Modal from "react-native-modal";
import * as Permissions from "expo-permissions";
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
// import {DoubleBounce} from "react-native-loader";


const height = Dimensions.get('window').height;

class Locations extends Component {
    constructor(props){
        super(props);

        this.state=
            {
                who_are_we      : '',
                location        : '',
                mapRegion       : null,
                address_id      : null,
                LocationName    : '',
                isLoaded        : false,
                initMap         : true,
                lat             : null,
                long            : null,
                is_ModalVisible : false,
                locations       : [],
                textErr : ''
            }
    }

    static navigationOptions = () => ({
        drawerLabel:  i18n.t('Location')  ,
        drawerIcon: (<Image source={require('../../assets/images/noun_Info.png')} style={styles.drawerImg} resizeMode={'contain'} /> )
    });


  async  componentWillMount()
    {
            this.getOrders();
    }

    getOrders()
    {
        this.setState({ isLoaded: true });
        axios({
            method     : 'post',
            url        :  CONST.url + 'allAdress',
            data       :  {

            },
            headers    : {
                lang         :      ( this.props.lang ) ?  this.props.lang : 'ar',
                user_id      :      this.props.auth.data.user_id,
            }
        }).then(response => {
            if(response.data.status === '0')
            {

            }else{

                this.setState({
                    locations : response.data.data
                });
            }
        }).catch(error => {

        }).then(()=>{
            this.setState({
                isLoaded        : false,
                isModalVisible  : false
            });
        });
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

  async  openModal(type){

      if(type){
          this.setState({is_ModalVisible : true});
      }else{
          this.setState({isModalVisible : true})
      }
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status     !== 'granted') {
            alert(i18n.t('open_gps'));
        }else {
            const { coords : { latitude, longitude } } = await Location.getCurrentPositionAsync({});
            const userLocation                         = { latitude, longitude };
            this.setState({
                mapRegion: userLocation,
                lat      : latitude,
                long     : longitude,
                initMap  : false
            });
        }

        let getCity   = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
        getCity      += this.state.mapRegion.latitude + ',' + this.state.mapRegion.longitude;
        getCity                                    += '&key='+ this.props.user.googleKey +'&language=ar&sensor=true';


        console.log(this.props.user.googleKey)
        console.log(getCity)
        try {
            const { data } = await axios.get(getCity);
            this.setState({ location: data.results[0].formatted_address });
        } catch (e) {
            console.log(e);
        }
    }


    saveLocation(){
      if(this.state.LocationName !== '' && this.state.location !== ''){
          this.setState({ isLoaded: true });
          axios({
              method     : 'post',
              url        :  CONST.url + 'addAdress',
              data       :  {
                  lat          :    this.state.lat,
                  long         :    this.state.long,
                  address      :    this.state.location,
                  LocationName :    this.state.LocationName,
              },
              headers    : {
                  lang         :      ( this.props.lang ) ?  this.props.lang : 'ar',
                  user_id      :      this.props.auth.data.user_id,
              }
          }).then(response => {
                    if(response.data.status === '0')
                    {

                        this.setState({textErr : response.data.message})
                    }else{
                        this.setState({textErr : '', LocationName : ''});
                        Toast.show({ text: response.data.message, duration : 2000 ,
                            type :"success",
                            textStyle: {
                                color: "white",fontFamily : 'cairoBold' ,textAlign:'center'
                            } });
                        this.getOrders();
                    }
          }).catch(error => {

          }).then(()=>{
              this.setState({ isLoaded: false, isModalVisible: false ,initMap : true });
          });
      }else{

          this.setState({textErr :i18n.t('some_fields_required')});
      }
    }


    openUpdateLocation(item){

         this.openModal(1);

         this.setState({
            is_ModalVisible : true ,
            LocationName    : item.LocationName,
            address_id      : item.address_id
        })
    }

    updateLocation(){
        if(this.state.LocationName !== '' && this.state.location !== ''){
            this.setState({ isLoaded: true });
            axios({
                method     : 'post',
                url        :  CONST.url + 'editAdress',
                data       :  {
                    lat          :    this.state.lat,
                    long         :    this.state.long,
                    address      :    this.state.location,
                    LocationName :    this.state.LocationName,
                    address_id   :    this.state.address_id,
                },
                headers    : {
                    lang         :      ( this.props.lang ) ?  this.props.lang : 'ar',
                    user_id      :      this.props.auth.data.user_id,
                }
            }).then(response => {
                if(response.data.status === '0')
                {

                    this.setState({textErr : response.data.message})
                }else{
                    this.setState({textErr : '', LocationName : ''});
                    Toast.show({ text: response.data.message, duration : 2000 ,
                        type :"success",
                        textStyle: {
                            color: "white",fontFamily : 'cairoBold' ,textAlign:'center'
                        } });

                    this.getOrders();
                }
            }).catch(error => {

            }).then(()=>{
                this.setState({ isLoaded: false, is_ModalVisible: false ,initMap : true });
            });
        }else{

            this.setState({textErr :i18n.t('some_fields_required')});
        }
    }

    _handleMapRegionChange  = async (mapRegion) =>  {
    {

        this.setState({ mapRegion });
        let getCity = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
        getCity += mapRegion.latitude + ',' + mapRegion.longitude;
        getCity                                    += '&key='+ this.props.user.googleKey +'&language=ar&sensor=true';

        console.log('locations data', getCity);

        try {
            const { data } = await axios.get(getCity);
            this.setState({
                location   : data.results[0].formatted_address,
            });

        } catch (e) {
            console.log(e);
        }
    }
    };

    delete_location(id , i){
        this.setState({ isLoaded: true });
        axios({
            method     : 'post',
            url        :  CONST.url + 'deleteAddress',
            data       :  {
                address_id   :   id,
            },
            headers    : {
                lang         :      ( this.props.lang ) ?  this.props.lang : 'ar',
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
                Toast.show({ text: response.data.message, duration : 2000 ,
                    type :"success",
                    textStyle: {
                        color: "white",fontFamily : 'cairoBold' ,textAlign:'center'
                    } });
                this.state.locations.splice(i,1);
            }
        }).catch(error => {

        }).then(()=>{
            this.setState({ isLoaded: false});
        });
    }


    render() {


        return (
            <Container>
                {/*<Spinner visible={this.state.spinner}/>*/}

                <Header style={[styles.header ]} noShadow>
                    <View style={styles.directionRow}>
                        <Button onPress={() => this.props.navigation.openDrawer()} transparent style={styles.headerBtn}>
                            <Image source={require('../../assets/images/noun_menu.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                        </Button>
                    </View>

                    <Text style={[styles.headerText ]}>{i18n.t('saved_places')}</Text>

                    <View style={styles.directionRow}>
                        <Button onPress={() => {
                            if( this.props.user.userType === 'user')
                            {
                                this.props.navigation.navigate('home_client');
                            }else{
                                this.props.navigation.navigate('home_delegate');
                            }

                        }} transparent  style={styles.headerBtn}>
                            <Image source={require('../../assets/images/arrow_left.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                        </Button>
                    </View>
                </Header>

                { this.renderLoader() }

                <Content contentContainerStyle={styles.flexGrow} style={{}} >
                    <ImageBackground source={require('../../assets/images/bg.png')} resizeMode={'cover'} style={styles.imageBackground}>
                        <View style={[styles.homeSection , {marginTop:20}]}>
                            <View style={[styles.directionColumnCenter , {marginBottom: 15}]}>
                                <TouchableOpacity onPress={()=> this.openModal()}  style={[styles.yellowBtn , styles.mb10 , {borderRadius : 3}]}>
                                    <Text style={styles.whiteText}>{ i18n.t('add_places') }</Text>
                                </TouchableOpacity>
                            </View>
                            {
                                this.state.locations.map((location, key) => {
                                    return (
                                        <TouchableOpacity key={key} style={{borderRadius : 5 , borderColor : COLORS.gray , borderWidth : .5 , width : '100%' , marginVertical : 12 }}>
                                            <TouchableOpacity onPress={()=> { this.openUpdateLocation(location)}} style={{  position:'absolute' , zIndex: 99 , top: -15 , left : 10 , backgroundColor : '#fff'}} >
                                                <Icon  style={{color : COLORS.green}} name="tooltip-edit" type="MaterialCommunityIcons"></Icon>
                                            </TouchableOpacity>

                                            <TouchableOpacity onPress={()=> { this.delete_location(location.address_id , key)}} style={{  position:'absolute' , zIndex: 99 , top: -15 , left : 60 , backgroundColor : '#fff'}} >
                                                <Icon  style={{color : COLORS.red}} name="delete" type="Feather"></Icon>
                                            </TouchableOpacity>

                                            <View style={{borderRadius : 5 , borderColor : COLORS.gray , borderWidth : .5 , position:'absolute' , zIndex: 99 , top: -15 , right : 10 , backgroundColor : '#fff'}} >
                                                <Text style={{padding : 2 , color :COLORS.black ,fontFamily:'cairoBold'}}> { location.LocationName }</Text>
                                            </View>
                                            <View style={{justifyContent:'center' , flexDirection:'row' , alignItems :'center' , overflow :'hidden' , height : 110}}>
                                                <Text style={{paddingVertical : 25,fontFamily:'cairo' ,textAlign:'center' , color : COLORS.gray }}> {location.address }</Text>
                                               <View style={{position:'absolute' , zIndex: 99 , bottom: 5 , right  : 5 }}>
                                                   <Icon    name="crosshairs-gps" type="MaterialCommunityIcons" style={{color : COLORS.boldGray , fontSize : 12}}></Icon>
                                               </View>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })
                            }

                            {
                                (this.state.locations.length === 0   && this.state.isLoaded === false)
                                    ?
                                    <View style={{flex : 1, alignSelf:  'center', marginVertical: 30 }}>
                                        <Image style={{resizeMode : 'contain' , width : 300 , height : 300  }} source={ require('../../assets/images/no_result.png') }/>
                                    </View>
                                    :
                                    <View/>
                            }
                        </View>
                    </ImageBackground>
                </Content>


                <Modal onBackdropPress={()=> this.setState({ isModalVisible : false , initMap : true , LocationName : ''  })} isVisible={this.state.isModalVisible}>
                    <View style={styles.modalStyle}>
                        <View style={styles.modalHead}>
                            <Text style={[styles.whiteText , {fontSize:15}]}>{ i18n.t('detect_location') }</Text>
                        </View>
                        <Form style={{ width: '100%' , padding:20}}>

                            <Text style={{ fontFamily: I18nManager.isRTL ? 'cairo' : 'openSans' , fontSize : 14, textAlign : 'center', color : '#F00' }}>
                                { this.state.textErr }
                            </Text>

                            <Item style={styles.loginItem} bordered>
                                <Label style={[styles.label ]}>{ i18n.t('LocationName') }</Label>
                                <Input value={this.state.LocationName} placeholder={i18n.t('LocationName')} placeholderTextColor={COLORS.placeholderColor} onChangeText={(LocationName) => this.setState({LocationName})} autoCapitalize='none' style={styles.input}  />
                            </Item>
                            {
                                !this.state.initMap ? (
                                    <MapView
                                        style={{ flex: 1, width: '100%', height: 160, borderRadius: 20 }}
                                        initialRegion={{
                                            latitude:  this.state.mapRegion.latitude,
                                            longitude:  this.state.mapRegion.longitude,
                                            latitudeDelta: 0.0922,
                                            longitudeDelta: 0.0421,
                                        }}
                                    >
                                        <MapView.Marker draggable
                                                        coordinate={this.state.mapRegion}
                                                        onDragEnd={(e) =>  this._handleMapRegionChange(e.nativeEvent.coordinate)}
                                        >
                                            <Image source={require('../../assets/images/marker.png')} resizeMode={'contain'} style={{ width: 50, height: 50 }}/>
                                        </MapView.Marker>
                                    </MapView>
                                ) : (<View />)
                            }

                            <Item style={[styles.loginItem , { marginVertical : 10 }]} bordered>
                                <Input value={this.state.location} placeholder={i18n.t('location')} placeholderTextColor={COLORS.placeholderColor}   onChangeText={(location) => this.setState({location})}  style={[styles.input  ,{borderTopRightRadius:25,paddingRight:40}]}  />
                            </Item>

                            <View style={{justifyContent:'space-between' , flexDirection:'row' ,  alignItems : 'center' }}>
                                <TouchableOpacity  onPress={()=> { this.saveLocation() }}  style={[styles.yellowBtn , styles.mb10 ,{width : '40%'}]}>
                                    <Text style={styles.whiteText}>{ i18n.t('confirm') }</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=> { this.setState({isModalVisible : false, initMap : true , LocationName : '' })}} style={[styles.redBtn , styles.mb10,{width : '40%'}]}>
                                    <Text style={styles.whiteText}>{ i18n.t('cancel') }</Text>
                                </TouchableOpacity>
                            </View>

                        </Form>
                    </View>
                </Modal>




                <Modal onBackdropPress={()=> this.setState({ is_ModalVisible : false, initMap : true , LocationName : ''  })} isVisible={this.state.is_ModalVisible}>
                    <View style={styles.modalStyle}>
                        <View style={styles.modalHead}>
                            <Text style={[styles.whiteText , {fontSize:15}]}>{ i18n.t('edit_location') }</Text>
                        </View>
                        <Form style={{ width: '100%' , padding:20}}>

                            <Item style={styles.loginItem} bordered>
                                <Label style={[styles.label ]}>{ i18n.t('LocationName') }</Label>
                                <Input value={this.state.LocationName} placeholder={i18n.t('LocationName')} placeholderTextColor={COLORS.placeholderColor} onChangeText={(LocationName) => this.setState({LocationName})} autoCapitalize='none' style={styles.input}  />
                            </Item>

                            <Text style={{ fontFamily: I18nManager.isRTL ? 'cairo' : 'openSans' , fontSize : 14, textAlign : 'center', color : '#F00', marginBottom : 15 }}>
                                { this.state.textErr }
                            </Text>

                            {
                                !this.state.initMap ? (
                                    <MapView
                                        style={{ flex: 1, width: '100%', height: 160, borderRadius: 20 }}
                                        initialRegion={{
                                            latitude        :  this.state.mapRegion.latitude,
                                            longitude       :  this.state.mapRegion.longitude,
                                            latitudeDelta   : 0.0922,
                                            longitudeDelta  : 0.0421,
                                        }}
                                    >

                                        <MapView.Marker draggable
                                                        coordinate={this.state.mapRegion}
                                                        onDragEnd={(e) =>  this._handleMapRegionChange(e.nativeEvent.coordinate)}
                                        >
                                            <Image source={require('../../assets/images/marker.png')} resizeMode={'contain'} style={{ width: 50, height: 50 }}/>
                                        </MapView.Marker>

                                    </MapView>
                                ) : (<View />)
                            }

                            <Item style={styles.loginItem} bordered>
                                <Input value={this.state.location} placeholder={i18n.t('location')} placeholderTextColor={COLORS.placeholderColor}   onChangeText={(location) => this.setState({location})}  style={[styles.input  ,{borderTopRightRadius:25,paddingRight:40}]}  />
                            </Item>

                            <View style={{justifyContent:'space-between' , flexDirection:'row' ,  alignItems : 'center' }}>
                                <TouchableOpacity  onPress={()=> { this.updateLocation() }}  style={[styles.yellowBtn , styles.mb10 ,{width : '40%'}]}>
                                    <Text style={styles.whiteText}>{ i18n.t('confirm') }</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=> { this.setState({is_ModalVisible : false, initMap : true , LocationName : '' })}} style={[styles.redBtn , styles.mb10,{width : '40%'}]}>
                                    <Text style={styles.whiteText}>{ i18n.t('cancel') }</Text>
                                </TouchableOpacity>
                            </View>

                        </Form>
                    </View>
                </Modal>


                <Modal onBackdropPress={()=> this.setState({ choose_ModalVisible : false , initMap : true , LocationName : '' })} isVisible={this.state.choose_ModalVisible}>
                    <View style={styles.modalStyle}>
                        <View style={styles.modalHead}>
                            <Text style={[styles.whiteText , {fontSize:15}]}>{ i18n.t('edit_location') }</Text>
                        </View>
                        <Form style={{ width: '100%' , padding:20}}>

                            <View style={{justifyContent:'space-between' , flexDirection:'row' ,  alignItems : 'center' }}>
                                <TouchableOpacity  onPress={()=> { this.openUpdateLocation() }}  style={[styles.yellowBtn , styles.mb10 ,{width : '40%'}]}>
                                    <Text style={styles.whiteText}>{ i18n.t('edit') }</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=> { this.setState({choose_ModalVisible : false, initMap : true , LocationName : '' })}} style={[styles.redBtn , styles.mb10,{width : '40%'}]}>
                                    <Text style={styles.whiteText}>{ i18n.t('cancel') }</Text>
                                </TouchableOpacity>
                            </View>

                        </Form>
                    </View>
                </Modal>


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

export default connect(mapStateToProps, { userLogin , profile})(Locations);


