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
  ActivityIndicator,
  ImageBackground,
  Dimensions,
} from "react-native";
import { colors, fonts, SCREEN_SIZE } from "../../common/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-simple-toast";
import { connect } from "react-redux";
import { setLocation } from "../../redux/Actions/UserAction";
// import { Image } from 'react-native-elements';
import Geolocation from "react-native-geolocation-service";
import HeaderWithoutBack from "../components/headerWithoutBack";
import { postMethod } from "../../Networking/APIModel";
const WINDOW_WIDTH = Dimensions.get("window").width;

class DashboardComponent extends Component {
  constructor() {
    super();
    this.state = {
      code: "",
      isCheck: false,
      birthDate: "",
      images: [
        // "",
       "",
       "",
        // "",
         "",
          "",
          //  "",
            ""],
      arrGridColors: [
        // "#C7158C",
        "#C7158C",
        // "#EE435A",
        "#1583BC",
        "#E7E2D2",
        // "#00A351",
        "#00A351",
      ],
      // arrGridTitle: ['My Squads', 'Games again', 'Shuffle', 'Friendlist', 'Scouting', 'Settings'],
      arrGridTitle: [
        // "Notifications",
        "My Squads",
        "Games Again",
        "Shuffle",
        // "My Profile",
        "Friends List",
        "Shop",
        // "Settings",
      ],
      selectedIndex: -1,
      arrInterest: ["Drinking", "Playing games"],
      forceLocation: true,
      highAccuracy: true,
      locationDialog: true,
      significantChanges: false,
      observing: false,
      foregroundService: false,
      useLocationManager: false,
    };
  }

  async componentDidMount() {
    // const getUserInfo = await AsyncStorage.getItem("user_info")

    // messaging().onNotificationOpenedApp(async remoteMessage => {
    // })
    this.getLocationUpdates();
    this.getUserProfile();
  }

  callGetUserProfile = async () => {
    // this.setState({ loading: true })
    let phoneNumber = this.props.userInfo.phone_number;
    const device_token = await AsyncStorage.getItem("token");
    const device_type = await AsyncStorage.getItem("device_type");

    var parameter = new FormData();
    parameter.append("phone_number", phoneNumber);
    parameter.append("device_token", device_token);
    parameter.append("device_type", device_type);

    postMethod(
      this.props.navigation,
      "viewProfile",
      parameter,
      (success) => {
        // this.setState({ loading: false })
        if (success.hasOwnProperty("viewProfile")) {
          this.props.setUserInfo(success.viewProfile);
        }
      },
      (error) => {}
    );
  };

