import React, { PureComponent, Component } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  FlatList,
  StatusBar,
  ImageBackground,
  Dimensions,
} from "react-native";
import { colors, fonts, resetStackAndNavigate } from "../../common/colors";
import { HeadingText } from "../../common/HeadingText";
import RNPickerSelect from "react-native-picker-select";
import PickerStyle from "../../common/PickerStyle";
import { connect } from "react-redux";
import {
  setCurrentStatus,
  setRelationShipStatus,
} from "../../redux/Actions/UserAction";
import Toast from "react-native-simple-toast";
import ApiHelper from "../../Networking/NetworkCall";
import Loader from "../../common/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ripple from "react-native-material-ripple";

const WINDOW_WIDTH = Dimensions.get("window").width;

class CurrentStatusComponent extends PureComponent {
  _menu = null;

  constructor(props) {
    super(props);
    this.state = {
      code: "",
      isCheck: false,
      birthDate: "",
      genders: ["Studying", "Trainee", "In School", "Working"],
      arrRelationShipStatus: [
        "Single",
        "In a relationship",
        "Married",
        "No answer",
      ],
      selectedIndex: 1,
      relation_ship_status: "Studying",
      currentStatus: "",
      loading: false,
      isFromEditProfile: false,
    };
  }

  componentDidMount() {
    const { relationship_status, current_status } = this.props.userInfo;
    this.setState({
      relation_ship_status:
        relationship_status == undefined ? "" : relationship_status,
      currentStatus: current_status == undefined ? "" : current_status,
      selectedIndex: this.state.genders.indexOf(current_status),
    });
    if (this.props.route.params != undefined) {
      const { isFromEditProfile } = this.props.route.params;
      this.setState({
        isFromEditProfile,
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
            source={require("../../assets/workingSHeader.png")}
            style={{ width: WINDOW_WIDTH, height: 235, marginTop: -1 }}
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

            <Ripple
              rippleCentered={true}
              rippleContainerBorderRadius={50}
              style={styles.skipButtonStyle}
              onPress={() =>
                this.props.navigation.navigate("GroupInterest", {
                  isFromCurrentStatus: true,
                })
              }
            >
              <Text
                style={{ color: "black", paddingLeft: 10, paddingRight: 10 }}
              >
                Skip
              </Text>
            </Ripple>
          </ImageBackground>
        </View>

        <View style={{ flex: 2 }}>
          <View style={{ flex: 1, marginTop: 45 }}>
            <FlatList
              data={this.state.genders}
              keyExtractor={(index) => index.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() =>
                    this.setState({ selectedIndex: index, currentStatus: item })
                  }
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.barStyle,
                      {
                        borderColor:
                          this.state.selectedIndex == index
                            ? "#43879f"
                            : colors.black,
                        backgroundColor:
                          this.state.selectedIndex == index
                            ? "#43879f"
                            : colors.white,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.barTextStyle,
                        {
                          color:
                            this.state.selectedIndex == index
                              ? colors.white
                              : colors.black,
                        },
                      ]}
                    >
                      {item}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.bottomView}
          activeOpacity={0.8}
          onPress={() => {
            if (this.state.currentStatus.trim().length == 0) {
              Toast.show("Please select current status");
            } else {
              if (
                this.state.isFromEditProfile &&
                this.state.isFromEditProfile == true
              ) {
                this.callUpdateUserStatus();
              } else {
                this.props.setCurrentStatus(this.state.currentStatus);
                this.props.setRelationShipStatus(
                  this.state.relation_ship_status
                );
                this.props.navigation.navigate("GroupInterest", {
                  isFromCurrentStatus: true,
                });
              }
            }
          }}
        >
          <Text style={styles.textStyle}>Next</Text>
        </TouchableOpacity>

        <Loader loading={this.state.loading} />
      </KeyboardAvoidingView>
    );
  }

  callUpdateUserStatus = () => {
    this.setState({ loading: true });
    var formData = new FormData();
    formData.append("token", this.props.userInfo.token);
    formData.append("life_status", this.state.currentStatus);
    formData.append("relationship_status", "single");

    ApiHelper.post("updateUserStatus", formData)
      .then((response) => {
        this.setState({ loading: false });
        if (response.status == 200) {
          if (response.data.status == "SUCCESS") {
            this.props.navigation.goBack();
          } else {
            console.error(response.data.message);
            if (response.data.message) {
              Toast.show(response.data.message);
            }
            if (
              response.data.is_token_expired &&
              Boolean(response.data.is_token_expired)
            ) {
              resetStackAndNavigate(this.props.navigation, "Login");
            }
          }
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.error(error);
        Toast.show(error.message);
      });
  };
}

const mapStateToProps = (state) => {
  return {
    current_status: state.user.current_status,
    relation_ship_status: state.user.relation_ship_status,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentStatus: (data) => dispatch(setCurrentStatus(data)),
    setRelationShipStatus: (data) => dispatch(setRelationShipStatus(data)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrentStatusComponent);

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
  skipButtonStyle: {
    height: 34,
    // width: 40,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    bottom: 30,
    right: 30,
    position: "absolute",
    zIndex: 999,
  },

  barStyle: {
    flexDirection: "row",
    height: 45,
    width: WINDOW_WIDTH - 60,
    borderRadius: 30,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2.5,
    marginBottom: 20,
  },
  barTextStyle: {
    fontFamily: fonts.Medium,
    fontSize: 12,
    paddingBottom: 1.5,
  },
  bottomView: {
    flexDirection: "row",
    height: 46,
    width: WINDOW_WIDTH - 60,
    alignSelf: "center",
    backgroundColor: "#43879f",
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
