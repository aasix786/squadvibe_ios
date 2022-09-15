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
  ImageBackground,
} from "react-native";
// import SearchBar from '../../common/SearchBar';
import SubmitButton from "../../common/SubmitButton";
import { colors, fonts, resetStackAndNavigate } from "../../common/colors";
import Header from "../../common/Header";
import SearchBarExtended from "../../common/SearchBarExtended";
const icon_back_arrow = require("../../assets/back_arrow.png");
const icon_rightArrow = require("../../assets/button_white_arrow.png");
var { width } = Dimensions.get("window");
import { Input, Slider, SearchBar } from "react-native-elements";
import { HeadingText } from "../../common/HeadingText";
import { CheckBox, Button, Dialog } from "react-native-elements";
import { connect } from "react-redux";
import { setInterest } from "../../redux/Actions/UserAction";
import { setGroupInterest } from "../../redux/Actions/SquadAction";
import Toast from "react-native-simple-toast";
import ApiHelper from "../../Networking/NetworkCall";
import Loader from "../../common/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ripple from "react-native-material-ripple";
import { CustomInputField } from "../../common/inputField";

const WINDOW_WIDTH = Dimensions.get("window").width;

class GroupInterestComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      selectedIndex: -1,
      selectedInterest: [],
      interest: [],
      arrInterest: [],
      arrFilterData: [],
      loading: false,
      squad_id: "",
      isFromCurrentStatus: false,
      isFromEditProfile: false,
      isFromMySquad: false,
      maxSelection: 4,
    };
  }

  updateSearch = (search) => {
    this.setState({ search });
    const arrFilterData = this.state.arrInterest.filter((data) =>
      data.interest.toLowerCase().includes(search.toLowerCase())
    );
    this.setState({
      arrFilterData,
    });
  };

  componentDidMount() {
    this.getInterest();

    if (this.props.route.params != undefined) {
      const {
        isFromCurrentStatus,
        isFromEditProfile,
        data,
        isFromMySquad,
        isFromManageSquad,
      } = this.props.route.params;

      if (isFromManageSquad) {
        const interest = data
          .filter((elem) => elem.interest_id)
          .map((elem) => elem.interest_id);
        this.setState({ selectedInterest: interest });
      } else if (isFromEditProfile && isFromEditProfile == true) {
        if (data !== undefined && data.length > 0) {
          const selectedInterest = data.map((data) => data.interest_id);
          this.setState({ selectedInterest });
        }
      } else if (isFromMySquad && isFromMySquad == true) {
        if (data !== undefined && data) {
          const selectedInterest = data.interest_data.map(
            (data) => data.interest_id
          );
          this.setState({ selectedInterest, squad_id: data.squad_id });
          // this.setState({squad_id:data.squad_id})
        }
      }
      console.log(
        "CHECKING",
        isFromCurrentStatus,
        isFromEditProfile,
        isFromMySquad,
        isFromManageSquad
      );
      this.setState({
        isFromCurrentStatus,
        isFromEditProfile,
        isFromMySquad,
      });
    }
  }

  render() {
    console.log("HAHHHAHAHHA", this.state.selectedInterest);
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor={"transparent"}
          translucent
          barStyle="light-content"
        />
        <View>
          <ImageBackground
            source={require("../../assets/groupIntHeader.png")}
            style={{ width: WINDOW_WIDTH, height: 212, marginLeft: -0.5 }}
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
              onPress={() => this.props.navigation.navigate("AddPicture")}
            >
              <Text style={{ color: "black" }}>Skip</Text>
            </Ripple>
          </ImageBackground>
        </View>

        <View style={{ flex: 2, marginTop: 40 }}>
          <View>
            <CustomInputField
              placeholder="Search Your Interests"
              value={this.state.search}
              onChangeText={this.updateSearch}
              keyboardType="default"
              inputTextAlign={"left"}
              iconHeight={43}
              iconWidth={43}
              icon={require("../../assets/interestSearchIcon.png")}
            />
          </View>

          <Text style={styles.titleTextStyle}>Group Interests</Text>
          <Text style={styles.desTextStyle}>
            Choose the activities that might interest you so you can see what
            others are upto.
          </Text>

          <View>
            <FlatList
              data={
                this.state.arrFilterData.length > 0
                  ? this.state.arrFilterData
                  : this.state.arrInterest
              }
              numColumns={3}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      if (this.state.selectedInterest.includes(item.id)) {
                        console.log("innn");
                        const interest = this.state.selectedInterest.filter(
                          (data) => data != item.id
                        );
                        this.setState({ selectedInterest: interest });
                      } else {
                        if (
                          this.state.selectedInterest.length >
                          this.state.maxSelection
                        ) {
                          return;
                        }
                        const interest = this.state.selectedInterest;
                        interest.push(item.id);
                        this.setState({
                          selectedIndex: index,
                          selectedInterest: interest,
                          interest: [item, ...this.state.interest],
                        });
                      }
                    }}
                    activeOpacity={0.8}
                  >
                    <View
                      style={{
                        height: 100,
                        width: WINDOW_WIDTH / 3,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: this.state.selectedInterest.includes(
                          item.id
                        )
                          ? "#43879f"
                          : colors.white,
                      }}
                    >
                      <Image
                        style={{
                          resizeMode: "cover",
                          width: 50,
                          height: 50,
                        }}
                        source={{ uri: item.interest_image }}
                      />

                      <Text
                        style={{
                          color: this.state.selectedInterest.includes(item.id)
                            ? colors.white
                            : colors.black,
                          fontFamily: fonts.SemiBold,
                          fontSize: 12,
                          paddingTop: 8,
                        }}
                      >
                        {item.interest}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>

        {/* <TouchableOpacity
          style={[styles.bottomView, { marginBottom: 20 }]}
          activeOpacity={0.8}
          onPress={() => this.props.navigation.navigate("AddPicture")}
        >
          <Text style={styles.textStyle}>Skip</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={styles.bottomView}
          activeOpacity={0.8}
          onPress={() => {
            if (this.state.selectedInterest.length == 0) {
              Toast.show("Please select interest");
            } else {
              const interest = this.state.selectedInterest.join(",");
              if (this.props.route.params.isFromManageSquad) {
                this.props.navigation.navigate("ManageSquad", {
                  isFromGroupInterest: true,
                  interest_data: this.state.interest,
                });
              } else if (this.state.isFromCurrentStatus) {
                this.props.setInterest(interest);
                this.props.navigation.navigate("AddPicture");
              } else if (
                this.state.isFromEditProfile &&
                this.state.isFromEditProfile == true
              ) {
                this.props.navigation.goBack();
              } else {
                this.props.setGroupInterest(interest);
                this.props.navigation.navigate("DetermineLocation");
              }
            }
          }}
        >
          <Text style={styles.textStyle}>Next</Text>
        </TouchableOpacity>
      </View>
    );
  }

  getInterest = () => {
    this.setState({ loading: true });
    ApiHelper.post("interestList")
      .then((response) => {
        if (response.status == 200) {
          this.setState({ loading: false });
          if (response.data.status == "SUCCESS") {
            this.setState({
              arrInterest: response.data.interestList,
            });
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

  callUpdateInterest = () => {
    this.setState({ loading: true });
    var formdata = new FormData();
    formdata.append("token", this.props.userInfo.token);
    formdata.append("interest_id", this.state.selectedInterest.join(","));
    formdata.append("squad_id", this.state.squad_id);
    ApiHelper.post("updateSquadInterest", formdata)
      .then((response) => {
        if (response.status == 200) {
          this.setState({ loading: false });
          if (response.data.status == "SUCCESS") {
            if (response.data.message) {
              Toast.show(response.data.message);
            }
            this.props.navigation.navigate("MySquad");
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
    interest: state.user.interest,
    group_interest: state.manage_squad.group_interest,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setInterest: (data) => dispatch(setInterest(data)),
    setGroupInterest: (data) => dispatch(setGroupInterest(data)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupInterestComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  titleTextStyle: {
    color: "#707070",
    fontSize: 20,
    fontFamily: fonts.Bold,
    textAlign: "center",
    paddingTop: 30,
    paddingBottom: 7,
  },
  desTextStyle: {
    color: colors.black,
    fontSize: 12,
    fontFamily: fonts.regular,
    textAlign: "center",
    width: "70%",
    alignSelf: "center",
    // paddingTop: 30,
    paddingBottom: 30,
  },
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
    width: 50,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    bottom: 27,
    right: 20,
    position: "absolute",
    zIndex: 99,
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
  textInputStype: {
    height: 50,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
  },
});
