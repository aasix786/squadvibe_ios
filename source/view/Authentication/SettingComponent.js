import React, { PureComponent } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  PermissionsAndroid,
  Dimensions,
  ImageBackground,
  Image,
  StatusBar,
} from "react-native";
import { colors, fonts } from "../../common/colors";
import ApiHelper from "../../Networking/NetworkCall";
import { HeadingText } from "../../common/HeadingText";
import { Icon, Slider, SearchBar } from "react-native-elements";
import { connect } from "react-redux";
import Header from "../components/header";
import Button from "../components/button";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { postMethod } from "../../Networking/APIModel";
import Toast from "react-native-simple-toast";
import Geolocation from "@react-native-community/geolocation";
import axios from "axios";
import { createIconSetFromFontello } from "react-native-vector-icons";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import Ripple from "react-native-material-ripple";
import ToggleSwitch from 'toggle-switch-react-native';
const WINDOW_WIDTH = Dimensions.get("window").width;

export function getAddressComponent(address_components, key) {
  var value = "";
  var postalCodeType = address_components.filter((aComp) =>
    aComp.types.some((typesItem) => typesItem === key)
  );
  if (postalCodeType != null && postalCodeType.length > 0)
    value = postalCodeType[0].long_name;
  return value;
}

export let placeAddresCompoponent = {
  ZIP_CODE: "postal_code",
  COUNTRY: "country",
  STATE: "administrative_area_level_1",
  CITY: "administrative_area_level_2",
  TOWN: "sublocality_level_1",
  AREA: "sublocality_level_2",
  NEAREST_ROAD: "route",
};

class SettingComponent extends PureComponent {
  updateTeleSearch = (Telephone_search) => {
    this.setState({ Telephone_search });
  };

  updateEmailSearch = (Email_search) => {
    this.setState({ Email_search });
  };

  constructor() {
    super();
    this.state = {
      code: "",
      isCheck: false,
      birthDate: "",
      images: ["", ""],
      selectedIndex: -1,
      search: "",
      radius: 10,
      age: 35,
      address: "",
      squad_id: "",
      isFromMySquad: "",
      zip_code: "",
      city: "",
      loading: false,
      Telephone_search: "",
      Email_search: "",
      availability: "",
      current: "main",
      location: "None",
      multiSliderValue: [20, 50],
    };
  }

  componentDidMount() {
    this.props.navigation.addListener("focus", () => {
      this.getUserProfile();
    });
    const { userInfo } = this.props;
    if (this.props.route.params !== undefined) {
      const { data, isFromMySquad } = this.props.route.params;
      if (isFromMySquad != undefined && isFromMySquad == true) {
        this.setState({
          isFromMySquad,
          city: data.location,
          zip_code: data.zip,
          radius: data.distance,
          squad_id: data.squad_id,
        });
        console.log("radius")
        console.log(this.state.radius)
        console.log("radius")
        console.log(this.state.radius)
      }
    }
  }

  getUserProfile = async () => {
    //this.setState({ loading: true })
    const device_token = await AsyncStorage.getItem("token");
    const device_type = await AsyncStorage.getItem("device_type");
    var parameter = new FormData();
    parameter.append("phone_number", this.props.userInfo.phone_number);
    parameter.append("device_token", device_token);
    parameter.append("device_type", device_type);
    console.log("PAPA", parameter);

    ApiHelper.post("viewProfile", parameter)
      .then((response) => {
        console.log("RESSSS", response.data);
        if (response.status == 200) {
          // this.setState({ loading: false,radius:response.data.viewProfile.radius,age:response.data.viewProfile.ageRange,location:response.data.viewProfile.location })
          this.placesRef &&
            this.placesRef.setAddressText(response.data.viewProfile.location);
          console.log("viewProfileviewProfile", response.data.viewProfile);
          if (response.data.status == "SUCCESS") {
            let userInfo = response.data.viewProfile;
            console.log("INFOOABC", userInfo.phone_number, userInfo.email);
            this.setState({
              Telephone_search: userInfo.phone_number,
              Email_search: userInfo.email,
              loading: false,
              radius: response.data.viewProfile.radius,
              age: response.data.viewProfile.ageRange,
              location: response.data.viewProfile.location,
            });
            this.props.setUserInfo(userInfo);
            AsyncStorage.setItem("user_info", JSON.stringify(userInfo));
          } else {
            console.error(response.data.message);
            if (response.data.message) {
              Toast.show(response.data.message);
            }
          }
        }
      })
      .catch((error) => {
        //   Toast.show(error.message)
      });
  };

