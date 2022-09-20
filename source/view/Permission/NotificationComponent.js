/* eslint-disable react-native/no-inline-styles */
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";

import SubmitButton from "../../common/SubmitButton";
import { colors, fonts } from "../../common/colors";
import Header from "../../common/Header";
const icon_back_arrow = require("../../assets/back_arrow.png");
const icon_rightArrow = require("../../assets/button_white_arrow.png");
const icon_main = require("../../assets/notification_ic.png");
var { width } = Dimensions.get("window");
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PushNotification from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import LinearGradient from "react-native-linear-gradient";
import Ripple from "react-native-material-ripple";

const WINDOW_WIDTH = Dimensions.get("window").width;

class NotificationComponent extends Component {
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
                  Notification
                </Text>
              </View>
              <View style={styles.headerButtonsViewStyle}>
                <Ripple
                  rippleCentered={true}
                  rippleContainerBorderRadius={50}
                  style={styles.backButtonStyle}
                >
                  <Image
                    source={require("../../assets/bell_Icon.png")}
                    style={{ width: 21, height: 21 }}
                    resizeMode={"contain"}
                    onPress={() => this.props.navigation.navigate("NotificationPanel")}
                  />
                </Ripple>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.contentViewStyle}>
          <Image
            source={require("../../assets/notificationImage.png")}
            style={{ height: 212, width: 223 }}
          />
          <Text style={styles.contentTextStyle}>
            When ever a new event is planned or you get a message we will notify
            you
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            this.notificationPermission();
            this.props.navigation.navigate("AppTracking");
          }}
        >
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={["#38A5CA", "#54C8EE"]}
            style={styles.linearGradient}
          >
            <Text style={styles.textStyle}>Get Notification</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  notificationPermission = async () => {
    // requestNotifications(['alert', 'sound']).then(({ status, settings }) => {
    //   console.log('response ',status);
    //   if (status === 'granted') {
    //     this.requestNotificationPermission()
    //   }
    // });
    this.requestNotificationPermission();
  };

  requestNotificationPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);

      this.configurePushNotification();
      // this.getFcmToken();
    }
    this.getFcmToken();
  };

  getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log("FCM TOken", fcmToken);
      await AsyncStorage.setItem("token", fcmToken);
    }
  };

  configurePushNotification = () => {
    PushNotification.configure({
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });

    PushNotification.requestPermissions({
      alert: true,
      badge: false,
      sound: true,
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

export default NotificationComponent;
