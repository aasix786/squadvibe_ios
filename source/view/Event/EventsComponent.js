import React, { PureComponent, Component } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Dimensions,
  ImageBackground,
  StatusBar,
} from "react-native";
import { colors, fonts } from "../../common/colors";
import { postMethod } from "../../Networking/APIModel";
import Loader from "../../common/Loader";
import Toast from "react-native-simple-toast";
import moment from "moment";
import { connect } from "react-redux";
import HeaderWithoutBack from "../components/headerWithoutBack";
import { Icon } from "react-native-elements";
import axios from "axios";
import LinearGradient from "react-native-linear-gradient";
import Ripple from "react-native-material-ripple";

const WINDOW_WIDTH = Dimensions.get("window").width;

class EventsComponent extends Component {
  constructor() {
    super();
    this.state = {
      code: "",
      isCheck: false,
      birthDate: "",
      images: ["", "", "", "", "", "", "", "", "", "", "", ""],
      selectedIndex: -1,
      arrColors: ["#211F1A", "#C7158C", "#F5843B"],
      isOpenInvitation: false,
      arrEvent: [],
      arrOpenEvent: [],
      loading: false,
    };
  }

  joinEvent = (item, index) => {
    const parameter = new FormData();
    parameter.append("token", this.props.userInfo.token);
    parameter.append("event_id", item.event_id);
    parameter.append("status", index);

    axios
      .post("http://squadvibes.onismsolution.com/api/JoinEvent", parameter)
      .then((res) => {
        Toast.show(res.data.message);
        const filtered = this.state.arrOpenEvent.filter(
          (elem) => elem.event_id !== item.event_id
        );
        this.setState({ arrOpenEvent: filtered });
      })
      .catch((err) => {
        console.log("JOIN ERR", err);
      });
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
                  Add Event
                </Text>
              </View>
              <View style={styles.headerButtonsViewStyle}>
                <Ripple
                  rippleCentered={true}
                  rippleContainerBorderRadius={50}
                  style={styles.backButtonStyle}
                  onPress={() => this.props.navigation.navigate("NotificationPanel")}
                >
                  <Image
                    source={require("../../assets/bell_Icon.png")}
                    style={{ width: 22, height: 22 }}
                    resizeMode={"contain"}
                  />
                </Ripple>
              </View>
            </View>
          </View>
        </View>

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              marginBottom: 10,
              marginTop: 20,
              borderWidth: 0.5,
              borderRadius: 50,
              borderColor: "white",
              backgroundColor: "white",
              flexDirection: "row",
              justifyContent: "space-between",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.4,
              shadowRadius: 3,
              height: 53,
              elevation: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => this.setState({ isOpenInvitation: false })}
              style={{
                borderRadius: 50,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 0,
                backgroundColor: this.state.isOpenInvitation
                  ? "#00000000"
                  : "#50C4E9",
                height: 45,
                width: "40%",
                marginLeft: 4,
              }}
            >
              <Text
                style={{
                  color: this.state.isOpenInvitation
                    ? colors.themeColor
                    : colors.white,
                  fontFamily: fonts.regular,
                  fontSize: 14,
                }}
              >
                My Events
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.setState({ isOpenInvitation: true })}
              style={{
                borderRadius: 50,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 0,
                backgroundColor: this.state.isOpenInvitation
                  ? "#50C4E9"
                  : "#00000000",
                height: 45,
                width: "40%",
                marginRight: 3,
              }}
            >
              <Text
                style={{
                  color: this.state.isOpenInvitation
                    ? colors.white
                    : colors.themeColor,
                  fontFamily: fonts.regular,
                  fontSize: 14,
                }}
              >
                Open Invitations
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {this.state.isOpenInvitation ? (
            <FlatList
              contentContainerStyle={{ paddingBottom: 80 }}
              style={{ marginTop: 10, width: "100%" }}
              showsVerticalScrollIndicator={false}
  showsHorizontalScrollIndicator={false}
              data={this.state.arrOpenEvent}
              keyExtractor={(item, index) => item.event_id}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("ShuffleDetail", {
                      eventData: item,
                    })
                  }
                  activeOpacity={0.8}
                  style={{
                    height: 150,
                    backgroundColor: "white",
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },
                    shadowOpacity: 0.33,
                    justifyContent: "center",
                    elevation: 5,
                    shadowRadius: 5,
                    marginVertical: 5,
                    borderRadius: 4,
                    width: "100%",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginHorizontal: 20,
                    }}
                  >
                    <Image
                      source={{ uri: item.user_image }}
                      style={{ height: 64, width: 64, borderRadius: 32 }}
                    />
                    <View style={{ marginLeft: 10, width: "50%" }}>
                      <Text
                        numberOfLines={2}
                        style={{
                          color: colors.black,
                          fontSize: 17,
                          fontFamily: fonts.Bold,
                        }}
                      >
                        {item.event_title}
                      </Text>
                      <Text
                        numberOfLines={2}
                        style={{
                          color: colors.gray,
                          fontSize: 14,
                          fontFamily: fonts.Regular,
                        }}
                        numberOfLines={2}
                      >
                        {item.event_description}
                      </Text>
                    </View>

                    <View style={{ marginLeft: "auto" }}>
                      <TouchableOpacity onPress={() => this.joinEvent(item, 1)}>
                        <Image
                          style={{
                            resizeMode: "contain",
                            width: 40,
                            height: 40,
                          }}
                          source={require("../../assets/tick.png")}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => this.joinEvent(item, 0)}>
                        <Image
                          style={{
                            resizeMode: "contain",
                            width: 40,
                            height: 40,
                          }}
                          source={require("../../assets/cross.png")}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={() => {
                return (
                  <View style={{ marginTop: 60 }}>
                    <Text
                      style={{ fontFamily: fonts.Medium, textAlign: "center" }}
                    >
                      No Event Invitations.
                    </Text>
                  </View>
                );
              }}
            />
          ) : this.state.arrEvent.length > 0 ? (
            <FlatList
              style={{ marginTop: 10 }}
              data={this.state.arrEvent}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => item.event_id}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("ShuffleDetail", {
                      eventData: item,
                    })
                  }
                  activeOpacity={0.8}
                  style={{
                    height: 180,
                    width: WINDOW_WIDTH - 60,
                    alignSelf: "center",
                    backgroundColor: "white",
                    shadowColor: "#000",
                    shadowOffset: { width: 2, height: 2 },
                    shadowOpacity: 0.4,
                    shadowRadius: 3,
                    elevation: 5,
                    borderRadius: 10,
                    marginBottom: 10,
                    marginTop: 10,
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={{ uri: item.user_image }}
                      style={{
                        height: 147,
                        width: 120,
                        borderRadius: 10,
                        margin: 15,
                      }}
                    />
                    <View style={{ marginLeft: 7, flex: 1 }}>
                      <Text
                        style={{
                          color: colors.black,
                          fontSize: 14,
                          fontFamily: fonts.Medium,
                        }}
                      >
                        {item.event_title}
                      </Text>

                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: fonts.Regular,
                          color: colors.gray,
                        }}
                      >
                        {moment(item.event_date, "YYYY-MM-DD").format(
                          "DD MMM YYYY"
                        )}

                        {`\t\t${item.event_time}`}
                      </Text>

                      <Text
                        style={{
                          color: "#50C4E9",
                          fontSize: 12,
                          fontFamily: fonts.SemiBold,
                        }}
                        numberOfLines={3}
                      >
                        {item.event_address}
                      </Text>
                      <Text
                        style={{
                          color: colors.gray,
                          fontSize: 12,
                          fontFamily: fonts.Regular,
                          paddingTop: 3,
                        }}
                        numberOfLines={3}
                      >
                        {item.event_description}
                      </Text>

                      <View style={{ flexDirection: "row", marginTop: 10 }}>
                        {item.event_type == 0 ? (
                          <Image
                            style={{
                              resizeMode: "contain",
                              width: 40,
                              height: 40,
                            }}
                            source={require("../../assets/public.png")}
                          />
                        ) : (
                          <Image
                            style={{
                              resizeMode: "contain",
                              width: 40,
                              height: 40,
                            }}
                            source={require("../../assets/private.png")}
                          />
                        )}

                        {item.event_ownership == 1 && (
                          <Image
                            style={{
                              resizeMode: "contain",
                              width: 40,
                              height: 40,
                            }}
                            source={require("../../assets/owner.png")}
                          />
                        )}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          ) : (
            <View style={{ alignSelf: "center" }}>
              <Image
                style={{ height: 180, width: 195 }}
                source={require("../../assets/createEventImage.png")}
              />
              <Text
                style={{
                  fontFamily: fonts.Medium,
                  textAlign: "center",
                  paddingTop: 10,
                }}
              >
                No event created yet
              </Text>
            </View>
          )}
        </View>

        {!this.state.isOpenInvitation && (
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                height: 46,
                width: WINDOW_WIDTH - 60,
                flexDirection: "row",
                alignSelf: "center",

                backgroundColor: "#50C4E9",
                borderRadius: 30,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 110,
              }}
              onPress={() => {
                this.props.navigation.navigate("AddEvent");
              }}
            >
              <Text style={styles.textStyle}>Create an event</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  showGroupImages = (data) => {
    if (data != undefined) {
      console.log("length ", data.length);
      if (data.length >= 5) {
        console.log(">=5");
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
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{ fontFamily: fonts.Bold, fontSize: 13, color: "white" }}
              >{`+${data.length - 5}`}</Text>
            </View>
          </View>
        );
      } else if (data.length >= 4) {
        console.log(">=4");
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
        console.log(">=3");
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
        console.log(">=2");
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
        console.log(">=1");
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
          console.log(">5");
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
                  right: 32,
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
    }
  };

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      this.getAllEvent();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  getAllEvent = () => {
    this.setState({ loading: true });
    var formdata = new FormData();
    formdata.append("token", this.props.userInfo.token);
    postMethod(
      this.props.navigation,
      "myEventList",
      formdata,
      (success) => {
        console.log("myEventList")
        console.log(success)
        this.setState({
          loading: false,
          arrEvent: success.event,
          arrOpenEvent: success.openEvent,
        });
      },
      (error) => {
        this.setState({ loading: false });
        Toast.show(JSON.stringify(error));
      }
    );
  };

  updateEventStatus = (id, status) => {
    this.setState({ loading: true });

    var formdata = new FormData();
    formdata.append("token", this.props.userInfo.token);
    formdata.append("invite_status", status);
    formdata.append("event_id", id);

    postMethod(
      this.props.navigation,
      "UserEventStatus",
      formdata,
      (success) => {
        this.getAllEvent();
      },
      (error) => {
        this.setState({ loading: false });
        Toast.show(JSON.stringify(error));
      }
    );
  };
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.user.userInfo,
  };
};
export default connect(mapStateToProps)(EventsComponent);

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
