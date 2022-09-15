import React, { PureComponent } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  StatusBar,
  KeyboardAvoidingView,
} from "react-native";
import { colors, fonts } from "../../common/colors";

import Ripple from "react-native-material-ripple";
import { CustomInputField } from "../../common/inputField";

const WINDOW_WIDTH = Dimensions.get("window").width;

class EmailComponentCopy extends PureComponent {
  constructor() {
    super();
    this.state = {
      email: "",
    };
  }

  componentDidMount() {
    const email = this.props.route.params.email;
    this.setState({ email });
  }

  render() {
    return (
      <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.white }}>
        <StatusBar
          backgroundColor={"transparent"}
          translucent
          barStyle="light-content"
        />
        <View>
          <ImageBackground
            source={require("../../assets/emailHeader.png")}
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
            editable={false}
            // placeholder="Email Address"
            value={this.state.email}
            // onChangeText={(text) => this.setState({ email: text })}
            // keyboardType="email-address"
            // maxLength={30}
            icon={require("../../assets/emailIcon.png")}
          />
        </View>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <TouchableOpacity
            style={styles.bottomView}
            activeOpacity={0.8}
            onPress={() => {
              this.props.navigation.goBack();
            }}
          >
            <Text style={styles.textStyle}>Back</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

export default EmailComponentCopy;

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
    backgroundColor: "#4b8295",
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
