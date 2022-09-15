import React, { PureComponent } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Dimensions,
  ImageBackground,
  StatusBar,
  KeyboardAvoidingView,
} from "react-native";
import { colors, fonts } from "../../common/colors";
import { HeadingText } from "../../common/HeadingText";
import { CustomButtonWithLeftIcon } from "../../common/ThemeButton";
import HyperlinkedText from "react-native-hyperlinked-text";
import { CheckBox } from "react-native-elements";
import { connect } from "react-redux";
import {
  setEmail,
  setSubscribeNewsletter,
} from "../../redux/Actions/UserAction";
import Helper from "../../common/Helper";
import Toast from "react-native-simple-toast";
import { SearchBar } from "react-native-elements";
import Ripple from "react-native-material-ripple";
import { CustomInputField } from "../../common/inputField";

const WINDOW_WIDTH = Dimensions.get("window").width;

class EmailComponent extends PureComponent {
  constructor() {
    super();
    this.state = {
      code: "",
      isCheck: false,
      email: "",
    };
  }

  componentDidMount() {
    if (this.props.email != "" && this.props.email != undefined) {
      this.setState({
        email: this.props.email,
      });
    }
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
            placeholder="Email Address"
            value={this.state.email}
            onChangeText={(text) => this.setState({ email: text })}
            keyboardType="email-address"
            maxLength={30}
            icon={require("../../assets/emailIcon.png")}
          />
        </View>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <TouchableOpacity
            style={styles.bottomView}
            activeOpacity={0.8}
            onPress={() => {
              this.redirect();
            }}
          >
            <Text style={styles.textStyle}>NEXT</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  redirect = () => {
    if (this.state.email.trim().length == 0) {
      Toast.show("Please enter email");
    } else if (Helper.isEmailValid(this.state.email) == false) {
      Toast.show("Please enter valid email");
    } else {
      if (this.state.isCheck) {
        this.props.setSubscribeNewsletter(1);
      } else {
        this.props.setSubscribeNewsletter(0);
      }
      this.props.setEmail(this.state.email);
      this.props.navigation.navigate("fullName");
    }
  };
}
const mapStateToProps = (state) => {
  return {
    email: state.user.email,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setEmail: (data) => dispatch(setEmail(data)),
    setSubscribeNewsletter: (data) => dispatch(setSubscribeNewsletter(data)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(EmailComponent);

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
