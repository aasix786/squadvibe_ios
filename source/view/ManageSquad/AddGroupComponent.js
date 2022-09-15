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
  StatusBar,
  Dimensions,
} from "react-native";
import {
  colors,
  fonts,
  confirmationAlert,
  resetStackAndNavigate,
} from "../../common/colors";
import { HeadingText } from "../../common/HeadingText";
import { Input, SearchBar } from "react-native-elements";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { Platform } from "react-native";
import { connect } from "react-redux";
import { setGroupName, setGroupImages } from "../../redux/Actions/SquadAction";
import Toast from "react-native-simple-toast";
import ApiHelper from "../../Networking/NetworkCall";
import Loader from "../../common/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImagePicker from "react-native-image-crop-picker";
import Header from "../components/header";
import Ripple from "react-native-material-ripple";
import LinearGradient from "react-native-linear-gradient";
import { CustomInputField } from "../../common/inputField";

const WINDOW_WIDTH = Dimensions.get("window").width;

class AddGroupComponent extends Component {
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
      groupName: "",
      isFromMySquad: "",
      squad_id: "",
      arrUplodedImages: [],
      loading: false,
    };
  }

  componentDidMount() {
    if (this.props.route.params != undefined) {
      const { data, isFromMySquad } = this.props.route.params;
      if (isFromMySquad !== undefined && isFromMySquad == true) {
        var arrImages = [...this.state.images, ...data.squad_image];
        this.setState({
          isFromMySquad,
          groupName: data.squad_name,
          squad_id: data.squad_id,
          images: arrImages,
        });
      }
    }
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
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
                  Add Group
                </Text>
              </View>
              <View style={styles.headerButtonsViewStyle} />
            </View>
          </View>
        </View>

        <View style={{ flex: 2 }}>
          <View style={{ marginTop: 20 }}>
            <CustomInputField
              placeholder="Group Name"
              value={this.state.groupName}
              onChangeText={(groupName) => this.setState({ groupName })}
              keyboardType="default"
              iconHeight={43}
              iconWidth={43}
              icon={require("../../assets/interestSearchIcon.png")}
            />
          </View>

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

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => this.btnNextPress()}
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

        <Loader loading={this.state.loading} />
      </View>
    );
  }

  btnNextPress = async () => {
    if (this.state.groupName.trim().length == 0) {
      Toast.show("Please enter group name");
    } else if (this.state.images.length == 1) {
      Toast.show("Please upload at-least 1 group image");
    } else {
      if (
        this.state.isFromMySquad != undefined &&
        this.state.isFromMySquad == true
      ) {
        this.callUpdateSquadImageName();
      } else {
        this.props.setGroupName(this.state.groupName);
        let arrImages = this.state.images.filter((data) => data != "");
        this.props.setGroupImages(arrImages);
        this.props.navigation.push("GroupInterest", {
          isFromCurrentStatus: false,
          isFromMySquad: true,
        });
      }
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
    if (this.state.isFromMySquad == true) {
      confirmationAlert(
        "Delete",
        "Are you sure you want to delete this image?",
        () => {
          this.callDeleteSquadImages(this.state.images[index].image_id, index);
        }
      );
    } else {
      const image = this.state.images[index];
      const arrNewImages = this.state.images.filter((data) => data != image);
      this.setState({
        images: arrNewImages,
      });
    }
  };

  captureImage = async (type) => {
    // let options = {
    //   mediaType: 'photo',
    //   quality: 1,
    //   storageOptions: {
    //     skipback_arrowup: true,
    //     path: 'images'
    //   }
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
      mediaType: "photo",
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.5,
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
      // if (Platform.OS === 'ios') {
      this.setFilePath(response.assets[0]);
      // }
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

    this.uploadSquadImage();
  }

  setFilePath2(response) {
    // let arrImage = this.state.images
    // arrImage.push(response.uri)
    this.setState({
      filePath: response.path,
      imageResponse: response,
      // images: arrImage
    });

    this.uploadSquadImage2();
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

  uploadSquadImage = () => {
    this.setState({ loading: true });

    var parameter = new FormData();
    parameter.append("image", {
      uri:
        Platform.OS === "android"
          ? this.state.imageResponse.uri
          : this.state.imageResponse.uri.replace("file:/", ""),
      type: this.state.imageResponse.type,
      name: this.state.imageResponse.fileName,
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

  callUpdateSquadImageName = () => {
    this.setState({ loading: true });
    var formdata = new FormData();
    formdata.append("token", this.props.userInfo.token);
    formdata.append("squad_id", this.state.squad_id);
    formdata.append("squad_name", this.state.groupName);
    formdata.append("squad_image", this.state.arrUplodedImages.join(","));

    ApiHelper.post("updateSquadImageName", formdata)
      .then((response) => {
        this.setState({ loading: false });
        if (response.status == 200) {
          if (response.data.status == "SUCCESS") {
            this.props.navigation.navigate("MySquad");
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

  callDeleteSquadImages = (imageId, index) => {
    this.setState({ loading: true });
    var formdata = new FormData();
    formdata.append("token", this.props.userInfo.token);
    formdata.append("image_id", imageId);

    ApiHelper.post("deleteSquadImage", formdata)
      .then((response) => {
        this.setState({ loading: false });
        if (response.status == 200) {
          if (response.data.status == "SUCCESS") {
            if (this.state.isFromMySquad) {
              const imageId = this.state.images[index].image_id;
              const arrImage = this.state.images;
              const arrNewImages = arrImage.filter(
                (data) => data.image_id !== imageId
              );
              this.setState({ images: arrNewImages });
            }

            if (response.data.message) {
              Toast.show(response.data.message);
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
}

const mapStateToProps = (state) => {
  return {
    create_squad: state.manage_squad.create_squad,
    arrSelectedUser: state.manage_squad.arrSelectedUser,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setSelectedUserId: (data) => dispatch(setSelectedUserId(data)),
    setGroupName: (data) => dispatch(setGroupName(data)),
    setGroupImages: (data) => dispatch(setGroupImages(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddGroupComponent);

const styles = StyleSheet.create({
  passwordContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#D9D5C6",
    paddingBottom: 10,
    // marginHorizontal: 16,
  },
  searchcontainer: {
    borderWidth: 0, //no effect
    width: "100%",
    backgroundColor: null,
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
  },
  inputStyle: {
    // flex: 1,
    fontSize: 16,
    fontFamily: fonts.Regular,
  },

  /////

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
});
