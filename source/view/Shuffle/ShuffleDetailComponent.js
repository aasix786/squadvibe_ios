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
  ScrollView,
  StatusBar,
  Dimensions,
  Linking,
} from "react-native";
import { colors, fonts, SCREEN_SIZE } from "../../common/colors";
import { HeadingText } from "../../common/HeadingText";
import { Button, CheckBox } from "react-native-elements";
import moment from "moment";
import MapView, {
  MarkerAnimated,
  PROVIDER_GOOGLE,
  MapViewAnimated,
} from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { postMethod } from "../../Networking/APIModel";
import { connect } from "react-redux";
import Loader from "../../common/Loader";
import Header from "../components/header";
import axios from "axios";
import Toast from "react-native-simple-toast";
import Ripple from "react-native-material-ripple";
import LinearGradient from "react-native-linear-gradient";
import Share from 'react-native-share';
const WINDOW_WIDTH = Dimensions.get("window").width;

class ShuffleDetailComponent extends PureComponent {
  constructor() {
    super();
    this.state = {
      code: "",
      isCheck: false,
      birthDate: "",
      images: ["", "", "", ""],
      selectedIndex: -1,
      arrInterest: ["Drinking", "Playing games"],
      eventData: {},
      latitude: Number(0),
      longitude: Number(0),
      arrSomeOneBrings: [],
      arrSelectedIndex: [],
      otherUserSelectedCheckList: [],
      arrSelectedCheckList: [],
      event_users: [],
      event_squads: [],
      is_participant: false,
      event_owner_id: "",
      request_list: "",
      bring_list: [],
      is_requested: false,
      loading: false,
      min_age: "",
      title: "",
      address: "",
      Description: "",
      time: "",
      minAge: "",
      maxAge: "",
      arrOpenEvent: [],
      event_requests: [],
    };
  }

  joinEvent = () => {
    const parameter = new FormData();
    parameter.append("token", this.props.userInfo.token);
    parameter.append("event_id", this.state.event_id);

    axios
      .post("http://squadvibes.onismsolution.com/api/JoinEventConform", parameter)
      .then((res) => {
        Toast.show("Successfully request sent.");
        this.props.navigation.navigate("HomeTab");
      })
      .catch((err) => {
        Toast.show(err);
      });
  };

