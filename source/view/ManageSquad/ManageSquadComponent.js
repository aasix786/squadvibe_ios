import React, { Component } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  ScrollView,
  Alert,
  Dimensions,
  StatusBar,
  ImageBackground,
} from "react-native";
import { colors, fonts } from "../../common/colors";
import { HeadingText } from "../../common/HeadingText";
import Header from "../components/header";
import ImagePicker from "react-native-image-crop-picker";
import { launchImageLibrary } from "react-native-image-picker";
import ApiHelper from "../../Networking/NetworkCall";
import { connect } from "react-redux";
import { postMethod } from "../../Networking/APIModel";
import Toast from "react-native-simple-toast";
import axios from "axios";
import Ripple from "react-native-material-ripple";
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WINDOW_WIDTH = Dimensions.get("window").width;

class ManageSquadComponent extends Component {
  constructor() {
    super();
    this.state = {
      code: "",
      isCheck: false,
      birthDate: "",
      images: ["", "", "", "", "", "", "", "", "", "", "", ""],
      selectedIndex: -1,
      arrInterest: ["Drinking", "Playing games"],
      data: "",
      group_interest: [],
      squad_name: "",
      edit: false,
      squad_image: [],
    };
  }

  async componentDidMount() {
    
 
    this.props.navigation.addListener("focus", () => {
      const {
        data,
        gender,
        isFromGroupInterest,
        isFromEditLocation,
        interest_data,
        isFromGender,
      } = this.props.route.params;
      
   
      const { looking_for, group_interest } = this.state;

      if (isFromGroupInterest) {
        let interest = interest_data.filter((item) => {
          const find = group_interest.findIndex(
            (elem) => elem.interest_id === item.interest_id
          );
          return find == -1;
        });
        interest.map(
          (elem, index) => (interest[index]["interest_id"] = elem.id)
        );

        interest.forEach((elem) => {
          const parameter = new FormData();
          parameter.append("token", this.props.userInfo.token);
          parameter.append("squad_id", this.props.route.params.data.squad_id);
          parameter.append("interest_id", elem.interest_id);

          axios
            .post(
              "http://squadvibes.onismsolution.com/api/updateSquadInterest",
              parameter
            )
            .then((res) => Toast.show("Interest added successfully"))
            .catch((err) => Toast.show("Error in adding Interest"));
        });
        this.setState({
          group_interest: [...this.state.group_interest, ...interest],
        });
      } else if (isFromGender) {
        const genderString =
          gender == 0
            ? "Male Group"
            : gender == 1
            ? "Female Group"
            : "Mix Friend Group";
        if (looking_for !== genderString) {
          const parameter = new FormData();
          parameter.append("token", this.props.userInfo.token);
          parameter.append("squad_id", this.props.route.params.data.squad_id);
          parameter.append(
            "looking_for",
            gender == 2 ? 0 : gender == 0 ? 1 : 2
          );

          axios
            .post("http://squadvibes.onismsolution.com/api/updateLookingFor", parameter)
            .then((res) => Toast.show("Updated Looking for successfully"))
            .catch((err) => Toast.show("Error in updating Looking for"));

          this.setState({ looking_for: genderString });
        }
      } else if (isFromEditLocation) {
        const { city, zip_code, radius } = this.props.route.params.location;
        const { zip, location, distance } = this.state.data;

        if (city !== location || zip !== zip_code || distance !== radius) {
          const parameter = new FormData();
          parameter.append("token", this.props.userInfo.token);
          parameter.append("squad_id", this.props.route.params.data.squad_id);
          parameter.append("city", city);
          parameter.append("zip_code", zip_code);
          parameter.append("distance", radius);

          axios
            .post("http://squadvibes.onismsolution.com/api/updateSquadInfo", parameter)
            .then((res) => {
              this.setState({
                data: { location: city, zip: zip_code, distance: radius },
              });
              Toast.show("Updated Location successfully");
            })
            .catch((err) => Toast.show("Error in updating Location"));
        }
      } else {
        this.setState({ data });
        const interest = data.interest_data || [];
        this.setState({
          group_interest: interest,
          squad_name: data.squad_name,
          squad_image: data.squad_image,
          group_member: data.group_member,
          looking_for: data.looking_for,
        });
      }
    });
   
  }

