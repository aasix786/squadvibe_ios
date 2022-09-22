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
  Dimensions,
  StatusBar,
} from "react-native";
import { colors, fonts, resetStackAndNavigate } from "../../common/colors";
import {
  setGroupWeAre,
  setGroupLookingFor,
  setSelectedUserId,
  setGroupName,
  setGroupImages,
  setGroupCity,
  setGroupZipCode,
  setGroupRadius,
  setGroupInterest,
} from "../../redux/Actions/SquadAction";
import { connect } from "react-redux";
import Toast from "react-native-simple-toast";
import ApiHelper from "../../Networking/NetworkCall";
import Loader from "../../common/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/header";
import { ScrollView } from "react-native-gesture-handler";
import LinearGradient from "react-native-linear-gradient";
import Ripple from "react-native-material-ripple";

const WINDOW_WIDTH = Dimensions.get("window").width;

class GroupTypeComponent extends PureComponent {
  constructor() {
    super();
    this.state = {
      code: "",
      isCheck: false,
      birthDate: "",
      groupType: [
        { title: "Mix Friend Group", type: 3 },
        { title: "Female Friends", type: 2 },
        { title: "Male Friends", type: 1 },
      ],
      selectedIndex: -1,
      search: "",
      title: "",
      isFromWeAre: false,
      isFromScouting: false,
      isFromMySquad: false,
      squad_id: "",
      loading: false,
    };
  }

  componentDidMount() {
    if (this.props.route.params !== undefined) {
      const { title, isFromWeAre, isFromScouting, isFromMySquad, data } =
        this.props.route.params;
      this.setState({
        title: title,
        isFromWeAre: isFromWeAre,
        isFromScouting: isFromScouting,
        isFromMySquad: isFromMySquad,
      });
      if (isFromMySquad == true) {
        const looking_for = data.looking_for;
        var index = -1;

        if (looking_for.includes("Male")) {
          index = 2;
        } else if (looking_for.includes("Female")) {
          index = 1;
        } else {
          index = 0;
        }
        this.setState({
          squad_id: data.squad_id,
          selectedIndex: index,
        });
      }
    }
  }

