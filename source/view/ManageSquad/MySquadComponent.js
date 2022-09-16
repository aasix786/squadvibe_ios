import React, { PureComponent, Component } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  FlatList,
  StatusBar,
  Dimensions,
  Modal,
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
import { ScrollView } from "react-native-gesture-handler";
import LinearGradient from "react-native-linear-gradient";
import Ripple from "react-native-material-ripple";

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
      arrModelArray: [],
      show_color_view: false,
      selected_squad_id: "",
      squad_color: "",
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

  render() {
    const { navigation } = this.props;
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
              <View style={styles.headerButtonsViewStyle}>
                <Ripple
                  rippleCentered={true}
                  rippleContainerBorderRadius={50}
                  style={styles.backButtonStyle}
                  onPress={() => this.props.navigation.goBack()}
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

        <ScrollView style={{ flexGrow: 1, marginTop: 30 }}>
          <FlatList
            style={{ marginTop: 10 }}
            data={this.state.arrSquad}
            keyExtractor={(item) => item.squad_id || Math.random()}
            numColumns={2}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  minHeight: 140,
                  width: WINDOW_WIDTH / 2,
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                }}
                onPress={() => {
                  this.props.navigation.navigate("ManageSquad", {
                    data: item,
                    isFromEditSquad: false,
                  });
                }}
              >
                <View
                  style={{
                    width: 170,
                    borderRadius: 10,
                    backgroundColor: "white",
                    shadowColor: "#000",
                    shadowOffset: { width: 2, height: 2 },
                    shadowOpacity: 0.4,
                    shadowRadius: 3,
                    elevation: 5,
                    margin: 10,
                    alignSelf: "center",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {item.group_member.length === 1 ? (
                    <Image
                      source={{ uri: item.group_member[0].user_image }}
                      style={{
                        height: 132,
                        width: 122,
                        borderRadius: 10,
                        marginTop: 19,
                      }}
                    />
                  ) : item.group_member.length === 2 ? (
                    <View
                      style={{
                        height: 132,
                        width: 122,
                        alignSelf: "center",
                        marginTop: 19,
                      }}
                    >
                      <Image
                        source={{ uri: item.group_member[0].user_image }}
                        style={{
                          height: "50%",
                          width: 122,
                          borderTopLeftRadius: 10,
                          borderTopRightRadius: 10,
                        }}
                      />
                      <View
                        style={{
                          height: 2,
                          width: 122,
                          backgroundColor: "white",
                        }}
                      />
                      <Image
                        source={{ uri: item.group_member[1].user_image }}
                        style={{
                          height: "50%",
                          width: 122,
                          borderBottomLeftRadius: 10,
                          borderBottomRightRadius: 10,
                        }}
                      />
                    </View>
                  ) : item.group_member.length === 3 ? (
                    <View
                      style={{
                        height: 132,
                        width: 122,
                        alignSelf: "center",
                        marginTop: 19,
                      }}
                    >
                      <View style={{ flex: 1, flexDirection: "row" }}>
                        <View style={{ flex: 1 }}>
                          <Image
                            source={{ uri: item.group_member[0].user_image }}
                            style={{
                              height: "100%",
                              width: "100%",
                              borderTopLeftRadius: 10,
                              // borderTopRightRadius: 10,
                            }}
                          />
                        </View>
                        <View
                          style={{
                            height: 66,
                            width: 2,
                            backgroundColor: "white",
                          }}
                        />
                        <View style={{ flex: 1 }}>
                          <Image
                            source={{ uri: item.group_member[1].user_image }}
                            style={{
                              height: "100%",
                              width: "100%",
                              borderTopRightRadius: 10,
                            }}
                          />
                        </View>
                      </View>
                      <View
                        style={{
                          height: 2,
                          width: 122,
                          backgroundColor: "white",
                        }}
                      />
                      <View style={{ flex: 1 }}>
                        <Image
                          source={{ uri: item.group_member[2].user_image }}
                          style={{
                            height: "100%",
                            width: 122,
                            borderBottomLeftRadius: 10,
                            borderBottomRightRadius: 10,
                          }}
                        />
                      </View>
                    </View>
                  ) : item.group_member.length === 4 ? (
                    <View
                      style={{
                        height: 132,
                        width: 122,
                        alignSelf: "center",
                        marginTop: 19,
                      }}
                    >
                      <View style={{ flex: 1, flexDirection: "row" }}>
                        <View style={{ flex: 1 }}>
                          <Image
                            source={{ uri: item.group_member[0].user_image }}
                            style={{
                              height: "100%",
                              width: "100%",
                              borderTopLeftRadius: 10,
                              // borderTopRightRadius: 10,
                            }}
                          />
                        </View>
                        <View
                          style={{
                            height: 66,
                            width: 2,
                            backgroundColor: "white",
                          }}
                        />
                        <View style={{ flex: 1 }}>
                          <Image
                            source={{ uri: item.group_member[1].user_image }}
                            style={{
                              height: "100%",
                              width: "100%",
                              borderTopRightRadius: 10,
                            }}
                          />
                        </View>
                      </View>
                      <View
                        style={{
                          height: 2,
                          width: 122,
                          backgroundColor: "white",
                        }}
                      />
                      <View style={{ flex: 1, flexDirection: "row" }}>
                        <View style={{ flex: 1 }}>
                          <Image
                            source={{ uri: item.group_member[2].user_image }}
                            style={{
                              height: "100%",
                              width: "100%",
                              borderBottomLeftRadius: 10,
                              // borderTopRightRadius: 10,
                            }}
                          />
                        </View>
                        <View
                          style={{
                            height: 66,
                            width: 2,
                            backgroundColor: "white",
                          }}
                        />
                        <View style={{ flex: 1 }}>
                          <Image
                            source={{ uri: item.group_member[3].user_image }}
                            style={{
                              height: "100%",
                              width: "100%",
                              borderBottomRightRadius: 10,
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  ) : (
                    <View
                      style={{
                        height: 132,
                        width: 122,
                        alignSelf: "center",
                        marginTop: 19,
                      }}
                    >
                      <View style={{ flex: 1, flexDirection: "row" }}>
                        <View style={{ flex: 1 }}>
                          <Image
                            source={{ uri: item.group_member[0].user_image }}
                            style={{
                              height: "100%",
                              width: "100%",
                              borderTopLeftRadius: 10,
                              // borderTopRightRadius: 10,
                            }}
                          />
                        </View>
                        <View
                          style={{
                            height: 66,
                            width: 2,
                            backgroundColor: "white",
                          }}
                        />
                        <View style={{ flex: 1 }}>
                          <Image
                            source={{ uri: item.group_member[1].user_image }}
                            style={{
                              height: "100%",
                              width: "100%",
                              borderTopRightRadius: 10,
                            }}
                          />
                        </View>
                      </View>
                      <View
                        style={{
                          height: 2,
                          width: 122,
                          backgroundColor: "white",
                        }}
                      />
                      <View style={{ flex: 1, flexDirection: "row" }}>
                        <View style={{ flex: 1 }}>
                          <Image
                            source={{ uri: item.group_member[2].user_image }}
                            style={{
                              height: "100%",
                              width: "100%",
                              borderBottomLeftRadius: 10,
                            }}
                          />
                        </View>
                        <View
                          style={{
                            height: 66,
                            width: 2,
                            backgroundColor: "white",
                          }}
                        />
                        <View style={{ flex: 1 }}>
                          <Image
                            source={{ uri: item.group_member[3].user_image }}
                            style={{
                              height: "100%",
                              width: "100%",
                              borderBottomRightRadius: 10,
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  )}

                  <Text
                    style={{
                      marginTop: 13,
                      fontSize: 14,
                      fontFamily: fonts.Medium,
                      color: "black",
                      paddingBottom: 15,
                    }}
                    numberOfLines={1}
                  >
                    {item.squad_name}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => {
              return (
                <View
                  style={{
                    height: WINDOW_WIDTH * 1.5,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontFamily: fonts.Medium, fontSize: 17 }}>
                    No squad created yet
                  </Text>
                </View>
              );
            }}
          />
        </ScrollView>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            this.props.navigation.navigate("InviteSinglePerson", {
              isFromContact: true,
              group_member: this.state.group_member,
              isFromMySquad: this.state.isFromMySquad,
              squad_id: this.state.squad_id,
              isFromAddFriend: false,
              friends: [],
            });
          }}
        >
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={["#38A5CA", "#54C8EE"]}
            style={styles.linearGradient}
          >
            <Text style={styles.textStyle}>Create Squad</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Loader loading={this.state.loading} />

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.show_color_view}
          onRequestClose={() => {
            this.setState({ show_color_view: !this.state.show_color_view });
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              backgroundColor: "rgba(52, 52, 52, 0.8)",
            }}
          >
            <TouchableOpacity
              style={{
                marginTop: 0,
                marginHorizontal: 20,
                alignSelf: "flex-end",
              }}
              onPress={() =>
                this.setState({ show_color_view: !this.state.show_color_view })
              }
            >
              <Image source={require("../../assets/vross_white_ic.png")} />
            </TouchableOpacity>
            <View style={{ flex: 2 }}>
              <ColorPicker
                onColorSelected={(color) => alert(`Color selected: ${color}`)}
                onColorChange={(squad_color) => {
                  this.setState({ squad_color: fromHsv(squad_color) });
                }}
                style={{ flex: 1, paddingBottom: 100, paddingHorizontal: 20 }}
              />

              <TouchableOpacity
                style={styles.modelBottomView}
                activeOpacity={0.5}
                onPress={() => {
                  this.setState({
                    show_color_view: !this.state.show_color_view,
                  });
                  this.updateCardColor(
                    this.state.selected_squad_id,
                    this.state.squad_color
                  );
                }}
              >
                <Text style={styles.textStyle}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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

  getDate = (fullDate) => {
    const month = this.getMonth(parseInt(fullDate.slice(5, 7)));
    const date = fullDate.slice(8, 10);
    return date + "-" + month;
  };

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

  getMySquad = () => {
    this.setState({ loading: true });
    var formdata = new FormData();
    formdata.append("token", this.props.userInfo.token);

    ApiHelper.post("squadList", formdata)
      .then((response) => {
        console.log("response squadList")
        console.log(response.data)
        this.setState({ loading: false });
        if (response.status == 200) {
          if (response.data.status == "SUCCESS") {
            if (response.data.hasOwnProperty("squadList")) {
              // console.log("ALL SQUADS", response.data.squadList[0].request);
              this.setState({
                arrSquad: response.data.squadList,
              });
              console.log("response.data.squadList", response.data.squadList);
            }
          } else {
            if (response.data.requestKey) {
              Toast.show(response.data.requestKey);
            }

            if (response.data.is_token_expired == 1) {
              this.props.resetData("");
              resetStackAndNavigate(this.props.navigation, "Login");
            }
          }
        }
      })
      .catch((error) => {
        console.log("error")
        console.log(error)
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

    console.log("Param ", formdata);

    ApiHelper.post("updateSquadColor", formdata)
      .then((response) => {
        console.log("response ", response);
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
  bottomView: {
    flexDirection: "row",
    width: 42,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  textStyle: {
    color: "black",
    fontSize: 30,
    fontFamily: fonts.Bold,
    textAlign: "center",
  },
  textInputStype: {
    height: 50,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
  },
  modelBottomView: {
    flexDirection: "row",
    height: 50,
    backgroundColor: "#00A551",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    marginTop: 50,
    right: 16,
    left: 16,
    borderRadius: 25,
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
