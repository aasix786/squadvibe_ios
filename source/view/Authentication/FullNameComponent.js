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
} from "react-native";
import { colors, fonts } from "../../common/colors";
import { HeadingText } from "../../common/HeadingText";
import { CustomButtonWithLeftIcon } from "../../common/ThemeButton";
import HyperlinkedText from "react-native-hyperlinked-text";
import { CheckBox } from "react-native-elements";
import SimpleToast from "react-native-simple-toast";
import { connect } from "react-redux";
import { setFullName } from "../../redux/Actions/UserAction";
import { SearchBar } from "react-native-elements";
import Ripple from "react-native-material-ripple";
import { CustomInputField } from "../../common/inputField";

const WINDOW_WIDTH = Dimensions.get("window").width;

class FullNameComponent extends PureComponent {
  constructor() {
    super();
    this.state = {
      code: "",
      isCheck: false,
      fullName: "",
    };
  }

  componentDidMount() {
    if (this.props.full_name != "" && this.props.full_name != undefined) {
      this.setState({
        fullName: this.props.full_name,
      });
    }
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
        <StatusBar
          backgroundColor={"transparent"}
          translucent
          barStyle="light-content"
        />
        <View>
          <ImageBackground
            source={require("../../assets/nameHeader.png")}
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
            placeholder="Name"
            value={this.state.fullName}
            onChangeText={(text) => this.setState({ fullName: text })}
            keyboardType="default"
            maxLength={30}
            icon={require("../../assets/nameIcon.png")}
          />
        </View>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <TouchableOpacity
            style={styles.bottomView}
            activeOpacity={0.8}
            onPress={() => {
              if (this.state.fullName.trim().length == 0) {
                SimpleToast.show("Please enter name");
              } else {
                this.props.setFullName(this.state.fullName);
                this.props.navigation.navigate("birthday");
              }
            }}
          >
            <Text style={styles.textStyle}>NEXT</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  console.log("redux state", state.user);
  return {
    full_name: state.user.full_name,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setFullName: (data) => dispatch(setFullName(data)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(FullNameComponent);

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
    backgroundColor: "#694c4c",
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
