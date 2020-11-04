import React, { Component } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    FlatList,
    Platform,
    ActivityIndicator
} from "react-native";
import {Container, Content, Header, Button, Item, Input, Label, Textarea, Toast} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import StarRating from 'react-native-star-rating';
import COLORS from '../../src/consts/colors'
import {connect}         from "react-redux";
import {profile, userLogin} from "../actions";
// import {DoubleBounce} from "react-native-loader";
import axios from "axios";
import CONST from "../consts/colors";


const height = Dimensions.get('window').height;


class AddRate_client extends Component {
    constructor(props){
        super(props);

        this.state={
            starCount:0,
            starCount2:0,
            msg: '',
            msgDelegate: '',
            delegate: '',
            place: '',
            isLoaded: false,
        }
    }


    componentWillMount(){
        this.setState({
            delegate : this.props.navigation.state.params.delegate,
            place    : this.props.navigation.state.params.place,
        });
    }
    static navigationOptions = () => ({
        drawerLabel: () => null,
    });

    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
    }
    onStarRatingPress2(rating) {
        this.setState({
            starCount2: rating
        });
    }


    renderLoader(){
        if (this.state.isLoaded){
            return(
                <View style={{ alignItems: 'center', justifyContent: 'center', height: (height-100) , alignSelf:'center' , backgroundColor:'#fff' , width:'100%' , position:'absolute' , zIndex:1  }}>
                    <ActivityIndicator size="large" color={COLORS.red} />
                </View>
            );
        }
    }
    validate = () => {
        let isError = false;
        let msg = '';

        if (this.state.starCount ===  0 ) {
            isError = true;
            msg = i18n.t('starCount_validation');
        }else if (this.state.msg === '') {
            isError = true;
            msg = i18n.t('msg__validation');
        }else if (this.state.starCount2 === '') {
            isError = true;
            msg = i18n.t('starCount2_validation');
        }else if (this.state.msgDelegate === '') {
            isError = true;
            msg = i18n.t('msgDelegate_validation');
        }
        if (msg != ''){
            Toast.show({ text: msg, duration : 2000  ,type :"danger", textStyle: { color: "white",fontFamily : 'cairoBold' ,textAlign:'center' } });
        }
        return isError;
    };


    onSend() {
        const err = this.validate();
        if (!err){

            this.setState({isLoaded : true});

            if(this.props.auth.data.userType === 'user'){
                axios({
                    method     : 'post',
                    url        :  CONST.url + 'ratingComment',
                    data       :  {
                        ratingUser      : this.state.starCount2,
                        commentUser     : this.state.msgDelegate,
                        ratingPlace     : this.state.starCount,
                        commentPlace    : this.state.msg,
                        secand_id       : this.state.delegate.delegate_id,
                        place_id        : this.state.place.place_id,
                    },
                    headers    : {
                        lang             :     ( this.props.lang ) ?  this.props.lang : 'ar',
                        user_id          :      this.props.auth.data.user_id,

                    }
                }).then(response => {
                    Toast.show({
                        text: response.data.message,
                        duration : 2000,
                        type : response.data.data.status !== "0" ? "success" : "danger",
                        textStyle: {
                            color: "white",
                            fontFamily : 'cairoBold' ,
                            textAlign:'center' }
                    });
                    if(response.data.data.status !== "0") {
                        this.props.navigation.navigate('rate_client');
                    }
                }).catch(error => {
                }).then(()=>{
                    this.setState({isLoaded : false})
                });
            } else{
                axios({
                    method     : 'post',
                    url        :  CONST.url + 'ratingComment',
                    data       :  {
                        ratingUser      : this.state.starCount,
                        commentUser     : this.state.msg,
                        ratingPlace     : this.state.starCount2,
                        commentPlace    : this.state.msgDelegate,
                        secand_id       : this.state.delegate.place_id,
                        place_id        : this.state.place.place_id,
                    },
                    headers    : {
                        lang             :     ( this.props.lang ) ?  this.props.lang : 'ar',
                        user_id          :      this.props.auth.data.user_id,

                    }
                }).then(response => {

                    Toast.show({
                        text: response.data.message,
                        duration : 2000,
                        type : response.data.data.status !== "0" ? "success" : "danger",
                        textStyle: {
                            color: "white",
                            fontFamily : 'cairoBold' ,
                            textAlign:'center' }
                    });
                    if(response.data.data.status !== "0") {
                        this.props.navigation.navigate('rate_client');
                    }
                }).catch(error => {
                }).then(()=>{
                    this.setState({isLoaded : false})
                });
            }
        }
    }

    render() {

        return (
            <Container>

                <Header style={[styles.header ]} noShadow>
                    <View style={styles.directionRow}>
                        <Button onPress={() => this.props.navigation.openDrawer()} transparent style={styles.headerBtn}>
                            <Image source={require('../../assets/images/noun_menu.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                        </Button>
                    </View>
                    <Text style={[styles.headerText , {right:0} ]}>{i18n.t('addRate')}</Text>
                    <View style={styles.directionRow}>
                        <View>
                        </View>
                        <Button onPress={() => this.props.navigation.goBack()} transparent  style={styles.headerBtn}>
                            <Image source={require('../../assets/images/arrow_left.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                        </Button>
                    </View>
                </Header>
                {this.renderLoader()}
                <Content contentContainerStyle={styles.flexGrow} style={{}} >
                    {
                        (this.state.isLoaded === false)
                            ?
                    <View style={[styles.w100 , styles.mt15]}>

                        <View style={[styles.backTitle , {backgroundColor :COLORS.blue}]}>
                            <Text style={[styles.whiteText , styles.tAC , {fontSize:15}]}>{i18n.t('restRating')}</Text>
                        </View>
                        <View style={[styles.sideImgView , styles.w100 ,{position:'relative',top:0}]}>
                            <View style={[styles.resProfileImg , styles.mt15 , {borderRadius:15}]}>
                                <Image source={{uri : this.state.place.imageProfile}} resizeMode={'cover'} style={[styles.swiperimage ,  {borderRadius:Platform.OS === 'ios' ?10:0}]}/>
                            </View>
                            <Text style={[styles.titleText , styles.mb10, {fontSize:15}]}>{this.state.place.placeName}</Text>
                            <StarRating
                                disabled={false}
                                maxStars={5}
                                rating={this.state.starCount}
                                selectedStar={(rating) => this.onStarRatingPress(rating)}
                                fullStarColor={COLORS.blue}
                                starSize={13}
                                starStyle={styles.starStyle}
                            />
                        </View>
                        <Item style={[styles.loginItem , styles.w100 , styles.mt15 , {paddingHorizontal:30 }]} bordered>
                            <Textarea placeholderTextColor={COLORS.placeholderColor}
                                      onChangeText={(msg) => this.setState({msg})} autoCapitalize='none'
                                      style={[styles.input , {borderRadius:10 ,borderTopRightRadius:10,borderTopLeftRadius:10,
                                          height:100 , paddingVertical:10}]} placeholder={i18n.t('typeComment')} />
                        </Item>

                        <View style={[styles.backTitle, styles.mt15 , {backgroundColor :COLORS.blue}]}>
                            <Text style={[styles.whiteText , styles.tAC , {fontSize:15}]}>
                                {i18n.t(this.props.auth.data.userType === 'user' ? 'delegateRating' : 'userRating')}
                            </Text>
                        </View>
                        <View style={[styles.sideImgView , styles.w100 ,{position:'relative',top:0}]}>
                            <View style={[styles.resProfileImg , styles.mt15 , {borderRadius:15}]}>
                                <Image source={{uri : (this.props.auth.data.userType === 'user')  ?  this.state.delegate.image : this.state.delegate.imageProfile}} resizeMode={'cover'} style={[styles.swiperimage ,  {borderRadius:Platform.OS === 'ios' ?10:0}]}/>
                            </View>
                            <Text style={[styles.titleText , styles.mb10, {fontSize:15}]}>{this.state.delegate.userName}</Text>
                            <StarRating
                                disabled={false}
                                maxStars={5}
                                rating={this.state.starCount2}
                                selectedStar={(rating) => this.onStarRatingPress2(rating)}
                                fullStarColor={COLORS.blue}
                                starSize={13}
                                starStyle={styles.starStyle}
                            />
                        </View>
                        <Item style={[styles.loginItem , styles.w100 , styles.mt15 , {paddingHorizontal:30 }]} bordered>
                            <Textarea placeholderTextColor={COLORS.placeholderColor}
                                      onChangeText={(msgDelegate) => this.setState({msgDelegate})}
                                      autoCapitalize='none'
                                      style={[ styles.input , { borderRadius:10 ,borderTopRightRadius:10,borderTopLeftRadius:10,
                                          height:100 , paddingVertical:10 }]}
                                      placeholder={i18n.t('typeComment')}
                            />
                        </Item>

                              <TouchableOpacity onPress={ () => this.onSend()} style={[styles.yellowBtn , styles.mt15, styles.mb10]}>
                                        <Text style={styles.whiteText}>{ i18n.t('evaluation') }</Text>
                                    </TouchableOpacity>

                        </View>
                        :
                        <View/>

                       }

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
        userId   : auth.user_id,
    };
};
export default connect(mapStateToProps, { userLogin ,profile})(AddRate_client);




