import React, { Component } from "react";
import {
    View,
    Text,
    Image,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity,
    ImageBackground, FlatList, KeyboardAvoidingView, I18nManager,
} from "react-native";
import {Container, Content, Header, Button, Form, Item, Label, Input, Icon, Toast, CheckBox,} from 'native-base'
import styles from '../../assets/styles'
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
import Modal from "react-native-modal";
import StarRating from 'react-native-star-rating';
// import {DoubleBounce} from "react-native-loader";
import axios from "axios";
import CONST from "../consts/colors";
import {connect}         from "react-redux";
import {logout, profile, tempAuth, userLogin} from "../actions";
import {NavigationEvents} from "react-navigation";

const height = Dimensions.get('window').height;
class Profile_delegate extends Component {
    constructor(props){
        super(props);

        this.state={
            orderType: 'user',
            clientsComments : [],
            userImage: null,
            username: '',
            phone: '',
            email: '',
            usernameStatus: 0,
            phoneStatus: 0,
            emailStatus: 0,
            isModalVisible: false,
            oldPass: '',
            newPass: '',
            verifyNewPass: '',
            showOldPass: true,
            showNewPass: true,
            showVerifiedPass: true,
            starCount:3,
            imageProfile: 'https://cross.4hoste.com:30011/images/defaultUser.jpg',
            userName: '',
            spinner: false,
            isLoaded: false,
            base64: '',
            textError : '',
            cityId : null,
            cityName : '',
            iban : '',
            citys                : [],
            isModalCity          : false,

        }

    }

    toggleModal = (type) => {

        if (type === 'city'){
            this.setState({ isModalCity: !this.state.isModalCity});
        }

    };

    selectId(type, id, name) {

        if (type === 'city'){
            this.state.cityId = id;
            this.state.cityName = name;
            this.setState({ isModalCity: !this.state.isModalCity});
        }

    }

    static navigationOptions = () => ({
        drawerLabel: i18n.t('profile') ,
        drawerIcon: (<Image source={require('../../assets/images/noun_profile.png')} style={styles.drawerImg} resizeMode={'contain'} /> )
    });



    onFocus(){
        this.componentWillMount();
    }

