import React, { Component } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    Share,
    I18nManager,
    ImageBackground,
    KeyboardAvoidingView
} from "react-native";
import {Container, Content, Header, Button, Item, Input, Form, Label, Textarea} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'


const height = Dimensions.get('window').height;

class ShareApp_client extends Component {
    constructor(props){
        super(props);

        this.state={
        }
    }



    static navigationOptions = () => ({
        drawerLabel:  i18n.t('shareApp')  ,
        drawerIcon: (<Image source={require('../../assets/images/noun_share.png')} style={styles.drawerImg} resizeMode={'contain'} /> )
    })

    onShare = async () => {
        try {
            const result = await Share.share({
                message:
                    'React Native | A framework for building native apps using React',
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
        } catch (error) {

        }
    };


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

                    <Text style={[styles.headerText ]}>{i18n.t('shareApp')}</Text>

                    <View style={styles.directionRow}>
                        <Button onPress={() => this.props.navigation.navigate('cart_client')} transparent  style={styles.headerBtn}>
                            <Image source={require('../../assets/images/shopping_basket.png')} style={styles.headerMenu} resizeMode={'contain'} />
                        </Button>
                        <View style={styles.cartNum}>
                            <Text style={styles.cartNumText}>12</Text>
                        </View>
                    </View>
                </Header>

                <Content contentContainerStyle={styles.flexGrow} style={{}} >
                    <ImageBackground source={require('../../assets/images/bg.png')} resizeMode={'cover'} style={styles.imageBackground}>
                        <View style={[styles.homeSection , {marginTop:20}]}>
                            <View style={styles.directionColumnCenter}>
                                <Image source={require('../../assets/images/logo.png')} style={[styles.wallet]} resizeMode={'contain'} />


                                <Text style={[styles.yellowText, styles.mt50]}>{i18n.t('shareApp')}</Text>
                                <Text style={[styles.grayText , styles.tAC , styles.mt15]}>هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى</Text>


                                <View style={[styles.directionRow , styles.mt50]}>
                                    <TouchableOpacity  style={styles.directionRow} onPress={()=> this.onShare()}>
                                        <Image source={require('../../assets/images/facebook.png')} style={[styles.social]} resizeMode={'contain'} />
                                    </TouchableOpacity>
                                    <TouchableOpacity  style={styles.directionRow} onPress={()=> this.onShare()}>
                                        <Image source={require('../../assets/images/twitter.png')} style={[styles.social]} resizeMode={'contain'} />
                                    </TouchableOpacity>
                                    <TouchableOpacity  style={styles.directionRow} onPress={()=> this.onShare()}>
                                        <Image source={require('../../assets/images/insta.png')} style={[styles.social]} resizeMode={'contain'} />
                                    </TouchableOpacity>
                                    <TouchableOpacity  style={styles.directionRow} onPress={()=> this.onShare()}>
                                        <Image source={require('../../assets/images/whats.png')} style={[styles.social]} resizeMode={'contain'} />
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>
                    </ImageBackground>
                </Content>
            </Container>

        );
    }
}

export default ShareApp_client;