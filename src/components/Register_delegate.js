import React, { Component } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    ImageBackground,
    I18nManager,
    ActivityIndicator,
    AsyncStorage
} from "react-native";
import {Container, Content, Item, Input, Label, Form, Icon, CheckBox, Toast} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
// import {DoubleBounce} from "react-native-loader";
import axios from "axios";
import CONST from "../consts/colors";
import * as Location from "expo-location";
import DateTimePicker from "react-native-modal-datetime-picker";
import Modal from "react-native-modal";
import * as Notifications from 'expo-notifications';



const height = Dimensions.get('window').height;

class Register_delegate extends Component {
    constructor(props){
        super(props);

        this.state={
            username             : '',
            phone                : '',
            isLoaded             : false,
            password             : '',
            email                : '',
            IdNumber             : '',
            deviceID             : '',
            plateNum             : '',
            contractImg          : '',
            contractImage        : '',
            userImg              : '',
            userImage            : '',
            showPass             : true,
            checkTerms           : false,
            isDatePickerVisible  : false,
            base64               : null,
            carImg               : '',
            carNumber            : '',
            vehicleLicenses      : '',
            vehicleLicensesImage : '',
            carImgImage          : '',
            userUrl              : '',
            lat                  : '',
            long                 : '',
            location             : '',
            deviceType           : 'ios',
            iban                 : '',
            dateDelegate         : '',
            image                : '',
            carName              : i18n.t('enmove'),
            carId                : null,
            cityName             : i18n.t('encity'),
            cityId               : null,
            isModalCity          : false,
            isModalCar           : false,
            citys                : [],
            types                : [],
            nationalities        : [],
            nationName           : i18n.t('nationali'),
            nationId             : null,
            isModalNation        : false,
            carImgBack           : '',
            carImgBackB64        : '',
        }
    }


 async componentWillMount(){

     axios({
         method     : 'post',
         url        :  CONST.url + 'regions',
         data       :  {},
         headers    : {lang :  (this.props.lang) ? this.props.lang : 'ar',}
     }).then(response => {
         this.setState({nationalities  : response.data.data})
     }).catch(error => {});

     axios({
         method     : 'post',
         url        :  CONST.url + 'citys',
         data       :  {},
         headers    : {lang :  (this.props.lang) ? this.props.lang : 'ar',}
     }).then(response => {
         this.setState({citys  : response.data.data})
     }).catch(error => {});

     axios({
         method     : 'post',
         url        :  CONST.url + 'carTypes',
         data       :  {},
         headers    : {lang :  (this.props.lang) ? this.props.lang : 'ar',}
     }).then(response => {
         this.setState({types  : response.data.data})
     }).catch(error => {});



     // setTimeout(()=>{
     //     this.allowNotification();
     // },12000)
     //
     setTimeout(()=>{
         this.getLocation();
     },9000)
    }
   // async  allowNotification(){
   //     const { status: existingStatus } = await Permissions.getAsync(
   //         Permissions.NOTIFICATIONS
   //     );
   //
   //     let finalStatus = existingStatus;
   //
   //     if (existingStatus !== 'granted') {
   //         const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
   //         finalStatus = status;
   //     }
   //
   //     if (finalStatus !== 'granted') {
   //         return;
   //     }
   //
   //     let token = await Notifications.getExpoPushTokenAsync();
   //
   //     console.log('go deviceID ====', token);
   //     this.setState({ deviceID : token });
   //
   //     AsyncStorage.setItem('yumDeviceID', token);
   //  }


    async getLocation(){
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
        getCity      += '&key=AIzaSyCJTSwkdcdRpIXp2yG7DfSRKFWxKhQdYhQ&language=ar&sensor=true';

        try {
            const { data } = await axios.get(getCity);
            this.setState({ location: data.results[0].formatted_address });
        } catch (e) {
            console.log(e);
        }
    }
    toggleDatePicker = () => {
        this.setState({ isDatePickerVisible: !this.state.isDatePickerVisible });
    };

    doneDatePicker = date => {
        let formatted_date = date.getFullYear() + "-" + ("0"+(date.getMonth() + 1)).slice(-2) + "-" + ("0" +date.getDate()).slice(-2);
        this.setState({ dateDelegate : formatted_date, isDatePickerVisible: false });
    };

    toggleModal = (type) => {

        if (type === 'city'){
            this.setState({ isModalCity: !this.state.isModalCity});
        }

        if (type === 'car'){
            this.setState({ isModalCar: !this.state.isModalCar});
        }

        if (type === 'nation'){
            this.setState({ isModalNation: !this.state.isModalNation});
        }

    };