  getUserProfile = async () => {
    //this.setState({ loading: true })
    const device_token = await AsyncStorage.getItem("token");
    const device_type = await AsyncStorage.getItem("device_type");

    var parameter = new FormData();
    parameter.append("phone_number", this.props.userInfo.phone_number);
    parameter.append("device_token", device_token);
    parameter.append("device_type", device_type);

    ApiHelper.post("viewProfile", parameter)
      .then((response) => {
        if (response.status == 200) {
          this.setState({
            loading: false,
            radius: response.data.viewProfile.radius,
            age: response.data.viewProfile.ageRange,
            location: response.data.viewProfile.location,
          });
          if (response.data.status == "SUCCESS") {
            let userInfo = response.data.viewProfile;
            userInfo.image = [userInfo.image[userInfo.image.length - 1]];
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

  componentWillUnmount() {
    StatusBar.setBarStyle("default", true);
  }

  render() {
    const { userInfo, navigation } = this.props;
    return (
      <View style={{ flex: 1, backgroundColor: colors.black }}>
        <StatusBar
          backgroundColor={"transparent"}
          translucent
          barStyle="light-content"
        />
        <ImageBackground
          style={{ height: "100%", width: "100%" }}
          source={require("../../assets/menuBgImage.png")}
        >
          <View style={{ width:"100%"}}>
            
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flexDirection:"row"
              }}
            >
               <View
              style={{
                backgroundColor: "transparent",
                justifyContent: "center",
                alignItems: "center",
               width:"15%"
              }}
            >
                <Image
                          source={require(`../../assets/left_icon2.png`)}
                          style={{ height: 25, width: 25,resizeMode:"contain" }}
                        />
            </View>
<View style={{ width:"70%",justifyContent:"center",alignItems:"center"}}>
  <View style={{width:"19%"}}>
  <TouchableOpacity
                active={0.8}
                onPress={() => {
                  navigation.navigate("Profile");
                }}
                style={{
                  marginTop: 70,
                  backgroundColor: "transparent",
                  borderRadius: 78,
                  borderColor: colors.white,
                  borderWidth: 1,
                 
                }}
              >
                {userInfo &&
                userInfo.hasOwnProperty("image") &&
                userInfo.image.length > 0 ? (
                  <Image
                    style={{ height: 46, width: 46, borderRadius: 78 }}
                    source={{ uri: userInfo.image[0].image }}
                    loadingIndicatorSource={<ActivityIndicator />}
                  />
                ) : (
                  <Image
                    style={{ height: 46, width: 46, borderRadius: 78 }}
                    source={require("../../assets/userPlaceholder.png")}
                  />
                )}
              </TouchableOpacity>
            
  </View>
  <Text
                style={{
                  color: colors.white,
                  fontFamily: fonts.Medium,
                  fontSize: 12,
                  paddingTop: 5,
                  paddingBottom: 50,
                }}
              >
                {userInfo.full_name}
              </Text>
</View>
<TouchableOpacity

              style={{
                backgroundColor: "transparent",
                justifyContent: "center",
                alignItems: "center",
               width:"15%"
              }}
              onPress={() => this.props.navigation.navigate("Setting")}
            >
                <Image
                          source={require(`../../assets/setting2.png`)}
                          style={{ height: 22, width: 22,resizeMode:"contain" }}

                        />
            </TouchableOpacity>
             
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ marginHorizontal: 10 }}
            >
              <FlatList
                numColumns={1}
                data={this.state.arrGridColors}
                keyExtractor={(index) => index.toString()}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ selectedIndex: index });
                      this.onPressOption(index);
                    }}
                    activeOpacity={0.8}
                    style={styles.menuList}
                  >
                    <View
                      style={{
                        width: 60,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {/* {index == 0 ? (
                        <Image
                          source={require(`../../assets/new_notification.png`)}
                          style={{ height: 24, width: 24 }}
                        />
                      ) :  */}
                      
                     { index == 0 ? (
                        <Image
                          source={require(`../../assets/mySquad.png`)}
                          style={{ height: 25, width: 25 }}
                        />
                      )
                      //  : index == 1 ? (
                      //   <Image
                      //     source={require("../../assets/new_profile.png")}
                      //     style={{ height: 25, width: 25 }}
                      //   />
                      // ) 
                      : index == 1 ? (
                        <Image
                          source={require(`../../assets/playing_games3.png`)}
                          style={{ height: 20, width: 20 }}
                        />
                      ) 
                      : index == 2 ? (
                        <Image
                          source={require(`../../assets/shuffle-bottom.png`)}
                          style={{ height: 21, width: 21 }}
                        />
                      )
                      : index == 3 ? (
                        <Image
                          source={require(`../../assets/friendList.png`)}
                          style={{ height: 21, width: 21 }}
                        />
                      )
                      : index == 4 ? (
                        <Image
                          source={require(`../../assets/shop.png`)}
                          style={{ height: 21, width: 21 }}
                        />
                      ) 
                      // : index == 4 ? (
                      //   <Image
                      //     source={require(`../../assets/setting.png`)}
                      //     style={{ height: 25, width: 25 }}
                      //   />
                      // ) 
                   
                       : null}
                    </View>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          left: 2,
                          fontFamily: fonts.Medium,
                          fontSize: 13,
                          color: "white",
                        }}
                      >
                        {this.state.arrGridTitle[index]}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: 60,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        style={{
                          height: 14,
                          width: 14,
                        }}
                        source={require("../../assets/back.png")}
                      />
                    </View>
                  </TouchableOpacity>
                )}
              />
            </ScrollView>
          </View>
        </ImageBackground>
      </View>
    );
  }

  // onPressOption = (index) => {
  //   const { navigation } = this.props;
  //   switch (index) {
  //     // case 0:
  //     //   navigation.navigate("NotificationPanel");
  //     //   break;
  //     case 0:
  //       navigation.navigate("MySquad");
  //       break;
  //       case 1:
  //         navigation.navigate("ActivateScounting",{activeScout:false});
  //         break;
  //         case 2:
  //           navigation.navigate("ActivateScounting",{activeScout:false});
  //           break;
  //     // case 1:
  //     //   navigation.navigate("Profile");
  //     //   break;
  //     case 2:
  //       navigation.navigate("AddFriend");
  //       break;
  //     case 3:
  //       navigation.navigate("ActivateScounting");
  //       break;
  //     // case 4:
  //     //   navigation.navigate("Setting");
  //     //   break;

  //     default:
  //       break;
  //   }
  // };
  onPressOption = (index) => {
    const { navigation } = this.props;
    switch (index) {
      // case 0:
      //   navigation.navigate("NotificationPanel");
      //   break;
      case 0:
        navigation.navigate("MySquad");
        break;
        case 1:
          navigation.navigate("ActivateScounting",{activeScout:false});
          break;
          case 2:
            navigation.navigate("ActivateScounting",{activeScout:false});
            break;
      // case 1:
      //   navigation.navigate("Profile");
      //   break;
      case 3:
        navigation.navigate("AddFriend");
        break;
      case 4:

        navigation.navigate("ActivateScounting",{activeScout:false});
        break;
      // case 4:
      //   navigation.navigate("Setting");
      //   break;

      default:
        break;
    }
  };
  updateLatLongApi = async () => {
    const latitude = await AsyncStorage.getItem("latitude");
    const longitude = await AsyncStorage.getItem("longitude");

    let token = this.props.userInfo.token;
    var parameter = new FormData();
    parameter.append("token", token);
    parameter.append("lats", latitude);
    parameter.append("longs", longitude);
    // token:WMZQi22cZPCBLGo22fT5
    // lats:28.323
    // longs:26.876

    postMethod(
      this.props.navigation,
      "updateLatLong",
      parameter,
      (response) => {
        this.props.setLocation(response.updateLatLong);
      },
      (error) => {
        Toast.show(error.message);
      }
    );

    // ApiHelper.post('updateLatLong',parameter).then((response) => {
    //     if (response.status == 200) {
    //         if (response.data.status == 'SUCCESS') {
    //             this.props.setLocation(response.data.updateLatLong)
    //         } else {
    //             console.error(response.data.message);
    //             if (response.data.message) {
    //                 Toast.show(response.data.message)
    //             }
    //         }
    //     }
    // }).catch((error) => {
    //     Toast.show(error.message)
    // })
  };

  getLocationUpdates = async () => {
    Geolocation.watchPosition(
      (position) => {
        // setLocation(position);
        let coordinate = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        this.setState({ location: coordinate });
        AsyncStorage.setItem("latitude", coordinate.latitude.toString());
        AsyncStorage.setItem("longitude", coordinate.longitude.toString());
        Geolocation.stopObserving();
        this.updateLatLongApi();
      },
      (error) => {
        console.error(error);
        if (error.code == 1) {
          //   this.locationPermission()
        }
      },
      {
        accuracy: {
          android: "high",
          ios: "best",
        },
        enableHighAccuracy: this.state.highAccuracy,
        distanceFilter: 0,
        interval: 5000,
        fastestInterval: 2000,
        forceRequestLocation: this.state.forceLocation,
        forceLocationManager: this.state.useLocationManager,
        showLocationDialog: this.state.locationDialog,
        useSignificantChanges: this.state.significantChanges,
      }
    );
  };
}

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
  menuList: {
    backgroundColor: "black",
    borderRadius: 10,
    width: WINDOW_WIDTH - 60,
    height: 60,
    alignSelf: "center",
    marginBottom: 10,
    flexDirection: "row",
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
});

const mapStateToProps = (state) => {
  return {
    location: state.user.location,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setLocation: (data) => dispatch(setLocation(data)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(DashboardComponent);
