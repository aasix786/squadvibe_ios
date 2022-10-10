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
  StatusBar,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { colors, fonts } from "../../common/colors";
import DateTimePickerModal from "react-native-modal-datetime-picker";
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
import Header from "../components/header";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Button from "../components/button";
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
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
      eventDate: "",
      eventTime: moment().format("hh:mm A"),
      filePath: "",
      imageResponse: "",
      selected_number_of_participant: false,
      title: "",
      address: "",
      details: "",
      participants_limit: "",
      // invite_friend: [{full_name:'baajs  das d'},{full_name:'baajs  das d'},{full_name:'baajs  das d'},{full_name:'baajs  das d'},{full_name:'baajs  das d'}],
      invite_friend: [],
      invite_squad: [],
      mode_type: 1,
      add_to_people_group_chat: false,
      loading: false,
      location: {
        latitude: 37.78825,
        longitude: -122.4324,
      },
      modalVisible: false,
      minAge: "",
      maxAge: "",
      arrSomeOneBrings: [],
      some_one_bring: "",
      showUsername: false,
      showAddress: false,
      time: false,
      date: false,
      sex: "",
    };
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  componentDidMount() {
    console.log("Event 2")
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

        if (this.props.route.params.hasOwnProperty("data")) {
          const { data } = this.props.route.params;
          // console.log("GET PARAMS", this.props.route.params.data);
          const setData = data.filter((props) => {
            let found = false;
            this.state.invite_friend.forEach((state) => {
              if (state.id === props.id) {
                found = true;
              }
            });
            return !found;
          });
          this.setState({
            invite_friend: [...setData, ...this.state.invite_friend],
          });
        }

        if (this.props.route.params.hasOwnProperty("squads")) {
          const { squads } = this.props.route.params;
          console.log("GET squads", squads.length, squads);

          const setData = squads.filter((props) => {
            let found = false;
            this.state.invite_squad.forEach((state) => {
              if (state.squad_id === props.squad_id) {
                found = true;
              }
            });
            return !found;
          });
          this.setState({
            invite_squad: [...setData, ...this.state.invite_squad],
          });

          // console.log("SQUAD IDS", squads);
          // console.log("this.state.invite_squad", this.state.invite_squad);
          // this.setState({
          //     invite_squad: [...squads, ...this.state.invite_squad]
          // })
        }
      }

      this.showLocationOnMap();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }



  deleteSquad = (id, index) => {
    const interest = [...this.state.invite_squad];
    interest.splice(index, 1);
    this.setState({ invite_squad: interest });
  };
  deletePerson = (id, index) => {
    const interest = [...this.state.invite_friend];
    interest.splice(index, 1);
    this.setState({ invite_friend: interest });
  };

  render() {
    console.log("eventTime")
    console.log(this.state.eventTime)
    const userInfo = {
      user_name: "",
    };
    let sex = [

      { label: ('Just Upon Request'), value: ('1') },
      { label: ('Not Show any where just show an invitation'), value: ('2') },
    ];
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <>
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
          <ScrollView style={{ marginTop: 30, flexGrow: 1 }}>
            {this.state.date ? (
              <View style={{ marginHorizontal: 10 }}>
                <View
                  style={{
                    alignContent: "center",
                    alignItems: "center",
                    padding: 10,
                    borderRadius: 50,
                    flexDirection: "row",
                  }}
                >
                  <TextInput
                    value={this.state.eventDate}
                    onPressIn={() => this.setState({ isDateVisible: true })}
                    style={styles.inputStyle}
                    autoCorrect={false}
                    placeholder="Date"
                    placeholderTextColor="#8D8B82"
                    onChangeText={(user_name) => this.setState({ user_name })}
                  />
                </View>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() =>
                  this.setState({ date: true, isDateVisible: true, showAddress: false, selected_number_of_participant:false })
                }
                style={{
                  marginTop: 20,
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
                }}
              >
                <Image
                  style={{
                    width: 23,
                    height: 23,
                    resizeMode: "contain",
                    marginLeft: 15,
                  }}
                  source={require("../../assets/eventLocationIcons.png")}
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
                    Date
                  </Text>
                  <Text style={{ color: "black", fontSize: 12 }}>
                    {this.state.eventDate ? this.state.eventDate : "Add date?"}
                  </Text>
                </View>

                <Image
                  style={{ height: 16, width: 16, marginRight: 15 }}
                  source={require("../../assets/arrowRight.png")}
                />
              </TouchableOpacity>
            )}

            {/* {this.state.time ? (
              <View style={{ marginHorizontal: 10, marginTop: 15 }}>
                <View
                  style={{
                    alignContent: "center",
                    alignItems: "center",
                    padding: 10,
                    borderRadius: 50,
                    flexDirection: "row",
                  }}
                >
                  <TextInput
                    value={this.state.eventTime}
                    onPressIn={() =>
                      this.setState({ time: true, isTimeVisible: true })
                    }
                    style={styles.inputStyle}
                    autoCorrect={false}
                    placeholder="Time"
                    placeholderTextColor="#8D8B82"
                    onChangeText={(user_name) => this.setState({ user_name })}
                  />
                </View>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() =>
                  this.setState({ time: true, isTimeVisible: true })
                }
                style={{
                  marginTop: 20,
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
                }}
              >
                <Image
                  style={{
                    width: 23,
                    height: 23,
                    resizeMode: "contain",
                    marginLeft: 15,
                  }}
                  source={require("../../assets/eventLocationIcons.png")}
                />

                <View style={{ marginLeft: 15, flex: 1 }}>
                  <Text
                    style={{
                      color: "black",
                      fontSize: 14,
                      fontWeight: "bold",
                    }}
                  >
                    Time
                  </Text>
                  <Text style={{ color: "black", fontSize: 12 }}>Add time</Text>
                </View>

                <Image
                  style={{ height: 16, width: 16, marginRight: 15 }}
                  source={require("../../assets/arrowRight.png")}
                />
              </TouchableOpacity>
            )} */}

            {this.state.showAddress ? (
              <View style={{ marginHorizontal: 10 }}>
                <View
                  style={{
                    alignContent: "center",
                    alignItems: "center",
                    padding: 10,
                    borderRadius: 50,
                    flexDirection: "row",
                  }}
                >
                  <TextInput
                    defaultValue={userInfo.user_name}
                    style={styles.inputDetail}
                    autoCorrect={false}
                    multiline={true}
                    placeholder="Details"
                    placeholderTextColor="#8D8B82"
                    onChangeText={(details) => this.setState({ details })}
                  />
                </View>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => this.setState({ showAddress: true, date:false, selected_number_of_participant:false })}
                style={{
                  marginTop: 20,
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
                }}
              >
                <Image
                  style={{
                    width: 23,
                    height: 23,
                    resizeMode: "contain",
                    marginLeft: 15,
                  }}
                  source={require("../../assets/eventLocationIcons.png")}
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
                    Details
                  </Text>
                  <Text style={{ color: "black", fontSize: 12 }}>
                    {this.state.details ? this.state.details : "Write Here"}
                  </Text>
                </View>

                <Image
                  style={{ height: 16, width: 16, marginRight: 15 }}
                  source={require("../../assets/arrowRight.png")}
                />
              </TouchableOpacity>
            )}
            {this.state.selected_number_of_participant ? (
              <View style={{ marginHorizontal: 10 }}>
                <View
                  style={{
                    alignContent: "center",
                    alignItems: "center",
                    padding: 10,
                    borderRadius: 50,
                    flexDirection: "row",
                  }}
                >
                  <TextInput
                    defaultValue={userInfo.user_name}
                    style={styles.inputStyle}
                    keyboardType="number-pad"
                    autoCorrect={false}
                    placeholder="Participants limit"
                    placeholderTextColor="#8D8B82"
                    onChangeText={(participants_limit) => this.setState({ participants_limit })}
                  />
                </View>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => this.setState({ selected_number_of_participant: true,showAddress: false, date:false })}
                style={{
                  marginTop: 20,
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
                }}
              >
                <Image
                  style={{
                    width: 23,
                    height: 23,
                    resizeMode: "contain",
                    marginLeft: 15,
                  }}
                  source={require("../../assets/eventLocationIcons.png")}
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
                    Participants_limit
                  </Text>
                  <Text style={{ color: "black", fontSize: 12 }}>
                    {this.state.participants_limit ? this.state.participants_limit : "Write Here"}
                  </Text>
                </View>

                <Image
                  style={{ height: 16, width: 16, marginRight: 15 }}
                  source={require("../../assets/arrowRight.png")}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("AddSquad", {
                  isFromAddEvent: true,
                  invite_squad: this.state.invite_squad,
                  title: this.props.route.params.title,
                  address: this.props.route.params.address,
                  latitude: this.props.route.params.latitude,
                  longitude: this.props.route.params.longitude,
                })
              }
              style={{
                display: "flex",
                elevation: 4,
                padding: 20,
                borderRadius: 10,
                backgroundColor: "#50C4E9",
                shadowColor: "gray",
                shadowOffset: {
                  width: 2,
                  height: 2,
                },
                shadowOpacity: 0.9,
                shadowRadius: 3,
                marginTop: 20,
                flexDirection: "row",
                marginHorizontal: 20,
                justifyContent: "center",
                alignItems: "center",
                width: WINDOW_WIDTH - 60,
                alignSelf: "center",
              }}
            >
              <Image
                style={{ width: 24, height: 24, resizeMode: "contain" }}
                source={require("../../assets/mySquad.png")}
              />

              <View style={{ marginLeft: 15 }}>
                <Text
                  style={{
                    color: "white",
                    fontSize: 14,
                  }}
                >
                  Invite Squad
                </Text>
              </View>
            </TouchableOpacity>

            {this.state.invite_squad.length ? (
              <View
                style={{
                  flexDirection: "row",
                  marginVertical: 10,
                  paddingHorizontal: 20,
                  flex: 1,
                  flexWrap: "wrap",
                }}
              >
                {this.state.invite_squad.map((interestData, index) => {
                  return (
                    <View style={{ position: "relative" }}>
                      <View
                        style={{
                          position: "absolute",
                          right: 2,
                          top: 2,
                          zIndex: 10,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() =>
                            this.deleteSquad(interestData.squad_id, index)
                          }
                          style={{
                            height: 20,
                            width: 20,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 50,
                            backgroundColor: "#7CDFFF",
                          }}
                        >
                          <Text
                            style={{
                              color: "white",
                              textAlign: "center",
                              marginBottom: 3,
                            }}
                          >
                            x
                          </Text>
                        </TouchableOpacity>
                      </View>

                      <View
                        style={{
                          marginTop: 10,
                          marginRight: 10,
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: 2,
                          backgroundColor: "#71CCE9",
                        }}
                      >
                        <Text
                          style={{
                            margin: 10,
                            fontSize: 13,
                            fontFamily: fonts.Regular,
                            color: "white",
                          }}
                        >
                          {interestData.squad_name}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            ) : (
              <></>
            )}

            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("InviteSinglePerson", {
                  isFromAddEvent: true,
                  invite_friend: this.state.invite_friend,
                  title: this.props.route.params.title,
                  address: this.props.route.params.address,
                  latitude: this.props.route.params.latitude,
                  longitude: this.props.route.params.longitude,
                })
              }
              style={{
                borderRadius: 10,
                marginTop: 20,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                height: 62,
                width: WINDOW_WIDTH - 60,
                alignSelf: "center",
                backgroundColor: "white",
                shadowColor: "#000",
                shadowOffset: { width: 2, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 3,
                elevation: 5,
                marginBottom: 20,
              }}
            >
              <Image
                style={{ width: 18, height: 18, resizeMode: "contain" }}
                source={require("../../assets/personIcon.png")}
              />

              <View style={{ marginLeft: 15 }}>
                <Text
                  style={{
                    color: "#50C4E9",
                    fontSize: 14,
                    fontWeight: "bold",
                  }}
                >
                  Invite Single Person
                </Text>
              </View>
            </TouchableOpacity>

            {this.state.invite_friend.length ? (
              <View
                style={{
                  flexDirection: "row",
                  marginVertical: 10,
                  paddingHorizontal: 20,
                  flex: 1,
                  flexWrap: "wrap",
                }}
              >
                {this.state.invite_friend.map((interestData, index) => {
                  return (
                    <View style={{ position: "relative" }}>
                      <View
                        style={{
                          position: "absolute",
                          right: 2,
                          top: 2,
                          zIndex: 10,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() =>
                            this.deletePerson(interestData.id, index)
                          }
                          style={{
                            height: 20,
                            width: 20,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 50,
                            backgroundColor: "#7CDFFF",
                          }}
                        >
                          <Text
                            style={{
                              color: "white",
                              textAlign: "center",
                              marginBottom: 3,
                            }}
                          >
                            x
                          </Text>
                        </TouchableOpacity>
                      </View>

                      <View
                        style={{
                          marginTop: 10,
                          marginRight: 10,
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: 2,
                          backgroundColor: "#71CCE9",
                        }}
                      >
                        <Text
                          style={{
                            margin: 10,
                            fontSize: 13,
                            fontFamily: fonts.Regular,
                            color: "white",
                          }}
                        >
                          {interestData.full_name}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            ) : (
              <></>

            )}
            <View style={{ width: "90%", marginTop: 10 }}>

              <RadioForm
                formHorizontal={false}
                animation={true}
              >
                {/* To create radio buttons, loop through your array of options */}
                {
                  sex.map((obj, i) => (
                    <RadioButton labelHorizontal={true} key={i} >
                      {/*  You can set RadioButtonLabel before RadioButtonInput */}
                      <View style={{ width: "100%", paddingTop: 5, alignItems: "center" }}>
                        <View style={{ width: "85%", flexDirection: "row", alignItems: "center" }}>
                          <View style={{ paddingTop: 2 }}>

                            <RadioButtonInput
                              obj={obj}
                              index={i}
                              onPress={(sex) => {
                                this.setState({ sex })
                              }}
                              value={this.state.sex}
                              isSelected={this.state.sex === obj.value}
                              borderWidth={1}
                              buttonInnerColor={'#50C4E9'}
                              buttonOuterColor={"#787878"}
                              buttonSize={10}
                              buttonOuterSize={15}
                              buttonStyle={{}}
                              buttonWrapStyle={{}}
                            />

                          </View>
                          {/* <View style={{ width: "80%"}}> */}
                          <RadioButtonLabel

                            obj={obj}
                            index={i}
                            labelHorizontal={true}
                            onPress={(sex) =>
                              this.setState({ sex })}
                            value={this.state.sex}
                            labelStyle={{
                              color: "#787878",
                              fontSize: 13,
                              fontWeight: "bold",
                            }}
                            labelWrapStyle={{}}

                          />
                          {/* </View> */}

                        </View>
                      </View>

                    </RadioButton>
                  ))
                }

              </RadioForm>

            </View>
          </ScrollView>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            const { eventDate, details } = this.state;
            if (eventDate && details) {
              if(this.state.invite_friend.length <= this.state.participants_limit){
                this.props.navigation.navigate("AddEvent3", {
                  date: this.state.eventDate + " " + this.state.eventTime,
                  details: this.state.details,
                  address: this.props.route.params.address,
                  location: this.props.route.params.location,
                  title: this.props.route.params.title,
                  latitude: this.props.route.params.latitude,
                  longitude: this.props.route.params.longitude,
                  friend: this.state.invite_friend,
                  squad: this.state.invite_squad,
                  participants_limit: this.state.participants_limit,
                  eventImg: this.props.route.params.eventImg,
                  showWhen: this.state.sex,
                });
              }
              else{
                Toast.show("Selected users exceeds participants limit",);
              }
             
            } else {
              Toast.show("Missing Fields are there.");
            }
          }}
          style={{ backgroundColor: "white" }}
        >
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={["#38A5CA", "#54C8EE"]}
            style={styles.linearGradient}
          >
            <Text style={styles.textStyle}>Next</Text>
          </LinearGradient>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={this.state.isDateVisible}
          minimumDate={new Date().getTime()}
          // mode="date"
          mode="date"
          onConfirm={(time) => {
            console.warn(
              "A date has been picked: ",
              moment(time).format("DD/MM/YYYY")
            );
            // console.warn("A time has been picked: ", moment(time).format('hh:mm A'));
            this.setState({
              eventDate: moment(time).format("DD/MM/YYYY"),
              // eventTime: moment(time).format('hh:mm A'),
              isDateVisible: false,
            });
          }}
          onCancel={() => {
            this.setState({
              isDateVisible: false,
            });
          }}
        />

        {/* <DateTimePickerModal
          isVisible={this.state.isTimeVisible}
          mode="time"
          onConfirm={(time) => {
            // console.warn("A date has been picked: ", moment(time).format('DD/MM/YYYY '));
            console.warn(
              "A time has been picked: ",
              moment(time).format("hh:mm A")
            );
            this.setState({
              // eventTime: moment(time).format('DD/MM/YYYY hh:mm A'),
              eventTime: moment(time).format("hh:mm A"),
              isTimeVisible: false,
            });
          }}
          onCancel={() => {
            this.setState({
              isTimeVisible: false,
            });
          }}
        /> */}
      </>
      
      </TouchableWithoutFeedback>
    );
  }


  closeIconPress = (value) => {
    var arrData = [];
    this.state.arrSomeOneBrings.map((data, index) => {
      if (index != value) {
        arrData.push(data);
      }
    });
    this.setState({
      arrSomeOneBrings: arrData,
    });
  };

  GooglePlacesInput = () => {
    return (
      <View
        style={{
          flex: 0.5,
          flexDirection: "row",
          marginTop: 0,
          borderRadius: 5,
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 0,
        }}
      >
        <View style={{ flex: 1 }}>
          <GooglePlacesAutocomplete
            enablePoweredByContainer={false}
            placeholder="Address"
            returnKeyType={"search"}
            listViewDisplayed={"auto"} // true/false/undefined
            fetchDetails={true}
            minLength={2}
            autoFocus={true}
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true
              this.setModalVisible(false);
              const location = {
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
              };
              this.setState({ location, address: details.formatted_address });
              this.marker.animateMarkerToCoordinate(location, 2);
            }}
            query={{
              key: "AIzaSyCnQCCl0vve8_3D-OIh1b7cpINpH723Fvg",
              language: "en",
              radius: 10000,
            }}
            GooglePlacesSearchQuery={{
              rankby: "distance",
            }}
            nearbyPlacesAPI="GooglePlacesSearch"
            onFail={(error) => console.log(error)}
            onNotFound={(error) => console.log(error)}
            textInputProps={{
              inputStyle: {
                marginVertical: 8,
                fontFamily: fonts.Regular,
                fontSize: 16,
                color: colors.BLACK,
              },
              inputContainerStyle: {
                borderBottomColor: colors.bottomBorderColor,
              },
            }}
            styles={{
              container: {
                borderBottomWidth: 0,
                flex: 1,
              },
              textInputContainer: {
                borderBottomWidth: 0,
              },
              textInput: {
                // backgroundColor:colors.themeColor,
                color: colors.BLACK,
                fontFamily: fonts.regular,
                fontSize: 16,
                paddingHorizontal: 0,
                borderBottomColor: colors.bottomBorderColor,
              },
            }}
          ></GooglePlacesAutocomplete>
        </View>
      </View>
    );
  };

  showMap = () => {
    return (
      <View style={styles.container}>
        <MapView
          ref={(ref) => {
            this.mapView = ref;
          }}
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={{
            latitude: Number(this.state.location.latitude),
            longitude: Number(this.state.location.longitude),
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
          initialRegion={{
            latitude: Number(this.state.location.latitude),
            longitude: Number(this.state.location.longitude),
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
          zoomEnabled={true}
          minZoomLevel={10}
          maxZoomLevel={20}
          scrollEnabled={false}
        >
          <MarkerAnimated
            ref={(marker) => {
              this.marker = marker;
            }}
            // coordinate={this.state.location}
            coordinate={{
              latitude: Number(this.state.location.latitude),
              longitude: Number(this.state.location.longitude),
            }}
          />
        </MapView>
      </View>
    );
  };

  handleChange = (values) => {
    // Your logic
  };

  showLocationOnMap = async () => {
    const latitude = await AsyncStorage.getItem("latitude");
    const longitude = await AsyncStorage.getItem("longitude");

    if (latitude && longitude) {
      const locationObj = {
        latitude: latitude,
        longitude: longitude,
      };
      this.setState({ location: locationObj });
      // this.mapView.animateToCoordinate(locationObj, 2000)
      this.mapView.animateCamera({
        center: {
          latitude: locationObj.latitude,
          longitude: locationObj.longitude,
        },
      });
    }
  };

  addPicture = (index) => {
    if (index == 0) {
      this.openImagePicker(this.props.navigation);
    } else {
      this.setState({ selectedIndex: index });
    }
  };

  removePicture = (index) => {
    const image = this.state.images[index];
    const arrImage = this.state.images;
    const arrNewImages = arrImage.filter((data) => data !== image);
    this.setState({ images: arrNewImages });
  };

  captureImage = async (type) => {
    // let options = {
    //   mediaType: type,
    //   maxWidth: 300,
    //   maxHeight: 550,
    //   quality: 1,
    //   videoQuality: 'low',
    //   durationLimit: 30, //Video max duration in seconds
    //   saveToPhotos: true,
    // };

    var options = {
      title: "Select Image",
      includeBase64: false,
      quality: 0.5,
      mediaType: "photo",
    };

    // let isCameraPermitted = await requestCameraPermission();
    // let isStoragePermitted = await requestExternalWritePermission();
    // if (isCameraPermitted && isStoragePermitted) {
    launchCamera(options, (response) => {
      console.log("Response = ", response);

      if (response.didCancel) {
        alert("User cancelled camera picker");
        return;
      } else if (response.errorCode == "camera_unavailable") {
        alert("Camera not available on device");
        return;
      } else if (response.errorCode == "permission") {
        alert("Permission not satisfied");
        return;
      } else if (response.errorCode == "others") {
        alert(response.errorMessage);
        return;
      }
      this.setFilePath(response.assets[0]);
    });
    // }
  };

  chooseFile = (type) => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
    };
    launchImageLibrary(options, (response) => {
      console.log("Response = ", response);

      if (response.didCancel) {
        alert("User cancelled camera picker");
        return;
      } else if (response.errorCode == "camera_unavailable") {
        alert("Camera not available on device");
        return;
      } else if (response.errorCode == "permission") {
        alert("Permission not satisfied");
        return;
      } else if (response.errorCode == "others") {
        alert(response.errorMessage);
        return;
      }
      this.setFilePath(response.assets[0]);
    });
  };

  setFilePath(response) {
    console.log("uri -> ", response.uri);
    let arrImage = this.state.images;
    arrImage.push(response.uri);
    this.setState({
      filePath: response.uri,
      imageResponse: response,
      images: arrImage,
    });
  }

  openImagePicker(navigation) {
    Alert.alert(
      "Photo",
      "Please select or capture the image",
      [
        {
          text: "Gallery",
          onPress: () => this.chooseFile("photo"),
        },
        {
          text: "Camera",
          onPress: () => this.captureImage("photo"),
        },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  }

}

const mapStateToProps = (state) => {
  return {
    userInfo: state.user.userInfo,
  };
};
export default connect(mapStateToProps)(AddEventComponent);

const styles = StyleSheet.create({
  inputStyle: {
    color: "black",
    fontSize: 16,
    fontFamily: fonts.Regular,
    backgroundColor: "white",
    elevation: 2,
    width: "100%",
    height: 50,
    borderRadius: 180,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "gray",
  },
  inputDetail: {
    color: "black",
    fontSize: 16,
    fontFamily: fonts.Regular,
    backgroundColor: "white",
    elevation: 2,
    width: "100%",
    height: 60,
    marginTop: 10,
    borderRadius: 30,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "gray",
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
    position: "absolute",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