    selectId(type, id, name) {

        if (type === 'city'){
            this.state.cityId = id;
            this.state.cityName = name;
            this.setState({ isModalCity: !this.state.isModalCity});
        }

        if (type === 'car'){
            this.state.carId = id;
            this.state.carName = name;
            this.setState({ isModalCar: !this.state.isModalCar});
        }

        if (type === 'nation'){
            this.state.nationId = id;
            this.state.nationName = name;
            this.setState({ isModalNation: !this.state.isModalNation});
        }


    }

    validate = () => {
        let isError = false;
        let msg = '';

        if ( this.state.userImg === '' ) {
            isError = true;
            msg = i18n.t('enimg');
        }else if ( this.state.username === '' ) {
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
        }else if(this.state.IdNumber === '') {
            msg = i18n.t('enterId');
            isError = true;
        }else if(this.state.carNumber === '') {
            msg = i18n.t('encarnumber');
            isError = true;
        }else if(this.state.dateDelegate === '') {
            msg = i18n.t('dateDelegate');
            isError = true;
        }else if(this.state.cityId === null) {
            msg = i18n.t('encity');
            isError = true;
        }else if(this.state.carId === null) {
            msg = i18n.t('enmove');
            isError = true;
        }else if(this.state.vehicleLicenses === '') {
            msg = i18n.t('vehicleLicenses_validation');
            isError = true;
        }else if(this.state.carImgImage === '') {
            msg = i18n.t('carImg_validation');
            isError = true;
        }else if(this.state.contractImg === '') {
            msg = i18n.t('requiredContractImg');
            isError = true;
        }else if(this.state.password === '') {
            isError = true;
            msg = i18n.t('enterpassword');
        }else if(this.state.password.length < 6) {
            isError = true;
            msg = i18n.t('passlen');
        }else if(this.state.checkTerms === false) {
            isError = true;
            msg = i18n.t('checkTerms_validation');
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
             <TouchableOpacity onPress={ () => this.onSend()} style={[styles.yellowBtn , styles.mt15, styles.mb10 ]}>
                <Text style={styles.whiteText}>{ i18n.t('registerButton') }</Text>
             </TouchableOpacity>
        );
    }

    onSend() {
        const err = this.validate();
        if (!err){
            this.setState({ isLoaded: true });
            axios({
                method     : 'post',
                url        :  CONST.url + 'sign-up',
                data       :  {
                    userName              : this.state.username,
                    phoneNo               : this.state.phone,
                    password              : this.state.password,
                    email                 : this.state.email,
                    deviceID              : this.state.deviceID,
                    userType              : this.props.navigation.state.params.type,
                    deviceType            : this.state.deviceType,
                    imageLicense          : this.state.vehicleLicenses,
                    imageCar              : this.state.carImgImage,
                    cardNumber            : this.state.IdNumber,
                    carNumber             : this.state.carNumber,
                    lat                   : this.state.lat,
                    long                  : this.state.long,
                    address               : this.state.location,
                    contractImg           : this.state.contractImg,

                    iban                  : this.state.iban,
                    dateDelegate          : this.state.dateDelegate,
                    cityId                : this.state.cityId,
                    image                 : this.state.userImg,
                    carId                 : this.state.carId,
                    regionId              : this.state.nationId,
                    imageCarBack          : this.state.carImgBackB64,
                },
                headers    : {
                    lang                  :   (this.props.lang) ? this.props.lang : 'ar',
                }
            }).then(response => {

                console.log('adel is sleeping' , response.data);

                Toast.show({ text: response.data.message, duration : 2000 ,
                    type :"danger",
                    textStyle: {
                        color: "white",fontFamily : 'cairoBold' ,textAlign:'center'
                    } });

                if(response.data.status === '0')
                {
                    Toast.show({ text: response.data.message, duration : 2000 ,
                        type :"danger",
                        textStyle: {
                            color: "white",fontFamily : 'cairoBold' ,textAlign:'center'
                        } });
                }else if(response.data.status === '2')
                {
                    Toast.show({ text: response.data.message, duration : 2000 ,
                        type :"success",
                        textStyle: {
                            color: "white",fontFamily : 'cairoBold' ,textAlign:'center'
                        } });
                    this.props.navigation.navigate('accActivation_client', {
                        type : this.props.navigation.state.params.type,
                        user_id : response.data.data.user_id,
                        activitionCode : response.data.data.activitionCode
                    });
                }else{
                    Toast.show({ text: response.data.message, duration : 2000 ,
                        type :"success",
                        textStyle: {
                            color: "white",fontFamily : 'cairoBold' ,textAlign:'center'
                        } });
                    this.props.navigation.navigate('accActivation_client', {
                        type : this.props.navigation.state.params.type,
                        user_id : response.data.data.user_id,
                        activitionCode : response.data.data.activitionCode
                    });
                }

            }).catch(error => {
                console.log(error.message)
            }).then(()=>{
                this.setState({ isLoaded: false });
            });
        }
    }