  save = () => {
    if (this.state.location) {
      var formdata = new FormData();
      formdata.append("token", this.props.userInfo.token);
      formdata.append("ageRange", this.state.age);
      formdata.append("radius", this.state.radius);
      // formdata.append("location", 'Karachi')
      formdata.append("location", this.state.location);
   
    } else {
      Toast.show("Please Select Location");
    }

    postMethod(
      this.props.navigation,
      "updateUserFields",
      formdata,
      (response) => {
        
        if (response.status === "SUCCESS") {
          Toast.show("Your data is saved Successfully.");
          getUserProfile();
        } else {
          Toast.show("Sorry unable to save data");
        }
        Toast.show("Friend request sent Successfully.")
      },
      (error) => {
        // if(error.requestKey==='Number does not exist')
        // {
        //     Toast.show('Please enter the correct number')
        // }
        // console.error("error = ", JSON.stringify(error));
        // Toast.show(error.message)
      }
    );
  };

  deleteAccount = () => {
    var parameter = new FormData();
    parameter.append("token", this.props.userInfo.token);
    postMethod(this.props.navigation, "deleteUser", parameter, (response) => {
      if (response.message == "User deleted Successfully.") {
        axios
          .post("http://squadvibes.onismsolution.com/api/uploadFCMToken", {
            token: this.props.userInfo.token,
            fcm_token: "",
          })
          .then((res) => {});
        AsyncStorage.clear();
        this.props.navigation.navigate("Welcome");
      }
    });
  };

  logout = () => {
    axios
      .post("http://squadvibes.onismsolution.com/api/uploadFCMToken", {
        token: this.props.userInfo.token,
        fcm_token: "",
      })
      .then((res) => {
        AsyncStorage.clear();
        this.props.navigation.navigate("Welcome");
      })
      .catch((err) => Toast.show(err));
  };

