import React, { PureComponent, Component } from "react";
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
import { colors, fonts, resetStackAndNavigate } from "../../common/colors";
import ApiHelper from "../../Networking/NetworkCall";
import { connect } from "react-redux";
import Toast from "react-native-simple-toast";
import Loader from "../../common/Loader";
import { ColorPicker, fromHsv } from "react-native-color-picker";
import {
  setGroupWeAre,
  setGroupLookingFor,
  setSelectedUserId,
  setGroupName,
  setGroupImages,
  setGroupCity,
  setGroupZipCode,
  setGroupRadius,
  setGroupInterest,
} from "../../redux/Actions/SquadAction";
import Header from "../components/header";
import Button from "../components/button";
const icon_user_selected = require("../../assets/tick_green.png");
const icon_user_unselected = require("../../assets/grey_tick_ic.png");
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

import LinearGradient from "react-native-linear-gradient";
import Ripple from "react-native-material-ripple";
import { CustomInputField } from "../../common/inputField";

const WINDOW_WIDTH = Dimensions.get("window").width;

class MySquadComponent extends Component {
  _menu = null;

  constructor() {
    super();
    this.state = {
      code: "",
      isCheck: false,
      birthDate: "",
      images: ["", "", "", "", "", "", "", "", "", "", "", ""],
      selectedIndex: -1,
      arrColors: ["#211F1A", "#C7158C", "#F5843B"],
      loading: false,
      arrSquad: [],
      squads: [],
      arrModelArray: [],
      show_color_view: false,
      selected_squad_id: "",
      squad_color: "",
      arrSelectedUserId: [],
    };
    this.unmount_component = false;
  }

  setMenuRef = (ref, index) => {
    this._menu = this[`menu${index}`] = ref;
  };

  hideMenu = (index) => {
    // this._menu.hide();
    this[`menu${index}`].hide();
  };

  showMenu = () => {
    this._menu.show();
  };

