import React, { PureComponent, Component } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Keyboard,
  Pressable,
  Dimensions,
  ImageBackground,
  StatusBar,
  Alert,
} from "react-native";
import { colors, fonts } from "../../common/colors";
import { HeadingText } from "../../common/HeadingText";
import { CustomButtonWithLeftIcon } from "../../common/ThemeButton";
import HyperlinkedText from "react-native-hyperlinked-text";
import { Input, Icon } from "react-native-elements";
import { TextInputMask } from "react-native-masked-text";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { connect } from "react-redux";
import { setBirthDate } from "../../redux/Actions/UserAction";
import Toast from "react-native-simple-toast";
import Ripple from "react-native-material-ripple";

const WINDOW_WIDTH = Dimensions.get("window").width;

class BirthDayComponent extends PureComponent {
  constructor() {
    super();
    this.state = {
      code: "",
      isCheck: false,
      day: "",
      month: "",
      year: "",
      birthDate: "",
      isPickerVisible: false,
    };
  }

  componentDidMount() {
    Keyboard.dismiss();
  }

  render() {
    const { day, month, year, birthDate } = this.state;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
        <StatusBar
          backgroundColor={"transparent"}
          translucent
          barStyle="light-content"
        />
        <View>
          <ImageBackground
            source={require("../../assets/dobHeader.png")}
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

        <View style={{ flex: 2 }}>
          <View style={styles.textInputViewStyle}>
            <TextInput
              style={styles.textInputStyle}
              placeholder={"DD"}
              placeholderTextColor="#CECECE"
              value={day}
              onChangeText={(text) => {
                if(text.length === 2){
                  this.secondTextInput.focus();
                }
                this.setState({ day: text })}}
              keyboardType={"number-pad"}
              maxLength={2}
            />

            <View style={{ width: 7 }} />

            <TextInput
            ref={(input) => { this.secondTextInput = input; }}
              style={styles.textInputStyle}
              placeholder={"MM"}
              placeholderTextColor="#CECECE"
              value={month}
              onChangeText={(text) => {
                if(text.length === 2){
                  this.thirdTextInput.focus();
                }
                this.setState({ month: text })}}
              keyboardType={"number-pad"}
              maxLength={2}
            />

            <View style={{ width: 7 }} />

            <TextInput
             ref={(input) => { this.thirdTextInput = input; }}
              style={styles.textInputStyle}
              placeholder={"YYYY"}
              placeholderTextColor="#CECECE"
              value={year}
              onChangeText={(text) => {
                this.setState({ year: text });
                if (text.length === 4) {
                  Keyboard.dismiss();
                }
              }}
              onEndEditing={() =>
                this.setState({ birthDate: year + "-" + month + "-" + day })
              }
              keyboardType={"number-pad"}
              maxLength={4}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.bottomView}
          activeOpacity={0.8}
          onPress={() => {
            if (birthDate.trim().length == 0) {
              Toast.show("Please enter the birthdate");
            } else {
              //   let dob = moment(this.state.birthDate, "DD/MM/YYYY").format(
              //     "YYYY-MM-DD"
              //   );
              this.props.setBirthDate(birthDate);
              this.props.navigation.navigate("gender");
            }
          }}
        >
          <Text style={styles.textStyle}>Next</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    birthDate: state.user.birthDate,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setBirthDate: (data) => dispatch(setBirthDate(data)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(BirthDayComponent);

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
    backgroundColor: "#A7A34C",
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
  textInputStyle: {
    height: 45,
    width: 100,
    backgroundColor: "white",
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    textAlign: "center",
    color: "black",
  },
  textInputViewStyle: {
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 70,
  },
});
