import React, { PureComponent } from "react";
import {
  View,
  Image,
  Text,
  Platform,
  PermissionsAndroid,
  StatusBar,
} from "react-native";
import { colors, fonts, resetStackAndNavigate } from "../../common/colors";
import { HeadingText } from "../../common/HeadingText";
import { CustomButtonWithLeftIcon ,CustomFacebookButton} from "../../common/ThemeButton";
import HyperlinkedText from "react-native-hyperlinked-text";
import { connect } from "react-redux";
import {
  setLoginType,
  setEmail,
  setFullName,
  setSocialID,
  setUserInfo,
} from "../../redux/Actions/UserAction";
// import { appleAuth  } from '@invertase/react-native-apple-authentication';
import {
  AccessToken,
  LoginManager,
  GraphRequest,
  GraphRequestManager,
} from "react-native-fbsdk-next";
import Loader from "../../common/Loader";
import ApiHelper from "../../Networking/NetworkCall";
import Toast from "react-native-simple-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from "@react-native-firebase/messaging";
import Geolocation from "react-native-geolocation-service";
import LinearGradient from "react-native-linear-gradient";

class LoginComponent extends PureComponent {
  constructor() {
    super();
    this.state = {
      loading: false,
      userInfo: "",
      login_type: "",
      forceLocation: true,
      highAccuracy: true,
      locationDialog: true,
      significantChanges: false,
      observing: false,
      foregroundService: false,
      useLocationManager: false,
    };
  }

  async componentWillmount() {
    this._unsubscribe = this.props.navigation.addListener("focus", async () => {
      this.getFcmToken();
      this.getLocationUpdates();
    });
  }

  getFcmToken = async () => {
    const fcmToken = await messaging().getToken();

    if (fcmToken) {
      await AsyncStorage.setItem("token", fcmToken);

      await AsyncStorage.setItem(
        "device_type",
        Platform.OS == "ios" ? "iOS" : "Android"
      );
    }
  };

  render() {
    const { navigation } = this.props;
    return (
      <LinearGradient
        colors={[colors.black, colors.black]}
        style={{ flex: 1, alignItems: "center" }}
      >
        <StatusBar
          backgroundColor={"transparent"}
          translucent
          barStyle="light-content"
        />

        <Image
          source={require("../../assets/login_logo.png")}
          style={{
            width: 240,
            height: 240,
            resizeMode: "contain",
            marginTop: 96,
          }}
        />

        <HeadingText
          title={"SIGN IN"}
          style={{
            marginTop: 25,
            fontSize: 22,
            color: colors.headingTextColor,
            fontFamily: fonts.SemiBold,
          }}
        />
 <View style={{ marginTop: 40 }}>
          <CustomFacebookButton
            title={"Sign in With Apple"}
            onPress={() => {
              this.props.setLoginType("Normal");
              this.setState({ login_type: "Normal" });
              // navigation.navigate("mobile_number", { login_type: "Normal" });
              // this.props.navigation.navigate("HomeTab");
            }}
            style={{ backgroundColor: "#000" }}
            icon={require("../../assets/apple1.png")}
            textStyle={{ color: colors.headingTextColor }}
          />
        </View>
        <View style={{ marginTop: 15 }}>
          <CustomButtonWithLeftIcon
            title={"Sign in With facebook"}
            onPress={() => {
              this.props.setLoginType("Normal");
              this.setState({ login_type: "Normal" });
              // navigation.navigate("mobile_number", { login_type: "Normal" });
              // this.props.navigation.navigate("HomeTab");
            }}
            style={{ backgroundColor: "#4267B2" }}
            icon={require("../../assets/Facebook_Logo.png")}
            textStyle={{ color: colors.headingTextColor }}
          />
        </View>
        <View style={{ marginTop: 15 }}>
          <CustomButtonWithLeftIcon
            title={"Sign in With Number"}
            onPress={() => {
              this.props.setLoginType("Normal");
              this.setState({ login_type: "Normal" });
              navigation.navigate("mobile_number", { login_type: "Normal" });
              // this.props.navigation.navigate("HomeTab");
            }}
            style={{ backgroundColor: "#70ca38" }}
            icon={require("../../assets/phoneIcon.png")}
            textStyle={{ color: colors.headingTextColor }}
          />
        </View>
       
       
        <Loader loading={this.state.loading} />
      </LinearGradient>
    );
  }