  deleteMember = (id, index) => {
    const { squad_id } = this.props.route.params.data;

    const parameter = new FormData();
    parameter.append("token", this.props.userInfo.token);
    parameter.append("user_id", id);
    parameter.append("squad_id", squad_id);

    postMethod(
      this.props.navigation,
      "removeMemberSquad",
      parameter,
      (response) => {
        Toast.show("Member removed successfully.");
        const members = [...this.state.group_member];
        members.splice(index, 1);
        this.setState({ group_member: members });
      }
    );
  };
  leaveSquad = () => {
    const { squad_id } = this.props.route.params.data;

    const parameter = new FormData();
    parameter.append("token", this.props.userInfo.token);
    parameter.append("squad_id", squad_id);

    postMethod(
      this.props.navigation,
      "leaveSquad",
      parameter,
      (response) => {
        // console.log("leaveSquad")
        // console.log(response)
        Toast.show("Squad removed successfully.");
        this.props.navigation.navigate("MySquad")
        // const members = [...this.state.group_member];
        // members.splice(index, 1);
        // this.setState({ group_member: members });
      }
    );
  };

  saveTitle = () => {
    const parameter = new FormData();
    parameter.append("token", this.props.userInfo.token);
    parameter.append("squad_id", this.props.route.params.data.squad_id);
    parameter.append("name", this.state.squad_name);
    console.log("NAMEEE", parameter);
    axios
      .post("http://squadvibes.onismsolution.com/api/updateSquadTitle", parameter)
      .then((res) =>{
        Toast.show("Updated Squad Name for successfully")
        }
      )
      .catch((err) => Toast.show("Error in updating Squad Name"));

    this.setState({ edit: false });
  };

