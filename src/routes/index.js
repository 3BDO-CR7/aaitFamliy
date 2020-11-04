import React from "react";
import { createStackNavigator, createAppContainer , createDrawerNavigator } from "react-navigation";
import {I18nManager} from "react-native";

import Home_client from "../components/Home_client";
import DrawerCustomization_client from "./DrawerCustomization_client";
import Login_client from "../components/Login_client";
import User from "../components/User";
import ForgetPassword_client from "../components/ForgetPassword_client";
import VerifyCode_client from "../components/VerifyCode_client";
import Register_client from "../components/Register_client";
import AccActivation_client from "../components/AccActivation_client";
import Notification_client from "../components/Notification_client";
import Restaurants_client from "../components/Restaurants_client";
import RestDet_client from "../components/RestDet_client";
import ProductDet_client from "../components/ProductDet_client";
import OrderNow_client from "../components/OrderNow_client";
import Profile_client from "../components/Profile_client";
import Cart_client from "../components/Cart_client";
import Wallet_client from "../components/Wallet_client";
import AboutApp_client from "../components/AboutApp_client";
import Policy_client from "../components/Policy_client";
import ContactUs_client from "../components/ContactUs_client";
import Complaints_client from "../components/Complaints_client";
import ShareApp_client from "../components/ShareApp_client";
import Language_client from "../components/Language_client";
import MyOrders_client from "../components/MyOrders_client";
import SpecialOrders_client from "../components/SpecialOrders_client";
import Families_client from "../components/Families_client";
import FamilyDet_client from "../components/FamilyDet_client";
import FamilyProductDet_client from "../components/FamilyProductDet_client";
import OrderDet_client from "../components/OrderDet_client";
import OrderSent_client from "../components/OrderSent_client";
import FollowOrder_client from "../components/FollowOrder_client";
import FollowDelegate_client from "../components/FollowDelegate_client";
import Location_client from "../components/Location_client";
import AddRate_client from "../components/AddRate_client";
import Rate_client from "../components/Rate_client";
import PriceOrderDet_client from "../components/PriceOrderDet_client";
import ShowPrice_client from "../components/ShowPrice_client";
import Logout_client from "../components/Logout_client";
import Recharge from "../components/Recharge";
import login from "../components/login";
import OrderDetails from "../components/OrderDetails";
import Buy_with_visa from "../components/Buy_with_visa";
import FavoriteChef from "../components/FavoriteChef";

import Initial from "../components/Initial";

import DrawerCustomization_delegate from "./DrawerCustomization_delegate";
import Login_delegate from "../components/Login_delegate";
import Home_delegate from "../components/Home_delegate";
import ForgetPassword_delegate from "../components/ForgetPassword_delegate";
import VerifyCode_delegate from "../components/VerifyCode_delegate";
import Register_delegate from "../components/Register_delegate";
import DataSent_delegate from "../components/DataSent_delegate";
import OrderDet_delegate from "../components/OrderDet_delegate";
import MyOrders_delegate from "../components/MyOrders_delegate";
import FollowOrder_delegate from "../components/FollowOrder_delegate";
import AboutApp_delegate from "../components/AboutApp_delegate";
import Location_delegate from "../components/Location_delegate";
import Policy_delegate from "../components/Policy_delegate";
import ContactUs_delegate from "../components/ContactUs_delegate";
import Complaints_delegate from "../components/Complaints_delegate";
import ShareApp_delegate from "../components/ShareApp_delegate";
import Notification_delegate from "../components/Notification_delegate";
import Profile_delegate from "../components/Profile_delegate";
import Logout_delegate from "../components/Logout_delegate";
import Locations from "../components/Locations";
import Orders from "../components/Orders";

const drawerCust = (props) => (<DrawerCustomization_client {...props} />)
const drawerNavigator_client = createDrawerNavigator({
    home_client:Home_client,
    home_delegate:Home_delegate,
    orderDet_delegate:OrderDet_delegate,
    notification_client:Notification_client,
    restaurants_client:Restaurants_client,
    restDet_client:RestDet_client,
    productDet_client:ProductDet_client,
    orderNow_client:OrderNow_client,
    profile_client:Profile_client,
    profile_delegate:Profile_delegate,
    myOrders_delegate:MyOrders_delegate,
    Orders:Orders,
    myOrders_client:MyOrders_client,
    FavoriteChef:FavoriteChef,
    specialOrders_client:SpecialOrders_client,
    cart_client:Cart_client,
    wallet_client:Wallet_client,
    aboutApp_client:AboutApp_client,
    policy_client:Policy_client,
    contactUs_client:ContactUs_client,
    complaints_client:Complaints_client,
    shareApp_client:ShareApp_client,
    language_client:Language_client,
    families_client:Families_client,
    familyDet_client:FamilyDet_client,
    familyProductDet_client:FamilyProductDet_client,
    orderDet_client:OrderDet_client,
    orderSent_client:OrderSent_client,
    followOrder_client:FollowOrder_client,
    followDelegate_client:FollowDelegate_client,
    location_client:Location_client,
    addRate_client:AddRate_client,
    rate_client:Rate_client,
    priceOrderDet_client:PriceOrderDet_client,
    showPrice_client:ShowPrice_client,
    Locations:Locations,
    logout_client:Logout_client,
    followOrder_delegate:FollowOrder_delegate,
    location_delegate:Location_delegate,
    login:login,


},{
    initialRouteName:'home_client',
    drawerPosition:I18nManager.isRTL ?'right' : 'left',
    drawerOpenRoute:'DrawerOpen',
    drawerCloseRoute:'DrawerClose',
    gesturesEnabled:false,
    drawerToggleRoute:'DrawerToggle',
    contentComponent:drawerCust
});

