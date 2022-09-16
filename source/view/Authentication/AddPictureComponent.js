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
  Alert,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
  Dimensions,
  ImageBackground,
  StatusBar,
  ImageBackgroundBase,
} from "react-native";
import { colors, fonts, resetStackAndNavigate } from "../../common/colors";
import { HeadingText } from "../../common/HeadingText";
import { CustomButtonWithLeftIcon } from "../../common/ThemeButton";
import HyperlinkedText from "react-native-hyperlinked-text";
// import { Image } from 'react-native-elements'
import { connect } from "react-redux";
import {
  setUserInfo,
  setAddPicture,
  setBirthDate,
  setCurrentStatus,
  setRelationShipStatus,
  setFullName,
  setEmail,
  setGender,
  setInterest,
  setIsNewUser,
  setSubscribeNewsletter,
  setLoginType,
  setMobileNumber,
} from "../../redux/Actions/UserAction";
import Toast from "react-native-simple-toast";
import ApiHelper from "../../Networking/NetworkCall";
import { Dialog } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "../../common/Loader";
import messaging from "@react-native-firebase/messaging";
import axios from "axios";

import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import ImagePicker from "react-native-image-crop-picker";
import Ripple from "react-native-material-ripple";

const WINDOW_WIDTH = Dimensions.get("window").width;

class AddPictureComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      isCheck: false,
      birthDate: "",
      images: [""],
      selectedImages: [
        {
          id: 1,
          imageUrl:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        },
        {
          id: 2,
          imageUrl:
            "https://media.istockphoto.com/photos/profile-of-a-female-doctor-picture-id1313720249?b=1&k=20&m=1313720249&s=170667a&w=0&h=Z13IkuY6kFGRX1dnsMsTbE6Mvsp9a85OCu-Slr9ECr8=",
        },
        {
          id: 3,
          imageUrl:
            "https://media.istockphoto.com/photos/overjoyed-pretty-asian-woman-look-at-camera-with-sincere-laughter-picture-id1311084168?b=1&k=20&m=1311084168&s=170667a&w=0&h=mE8BgXPgcHO1UjSmdWYa21NIKDzJvMrjOffy39Ritpo=",
        },
        {
          id: 4,
          imageUrl:
            "https://media.istockphoto.com/photos/content-young-man-picture-id468467767?k=20&m=468467767&s=612x612&w=0&h=iA4CfQfqgyDE_vlpNHYP1FVej11tnfmIpVAwwzfTB5E=",
        },
      ],
      selectedIndex: -1,
      filePath: "",
      imageResponse: "",
      loading: false,
    };
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <StatusBar
          backgroundColor={"transparent"}
          translucent
          barStyle="light-content"
        />
        <View>
          <ImageBackground
            source={require("../../assets/addPicHeader.png")}
            style={{ width: WINDOW_WIDTH, height: 150 }}
            resizeMode={"stretch"}
          >
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
          </ImageBackground>
        </View>
        <View style={{ flex: 2 }}>
          <View style={{ flex: 0.85 }}>
            <View style={styles.imageViewStyle}>
              <View style={styles.dottedLineStyle}>
                {this.state.images.length === 1 ? (
                  <Image
                    style={{
                      resizeMode: "contain",
                      width: 138,
                      height: 138,
                    }}
                    source={require("../../assets/avatar.png")}
                  />
                ) : (
                  <Image
                    style={{
                      backgroundColor: "white",
                      width: 138,
                      height: 138,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 100,
                    }}
                    source={{
                      uri: this.state.images[this.state.images.length - 1],
                    }}
                  />
                )}
              </View>

              <TouchableOpacity
                onPress={() => this.addPicture(0)}
                activeOpacity={0.8}
                style={{ position: "absolute", bottom: -21 }}
              >
                <Image
                  style={{
                    resizeMode: "contain",
                    width: 38,
                    height: 38,
                  }}
                  source={require("../../assets/addImageIcon.png")}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ flex: 1 }}>
            <FlatList
              data={this.state.selectedImages}
              numColumns={3}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => {
                return (
                  <View
                    style={{
                      height: 105,
                      width: WINDOW_WIDTH / 3,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        var arrImages = this.state.images;
                        arrImages.push(item.imageUrl);
                        this.setState({
                          filePath: item.imageUrl,
                          images: arrImages,
                        });
                      }}
                    >
                      <Image
                        style={{
                          resizeMode: "cover",
                          width: 97,
                          height: 91,
                          borderRadius: 20,
                        }}
                        source={{ uri: item.imageUrl }}
                      />
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.bottomView}
          activeOpacity={0.8}
          onPress={() => {
            if (this.state.images.length > 1) {
              this.callSignUp();
            } else {
              Toast.show("Please upload at-least one image");
            }
          }}
        >
          <Text style={styles.textStyle}>Next</Text>
        </TouchableOpacity>
      </View>
    );
  }

  addPicture = (index) => {
    if (index == 0) {
      this.openImagePicker(this.props.navigation);
      // this.pickImage()
    } else {
      this.setState({ selectedIndex: index });
    }
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
      this.setFilePath(response.assets[0]);
    });
  };

  setFilePath(response) {
    this.setState({
      filePath: response.uri,
      imageResponse: response,
    });
console.log({
  filePath: response.uri,
  imageResponse: response,
})
    this.uploadProfileImage();
  }

  captureImage2 = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      mediaType: "photo",
    }).then((image) => {
      this.setFilePath2(image);
    });
  };
  setFilePath2(response) {
    // let arrImage = this.state.images
    // arrImage.push(response.uri)
    this.setState({
      filePath: response.path,
      imageResponse: response,
      // images: arrImage
    });

    this.uploadProfileImage2();
  }
  uploadProfileImage2 = () => {
    this.setState({ loading: true });

    var parameter = new FormData();
    parameter.append("image", {
      uri:
        Platform.OS === "android"
          ? this.state.imageResponse.path
          : this.state.imageResponse.path.replace("file:/", ""),
      // type: this.state.imageResponse.type,
      type: "image/jpeg",
      name: this.state.imageResponse.path,
    });
    ApiHelper.post("uploadProfileImage", parameter)
      .then((response) => {
        this.setState({ loading: false });
        if (response.status == 200) {
          if (response.data.status == "SUCCESS") {
            if (response.data.hasOwnProperty("uploadProfileImage")) {
              let image = response.data.uploadProfileImage.image;
              var arrImages = this.state.images;
              arrImages.push(image);
              this.setState({ images: arrImages });
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
        console.error(error);
        Toast.show(error.message);
      });
  };
  uploadSquadImage2 = () => {
    this.setState({ loading: true });

    var parameter = new FormData();
    parameter.append("image", {
      uri:
        Platform.OS === "android"
          ? this.state.imageResponse.path
          : this.state.imageResponse.path.replace("file:/", ""),
      type: this.state.imageResponse.mime,
      name: this.state.imageResponse.path,
    });

    ApiHelper.post("uploadSquadImage", parameter)
      .then((response) => {
        this.setState({ loading: false });
        if (response.status == 200) {
          if (response.data.status == "SUCCESS") {
            if (response.data.hasOwnProperty("uploadSquadImage")) {
              let image = response.data.uploadSquadImage.image;
              var arrImages = this.state.images;
              arrImages.push(image);
              this.setState({ images: arrImages });
              if (
                this.state.isFromMySquad != undefined &&
                this.state.isFromMySquad == true
              ) {
                var arrUplodedImages = this.state.arrUplodedImages;
                arrUplodedImages.push(image);
                this.setState({ arrUplodedImages: arrUplodedImages });
              }
            }
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
          onPress: () => this.captureImage2(),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  }

  pickImage = () => {
    let options = {
      title: "Select Image",
      includeBase64: true,
      customButtons: [
        { name: "customOptionKey", title: "Choose Photo from Custom Option" },
      ],
      storageOptions: {
        skipback_arrowup: true,
        path: "images",
      },
      maxWidth: 500,
      maxHeight: 500,
      quality: 1,
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
      } else if (response.error) {
        alert("response.error" + response.error);
      } else if (response.customButton) {
      } else {
        let source = response;
        this.setFilePath(source);
      }
    });
  };

  requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "App Camera Permission",
          message: "App needs access to your camera ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.captureImage();
      } else {
      }
    } catch (err) {
      console.warn(err);
    }
  };

  callSignUp = async () => {
    ApiHelper.defaults.headers.common["Content-Type"] = "multipart/form-data";
    ApiHelper.defaults.headers["Content-Type"] = "multipart/form-data";

    this.setState({ loading: true });
    // const device_token = await AsyncStorage.getItem('token')
    const device_type = await AsyncStorage.getItem("device_type");
    const device_token = await messaging().getToken();
    await AsyncStorage.setItem("token", device_token);

    var parameter = new FormData();
    parameter.append("login_type", this.props.login_type);
    parameter.append("full_name", this.props.full_name);
    parameter.append("phone_number", "+"+this.props.mobile_number);
    parameter.append("email", this.props.email);
    parameter.append("gender", this.props.gender);
    parameter.append("subscribe_newsletter", this.props.subscribe_newsletter);
    parameter.append("date_of_birth", this.props.birthDate);
    parameter.append("current_status", this.props.current_status);
    parameter.append("relationship_status", this.props.relation_ship_status);
    parameter.append("interest_id", this.props.interest);
    parameter.append("device_type", device_type);
    parameter.append("device_token", device_token);
    var arrImages = this.state.images.filter((data) => data != "");
    parameter.append("profile_photo", arrImages.join(","));

    if (this.props.login_type.toLowerCase() != "normal") {
      parameter.append("social_id", this.props.social_Id);
    }
console.log("phone_number", "+"+this.props.mobile_number)
    ApiHelper.post("signUp", parameter)
      .then((response) => {
        this.setState({ loading: false });
        console.log("response.data")
        console.log(response.data)
        if (response.status == 200) {
          if (response.data.status == "SUCCESS") {
            let userInfo = response.data.signUp;
            const userId = String(userInfo.user_id);
            const authToken = String(userInfo.token);
            AsyncStorage.setItem("user_info", JSON.stringify(userInfo));
            AsyncStorage.setItem("userId", userId);
            AsyncStorage.setItem("authToken", authToken);
            // this.resetData()
            this.props.setUserInfo(userInfo);
            axios
              .post("http://squadvibes.onismsolution.com/api/uploadFCMToken", {
                token: authToken,
                fcm_token: device_token,
              })
              .then((res) => {});

            this.getUserProfile(userInfo.phone_number);
            // this.props.navigation.navigate('LocationActivation')
          } else {
            console.error("response.data.message");
            console.error(response.data.message);
            if (response.data.message) {
              console.warn("ABC");
              Toast.show(response.data.message);
            }
          }
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.error("errror", error);
        Toast.show(error.message);
        // this.props.navigation.navigate("LocationActivation");
      });
  };

  uploadProfileImage = () => {
    this.setState({ loading: true });

    var parameter = new FormData();
    parameter.append("image", {
      uri:
        Platform.OS === "android"
          ? this.state.imageResponse.uri
          : this.state.imageResponse.uri.replace("file:/", ""),

      type: "image/jpeg",
      name: this.state.imageResponse.fileName,
    });
    ApiHelper.post("uploadProfileImage", parameter)
      .then((response) => {
        this.setState({ loading: false });
        if (response.status == 200) {
          if (response.data.status == "SUCCESS") {
            console.log("response.data",response.data)
            if (response.data.hasOwnProperty("uploadProfileImage")) {
              let image = response.data.uploadProfileImage.image;
              var arrImages = this.state.images;
              arrImages.push(image);
              this.setState({ images: arrImages });
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
        console.error(error);
        Toast.show(error.message);
      });
  };

  resetData = () => {
    this.props.setAddPicture([]);
    this.props.setBirthDate("");
    this.props.setCurrentStatus("");
    this.props.setRelationShipStatus("");
    this.props.setFullName("");
    this.props.setEmail("");
    this.props.setGender("");
    this.props.setInterest("");
    this.props.setIsNewUser(false);
    this.props.setSubscribeNewsletter("");
    this.props.setMobileNumber("");
  };

  getUserProfile = async (phoneNumber) => {
    console.log("phoneNumber")
    console.log(phoneNumber)
    this.setState({ loading: true });
    const device_token = await AsyncStorage.getItem("token");
    const device_type = await AsyncStorage.getItem("device_type");

    var parameter = new FormData();
    parameter.append("phone_number", phoneNumber);
    parameter.append("device_token", device_token);
    parameter.append("device_type", device_type);

    ApiHelper.post("viewProfile", parameter)
      .then((response) => {
        if (response.status == 200) {
          this.setState({ loading: false });
          if (response.data.status == "SUCCESS") {
            let userInfo = response.data.viewProfile;
            this.props.setUserInfo(userInfo);
            AsyncStorage.setItem("user_info", JSON.stringify(userInfo));
            // this.addUserInFirebase(userInfo)
            this.props.navigation.navigate("LocationActivation");
          } else {
            console.error(response.data.message);
            if (response.data.message) {
              Toast.show(response.data.message);
            }
          }
        }
      })
      .catch((error) => {
        Toast.show(error.message);
      });
  };
}

const mapStateToProps = (state) => {
  return {
    add_picture: state.user.add_picture,
    mobile_number: state.user.mobile_number,
    email: state.user.email,
    login_type: state.user.login_type,
    full_name: state.user.full_name,
    birthDate: state.user.birthDate,
    gender: state.user.gender,
    current_status: state.user.current_status,
    relation_ship_status: state.user.relation_ship_status,
    interest: state.user.interest,
    subscribe_newsletter: state.user.subscribe_newsletter,
    social_Id: state.user.social_Id,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAddPicture: (data) => dispatch(setAddPicture(data)),
    setUserInfo: (data) => dispatch(setUserInfo(data)),
    setBirthDate: (data) => dispatch(setBirthDate(data)),
    setCurrentStatus: (data) => dispatch(setCurrentStatus(data)),
    setRelationShipStatus: (data) => dispatch(setRelationShipStatus(data)),
    setFullName: (data) => dispatch(setFullName(data)),
    setEmail: (data) => dispatch(setEmail(data)),
    setGender: (data) => dispatch(setGender(data)),
    setInterest: (data) => dispatch(setInterest(data)),
    setIsNewUser: (data) => dispatch(setIsNewUser(data)),
    setSubscribeNewsletter: (data) => dispatch(setSubscribeNewsletter(data)),
    setLoginType: (data) => dispatch(setLoginType(data)),
    setMobileNumber: (data) => dispatch(setMobileNumber(data)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddPictureComponent);

const styles = StyleSheet.create({
  backButtonStyle: {
    height: 34,
    width: 34,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    top: 73,
    left: 25,
  },
  imageViewStyle: {
    width: 150,
    marginTop: 50,
    display: "flex",
    alignItems: "center",
    alignSelf: "center",
  },
  dottedLineStyle: {
    width: 150,
    height: 150,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dotted",
    borderWidth: 3,
    borderColor: "#38A5C9",
  },

  bottomView: {
    flexDirection: "row",
    height: 46,
    width: WINDOW_WIDTH - 60,
    alignSelf: "center",
    backgroundColor: "#38A5C9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    borderRadius: 30,
  },
  textStyle: {
    color: "#fff",
    fontSize: 18,
    fontFamily: fonts.Bold,
    paddingBottom: 3,
  },
  textInputStype: {
    height: 50,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
  },
});