  render() {
    const { navigation } = this.props;
    // console.log("DATATATATATATAT 000", this.state.groupType[0]);
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
        <ScrollView style={{ flexGrow: 1 }}>
          <View style={{ marginTop: 40 }}>
            <FlatList
              data={this.state.groupType}
              keyExtractor={(item) => item.type.toString()}
              numColumns={2}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => this.setState({ selectedIndex: index })}
                  style={{
                    minHeight: 140,
                    width: index == 2 ? WINDOW_WIDTH / 1 : WINDOW_WIDTH / 2,
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                  }}
                >
                  <View
                    style={{
                      width: 170,
                      borderRadius: 10,
                      backgroundColor:
                        this.state.selectedIndex === index
                          ? "#3AA7CC"
                          : "white",
                      shadowColor: "#000",
                      shadowOffset: { width: 2, height: 2 },
                      shadowOpacity: 0.4,
                      shadowRadius: 3,
                      elevation: 5,
                      margin: 10,
                      alignSelf: "center",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {index == 0 ? (
                      this.state.selectedIndex == index ? (
                        <Image
                          style={{
                            resizeMode: "contain",
                            width: 122,
                            height: 132,
                            marginTop: 19,
                          }}
                          source={require("../../assets/mixFriend.png")}
                        />
                      ) : (
                        <Image
                          style={{
                            resizeMode: "contain",
                            width: 122,
                            height: 132,
                            marginTop: 19,
                          }}
                          source={require("../../assets/mixFriend.png")}
                        />
                      )
                    ) : index == 1 ? (
                      this.state.selectedIndex == index ? (
                        <Image
                          style={{
                            resizeMode: "contain",
                            width: 122,
                            height: 132,
                            marginTop: 19,
                          }}
                          source={require("../../assets/femaleFriend.png")}
                        />
                      ) : (
                        <Image
                          style={{
                            resizeMode: "contain",
                            width: 122,
                            height: 132,
                            marginTop: 19,
                          }}
                          source={require("../../assets/femaleFriend.png")}
                        />
                      )
                    ) : this.state.selectedIndex == index ? (
                      <Image
                        style={{
                          resizeMode: "contain",
                          width: 122,
                          height: 132,
                          marginTop: 19,
                        }}
                        source={require("../../assets/maleFriend.png")}
                      />
                    ) : (
                      <Image
                        style={{
                          resizeMode: "contain",
                          width: 122,
                          height: 132,
                          marginTop: 19,
                        }}
                        source={require("../../assets/maleFriend.png")}
                      />
                    )}

                    <Text
                      style={{
                        marginTop: 13,
                        fontSize: 16,
                        fontFamily: fonts.Medium,
                        color:
                          this.state.selectedIndex == index
                            ? "white"
                            : "#0D110F",
                        paddingBottom: 15,
                      }}
                    >
                      {item.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </ScrollView>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (this.state.isFromWeAre) {
              if (this.state.selectedIndex == -1) {
                Toast.show("Please select group looking for friend type");
              } else {
                this.props.setGroupLookingFor(
                  this.state.groupType[this.state.selectedIndex].type
                );
                this.setState({ loading: true });
                setTimeout(() => {
                  this.callCreateSquadApi();
                }, 1000);
              }
            } else if (this.state.isFromScouting) {
              this.props.navigation.navigate("LookingForGroup", {
                isFromScouting: true,
              });
            } else if (this.state.isFromMySquad) {
              this.callUpdateLookingFor();
            } else {
              if (this.state.selectedIndex == -1) {
                Toast.show("Please select we are");
              } else {
                this.props.setGroupWeAre(
                  this.state.groupType[this.state.selectedIndex].type
                );
                this.props.setGroupLookingFor(
                  this.state.groupType[this.state.selectedIndex].type
                );
                this.setState({ loading: true });
                setTimeout(() => {
                  this.callCreateSquadApi();
                }, 1000);
              }
            }
          }}
        >
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={["#38A5CA", "#54C8EE"]}
            style={styles.linearGradient}
          >
            <Text style={styles.textStyle}>
              {this.props.group_name ? "Complete squad creation" : "Next"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <Loader loading={this.state.loading} />
      </View>
    );
  }

  callCreateSquadApi = () => {
    console.log("this.props.userInfo.token")
    console.log(this.props.userInfo.token)
    console.log("this.props.group_name")
    console.log(this.props.group_name)
    console.log("this.props.group_zipCode")
    console.log(this.props.group_zipCode)
    console.log("this.props.group_city")
    console.log(this.props.group_city)
    console.log("this.props.group_radius")
    console.log(this.props.group_radius)
    console.log("this.props.group_we_are")
    console.log(this.props.group_we_are)
    console.log("this.props.group_looking_for")
    console.log(this.props.group_looking_for)
    console.log("this.props.group_interest")
    console.log(this.props.group_interest)


    var formdata = new FormData();
    formdata.append("token", this.props.userInfo.token);
    formdata.append("squad_name", this.props.group_name);
    formdata.append("zip_code", this.props.group_zipCode);
    formdata.append("city", this.props.group_city);
    formdata.append("distance", this.props.group_radius);
    formdata.append("we_are", this.props.group_we_are);
    formdata.append("looking_for", this.props.group_looking_for);
    formdata.append("squad_interest", this.props.group_interest);
    let strUsers = this.props.arrSelectedUser.join(",");
    formdata.append("squad_invites", strUsers);
    let arrImages = this.props.group_images.join(",");
    formdata.append("squad_image", arrImages);
    console.log("this.props.setSelectedUserId")
    console.log(this.props.arrSelectedUser)
    console.log("strUsers")
    console.log(strUsers)
    console.log("formdata")
    console.log(formdata)

    ApiHelper.post("createSquad", formdata)
      .then((response) => {
        console.log("response.data")
        console.log(response.data)
        if (response.status == 200) {
          if (response.data.status == "SUCCESS") {
            this.setState({ loading: false });
            if (response.data.hasOwnProperty("createSquad")) {
              this.props.navigation.reset({
                index: 0,
                routes: [{ name: "MySquad" }],
              });
              this.props.navigation.navigate("MySquad");
              this.resetData();
            }
            if (response.data.message) {
              Toast.show(response.data.message);
            }
          } else {
            if (response.data.requestKey) {
              Toast.show(response.data.requestKey);
            }

            if (response.data.message) {
              Toast.show(response.data.message);
            }

            // if (response.data.is_token_expired && Boolean(response.data.is_token_expired)) {

            //     resetStackAndNavigate(this.props.navigation,'Login')
            // }
          }
        }
      })
      .catch((error) => {
        console.log("catch")
        console.log(error)
        this.setState({ loading: false });
        Toast.show(error.message);
      });
  
  };

