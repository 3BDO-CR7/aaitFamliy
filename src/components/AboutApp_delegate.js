import React, { Component } from "react";
import {View, Text, Image, ActivityIndicator, Dimensions, ScrollView, I18nManager, ImageBackground} from "react-native";
import {Container, Content, Header, Button, Item, Input, Form} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
import {NavigationEvents} from "react-navigation";


const height = Dimensions.get('window').height;

class AboutApp_delegate extends Component {
    constructor(props){
        super(props);

        this.state={
        }
    }

    static navigationOptions = () => ({
        drawerLabel:  i18n.t('aboutApp')  ,
        drawerIcon: (<Image source={require('../../assets/images/noun_Info.png')} style={styles.drawerImg} resizeMode={'contain'} /> )
    })

    componentWillMount(){}

    onFocus(){
        this.componentWillMount();
    }

    render() {


        return (
            <Container>

                <NavigationEvents onWillFocus={() => this.onFocus()} />

                <Header style={[styles.header ]} noShadow>
                    <Button onPress={() => this.props.navigation.openDrawer()} transparent style={styles.headerBtn}>
                        <Image source={require('../../assets/images/noun_menu.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                    </Button>

                    <Text style={[styles.headerText ,{right:-19}]}>{ i18n.t('aboutApp') }</Text>

                    <View style={styles.directionRow}>
                        <Button onPress={() => this.props.navigation.navigate('notification_delegate')} transparent style={styles.headerBtn}>
                            <Image source={require('../../assets/images/notification.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                        </Button>
                        <Button onPress={() => this.props.navigation.goBack()} transparent  style={styles.headerBtn}>
                            <Image source={require('../../assets/images/arrow_left.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                        </Button>
                    </View>
                </Header>

                <Content contentContainerStyle={styles.flexGrow} style={{}} >
                    <ImageBackground source={require('../../assets/images/bg.png')} resizeMode={'cover'} style={styles.imageBackground}>
                        <View style={[styles.homeSection , {marginTop:20}]}>
                            <View style={styles.directionColumnCenter}>
                                <Image source={require('../../assets/images/logo.png')} style={[styles.wallet ]} resizeMode={'contain'} />
                                <Text style={[styles.grayText , styles.tAC , styles.mt15]}>هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى </Text>
                            </View>
                        </View>
                    </ImageBackground>
                </Content>
            </Container>

        );
    }
}

export default AboutApp_delegate;
