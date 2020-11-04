import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, Dimensions,  ScrollView, I18nManager} from "react-native";
import {Container, Content,  Header, Button, Item, Input} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'


const height = Dimensions.get('window').height;

class Notification_delegate extends Component {
    constructor(props){
        super(props);

        this.state={
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

                    <Text style={[styles.headerText ,{right:-19}]}>{ i18n.t('notifications') }</Text>

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
                    <View style={[styles.homeSection , {marginTop:20}]}>
                        <TouchableOpacity style={styles.notiBlock}>
                            <Image source={require('../../assets/images/profile_pic.png')} resizeMode={'cover'} style={styles.notiImg}/>
                            <Text style={[styles.grayText , {flex:1,writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'} ]}>تم الموافقة علي طلبك من قبل مطعم اوامر</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.notiBlock}>
                            <Image source={require('../../assets/images/profile_pic.png')} resizeMode={'cover'} style={styles.notiImg}/>
                            <Text style={[styles.grayText , {flex:1,writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'} ]}>قامت اسرة اوامر بعرض سعر عليك</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.notiBlock}>
                            <Image source={require('../../assets/images/profile_pic.png')} resizeMode={'cover'} style={styles.notiImg}/>
                            <Text style={[styles.grayText , {flex:1,writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'} ]}>تم توصيل الطلب من قبل مندوب</Text>
                        </TouchableOpacity>
                    </View>
                </Content>
            </Container>

        );
    }
}

export default Notification_delegate;