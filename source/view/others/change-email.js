import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";

import { useSelector } from "react-redux";
import { colors, fonts } from "../../common/colors";
import axios from "axios";
import Toast from "react-native-simple-toast";
import Ripple from "react-native-material-ripple";
import { CustomInputField } from "../../common/inputField";
import LinearGradient from "react-native-linear-gradient";

const WINDOW_WIDTH = Dimensions.get("window").width;

export default function ChangeNumber({ navigation, route }) {
  const [state, setstate] = useState("");
  const data = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    setstate(route.params.toString());
  }, []);

  const change = () => {
    const parameter = new FormData();
    parameter.append("token", data.token);
    parameter.append("email", state);
    console.log("parameter");
    console.log(parameter);
    axios
      .post("http://squadvibes.onismsolution.com/api/updateUserEmail", parameter)
      .then((res) => {
        Toast.show("Email Updated Successfully");
        navigation.navigate("Setting");
      });
  };

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
                onPress={() => navigation.goBack()}
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
                Update Email Address
              </Text>
            </View>
            <View style={styles.headerButtonsViewStyle} />
          </View>
        </View>
      </View>

      <View style={{ marginTop: 50 }}>
        <CustomInputField
          placeholder="Email Address"
          onChangeText={(text) => setstate(text)}
          value={state}
          keyboardType="email-address"
          maxLength={30}
          icon={require("../../assets/emailIcon.png")}
        />
      </View>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <TouchableOpacity activeOpacity={0.8} onPress={change}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={["#4b8295", "#4b8295"]}
            style={styles.linearGradient}
          >
            <Text style={styles.textStyle}>Update</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
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
