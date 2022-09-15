import React, { Component } from "react";
import {
  Image,
  Text,
  View,
  Platform,
  StyleSheet,
  StatusBar,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Permissions, { PERMISSIONS } from "react-native-permissions";
import { PermissionsAndroid } from "react-native";
import Geolocation from "@react-native-community/geolocation";
import Toast from "react-native-simple-toast";
import LinearGradient from "react-native-linear-gradient";
import Ripple from "react-native-material-ripple";
import { colors, fonts } from "../../common/colors";

const WINDOW_WIDTH = Dimensions.get("window").width;

export default class LocationActivation extends Component {
  constructor(props) {
    super(props);
  }

  Click = async () => {
    if (Platform.OS == "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted == "granted") {
        this.props.navigation.navigate("Notification");
      }
    } else {
      const check = await Permissions.check(
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      );
      const request = await Permissions.request(
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      );
      if (check !== "granted" || request !== "granted") {
        alert("Please grant the location access");
      } else {
        this.props.navigation.navigate("Notification");
      }
    }
  };

  getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log("getCurrentLocation", position);
        this.props.navigation.navigate("Notification");
      },
      (error) => {
        Toast.show("Your location is off you have to enable it.");
      },
      {
        enableHighAccuracy: false,
        timeout: 200000,
        forceRequestLocation: true,
        showLocationDialog: true,
      }
    );
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
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
                  Location activation
                </Text>
              </View>
              <View style={styles.headerButtonsViewStyle} />
            </View>
          </View>
        </View>

        <View style={styles.contentViewStyle}>
          <Image
            source={require("../../assets/locationImage.png")}
            style={{ height: 212, width: 223 }}
          />
          <Text style={styles.contentTextStyle}>
            To meet people around you, we need to use your location.
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => this.getCurrentLocation()}
        >
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={["#38A5CA", "#54C8EE"]}
            style={styles.linearGradient}
          >
            <Text style={styles.textStyle}>Location Permission</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
