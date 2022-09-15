import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { PureComponent } from "react";
import { View, Image, StatusBar } from "react-native";
import { colors, resetStackAndNavigate } from "../../common/colors";
import { connect } from "react-redux";
import {
  setUserInfo,
  setDeviceToken,
  resetData,
} from "../../redux/Actions/UserAction";

// import AsyncStorage from '@react-native-async-storage/async-storage';

class SplashComponent extends PureComponent {
  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.themeColor,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <StatusBar
          backgroundColor={"transparent"}
          translucent
          barStyle="light-content"
        />
        <Image
          source={require("../../assets/splash_logo.png")}
          style={{ width: 200, height: 180, resizeMode: "contain" }}
        />
      </View>
    );
  }

  async componentDidMount() {
    const { navigate } = this.props.navigation;
    const userInfo = await AsyncStorage.getItem("user_info");
    const device_token = await AsyncStorage.getItem("token");
    this.props.setDeviceToken(device_token);
    setTimeout(() => {
      if (userInfo) {
        let userData = JSON.parse(userInfo);
        this.props.setUserInfo(userData);
        // navigate('HomeTab');
        // navigate('sideMenu');
        resetStackAndNavigate(this.props.navigation, "HomeTab");
      } else {
        // navigate('Login');
        this.props.resetData("");
        resetStackAndNavigate(this.props.navigation, "Login");
      }
    }, 3000);
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    resetData: (data) => dispatch(resetData(data)),
    setUserInfo: (data) => dispatch(setUserInfo(data)),
    setDeviceToken: (data) => dispatch(setDeviceToken(data)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(SplashComponent);