  getInfoFromToken = (token) => {
    const PROFILE_REQUEST_PARAMS = {
      fields: {
        string: "id,name,first_name,last_name,birthday,email,picture",
      },
    };
    const profileRequest = new GraphRequest(
      "/me",
      { token, parameters: PROFILE_REQUEST_PARAMS },
      (error, result) => {
        if (error) {
          this.setState({ loading: false });
        } else {
          this.setState({ userInfo: result, loading: false });
          this.props.setEmail(result.email);
          this.props.setFullName(result.name);
          this.props.setSocialID(result.id);
          //   this.props.navigation.navigate('mobile_number',{login_type:this.state.login_type})
          this.getUserProfile(result.id);
          //   this.props.navigation.navigate('email')
        }
      }
    );
    new GraphRequestManager().addRequest(profileRequest).start();
  };

  getUserProfile = async (socialID) => {
    this.setState({ loading: true });
    var parameter = new FormData();
    parameter.append("social_id", socialID);
    ApiHelper.post("viewProfile", parameter)
      .then((response) => {
        if (response.status == 200) {
          this.setState({ loading: false });
          if (response.data.status == "SUCCESS") {
            this.props.setUserInfo(response.data.viewProfile);
            const userInfo = response.data.viewProfile;
            const userId = String(response.data.viewProfile.id);
            const authToken = String(response.data.viewProfile.token);
            AsyncStorage.setItem(
              "user_info",
              JSON.stringify(response.data.viewProfile)
            );
            AsyncStorage.setItem("userId", userId);
            AsyncStorage.setItem("authToken", authToken);
            // this.props.navigation.navigate('HomeTab')
            this.addUserInFirebase(userInfo);
            resetStackAndNavigate(this.props.navigation, "HomeTab");
          } else {
            console.error(response.data);
            console.error(response.data.requestKey);
            if (response.data.requestKey) {
              Toast.show(response.data.requestKey);
            }

            if (response.data.is_user_exist == 0) {
              this.props.navigation.navigate("mobile_number", {
                login_type: this.state.login_type,
              });
              // this.props.navigation.navigate('email')
            }
          }
        }
      })
      .catch((error) => {
        Toast.show(error.message);
      });
  };

  /* Location permission methods */

  getLocationUpdates = async () => {
    Geolocation.watchPosition(
      (position) => {
        // setLocation(position);
        let coordinate = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        this.setState({ location: coordinate });
        AsyncStorage.setItem("latitude", coordinate.latitude.toString());
        AsyncStorage.setItem("longitude", coordinate.longitude.toString());
        Geolocation.stopObserving();
      },
      (error) => {
        // setLocation(null);
        if (error.code == 1) {
          //   this.locationPermission()
        }
      },
      {
        accuracy: {
          android: "high",
          ios: "best",
        },
        enableHighAccuracy: this.state.highAccuracy,
        distanceFilter: 0,
        interval: 5000,
        fastestInterval: 2000,
        forceRequestLocation: this.state.forceLocation,
        forceLocationManager: this.state.useLocationManager,
        showLocationDialog: this.state.locationDialog,
        useSignificantChanges: this.state.significantChanges,
      }
    );
  };
}

const mapStateToProps = (state) => {
  return {
    login_type: state.user.login_type,
    email: state.user.email,
    full_name: state.user.full_name,
    social_Id: state.user.social_Id,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setLoginType: (data) => dispatch(setLoginType(data)),
    setEmail: (data) => dispatch(setEmail(data)),
    setFullName: (data) => dispatch(setFullName(data)),
    setSocialID: (data) => dispatch(setSocialID(data)),
    setUserInfo: (data) => dispatch(setUserInfo(data)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
