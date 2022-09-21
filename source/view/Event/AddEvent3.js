import React, { PureComponent, Component } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  Dimensions,
  StatusBar,
} from "react-native";
import { colors, fonts, SCREEN_SIZE } from "../../common/colors";
import moment, { duration } from "moment";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { postMethod } from "../../Networking/APIModel";
import Toast from "react-native-simple-toast";
import { connect } from "react-redux";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, {
  MarkerAnimated,
  PROVIDER_GOOGLE,
  MapViewAnimated,
} from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import Header from "../components/header";
import Button from "../components/button";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import Entypo from "react-native-vector-icons/Entypo";
import axios from "axios";
import LinearGradient from "react-native-linear-gradient";
import Ripple from "react-native-material-ripple";

const WINDOW_WIDTH = Dimensions.get("window").width;

class AddEventComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      isCheck: false,
      images: [""],
      selectedIndex: 1,
      isPickerVisible: false,
      eventTime: "",
      filePath: "",
      event_type: 0,
      addPeopleInChat: true,
      imageResponse: "",
      selected_number_of_participant: "",
      invite_friend: [],
      invite_squad: [],
      mode_type: 1,
      add_to_people_group_chat: true,
      loading: false,
      modalVisible: false,
      showInput: false,
      // minAge: 20,
      maxAge: "",
      arrSomeOneBrings: [],
      // some_one_bring: '',
      showUsername: false,
      showAddress: false,
      ageRange: 20,
      some_one_bring: [""],
      multiSliderValue: [20, 50],
      addpeople: 1
    };
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  setAnswer = (val, index) => {
    console.log("VAL", index);
    const dupAnswers = [...this.state.some_one_bring];
    dupAnswers[index] = val;
    this.setState({ some_one_bring: dupAnswers });
  };

  componentDidMount() {
    console.log("Event 3")
    console.log("this.props.route.params")

    console.log(this.props.route.params)
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      if (this.props.route.params !== undefined) {
        if (this.props.route.params.hasOwnProperty("squadIds")) {
          const { squadIds } = this.props.route.params;
          this.setState({
            invite_squad: squadIds,
          });
        }

        if (this.props.route.params.hasOwnProperty("friendsId")) {
          const { friendsId } = this.props.route.params;
          this.setState({
            invite_friend: friendsId,
          });
        }
      }

      // this.showLocationOnMap()
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  multiSliderValuesChange = (values) => {
    console.log(values);
    this.setState({ multiSliderValue: values });
  };

  removeAns = (index) => {
    console.log(index);
    const dupAnswers = [...this.state.some_one_bring];
    dupAnswers.splice(index, 1);
    console.log(dupAnswers);
    this.setState({ some_one_bring: dupAnswers });
  };

  updateCheck = () => {
    this.setState({ addPeopleInChat: !this.state.addPeopleInChat });
    // let check_box = this.state.addpeople
    // if (this.state.addpeople) {
    //   check_box = 0
    //   this.setState({ addpeople: check_box })
    //   console.log("check_box1")
    //   console.log(this.state.addpeople)
    // }
    // else {
    //   check_box = 1

    //   this.setState({ addpeople: check_box })
    //   console.log("check_box0")
    //   console.log(this.state.addpeople)

    // }
  }
  render() {
    const userInfo = {
      user_name: "",
    };

    // console.log("ANSSS", this.state.some_one_bring);

    const multiSliderValue = this.state.multiSliderValue;
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
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
                    style={{ width: 21, height: 21 }}
                    resizeMode={"contain"}
                  />
                </Ripple>
              </View>
            </View>
          </View>
        </View>
        <ScrollView style={{ flexGrow: 1 }}>
          <View
            style={{
              backgroundColor: "white",
              height: 100,
              width: WINDOW_WIDTH - 60,
              alignSelf: "center",
              justifyContent: "center",
              marginTop: 20,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  width: WINDOW_WIDTH - 60,
                  alignSelf: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      color: "black",
                      fontSize: 16,
                      paddingBottom: 8,
                      fontWeight: "bold",
                    }}
                  >
                    Age range
                  </Text>
                  <Text
                    style={{
                      color: "black",
                      fontSize: 14,
                      paddingTop: 7,
                    }}
                  >
                    {parseInt(this.state.multiSliderValue[0])}-
                    {parseInt(this.state.multiSliderValue[1])}
                  </Text>
                </View>
                <View style={{ width: "100%" }}>
                  <MultiSlider
                    markerStyle={{
                      ...Platform.select({
                        ios: {
                          height: 18,
                          width: 18,
                          shadowColor: "#000000",
                          shadowOffset: {
                            width: 0,
                            height: 3,
                          },
                          shadowRadius: 1,
                          shadowOpacity: 0.1,
                        },
                        android: {
                          height: 18,
                          width: 18,
                          borderRadius: 50,
                          backgroundColor: "#50C4E9",
                        },
                      }),
                    }}
                    pressedMarkerStyle={{
                      ...Platform.select({
                        android: {
                          height: 18,
                          width: 18,
                          borderRadius: 20,
                          backgroundColor: "#50C4E9",
                        },
                      }),
                    }}
                    selectedStyle={{
                      backgroundColor: "#50C4E9",
                      height: 4,
                      borderRadius: 10,
                    }}
                    trackStyle={{
                      backgroundColor: "#DBDBDB",
                      height: 4,
                      borderRadius: 10,
                    }}
                    touchDimensions={{
                      height: 40,
                      width: 40,
                      borderRadius: 20,
                      slipDisplacement: 40,
                    }}
                    values={[multiSliderValue[0], multiSliderValue[1]]}
                    sliderLength={WINDOW_WIDTH - 60}
                    onValuesChange={this.multiSliderValuesChange}
                    min={16}
                    max={100}
                    allowOverlap={false}
                    minMarkerOverlapDistance={10}
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={{ marginHorizontal: 30 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                marginVertical: 20,
                color: "black",
              }}
            >
              Event Type
            </Text>

            <TouchableOpacity
              onPress={() => this.setState({ event_type: 0 })}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              {this.state.event_type == 0 ? (
                <Image
                  style={{
                    resizeMode: "contain",
                    height: 30,
                    width: 30,
                    marginRight: 15,
                  }}
                  source={require("../../assets/eple-02.png")}
                />
              ) : (
                <Image
                  style={{
                    resizeMode: "contain",
                    height: 30,
                    width: 30,
                    marginRight: 15,
                  }}
                  source={require("../../assets/eple-03.png")}
                />
              )}
              <Text>Public Event</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.setState({ event_type: 1 })}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              {this.state.event_type == 1 ? (
                <Image
                  style={{
                    resizeMode: "contain",
                    height: 30,
                    width: 30,
                    marginRight: 15,
                  }}
                  source={require("../../assets/eple-02.png")}
                />
              ) : (
                <Image
                  style={{
                    resizeMode: "contain",
                    height: 30,
                    width: 30,
                    marginRight: 15,
                  }}
                  source={require("../../assets/eple-03.png")}
                />
              )}
              <Text>Private Event</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => this.setState({ showInput: true })}
            style={{
              height: 56,
              width: WINDOW_WIDTH - 60,
              alignSelf: "center",
              borderRadius: 10,
              backgroundColor: "white",
              flexDirection: "row",
              shadowColor: "#000",
              shadowOffset: { width: 2, height: 2 },
              shadowOpacity: 0.4,
              shadowRadius: 3,
              elevation: 5,
              alignItems: "center",
              marginTop: 30,
              marginBottom: 20,
            }}
          >
            <Image
              style={{
                width: 23,
                height: 23,
                resizeMode: "contain",
                marginLeft: 15,
              }}
              source={require("../../assets/eventTitleIcon.png")}
            />

            <View style={{ marginLeft: 15, flex: 1 }}>
              <Text
                style={{
                  color: "black",
                  fontSize: 14,
                  fontWeight: "bold",
                  //   marginBottom: 6,
                }}
              >
                Some One Bring
              </Text>
              <Text style={{ fontSize: 12, color: "black" }}>
                Some One Bring
              </Text>
            </View>

            <Image
              style={{ height: 16, width: 16, marginRight: 15 }}
              source={require("../../assets/arrowRight.png")}
            />
          </TouchableOpacity>

          {/* ////// */}
          {this.state.showInput && (
            <>
              <View style={{ width: "100%" }}>
                {this.state.some_one_bring.map((elem, index) => {
                  return (
                    <View
                      style={{
                        marginHorizontal: 20,
                        marginTop: 10,
                        position: "relative",
                        alignItems: "flex-end",
                        width: WINDOW_WIDTH - 60,
                        alignSelf: "center",
                      }}
                    >
                      <View
                        style={{
                          shadowColor: "gray",
                          width: "100%",
                          shadowOffset: {
                            width: 0,
                            height: 7,
                          },
                          shadowOpacity: 0.23,
                          elevation: 7,
                          shadowRadius: 5.51,
                          flex: 1,
                        }}
                      >
                        <TextInput
                          onChangeText={(text) => this.setAnswer(text, index)}
                          value={this.state.some_one_bring[index]}
                          placeholder={`Item ${index + 1}`}
                          style={{
                            width: "100%",
                            marginTop: 15,
                            // flex:1,
                            // zIndex:0,
                            backgroundColor: "white",
                            borderRadius: 10,
                            borderWidth: 1,
                            height: 60,
                            paddingHorizontal: 15,
                            fontSize: 16,
                          }}
                        />
                        {index !== 0 && (
                          <TouchableOpacity
                            style={{ position: "absolute", right: 10, top: 30 }}
                            onPress={() => this.removeAns(index)}
                          >
                            <Entypo color="gray" name="cross" size={25} />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
              <View style={{ alignItems: "center" }}>
                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      some_one_bring: [...this.state.some_one_bring, ""],
                    })
                  }
                  activeOpacity={0.6}
                  style={{
                    backgroundColor: colors.GRAY,
                    padding: 10,
                    width: 140,
                    borderRadius: 20,
                    alignItems: "center",
                    marginVertical: 20,
                  }}
                >
                  <Text style={{ textAlign: "center", color: colors.white }}>
                    Add
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          <View style={{ marginHorizontal: 30, marginTop: 15, paddingBottom: 120 }}>


            <TouchableOpacity
              onPress={() => this.updateCheck()}
              style={{ flexDirection: "row", alignItems: "center", width: "80%" }}
            >
              {this.state.addPeopleInChat == true? (
                <Image
                  style={{
                    resizeMode: "contain",
                    height: 30,
                    width: 30,
                    marginRight: 15,
                  }}
                  source={require("../../assets/eple-02.png")}
                />
              ) : (
                <Image
                  style={{
                    resizeMode: "contain",
                    height: 30,
                    width: 30,
                    marginRight: 15,
                  }}
                  source={require("../../assets/eple-03.png")}
                />
              )}
              <Text>Add People To group chat who join the event </Text>
            </TouchableOpacity>


          </View>
          {/* //////// */}
        </ScrollView>

        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            height: 46,
            width: WINDOW_WIDTH - 60,
            flexDirection: "row",
            alignSelf: "center",

            backgroundColor: "#50C4E9",
            borderRadius: 30,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 10,
          }}
          onPress={() => this.props.navigation.reset({
            index: 0,
            routes: [{ name: "HomeTab" }],
          })}
        >
          <Text style={styles.textStyle}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            height: 46,
            width: WINDOW_WIDTH - 60,
            flexDirection: "row",
            alignSelf: "center",

            backgroundColor: "#50C4E9",
            borderRadius: 30,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 30,
          }}
          onPress={() => this.validation()}
        >
          <Text style={styles.textStyle}>Create event</Text>
        </TouchableOpacity>
      </View>
    );
  }

  validation = () => {
    const { title, address, date, details, friend, squad } =
      this.props.route.params;
    console.log("title", title, address, date, details);

    if (!title) {
      Toast.show("Please enter event title");
      return;
    } else if (!address) {
      Toast.show("Please enter address");
      return;
    } else if (!date) {
      Toast.show("Please select date");
      return;
    } else if (!details) {
      Toast.show("Please enter details");
      return;
    }
    else if (this.props.route.params.participants_limit.trim().length == 0) {
        Toast.show('Please enter number of participant')
        return
    }
    // else if (this.state.invite_friend.length == 0) {
    //     Toast.show('Please add perticipant')
    //     return
    // }
    else if (this.state.mode_type == 0) {
      Toast.show("Please select event mode");
      return;
    } else {
      // Add event call
      // Toast.show('event added succfully')
      let error = false;
      this.state.some_one_bring.forEach((elem, index) => {
        if (!elem && index !== 0) {
          error = true;
        }
      });
      if (error) {
        Toast.show("Missing fields are there.");
      } else {
        this.callAddEventApi();
      }
    }
  };

  joinEvent = (item) => {
    console.log("ITEMM", item);
    if (item.expired == 1) {
      Toast.show("This event is expired, You can't join");
      return;
    } else if (item.joined == 1) {
      Toast.show("You are already in Event");
      return;
    }

    // const parameter = new FormData()
    // parameter.append('token', this.props.userInfo.token)
    // parameter.append('event_id', item.message)

    // axios.post('http://squadvibes.onismsolution.com/api/JoinEvent', parameter)
    // .then(res => {
    // const dupMsgs = this.state.messages.map(elem => {
    //     const obj = {...elem}
    //     if(elem.message === item.message){
    //     obj.joined = 1
    //     return obj
    //     }
    //     return elem
    // })

    // this.setState({ messages : dupMsgs })
    // Toast.show('Joined in the event.')
    // })
    // .catch( err => {
    // console.log("JOIN ERR", err);
    // })
  };

  callAddEventApi = async () => {
    const { title, address, date, details, latitude, longitude,friend, squad, eventImg } =
      this.props.route.params;
    console.log("latitude ", latitude);
    console.log("longitude ", longitude);

    const friends = friend.map((elem) => elem.id);
    const squads = squad.map((elem) => elem.squad_id);

    // console.log("friends ", friends);
    // console.log("squad ", squads);
    // console.log("eventDate ", eventDate);

    var formdata = new FormData();
    formdata.append("token", this.props.userInfo.token);
    formdata.append("event_title", title);
    formdata.append("event_address", address);
   
    // formdata.append("event_date", "2021-07-30");
    const eventDate = moment(date, "DD/MM/YYYY").format("YYYY-MM-DD");
    const eventTime = moment(date, "DD/MM/YYYY hh:mm A").format("HH:MM:SS");
    formdata.append("event_date", eventDate);
    formdata.append("event_time", eventTime);
    formdata.append("event_description", details);
    formdata.append(
      "participants_limit",
      this.props.route.params.participants_limit
    );
    formdata.append("lats",latitude);
    formdata.append("longs", longitude);
    formdata.append("event_mode", this.state.mode_type);
    formdata.append("event_mode", this.state.mode_type);
    formdata.append("event_type", this.state.event_type);

    formdata.append("event_participant", this.state.invite_friend.join(",")); //- need to discuss with Praveen
    formdata.append("invite_squad", squads.join(","));
    formdata.append("invite_user", friends.join(","));
    formdata.append(
      "event_chat_enabled",
      this.state.add_to_people_group_chat ? 1 : 0
    );

    formdata.append("min_age", String(this.state.multiSliderValue[0]));
    formdata.append("max_age", String(this.state.multiSliderValue[1]));
    formdata.append("someone_bring", this.state.some_one_bring.join(","));
    formdata.append("event_image", eventImg);
    console.log("Create Event")
    console.log(formdata)
    postMethod(
      null,
      "createEvent",
      formdata,
      (success) => {
        console.log("success")
        console.log(success)
        console.log("postMethod success", success.createEvent.event_id);
        this.props.navigation.reset({
          index: 0,
          routes: [{ name: "HomeTab" }],
        });
        // this.joinEvent(success.createEvent.event_id)
      },
      (error) => {
        Toast.show( error.message);
      }
    );
  };
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.user.userInfo,
  };
};
export default connect(mapStateToProps)(AddEventComponent);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
    position: "absolute",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
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

export function getAddressComponent(address_components, key) {
  var value = "";
  var postalCodeType = address_components.filter((aComp) =>
    aComp.types.some((typesItem) => typesItem === key)
  );
  if (postalCodeType != null && postalCodeType.length > 0)
    value = postalCodeType[0].long_name;
  return value;
}
