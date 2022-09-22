import React, { PureComponent, Component } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  PermissionsAndroid,
  ScrollView,
  StatusBar,
  Dimensions,
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
import Header from "../components/header";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Button from "../components/button";
import Geolocation from "@react-native-community/geolocation";
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
      eventDate: "",
      eventTime: "",
      filePath: "",
      imageResponse: "",
      selected_number_of_participant: "",
      title: "",
      address: "",
      details: "",
      invite_friend: [],
      invite_squad: [],
      mode_type: 1,
      add_to_people_group_chat: false,
      loading: false,
      location: {
        latitude: 0,
        longitude: 0,
      },
      setLatitude: 0,
      setLongitude: 0,
      modalVisible: false,
      minAge: "",
      maxAge: "",
      arrSomeOneBrings: [],
      some_one_bring: "",
      showUsername: false,
      showAddress: false,
      eventDefaultImgs: [],
      selectedImgIndex: -1,
    };
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  getEventDefaultImgs = () => {
    const paramter = new FormData();
    paramter.append("token", this.props.userInfo.token);

    axios
      .post(
        "http://squadvibes.onismsolution.com/api/GetEventDefaultImages?token",
        paramter
      )
      .then((res) => {
        this.setState({ eventDefaultImgs: res.data.GetEventDefaultImages });
        console.log("GET IMGS", res.data);
      })
      .catch((err) => console.error("ERROR", err));
  };

  componentDidMount() {
    // this.getEventDefaultImgs();
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      console.log("route.params ", this.props.route.params);
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

  getlocationanmefromltlng = async (lat, lng) => {
    console.log("Lat");
    console.log(lat);
    console.log("lng");
    console.log(lng);
    this.setState({ setLatitude: lat, setLongitude: lng })
    let placename;
    // let latlng = this.state.aregion.latitude + "," + this.state.aregion.longitude;
    let latlng = lat + "," + lng;

    // console.error(latlng)
    var url =
      "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
      latlng +
      "&key=AIzaSyCAcgEQMvho7rnMg-cV7wLEZjJLoH50ehk";
    //  console.log(url);
    await fetch(url, { method: "GET" })
      .then((res) => res.json())
      .then((res) => {
        let mcountry;
        let mstate;
        let mcity;
        res.results.forEach((element) => {
          var mainarr = element.address_components;
          for (let i = 0; i < mainarr.length; i++) {
            //console.log(mainarr[i]);
            if (mainarr[i].types.includes("country")) {
              mcountry = mainarr[i].long_name ? mainarr[i].long_name : mcountry;
            }
            if (mainarr[i].types.includes("administrative_area_level_1")) {
              mstate = mainarr[i].long_name ? mainarr[i].long_name : mstate;
            }
            if (mainarr[i].types.includes("locality")) {
              mcity = mainarr[i].long_name ? mainarr[i].long_name : mcity;
            }
          }
          console.log(mcountry, mstate, mcity);
        });
        if (res.results[0]) {
          placename = res.results[0].formatted_address;
        } else {
          placename = " ";
        }
        //   console.log("FORMATTT", res.results[0].formatted_address)
        //   console.log("country", mcountry, mstate)
        this.setState({
          country: mcountry,
          state: mstate,
          city: mcity,
          address: placename,
          selectedlocatiom: placename,
        });
        this.placesRef && this.placesRef.setAddressText(placename);
      })
      .catch((ers) => {
        console.warn(ers);
      });
  };

  getCurrentLocation = () => {
    this.requestLocationPermission();
    Geolocation.getCurrentPosition(
      (position) => {
        console.log("POSSSS", position);
        this.setState({
          aregion: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.025,
            longitudeDelta: 0.025,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          },
        });
        this.getlocationanmefromltlng(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      (error) => {
        Toast.show("Location not found, check your mobile location");
        console.log(error.message + "wokeeey");
        this.setState({ error: error.message });
      },
      {
        enableHighAccuracy: false,
        timeout: 50000,
        forceRequestLocation: true,
        showLocationDialog: true,
      }
    );
  };

  async requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message:
            "This App needs access to your location " +
            "so we can know where you are.",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use locations ");
      } else {
        console.log("Location permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  }

  render() {
    console.log("this.state.setLatitude")
    console.log(this.state.setLatitude)  
     console.log("this.state.setlongitude")
    console.log(this.state.setLongitude)
    return (
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
          <View style={{ marginTop: 30 }}>
            {this.state.showUsername ? (
              <View style={{ marginHorizontal: 30 }}>
                {/* <Text style={{ marginLeft: 8, fontFamily: fonts.SemiBold, fontSize: 14, color: colors.headingTextColor }}>Set a Username</Text> */}
                <View
                  style={{
                    alignContent: "center",
                    alignItems: "center",
                    borderRadius: 50,
                    borderColor: "gray",
                    borderWidth: 1,
                    flexDirection: "row",
                    marginHorizontal: 0,
                  }}
                >
                  <TextInput
                    // defaultValue={userInfo.user_name}
                    style={styles.inputStyle}
                    autoCorrect={false}
                    placeholder="Title"
                    // placeholderTextColor='#8D8B82'
                    onChangeText={(title) => this.setState({ title })}
                  />
                </View>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => this.setState({ showUsername: true })}
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
                    Title
                  </Text>
                  <Text style={{ fontSize: 12, color: "black" }}>
                    Beer Pong
                  </Text>
                </View>


                <Image
                  style={{ height: 16, width: 16, marginRight: 15 }}
                  source={require("../../assets/arrowRight.png")}
                />
              </TouchableOpacity>
            )}

            {this.state.showAddress ? (
              <>
                <TouchableOpacity
                  onPress={this.getCurrentLocation}
                  style={{
                    marginLeft: "auto",
                    marginTop: 20,
                    padding: 6,
                    marginRight: 40,
                    borderRadius: 8,
                    backgroundColor: colors.whitesmoke,
                  }}
                >
                  <Text style={{ fontSize: 12 }}>current location</Text>
                </TouchableOpacity>
                <View style={styles.modalView}>{this.GooglePlacesInput()}</View>
              </>
            ) : (
              <TouchableOpacity
                onPress={() => this.setState({ showAddress: true })}
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
                    Where?
                  </Text>
                  <Text style={{ color: "black", fontSize: 12 }}>Address</Text>
                </View>

                <Image
                  style={{ height: 16, width: 16, marginRight: 15 }}
                  source={require("../../assets/arrowRight.png")}
                />
              </TouchableOpacity>
            )}

            {/* <View style={{ paddingBottom: 90 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "700",
                  paddingHorizontal: 30,
                  paddingTop: 30,
                }}
              >
                Select any Image for an Event
              </Text>
              <View
                style={{
                  backgroundColor: "white",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  marginTop: 15,
                  marginHorizontal: 25,
                  borderRadius: 15,
                }}
              >
                {this.state.eventDefaultImgs.map((elem, index) => {
                  return (
                    <View style={{ position: "relative", marginLeft: 5 }}>
                      <TouchableOpacity
                        onPress={() =>
                          this.setState({ selectedImgIndex: elem.id })
                        }
                        style={{
                          alignItems: "center",
                          zIndex: 10,
                          width: 100,
                          height: 100,
                          borderBottomColor: "gray",
                          borderBottomWidth: 1,
                        }}
                      >
                        <Image
                          style={{
                            width: "100%",
                            height: "100%",
                            resizeMode: "cover",
                          }}
                          source={{ uri: elem.image }}
                        />
                      </TouchableOpacity>

                      {this.state.selectedImgIndex === elem.id && (
                        <TouchableOpacity
                          style={{
                            alignItems: "center",
                            zIndex: 10,
                            position: "absolute",
                            width: 100,
                            height: 100,
                            borderBottomColor: "gray",
                            borderBottomWidth: 1,
                          }}
                        >
                          <Image
                            style={{
                              width: "100%",
                              height: "100%",
                              resizeMode: "cover",
                            }}
                            source={require("../../assets/overlay2.png")}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })}
              </View>
            </View> */}
              <View style={{ width: "100%", alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                <View style={{
                  height: 227,
                  overflow: "hidden",
                  borderRadius: 20,
                  marginTop: 20,
                  width: "90%"
                }}>
                  {this.showMap()}
                </View>
              </View>


          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            const { title, location, address } = this.state;
            if (title && location && address !== -1) {
              console.log("this.state.setLatitude")
              console.log(this.state.setLatitude)
              console.log("this.state.setLongitude")
              console.log(this.state.setLongitude)
              this.props.navigation.navigate("AddEvent2", {
                title: title,
                location: location,
                address: address,
                latitude:this.state.setLatitude,
                longitude:this.state.setLongitude
                // eventImg: selectedImgIndex,
              });
            } else {
              Toast.show("Kindly Fill all fields");
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
      </>
    );
  }

  closeIconPress = (value) => {
    console.log("index =====> ", value);
    var arrData = [];
    this.state.arrSomeOneBrings.map((data, index) => {
      if (index != value) {
        arrData.push(data);

      }
    });
    console.log(arrData);
    this.setState({
      arrSomeOneBrings: arrData,
    });
  };

  GooglePlacesInput = () => {
    return (
      <View
        style={{
          flex: 1,
          marginTop: 0,
          height: 200,
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 0,
          width: "100%",
          // elevation: 0,
          // borderColor: "gray",
          // borderWidth: 1,
          // backgroundColor: "transparent",
        }}
      >
        <View
          style={{ flex: 1, width: "100%", marginTop: 10, borderRadius: 20 }}
        >
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
              // props.notifyChange(details.geometry.location);
              console.log("search places dataa ", JSON.stringify(data));
              // console.log("search places details ", JSON.stringify(details));
              console.log("location ", details.geometry.location);
              console.log("formatted_address ", details.formatted_address);
              this.setModalVisible(false);
              const location = {
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
              };
              this.setState({ location, address: details.formatted_address,
                setLatitude:details.geometry.location.lat,
                setLongitude:details.geometry.location.lng
              });
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
            styles={{
                container: {
                    borderBottomWidth: 0,
                    flex:1,
                    height:200
                },
                textInputContainer: {
                    borderRadius:40,
                    // height:200

                },
                textInput: {
                    // height : 180,
                    borderRadius: 180,
                    paddingHorizontal:20,
                    elevation:3,
                    borderWidth: 1,
                    borderColor: 'gray',
                },
            }}
            ref={(ref) => {
              this.placesRef = ref;
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
            latitude: Number(this.state.setLatitude),
            longitude: Number(this.state.setLongitude),
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
          initialRegion={{
            latitude: Number(this.state.setLatitude),
            longitude: Number(this.state.setLongitude),
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
              latitude: Number(this.state.setLatitude),
              longitude: Number(this.state.setLongitude),
            }}
          />
        </MapView>
      </View>
    );
  };

  handleChange = (values) => {
    console.log("slider value change ====> ", values);
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
    var options = {
      title: "Select Image",
      includeBase64: false,
      quality: 0.5,
      mediaType: "photo",
    };

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

  validation = () => {
    if (this.state.title.trim().length == 0) {
      Toast.show("Please enter event title");
      return;
    } else if (this.state.address.trim().length == 0) {
      Toast.show("Please enter address");
      return;
    } else if (this.state.eventDate.trim().length == 0) {
      Toast.show("Please select date");
      return;
    } else if (this.state.details.trim().length == 0) {
      Toast.show("Please enter details");
      return;
    } else if (this.state.selected_number_of_participant.trim().length == 0) {
      Toast.show("Please enter number of participant");
      return;
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
      this.callAddEventApi();
    }
  };

  callAddEventApi = async () => {
    var formdata = new FormData();
    formdata.append("token", this.props.userInfo.token);
    formdata.append("event_title", this.state.title);
    formdata.append("event_address", this.state.address);
    formdata.append("lats", this.state.location.latitude);
    formdata.append("longs", this.state.location.longitude);
    // formdata.append("event_date", "2021-07-30");
    const eventDate = moment(this.state.eventDate, "DD/MM/YYYY").format(
      "YYYY-MM-DD"
    );
    console.log("eventDate ", eventDate);
    formdata.append("event_date", eventDate);
    formdata.append("event_time", this.state.eventTime);
    formdata.append("event_description", this.state.details);
    formdata.append(
      "participants_limit",
      this.state.selected_number_of_participant
    );
    formdata.append("event_mode", this.state.mode_type);
    formdata.append("event_participant", this.state.invite_friend.join(",")); //- need to discuss with Praveen
    formdata.append("invite_squad", this.state.invite_squad.join(","));
    formdata.append("invite_user", this.state.invite_friend.join(","));
    formdata.append(
      "event_chat_enabled",
      this.state.add_to_people_group_chat ? 1 : 0
    );
    // const age_range = `${this.state.minAge}-${this.state.maxAge}`
    // formdata.append("age_range",age_range);
    formdata.append("min_age", String(this.state.minAge));
    formdata.append("max_age", String(this.state.maxAge));

    if (this.state.arrSomeOneBrings.length > 0) {
      formdata.append("someone_bring", this.state.arrSomeOneBrings.join(","));
    }

    console.log("Parameter ", formdata);
    postMethod(
      null,
      "createEvent",
      formdata,
      (success) => {
        this.props.navigation.goBack();
      },
      (error) => {
        console.error("postMethod error", error);
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
  inputStyle: {
    fontSize: 16,
    fontFamily: fonts.Regular,
    backgroundColor: "white",
    elevation: 2,
    width: "100%",
    height: 45,
    borderRadius: 180,
    paddingHorizontal: 20,
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
  modalView: {
    // marginTop: 20,
    // backgroundColor: "green",
    // height:300,
    // borderRadius: 180,
    // paddingHorizontal: 20,
    // flex: 1,
    // height:'100%'
    paddingHorizontal: 20,
    marginHorizontal: 20,
    zIndex: 200,
    height: 130,
    paddingHorizontal: 5,
    display: "flex",
    justifyContent: "center",
    borderBottomColor: colors.bottomBorderColor,
    borderBottomWidth: 0,
    borderRadius: 20,
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
