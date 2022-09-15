import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  StyleSheet,
  Image,
  Touchable,
} from "react-native";
import { colors, fonts } from "../../common/colors";
import Header from "../components/header";
import { HeadingText } from "../common/HeadingText";
import Button from "../components/button";

export default class AddGroup extends React.Component {
  state = {
    images: [""],
    radius: 10,
  };

  addPicture = (index) => {
    if (index == 0) {
      this.openImagePicker(this.props.navigation);
      // this.pickImage()
    } else {
      this.setState({ selectedIndex: index });
    }
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
          onPress: () => this.captureImage(),
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
    this.uploadProfileImage();
  }
  captureImage = async () => {
    var options = {
      title: "Select Image",
      includeBase64: true,
      quality: 0.7,
      mediaType: "photo",
    };
    launchCamera(options, (response) => {
      console.log(
        "launchCamera Response == ",
        typeof response.assets[0],
        JSON.stringify(response.assets[0]).length
      );

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

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header heading="Add Group" />
        <View style={{ marginHorizontal: 15, flex: 2, marginTop: -80 }}>
          <Text
            style={{
              marginLeft: 8,
              fontSize: 14,
              color: colors.headingTextColor,
            }}
          >
            Set a Username
          </Text>
          <View
            style={{
              backgroundColor: colors.white,
              elevation: 2,
              alignContent: "center",
              alignItems: "center",
              padding: 10,
              borderRadius: 20,
              flexDirection: "row",
              marginHorizontal: 10,
            }}
          >
            <TextInput
              // defaultValue={userInfo.user_name}
              style={styles.inputStyle}
              autoCorrect={false}
              placeholder="Group Name"
              placeholderTextColor="#8D8B82"
              // onChangeText={(user_name) => this.setState({ user_name })}
            />
          </View>

          <TouchableOpacity
            onPress={() => this.addPicture(0)}
            activeOpacity={0.6}
            style={{ width: "100%", marginTop: 50, alignItems: "center" }}
          >
            {this.state.images.length === 1 ? (
              <View
                style={{
                  backgroundColor: "gray",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 200,
                }}
              >
                <Image
                  style={{
                    resizeMode: "contain",
                    width: 120,
                    height: 120,
                    borderRadius: 110,
                  }}
                  source={require("../../assets/add_pic_plus.png")}
                />
              </View>
            ) : (
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  style={{
                    backgroundColor: "white",
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 200,
                  }}
                  source={{
                    uri: this.state.images[this.state.images.length - 1],
                  }}
                />
                <TouchableOpacity style={{ position: "absolute", bottom: -40 }}>
                  <Image
                    style={{
                      resizeMode: "contain",
                      width: 70,
                      height: 70,
                      marginTop: -30,
                    }}
                    source={require("../../assets/plus.png")}
                  />
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 16,
              color: "black",
              marginLeft: 10,
              marginTop: 30,
            }}
          >
            Determine Location
          </Text>

          {/* <SearchBar
                        containerStyle={styles.searchcontainer}
                        placeholder="Type in Zip or City"
                        placeholderTextColor='#7B817E'
                        // onChangeText={this.updateSearch}
                        // value={this.state.search}
                        inputContainerStyle={{ borderBottomWidth: 1, backgroundColor: 'white', borderRadius: 3, borderWidth: 1, borderColor: colors.searchBorderColor }}
                        inputStyle={{ color: colors.headingTextColor }}
                        // searchIcon={<Image source={require('../../assets/search_ic.png')} />}
                        searchIcon={<Image source={require('../assets/search_ic.png')} />}
                    /> */}

          <View style={{ marginTop: 50, overflow: "visible" }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <HeadingText
                title={"Search Radius"}
                style={{
                  marginTop: 20,
                  fontSize: 14,
                  color: colors.black,
                  fontFamily: fonts.Bold,
                }}
              />
              <HeadingText
                title={`${this.state.radius} km`}
                style={{
                  marginTop: 20,
                  fontSize: 14,
                  color: colors.greenButton,
                  fontFamily: fonts.Bold,
                }}
              />
            </View>
            <View style={{ marginTop: 15 }}>
              {/* <Slider
                                    value={this.state.radius}
                                    maximumValue={100}
                                    style={{ zIndex: 5 }}
                                    thumbTintColor={colors.greenButton}
                                    maximumTrackTintColor={'#D3CEC0'}
                                    minimumTrackTintColor={colors.greenButton}
                                    thumbStyle={{ width: 25, height: 25 }}
                                    onValueChange={(value) => {
                                        console.log("Change value ", value);
                                        this.setState({
                                            radius: parseInt(value)
                                        })
                                    }}
                                /> */}
            </View>
          </View>

          <Button />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  inputStyle: {
    // flex: 1,
    fontSize: 16,
    // fontFamily: fonts.Regular
  },
});