  componentDidMount() {
    this.unmount_component = false;
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      // do something
      this.setState({
        selectedIndex: -1,
      });
      this.getMySquad();

      this.resetData();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  onPressSelectedUser = (index) => {
    let userId = this.state.arrSquad[index].squad_id;
    // let squadId = this.state.squads[index].squad_id
    let arrSelectedUserId = [...this.state.arrSelectedUserId];
    let arrSquads = [...this.state.squads];
    if (arrSelectedUserId.includes(userId)) {
      const data = arrSelectedUserId.filter((data) => data != userId);
      const squads = this.state.squads.filter((data) => data != userId);
      this.setState({
        arrSelectedUserId: data,
        squads: squads,
      });
    } else {
      arrSelectedUserId.push(userId);
      arrSquads.push(this.state.arrSquad[index]);
      this.setState({
        arrSelectedUserId,
        squads: arrSquads,
      });
    }
  };

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
                  My Squads
                </Text>
              </View>
              <View style={{ width: 60 }} />
            </View>
          </View>
        </View>

        <ScrollView>
          <View style={{ flex: 2, marginTop: 23 }}>
            <FlatList
              style={{ paddingBottom: 85 }}
              data={this.state.arrSquad}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    style={{
                      flexDirection: "column",
                      paddingHorizontal: 8,
                    }}
                    onPress={() => {
                      this.onPressSelectedUser(index);
                    }}
                  >
                    <View style={styles.itemView}>
                      <Image
                        source={{
                          uri: item.squad_image[0]?.squad_image,
                          cache: true,
                        }}
                        style={styles.profileImg}
                      />
                      <View
                        style={{ marginLeft: 10, justifyContent: "center" }}
                      >
                        <Text style={styles.headerView}>{item.squad_name}</Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "flex-end",
                          marginRight: 15,
                        }}
                      >
                        {this.state.arrSelectedUserId.includes(
                          item.squad_id
                        ) ? (
                          <View
                            style={{
                              paddingHorizontal: 10,
                              height: 30,
                              backgroundColor: "grey",
                              borderRadius: 50,
                            }}
                          >
                            <Text
                              style={{
                                height: "100%",
                                marginTop: 6,
                                fontSize: 12,
                                color: "white",
                              }}
                            >
                              ADDED
                            </Text>
                          </View>
                        ) : (
                          <View
                            style={{
                              paddingHorizontal: 10,
                              height: 30,
                              backgroundColor: colors.greenButton,
                              borderRadius: 50,
                            }}
                          >
                            <Text
                              style={{
                                height: "100%",
                                marginTop: 6,
                                fontSize: 12,
                                color: "white",
                              }}
                            >
                              ADD
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>

                    <View style={styles.lineVisibleView} />
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </ScrollView>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            this.props.navigation.navigate("AddEvent2", {
              isFromAddSquad: true,
              squads: this.state.squads,
                  title: this.props.route.params.title,
                  address: this.props.route.params.address,
                  latitude: this.props.route.params.latitude,
                  longitude: this.props.route.params.latitude,
            });
          }}
        >
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={["#38A5CA", "#54C8EE"]}
            style={styles.linearGradient}
          >
            <Text style={styles.textStyle}>Add Squad</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Loader loading={this.state.loading} />
      </View>
    );
  }

  showGroupImages = (data) => {
    if (data.length > 5) {
      return (
        <View style={{ flexDirection: "row", marginTop: 5 }}>
          <Image
            style={{
              width: 26,
              height: 26,
              borderRadius: 13,
              borderColor: "#211F1A",
              borderWidth: 3,
            }}
            source={
              data[0].user_image
                ? { uri: data[0].user_image }
                : require("../../assets/avtar.jpg")
            }
          />
          <Image
            style={{
              right: 10,
              width: 26,
              height: 26,
              borderRadius: 13,
              borderColor: "#211F1A",
              borderWidth: 3,
            }}
            source={
              data[1].user_image
                ? { uri: data[1].user_image }
                : require("../../assets/avtar.jpg")
            }
          />
          <Image
            style={{
              right: 20,
              width: 26,
              height: 26,
              borderRadius: 13,
              borderColor: "#211F1A",
              borderWidth: 3,
            }}
            source={
              data[2].user_image
                ? { uri: data[2].user_image }
                : require("../../assets/avtar.jpg")
            }
          />
          <Image
            style={{
              right: 30,
              width: 26,
              height: 26,
              borderRadius: 13,
              borderColor: "#211F1A",
              borderWidth: 3,
            }}
            source={
              data[3].user_image
                ? { uri: data[3].user_image }
                : require("../../assets/avtar.jpg")
            }
          />
          <Image
            style={{
              right: 40,
              width: 26,
              height: 26,
              borderRadius: 13,
              borderColor: "#211F1A",
              borderWidth: 3,
            }}
            source={
              data[4].user_image
                ? { uri: data[4].user_image }
                : require("../../assets/avtar.jpg")
            }
          />
          <View
            style={{
              backgroundColor: "#F5843B",
              right: 50,
              width: 26,
              height: 26,
              borderRadius: 13,
              borderColor: "#211F1A",
              borderWidth: 3,
            }}
          >
            <Text
              style={{
                fontFamily: fonts.SemiBold,
                fontSize: 12,
                textAlign: "center",
                color: colors.white,
              }}
            >{`+${data.length - 5}`}</Text>
          </View>
        </View>
      );
    } else if (data.length > 5) {
      return (
        <View style={{ flexDirection: "row", marginTop: 5 }}>
          <Image
            style={{
              width: 26,
              height: 26,
              borderRadius: 13,
              borderColor: "#211F1A",
              borderWidth: 3,
            }}
            source={
              data[0].user_image
                ? { uri: data[0].user_image }
                : require("../../assets/avtar.jpg")
            }
          />
          <Image
            style={{
              right: 10,
              width: 26,
              height: 26,
              borderRadius: 13,
              borderColor: "#211F1A",
              borderWidth: 3,
            }}
            source={
              data[1].user_image
                ? { uri: data[1].user_image }
                : require("../../assets/avtar.jpg")
            }
          />
          <Image
            style={{
              right: 20,
              width: 26,
              height: 26,
              borderRadius: 13,
              borderColor: "#211F1A",
              borderWidth: 3,
            }}
            source={
              data[2].user_image
                ? { uri: data[2].user_image }
                : require("../../assets/avtar.jpg")
            }
          />
          <Image
            style={{
              right: 30,
              width: 26,
              height: 26,
              borderRadius: 13,
              borderColor: "#211F1A",
              borderWidth: 3,
            }}
            source={
              data[3].user_image
                ? { uri: data[3].user_image }
                : require("../../assets/avtar.jpg")
            }
          />
          <Image
            style={{
              right: 40,
              width: 26,
              height: 26,
              borderRadius: 13,
              borderColor: "#211F1A",
              borderWidth: 3,
            }}
            source={
              data[4].user_image
                ? { uri: data[4].user_image }
                : require("../../assets/avtar.jpg")
            }
          />
        </View>
      );
    } else if (data.length >= 4) {
      return (
        <View style={{ flexDirection: "row", marginTop: 5 }}>
          <Image
            style={{
              width: 26,
              height: 26,
              borderRadius: 13,
              borderColor: "#211F1A",
              borderWidth: 3,
            }}
            source={
              data[0].user_image
                ? { uri: data[0].user_image }
                : require("../../assets/avtar.jpg")
            }
          />
          <Image
            style={{
              right: 8,
              width: 26,
              height: 26,
              borderRadius: 13,
              borderColor: "#211F1A",
              borderWidth: 3,
            }}
            source={
              data[1].user_image
                ? { uri: data[1].user_image }
                : require("../../assets/avtar.jpg")
            }
          />
          <Image
            style={{
              right: 16,
              width: 26,
              height: 26,
              borderRadius: 13,
              borderColor: "#211F1A",
              borderWidth: 3,
            }}
            source={
              data[2].user_image
                ? { uri: data[2].user_image }
                : require("../../assets/avtar.jpg")
            }
          />
          <Image
            style={{
              right: 24,
              width: 26,
              height: 26,
              borderRadius: 13,
              borderColor: "#211F1A",
              borderWidth: 3,
            }}
            source={
              data[3].user_image
                ? { uri: data[3].user_image }
                : require("../../assets/avtar.jpg")
            }
          />
        </View>
      );
    } else if (data.length >= 3) {
      return (
        <View style={{ flexDirection: "row", marginTop: 5 }}>
          <Image
            style={{
              width: 26,
              height: 26,
              borderRadius: 13,
              borderColor: "#211F1A",
              borderWidth: 3,
            }}
            source={
              data[0].user_image
                ? { uri: data[0].user_image }
                : require("../../assets/avtar.jpg")
            }
          />
          <Image
            style={{
              right: 8,
              width: 26,
              height: 26,
              borderRadius: 13,
              borderColor: "#211F1A",
              borderWidth: 3,
            }}
            source={
              data[1].user_image
                ? { uri: data[1].user_image }
                : require("../../assets/avtar.jpg")
            }
          />
          <Image
            style={{
              right: 16,
              width: 26,
              height: 26,
              borderRadius: 13,
              borderColor: "#211F1A",
              borderWidth: 3,
            }}
            source={
              data[2].user_image
                ? { uri: data[2].user_image }
                : require("../../assets/avtar.jpg")
            }
          />
        </View>
      );
    } else if (data.length >= 2) {
      return (
        <View style={{ flexDirection: "row", marginTop: 5 }}>
          <Image
            style={{
              width: 26,
              height: 26,
              borderRadius: 13,
              borderColor: "#211F1A",
              borderWidth: 3,
            }}
            source={
              data[0].user_image
                ? { uri: data[0].user_image }
                : require("../../assets/avtar.jpg")
            }
          />
          <Image
            style={{
              right: 8,
              width: 26,
              height: 26,
              borderRadius: 13,
              borderColor: "#211F1A",
              borderWidth: 3,
            }}
            source={
              data[1].user_image
                ? { uri: data[1].user_image }
                : require("../../assets/avtar.jpg")
            }
          />
        </View>
      );
    } else if (data.length >= 1) {
      return (
        <View style={{ flexDirection: "row", marginTop: 5 }}>
          <Image
            style={{
              width: 26,
              height: 26,
              borderRadius: 13,
              borderColor: "#211F1A",
              borderWidth: 3,
            }}
            source={
              data[0].user_image
                ? { uri: data[0].user_image }
                : require("../../assets/avtar.jpg")
            }
          />
        </View>
      );
    } else {
      if (data.length > 5) {
        return (
          <View style={{ flexDirection: "row", marginTop: 5 }}>
            <Image
              style={{
                width: 26,
                height: 26,
                borderRadius: 13,
                borderColor: "#211F1A",
                borderWidth: 3,
              }}
              source={require("../../assets/avtar.jpg")}
            />
            <Image
              style={{
                right: 8,
                width: 26,
                height: 26,
                borderRadius: 13,
                borderColor: "#211F1A",
                borderWidth: 3,
              }}
              source={require("../../assets/avtar.jpg")}
            />
            <Image
              style={{
                right: 16,
                width: 26,
                height: 26,
                borderRadius: 13,
                borderColor: "#211F1A",
                borderWidth: 3,
              }}
              source={require("../../assets/avtar.jpg")}
            />
            <Image
              style={{
                right: 24,
                width: 26,
                height: 26,
                borderRadius: 13,
                borderColor: "#211F1A",
                borderWidth: 3,
              }}
              source={require("../../assets/avtar.jpg")}
            />
            <Image
              style={{
                right: 32,
                width: 26,
                height: 26,
                borderRadius: 13,
                borderColor: "#211F1A",
                borderWidth: 3,
              }}
              source={require("../../assets/avtar.jpg")}
            />
            <View
              style={{
                backgroundColor: "#F5843B",
                right: 42,
                width: 26,
                height: 26,
                borderRadius: 13,
                borderColor: "#211F1A",
                borderWidth: 3,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontFamily: fonts.SemiBold, fontSize: 12 }}>{`+${
                data.length - 5
              }`}</Text>
            </View>
          </View>
        );
      }
    }
  };

  getMySquad = () => {
    this.setState({ loading: true });
    var formdata = new FormData();
    formdata.append("token", this.props.userInfo.token);

    ApiHelper.post("squadList", formdata)
      .then((response) => {
        // console.log("response ", response);
        this.setState({ loading: false });
        if (response.status == 200) {
          if (response.data.status == "SUCCESS") {
            if (response.data.hasOwnProperty("squadList")) {
              const data = response.data.squadList.filter((elem) => {
                let found = false;
                this.props.route.params.invite_squad.forEach((item) => {
                  if (item.squad_id === elem.squad_id) {
                    found = true;
                  }
                });
                return !found;
              });
              this.setState({
                arrSquad: data,
              });
            }
          } else {
            if (response.data.requestKey) {
              Toast.show(response.data.requestKey);
            }

            if (response.data.is_token_expired == 1) {
              this.props.resetData("");
              resetStackAndNavigate(this.props.navigation, "Login");
              // this.props.navigation.navigate('Login')
            }
          }
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        Toast.show(error.message);
      });
  };

  updateCardColor = () => {
    this.setState({ loading: true });
    var formdata = new FormData();
    formdata.append("token", this.props.userInfo.token);
    formdata.append("squad_id", this.state.selected_squad_id);
    formdata.append("squad_color", this.state.squad_color);

    ApiHelper.post("updateSquadColor", formdata)
      .then((response) => {
        this.setState({ loading: false });
        if (response.status == 200) {
          if (response.data.status == "SUCCESS") {
            this.getMySquad();
          } else {
            if (response.data.requestKey) {
              Toast.show(response.data.requestKey);
            }

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
        Toast.show(error.message);
      });
  };

  resetData = () => {
    this.props.setGroupWeAre("");
    this.props.setGroupLookingFor("");
    this.props.setSelectedUserId([]);
    this.props.setGroupName("");
    this.props.setGroupImages([]);
    this.props.setGroupCity("");
    this.props.setGroupZipCode("");
    this.props.setGroupRadius("");
    this.props.setGroupInterest("");
  };
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setGroupWeAre: (data) => dispatch(setGroupWeAre(data)),
    setGroupLookingFor: (data) => dispatch(setGroupLookingFor(data)),
    setSelectedUserId: (data) => dispatch(setSelectedUserId(data)),
    setGroupName: (data) => dispatch(setGroupName(data)),
    setGroupImages: (data) => dispatch(setGroupImages(data)),
    setGroupCity: (data) => dispatch(setGroupCity(data)),
    setGroupZipCode: (data) => dispatch(setGroupZipCode(data)),
    setGroupRadius: (data) => dispatch(setGroupRadius(data)),
    setGroupInterest: (data) => dispatch(setGroupInterest(data)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(MySquadComponent);

const styles = StyleSheet.create({
  headerView: {
    fontSize: 14,
    marginLeft: 10,
    fontWeight: "bold",
  },

  unReadViewContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingTop: 5,
    width: "15%",
    fontSize: 8,
    color: colors.GRAY,
  },
  unReadMessageView: {
    width: 20,
    height: 20,
    borderRadius: 20 / 2,
    margin: 5,
    marginTop: 5,
    marginLeft: 20,
    justifyContent: "center",
  },
  ///////////
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
  itemView: {
    flexDirection: "row",
    borderRadius: 40,
    marginBottom: 10,
    height: 58,
    width: WINDOW_WIDTH - 60,
    alignSelf: "center",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  profileImg: {
    width: 46,
    height: 46,
    borderRadius: 60,
    resizeMode: "cover",
    alignSelf: "center",
    marginLeft: 7,
  },

  headerView: {
    fontSize: 13,
    marginLeft: 16,
    color: "black",
    fontFamily: fonts.Medium,
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
