import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, Dimensions, FlatList, I18nManager, Animated} from "react-native";
import {Container, Content,  Header, Button, Item, Input} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
import MapView from 'react-native-maps';
import {connect}         from "react-redux";
import {profile, userLogin} from "../actions";


const height = Dimensions.get('window').height;


class Location_delegate extends Component {
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
                    <Button onPress={() => this.props.navigation.openDrawer()} transparent style={styles.headerBtn}>
                        <Image source={require('../../assets/images/noun_menu.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                    </Button>

                    <Text style={[styles.headerText , {right:-19} ]}>{ i18n.t('location') }</Text>

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

                <Content contentContainerStyle={styles.flexGrow} style={{}} >
                    <View style={[styles.w100 , {flex:1}]}>
                        <MapView
                            style={styles.mapView}
                            initialRegion={{
                                latitude: this.props.navigation.state.params.lat,
                                longitude: this.props.navigation.state.params.long,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            }}
                        >
                            <MapView.Marker
                                coordinate={({
                                    latitude: this.props.navigation.state.params.lat,
                                    longitude: this.props.navigation.state.params.long,
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




const mapStateToProps = ({ auth,profile, lang  }) => {

    return {

        auth     : auth.user,
        lang     : lang.lang,
        result   : auth.success,
        user       : profile.user,
        userId   : auth.user_id,
    };
};
export default connect(mapStateToProps, { userLogin ,profile})(Location_delegate);




