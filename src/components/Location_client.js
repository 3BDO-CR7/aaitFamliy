import React, { Component } from "react";
import {View, Text, Image,Platform, TouchableOpacity,StyleSheet, Dimensions, FlatList, I18nManager, Animated} from "react-native";
import {Container, Content, Header, Button, Item, Input, Toast} from 'native-base'
import i18n from '../../locale/i18n'
import MapView, {
    Marker,
    AnimatedRegion,
    Polyline,
    PROVIDER_GOOGLE
} from "react-native-maps";
window.navigator.userAgent = 'react-native';
import SocketIOClient from 'socket.io-client';

const LATITUDE = 31.032315899999997;
const LONGITUDE = 31.396537899999995;
import {connect}         from "react-redux";
import {profile, userLogin} from "../actions";


const height = Dimensions.get('window').height;

class Location_client extends Component {
    constructor(props){
        super(props);

        this.state={

            watchID: '',
            latitude: LATITUDE,
            longitude: LONGITUDE,
            routeCoordinates: [],
            distanceTravelled: 0,
            prevLatLng: {},
            coordinate: new AnimatedRegion({
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta:  0.0922,
                longitudeDelta: 0.0421
            }),

            markers: [{
                title: '',
                coordinates   : {
                    latitude  :  this.props.navigation.state.params.lat ,
                    longitude :  this.props.navigation.state.params.long,
                    latitudeDelta : 0,
                    longitudeDelta: 0
                },
            }]
        };


        this.socket = SocketIOClient('http://195.201.94.112:4333/', {jsonp: false});

    }

   joinRoom(data){
        this.socket.emit('subscribe', data);
    }

    static navigationOptions = () => ({
        drawerLabel: () => null,
    });

  async  componentWillMount()
    {}
    componentDidMount() {
        this.joinRoom({room : this.props.navigation.state.params.item_id});
        this.socket.on('locationUpdated', (data) => {
            console.log('Now u see me' , data);
            this.setState({coordinate : {
                    latitude: parseFloat(data.lat),
                    longitude: parseFloat(data.long),
                    latitudeDelta: 0,
                    longitudeDelta: 0
            }})
        });
    }
    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    }


    render() {
        return (

            <Container>
                <Header style={[styles.header ]} noShadow>
                    <Button onPress={() => this.props.navigation.openDrawer()} transparent style={styles.headerBtn}>
                        <Image source={require('../../assets/images/noun_menu.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                    </Button>

                    <Text style={[styles.headerText , {right:-19} ]}>{ i18n.t('location') }</Text>

                    <View style={styles.directionRow}>

                        <Button onPress={() => {
                            if(this.props.user.userType === 'user')
                            {
                                this.props.navigation.navigate('drawerNavigator_client');
                            }else{
                                this.props.navigation.navigate('drawerNavigator_delegate');
                            }

                        }} transparent  style={styles.headerBtn}>
                            <Image source={require('../../assets/images/arrow_left.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                        </Button>
                    </View>
                </Header>

                <View style={styles.container}>
                <MapView
                    ref={ (map)=> this.map = map}
                    initialRegion={{
                        latitude  :  this.props.navigation.state.params.lat ,
                        longitude :  this.props.navigation.state.params.long,
                        latitudeDelta : 0.1,
                        longitudeDelta: 0.5
                    }}
                    onMapReady={() => {this.map.fitToSuppliedMarkers(['mk1','mk2'],{ edgePadding: {   top: 50, right: 50, bottom: 50, left: 50}})}}
                    style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    showUserLocation
                    followUserLocation
                    minZoomLevel={1}
                    loadingEnabled
                >
                    <Polyline coordinates={this.state.routeCoordinates} strokeWidth={15} />

                    <Marker.Animated
                        ref={marker => {
                            this.marker = marker;
                        }}
                        coordinate={this.state.coordinate}
                    >
                   <Image source={require('../../assets/images/car_marker.png')} style={{height: 55, width:55 }} />

                    </Marker.Animated>


                    {
                        (this.state.markers.length > 0 )?
                        this.state.markers.map(marker => (
                            <MapView.Marker
                                coordinate={marker.coordinates}
                                title={marker.title}
                            />
                    ))
                    :null

                    }
                </MapView>
            </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "flex-end",
        alignItems: "center"
    },
    map: {
        ...StyleSheet.absoluteFillObject
    },
    bubble: {
        flex: 1,
        backgroundColor: "rgba(255,255,255,0.7)",
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20
    },
    latlng: {
        width: 200,
        alignItems: "stretch"
    },
    button: {
        width: 80,
        paddingHorizontal: 12,
        alignItems: "center",
        marginHorizontal: 10
    },
    buttonContainer: {
        flexDirection: "row",
        marginVertical: 20,
        backgroundColor: "transparent"
    }
});
const mapStateToProps = ({ auth,profile, lang  }) => {

    return {

        auth     : auth.user,
        user       : profile.user,
        lang     : lang.lang,
        result   : auth.success,
        userId   : auth.user_id,
    };
};
export default connect(mapStateToProps, { userLogin ,profile})(Location_client);





