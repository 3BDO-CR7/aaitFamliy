import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, Dimensions, FlatList, I18nManager, Animated} from "react-native";
import {Container, Content,  Header, Button, Item, Input} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
import MapView from 'react-native-maps';


const height = Dimensions.get('window').height;


class FollowDelegate_client extends Component {
    constructor(props){
        super(props);

        this.state={
            latitude: 37.78825,
            longitude: -122.4324,
        }
    }

    static navigationOptions = () => ({
        drawerLabel: () => null,
    });



    render() {


        return (
            <Container>

                <Header style={[styles.header ]} noShadow>
                    <View style={styles.directionRow}>
                        <Button onPress={() => this.props.navigation.openDrawer()} transparent style={styles.headerBtn}>
                            <Image source={require('../../assets/images/noun_menu.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                        </Button>
                        <Button onPress={() => this.props.navigation.navigate('notification_client')} transparent style={styles.headerBtn}>
                            <Image source={require('../../assets/images/notification.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                        </Button>
                    </View>

                    <Text style={[styles.headerText , {right:0} ]}>تتبع المندوب</Text>

                    <View style={styles.directionRow}>
                        <View>
                            <Button onPress={() => this.props.navigation.navigate('cart_client')} transparent  style={styles.headerBtn}>
                                <Image source={require('../../assets/images/shopping_basket.png')} style={styles.headerMenu} resizeMode={'contain'} />
                            </Button>
                            <View style={styles.cartNum}>
                                <Text style={styles.cartNumText}>12</Text>
                            </View>
                        </View>
                        <Button onPress={() => this.props.navigation.goBack()} transparent  style={styles.headerBtn}>
                            <Image source={require('../../assets/images/arrow_left.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                        </Button>
                    </View>
                </Header>

                <Content contentContainerStyle={styles.flexGrow} style={{}} >
                    <View style={[styles.w100 , {flex:1}]}>
                        <MapView
                            style={styles.mapView}
                            initialRegion={{
                                latitude: Number(this.state.latitude),
                                longitude: Number(this.state.longitude),
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            }}
                        >
                            <MapView.Marker
                                coordinate={({
                                    latitude: Number(this.state.latitude),
                                    longitude: Number(this.state.longitude),
                                })}
                            >
                                <Image source={require('../../assets/images/marker.png')} resizeMode={'contain'} style={styles.mapMarker}/>
                            </MapView.Marker>
                        </MapView>

                    </View>
                </Content>
            </Container>

        );
    }
}

export default FollowDelegate_client;