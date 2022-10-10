/* eslint-disable react-native/no-inline-styles */
import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
  Linking,
  StatusBar,
} from "react-native";

import SubmitButton from "../../common/SubmitButton";
import { colors, fonts, resetStackAndNavigate } from "../../common/colors";
import Header from "../../common/Header";
const icon_back_arrow = require("../../assets/back_arrow.png");
const icon_rightArrow = require("../../assets/button_white_arrow.png");
const icon_main = require("../../assets/app_tracking.png");
var { width } = Dimensions.get("window");
import { Settings } from "react-native-fbsdk-next";
import {
  requestTrackingPermission,
  TrackingStatus,
} from "react-native-tracking-transparency";
import LinearGradient from "react-native-linear-gradient";
import Ripple from "react-native-material-ripple";

const WINDOW_WIDTH = Dimensions.get("window").width;

class AppTrackingComponent extends PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor={"transparent"}
          translucent
          barStyle="dark-content"
        />
        <View style={{ overflow: "hidden", paddingBottom: 5 }}>
          <View style={styles.headerViewStyle}>
            <View style={{ height: 30 }} />
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View style={styles.headerButtonsViewStyle}>
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
              </View>
              <View style={styles.headerTitleViewStyle}>
                <Text style={{ fontSize: 15, fontFamily: fonts.Medium }}>
                  App tracking
                </Text>
              </View>
              <View style={styles.headerButtonsViewStyle}>
                <Ripple
                  rippleCentered={true}
                  rippleContainerBorderRadius={50}
                  style={styles.backButtonStyle}
                  onPress={() => this.props.navigation.navigate("NotificationPanel")}
                >
                  <Image
                    source={require("../../assets/bell_Icon.png")}
                    style={{ width: 21, height: 21 }}
                    resizeMode={"contain"}

                  />
                </Ripple>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.contentViewStyle}>
          <Image
            source={require("../../assets/trackingImage.png")}
            style={{ height: 212, width: 223 }}
          />
          <Text style={styles.contentTextStyle}>
            To give you best experience. Please allow us app tracking
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onSubmitPress={() => {
            this.requestPermissionTransparency();
            // resetStackAndNavigate(this.props.navigation, "HomeTab");
          }}
        >
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={["#38A5CA", "#54C8EE"]}
            style={styles.linearGradient}
          >
            <Text style={styles.textStyle}>Accept it</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  requestPermissionTransparency = async () => {
    const status = await requestTrackingPermission();
    console.log("status ", status);
    if (status === "authorized" || status === "unavailable") {
      await Settings.setAdvertiserTrackingEnabled(true);
    } else {
      await Settings.setAdvertiserTrackingEnabled(false);
      if (status === "denied") {
        Alert.alert(
          `Turn on App tracking Services to allow to track your event.`,
          "",
          [
            {
              text: "Go to Settings",
              onPress: () => {
                this.openSetting();
              },
            },
            { text: "Don't Use", onPress: () => {} },
          ]
        );
      }else{
        resetStackAndNavigate(this.props.navigation, "HomeTab");
      }
    }

    // const result = await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY)
    // console.log("result ",result);
    // if (result === RESULTS.GRANTED || result === RESULTS.UNAVAILABLE) {
    //   // await firebase.analytics().setAnalyticsCollectionEnabled(true)
    //   await Settings.setAdvertiserTrackingEnabled(true)
    // } else {
    //   // await firebase.analytics().setAnalyticsCollectionEnabled(false)
    //   await Settings.setAdvertiserTrackingEnabled(false)
    // }
  };
  openSetting = () => {
    Linking.openSettings().catch(() => {
      Alert.alert("Unable to open settings");
    });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerViewStyle: {
    height: 100,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },
  headerButtonsViewStyle: {
    width: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitleViewStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonStyle: {
    height: 34,
    width: 34,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  contentViewStyle: { flex: 2, justifyContent: "center", alignItems: "center" },
  contentTextStyle: {
    marginHorizontal: 48,
    marginTop: 15,
    textAlign: "center",
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.black,
  },

  linearGradient: {
    height: 46,
    width: WINDOW_WIDTH - 60,
    alignSelf: "center",
    marginBottom: 40,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  textStyle: {
    color: "#fff",
    fontSize: 15,
    fontFamily: fonts.Bold,
    paddingBottom: 3,
  },
});

export default AppTrackingComponent;