  resetData = () => {
    this.props.setGroupWeAre("");
    this.props.setGroupLookingFor("");
    this.props.setSelectedUserId([]);
    this.props.setGroupName("");
    this.props.setGroupImages([]);
    this.props.setGroupCity("");
    this.props.setGroupZipCode("");
    this.props.setGroupRadius("");
    this.props.setGroupInterest("");
  };

  callUpdateLookingFor = () => {
    var formdata = new FormData();
    formdata.append("token", this.props.userInfo.token);
    formdata.append("squad_id", this.state.squad_id);
    formdata.append(
      "looking_for",
      this.state.groupType[this.state.selectedIndex].type
    );

    ApiHelper.post("updateLookingFor", formdata)
      .then((response) => {
        if (response.status == 200) {
          if (response.data.status == "SUCCESS") {
            resetStackAndNavigate(this.props.navigation, "MySquad");

            if (response.data.message) {
              Toast.show(response.data.message);
            }
          } else {
            if (response.data.requestKey) {
              Toast.show(response.data.requestKey);
            }

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
        Toast.show(error.message);
      });
  };
}

const mapStateToProps = (state) => {
  console.log("redux state", state.manage_squad);
  return {
    interest: state.user.interest,
    group_interest: state.manage_squad.group_interest,
    arrSelectedUser: state.manage_squad.arrSelectedUser,
    group_name: state.manage_squad.group_name,
    group_images: state.manage_squad.group_images,
    group_city: state.manage_squad.group_city,
    group_zipCode: state.manage_squad.group_zipCode,
    group_radius: state.manage_squad.group_radius,
    group_we_are: state.manage_squad.group_we_are,
    group_looking_for: state.manage_squad.group_looking_for,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setGroupWeAre: (data) => dispatch(setGroupWeAre(data)),
    setGroupLookingFor: (data) => dispatch(setGroupLookingFor(data)),
    setSelectedUserId: (data) => dispatch(setSelectedUserId(data)),
    setGroupName: (data) => dispatch(setGroupName(data)),
    setGroupImages: (data) => dispatch(setGroupImages(data)),
    setGroupCity: (data) => dispatch(setGroupCity(data)),
    setGroupZipCode: (data) => dispatch(setGroupZipCode(data)),
    setGroupRadius: (data) => dispatch(setGroupRadius(data)),
    setGroupInterest: (data) => dispatch(setGroupInterest(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupTypeComponent);

const styles = StyleSheet.create({
  searchcontainer: {
    backgroundColor: colors.themeColor,
    borderWidth: 0, //no effect
    // shadowColor: 'white', //no effect
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
  },
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
    height: 50,
    backgroundColor: colors.pinkbg,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    marginHorizontal: 30,
    borderRadius: 25,
  },
  textStyle: {
    color: "#fff",
    fontSize: 16,
    fontFamily: fonts.SemiBold,
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