  captureImage2 = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      mediaType: "photo",
    }).then((image) => {
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
              this.addSquadImg(image);
              this.setState({
                squad_image: [
                  { squad_image: image },
                  ...this.state.squad_image,
                ],
              });
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
        Toast.show(error.message);
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
      this.uploadProfileImage(response.assets[0].uri);
      // this.setFilePath2(response.assets[0]);
    });
  };

  addSquadImg = (url) => {
    const parameter = new FormData();
    parameter.append("token", this.props.userInfo.token);
    parameter.append("squad_id", this.props.route.params.data.squad_id);
    parameter.append("squad_image", url);

    axios
      .post("http://squadvibes.onismsolution.com/api/addImageInSquad", parameter)
      .then((res) => Toast.show("Image added in squad successfully"))
      .catch((err) => Toast.show("Error in updating Squad Image"));
  };

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

  deleteInterest = (id, index) => {
    const { squad_id } = this.props.route.params.data;

    const parameter = new FormData();
    parameter.append("token", this.props.userInfo.token);
    parameter.append("interest_id", id);
    parameter.append("squad_id", squad_id);

    postMethod(
      this.props.navigation,
      "removeInterestSquad",
      parameter,
      (response) => {
        Toast.show("Interest removed successfully.");
        const interest = [...this.state.group_interest];
        interest.splice(index, 1);
        this.setState({ group_interest: interest });
      }
    );
  };

  render() {
    const { isFromEditSquad } = this.props.route.params;
    const data = this.state.data;

    console.log("DATATATATATAT", data.admin_id);
    console.log("user_id", this.props.userInfo.id);
    console.log("group_interest", this.state.group_interest);
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
                  Manage Squad
                </Text>
              </View>
              <View style={styles.headerButtonsViewStyle} />
            </View>
          </View>
        </View>

        <ScrollView
          style={{ flexGrow: 1, backgroundColor: colors.white }}
          showsVerticalScrollIndicator={false}
        >
          <View>
            <View
              style={{
                justifyContent: "center",
                position: "relative",
              }}
            >
              <ImageBackground
                style={{
                  height: 300,
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                source={{
                  uri:
                    this.state.squad_image.length > 0
                      ? this.state.squad_image[0].squad_image
                      : "http://squadvibes.onismsolution.com/api/public/assets/default_image.png",
                }}
              >
                {this.state.edit && (
                  <TouchableOpacity
                    onPress={this.openImagePicker}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={require("../../assets/plus_ic_add3.png")}
                      style={{ height: 60, width: 60 }}
                    />
                  </TouchableOpacity>
                )}
              </ImageBackground>

              {this.state.edit ? (
                <>
                  <View
                    style={{
                      marginTop: 0,
                      width: "100%",
                      paddingHorizontal: 15,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 15,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          color: colors.black,
                          fontFamily: fonts.SemiBold,
                        }}
                      >
                        Title
                      </Text>
                      <TouchableOpacity
                        onPress={this.saveTitle}
                        style={styles.saveBtn}
                      >
                        <Text
                          style={{
                            color: colors.white,
                            textAlign: "center",
                            paddingBottom: 2,
                          }}
                        >
                          Save
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <TextInput
                      style={styles.squad_name_input}
                      value={this.state.squad_name}
                      onChangeText={(text) =>
                        this.setState({ squad_name: text })
                      }
                    />
                  </View>
                </>
              ) : (
                <>
                  <View
                    style={{
                      alignSelf: "flex-end",
                      top: 40,
                      right: 17,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => this.setState({ edit: true })}
                      style={styles.saveBtn}
                      activeOpacity={0.8}
                    >
                      <Text style={{ color: colors.white }}>Edit</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.squad_name}>{this.state.squad_name}</Text>
                </>
              )}

              <>
                <View style={{ alignSelf: "flex-end", top: 35, right: 17 }}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("EditLocation", { data })
                    }
                    style={styles.saveBtn}
                  >
                    <Text style={{ color: colors.white }}>Add</Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginVertical: 5,
                    marginHorizontal: 17,
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
                    <Text>{data.location}</Text>
                    <View style={{ width: 7 }} />

                    <Text>{data.distance} Km</Text>
                  </Text>
                </View>
              </>
            </View>
          </View>

          <View
            style={{
              marginHorizontal: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 20,
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                color: colors.black,
                fontFamily: fonts.SemiBold,
              }}
            >
              Members
            </Text>
            <TouchableOpacity
              style={{
                marginLeft: "auto",
                borderRadius: 15,
                height: 30,
                width: 80,
                backgroundColor: "#4AACCD",
              }}
              onPress={() =>
                this.props.navigation.navigate("InviteSinglePerson", { data,
              group_member: data.group_member,
              // (8/24/22)=> friends: data.group_member,
             })
              }
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  marginTop: 4,
                }}
              >
                Add
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              paddingBottom: 10,
              marginHorizontal: 16,
            }}
          >
            <FlatList
              //   numColumns={4}
              horizontal
              showsHorizontalScrollIndicator={false}
              data={this.state.group_member}
              keyExtractor={(item) => item.member_id}
              renderItem={({ item, index }) => (
                <View
                  style={
                    {
                      // position: "relative",
                      // paddingVertical: 10,
                      // width: "25%",
                    }
                  }
                >
                  {this.state.edit && (
                    <View
                      style={{
                        position: "absolute",
                        top: -5,
                        right: -3,
                        zIndex: 10,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => this.deleteMember(item.member_id, index)}
                        style={{}}
                      >
                        <Image
                          source={require("../../assets/black_cross.png")}
                          style={{ height: 30, width: 30 }}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
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
                        marginHorizontal: 5,
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        source={
                          item.user_image
                            ? { uri: item.user_image }
                            : require("../../assets/avtar.jpg")
                        }
                        style={{ height: 143, width: 122, borderRadius: 20 }}
                      />
                    </View>
                    <Text
                      style={{
                        color: "#0D110F",
                        fontFamily: fonts.Regular,
                        fontSize: 13,
                        textAlign: "center",
                        marginVertical: 5,
                      }}
                    >
                      {item.full_name}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>

          <View
            style={{
              marginHorizontal: 16,
              paddingBottom: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginVertical: 10,
              }}
            >
              <HeadingText
                title={"Interests"}
                style={{
                  fontSize: 18,
                  color: colors.black,
                  fontFamily: fonts.SemiBold,
                }}
              />

              <TouchableOpacity
                style={{
                  marginLeft: "auto",
                  borderRadius: 15,
                  height: 30,
                  width: 80,
                  backgroundColor: "#4AACCD",
                }}
                onPress={() =>
                  this.props.navigation.navigate("GroupInterest", {
                    isFromManageSquad: true,
                    data: this.state.group_interest,
                  })
                }
              >
                <Text
                  style={{ color: "white", textAlign: "center", marginTop: 4 }}
                >
                  Add
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                marginVertical: 10,
                flex: 1,
                flexWrap: "wrap",
              }}
            >
              {this.state.group_interest.map((interestData, index) => {
                return (
                  <View style={{ position: "relative" }}>
                    {this.state.edit && (
                      <View
                        style={{
                          position: "absolute",
                          right: 0,
                          top: -5,
                          zIndex: 10,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() =>
                            this.deleteInterest(interestData.interest_id, index)
                          }
                          style={{}}
                        >
                          <Image
                            source={require("../../assets/black_cross.png")}
                            style={{ height: 30, width: 30 }}
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                    <View
                      style={{
                        marginRight: 10,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 20,
                        backgroundColor: "#DFF2FC",
                      }}
                    >
                      <Text
                        style={{
                          margin: 10,
                          fontSize: 13,
                          fontFamily: fonts.Regular,
                          paddingRight: 10,
                          paddingLeft: 10,
                        }}
                      >
                        {interestData.interest}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          <View
            style={{
              marginHorizontal: 16,
              paddingBottom: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginVertical: 10,
              }}
            >
              <HeadingText
                title={"Group Image"}
                style={{
                  fontSize: 18,
                  color: colors.black,
                  fontFamily: fonts.SemiBold,
                }}
              />
              {isFromEditSquad ? (
                <Text
                  style={{
                    color: colors.greenButton,
                    fontSize: 14,
                    fontFamily: fonts.SemiBold,
                  }}
                  onPress={() =>
                    this.props.navigation.navigate("AddGroup", {
                      isFromMySquad: true,
                      data: data,
                    })
                  }
                >
                  Edit
                </Text>
              ) : null}
            </View>

            <FlatList
              numColumns={3}
              data={this.state.squad_image}
              keyExtractor={(item) => item.member_id}
              renderItem={({ item, index }) => (
                <Image
                  source={{ uri: item.squad_image }}
                  style={{
                    width: 122,
                    height: 143,
                    marginRight: 15,
                    marginTop: 15,
                    borderRadius: 20,
                  }}
                />
              )}
            />
          </View>

          <View
            style={{
              marginHorizontal: 16,
              borderBottomColor: "white",
              borderBottomWidth: 1,
              paddingBottom: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginVertical: 10,
              }}
            >
              <HeadingText
                title={"We are looking for"}
                style={{
                  fontSize: 18,
                  color: colors.black,
                  fontFamily: fonts.SemiBold,
                }}
              />

              <TouchableOpacity
                style={{
                  marginLeft: "auto",
                  borderRadius: 15,
                  height: 30,
                  width: 80,
                  backgroundColor: "#4AACCD",
                }}
                onPress={() =>
                  this.props.navigation.navigate("gender", {
                    isFromManageSquad: true,
                    data: data.looking_for,
                  })
                }
              >
                <Text
                  style={{ color: "white", textAlign: "center", marginTop: 4 }}
                >
                  Change
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginVertical: 15 }}>
              <View
                style={{
                  marginRight: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 20,
                  backgroundColor: "#DFF2FC",
                }}
              >
                <Text
                  style={{
                    margin: 10,
                    fontSize: 13,
                    fontFamily: fonts.Regular,
                    paddingRight: 10,
                    paddingLeft: 10,
                  }}
                >
                  {this.state.looking_for == 0 ? "Male Group" : this.state.looking_for == 1 ? "Female Group" : "Others Group" }
                </Text>
              </View>

              {/* <Text
                style={{
                  fontSize: 16,
                  color: "#8D8B82",
                  fontFamily: fonts.Regular,
                }}
              >
                {this.state.looking_for}
              </Text> */}
            </View>
            {data.admin_id != this.props.userInfo.id ? 
          (
            <View style={{ marginVertical: 15 }}>
            <TouchableOpacity
              style={{
                marginRight: 10,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 20,
                backgroundColor: "#4AACCD",
              }}
              onPress={()=>this.leaveSquad()}
            >
              <Text
                style={{
                  margin: 10,
                  fontSize: 15,
                  fontFamily: fonts.Bold,
                  color:"#fff",
                  paddingRight: 10,
                  paddingLeft: 10,
                }}
              >
                Leave Squad
              </Text>
            </TouchableOpacity>

            {/* <Text
              style={{
                fontSize: 16,
                color: "#8D8B82",
                fontFamily: fonts.Regular,
              }}
            >
              {this.state.looking_for}
            </Text> */}
          </View>
          )  
          :null
          }
           
          </View>

          {/* <View style={{ marginHorizontal: 16, borderBottomColor: '#E0DDD3', borderBottomWidth: 1, paddingBottom: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
                            <HeadingText title={'Planned activities'} style={{ fontSize: 18, color: colors.black, fontFamily: fonts.SemiBold }} />
                            {isFromEditSquad ? <Text style={{ color: colors.greenButton, fontSize: 14, fontFamily: fonts.SemiBold }}
                                onPress={() => { }}>Edit</Text> : null}
                        </View>
                        <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                            <View style={{ marginHorizontal: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 2, backgroundColor: '#E7E1CD' }}>
                                <Text style={{ margin: 10, fontSize: 13, fontFamily: fonts.Regular }}>Drinking</Text>
                            </View>
                            
                        </View>
                    </View> */}
        </ScrollView>
      </View>
    );
  }

  renderInterest = () => {};
}

const styles = StyleSheet.create({
  passwordContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#D9D5C6",
    paddingBottom: 10,
  },
  squad_name: {
    color: colors.black,
    fontFamily: fonts.SemiBold,
    fontSize: 18,
    paddingLeft: 15,
  },
  edit: {
    position: "absolute",
    backgroundColor: "#4AACCD",
    // marginTop:10,
    // top:10,
    right: 15,
    height: 30,
    width: 80,
    borderRadius: 15,
  },
  saveBtn: {
    borderRadius: 15,
    height: 30,
    width: 80,
    backgroundColor: "#4AACCD",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  squad_name_input: {
    marginTop: 15,
    // marginHorizontal:25,
    paddingHorizontal: 15,
    color: colors.black,
    fontFamily: fonts.regular,
    fontSize: 18,
    borderWidth: 1,
    borderColor: "gray",
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
    bottom: 20,
    marginHorizontal: 36,
    borderRadius: 25,
  },

  textInputStype: {
    height: 50,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
  },

  ////////

  container: {
    flex: 1,
    backgroundColor: colors.white,
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

const mapStateToProps = (state) => {
  return {
    userInfo: state.user.userInfo,
  };
};

export default connect(mapStateToProps)(ManageSquadComponent);
// export default ManageSquadComponent