//Delegate user

const drawerCustDelegate = (props) => (<DrawerCustomization_delegate {...props} />)
const drawerNavigator_delegate = createDrawerNavigator({
    home_delegate:Home_delegate,
    home_client:Home_client,
    orderDet_delegate:OrderDet_delegate,
    profile_delegate:Profile_delegate,
    myOrders_delegate:MyOrders_delegate,
    followOrder_delegate:FollowOrder_delegate,
    location_delegate:Location_delegate,
    Orders:Orders,
    OrderDetails:OrderDetails,
    wallet_client:Wallet_client,
    // aboutApp_delegate:AboutApp_delegate,
    // policy_delegate:Policy_delegate,
    // contactUs_delegate:ContactUs_delegate,
    // complaints_delegate:Complaints_delegate,
    // shareApp_delegate:ShareApp_delegate,
    // notification_delegate:Notification_delegate,
    aboutApp_client:AboutApp_client,
    policy_client:Policy_client,
    contactUs_client:ContactUs_client,
    complaints_client:Complaints_client,
    shareApp_client:ShareApp_client,
    notification_client:Notification_client,
    addRate_client:AddRate_client,
    language_client:Language_client,
    logout_delegate:Logout_delegate,

},{
    initialRouteName:'home_delegate',
    drawerPosition:I18nManager.isRTL ?'right' : 'left',
    drawerOpenRoute:'DrawerOpen',
    drawerCloseRoute:'DrawerClose',
    gesturesEnabled:false,
    drawerToggleRoute:'DrawerToggle',
    contentComponent:drawerCustDelegate
});


