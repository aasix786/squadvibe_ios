import React, { PureComponent, Component } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  SafeAreaView,
  FlatList,
  Dimensions,
  StatusBar,
  Alert,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { colors, fonts, SCREEN_SIZE } from "../../common/colors";
import { Button } from "react-native-elements";
import { Icon } from "react-native-elements";
import { postMethod } from "../../Networking/APIModel";
import Toast from "react-native-simple-toast";
import moment from "moment";
import { connect } from "react-redux";
import Header from "../components/header";
import LinearGradient from "react-native-linear-gradient";
import Ripple from "react-native-material-ripple";

const WINDOW_WIDTH = Dimensions.get("window").width;

class ShuffleModeComponent extends PureComponent {
  constructor() {
    super();
    this.state = {
      code: "",
      isCheck: false,
      birthDate: "",
      images: [
        "ic_user_1.jpg",
        "ic_user_2.jpg",
        "ic_user_3.jpg",
        "ic_user_4.jpg",
      ],
      selectedIndex: -1,
      arrInterest: ["Drinking", "Playing games"],
      arrEvent: [],
      loading: false,
      isFromChat: false,
      selectedIndex: -1,
      message: "",
      chatRoomId: "",
    };
  }

  getMonth(value) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[value - 1];
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
                  Share Events
                </Text>
              </View>
              <View style={styles.headerButtonsViewStyle} />
            </View>
          </View>
        </View>

        <View style={{ flex: 2, marginTop: 10 }}>
          {this.state.arrEvent ? (
            <FlatList
              style={{ marginTop: 10 }}
              data={this.state.arrEvent}
              keyExtractor={(index) => index.event_id}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={{
                    height: 180,
                    width: WINDOW_WIDTH - 30,
                    alignSelf: "center",
                    backgroundColor: colors.white,
                    elevation: 5,
                    borderRadius: 10,
                    shadowColor: "gray",
                    shadowOffset: {
                      width: 0,
                      height: 7,
                    },
                    shadowOpacity: 0.43,
                    shadowRadius: 5.51,
                    marginBottom: 15,
                    flexDirection: "row",
                    // alignItems: "center",
                  }}
                  activeOpacity={0.8}
                  onPress={() =>
                    this.props.navigation.navigate("Chat", {
                      eventData: item,
                      isFromShare: true,
                    })
                  }
                >
                  <Image
                    style={{
                      height: 160,
                      width: 120,
                      margin: 15,
                      borderRadius: 10,
                      alignSelf: "center",
                    }}
                    source={{ uri: item.event_image }}
                  />

                  <View style={{ marginLeft: 5, justifyContent: "flex-start" }}>
                    <View style={{ height: 6 }} />
                    <Text
                      style={{
                        color: colors.themeColor,
                        fontSize: 15,
                        fontFamily: fonts.Bold,
                      }}
                    >
                      {item.event_title}
                    </Text>

                    <View style={{ flexDirection: "row" }}>
                      <Image
                        style={{ height: 12, width: 12, marginTop: 5 }}
                        source={require("../../assets/marker.png")}
                      />
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: "BeVietnam-SemiBold",
                          color: "#38A5CA",
                          paddingLeft: 5,
                          width: WINDOW_WIDTH - 250,
                        }}
                        numberOfLines={2}
                      >
                        {item.event_address}
                      </Text>
                    </View>

                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: "BeVietnam-SemiBold",
                        color: "#A3A8B8",
                        width: WINDOW_WIDTH - 250,
                        paddingTop: 3,
                        paddingBottom: 3,
                      }}
                      numberOfLines={2}
                    >
                      {item.event_description}
                    </Text>
                    <Text style={{ fontSize: 11, color: "#666666" }}>
                      <Text>
                        {moment(item.event_date, "YYYY/MM/DD").format("DD")}
                      </Text>
                      <View style={{ width: 3 }} />
                      <Text>
                        {this.getMonth(
                          moment(item.event_date, "YYYY/MM/DD").format("MM")
                        )}
                      </Text>
                      <View style={{ width: 5 }} />
                      <Text style={{ paddingLeft: 5 }}>
                        {item.event_time.slice(0, 5)}
                      </Text>
                    </Text>
                  </View>

                  {this.state.isFromChat ? (
                    <Text
                      style={{
                        right: 8,
                        position: "absolute",
                        alignSelf: "flex-end",
                        color: colors.white,
                        fontSize: 17,
                        fontFamily: fonts.Bold,
                      }}
                      onPress={() => {
                        this.setState({
                          selectedIndex:
                            this.state.selectedIndex == -1 ? index : -1,
                        });
                      }}
                    >
                      {"..."}
                    </Text>
                  ) : null}

                  {this.state.selectedIndex === index ? (
                    <View
                      style={{
                        position: "absolute",
                        right: 0,
                        marginTop: 25,
                        marginRight: 12,
                        width: 100,
                        height: 40,
                        backgroundColor: "white",
                        borderRadius: 3,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({ selectedIndex: -1 });
                          var message = this.state.message;
                          message.event_title = item.event_title;
                          message.event_address = item.event_address;
                          message.event_date = moment(
                            item.event_date,
                            "YYYY/MM/DD"
                          ).format("DD/MM/YYYY");
                          message.event_data = item;
                          message.time = moment().unix();
                          this.sendMessage(message);
                        }}
                        style={{
                          height: "100%",
                          borderBottomWidth: 1,
                          borderBottomColor: "#D8D8D8",
                          flexDirection: "row",
                          alignItems: "center",
                          paddingHorizontal: 12,
                        }}
                      >
                        <Image
                          source={require("../../assets/change_color_ic.png")}
                        />
                        <Text
                          style={{
                            marginLeft: 8,
                            fontSize: 14,
                            fontFamily: fonts.Medium,
                            color: colors.headingTextColor,
                          }}
                        >
                          Share
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </TouchableOpacity>
              )}
            />
          ) : (
            <View
              style={{
                height: SCREEN_SIZE.SCREEN_HEIGHT / 2,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontFamily: fonts.Medium, fontSize: 17 }}>
                No event created yet
              </Text>
            </View>
          )}
        </View>
        {/* <Loader loading={this.state.loading} /> */}
      </View>
    );
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      if (this.props.route.params != undefined) {
        const { message, chatRoomId, isFromChat } = this.props.route.params;
        this.setState({
          isFromChat: isFromChat,
          message: message == undefined ? "" : message,
          chatRoomId: chatRoomId == undefined ? "" : chatRoomId,
        });
      }
      this.setState({ selectedIndex: -1 });
      this.getAllEvent();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  getAllEvent = () => {
    this.setState({ loading: true });
    var formdata = new FormData();
    // formdata.append("token", "9E9yq8ylQNvxyVQrkNcl");
    formdata.append("token", this.props.userInfo.token);
    formdata.append("event_mode", 1);
    postMethod(
      this.props.navigation,
      "eventList",
      formdata,
      (success) => {
        if (success.event) {
          const suffleModeEvent = success.event.filter(
            (data) => data.event_mode == 1
          );
          this.setState({
            loading: false,
            arrEvent: suffleModeEvent,
          });
        }
      },
      (error) => {
        this.setState({ loading: false });
        // Toast.show(JSON.stringify(error))
      }
    );
  };

  showGroupImages = (data) => {
    if (data != undefined) {
      if (data.length >= 5) {
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
}
const mapStateToProps = (state) => {
  return {
    userInfo: state.user.userInfo,
  };
};
export default connect(mapStateToProps)(ShuffleModeComponent);

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
