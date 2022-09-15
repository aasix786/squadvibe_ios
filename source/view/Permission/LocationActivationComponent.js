import React, { PureComponent } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  StatusBar,
  PermissionsAndroid,
  Alert,
  Platform,
  Linking,
  Dimensions,
} from "react-native";
import { colors, fonts } from "../../common/colors";
import Geolocation from "react-native-geolocation-service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LinearGradient from "react-native-linear-gradient";
import Ripple from "react-native-material-ripple";

const WINDOW_WIDTH = Dimensions.get("window").width;

export default class LocationActivationComponent extends PureComponent {
  constructor() {
    super();
    this.state = {
      code: "",
      isCheck: false,
      birthDate: "",
      groupType: ["Mix Friend Group", "Female Friends", "Male Friends"],
      selectedIndex: -1,
      search: "",
      forceLocation: true,
      highAccuracy: true,
      locationDialog: true,
      significantChanges: false,
      observing: false,
      foregroundService: false,
      useLocationManager: false,
      location: "",
    };
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
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
                  />
                </Ripple>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.contentViewStyle}>
          <Image
            source={require("../../assets/locationImage.png")}
            style={{ height: 212, width: 223 }}
          />
          <Text style={styles.contentTextStyle}>
            To meet peoplearound you, we need to use your location.
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            this.locationPermission();
            this.props.navigation.navigate("Notification");
          }}
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

  locationPermission = async () => {
    if (Platform.OS === "ios") {
      Geolocation.requestAuthorization("whenInUse").then((res) => {
        if (res === "granted") {
          this.getLocation();
        } else if (res === "denied" || res === "disabled") {
          const openSetting = () => {
            Linking.openSettings().catch(() => {
              Alert.alert("Unable to open settings");
            });
          };

          Alert.alert(
            `Turn on Location Services to allow determine your location.`,
            "",
            [
              { text: "Go to Settings", onPress: openSetting },
              { text: "Don't Use Location", onPress: () => {} },
            ]
          );
        }
      });
    } else {
      let granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "App Geolocation Permission",
          message: "App needs access to your phone's location.",
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.getLocation();
      } else {
        console.log("Location permission not granted!!!!");
      }
    }
  };

  getLocation = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        this.setState({ location: position });
        let coordinate = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        AsyncStorage.setItem("latitude", coordinate.latitude.toString());
        AsyncStorage.setItem("longitude", coordinate.longitude.toString());
      },
      (error) => {
        Alert.alert(`Code ${error.code}`, error.message);
        this.setState({ location: "" });
        console.log(error);
      },
      {
        accuracy: {
          android: "high",
          ios: "best",
        },
        enableHighAccuracy: this.state.highAccuracy,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0,
        forceRequestLocation: this.state.forceLocation,
        forceLocationManager: this.state.useLocationManager,
        showLocationDialog: this.state.locationDialog,
      }
    );
  };
}

async function hasLocationPermission() {
  if (Platform.OS === "ios") {
    const hasPermission = await hasPermissionIOS();
    return hasPermission;
  }

  if (Platform.OS === "android" && Platform.Version < 23) {
    return true;
  }

  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  );

  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }

  if (status === PermissionsAndroid.RESULTS.DENIED) {
    ToastAndroid.show("Location permission denied by user.", ToastAndroid.LONG);
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    ToastAndroid.show(
      "Location permission revoked by user.",
      ToastAndroid.LONG
    );
  }

  return false;
}

async function hasPermissionIOS() {
  const openSetting = () => {
    Linking.openSettings().catch(() => {
      Alert.alert("Unable to open settings");
    });
  };
  const status = await Geolocation.requestAuthorization("whenInUse");

  if (status === "granted") {
    return true;
  }

  if (status === "denied") {
    Alert.alert("Location permission denied");
  }

  if (status === "disabled") {
    Alert.alert(
      `Turn on Location Services to allow "${appConfig.displayName}" to determine your location.`,
      "",
      [
        { text: "Go to Settings", onPress: openSetting },
        { text: "Don't Use Location", onPress: () => {} },
      ]
    );
  }

  return false;
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