  acceptEvent = (item, status) => {
    const parameter = new FormData();

    parameter.append("token", this.props.userInfo.token);
    parameter.append("user_id", item.user_id);
    parameter.append("event_id", this.state.event_id);
    parameter.append("status", status);

    console.log("acceptEvent", parameter);
    axios
      .post("http://squadvibes.onismsolution.com/api/AcceptEventRequest", parameter)
      .then((res) => {
        const filterData = this.state.event_requests.filter(
          (elem) => elem.user_id !== item.user_id
        );
        this.setState({ event_requests: filterData });
        console.log("API RES", res.data);
        // Toast.show('Joined successfully.')
        // this.props.navigation.navigate('HomeTab')
      })
      .catch((err) => {
        Toast.show(err);
      });
  };

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

        });
      },
      (error) => {
        this.setState({ loading: false });
        Toast.show(JSON.stringify(error));
      }
    );
  };

  render() {
    let showJoinBtn = true;
    if (this.props.route.params.eventData?.event_ownership == 1) {
      showJoinBtn = false;
    } else if (this.props.route.params.eventData?.event_type == 0) {
      this.state.event_users.forEach((elem) => {
        if (elem.user_id == this.props.userInfo.id) {
          showJoinBtn = false;
        }
      });
    } else {
      showJoinBtn = false;
    }

    this.state.event_requests.forEach((elem) => {
      if (elem.user_id === this.props.userInfo.id) {
        showJoinBtn = false;
      }
    });

    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <StatusBar
          backgroundColor={"transparent"}
          translucent
          barStyle="light-content"
        />

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

        <Image
          style={{ height: 300, width: "100%" }}
          source={{
            uri:
              this.props.route.params.eventData &&
              this.props.route.params.eventData.event_image,
          }}
        />
        <View style={{ height: 20 }} />
        <ScrollView
          style={{ flexGrow: 1 }}
          contentContainerStyle={{ marginHorizontal: 16 }}
        >
          <HeadingText
            title={this.state.eventData.event_title}
            style={{
              fontSize: 20,
              color: colors.black,
              fontFamily: fonts.SemiBold,
            }}
          />

          <Text
            style={{
              color: "#666666",
              fontSize: 12,
              paddingTop: 3,
            }}
          >
            {moment(this.state.eventData.event_date).format("DD MMMM YYYY")}{" "}
            {this.state.eventData.event_time}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 5,
            }}
          >
            <Image source={require("../../assets/marker.png")} />
            <Text
              style={{
                alignSelf: "center",
                marginHorizontal: 10,
                fontFamily: "BeVietnam-SemiBold",
                color: "#38A5CA",
                fontSize: 15,
              }}
            >
              {this.state.eventData.event_address}
            </Text>
          </View>

          <Text
            style={{
              color: "#A3A8B8",
              fontSize: 12,
            }}
          >
            {this.state.eventData.event_description}
          </Text>

          <View
            style={{
              height: 227,
              overflow: "hidden",
              borderRadius: 20,
              marginTop: 20,
            }}
          >
            {this.showMap()}
          </View>

          {this.state.event_users.length ? (
            <>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 20,
                }}
              >
                <HeadingText
                  title={"Participants"}
                  style={{
                    fontSize: 18,
                    color: colors.black,
                    fontFamily: fonts.SemiBold,
                  }}
                />
              </View>
              <View style={{ marginTop: 17, paddingBottom: 0 }}>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={this.state.event_users}
                  keyExtractor={({ item, index }) => String(index)}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ selectedIndex: index });
                        this.props.navigation.navigate("Profile", { item });
                      }}
                      activeOpacity={0.8}
                    >
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          marginHorizontal: 8,
                          overflow: "hidden",
                        }}
                      >
                        <Image
                          source={{ uri: item.image }}
                          style={{ height: 143, width: 122, borderRadius: 20 }}
                        />
                      </View>
                      <Text
                        numberOfLines={1}
                        style={{
                          marginVertical: 5,
                          color: "#0D110F",
                          fontFamily: fonts.Regular,
                          fontSize: 13,
                          textAlign: "center",
                        }}
                      >
                        {item.full_name}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </>
          ) : (
            <></>
          )}

          {/* <View style={{ paddingBottom: 10, width: "100%" }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 12,
              }}
            >
              <HeadingText
                title={"Someone bring"}
                style={{
                  fontSize: 18,
                  color: colors.black,
                  fontFamily: fonts.SemiBold,
                }}
              />
            </View>

            <View style={{ flex: 1, width: "100%" }}>
              <FlatList
                data={this.state.arrSomeOneBrings}
                extraData={this.state.arrSomeOneBrings}
                keyExtractor={(item, index) => String(index)}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    style={{
                      marginTop: 8,
                      width: "100%",
                      alignItems: "center",
                      backgroundColor: "white",
                      padding: 15,
                      borderRadius: 8,
                      justifyContent: "space-between",
                      flexDirection: "row",
                      elevation: 3,
                    }}
                  >
                    <Text style={{ fontSize: 18 }}>{item}</Text>
                    <Image
                      style={{ width: 40, height: 40, resizeMode: "contain" }}
                      source={require("../../assets/eple-03.png")}
                    />
                  </TouchableOpacity>
                )}
              />
            </View>
          </View> */}

          <View style={{ paddingBottom: 10, marginTop: 10 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 12,
              }}
            >
              <HeadingText
                title={"Age Range"}
                style={{
                  fontSize: 18,
                  color: colors.black,
                  fontFamily: fonts.SemiBold,
                }}
              />
            </View>

            <Text
              style={{
                marginTop: 10,
                color: "#969696",
                fontSize: 14,
                fontFamily: fonts.Regular,
              }}
            >
              {parseInt(this.state.minAge) || 0} -{" "}
              {parseInt(this.state.maxAge)}
            </Text>
          </View>

          {this.props.route.params.eventData?.event_ownership == 1 && (
            <>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("InviteEventMembers", {
                    invite_friend: this.state.event_users,
                    event_id: this.state.event_id,
                  })
                }
                style={{
                  borderRadius: 10,
                  marginTop: 20,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 62,
                  width: WINDOW_WIDTH - 35,
                  alignSelf: "center",
                  backgroundColor: "white",
                  shadowColor: "#000",
                  shadowOffset: { width: 2, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 3,
                  elevation: 5,
                  marginBottom: 10,
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

              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("AddSquadInEVent", {
                    invite_squad: this.state.event_squads,
                    event_id: this.state.event_id,
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
                  width: WINDOW_WIDTH - 35,
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
            </>
          )}
          <View
            onPress={() =>
              this.onShare()}
            // style={{
            //   display: "flex",
            //   elevation: 4,
            //   padding: 20,
            //   borderRadius: 10,
            //   backgroundColor: "#50C4E9",
            //   shadowColor: "gray",
            //   shadowOffset: {
            //     width: 2,
            //     height: 2,
            //   },
            //   shadowOpacity: 0.9,
            //   shadowRadius: 3,
            //   marginTop: 20,
            //   flexDirection: "row",
            //   marginHorizontal: 20,
            //   justifyContent: "center",
            //   alignItems: "center",
            //   width: WINDOW_WIDTH - 35,
            //   alignSelf: "center",
            // }}
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: WINDOW_WIDTH - 35,
              alignSelf: "center",
              marginTop: 20,

            }}
          >


            <View style={{}}>
              <Text
                style={{
                  color: "#000",
                  fontSize: 14,
                }}
              >
                Share to
              </Text>
            </View>

          </View>
          <View style={{ width: "100%",marginTop: 20 }}>

            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row"
              }}
            >
            <View style={{ width: "33%", justifyContent: "center", alignItems: "center" }}>
                  <TouchableOpacity
                    active={0.8}
                    onPress={() => {
                      this.whatsApp();
                    }}
                    style={{
                      
                      backgroundColor: "transparent",
                      borderRadius: 78,
                      borderColor: colors.white,
                      borderWidth: 1,

                    }}
                  >

                    <Image
                      style={{ height: 46, width: 46, borderRadius: 78 }}
                      source={require("../../assets/whatsapp-icon.png")}
                    />
                  </TouchableOpacity>


              </View>
              <View style={{ width: "33%", justifyContent: "center", alignItems: "center" }}>
                  <TouchableOpacity
                    active={0.8}
                    onPress={() => {
                      this.facebook();
                    }}
                    style={{
                      backgroundColor: "transparent",
                      borderRadius: 78,
                      borderColor: colors.white,
                      borderWidth: 1,

                    }}
                  >

                    <Image
                      style={{ height: 46, width: 46, borderRadius: 78 }}
                      source={require("../../assets/Facebook_Logo.png")}
                    />
                  </TouchableOpacity>


              </View>
              <View style={{ width: "33%", justifyContent: "center", alignItems: "center" }}>
                  <TouchableOpacity
                    active={0.8}
                    onPress={() => {
                      this.instagram();
                    }}
                    style={{
                      backgroundColor: "transparent",
                      borderRadius: 78,
                      borderColor: colors.white,
                      borderWidth: 1,

                    }}
                  >

                    <Image
                      style={{ height: 60, width: 60, borderRadius: 78 }}
                      source={require("../../assets/insta2.png")}
                    />
                  </TouchableOpacity>


              </View>

            </View>
          </View>
          <View style={{ height: 50 }} />

          {showJoinBtn && (
            <TouchableOpacity activeOpacity={0.8} onPress={this.joinEvent}>
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={["#54C8EE", "#38A5CA"]}
                style={styles.linearGradient}
              >
                <Text style={styles.textStyle}>Participate</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          <View style={{ height: 30 }} />

          {this.props.route.params.eventData?.event_ownership == 1 && (
            <FlatList
              contentContainerStyle={{ paddingBottom: 80 }}
              style={{ marginTop: 10, width: "100%" }}
              data={this.state.event_requests}
              keyExtractor={(item, index) => item.event_id}
              renderItem={({ item, index }) => (
                <View
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
                      source={{ uri: item.image }}
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
                        {item.full_name}
                      </Text>
                      {/* <Text numberOfLines={2}  style={{ color: colors.gray, fontSize: 14, fontFamily: fonts.Regular }} numberOfLines={2}>{item.event_description}</Text> */}
                    </View>

                    <View style={{ marginLeft: "auto" }}>
                      <TouchableOpacity
                        onPress={() => this.acceptEvent(item, 1)}
                      >
                        <Image
                          style={{
                            resizeMode: "contain",
                            width: 40,
                            height: 40,
                          }}
                          source={require("../../assets/tick.png")}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => this.acceptEvent(item, 2)}
                      >
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
                </View>
              )}
            />
          )}
        </ScrollView>

        <Loader loading={this.state.loading} />
      </View>
    );
  }
  // whatsApp = async () => {
  //   try {
  //     const result = await Share.share({

  //       message:
  //         'Title : ' + this.state.title
  //         + ' Address :' + this.state.address +
  //         ', Description :' + this.state.Description +
  //         ' event Time ' + this.state.time +
  //         ' Minimum Age ' + this.state.minAge +
  //         ' Maximum Age ' + this.state.maxAge

  //     })

  //     if (shareImage.action === Share.sharedAction) {
  //       if (shareImage.activityType) {
  //         // shared with activity type of result.activityType
  //         Alert.alert(shareImage.activityType);
  //       } else {
  //         // shared
  //       }
  //     } else if (shareImage.action === Share.dismissedAction) {
  //       // dismissed
  //     }
  //   } catch (error) {
  //     alert(error.message);
  //   }
  // };
 
  whatsApp = () => {
     const shareOptions = {
    title: this.state.title,
    message: 'Title : ' + this.state.title
    + ' Address :' + this.state.address +
    ', Description :' + this.state.Description +
    ' event Time ' + this.state.time +
    ' Minimum Age ' + this.state.minAge +
    ' Maximum Age ' + this.state.maxAge,
    social: Share.Social.WHATSAPP,

    filename: 'test' , // only for base64 file in Android
  };

  Share.shareSingle(shareOptions)
    .then((res) => { console.log(res) })
    .catch((err) => { err && console.log(err); });
  };
  
  
  facebook = () => {
     const shareOptions = {

    title: this.state.title,
    message: this.state.title.toString(),
    // url: 'https://snack.expo.dev/@onismsolution/image-picker',
    social: Share.Social.FACEBOOK,
    whatsAppNumber: "9199999999",  // country code + phone number
    filename: 'test' , // only for base64 file in Android
  };

  Share.shareSingle(shareOptions)
    .then((res) => { console.log(res) })
    .catch((err) => { err && console.log(err); });
  };
  instagram = () => {
     const shareOptions = {
    title: this.state.title,
    message: 'some message',
    url: 'https://snack.expo.dev/@onismsolution/image-picker',
    social: Share.Social.INSTAGRAM,
    whatsAppNumber: "9199999999",  // country code + phone number
    filename: 'test' , // only for base64 file in Android
  };

  Share.shareSingle(shareOptions)
    .then((res) => { console.log(res) })
    .catch((err) => { err && console.log(err); });
  };
  userRow = (item) => {
    return (
      <View
        style={{
          backgroundColor: "red",
          paddingBottom: 8,
          borderBottomWidth: 1,
          borderBottomColor: colors.bottomBorderColor,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            marginVertical: 5,
            paddingVertical: 5,
          }}
        >
          <View>
            <Image
              source={{ uri: item.requested_user_image }}
              style={styles.profileImg}
            />
          </View>
          <View style={{ flex: 1, paddingLeft: 10 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontFamily: fonts.SemiBold, fontSize: 15 }}>
                {item.request_by_user}
              </Text>
              <Text style={{ fontFamily: fonts.regular, fontSize: 11 }}>
                {item.lastMessage
                  ? moment.unix(item.lastMessage.time).format("hh:mm a")
                  : ""}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: "row", paddingHorizontal: 10 }}>
          <TouchableOpacity
            style={{
              borderRadius: 5,
              paddingHorizontal: 10,
              paddingVertical: 0,
              height: 28,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: colors.greenButton,
            }}
            onPress={() => {
              this.eventAcceptReject(item.requested_user_id, 1);
            }}
          >
            <Text style={{ color: colors.white, fontFamily: fonts.SemiBold }}>
              Accept
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              marginHorizontal: 10,
              borderRadius: 5,
              paddingHorizontal: 10,
              paddingVertical: 0,
              height: 28,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: colors.black,
            }}
            onPress={() => {
              this.eventAcceptReject(item.requested_user_id, 0);
            }}
          >
            <Text style={{ color: colors.white, fontFamily: fonts.SemiBold }}>
              Deny
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      const { eventData } = this.props.route.params;
      const { someone_bring, event_id, event_type } = eventData;
      console.log("DAATAA>>>>>>>>>>>>>>>>>>>>>>>>>>>");
      console.log(eventData);
      this.setState({
        title: eventData.event_title,
        address: eventData.event_address,
        Description: eventData.event_description,
        time: eventData.event_time,
        minAge: eventData.min_age,
        maxAge: eventData.max_age,
        latitude: eventData.lats,
        longitude: eventData.longs,

      })
      if (event_id) {
        this.callEventDetail(event_id);
      }
      // this.getAllEvent()
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback_arrow) => {
      return;
    };
  }

  showMap = () => {
    console.log("this.state.latitude")
    console.log(this.state.latitude)
    console.log("this.state.longitude")
    console.log(this.state.longitude)
    return (
      <View style={styles.container}>
        <MapView
          ref={(ref) => {
            this.mapView = ref;
          }}
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={[styles.map, { borderRadius: 20, overflow: "hidden" }]}
          region={{
            latitude: Number(this.state.latitude),
            longitude: Number(this.state.longitude),
            latitudeDelta: 0.05,
            longitudeDelta: 0.0121,
          }}
          initialRegion={{
            latitude: Number(this.state.latitude),
            longitude: Number(this.state.longitude),
            latitudeDelta: 0.05,
            longitudeDelta: 0.0121,
          }}
          zoomEnabled={true}
          minZoomLevel={10}
          maxZoomLevel={20}
          scrollEnabled={false}
          zoomTapEnabled={false}
        >
          <MarkerAnimated
            ref={(marker) => {
              this.marker = marker;
            }}
            // coordinate={this.state.location}
            coordinate={{
              latitude: Number(this.state.latitude),
              longitude: Number(this.state.longitude),
            }}
          />
        </MapView>
      </View>
    );
  };

  askToJoinEvent = async (eventId, someoneBring) => {
    var formdata = new FormData();
    formdata.append("token", this.props.userInfo.token);
    formdata.append("event_id", eventId);
    formdata.append("someone_bring", someoneBring);
    postMethod(
      this.props.navigation,
      "askToJoin",
      formdata,
      (success) => {
        this.props.navigation.goBack();
      },
      (error) => {
        console.error(error);
      }
    );
  };

  callEventDetail = async (eventId) => {
    this.setState({ loading: true });
    var formdata = new FormData();
    formdata.append("token", this.props.userInfo.token);
    formdata.append("event_id", eventId);
    console.log("ID++++", formdata);
    postMethod(
      this.props.navigation,
      "eventDetail",
      formdata,
      (success) => {
        this.setState({ loading: false });
        console.log("SUCCESSSSSS");
        if (success.hasOwnProperty("eventDetail")) {
          const eventData = success.eventDetail;
          console.log("DETAILS", eventData);
          const { someone_bring } = eventData;
          var arr = [];
          var arrBring_list = [];

          if (String(someone_bring) != "") {
            arr = String(someone_bring).split(",");
          }

          if (eventData.hasOwnProperty("bring_list")) {
            arrBring_list = eventData.bring_list;
          }
          this.setState({
            latitude: Number(eventData.lats),
            longitude: Number(eventData.longs),
            arrSomeOneBrings: arr,
            otherUserSelectedCheckList: eventData.hasOwnProperty("bring_list")
              ? eventData.bring_list
              : [],
            is_participant: Boolean(eventData.is_participant),
            bring_list: arrBring_list,
            event_owner_id: success.eventDetail.event_owner_id,
            request_list: success.eventDetail.request_list,
            is_requested: Boolean(success.eventDetail.is_requested),
            eventData: success.eventDetail,
            min_age: success.eventDetail.min_age,
            event_id: eventData.event_id,
            max_age: success.eventDetail.max_age,
            event_users: success.eventDetail.event_users,
            event_squads: success.eventDetail.event_squads,
            event_requests: eventData.event_requests,
            // event_id : eventId
          });
        }
      },
      (error) => {
        this.setState({ loading: false });
        console.error(error);
      }
    );
  };

  eventAcceptReject = (id, status) => {
    this.setState({ loading: true });
    var formdata = new FormData();
    formdata.append("token", this.props.userInfo.token);
    formdata.append("event_id", this.state.eventData.event_id);
    formdata.append("requested_user_id", id);
    formdata.append("request_status", status);

    postMethod(
      this.props.navigation,
      "eventAcceptReject",
      formdata,
      (success) => {
        this.setState({ loading: false });
        if (this.state.eventData.event_id) {
          this.callEventDetail(this.state.eventData.event_id);
        }
      },
      (error) => {
        this.setState({ loading: false });
        Toast.show(JSON.stringify(error));
      }
    );
  };
}

const mapStateToProps = (state) => {
  console.log("Event Detail state", state);
  return {
    userInfo: state.user.userInfo,
  };
};

export default connect(mapStateToProps)(ShuffleDetailComponent);

const styles = StyleSheet.create({
  passwordContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#D9D5C6",
    paddingBottom: 10,
    // marginHorizontal: 16,
  },
  inputStyle: {
    // flex: 1,
    fontSize: 16,
    fontFamily: fonts.Regular,
  },
  bottomView: {
    flexDirection: "row",
    width: "84%",
    height: 50,
    backgroundColor: "#00A551",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 40,
    marginHorizontal: 36,
    borderRadius: 25,
  },
  textStyle: {
    color: "#fff",
    fontSize: 17,
    fontFamily: fonts.Bold,
  },
  textInputStype: {
    height: 50,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
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
  profileImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: "cover",
  },
  backButtonStyle: {
    height: 34,
    width: 34,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    position: "absolute",
    zIndex: 99,
    top: 50,
    left: 27,
  },
  linearGradient: {
    height: 72,
    width: "70%",
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
