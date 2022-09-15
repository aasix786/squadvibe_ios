import React, { PureComponent } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  ImageBackground,
  StatusBar,
  ScrollView,
} from "react-native";
import { colors, fonts } from "../../common/colors";
import { HeadingText } from "../../common/HeadingText";
import CountryPicker, {
  DARK_THEME,
  FlagButton,
} from "react-native-country-picker-modal";
import {
  setMobileNumber,
  otpConfirmResult,
} from "../../redux/Actions/UserAction";
import { connect } from "react-redux";
import { Platform } from "react-native";
import Loader from "../../common/Loader";
import axios from "axios";
import Ripple from "react-native-material-ripple";

const WINDOW_WIDTH = Dimensions.get("window").width;

class MobileNumberComponent extends PureComponent {
  constructor() {
    super();
    this.state = {
      is_country_picker_visible: false,
      callingCode: "+49",
      phone: "",
      confirmResult: null,
      verificationCode: "",
      userId: "",
      isNewUser: false,
      visible: false,
      loading: false,
      login_type: "",
      country: "DE",
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      if (this.props.route.params != undefined) {
        const { login_type } = this.props.route.params;
        this.setState({
          login_type: login_type,
        });
      }
    });
    
  }

  componentWillUnmount() {
    this._unsubscribe();
    this.setState({ loading: false });
  }

  onSelect = (selectedCountry) => {
    // eslint-disable-next-line no-alert
    alert("selected Country" + JSON.stringify(selectedCountry));
  };

  validatePhoneNumber = () => {
    // var regexp = /^\+[0-9]?()[0-9](\s|\S)(\d[0-9]{8,16})$/
    // var regexp = /[0-9](\s|\S)(\d[0-9]{8,16})$/
    if (this.state.phone.length >= 8 && this.state.phone.length <= 16) {
      return true;
    } else {
      return false;
    }
  };

  signIn = async () => {
 
    // Request to send OTP
    if (this.validatePhoneNumber()) {
      this.setState({ loading: true });
      var phoneNumber = this.state.callingCode + this.state.phone;
      axios
        .post("http://squadvibes.onismsolution.com/api/sendVerificationCode", {
          phone_number: phoneNumber,
        })
        .then((res) => {
          console.log("res == ", res);
          this.setState({ loading: false });

          if (res.data.message == "Verification Code Sent") {
            this.props.setMobileNumber(
              this.state.callingCode.replace("+", "") + this.state.phone
            );
            this.props.otpConfirmResult({ confirmResult: "" });
            console.log(phoneNumber)
            this.props.navigation.navigate("otp", {
              confirmResult: "",
              dial_code: this.state.callingCode,
              phone: this.state.phone,
              login_type: this.state.login_type,
              fullPhone: phoneNumber,
            });
          } else {
            alert("Kindly add correct Phone number");
          }
        })
        .catch((err) => {
          console.log("network error", err);
         alert("Service not available right now. Try again later");
          this.setState({ loading: false });
        });
 
    } else {
      alert("Please enter valid phone number");
    }
  };

  render() {
    return (
      <KeyboardAvoidingView
        // behavior={Platform.OS == 'android' ? 'height' : 'padding'}
        style={{ flex: 1, backgroundColor: colors.white }}
      >
        <StatusBar
          backgroundColor={"transparent"}
          translucent
          barStyle="light-content"
        />
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
          style={{ flex: 2 }}
        >
          <View style={{ flex: 2 }}>
            <View>
              <ImageBackground
                source={require("../../assets/mobNumHeader.png")}
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

            <View
              style={[
                styles.inputStylebg,
                {
                  height: 50,
                  width: WINDOW_WIDTH - 60,
                  alignSelf: "center",
                  marginTop: 65,
                  flexDirection: "row",
                  borderRadius: 30,
                  alignItems: "center",
                  backgroundColor: "white",
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.2,
                  shadowRadius: 5,
                  elevation: 5,
                },
              ]}
            >
              <View>
                <Image
                  source={require("../../assets/mobNumIcon.png")}
                  style={{
                    width: 45,
                    height: 45,
                    marginLeft: 2,
                  }}
                  resizeMode={"contain"}
                />
              </View>
              <TouchableOpacity
                style={{
                  height: 45,
                  width: "auto",
                  borderRadius: 30,
                  backgroundColor: "white",
                  flexDirection: "row",
                  marginLeft: 5,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.2,
                  shadowRadius: 5,
                  elevation: 5,
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
                onPress={() => {
                  Keyboard.dismiss();
                  this.setState({ is_country_picker_visible: true });
                }}
                activeOpacity={0.8}
              >
                <FlagButton
                  withEmoji={true}
                  countryCode={this.state.country}
                  style={{
                    height: 25,
                    width: 25,
                    backgroundColor: "green",
                  }}
                />

                <View pointerEvents={"none"}>
                  <TextInput
                    pointerEvents="none"
                    style={
                      ([
                        styles.inputStyle,
                        this.state.callingCode.length <= 3
                          ? { width: 50 }
                          : { width: 70 },
                      ],
                      { fontSize: 16 })
                    }
                    autoCorrect={false}
                    placeholder="+91"
                    placeholderTextColor="#989ba2"
                    editable={false}
                    // defaultValue={this.state.callingCode}
                    value={this.state.callingCode}
                    // onChangeText={this.onPasswordEntry}
                    onPressOut={() => {
                      Keyboard.dismiss();
                      this.setState({ is_country_picker_visible: true });
                    }}
                    onPressIn={() => {
                      Keyboard.dismiss();
                      this.setState({ is_country_picker_visible: true });
                    }}
                    onFocus={() => {
                      Keyboard.dismiss();
                      this.setState({ is_country_picker_visible: true });
                    }}
                  />
                </View>
              </TouchableOpacity>

              <View style={{ marginLeft: 3 }}>
                <TextInput
                  style={styles.inputStyle}
                  autoCorrect={false}
                  placeholder="98980 98980"
                  placeholderTextColor="#989ba2"
                  onChangeText={(phone) => this.setState({ phone })}
                  keyboardType="number-pad"
                  returnKeyLabel="Done"
                  returnKeyType="done"
                />
              </View>
            </View>

            {this.state.is_country_picker_visible ? (
              <CountryPicker
                {...{
                  withFlags: true,
                  withFilter: true,
                  placeholder: "",
                  withCallingCode: true,
                  visible: this.state.is_country_picker_visible,
                  withFlagButton: true,
                }}
                visible={this.state.is_country_picker_visible}
                onSelect={(data) => {
                  console.log("selected country ", JSON.stringify(data));
                  this.setState({
                    callingCode: `+${data.callingCode[0]}`,
                    country: data.cca2,
                  });
                  // alert('selected country ' + JSON.stringify(data))
                }}
                onClose={() => {
                  this.setState({
                    is_country_picker_visible: false,
                  });
                }}
                style={{ color: "#fff" }}
                containerButtonStyle={{ color: colors.white }}
                closeButtonStyle={{ padding: 10, color: colors.white }}
                theme={customDialog}
              />
            ) : null}
          </View>
        </TouchableWithoutFeedback>

        <Loader loading={this.state.loading} />
        <TouchableOpacity
          style={styles.bottomView}
          activeOpacity={0.5}
          onPress={() => {
            this.signIn();
          }}
        >
          <Text style={styles.textStyle}>NEXT</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.user.userInfo,
    mobile_number: state.user.mobile_number,
    otp_confirm_result: state.user.otp_confirm_result,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setMobileNumber: (data) => dispatch(setMobileNumber(data)),
    otpConfirmResult: (data) => dispatch(otpConfirmResult(data)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MobileNumberComponent);

const customDialog = {
  primaryColor: "white",
  primaryColorVariant: "white",
  color: colors.white,
  backgroundColor: colors.themeColor,
  onBackgroundTextColor: colors.white,
  fontSize: 16,
  fontFamily: Platform.select({
    ios: "System",
    android: "Roboto",
    web: "Arial",
  }),
  filterPlaceholderTextColor: "white",
  // activeOpacity: 0.5,
};

const styles = StyleSheet.create({
  passwordContainer: {
    flexDirection: "row",
  },
  inputStyle: {
    color: "black",
    width: 150,
    fontSize: 15,
    fontFamily: fonts.regular,
    marginBottom: 1,
  },
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
    backgroundColor: "#324c55",
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
  inputStylebg: {
    backgroundColor: colors.white,
    borderRadius: 15,
  },
});