    async componentWillMount()
    {

        axios({
            method     : 'post',
            url        :  CONST.url + 'citys',
            data       :  {},
            headers    : {lang :  (this.props.lang) ? this.props.lang : 'ar',}
        }).then(response => {
            this.setState({citys  : response.data.data})
        }).catch(error => {});

         if( this.props.user !== null && this.props.user !== undefined){
            this.setState({
                userName        : ( this.props.user ) ?  this.props.user.userName           : '',
                email           : ( this.props.user ) ?  this.props.user.email              : '',
                phone           : ( this.props.user ) ?  this.props.user.phoneNo            : '',
                imageProfile    : ( this.props.user ) ?  this.props.user.imageProfile       : '',
                cityId          : ( this.props.user ) ?  this.props.user.cityId             : '',
                cityName        : ( this.props.user ) ?  this.props.user.cityName           : '',
                iban            : ( this.props.user ) ?  this.props.user.iban               : '',
            });
        }

        this.setState({ isLoaded: true });
        axios({
            method     : 'post',
            url        :  CONST.url + 'getRatingComments',
            data       :  {},
            headers    : {
                lang          :     ( this.props.lang ) ?  this.props.lang : 'ar',
                delegate_id   :     this.props.auth.data.user_id,
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

                    clientsComments : response.data.data
                });
            }

        }).catch(error => {
            console.log('error  => ' , error.message)
        }).then(()=>{
            this.setState({ isLoaded: false });
        });

    }


    _toggleModal = () => this.setState({ isModalVisible: !this.state.isModalVisible });

    activeInput(type){
        if (type === 'username'){
            this.setState({ usernameStatus: 1 })
        }else if (type === 'phone'){
            this.setState({ phoneStatus: 1 })
        }else if (type === 'email'){
            this.setState({ emailStatus: 1 })
        } else if (type === 'iban'){
            this.setState({ ibanStatus: 1 })
        }
    }

    unActiveInput(type){
        if (type === 'username'){
            this.setState({ usernameStatus: 0 })
        }else if (type === 'phone'){
            this.setState({ phoneStatus: 0 })
        }else if (type === 'email'){
            this.setState({ emailStatus: 0 })
        }else if (type === 'iban'){
            this.setState({ ibanStatus: 0 })
        }
    }


    askPermissionsAsync = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);

    };



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

    renderSubmit()
    {


        return (

            <TouchableOpacity onPress={ () => this.onSend()}  style={[styles.yellowBtn , styles.mb10]}>
                <Text style={styles.whiteText}>{ i18n.t('confirm') }</Text>
            </TouchableOpacity>
        );
    }




    renderChange()
    {


        return (

            <TouchableOpacity onPress={this.change.bind(this)}  style={[styles.yellowBtn , styles.mb10]}>
                <Text style={styles.whiteText}>{ i18n.t('confirm') }</Text>
            </TouchableOpacity>
        );
    }


    validate = () => {
        let isError = false;
        let msg = '';

        if(this.state.oldPass === '') {
            isError = true;
            msg = i18n.t('enterOldPass');
        }else if (  this.state.newPass === '' ) {
            isError = true;
            msg = i18n.t('enterNewPass');
        }else if(this.state.newPass.length < 6) {
            isError = true;
            msg = i18n.t('passlen');
        }else if(this.state.newPass !==  this.state.verifyNewPass) {
            isError = true;
            msg = i18n.t('confirm_password_validation');
        }
        if (msg != ''){
            // Toast.show({ text: msg, duration : 2000  ,type :"danger", textStyle: { color: "white",fontFamily : 'cairoBold' ,textAlign:'center' } });
            // this.state.textError = msg;
            this.setState({ textError  : msg});
        }
        return isError;
    };

    validateUser = () => {
        let isError = false;
        let msg = '';

        if (  this.state.userName === '' ) {
            isError = true;
            msg = i18n.t('name_validation');
        }else if(this.state.phone === '') {
            isError = true;
            msg = i18n.t('enterPhone');
        }else if(this.state.phone.length < 10) {
            isError = true;
            msg = i18n.t('phonelen');
        }else if(this.state.email === '') {
            msg = i18n.t('email_validation');
            isError = true;
        }
        if (msg != ''){
            Toast.show({ text: msg, duration : 2000  ,type :"danger", textStyle: { color: "white",fontFamily : 'cairoBold' ,textAlign:'center' } });
        }
        return isError;
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
    change()
    {
        const err = this.validate();
        if (!err){
            this.setState({ isLoaded: true });

            axios({
                method     : 'post',
                url        :  CONST.url + 'editPassword',
                data       :  {
                    oldPassword   : this.state.oldPass,
                    newPassword   : this.state.newPass,
                },
                headers    : {
                    lang             :     (this.props.lang) ? this.props.lang : 'ar',
                    user_id          :      this.props.auth.data.user_id,
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
                    this.setState({ isModalVisible: !this.state.isModalVisible });
                    Toast.show({ text: response.data.message, duration : 2000 ,
                        type :"success",
                        textStyle: {
                            color: "white",fontFamily : 'cairoBold' ,textAlign:'center'
                        } });

                }

            }).catch(error => {
                console.log(error.message)

            }).then(()=>{
                this.setState({ spinner: false });
                this.setState({ isLoaded: false });
            });
        }
    }

    onSend() {

            const err = this.validateUser();

            if (!err) {

                this.setState({isLoaded: true});
                this.setState({spinner: true});

                axios({
                    method: 'post',
                    url: CONST.url + 'editProfile',
                    data: {
                        userName: this.state.userName,
                        phoneNo: this.state.phone,
                        email: this.state.email,
                        image: (this.state.base64 !== '') ? this.state.base64 : '',
                        cityId          : this.state.cityId,
                        iban            : this.state.iban
                    },
                    headers: {
                        lang: (this.props.lang) ? this.props.lang : 'ar',
                        user_id: this.props.auth.data.user_id,
                    }
                }).then(response => {
                    if (response.data.status === '0') {
                        Toast.show({
                            text: response.data.message, duration: 2000,
                            type: "danger",
                            textStyle: {
                                color: "white", fontFamily: 'cairoBold', textAlign: 'center'
                            }
                        });
                    } else if (response.data.status === '2') {


                        this.props.navigation.navigate('accActivation_client', {
                            type: 'delegate',
                            user_id: this.props.user.user_id
                        });

                        setTimeout(() => {
                            this.logout();
                            this.props.tempAuth();
                        }, 2000)


                    } else {
                        Toast.show({
                            text: response.data.message, duration: 2000,
                            type: "success",
                            textStyle: {
                                color: "white", fontFamily: 'cairoBold', textAlign: 'center'
                            }
                        });
                        this.props.profile(this.props.user);
                    }

                }).catch(error => {

                }).then(() => {
                    this.setState({spinner: false});
                    this.setState({isLoaded: false});
                });
            }
    }




    logout(){
        axios({
            method     : 'post',
            url        :  CONST.url + 'LogOut',
            data       :  {
                device_ID : '000'
            },
            headers    : {
                lang             :    (this.props.lang) ? this.props.lang : 'ar',
                user_id          :    this.props.user.user_id  ,
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
                setTimeout(()=>{
                    this.props.logout();
                    this.props.tempAuth();
                },500)
            }

        }).catch(error => {

        }).then(()=>{
            this.setState({ isLoaded: false });
        });
    }



    _keyExtractor = (item, index) => item.id;



    _comments = (item , key) => {
        return(
            <View  key={key} style={[styles.notiBlock , {padding:7}]}>
                <Image source={{uri : item.image}} resizeMode={'cover'} style={styles.notiImg}/>
                <View style={[styles.directionColumn , {flex:1}]}>
                    <View style={[styles.directionRowSpace ]}>
                        <Text style={[styles.boldGrayText ]}>{item.userName}</Text>
                        <StarRating
                            disabled={true}
                            maxStars={5}
                            rating={item.rate}
                            fullStarColor={COLORS.blue}
                            starSize={13}
                            starStyle={styles.starStyle}
                        />
                    </View>
                    <Text style={[styles.grayText , {writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',fontSize:12} ]}>{ item.comment}</Text>
                </View>
            </View>
        );
    }


    renderInfo(){
        if(this.state.orderType === 'user'){

            let image = this.state.userImage;

            return(
                <View>
                    <View style={[styles.homeSection , {marginTop:10}]}>
                        <View style={[styles.profileImgView ]}>

                            {image != null?
                                <View style={[styles.profileImg]}>
                                    <Image source={{uri: image }} resizeMode={'cover'} style={styles.profImg}/>
                                    <TouchableOpacity onPress={this._pickImage} style={styles.cameraTouch}>
                                        <Image source={require('../../assets/images/camera.png')} resizeMode={'contain'} style={styles.camera}/>
                                    </TouchableOpacity>
                                </View>
                                :
                                <View style={[styles.profileImg]}>
                                    <Image source={{ uri : (this.props.user) ? this.props.user.imageProfile :'https://cross.4hoste.com:30011/images/defaultUser.jpg'  }} resizeMode={'cover'} style={styles.profImg}/>
                                    <TouchableOpacity onPress={this._pickImage} style={styles.cameraTouch}>
                                        <Image source={require('../../assets/images/camera.png')} resizeMode={'contain'} style={styles.camera}/>
                                    </TouchableOpacity>
                                </View>
                            }

                            <Text style={styles.profileName}>{ this.state.userName }</Text>
                        </View>
                        <KeyboardAvoidingView behavior={'padding'} style={styles.keyboardAvoid}>
                            <Form style={{ width: '100%' , marginTop:30}}>

                                <Item style={styles.loginItem} bordered>
                                    <Label style={[styles.label ]}>{ i18n.t('username') }</Label>
                                    <Input placeholder={ i18n.t('enterUsername') }  value={this.state.userName} onBlur={() => this.unActiveInput('userName')} onFocus={() => this.activeInput('userName')} placeholderTextColor={COLORS.placeholderColor}
                                           onChangeText={(userName) => this.setState({userName})} autoCapitalize='none'
                                           style={[styles.input , {borderTopRightRadius:25 , paddingRight:33 ,
                                               borderColor: this.state.usernameStatus === 1 ? COLORS.blue : COLORS.lightGray ,
                                               backgroundColor: this.state.usernameStatus === 1 ? '#fff' : COLORS.lightGray }]}  />
                                    <Image source={require('../../assets/images/noun_editt.png')} style={styles.img} resizeMode={'contain'}/>
                                </Item>

                                <Item style={styles.loginItem} bordered>
                                    <Label style={[styles.label ]}>{ i18n.t('phoneNumber') }</Label>
                                    <Input value={this.state.phone} placeholder={ i18n.t('enterPhone') } onBlur={() => this.unActiveInput('phone')} onFocus={() => this.activeInput('phone')} placeholderTextColor={COLORS.placeholderColor}
                                           onChangeText={(phone) => this.setState({phone})} keyboardType={'number-pad'}
                                           style={[styles.input , {borderTopRightRadius:25 , paddingRight:33 ,
                                               borderColor: this.state.phoneStatus === 1 ? COLORS.blue : COLORS.lightGray ,
                                               backgroundColor: this.state.phoneStatus === 1 ? '#fff' : COLORS.lightGray }]}  />
                                    <Image source={require('../../assets/images/noun_editt.png')} style={styles.img} resizeMode={'contain'}/>
                                </Item>


                                <Item style={[styles.loginItem]} bordered>
                                    <Label style={[styles.label ]}>{ i18n.t('email') }</Label>
                                    <Input value={this.state.email} placeholder={ i18n.t('enterMail') } onBlur={() => this.unActiveInput('email')} onFocus={() => this.activeInput('email')} placeholderTextColor={COLORS.placeholderColor}
                                           onChangeText={(email) => this.setState({email})} keyboardType={'email-address'}
                                           style={[styles.input , {borderTopRightRadius:25 , paddingRight:33 ,
                                               borderColor: this.state.emailStatus === 1 ? COLORS.blue : COLORS.lightGray ,
                                               backgroundColor: this.state.emailStatus === 1 ? '#fff' : COLORS.lightGray }]}  />
                                    <Image source={require('../../assets/images/noun_editt.png')} style={styles.img} resizeMode={'contain'}/>
                                </Item>

                                <View style={[styles.overHidden, { marginBottom:20 }]}>
                                    <Label style={[styles.label ]}>{ i18n.t('citty') }</Label>
                                    <TouchableOpacity onPress={() => this.toggleModal('city')} style={[ styles.input, styles.rowGroup ]}>
                                        <Text style={[styles.textRegular, styles.textSize_14, styles.text_place]}>
                                            { this.state.cityName }
                                        </Text>
                                        <Icon style={[styles.textSize_20, styles.text_yellow]} type="AntDesign" name='down' />
                                    </TouchableOpacity>
                                </View>

                                <Modal isVisible={this.state.isModalCity} onBackdropPress={() => this.toggleModal('city')}>
                                    <View style={[styles.overHidden, styles.bg_White, styles.Radius_5]}>

                                        <View style={[styles.Border, styles.border_gray, styles.paddingVertical_15]}>
                                            <Text style={[styles.textRegular, styles.text_black, styles.textSize_14, styles.textLeft , styles.SelfCenter]}>
                                                {i18n.t('citty')}
                                            </Text>
                                        </View>

                                        <View style={[styles.paddingHorizontal_10, styles.marginVertical_10]}>

                                            {
                                                (this.state.citys.map((city,i)=>{
                                                    return(
                                                        <TouchableOpacity
                                                            style               = {[styles.rowGroup, styles.marginVertical_10]}
                                                            onPress             = {() => this.selectId('city', city.cityId, city.cityName)}
                                                        >
                                                            <View style={[styles.overHidden, styles.rowRight]}>
                                                                <CheckBox
                                                                    style               = {[styles.checkBox, styles.bg_red, styles.border_red]}
                                                                    color               = {styles.text_White}
                                                                    selectedColor       = {styles.text_White}
                                                                    checked             = {this.state.cityId === city.cityId}
                                                                />
                                                                <Text style={[styles.textRegular , styles.text_black, styles.textSize_16, styles.paddingHorizontal_20]}>
                                                                    { city.cityName }
                                                                </Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    );
                                                }))
                                            }

                                        </View>

                                    </View>
                                </Modal>


                                {
                                    (this.state.iban !== '') ?
                                        <Item style={[styles.loginItem]} bordered>
                                            <Label style={[styles.label ]}>{ i18n.t('iban') }</Label>
                                            <Input value={this.state.iban} placeholder={ i18n.t('eniban') } onBlur={() => this.unActiveInput('iban')} onFocus={() => this.activeInput('iban')} placeholderTextColor={COLORS.placeholderColor}
                                                   onChangeText={(iban) => this.setState({iban})} keyboardType={'email-address'}
                                                   style={[styles.input , {borderTopRightRadius:25 , paddingRight:33 ,
                                                       borderColor: this.state.ibanStatus === 1 ? COLORS.blue : COLORS.lightGray ,
                                                       backgroundColor: this.state.ibanStatus === 1 ? '#fff' : COLORS.lightGray }]}  />
                                            <Image source={require('../../assets/images/noun_editt.png')} style={styles.img} resizeMode={'contain'}/>
                                        </Item>
                                        :
                                        <View/>
                                }

                                <TouchableOpacity onPress={this._toggleModal} style={[styles.yellowBtn , styles.mt25, styles.mb10]}>
                                    <Text style={styles.whiteText}>{ i18n.t('changePass') }</Text>
                                </TouchableOpacity>




                                {this.renderSubmit()}



                            </Form>
                        </KeyboardAvoidingView>
                    </View>
                    <Modal onBackdropPress={()=> this.setState({ isModalVisible : false })} isVisible={this.state.isModalVisible}>
                        <View style={styles.modalStyle}>
                            <View style={styles.modalHead}>
                                <Text style={[styles.whiteText , {fontSize:15}]}>{ i18n.t('changePass') }</Text>
                            </View>
                            <Form style={{ width: '100%' , padding:20}}>

                                <Item style={styles.loginItem} bordered>
                                    <Label style={[styles.label ]}>{ i18n.t('oldPass') }</Label>
                                    <Input placeholder={i18n.t('enterOldPass')} placeholderTextColor={COLORS.placeholderColor} autoCapitalize='none' onChangeText={(oldPass) => this.setState({oldPass})} secureTextEntry={this.state.showOldPass === true ? true : false} style={[styles.input  ,{borderTopRightRadius:25,paddingRight:40}]}  />

                                    <TouchableOpacity style={styles.eye} onPress={() => this.setState({showOldPass: !this.state.showOldPass})}>
                                        <Icon type={'FontAwesome'} name={ this.state.showOldPass === true ? 'eye' : 'eye-slash'} style={[styles.eyeIcon]} />
                                    </TouchableOpacity>
                                </Item>

                                <Item style={styles.loginItem} bordered>
                                    <Label style={[styles.label ]}>{ i18n.t('newPass') }</Label>
                                    <Input placeholder={i18n.t('enterNewPass')} placeholderTextColor={COLORS.placeholderColor} autoCapitalize='none' onChangeText={(newPass) => this.setState({newPass})} secureTextEntry={this.state.showNewPass === true ? true : false} style={[styles.input  ,{borderTopRightRadius:25,paddingRight:40}]}  />

                                    <TouchableOpacity style={styles.eye} onPress={() => this.setState({showNewPass: !this.state.showNewPass})}>
                                        <Icon type={'FontAwesome'} name={ this.state.showNewPass === true ? 'eye' : 'eye-slash'} style={[styles.eyeIcon]} />
                                    </TouchableOpacity>
                                </Item>

                                <Item style={styles.loginItem} bordered>
                                    <Label style={[styles.label ]}>{ i18n.t('verifyNewPass') }</Label>
                                    <Input placeholder={i18n.t('enterConfirmPass')} placeholderTextColor={COLORS.placeholderColor} autoCapitalize='none' onChangeText={(verifyNewPass) => this.setState({verifyNewPass})} secureTextEntry={this.state.showVerifiedPass === true ? true : false} style={[styles.input  ,{borderTopRightRadius:25,paddingRight:40}]}  />

                                    <TouchableOpacity style={styles.eye} onPress={() => this.setState({showVerifiedPass: !this.state.showVerifiedPass})}>
                                        <Icon type={'FontAwesome'} name={ this.state.showVerifiedPass === true ? 'eye' : 'eye-slash'} style={[styles.eyeIcon]} />
                                    </TouchableOpacity>
                                </Item>

                                {
                                    this.renderChange()
                                }
                            </Form>
                        </View>
                    </Modal>
                </View>
            )
        }   else {
            return(
                (this.state.clientsComments.length > 0)
                ?
                <FlatList
                    data={this.state.clientsComments}
                    renderItem={({item}) => this._comments(item)}
                    numColumns={1}
                    keyExtractor={this._keyExtractor}
                />
                : <View style={{flex : 1, alignSelf:  'center', marginVertical: 30 }}>
                        <Image style={{resizeMode : 'contain' , width : 300 , height : 300  }} source={ require('../../assets/images/no_result.png') }/>
                 </View>
            )
        }
    }



    render() {


        return (
            <Container>


                <Header style={[styles.header ]} noShadow>
                    <Button onPress={() => this.props.navigation.openDrawer()} transparent style={styles.headerBtn}>
                        <Image source={require('../../assets/images/noun_menu.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                    </Button>
                      <Text style={[styles.headerText , {right:0} ]}>{i18n.t('profile')}</Text>
                    <Button   transparent style={styles.headerBtn}></Button>
                </Header>



                {this.renderLoader ()}
                <Content contentContainerStyle={styles.flexGrow} style={{}} >
                    <ImageBackground source={require('../../assets/images/bg.png')} resizeMode={'cover'} style={styles.imageBackground}>
                        <View style={styles.orderTabs}>
                            <TouchableOpacity onPress={ () => this.setState({orderType:'user'})} style={this.state.orderType === 'user' ? styles.activeTab : styles.normalTab}>
                                <Text style={this.state.orderType === 'user' ? styles.activeTabText :styles.normalTabText} >{i18n.t('profile')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={ () => this.setState({orderType:1})} style={this.state.orderType === 1 ? styles.activeTab : styles.normalTab}>
                                <Text style={this.state.orderType === 1 ? styles.activeTabText :styles.normalTabText} >{i18n.t('reviews')}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.homeSection, {marginTop:20} ]}>
                            { this.renderInfo() }
                        </View>
                    </ImageBackground>
                    <Modal onBackdropPress={()=> this.setState({ isModalVisible : false })} isVisible={this.state.isModalVisible}>
                        <View style={styles.modalStyle}>
                            <View style={styles.modalHead}>
                                <Text style={[styles.whiteText , {fontSize:15}]}>{ i18n.t('changePass') }</Text>
                            </View>
                            <Form style={{ width: '100%' , padding:20}}>

                                <Item style={styles.loginItem} bordered>
                                    <Label style={[styles.label ]}>{ i18n.t('oldPass') }</Label>
                                    <Input placeholder={i18n.t('enterOldPass')} placeholderTextColor={COLORS.placeholderColor} autoCapitalize='none' onChangeText={(oldPass) => this.setState({oldPass})} secureTextEntry={this.state.showOldPass === true ? true : false} style={[styles.input  ,{borderTopRightRadius:25,paddingRight:40}]}  />

                                    <TouchableOpacity style={styles.eye} onPress={() => this.setState({showOldPass: !this.state.showOldPass})}>
                                        <Icon type={'FontAwesome'} name={ this.state.showOldPass === true ? 'eye' : 'eye-slash'} style={[styles.eyeIcon]} />
                                    </TouchableOpacity>
                                </Item>

                                <Item style={styles.loginItem} bordered>
                                    <Label style={[styles.label ]}>{ i18n.t('newPass') }</Label>
                                    <Input placeholder={i18n.t('enterNewPass')} placeholderTextColor={COLORS.placeholderColor} autoCapitalize='none' onChangeText={(newPass) => this.setState({newPass})} secureTextEntry={this.state.showNewPass === true ? true : false} style={[styles.input  ,{borderTopRightRadius:25,paddingRight:40}]}  />

                                    <TouchableOpacity style={styles.eye} onPress={() => this.setState({showNewPass: !this.state.showNewPass})}>
                                        <Icon type={'FontAwesome'} name={ this.state.showNewPass === true ? 'eye' : 'eye-slash'} style={[styles.eyeIcon]} />
                                    </TouchableOpacity>
                                </Item>

                                <Item style={styles.loginItem} bordered>
                                    <Label style={[styles.label ]}>{ i18n.t('verifyNewPass') }</Label>
                                    <Input placeholder={i18n.t('enterConfirmPass')} placeholderTextColor={COLORS.placeholderColor} autoCapitalize='none' onChangeText={(verifyNewPass) => this.setState({verifyNewPass})} secureTextEntry={this.state.showVerifiedPass === true ? true : false} style={[styles.input  ,{borderTopRightRadius:25,paddingRight:40}]}  />

                                    <TouchableOpacity style={styles.eye} onPress={() => this.setState({showVerifiedPass: !this.state.showVerifiedPass})}>
                                        <Icon type={'FontAwesome'} name={ this.state.showVerifiedPass === true ? 'eye' : 'eye-slash'} style={[styles.eyeIcon]} />
                                    </TouchableOpacity>
                                </Item>

                                <TouchableOpacity onPress={this._toggleModal}  style={[styles.yellowBtn , styles.mb10]}>
                                    <Text style={styles.whiteText}>{ i18n.t('confirm') }</Text>
                                </TouchableOpacity>
                            </Form>
                        </View>
                    </Modal>
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

export default connect(mapStateToProps, { userLogin , profile,logout,tempAuth })(Profile_delegate);


