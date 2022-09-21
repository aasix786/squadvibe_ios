/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";

import SubmitButton from "../../common/SubmitButton";
import { colors, fonts, resetStackAndNavigate } from "../../common/colors";
import Header from "../components/header";
import { SearchBar } from "react-native-elements";
import { connect } from "react-redux";
import { setSelectedUserId } from "../../redux/Actions/SquadAction";
import ApiHelper from "../../Networking/NetworkCall";
import { postMethod } from "../../Networking/APIModel";
import Loader from "../../common/Loader";
import Toast from "react-native-simple-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "../components/button";

import LinearGradient from "react-native-linear-gradient";
import Ripple from "react-native-material-ripple";
import { CustomInputField } from "../../common/inputField";

const WINDOW_WIDTH = Dimensions.get("window").width;

const icon_rightArrow = require("../../assets/button_white_arrow.png");
const icon_main = require("../../assets/add_tele_ic.png");
const icon_back_arrow = require("../../assets/back_arrow.png");
const icon_user_selected = require("../../assets/tick_green.png");
const icon_user_unselected = require("../../assets/grey_tick_ic.png");
var { width } = Dimensions.get("window");

class InviteSinglePerson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      loading: false,
      arrUsers: [],
      arrSelectedUserId: [],
      arrSearchData: [],
      group_member: [],
      isFromMySquad: false,
      squad_id: "",
      isFromContact: false,
      isFromAddFriend: false,
      alreadySentRequest: [],
      members: [],
    };
  }

  updateSearch = (search) => {
    this.setState({ search });
    if (search.trim().length > 0) {
      const arrSearchData = this.state.arrUsers.filter((data) => {
        return (
          data.full_name.includes(search) ||
          data.phone_number.toString().includes(search) ||
          data.email.includes(search)
        );
      });
      this.setState({ arrSearchData });
    } else {
      this.setState({ arrSearchData: [] });
    }
  };

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      // do something
      if (this.props.route.params !== undefined) {
        const {
          friends,
          isFromContact,
          isFromMySquad,
          group_member,
          squad_id,
          isFromAddFriend,
        } = this.props.route.params;
        this.setState({ isFromContact, isFromAddFriend: isFromAddFriend });
        if (group_member !== undefined) {
          const arrSelectedUserId =
            group_member.length > 0
              ? group_member.map((data) => data.member_id)
              : [];
          this.setState({
            isFromMySquad,
            group_member,
            squad_id,
            arrSelectedUserId,
          });
        }

        if (friends && friends.length > 0) {
          this.setState({ alreadySentRequest: friends });
        }
      }

      const { arrSelectedUser } = this.props;
      this.setState({ arrSelectedUserId: arrSelectedUser });

      this.getContactList();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  compareContacts = () => {
    const listofUserId = this.state.group_member.map((item) => {});
  };

  compareAll = (arrUsers) => {
    const { data } = this.props.route.params;

    let filtered = [];
    if (data.group_member) {
      arrUsers.map((main) => {
        let found = false;

        data.group_member.map((squad) => {
          if (squad.member_id == main.id) {
            found = true;
          }
        });
        if (!found) {
          filtered.push(main);
        }
      });
    } else {
      filtered = arrUsers;
    }
    this.setState({
      arrUsers: filtered,
    });
  };

  render() {
    console.log("this.state.arrUser")
    console.log(this.state.arrUsers)
    return (
      <View style={styles.container}>
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
                  Invite Persons
                </Text>
              </View>
              <View style={{ width: 60 }} />
            </View>
          </View>
        </View>

        <ScrollView>
          <View style={{ marginTop: 20 }}>
            <CustomInputField
              placeholder="Search"
              onChangeText={this.updateSearch}
              value={this.state.search}
              keyboardType="default"
              inputTextAlign={"left"}
              iconHeight={46}
              iconWidth={46}
              inputHeight={57}
              iconMarginLeft={7}
              inputPaddingLeft={25}
              icon={require("../../assets/interestSearchIcon.png")}
            />
          </View>
          <View style={{ flex: 2, marginTop: 23 }}>
            <FlatList
              style={{ paddingBottom: 85 }}
              data={
                this.state.arrSearchData.length > 0
                  ? this.state.arrSearchData
                  : this.state.arrUsers
              }
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    style={{
                      flexDirection: "column",
                      paddingHorizontal: 8,
                    }}
                    onPress={() => {
                      this.onPressSelectedUser(item.id);
                    }}
                  >
                    <View style={styles.itemView}>
                      <Image
                        source={{ uri: item.profile_image, cache: true }}
                        style={styles.profileImg}
                      />

                      <View
                        style={{ marginLeft: 10, justifyContent: "center" }}
                      >
                        <Text style={styles.headerView}>{item.full_name}</Text>
                      </View>

                      <View
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "flex-end",
                          marginRight: 15,
                        }}
                      >
                        {this.state.isFromAddFriend == false ? (
                          this.state.arrSelectedUserId.includes(item.id) ? (
                            <View
                              style={{
                                paddingHorizontal: 10,
                                height: 30,
                                backgroundColor: "grey",
                                borderRadius: 50,
                              }}
                            >
                              <Text
                                style={{
                                  height: "100%",
                                  marginTop: 6,
                                  fontSize: 12,
                                  color: "white",
                                }}
                              >
                                ADDED
                              </Text>
                            </View>
                          ) : (
                            <View
                              style={{
                                paddingHorizontal: 10,
                                height: 30,
                                backgroundColor: colors.greenButton,
                                borderRadius: 50,
                              }}
                            >
                              <Text
                                style={{
                                  height: "100%",
                                  marginTop: 6,
                                  fontSize: 12,
                                  color: "white",
                                }}
                              >
                                ADD
                              </Text>
                            </View>
                          )
                        ) : this.state.alreadySentRequest.includes(item.id) ? (
                          <View
                            style={{
                              paddingHorizontal: 10,
                              height: 30,
                              backgroundColor: colors.grey,
                              borderRadius: 50,
                            }}
                          >
                            <Text
                              style={{
                                height: "100%",
                                marginTop: 6,
                                fontSize: 12,
                                color: "white",
                              }}
                            >
                              ADDED
                            </Text>
                          </View>
                        ) : (
                          <TouchableOpacity
                            style={{
                              paddingHorizontal: 10,
                              height: 30,
                              backgroundColor: colors.greenButton,
                              borderRadius: 50,
                            }}
                            onPress={() => {
                              const { data, isFromAddEvent } =
                                this.props.route.params;

                              if (isFromAddEvent) {
                                var alreadySentRequest =
                                  this.state.alreadySentRequest;
                                alreadySentRequest.push(item.id);
                                this.setState({
                                  alreadySentRequest: alreadySentRequest,
                                  members: [...this.state.members, item],
                                });
                                return;
                              }

                              if (!data) {
                                this.sentFriendRequest(item.id);
                              }
                              var alreadySentRequest =
                                this.state.alreadySentRequest;
                              alreadySentRequest.push(item.id);
                              this.setState({
                                alreadySentRequest: alreadySentRequest,
                                members: [...this.state.members, item],
                              });
                            }}
                          >
                            <Text
                              style={{
                                height: "100%",
                                marginTop: 6,
                                fontSize: 12,
                                color: "white",
                              }}
                            >
                              ADD
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </ScrollView>

        {this.state.isFromAddFriend ? null : (
          <TouchableOpacity activeOpacity={0.8} onPress={this.onPressAddUsers}>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={["#38A5CA", "#54C8EE"]}
              style={styles.linearGradient}
            >
              <Text style={styles.textStyle}>Add</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
        <Loader loading={this.state.loading} />
      </View>
    );
  }

  onPressSelectedUser = (userId) => {
    // let userId = this.state.arrUsers[index].id
    let arrSelectedUserId = this.state.arrSelectedUserId;
    if (arrSelectedUserId.includes(userId)) {
      const data = arrSelectedUserId.filter((data) => data != userId);
      this.setState({
        arrSelectedUserId: data,
      });
    } else {
      arrSelectedUserId.push(userId);
      this.setState({
        arrSelectedUserId,
      });
    }
  };

  onPressAddUsers = () => {
    const data = this.props.route.params?.data;
    console.log("data")
    console.log(data)
    if (data) {
      this.addMemberInSquad();
    }
     else if (this.state.isFromContact) {
      console.log("this.state.isFromContact")
      console.log(this.state.isFromContact)
      const arrUsers = this.state.arrSelectedUserId;
      console.log("arrUsers")
      console.log(arrUsers)
      console.log("this.state.isFromMySquad")
      console.log(this.state.isFromMySquad)
      if (this.state.isFromMySquad && this.state.isFromMySquad == true) {

        this.props.setSelectedUserId(arrUsers);
        this.addMemberInSquad();
      } else {
        console.log("arrUsers")
        console.log(arrUsers)
        this.props.setSelectedUserId(arrUsers);

        if (arrUsers.length > 0) {
          this.props.navigation.navigate("AddGroup");
        } else {
          Toast.show("You have to select atleast one user");
        }
      }
    } else {
      this.props.setSelectedUserId([]);
      this.props.navigation.navigate("AddEvent2", { 
        data: this.state.members,
        title: this.props.route.params.title,
        address: this.props.route.params.address,
        latitude: this.props.route.params.latitude,
        longitude: this.props.route.params.longitude, });
    }
  };

  getContactList = async () => {
    this.setState({ loading: true });
    var parameter = new FormData();
    // const userId = await AsyncStorage.getItem('userId')
    const userId = this.props.userInfo.id;
    parameter.append("token", this.props.userInfo.token);
    ApiHelper.post("getContactList", parameter)
      .then((response) => {
        this.setState({ loading: false });
   
        if (response.status == 200) {
          if (response.data.status == "SUCCESS") {
            if (response.data.hasOwnProperty("getContactList")) {
              console.log("response.data.getContactList")
              console.log(response.data.getContactList)
              var contacts = response.data.getContactList.filter(
                (data) => data.id != userId
              );
              const data = this.props.route?.params?.data;

              if (this.props.route.params.invite_friend) {
                const data_friends = response.data.getContactList.filter(
                  (elem) => {
                    let found = false;
                    this.props.route.params.invite_friend.forEach((item) => {
                      if (item.id === elem.id) {
                        found = true;
                      }
                    });
                    return !found;
                  }
                );
                this.setState({
                  arrUsers: data_friends,
                });
              } else if (data !== undefined) {
                this.compareAll(contacts);
                console.log(">>>>>>>>contacts")
                console.log(contacts)
              } else {
                this.setState({
                  arrUsers: contacts,
                });
              }
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

  addMemberInSquad = () => {
    const { data } = this.props.route.params;
    console.log("this.state.alreadySentReques")
    console.log(this.state.alreadySentRequest)
    
    this.setState({ loading: true });
    var formdata = new FormData();
    formdata.append("token", this.props.userInfo.token);
    formdata.append("squad_id", data.squad_id);
    var arrSelectedUserId = this.state.alreadySentRequest.join(",");

    formdata.append("member_id", arrSelectedUserId);
    formdata.append("status", 1);
    console.log("formdata")
    console.log(formdata)

    ApiHelper.post("addMember", formdata)
      .then((response) => {

        this.setState({ loading: false });
        if (response.status == 200) {
          if (response.data.status == "SUCCESS") {
            if (response.data.hasOwnProperty("addMember")) {
              this.props.navigation.navigate("MySquad");
            }
            if (response.data.message) {
              alert("1")
              Toast.show(response.data.message);
            }
          } else {
            if (response.data.requestKey) {
              alert("2")
              Toast.show(response.data.requestKey);
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
        alert("3")
        Toast.show(error.message);
      });
  };

  sentFriendRequest = (userId) => {
    var formdata = new FormData();
    formdata.append("token", this.props.userInfo.token);
    formdata.append("user_id", userId);
    postMethod(
      this.props.navigation,
      "sendfriendRequest",
      formdata,
      (response) => {},
      (error) => {
        Toast.show(error.message);
      }
    );
  };
}

const styles = StyleSheet.create({
  headerView: {
    fontSize: 14,
    marginLeft: 10,
    fontWeight: "bold",
  },

  unReadViewContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingTop: 5,
    width: "15%",
    fontSize: 8,
    color: colors.GRAY,
  },
  unReadMessageView: {
    width: 20,
    height: 20,
    borderRadius: 20 / 2,
    margin: 5,
    marginTop: 5,
    marginLeft: 20,
    justifyContent: "center",
  },
  ///////////
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
  itemView: {
    flexDirection: "row",
    borderRadius: 40,
    marginBottom: 10,
    height: 58,
    width: WINDOW_WIDTH - 60,
    alignSelf: "center",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  profileImg: {
    width: 46,
    height: 46,
    borderRadius: 60,
    resizeMode: "cover",
    alignSelf: "center",
    marginLeft: 7,
  },

  headerView: {
    fontSize: 13,
    marginLeft: 16,
    color: "black",
    fontFamily: fonts.Medium,
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
    create_squad: state.manage_squad.create_squad,
    arrSelectedUser: state.manage_squad.arrSelectedUser,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setSelectedUserId: (data) => dispatch(setSelectedUserId(data)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(InviteSinglePerson);
