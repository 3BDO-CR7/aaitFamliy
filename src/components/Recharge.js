import React, { Component } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    Linking,
    ActivityIndicator,
    ScrollView,
    ImageBackground,
    KeyboardAvoidingView
} from "react-native";
import {Container, Content, Header, Button, Item, Input, Form, Label, Textarea, Toast} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
import axios from "axios";
import CONST from "../consts/colors";
import * as ImagePicker from "expo-image-picker";
// import {DoubleBounce} from "react-native-loader";
import {connect}         from "react-redux";
import {profile, userLogin} from "../actions";
import * as Permissions from "expo-permissions";




const height = Dimensions.get('window').height;

class Recharge extends Component {
    constructor(props){
        super(props);

        this.state={
            imageProfile                : 'https://cross.4hoste.com:30011/images/defaultUser.jpg',
            username                    : '',
            msg                         : '',
            email                       : '',
            base64                      : '',
            accountName                 : '',
            bankName                    : '',
            accountNumber               : '',
            amountTransferred           : '',
            imageTransfer               : '',
            usernameStatus              : 0,
            isLoaded                    : false,
            msgStatus                   : 0,
            userImage                   : 'https://atasouthport.com/wp-content/uploads/2017/04/default-image.jpg',
            bankNameStatus              : 0,
            accountNameStatus           : 0,
            accountNumberStatus         : 0,
            amountTransferredStatus     : 0,
            banks                       : [],
        }
    }

    static navigationOptions = () => ({
        drawerLabel:  i18n.t('contactUs')  ,
        drawerIcon: (<Image source={require('../../assets/images/noun_contactus.png')} style={styles.drawerImg} resizeMode={'contain'} /> )
    });