const AppNavigator = createStackNavigator({
    Initial: {
        screen: Initial,
        navigationOptions: {
            header: null
        }
    },
    FavoriteChef: {
        screen: FavoriteChef,
        navigationOptions: {
            header: null
        }
    },
    Buy_with_visa: {
        screen: Buy_with_visa,
        navigationOptions: {
            header: null
        }
    },
    user: {
        screen: User,
        navigationOptions: {
            header: null
        }
    },

    home_delegate: {
        screen: Home_delegate,
        navigationOptions: {
            header: null
        }
    },location_client: {
        screen: Location_client,
        navigationOptions: {
            header: null
        }
    },
    Orders: {
        screen: Orders,
        navigationOptions: {
            header: null
        }
    },

    OrderDetails: {
        screen: OrderDetails,
        navigationOptions: {
            header: null
        }
    },

    showPrice_client: {
        screen: ShowPrice_client,
        navigationOptions: {
            header: null
        }
    },
    Recharge: {
        screen: Recharge,
        navigationOptions: {
            header: null
        }
    },

    login: {
        screen: login,
        navigationOptions: {
            header: null
        }
    },
    myOrders_client: {
        screen: MyOrders_client,
        navigationOptions: {
            header: null
        }
    },
    Locations: {
        screen: Locations,
        navigationOptions: {
            header: null
        }
    },
    cart_client: {
        screen: Cart_client,
        navigationOptions: {
            header: null
        }
    },
    orderDet_client: {
        screen: OrderDet_client,
        navigationOptions: {
            header: null
        }
    },
    orderNow_client: {
        screen: OrderNow_client,
        navigationOptions: {
            header: null
        }
    },

    restDet_client: {
        screen: RestDet_client,
        navigationOptions: {
            header: null
        }
    },
    drawerNavigator_client: {
        screen: drawerNavigator_client,
        navigationOptions: {
            header: null
        }
    },
    login_client: {
        screen: Login_client,
        navigationOptions: {
            header: null
        }
    },
    register_client: {
        screen: Register_client,
        navigationOptions: {
            header: null
        }
    },

    //delegate user

    profile_delegate: {
        screen: Profile_delegate,
        navigationOptions: {
            header: null
        }
    },
    drawerNavigator_delegate: {
        screen: drawerNavigator_delegate,
        navigationOptions: {
            header: null
        }
    },
    logout_delegate: {
        screen: Logout_delegate,
        navigationOptions: {
            header: null
        }
    },
    notification_delegate: {
        screen: Notification_delegate,
        navigationOptions: {
            header: null
        }
    },
    shareApp_delegate: {
        screen: ShareApp_delegate,
        navigationOptions: {
            header: null
        }
    },
    complaints_delegate: {
        screen: Complaints_delegate,
        navigationOptions: {
            header: null
        }
    },
    contactUs_delegate: {
        screen: ContactUs_delegate,
        navigationOptions: {
            header: null
        }
    },
    policy_delegate: {
        screen: Policy_delegate,
        navigationOptions: {
            header: null
        }
    },
    aboutApp_delegate: {
        screen: AboutApp_delegate,
        navigationOptions: {
            header: null
        }
    },
    location_delegate: {
        screen: Location_delegate,
        navigationOptions: {
            header: null
        }
    },
    followOrder_delegate: {
        screen: FollowOrder_delegate,
        navigationOptions: {
            header: null
        }
    },
    myOrders_delegate: {
        screen: MyOrders_delegate,
        navigationOptions: {
            header: null
        }
    },
    orderDet_delegate: {
        screen: OrderDet_delegate,
        navigationOptions: {
            header: null
        }
    },
    register_delegate: {
        screen: Register_delegate,
        navigationOptions: {
            header: null
        }
    },
    dataSent_delegate: {
        screen: DataSent_delegate,
        navigationOptions: {
            header: null
        }
    },
    login_delegate: {
        screen: Login_delegate,
        navigationOptions: {
            header: null
        }
    },
    verifyCode_delegate: {
        screen: VerifyCode_delegate,
        navigationOptions: {
            header: null
        }
    },
    forgetPassword_delegate: {
        screen: ForgetPassword_delegate,
        navigationOptions: {
            header: null
        }
    },

    logout_client: {
        screen: Logout_client,
        navigationOptions: {
            header: null
        }
    },
    priceOrderDet_client: {
        screen: PriceOrderDet_client,
        navigationOptions: {
            header: null
        }
    },
    rate_client: {
        screen: Rate_client,
        navigationOptions: {
            header: null
        }
    },
    addRate_client: {
        screen: AddRate_client,
        navigationOptions: {
            header: null
        }
    },
    followOrder_client: {
        screen: FollowOrder_client,
        navigationOptions: {
            header: null
        }
    },

    familyProductDet_client: {
        screen: FamilyProductDet_client,
        navigationOptions: {
            header: null
        }
    },
    followDelegate_client: {
        screen: FollowDelegate_client,
        navigationOptions: {
            header: null
        }
    },

    orderSent_client: {
        screen: OrderSent_client,
        navigationOptions: {
            header: null
        }
    },
    familyDet_client: {
        screen: FamilyDet_client,
        navigationOptions: {
            header: null
        }
    },
    families_client: {
        screen: Families_client,
        navigationOptions: {
            header: null
        }
    },
    specialOrders_client: {
        screen: SpecialOrders_client,
        navigationOptions: {
            header: null
        }
    },

    language_client: {
        screen: Language_client,
        navigationOptions: {
            header: null
        }
    },
    shareApp_client: {
        screen: ShareApp_client,
        navigationOptions: {
            header: null
        }
    },
    complaints_client: {
        screen: Complaints_client,
        navigationOptions: {
            header: null
        }
    },
    contactUs_client: {
        screen: ContactUs_client,
        navigationOptions: {
            header: null
        }
    },
    policy_client: {
        screen: Policy_client,
        navigationOptions: {
            header: null
        }
    },
    aboutApp_client: {
        screen: AboutApp_client,
        navigationOptions: {
            header: null
        }
    },
    wallet_client: {
        screen: Wallet_client,
        navigationOptions: {
            header: null
        }
    },

    profile_client: {
        screen: Profile_client,
        navigationOptions: {
            header: null
        }
    },
    productDet_client: {
        screen: ProductDet_client,
        navigationOptions: {
            header: null
        }
    },

    restaurants_client: {
        screen: Restaurants_client,
        navigationOptions: {
            header: null
        }
    },
    notification_client: {
        screen: Notification_client,
        navigationOptions: {
            header: null
        }
    },
    accActivation_client: {
        screen: AccActivation_client,
        navigationOptions: {
            header: null
        }
    },
    verifyCode_client: {
        screen: VerifyCode_client,
        navigationOptions: {
            header: null
        }
    },
    forgetPassword_client: {
        screen: ForgetPassword_client,
        navigationOptions: {
            header: null
        }
    },
});

export default createAppContainer(AppNavigator);
