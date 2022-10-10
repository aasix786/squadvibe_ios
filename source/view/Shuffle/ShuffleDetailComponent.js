import React, { PureComponent, Component } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  SafeAreaView,
  StyleSheet,
  Linking,
  FlatList,
  ScrollView,
  StatusBar,
  Dimensions,
  Share,
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
// import Share, { Social } from 'react-native-share';
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
                      this.triggerShare("Whatsapp");
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
                      this.triggerShare("Facebook");
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
                      this.triggerShare("Instagram");
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
 triggerShare = async (APP) => {
  try {
    // let url = "https://www.facebook.com/dialog/share?app_id=658138055987536&display=popup&href=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2F&redirect_uri=https%3A%2F%2Fdevelopers.facebook.com%2Ftools%2Fexplorer"
  
  if(APP == "Whatsapp"){
    let message = encodeURI("Event Name: "+this.props.route.params.eventData.event_title+"   Event Date: "+moment(this.state.eventData.event_date).format("DD MMMM YYYY")+"   Address: "+this.state.eventData.event_address);
    let url = "https://wa.me/whatsappphonenumber/?text=asas"
     await Linking.openURL(url);
  }else{
    let message = "Event Name: "+this.props.route.params.eventData.event_title+"   Event Date: "+moment(this.state.eventData.event_date).format("DD MMMM YYYY")+"   Address: "+this.state.eventData.event_address;
    const result = await Share.share({
      message: message,
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  }
   
    // const result = await Share.share({
    //   message:
    //     'React Native | A framework for building native apps using React',
    // });

    // if (result.action === Share.sharedAction) {
    //   if (result.activityType) {
    //     // shared with activity type of result.activityType
    //   } else {
    //     // shared
    //   }
    // } else if (result.action === Share.dismissedAction) {
    //   // dismissed
    // }
  } catch (error) {
    alert(error.message);
  }
}
 
//   whatsApp = () => {
//      const shareOptions = {
//     title: this.state.title,
//     message: 'Title : ' + this.state.title
//     + ' Address :' + this.state.address +
//     ', Description :' + this.state.Description +
//     ' event Time ' + this.state.time +
//     ' Minimum Age ' + this.state.minAge +
//     ' Maximum Age ' + this.state.maxAge,
//     social: Share.Social.WHATSAPP,

//     filename: 'test' , // only for base64 file in Android
//   };

//   Share.shareSingle(shareOptions)
//     .then((res) => { console.log(res) })
//     .catch((err) => { err && console.log(err); });
//   };
  
  
//   facebook = () => {
//      const shareOptions = {

//     title: this.state.title,
//     message: "new text",
//     url: 'https://snack.expo.dev/@onismsolution/image-picker',
//     social: Share.Social.FACEBOOK,
//     filename: 'test' , // only for base64 file in Android
//   };

//   Share.shareSingle(shareOptions)
//     .then((res) => 
//     { 
//       console.log("facebook")
//       console.log(res)
    
//     })
//     .catch((err) => { err && console.log(err); });
//   };

//     instagram =  () => {
//       const shareOptions = {
//         social: Share.Social.INSTAGRAM,
//         url: 'data:image/jpeg;base64,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',
//         type: 'image/*',
//         title: this.state.title,
//         message: "new text",
//       };
//       Share.shareSingle(shareOptions)  
//    .then((res) => 
//    { 
//      console.log("instagram")
//      console.log(res)
   
//    })
//    .catch((err) => { err && console.log(err); });
//  };


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