  mainPage() {
    return (
      <>
        <TouchableOpacity
          onPress={() => this.setState({ current: "settings" })}
          style={styles.buttonContainer}
        >
          <Text style={styles.buttonContainerText}>Account Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.deleteAccount}
          style={styles.buttonContainer}
        >
          <Text style={styles.buttonContainerText}>Delete Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.logoutPopup}
          style={styles.buttonContainer}
        >
          <Text style={styles.buttonContainerText}>Logout</Text>
        </TouchableOpacity>
      </>
    );
  }

  deletePopup = () => {
    Alert.alert("Delete Account!", "Are you sure you want to delete ?", [
      {
        text: "cancle",
        onPress: () => console.log("Cancel Pressed"),
      },
      {
        text: "Yes",
        onPress: () => this.deleteAccount(),
      },
    ]);
  };

  logoutPopup = () => {
    Alert.alert("Logout!", "Are you sure you want to Logout ?", [
      {
        text: "cancle",
        onPress: () => console.log("Cancel Pressed"),
      },
      {
        text: "Yes",
        onPress: () => this.logout(),
      },
    ]);
  };

  getlocationanmefromltlng = async () => {
    let placename;
    let latlng =
      this.state.aregion.latitude + "," + this.state.aregion.longitude;
    console.error("latlng", latlng);
    var url =
      "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
      latlng +
      "&key=AIzaSyCAcgEQMvho7rnMg-cV7wLEZjJLoH50ehk";
    await fetch(url, { method: "GET" })
      .then((res) => res.json())
      .then((res) => {
        let mcountry;
        let mstate;
        let mcity;
        res.results.forEach((element) => {
          var mainarr = element.address_components;
          for (let i = 0; i < mainarr.length; i++) {
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
        });
        if (res.results[0]) {
          placename = res.results[0].formatted_address;
        } else {
          placename = " ";
        }
        this.setState({
          country: mcountry,
          state: mstate,
          city: mcity,
          formattedadress: placename,
          selectedlocatiom: placename,
          location: placename,
        });
        this.placesRef && this.placesRef.setAddressText(placename);
      })
      .catch((ers) => {
        console.warn(ers);
      });
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

  getCurrentLocation = () => {
    // this.requestLocationPermission()

    Geolocation.getCurrentPosition(
      (position) => {
        console.log("getCurrentLocation", position);
        this.setState(
          {
            aregion: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.025,
              longitudeDelta: 0.025,
            },
          },
          () => this.getlocationanmefromltlng()
        );
      },
      (error) => {
        Toast.show("Your location is off you have to enable it.");
        this.setState({ error: error.message });
      },
      {
        enableHighAccuracy: false,
        timeout: 200000,
        forceRequestLocation: true,
        showLocationDialog: true,
      }
    );
  };

  multiSliderValuesChange = (values) => {
    console.log(values);
    this.setState({ multiSliderValue: values });
  };

  settings() {
    const multiSliderValue = this.state.multiSliderValue;

    const { Telephone_search, Email_search } = this.state;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "black",
          borderTopRightRadius: 30,
          borderTopLeftRadius: 30,
        }}
      >
        <View
          style={{
            height: 3,
            width: 86,
            borderRadius: 10,
            backgroundColor: "#595959",
            margin: 12,
            alignSelf: "center",
          }}
        />
        <Text
          style={{
            color: "white",
            fontSize: 16,
            fontFamily: fonts.Bold,
            textAlign: "center",
            padding: 20,
          }}
        >
          Account Settings
        </Text>
        <View style={{ height: 10 }} />
        <ScrollView
          style={{ flexGrow: 1 }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          listViewDisplayed={false}
        >
          <SearchBar
            //  editable={false}
            containerStyle={{
              borderWidth: 0,
              width: WINDOW_WIDTH - 60,
              backgroundColor: null,
              borderBottomColor: "transparent",
              borderTopColor: "transparent",
              paddingHorizontal: 0,
              alignSelf: "center",
            }}
            placeholder="E-Mail"
            placeholderTextColor="black"
            onChangeText={this.updateEmailSearch}
            value={Email_search}
            onTouchEnd={() =>
              this.props.navigation.navigate("ChangeEmail", Email_search)
            }
            inputContainerStyle={{
              alignContent: "center",
              alignItems: "center",
              backgroundColor: "white",
              borderRadius: 30,
              justifyContent: "center",
            }}
            inputStyle={{
              color: colors.BLACK,
              fontSize: 13,
              textAlign: "center",
            }}
            searchIcon={false}
          />

          <SearchBar
            onTouchEnd={() =>
              this.props.navigation.navigate("ChangeNumber", Telephone_search)
            }
            // editable={false}
            containerStyle={{
              borderWidth: 0,
              width: WINDOW_WIDTH - 60,
              backgroundColor: null,
              borderBottomColor: "transparent",
              borderTopColor: "transparent",
              paddingHorizontal: 0,
              alignSelf: "center",
            }}
            placeholder="Phone"
            placeholderTextColor="black"
            onChangeText={this.updateTeleSearch}
            value={Telephone_search?.toString()}
            inputContainerStyle={{
              alignContent: "center",
              alignItems: "center",
              backgroundColor: "white",
              borderRadius: 30,
              justifyContent: "center",
            }}
            inputStyle={{
              color: colors.BLACK,
              fontSize: 13,
              textAlign: "center",
            }}
            searchIcon={false}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 20,
              width: WINDOW_WIDTH - 60,
              alignSelf: "center",
            }}
          >
            <HeadingText
              title={"Select Location"}
              style={{
                marginTop: 0,
                fontSize: 14,
                color: colors.white,
                fontFamily: fonts.Bold,
              }}
            />
            <TouchableOpacity
              style={{
                backgroundColor: colors.whitesmoke,
                elevation: 8,
                borderRadius: 5,
                paddingVertical: 6,
                paddingHorizontal: 8,
              }}
              onPress={this.getCurrentLocation}
            >
              <Text style={{ fontSize: 12 }}>Current location</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 20,
              width: WINDOW_WIDTH - 60,
              alignSelf: "center",
            }}
          >
            <HeadingText
              title={"Notification"}
              style={{
                marginTop: 0,
                fontSize: 14,
                color: colors.white,
                fontFamily: fonts.Bold,
              }}
            />
            <TouchableOpacity
              style={{
                paddingVertical: 6,
                paddingHorizontal: 8,
              }}
              // onPress={this.getCurrentLocation}
            >
              <ToggleSwitch
                    isOn={this.state.availability}
                    onColor="#f5f5f5"
                    offColor="grey"
                    labelStyle={{color: 'black', fontWeight: '900'}}
                    size="small"
                    onToggle={isOn =>
                      this.setState({availability: !this.state.availability})
                    }
                  />
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginTop: 14,
              marginBottom: 20,
            }}
          >
            {this.GooglePlacesInput()}
          </View>

          <View>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: WINDOW_WIDTH - 60,
                  alignSelf: "center",
                }}
              >
                <HeadingText
                  title={"Distance"}
                  style={{
                    marginTop: 15,
                    fontSize: 14,
                    color: colors.white,
                    fontFamily: fonts.Bold,
                  }}
                />

                <HeadingText
                  title={`${this.state.radius} km`}
                  style={{
                    marginTop: 15,
                    fontSize: 14,
                    color: colors.white,
                    fontFamily: fonts.Bold,
                  }}
                />
              </View>
              <View style={{ marginTop: 15 }}>
                <Slider
                  value={this.state.radius}
                  maximumValue={100}
                  style={{
                    zIndex: 5,
                    width: WINDOW_WIDTH - 60,
                    alignSelf: "center",
                  }}
                  thumbTintColor={colors.white}
                  maximumTrackTintColor={"#D3CEC0"}
                  minimumTrackTintColor={colors.white}
                  thumbStyle={{
                    width: 20,
                    height: 20,
                    backgroundColor: "black",
                    borderColor: "white",
                    borderWidth: 3,
                  }}
                  onValueChange={(value) => {
                    this.setState({
                      radius: parseInt(value),
                    });
                  }}
                />
              </View>
            </View>

            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: WINDOW_WIDTH - 60,
                  alignSelf: "center",
                }}
              >
                <HeadingText
                  title={"Age"}
                  style={{
                    marginTop: 15,
                    fontSize: 14,
                    color: colors.white,
                    fontFamily: fonts.Bold,
                  }}
                />
                <HeadingText
                  title={`${this.state.age}`}
                  style={{
                    marginTop: 15,
                    fontSize: 14,
                    color: colors.white,
                    fontFamily: fonts.Bold,
                  }}
                />
              </View>

              <View style={{ marginTop: 15 }}>
                <Slider
                  value={this.state.age}
                  maximumValue={100}
                  style={{
                    zIndex: 5,
                    width: WINDOW_WIDTH - 60,
                    alignSelf: "center",
                  }}
                  thumbTintColor={colors.white}
                  maximumTrackTintColor={"#D3CEC0"}
                  minimumTrackTintColor={colors.white}
                  thumbStyle={{
                    width: 20,
                    height: 20,
                    backgroundColor: "black",
                    borderColor: "white",
                    borderWidth: 3,
                  }}
                  onValueChange={(value) => {
                    this.setState({
                      age: parseInt(value),
                    });
                  }}
                />
              </View>
            </View>
          </View>

          <Button
            style={{ bottom: 0, top: 30, position: "relative" }}
            name="Save"
            bg={colors.white}
            textColor={"black"}
            clicked={this.save}
          />

          <View style={{ height: 20 }} />

          <TouchableOpacity
            onPress={this.deletePopup}
            style={[styles.textContainer, { marginTop: 30, marginBottom: 20 }]}
          >
            <Text style={styles.text}>Delete Account</Text>
            <FontAwesome name="angle-right" size={20} color="gray" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={this.logoutPopup}
            style={styles.textContainer}
          >
            <Text style={styles.text}>Logout</Text>
            <FontAwesome name="angle-right" size={20} color="gray" />
          </TouchableOpacity>

          <View style={{ height: 20 }} />
        </ScrollView>
      </View>
    );
  }

  render() {
    let current = this.settings();

    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <StatusBar
          backgroundColor={"transparent"}
          translucent
          barStyle="dark-content"
        />
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
            <View style={{ flex: 1 }} />
            <View style={{ width: 60 }} />
          </View>
        </View>

        {current}
      </View>
    );
  }
  GooglePlacesInput = () => {
    return (
      <View
        style={{
          width: WINDOW_WIDTH - 60,
          alignSelf: "center",
          marginTop: 15,
          borderRadius: 20,
          height: "auto",
          flexDirection: "row",
        }}
      >
        {/* <Image
          source={require("../../assets/locationMarker.png")}
          style={{ height: 16, width: 16 }}
        /> */}
        <GooglePlacesAutocomplete
          styles={{
            textInput: {
              borderRadius: 25,
              borderColor: "white",
              borderWidth: 2,
              backgroundColor: "transparent",
              color: "white",
            },
            containerStyle: { borderRadius: 25 },
            listView: { borderRadius: 20 },
          }}
          keyboardShouldPersistTaps={"handled"}
          listViewDisplayed={"auto"}
          placeholder="Select location"
          placeholderTextColor={"white"}
          value={"abababab"}
          minLength={2}
          returnKeyType={"search"}
          fetchDetails={true}
          onPress={(data, details = null) => {
            var zipCode = getAddressComponent(
              details.address_components,
              placeAddresCompoponent.ZIP_CODE
            );
            var city = getAddressComponent(
              details.address_components,
              placeAddresCompoponent.CITY
            );
            var coutry = getAddressComponent(
              details.address_components,
              placeAddresCompoponent.COUNTRY
            );
            var state = getAddressComponent(
              details.address_components,
              placeAddresCompoponent.STATE
            );
            if (
              this.state.isFromMySquad !== undefined &&
              this.state.isFromMySquad
            ) {
              alert("IFF");
              var city_name = "";
              if (city != undefined) {
                city_name += city;
              }
              if (state != undefined) {
                city_name += state;
              }
              if (coutry != undefined) {
                city_name += coutry;
              }
              this.setState({
                city: city_name,
                zip_code: zipCode,
              });
            } else {
              var city_name = "";
              if (city != undefined) {
                city_name = " " + city;
              }
              if (state != undefined) {
                city_name += " " + state;
              }
              if (coutry != undefined) {
                city_name += " " + coutry;
              }
              this.setState({
                location: details.formatted_address,
              });
            }
          }}
          query={{
            key: "AIzaSyDZRd7CisUH6tg733-02d57hQ23B1ANR1k",
            language: "en",
            radius: 10000,
          }}
          GooglePlacesSearchQuery={{
            rankby: "distance",
          }}
          nearbyPlacesAPI="GooglePlacesSearch"
          debounce={300}
          onFail={(error) => console.log("ERROR", error)}
          onNotFound={(error) => console.log("ERROR = ", error)}
          ref={(ref) => {
            this.placesRef = ref;
          }}
        />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  passwordContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#D9D5C6",
    paddingBottom: 10,
    marginHorizontal: 16,
  },
  textContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    elevation: 2,
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 15,
    justifyContent: "space-between",
    width: WINDOW_WIDTH - 60,
    alignSelf: "center",
  },
  inputStyle: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.Regular,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    color: "black",
    fontWeight: "600",
  },
  buttonContainer: {
    marginHorizontal: 15,
    backgroundColor: colors.pinkbg,
    height: 70,
    alignItems: "center",
    paddingHorizontal: 15,
    justifyContent: "center",
    elevation: 2,
    display: "flex",
    marginTop: 18,
    borderBottomColor: colors.bottomBorderColor,
    borderBottomWidth: 1,
    borderRadius: 15,
    marginBottom: 15,
  },
  buttonContainerText: {
    fontFamily: fonts.Regular,
    textAlign: "center",
    fontSize: 16,
    color: colors.white,
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
});

const mapStateToProps = (state) => {
  return {
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(SettingComponent);
