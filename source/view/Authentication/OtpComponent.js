import React, { PureComponent } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  StatusBar,
  ScrollView,
  Dimensions,
  ImageBackground,
} from "react-native";
import { colors, fonts, resetStackAndNavigate } from "../../common/colors";
import { HeadingText } from "../../common/HeadingText";

import { Button } from "react-native-elements";
import { connect } from "react-redux";
import {
  setUserInfo,
  setIsNewUser,
  otpConfirmResult,
} from "../../redux/Actions/UserAction";
import Loader from "../../common/Loader";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import ApiHelper from "../../Networking/NetworkCall";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-simple-toast";
import auth from "@react-native-firebase/auth";
import axios from "axios";
import messaging from "@react-native-firebase/messaging";
import Ripple from "react-native-material-ripple";
import { CustomInputField } from "../../common/inputField";

const WINDOW_WIDTH = Dimensions.get("window").width;

class OtpComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      phone: "",
      dial_code: "",
      confirmResult: null,
      verificationCode: "",
      userId: "",
      isNewUser: false,
      visible: false,
      loading: false,
      login_type: "",
      fullPhone: "",
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      if (this.props.route.params !== undefined) {
        const { confirmResult, phone, dial_code, login_type, fullPhone } =
          this.props.route.params;
        this.setState({
          confirmResult,
          phone,
          dial_code,
          login_type,
          fullPhone,
        });
      }
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <StatusBar
          backgroundColor={"transparent"}
          translucent
          barStyle="light-content"
        />
        <View>
          <ImageBackground
            source={require("../../assets/mobCodeHeader.png")}
            style={{ width: WINDOW_WIDTH, height: 250, marginTop: -1 }}
            resizeMode={"stretch"}
          >
            <Ripple
              rippleCentered={true}
              rippleContainerBorderRadius={50}
              style={styles.backButtonStyle}
              onPress={() => this.props.navigation.goBack()}
            >
              <Image
                source={require("../../assets/backArrow.png")}
                style={{ width: 16, height: 11 }}
                resizeMode={"contain"}
              />
            </Ripple>
          </ImageBackground>
        </View>
        <View style={{ marginTop: 65 }}>
          <CustomInputField
            placeholder="Enter Code"
            value={this.state.verificationCode}
            onChangeText={(verificationCode) => {
              this.setState({ verificationCode });
              if (verificationCode.length === 6) {
                Keyboard.dismiss();
              }
            }}
            keyboardType="number-pad"
            maxLength={6}
            icon={require("../../assets/mobCodeIcon.png")}
          />
        </View>
        <Loader loading={this.state.loading} />
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <TouchableOpacity
            style={styles.bottomView}
            activeOpacity={0.8}
            onPress={() => {
              this.VerifyOtp();
            }}
          >
            <Text style={styles.textStyle}>NEXT</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  validatePhoneNumber = () => {
    // var regexp = /^\+[0-9]?()[0-9](\s|\S)(\d[0-9]{8,16})$/
    // var regexp = /[0-9](\s|\S)(\d[0-9]{8,16})$/
    if (this.state.phone.length >= 8 && this.state.phone.length <= 16) {
      return true;
    } else {
      return false;
    }
  };

  VerifyOtp = () => {
    const { verificationCode } = this.state;

    if (verificationCode.length == 6) {
      this.setState({ loading: true });

      axios
        .post("http://squadvibes.onismsolution.com/api/verify", {
          phone_number: this.state.fullPhone,
          verification_code: verificationCode,
        })
        .then(async (res) => {
          this.setState({ loading: false });
          console.log("res")
          console.log(res.data)
          if (res.data.message == "Invalid verification code entered!") {
            Toast.show("Invalid verification code entered!");
          } else {
            console.log("USER DATA", res.data);
            if (res.data.user == "registered") {
              const fcm_token = await messaging().getToken();
              await AsyncStorage.setItem("token", fcm_token);
              console.log("FCMTOKEN", fcm_token);
              console.log("token ==", res.data.token.token);
              // const fcm_token = await AsyncStorage.getItem('token')
              axios
                .post("http://squadvibes.onismsolution.com/api/uploadFCMToken", {
                  token: res.data.token.token,
                  fcm_token,
                })
                .then((response) => {
                  console.log(res.data.userinfo.phone_number)
                  this.getUserProfile(
                    res.data.userinfo.phone_number,
                    res.data.token.token
                  );
                })
                .catch((err) => console.log("ERRR", err));
            } else {
              this.props.navigation.navigate("email");
            }
          }
        })
        .catch((err) => {
          this.setState({ loading: false });
          Toast.show("Error in sending request");
        });
    } else {
      alert("Please enter a 6 digit OTP code.");
    }
  };

  login = async () => {
    // var phoneNumber = this.state.dial_code + this.state.phone
    var phoneNumber = this.state.phone;
    this.setState({ loading: true });
    const device_token = await AsyncStorage.getItem("token");
    const device_type = await AsyncStorage.getItem("device_type");

    var parameter = new FormData();
    if (this.props.login_type == undefined) {
      parameter.append("login_type", this.props.userInfo.login_type);
    } else {
      parameter.append("login_type", this.state.login_type);
    }
    parameter.append("phone_number", phoneNumber);
    parameter.append("device_token", device_token);
    parameter.append("device_type", device_type);

    ApiHelper.post("signUp", parameter)
      .then((response) => {
        console.log("response")
        console.log(response)
        if (response.status == 200) {
          this.setState({ loading: false });
          if (response.data.status == "SUCCESS") {
            let userInfo = response.data.signUp;
            this.props.setUserInfo(userInfo);
            AsyncStorage.setItem("user_info", JSON.stringify(userInfo));
            // this.addUserInFirebase(userInfo)
            this.getUserProfile();
            // this.props.navigation.navigate('HomeTab')
            // this.usersCollection.doc(response.data.viewProfile.id)
          } else {
            console.error(response.data.message);
            if (response.data.message) {
              Toast.show(response.data.message);
            }

            if (response.data.requestKey == "User does not exist") {
              this.props.navigation.navigate("email");
            }
          }
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        Toast.show(error.message);
      });
  };

  getUserProfile = async (phoneNumber, device_token) => {
    // var phoneNumber = this.state.dial_code + this.state.phone
    // var phoneNumber = this.state.phone
    this.setState({ loading: true });
    // const device_token = await AsyncStorage.getItem('token')
    // const device_type = await AsyncStorage.getItem('device_type')

    var parameter = new FormData();
    parameter.append("phone_number", phoneNumber);
    parameter.append("device_token", device_token);
    parameter.append("device_type", "android");
    console.log("PARAMSS", parameter);
    ApiHelper.post("viewProfile", parameter)
      .then((response) => {
        if (response.status == 200) {
          this.setState({ loading: false });
          if (response.data.status == "SUCCESS") {
            let userInfo = response.data.viewProfile;
            const userId = String(response.data.viewProfile.id);
            const authToken = String(response.data.viewProfile.token);
            this.props.setUserInfo(userInfo);
            AsyncStorage.setItem("user_info", JSON.stringify(userInfo));
            AsyncStorage.setItem("userId", userId);
            AsyncStorage.setItem("authToken", authToken);

            resetStackAndNavigate(this.props.navigation, "HomeTab");
          } else {
            console.error(response.data.requestKey);
          }
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        Toast.show(error.message);
      });
  };
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    userInfo: state.user.userInfo,
    mobile_number: state.user.mobile_number,
    login_type: state.user.userInfo.login_type,
    otp_confirm_result: state.user.otp_confirm_result,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUserInfo: (data) => dispatch(setUserInfo(data)),
    setIsNewUser: (data) => dispatch(setIsNewUser(data)),
    otpConfirmResult: (data) => dispatch(otpConfirmResult(data)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(OtpComponent);

const styles = StyleSheet.create({
  backButtonStyle: {
    height: 34,
    width: 34,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    top: 70,
    left: 25,
  },

  bottomView: {
    flexDirection: "row",
    height: 46,
    width: WINDOW_WIDTH - 60,
    alignSelf: "center",
    backgroundColor: "#242c36",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    borderRadius: 30,
  },
  textStyle: {
    color: "#fff",
    fontSize: 18,
    fontFamily: fonts.Bold,
    paddingBottom: 3,
  },
});