    askPermissionsAsync = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);

    };
    validate = () => {
        let isError = false;
        let msg = '';

        if (this.state.accountName === '') {
            isError = true;
            msg = i18n.t('accountName_validation');
        }else if (this.state.bankName === '') {
            isError = true;
            msg = i18n.t('bankName_validation');
        }else if (this.state.accountNumber === '') {
            isError = true;
            msg = i18n.t('accountNumber_validation');
        }else if (this.state.amountTransferred === '') {
            isError = true;
            msg = i18n.t('amountTransferred_validation');
        }else if (this.state.base64 === '') {
            isError = true;
            msg = i18n.t('base64_validation');
        }
        if (msg != ''){
            Toast.show({ text: msg, duration : 2000  ,type :"danger", textStyle: { color: "white",fontFamily : 'cairoBold' ,textAlign:'center' } });
        }
        return isError;
    };


    renderSubmit()
    {
        if (this.state.isLoaded){
            return(
                <View  style={{ justifyContent:'center', alignItems:'center' , marginVertical: 20}}>
                    <ActivityIndicator size="large" color={COLORS.red} />
                </View>
            )
        }

        return (
            <TouchableOpacity onPress={ () => this.bankSend()} style={[styles.yellowBtn , styles.mt15, styles.mb10]}>
                <Text style={styles.whiteText}>{ i18n.t('confirm') }</Text>
            </TouchableOpacity>
        );
    }


    componentWillMount(){
        this.setState({ isLoaded: true });
        axios({
            method     : 'post',
            url        :  CONST.url + 'getAllBank',
            data       :  {},
            headers    : {
                lang                    :    (this.props.lang) ? this.props.lang : 'ar',
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
                this.setState({
                    banks : response.data.data
                });
            }

        }).catch(error => {

        }).then(()=>{
            this.setState({ isLoaded: false });
        });
    }

    bankSend(){
        const err = this.validate();
        if (!err){
            axios({
                method     : 'post',
                url        :  CONST.url + 'bankSend',
                data       :  {
                    accountName             : this.state.accountName,
                    bankName                : this.state.bankName,
                    accountNumber           : this.state.accountNumber,
                    amountTransferred       : this.state.amountTransferred,
                    imageTransfer           : this.state.base64,
                },
                headers    : {
                    lang                    :    (this.props.lang) ? this.props.lang : 'ar',
                    user_id                 :    this.props.user.user_id  ,
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
                    this.props.navigation.navigate('wallet_client');
                }

            }).catch(error => {

            }).then(()=>{
                this.setState({ isLoaded: false });
            });
        }
    }


    renderLoader(){
        if (this.state.isLoaded){
            return(
                <View style={{ alignItems: 'center', justifyContent: 'center', height: (height-100) , alignSelf:'center' , backgroundColor: COLORS.transparent , width:'100%' , position:'absolute' , zIndex:1  }}>
                    <ActivityIndicator size="large" color={COLORS.red} />
                </View>
            );
        }
    }

    activeInput(type){
        if (type === 'accountName'){
            this.setState({ accountNameStatus: 1 })
        }else if (type === 'bankName'){
            this.setState({ bankNameStatus: 1 })
        }else if (type === 'accountNumber'){
            this.setState({ accountNumberStatus: 1 })
        }else
            this.setState({ amountTransferredStatus: 1 })
    }
    unActiveInput(type){
        if (type === 'accountName'){
            this.setState({ accountNameStatus: 0})
        }else if (type === 'bankName'){
            this.setState({ bankNameStatus: 0 })
        }else if (type === 'accountNumber'){
            this.setState({ accountNumberStatus: 0 })
        }else
            this.setState({ amountTransferredStatus: 0 })
    }

    _pickImage = async () => {

        this.askPermissionsAsync();

        let result = await ImagePicker.launchImageLibraryAsync({
            aspect: [4, 3],
            base64:true
        });

        if (!result.cancelled) {
            this.setState({ userImage: result.uri ,base64:result.base64});
        }
    };


    render() {
        let image = this.state.userImage;


        return (
            <Container>

                <Header style={[styles.header ]} noShadow>
                    <Button onPress={() => this.props.navigation.openDrawer()} transparent style={styles.headerBtn}>
                    </Button>

                    <Text style={[styles.headerText ,{right:-19}]}>{ i18n.t('send_bank_amount') }</Text>

                    <View style={styles.directionRow}>
                        <Button onPress={() => this.props.navigation.goBack()} transparent  style={styles.headerBtn}>
                            <Image source={require('../../assets/images/arrow_left.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                        </Button>
                    </View>
                </Header>
                { this.renderLoader() }
                <Content contentContainerStyle={styles.flexGrow} style={{}} >
                    <ImageBackground source={require('../../assets/images/bg.png')} resizeMode={'cover'} style={styles.imageBackground}>
                        <View style={[styles.homeSection , {marginTop:20}]}>


                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                {
                                    this.state.banks.map((bank , key)=> {
                                        return (
                                            <View key={key} style={{ marginHorizontal : 15 ,flex: 1, flexDirection :'row' , justifyContent:'center' }}>
                                                <Image source={{ uri : bank.image }} style={{flex: 1,height: 90, width: 90, resizeMode : 'stretch'}}/>
                                                <View style={{marginHorizontal : 9 , justifyContent :'space-between'}}>
                                                    <Text style={{fontSize : 10 , fontFamily :'cairoBold' , color :COLORS.boldGray}} >{bank.bankName}</Text>
                                                    <Text style={{fontSize : 10 , fontFamily :'cairoBold' , color :COLORS.boldGray}}>{bank.accountName}</Text>
                                                    <Text style={{fontSize : 10 , fontFamily :'cairoBold' , color :COLORS.boldGray}}>{bank.accountNumber}</Text>
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                            </ScrollView>




                            <View style={styles.directionColumnCenter}>

                                <KeyboardAvoidingView behavior={'padding'} style={styles.keyboardAvoid}>
                                    <Form style={{ width: '100%' , marginTop:30}}>

                                        <Item style={styles.loginItem} bordered>
                                            <Label style={[styles.label ]}>{ i18n.t('accountName') }</Label>
                                            <Input value={this.state.accountName} placeholder={ i18n.t('enterUsername') } onBlur={() => this.unActiveInput('accountName')} onFocus={() => this.activeInput('accountName')} placeholderTextColor={COLORS.placeholderColor}
                                                   onChangeText={(accountName) => this.setState({accountName})} autoCapitalize='none'
                                                   style={[styles.input , {borderTopRightRadius:25  ,borderTopLeftRadius:25  ,
                                                       borderColor: this.state.accountNameStatus === 1 ? COLORS.blue : COLORS.lightGray ,
                                                       backgroundColor: this.state.accountNameStatus === 1 ? '#fff' : COLORS.lightGray }]}  />
                                        </Item>


                                        <Item style={[styles.loginItem]} bordered>
                                            <Label style={[styles.label ]}>{ i18n.t('bankName') }</Label>
                                            <Input value={this.state.bankName} placeholder={ i18n.t('bankName') } onBlur={() => this.unActiveInput('bankName')} onFocus={() => this.activeInput('bankName')} placeholderTextColor={COLORS.placeholderColor}
                                                   onChangeText={(bankName) => this.setState({bankName})}
                                                   style={[styles.input , {borderTopRightRadius:25 ,borderTopLeftRadius:25  ,
                                                       borderColor: this.state.bankNameStatus === 1 ? COLORS.blue : COLORS.lightGray ,
                                                       backgroundColor: this.state.bankNameStatus === 1 ? '#fff' : COLORS.lightGray }]}  />
                                        </Item>

                                       <Item style={[styles.loginItem]} bordered>
                                            <Label style={[styles.label ]}>{ i18n.t('accountNumber') }</Label>
                                            <Input value={this.state.accountNumber} placeholder={ i18n.t('accountNumber') } onBlur={() => this.unActiveInput('accountNumber')} onFocus={() => this.activeInput('accountNumber')} keyboardType={'number-pad'} placeholderTextColor={COLORS.placeholderColor}
                                                   onChangeText={(accountNumber) => this.setState({accountNumber})}
                                                   style={[styles.input , {borderTopRightRadius:25 ,borderTopLeftRadius:25  ,
                                                       borderColor: this.state.accountNumberStatus === 1 ? COLORS.blue : COLORS.lightGray ,
                                                       backgroundColor: this.state.accountNumberStatus === 1 ? '#fff' : COLORS.lightGray }]}  />
                                        </Item>


                                        <Item style={[styles.loginItem]} bordered>
                                            <Label style={[styles.label ]}>{ i18n.t('amountTransferred') }</Label>
                                            <Input  value={this.state.amountTransferred} placeholder={ i18n.t('amountTransferred') } onBlur={() => this.unActiveInput('amountTransferred')} keyboardType={'number-pad'} onFocus={() => this.activeInput('amountTransferred')} placeholderTextColor={COLORS.placeholderColor}
                                                   onChangeText={(amountTransferred) => this.setState({amountTransferred})}
                                                   style={[styles.input , {borderTopRightRadius:25 ,borderTopLeftRadius:25  ,
                                                       borderColor: this.state.amountTransferredStatus === 1 ? COLORS.blue : COLORS.lightGray ,
                                                       backgroundColor: this.state.amountTransferredStatus === 1 ? '#fff' : COLORS.lightGray }]}  />
                                        </Item>
                                        <Item style={[styles.loginItem]} bordered>
                                           <Label style={[styles.label ]}>{ i18n.t('imageTransferred') }</Label>
                                        </Item>

                                        <View style={[styles.profileImgView ,{marginBottom : 10}]}>
                                            {image != null?
                                                <TouchableOpacity onPress={this._pickImage} style={[styles.bankImg]}>
                                                    <Image source={{uri: image }} resizeMode={'cover'} style={styles.profImg}/>
                                                    <TouchableOpacity  style={styles.cameraTouch}>
                                                        <Image source={require('../../assets/images/camera.png')} resizeMode={'contain'} style={styles.camera}/>
                                                    </TouchableOpacity>
                                                </TouchableOpacity>
                                                :
                                                <TouchableOpacity onPress={this._pickImage} style={[styles.bankImg]}>
                                                    <Image source={{ uri :this.state.imageProfile}} resizeMode={'cover'} style={styles.profImg}/>
                                                    <TouchableOpacity  style={styles.cameraTouch}>
                                                        <Image source={require('../../assets/images/camera.png')} resizeMode={'contain'} style={[styles.camera, { width : 35 , height : 35}]}/>
                                                    </TouchableOpacity>
                                                </TouchableOpacity>
                                            }
                                        </View>



                                        {
                                            this.renderSubmit()
                                        }




                                    </Form>
                                </KeyboardAvoidingView>





                            </View>
                        </View>
                    </ImageBackground>
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

export default connect(mapStateToProps, { userLogin , profile})(Recharge);



