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
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Share
} from "react-native";
import {
  colors,
  fonts,
  resetStackAndNavigate,
  SCREEN_SIZE,
} from "../../common/colors";
import { Icon, Dialog, Button } from "react-native-elements";
import ApiHelper from "../../Networking/NetworkCall";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-simple-toast";
import { connect } from "react-redux";
import { resetData, setUserInfo } from "../../redux/Actions/UserAction";
import Loader from "../../common/Loader";
import { postMethod } from "../../Networking/APIModel";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import ImagePicker from "react-native-image-crop-picker";
import Header from "../components/header";
import axios from "axios";
import { CustomInputField } from "../../common/inputField";
import Ripple from "react-native-material-ripple";

const WINDOW_WIDTH = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;

class ProfileComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      isCheck: false,
      birthDate: "",
      profile_image: "",
      images: [],
      selectedIndex: -1,
      arrInterest: ["Drinking", "Playing games"],
      is_logout: false,
      show_user_qrcode: false,
      user_name: "",
      bio: "",
      loading: false,
      send_invite: "",
      showUsername: false,
      showInvite: false,
      ownProfile: true,
      userInfo: null,
      data: {
        full_name: "",
        user_name: "",
        image: [],
        interest_list: [],
        user_id: ""
      },
    };
  }

  
  componentDidMount() {
    this.props.navigation.addListener("focus", () => {
      const { userInfo } = this.props;
      // this.setState({ user_name: userInfo?.full_name, showUsername: true })
      const id =
        this.props.route.params?.item?.user_id ||
        this.props.route.params?.item?.member_id;
      this.setState({ user_id: id })

      if (id) {
        this.setState({ownProfile : false})
        this.getProfile(id);
      } else {
        this.getMyProfile();
      }
    });
    // this.getUserProfile()
  }

  chooseFile = (type) => {
    let options = {
      mediaType: type,
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.7,
    };
    launchImageLibrary(options, (response) => {
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
      this.setState({profile_image: response.assets[0].uri})
      this.uploadProfileImage(response.assets[0].uri);
      // this.setFilePath2(response.assets[0]);
    });
  };

  captureImage = async () => {
    // alert("CAP")
    var options = {
      title: "Select Image",
      includeBase64: true,
      quality: 0.7,
      mediaType: "photo",
    };

    launchCamera(options, (response) => {
      if (response == undefined) {
        alert("Image not selected");
        return;
      } else if (
        response.errorCode == "Cannot convert undefined value to object"
      ) {
        alert("Image not selected");
        return;
      } else if (response.didCancel) {
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

  getUserProfile = async () => {
    //this.setState({ loading: true })
    const device_token = await AsyncStorage.getItem("token");
    const device_type = await AsyncStorage.getItem("device_type");

    var parameter = new FormData();
    parameter.append("phone_number", this.props.userInfo?.phone_number);
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
            userInfo.image = [userInfo?.image[userInfo?.image.length - 1]];
            console.log("IMAGEEEEE");
            console.log(userInfo?.image);
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

  getProfile = (user_id) => {
    const parameter = new FormData();
    parameter.append("user_id", user_id);

    axios
      .post("http://squadvibes.onismsolution.com/api/userDetails", parameter)
      .then((res) => {
        this.setState({ data: res.data.userDetails, user_name : res.data.userDetails.user_name, bio : res.data.userDetails.bio, profile_image: res.data.userDetails.profile_photo  });
        console.log("DATA_interest_list", res.data.userDetails.interest_list);
        console.log("DATA_image", res.data.userDetails.image);
        console.log("userInfo", res.data);

      })
      .catch((err) => console.log("ERROR", err));
  };

  getMyProfile = () => {
    const parameter = new FormData();
    parameter.append("user_id", this.props.userInfo?.id);

    axios
      .post("http://squadvibes.onismsolution.com/api/userDetails", parameter)
      .then((res) => {
        this.setState({ userInfo: res.data.userDetails, user_name:res.data.userDetails.user_name, bio : res.data.userDetails.bio, profile_image: res.data.userDetails.profile_photo });
        console.log("userInfo", res.data);
      })
      .catch((err) => console.log("ERROR", err));
  };

  updateProfileImage = (uri) => {
    var formData = new FormData();
    // formData.append('token', this.props.userInfo?.token)
    // formData.append('image', uri)

    formData.append("token", this.props.userInfo?.token);
    formData.append("user_id", this.props.userInfo?.id);
    formData.append("image", uri);

    ApiHelper.post("updateProfilePic", formData)
      .then((response) => {
        console.log("MMMM", response.data);
        console.log("DATA", response.status);
        this.setState({ loading: false });
        if (response.status == 200) {
          this.getUserProfile();
          if (response.data.status == "SUCCESS") {
          } else {
            console.error(response.data.message);
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
        console.error(error);
        Toast.show(error.message);
      });
  };

  captureImage2 = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      mediaType: "photo",
    }).then((image) => {
      this.setState({profile_image: image.path})

      this.uploadProfileImage(image.path);
    });
  };

  uploadProfileImage = (uri) => {
    this.setState({ loading: true });

    var parameter = new FormData();
    parameter.append("image", {
      // uri: Platform.OS === 'android' ?uri : this.state.imageResponse.uri.replace('file:/', ''),
      uri: uri,
      // type: this.state.imageResponse.type,
      type: "image/jpeg",
      name: uri,
    });
    ApiHelper.post("uploadProfileImage", parameter)
      .then((response) => {
        this.setState({ loading: false });
        if (response.status == 200) {
          if (response.data.status == "SUCCESS") {
            if (response.data.hasOwnProperty("uploadProfileImage")) {
              let image = response.data.uploadProfileImage.image;
              // this.images.push(image)
              // this.getUserProfile()
              this.setState({ images: image })
              this.updateProfileImage(image);
            }
          } else {
            console.error(response.data.message);
            if (response.data.message) {
              Toast.show(response.data.message);
            }
          }
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.error("my error", error);
        Toast.show(error.message);
      });
  };

  setFilePath(response) {
    this.uploadProfileImage(response.path);
  }
  setFilePath2(response) { }

  openImagePicker = () => {
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
          onPress: () => this.captureImage2(),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };
  removeFriend = () => {
    console.log(this.props.userInfo?.token)
    console.log(this.state.user_id)
    const parameter = new FormData();
    parameter.append("token", this.props.userInfo?.token);
    parameter.append("user_id", this.state.user_id);

    postMethod(
      this.props.navigation,
      "removeFriend",
      parameter,
      (response) => {
        console.log("leaveSquad")
        console.log(response)
        Toast.show("Friend removed successfully.");
        this.props.navigation.navigate("Dashboard")
        // const members = [...this.state.group_member];
        // members.splice(index, 1);
        // this.setState({ group_member: members });
      }
    );
  };
  render() {
    let {
      full_name,
      image,
      profile_image,
      interest_list,
      user_name,
      email,
      gender,
    } = this.state.data;
    const userInfo = this.state.userInfo;
  

    interest_list = interest_list ? interest_list : userInfo?.interest_list || [];
    email = email ? email : userInfo?.email;
    gender = gender ? gender : userInfo?.gender;

    image = !image ? [] : image;
    console.log("userInfo interest", userInfo);
    console.log("URL", image[0]?.image);
    console.log("user_id", this.props.userInfo?.id);
    console.log("this.state.user_id", this.state.user_id);

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
            Settings
          </Text>
          <View style={{ height: 10 }} />

          <ScrollView
            style={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
          <View style={{paddingBottom: WINDOW_HEIGHT / 2 }}>
          <View
              style={{
                justifyContent: "center",
                position: "relative",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                {
                    let data_val = this.state.userInfo;

                    if(!this.state.userInfo){
                      data_val = this.state.data
                    }
// console.log("data",this.state.data)
// console.log("this.state.userInfo",this.state.userInfo)
console.log("data_val",data_val)
                  this.props.navigation.navigate("ProfileView", {
                    user: data_val,
                  })
                }
              }
                style={{
                  backgroundColor: "transparent",
                  padding: 8,
                  borderRadius: 100,
                  borderColor: "white",
                  borderWidth: 3,
                }}
              >
                 <Image
                    style={{
                      height: 134,
                      width: 134,
                      borderRadius: 100,
                    }}
                    source={{ uri: this.state.profile_image }}
                    loadingIndicatorSource={<ActivityIndicator />}
                  />
                {/* {image[0]?.image && full_name ? (
                  <Image
                    style={{
                      height: 134,
                      width: 134,
                      borderRadius: 100,
                    }}
                    source={{ uri: image[0]?.image }}
                    loadingIndicatorSource={<ActivityIndicator />}
                  />
                ) : !image[0]?.image && full_name ? (
                  <Image
                    style={{ height: 134, width: 134, borderRadius: 100 }}
                    source={require("../../assets/userPlaceholder.png")}
                  />
                ) : userInfo?.image?.length > 0 ? (
                  <Image
                    style={{
                      height: 134,
                      width: 134,
                      borderRadius: 100,
                    }}
                    source={{ uri: userInfo?.image[0].image }}
                    loadingIndicatorSource={<ActivityIndicator />}
                  />
                ) : (
                  <Image
                    style={{ height: 134, width: 134, borderRadius: 100 }}
                    source={require("../../assets/userPlaceholder.png")}
                  />
                )} */}
              </TouchableOpacity>

              {userInfo &&
                userInfo?.hasOwnProperty("image") &&
                userInfo?.image.length >= 0 &&
                !full_name ? (
                <TouchableOpacity
                  style={{ marginTop: -25 }}
                  onPress={this.openImagePicker}
                >
                  <Image
                    style={{ resizeMode: "contain", width: 35, height: 35 }}
                    source={require("../../assets/icon-02.png")}
                    onPress={() => this.getUserProfile}
                  />
                </TouchableOpacity>
              ) : (
                <></>
              )}

              {full_name == "" && (
                <View
                  style={{
                    justifyContent: "center",
                    marginVertical: 20,
                    alignItems: "center",
                  }}
                />
              )}
            </View>

            <View style={{ height: 30 }} />

            <View style={{ flex: 1 }}>
              
              <View style={styles.viewStyle}>
                {userInfo?.hasOwnProperty("image") &&
                userInfo?.image.length >= 0 &&
                !full_name ? (
                  <TextInput
                
                  style={[
                    styles.inputStyle,
                    {
                      textAlign: "center",
                    },
                  ]}
                  value={this.state.user_name}
                  placeholder="Username"
                  placeholderTextColor="#989ba2"
                  onChangeText={(user_name) => this.setState({ user_name })}
                />


                ):(
                  <Text  style={[
                    styles.inputStyle,
                    {
                      textAlign: "center",
                    },
                  ]}>
                    {this.state.user_name}
                  </Text>
                )
              
              }
               
               
              </View>

              <View style={{ height: 20 }} />
{/* 
              <View
                style={{
                  minHeight: 46,
                  width: WINDOW_WIDTH - 60,
                  borderRadius: 36,
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: colors.white,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.2,
                  shadowRadius: 5,
                  elevation: 5,
                  alignSelf: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    margin: 20,
                  }}
                >
                  {interest_list.map((elem) => (
                    <View
                      style={{
                        paddingVertical: 10,
                        margin: 5,
                        backgroundColor: "#d7d7d7",
                        paddingHorizontal: 15,
                        borderRadius: 30,
                      }}
                    >
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() =>
                          this.props.navigation.navigate("GroupInterestCopy", {
                            interests: interest_list,
                          })
                        }
                      >
                        <Text style={{ color: "#444444" }}>
                          {elem.interest}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View> */}

              {/* <View style={{ height: 20 }} /> */}

              {/* <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  this.props.navigation.navigate("emailCopy", {
                    email: email,
                  })
                }
              >
                <CustomInputField editable={false} value={email} />
              </TouchableOpacity> */}

              {/* <View style={{ height: 20 }} /> */}

              {/* <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  this.props.navigation.navigate("genderCopy", {
                    gender: gender,
                  })
                }
              >
                <CustomInputField editable={false} value={gender == 0 ? "Male" : gender == 1 ? "Female" : "Others"} />
              </TouchableOpacity> */}

              {/* <View style={{ height: 20 }} /> */}
            
              {userInfo &&
                userInfo?.hasOwnProperty("image") &&
                userInfo?.image.length >= 0 &&
                !full_name ? (
              <View style={styles.viewStyle}>
                <TextInput
                  style={[
                    styles.inputStyle_bio,
                    {
                      textAlign: "center",
                      paddingLeft: 70,
                    },
                  ]}
                  // value={full_name ? full_name : userInfo?.full_name}
                  placeholder="Send Invite"
                  placeholderTextColor="#989ba2"
                  editable={false}
                // onChangeText={(user_name) => this.setState({ user_name })}
                />

                <Button
                  title="Send"
                  titleStyle={{
                    fontFamily: fonts.Medium,
                    fontSize: 11,
                  }}
                  buttonStyle={{
                    borderRadius: 30,
                    marginLeft: 5,
                    backgroundColor: colors.themeColor,
                    width: 73,
                    height: 35,
                    marginRight: 6,
                  }}
                  onPress={() => this.callSendInvite(user_name)}
                />
              </View>
                ) : (
                  <></>
                )}
  
              <View style={{ height: 20 }} />

              <View style={{  height: 100,
    width: WINDOW_WIDTH - 60,
    borderRadius: 36,
    alignItems: "center",
    backgroundColor: colors.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    alignSelf: "center",
    justifyContent:"center",
    paddingHorizontal:20,
    paddingVertical:10}}>

{userInfo?.hasOwnProperty("image") &&
                userInfo?.image.length >= 0 &&
                !full_name ? (
                <TextInput
                  style={[
                    styles.inputStyle,
                    {
                      textAlign: "center",
                      height:"100%"
                    },
                  ]}
                  multiline={true}
                  value={this.state.bio}
                  placeholder="Bio"
                  placeholderTextColor="#989ba2"
                  editable={true}
                onChangeText={(bio) => this.setState({ bio })}
                returnKeyType={"done"}
                />
                ):(
                <Text   style={[
                  styles.inputStyle,
                  {
                    textAlign: "center",
                  },
                ]}>{this.state.bio}</Text>

                )}
              </View>
              {this.props.userInfo?.id != this.props.userInfo?.id ? (
                <View style={{ paddingBottom: 10 }}>
                    <View style={{ height: 20 }} />
                  <View style={styles.viewStyle}>
                    <TextInput
                      style={[
                        styles.inputStyle,
                        {
                          textAlign: "center",
                          paddingLeft: 40,
                        },
                      ]}
                      // value={full_name ? full_name : userInfo?.full_name}
                      placeholder="Remove Friend"
                      placeholderTextColor="#989ba2"
                      editable={false}
                    // onChangeText={(user_name) => this.setState({ user_name })}
                    />

                    <Button
                      title="Remove"
                      titleStyle={{
                        fontFamily: fonts.Medium,
                        fontSize: 11,
                      }}
                      buttonStyle={{
                        borderRadius: 30,
                        marginLeft: 5,
                        backgroundColor: colors.themeColor,
                        width: 73,
                        height: 35,
                        marginRight: 6,
                      }}
                      onPress={() => this.removeFriend()}
                    />
                  </View>
                </View>

              ) : null}

            </View>
          </View>
        

          </ScrollView>
        {userInfo?.hasOwnProperty("image") &&
                userInfo?.image.length >= 0 &&
                !full_name ? (
            <TouchableOpacity onPress={() => this.callUpdateProfileData()} style={{
    height: 46,
    width: WINDOW_WIDTH - 60,
    borderRadius: 36,
    backgroundColor: colors.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    alignSelf: "center",
    justifyContent:"center",
    marginBottom:50
  }}>
                <Text style={{fontSize:18, textAlign:"center"}}>update</Text>

               
              </TouchableOpacity>
          ) : null}
         
        </View>

        <Dialog isVisible={this.state.is_logout}>
          <Dialog.Title title="Sign out" />
          <Text style={{ fontFamily: fonts.Medium, fontSize: 16 }}>
            Are you sure you want to logout?
          </Text>
          <Dialog.Actions>
            <Dialog.Button title="NO" onPress={() => this.dismissAlert()} />
            <Dialog.Button title="YES" onPress={() => this.clearData()} />
          </Dialog.Actions>
        </Dialog>

        <Loader loading={this.state.loading} />
      </View>
    );
  }

  dismissAlert() {
    this.setState({
      is_logout: false,
    });
  }

  clearData = () => {
    this.props.resetData("");
    this.dismissAlert();
    resetStackAndNavigate(this.props.navigation, "Login");
  };

  callUpdateUserName = () => {
    this.setState({ loading: true });
    var formdata = new FormData();
    formdata.append("token", this.props.userInfo?.token);
    formdata.append("user_name", this.state.user_name);
    // formdata.append("images", this.state.images)

    ApiHelper.post("updateUserName", formdata)
      .then(async (response) => {
        this.setState({ loading: false });
        if (response.status == 200) {
          if (response.data.status == "SUCCESS") {
            let user_info = await AsyncStorage.getItem("user_info");
            user_info = JSON.parse(user_info);
            // await AsyncStorage.setItem("user_info", JSON.stringify({
            //   ...user_info,
            //   full_name: this.state.user_name
            // }))

            if (response.data.hasOwnProperty("updateUserName")) {
              this.setState({
                user_name: response.data.updateUserName.user_name,
              });
              // alert("hello")
              this.getUserProfile();
            }

            if (response.data.message) {
              Toast.show(response.data.message);
            }
          } else {
            console.error(response.data.requestKey);
            if (response.data.requestKey) {
              Toast.show(response.data.requestKey);
            }
            if (
              response.data.is_token_expired &&
              Boolean(response.data.is_token_expired)
            ) {
              this.clearData();
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
  callUpdateProfileData = () => {
    this.setState({ loading: true });
    var formdata = new FormData();
    formdata.append("token", this.props.userInfo?.token);
    formdata.append("user_name", this.state.user_name);
    formdata.append("bio", this.state.bio);
    // formdata.append("images", this.state.images)

    ApiHelper.post("updateProfileData", formdata)
      .then(async (response) => {
        this.setState({ loading: false });
        if (response.status == 200) {
          if (response.data.status == "SUCCESS") {
            let user_info = await AsyncStorage.getItem("user_info");
            user_info = JSON.parse(user_info);
            // await AsyncStorage.setItem("user_info", JSON.stringify({
            //   ...user_info,
            //   full_name: this.state.user_name
            // }))

            if (response.data.hasOwnProperty("updateUserName")) {
              this.setState({
                user_name: response.data.updateUserName.user_name,
              });
              // alert("hello")
              this.getUserProfile();
            }

            if (response.data.message) {
              Toast.show(response.data.message);
            }
          } else {
            console.error(response.data.requestKey);
            if (response.data.requestKey) {
              Toast.show(response.data.requestKey);
            }
            if (
              response.data.is_token_expired &&
              Boolean(response.data.is_token_expired)
            ) {
              this.clearData();
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
  callSendInvite = async () => {
    try {
      const result = await Share.share({
        message:"Please Join Squad Vibe using this Link :",
      })

      if (shareImage.action === Share.sharedAction) {
        if (shareImage.activityType) {
          // shared with activity type of result.activityType
          Alert.alert(shareImage.activityType);
        } else {
          // shared
        }
      } else if (shareImage.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };
 
  // callSendInvite = () => {
  //     const shareOptions = {
  //    title: this.state.title,
  //    message:"Please Join Squad Vibe using this Link :",
  //    social: Share.Social.WHATSAPP,
 
  //    filename: 'test' , // only for base64 file in Android
  //  };
 
  //  Share.shareSingle(shareOptions)
  //    .then((res) => { console.log(res) })
  //    .catch((err) => { err && console.log(err); });
   
  // }
  // callSendInvite = (full_name) => {
  //   this.setState({ loading: true });
  //   var formdata = new FormData();
  //   formdata.append("token", this.props.userInfo?.token);
  //   formdata.append("user_name", full_name);
  //   // formdata.append("user_name", this.props.userInfo?.user_name);

  //   ApiHelper.post("sendInvitition", formdata)
  //     .then((response) => {
  //       this.setState({ loading: false });
  //       if (response.status == 200) {
  //         if (response.data.status == "SUCCESS") {
  //           if (response.data.hasOwnProperty("sendInvitition")) {
  //           }
  //           if (response.data.message) {
  //             Toast.show(response.data.message);
  //           }
  //         } else {
  //           if (response.data.requestKey) {
  //             console.error(response.data.requestKey);
  //             Toast.show(response.data.requestKey);
  //           }
  //           if (
  //             response.data.is_token_expired &&
  //             Boolean(response.data.is_token_expired)
  //           ) {
  //             this.clearData();
  //             resetStackAndNavigate(this.props.navigation, "Login");
  //           }
  //         }
  //       }
  //     })
  //     .catch((error) => {
  //       this.setState({ loading: false });
  //       Toast.show(error.message);
  //     });
  // };

  callGetUserProfile = async () => {
    // this.setState({ loading: true })
    let phoneNumber = this.props.userInfo?.phone_number;
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
      (error) => { }
    );
  };
}

const mapStateToProps = (state) => {
  return {
    location: state.user.location,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    resetData: (data) => dispatch(resetData(data)),
    setUserInfo: (data) => dispatch(setUserInfo(data)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ProfileComponent);

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
    width:"100%",
    fontSize: 16,
    borderWidth: 0,
    // borderColor:'gray',
    fontFamily: fonts.Regular,
  }, inputStyle_bio: {
    width:"73%",
    fontSize: 16,
    borderWidth: 0,
    // borderColor:'gray',
    fontFamily: fonts.Regular,
  },
  viewStyle: {
    height: 46,
    width: WINDOW_WIDTH - 60,
    borderRadius: 36,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    alignSelf: "center",
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
  headerViewStyle: {
    height: 100,
    backgroundColor: "white",
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
});
