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
// import Loader from '../../common/Loader';

import { launchCamera, launchImageLibrary } from "react-native-image-picker";

// import ImagePicker from "react-native-image-picker";

import moment from "moment";

class AddPictureComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      isCheck: false,
      birthDate: "",
      images: [""],
      selectedIndex: -1,
      filePath: "",
      imageResponse: "",
      loading: false,
    };
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.themeColor }}>
        <SafeAreaView></SafeAreaView>
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 16,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Image source={require("../../assets/back_arrow.png")} />
          </TouchableOpacity>
          <Text
            style={{
              color: "#242E40",
              fontFamily: fonts.SemiBold,
              fontSize: 17,
            }}
          >
            Add Some Pictures
          </Text>
          <View />
        </View>

        <View style={{ flex: 2 }}>
          <HeadingText
            title={"Add Pictures"}
            style={{
              marginHorizontal: 35,
              marginTop: 90,
              fontSize: 14,
              color: colors.headingTextColor,
              fontFamily: fonts.SemiBold,
            }}
          />
          <View style={{ flex: 0.85 }}>
            <FlatList
              style={{ marginHorizontal: 25, marginTop: 10 }}
              numColumns={2}
              data={this.state.images}
              keyExtractor={(index) => index.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => this.addPicture(index)}
                  activeOpacity={0.6}
                  style={{ width: "50%", marginVertical: 5 }}
                >
                  <View
                    style={{
                      borderRadius: 8,
                      justifyContent: "center",
                      alignItems: "center",
                      marginHorizontal: 11,
                      backgroundColor: "#F5843B",
                      height: 145,
                    }}
                  >
                    {index == 0 ? (
                      <Image
                        source={require("../../assets/add_pic_plus.png")}
                      />
                    ) : (
                      <Image
                        source={{ uri: item }}
                        style={{
                          height: "100%",
                          width: "100%",
                          overflow: "hidden",
                          borderRadius: 8,
                        }}
                        resizeMode={"cover"}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.bottomView}
          activeOpacity={0.5}
          onPress={() => {
            if (this.state.images.length > 1) {
              // this.props.setAddPicture(this.state.images)
              // this.props.navigation.navigate('LocationActivation')
              this.callSignUp();
            } else {
              Toast.show("Please upload at-least one image");
            }
          }}
        >
          <Text style={styles.textStyle}>Next</Text>
          <Image
            source={require("../../assets/button_white_arrow.png")}
            style={{
              position: "absolute",
              right: 20,
              top: 18,
            }}
          />
        </TouchableOpacity>

        {/* <Loader loading={this.state.loading} /> */}
      </SafeAreaView>
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

  captureImage = async (type) => {
    var options = {
      title: "Select Image",
      includeBase64: false,
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
    // let arrImage = this.state.images
    // arrImage.push(response.uri)
    this.setState({
      filePath: response.uri,
      imageResponse: response,
      // images: arrImage
    });
    // this.props.setAddPicture(this.state.images)
    this.uploadProfileImage();
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
        skipBackup: true,
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
        // alert("response.customButton"+response.customButton);
      } else {
        // alert("response.uri"+response.uri);
        let source = response;
        // You can also display the image using data:
        // let source = {
        //   uri: 'data:image/jpeg;base64,' + response.data
        // };
        //setFilePath(source);
        // const source = { uri: response.uri };
        // setFilePath(response.data);
        //setFile_name(response.fileName);
        //setlocal(response.uri);
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
    const device_token = await AsyncStorage.getItem("token");
    const device_type = await AsyncStorage.getItem("device_type");

    var parameter = new FormData();
    parameter.append("login_type", this.props.login_type);
    parameter.append("full_name", this.props.full_name);
    parameter.append("phone_number", this.props.mobile_number);
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

    // parameter.append("social_id", 'social_id');

    // const config = {
    //   headers: { 'content-type': 'multipart/form-data'}
    //  }

    ApiHelper.post("signUp", parameter)
      .then((response) => {
        this.setState({ loading: false });
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
            this.getUserProfile(userInfo.phone_number);
            // this.props.navigation.navigate('LocationActivation')
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

  uploadProfileImage = () => {
    this.setState({ loading: true });

    var parameter = new FormData();
    parameter.append("image", {
      uri:
        Platform.OS === "android"
          ? this.state.imageResponse.uri
          : this.state.imageResponse.uri.replace("file:/", ""),
      // type: this.state.imageResponse.type,
      type: "image/jpeg",
      name: this.state.imageResponse.fileName,
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
    // width: '84%',
    height: 45,
    backgroundColor: "#00A551",
    justifyContent: "center",
    alignItems: "center",
    // position: 'absolute',
    // bottom: 10,
    marginHorizontal: 16,
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
});