    askPermissionsAsync = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);

    };

    _carImg = async () => {

        this.askPermissionsAsync();

        let result = await ImagePicker.launchImageLibraryAsync({
            aspect: [4, 3],
            base64:true,

        });

        if (!result.cancelled) {
            this.setState({ carImgImage : result.base64,userImage: result.uri ,base64:result.base64  });
        }
    };

    _carImgBack = async () => {

        this.askPermissionsAsync();

        let result = await ImagePicker.launchImageLibraryAsync({
            aspect: [4, 3],
            base64:true,

        });

        if (!result.cancelled) {
            this.setState({ carImgBackB64 : result.base64,carImgBack: result.uri ,base64:result.base64  });
        }
    };

    _enterContractImg = async () => {

        this.askPermissionsAsync();

        let result = await ImagePicker.launchImageLibraryAsync({
            aspect: [4, 3],
            base64:true,

        });

        if (!result.cancelled) {
            this.setState({
                contractImg : result.base64,
                contractImage: result.uri ,
                base64:result.base64
            });
        }
    };

    _userImg = async () => {

        this.askPermissionsAsync();

        let result = await ImagePicker.launchImageLibraryAsync({
            aspect: [4, 3],
            base64:true,

        });

        if (!result.cancelled) {
            this.setState({
                userImg : result.base64,
                userUrl: result.uri ,
                base64:result.base64
            });
        }
    };


    _vehicleLicensesImage = async () => {

        this.askPermissionsAsync();

        let result = await ImagePicker.launchImageLibraryAsync({
            aspect: [4, 3],
            base64:true,

        });


        if (!result.cancelled) {
            this.setState({
                vehicleLicenses         : result.base64,
                vehicleLicensesImage    : result.uri,
                base64                  : result.base64
            });
        }
    };


    async componentDidMount(){
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
    }

    render() {

        let { userUrl } = this.state;

        return (
            <Container>
                <Content  contentContainerStyle={styles.flexGrow}>
                    <TouchableOpacity style={styles.authBack} onPress={() => this.props.navigation.goBack()}>
                        <Icon type={'FontAwesome'} name={'angle-right'} style={[styles.transform]} />
                    </TouchableOpacity>
                    <ImageBackground source={require('../../assets/images/bg.png')} resizeMode={'cover'} style={styles.imageBackground}>
                        <ImageBackground source={require('../../assets/images/headerlogin.png')} resizeMode={'cover'} style={[styles.headerbg, styles.flexCenter]}>
                            <Image source={require('../../assets/images/logo.png')} style={[styles.width_120]} resizeMode={'contain'} />
                        </ImageBackground>
                        <View style={styles.authMainView}>
                            <Text style={[styles.yellowText , styles.mb15]}>{ i18n.t('registerButton') }</Text>

                                <Form style={{ width: '100%' , marginTop:30}}>

                                    <View style={[ styles.marginVertical_20, styles.position_R ]}>
                                        <TouchableOpacity onPress={() => this._userImg()} style={[ styles.overHidden, styles.flexCenter,styles.position_R ]}>
                                            {
                                                this.state.userUrl === '' ?
                                                    <Image resizeMode={'contain'} source={require('../../assets/images/camera.png')} style={[ styles.width_90, styles.height_90, ]} />
                                                    :
                                                    <Image source={{ uri: userUrl }} style={[ styles.width_100, styles.height_100, styles.Radius_10, { borderWidth : 1, borderColor : '#DDD' } ]} />
                                            }
                                        </TouchableOpacity>
                                        <Text style={[ styles.textRegular, styles.textSize_14, styles.text_gray, styles.textCenter, styles.marginVertical_10 ]}>
                                            {i18n.translate('enimg')}
                                        </Text>
                                    </View>

                                    {/*<KeyboardAvoidingView behavior={'padding'} style={styles.keyboardAvoid}>*/}
                                    <Item style={styles.loginItem} bordered>
                                        <Label style={[styles.label ]}>{ i18n.t('delegateName') }</Label>
                                        <Input placeholder={i18n.t('enterUsername')} placeholderTextColor={COLORS.placeholderColor} onChangeText={(username) => this.setState({username})} autoCapitalize='none' style={styles.input}  />
                                    </Item>

                                    <Item style={styles.loginItem} bordered>
                                        <Label style={[styles.label ]}>{ i18n.t('phoneNumber') }</Label>
                                        <Input placeholder={ i18n.t('enterPhone') } placeholderTextColor={COLORS.placeholderColor} onChangeText={(phone) => this.setState({phone})} keyboardType={'number-pad'} style={styles.input}  />
                                    </Item>

                                    <Item style={styles.loginItem} bordered>
                                        <Label style={[styles.label ]}>{ i18n.t('email') }</Label>
                                        <Input placeholder={ i18n.t('enterMail') } placeholderTextColor={COLORS.placeholderColor} onChangeText={(email) => this.setState({email})} keyboardType={'email-address'} style={styles.input}  />
                                    </Item>

                                    <Item style={styles.loginItem} bordered>
                                        <Label style={[styles.label ]}>{ i18n.t('idNum') }</Label>
                                        <Input placeholder={ i18n.t('enterId') } placeholderTextColor={COLORS.placeholderColor} onChangeText={(IdNumber) => this.setState({IdNumber})} keyboardType={'number-pad'} style={styles.input}  />
                                    </Item>

                                    <Item style={styles.loginItem} bordered>
                                        <Label style={[styles.label ]}>{ i18n.t('carnumber') }</Label>
                                        <Input placeholder={i18n.t('encarnumber')} placeholderTextColor={COLORS.placeholderColor} onChangeText={(carNumber) => this.setState({carNumber})} autoCapitalize='none' style={styles.input}  />
                                    </Item>

                                    <Item style={styles.loginItem} bordered>
                                        <Label style={[styles.label ]}>{ i18n.t('iban') }</Label>
                                        <Input placeholder={i18n.t('eniban')} placeholderTextColor={COLORS.placeholderColor} onChangeText={(iban) => this.setState({iban})} autoCapitalize='none' style={styles.input}  />
                                    </Item>

                                    <View style={[styles.overHidden, { marginBottom:20 }]}>
                                        <Label style={[styles.label ]}>{ i18n.t('dateDelegate') }</Label>
                                        <TouchableOpacity onPress={this.toggleDatePicker} style={[ styles.input, styles.rowGroup ]}>
                                            <Text style={[styles.textRegular, styles.textSize_14, styles.text_place]}>
                                                {i18n.translate('dateDelegate')} : {this.state.dateDelegate}
                                            </Text>
                                            <Icon style={[styles.textSize_20, styles.text_place]} type="AntDesign" name='calendar' />
                                        </TouchableOpacity>
                                    </View>

                                    <DateTimePicker
                                        isVisible       = {this.state.isDatePickerVisible}
                                        onConfirm       = {this.doneDatePicker}
                                        onCancel        = {this.toggleDatePicker}
                                        mode            = {'date'}
                                        // minimumDate     = {new Date()}
                                    />

                                    <View style={[styles.overHidden, { marginBottom:20 }]}>
                                        <Label style={[styles.label ]}>{ i18n.t('citty') }</Label>
                                        <TouchableOpacity onPress={() => this.toggleModal('city')} style={[ styles.input, styles.rowGroup ]}>
                                            <Text style={[styles.textRegular, styles.textSize_14, styles.text_place]}>
                                                { this.state.cityName }
                                            </Text>
                                            <Icon style={[styles.textSize_20, styles.text_place]} type="AntDesign" name='down' />
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

                                    <View style={[styles.overHidden, { marginBottom:20 }]}>
                                        <Label style={[styles.label ]}>{ i18n.t('ennationali') }</Label>
                                        <TouchableOpacity onPress={() => this.toggleModal('nation')} style={[ styles.input, styles.rowGroup ]}>
                                            <Text style={[styles.textRegular, styles.textSize_14, styles.text_place]}>
                                                { this.state.nationName }
                                            </Text>
                                            <Icon style={[styles.textSize_20, styles.text_place]} type="AntDesign" name='down' />
                                        </TouchableOpacity>
                                    </View>

                                    <Modal isVisible={this.state.isModalNation} onBackdropPress={() => this.toggleModal('nation')}>
                                        <View style={[styles.overHidden, styles.bg_White, styles.Radius_5]}>

                                            <View style={[styles.Border, styles.border_gray, styles.paddingVertical_15]}>
                                                <Text style={[styles.textRegular, styles.text_black, styles.textSize_14, styles.textLeft , styles.SelfCenter]}>
                                                    {i18n.t('ennationali')}
                                                </Text>
                                            </View>

                                            <View style={[styles.paddingHorizontal_10, styles.marginVertical_10]}>

                                                {
                                                    (this.state.nationalities.map((nation,i)=>{
                                                        return(
                                                            <TouchableOpacity
                                                                style               = {[styles.rowGroup, styles.marginVertical_10]}
                                                                onPress             = {() => this.selectId('nation', nation.regionId, nation.regionName)}
                                                            >
                                                                <View style={[styles.overHidden, styles.rowRight]}>
                                                                    <CheckBox
                                                                        style               = {[styles.checkBox, styles.bg_red, styles.border_red]}
                                                                        color               = {styles.text_White}
                                                                        selectedColor       = {styles.text_White}
                                                                        checked             = {this.state.nationId === nation.regionId}
                                                                    />
                                                                    <Text style={[styles.textRegular , styles.text_black, styles.textSize_16, styles.paddingHorizontal_20]}>
                                                                        { nation.regionName }
                                                                    </Text>
                                                                </View>
                                                            </TouchableOpacity>
                                                        );
                                                    }))
                                                }

                                            </View>

                                        </View>
                                    </Modal>

                                    <View style={[styles.overHidden, { marginBottom:20 }]}>
                                        <Label style={[styles.label ]}>{ i18n.t('move') }</Label>
                                        <TouchableOpacity onPress={() => this.toggleModal('car')} style={[ styles.input, styles.rowGroup ]}>
                                            <Text style={[styles.textRegular, styles.textSize_14, styles.text_place]}>
                                                { this.state.carName }
                                            </Text>
                                            <Icon style={[styles.textSize_20, styles.text_place]} type="AntDesign" name='down' />
                                        </TouchableOpacity>
                                    </View>

                                    <Modal isVisible={this.state.isModalCar} onBackdropPress={() => this.toggleModal('car')}>
                                        <View style={[styles.overHidden, styles.bg_White, styles.Radius_5]}>

                                            <View style={[styles.Border, styles.border_gray, styles.paddingVertical_15]}>
                                                <Text style={[styles.textRegular, styles.text_black, styles.textSize_14, styles.textLeft , styles.SelfCenter]}>
                                                    {i18n.t('move')}
                                                </Text>
                                            </View>

                                            <View style={[styles.paddingHorizontal_10, styles.marginVertical_10]}>
                                                {
                                                    (this.state.types.map((type,i)=>{
                                                        return(
                                                            <TouchableOpacity
                                                                style               = {[styles.rowGroup, styles.marginVertical_10]}
                                                                onPress             = {() => this.selectId('car', type.carTypeId, type.carTypeName)}
                                                            >
                                                                <View style={[styles.overHidden, styles.rowRight]}>
                                                                    <CheckBox
                                                                        style               = {[styles.checkBox, styles.bg_red, styles.border_red]}
                                                                        color               = {styles.text_White}
                                                                        selectedColor       = {styles.text_White}
                                                                        checked             = {this.state.carId === type.carTypeId}
                                                                    />
                                                                    <Text style={[styles.textRegular , styles.text_black, styles.textSize_16, styles.paddingHorizontal_20]}>
                                                                        { type.carTypeName }
                                                                    </Text>
                                                                </View>
                                                            </TouchableOpacity>
                                                        );
                                                    }))
                                                }
                                            </View>

                                        </View>
                                    </Modal>

                                    <TouchableOpacity style={styles.loginItem} onPress={this._vehicleLicensesImage}>
                                        <Label style={[styles.label ]}>{ i18n.t('licenseImg') }</Label>
                                        <Input placeholder={ i18n.t('enterLicense') } placeholderTextColor={COLORS.placeholderColor} utoCapitalize='none' disabled value={this.state.vehicleLicensesImage} style={[styles.input , {paddingRight:40}]}  />

                                        <View style={styles.cameraView} onPress={() => this.setState({showPass: !this.state.showPass})}>
                                            <Icon type={'FontAwesome'} name={'camera'} style={[styles.cameraIcon]} />
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.loginItem} onPress={this._carImg}>
                                        <Label style={[styles.label ]}>{ i18n.t('carImg') }</Label>
                                        <Input placeholder={i18n.t('enterCarImg')} placeholderTextColor={COLORS.placeholderColor} utoCapitalize='none' disabled value={this.state.userImage} style={[styles.input , {paddingRight:40}]}/>

                                        <View style={styles.cameraView} onPress={() => this.setState({showPass: !this.state.showPass})}>
                                            <Icon type={'FontAwesome'} name={'camera'} style={[styles.cameraIcon]} />
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.loginItem} onPress={this._carImgBack}>
                                        <Label style={[styles.label ]}>{ i18n.t('endcarImg') }</Label>
                                        <Input placeholder={i18n.t('enCarImg')} placeholderTextColor={COLORS.placeholderColor} utoCapitalize='none' disabled value={this.state.carImgBack} style={[styles.input , {paddingRight:40}]}/>

                                        <View style={styles.cameraView} onPress={() => this.setState({showPass: !this.state.showPass})}>
                                            <Icon type={'FontAwesome'} name={'camera'} style={[styles.cameraIcon]} />
                                        </View>
                                    </TouchableOpacity>


                                    <TouchableOpacity style={styles.loginItem} onPress={this._enterContractImg}>
                                        <Label style={[styles.label ]}>{ i18n.t('contract') }</Label>
                                        <Input placeholder={i18n.t('enterContractImg')} placeholderTextColor={COLORS.placeholderColor} utoCapitalize='none' disabled value={this.state.contractImage} style={[styles.input , {paddingRight:40}]}/>

                                        <View style={styles.cameraView} onPress={() => this.setState({showPass: !this.state.showPass})}>
                                            <Icon type={'FontAwesome'} name={'camera'} style={[styles.cameraIcon]} />
                                        </View>
                                    </TouchableOpacity>

                                    {/*<Item style={styles.loginItem} bordered>*/}
                                        {/*<Label style={[styles.label ]}>{ i18n.t('carNum') }</Label>*/}
                                        {/*<Input placeholder={i18n.t('enterCarNum')} placeholderTextColor={COLORS.placeholderColor} onChangeText={(plateNum) => this.setState({plateNum})} keyboardType={'number-pad'} style={styles.input}  />*/}
                                    {/*</Item>*/}

                                    <Item style={styles.loginItem} bordered>
                                        <Label style={[styles.label ]}>{ i18n.t('password') }</Label>
                                        <Input placeholder={i18n.t('enterPass')} placeholderTextColor={COLORS.placeholderColor} autoCapitalize='none' onChangeText={(password) => this.setState({password})} secureTextEntry={this.state.showPass === true ? true : false} style={[styles.input , {paddingRight:40}]}  />

                                        <TouchableOpacity style={styles.eye} onPress={() => this.setState({showPass: !this.state.showPass})}>
                                            <Icon type={'FontAwesome'} name={ this.state.showPass === true ? 'eye' : 'eye-slash'} style={[styles.eyeIcon]} />
                                        </TouchableOpacity>
                                    </Item>

                                    <View style={[styles.directionRow , styles.mb15]}>
                                        <CheckBox onPress={() => this.setState({checkTerms: !this.state.checkTerms})} checked={this.state.checkTerms} color={COLORS.blue} style={styles.checkBox} />
                                        <TouchableOpacity  onPress={()=>{this.props.navigation.navigate('policy_delegate')}}>
                                            <Text style={[styles.grayText , {fontSize:12} ]}> { i18n.t('byRegister') } <Text  style={styles.termText}>{ i18n.t('terms') }</Text></Text>
                                        </TouchableOpacity>
                                    </View>

                                    {this.renderSubmit()}

                                    <TouchableOpacity onPress={ () => this.props.navigation.navigate('login_delegate')} style={[styles.forgetPass , styles.mb100]}>
                                        <Text style={[styles.grayText , {fontSize:14} ]}>{ i18n.t('haveAcc') } </Text>
                                        <Text style={[styles.grayText , {fontSize:14 , color:COLORS.blue} ]}>{ i18n.t('clickHere') }</Text>
                                    </TouchableOpacity>

                                    {/*</KeyboardAvoidingView>*/}

                                </Form>
                        </View>
                    </ImageBackground>
                </Content>
            </Container>

        );
    }
}

export default Register_delegate;
