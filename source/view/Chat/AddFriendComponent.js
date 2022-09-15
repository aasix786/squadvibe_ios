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
import { colors, fonts, SCREEN_SIZE } from "../../common/colors";
import { Icon, SearchBar } from "react-native-elements";
import Toast from "react-native-simple-toast";
import { postMethod } from "../../Networking/APIModel";
import Loader from "../../common/Loader";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/header";
import ApiHelper from "../../Networking/NetworkCall";
import Button from "../components/button";
import LinearGradient from "react-native-linear-gradient";
import Ripple from "react-native-material-ripple";
import { CustomInputField } from "../../common/inputField";

const WINDOW_WIDTH = Dimensions.get("window").width;

class AddFriendComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      loading: false,
      arrFriends: [],
      arrSearchUsers: [],
      current_user_Id: "",
    };
  }

  updateSearch = (search) => {
    this.setState({ search });
    var strSearch = String(search).toLowerCase();

    if (search) {
      const results = this.state.arrFriends.filter((data) =>
        String(data.full_name).toLowerCase().includes(strSearch)
      );
      this.setState({
        arrSearchUsers: results,
      });
    } else {
      this.setState({
        arrSearchUsers: [],
      });
    }
  };

  render() {
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
                  My friends
                </Text>
              </View>
              <View style={{ width: 60 }} />
            </View>
          </View>
        </View>

        <View style={{ flex: 2, marginTop: 20, paddingBottom: 70 }}>
          <View style={{ marginBottom: 20 }}>
            <CustomInputField
              placeholder="Search"
              value={this.state.search}
              onChangeText={this.updateSearch}
              keyboardType="default"
              iconHeight={43}
              iconWidth={43}
              icon={require("../../assets/interestSearchIcon.png")}
            />
          </View>

          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={
              this.state.arrSearchUsers.length > 0
                ? this.state.arrSearchUsers
                : this.state.arrFriends
            }
            keyExtractor={(item) => item.request_id}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  style={{
                    flexDirection: "column",
                    paddingHorizontal: 10,
                  }}
                  onPress={() => {
                    console.log("MVC == ", item.request_id);
                    this.props.navigation.navigate("Profile", {
                      item: {
                        // ...item,
                        user_id: item.request_id,
                      },
                    });
                  }}
                >
                  <View style={styles.itemView}>
                    <View
                      style={{
                        width: 60,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        source={{
                          uri:
                            item.profile_image != "" ? item.profile_image : "",
                        }}
                        style={styles.profileImg}
                      />
                    </View>

                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                      }}
                    >
                      <Text style={styles.headerView}>{item.full_name}</Text>
                    </View>
                    {item.request_status == 0 ? (
                      <TouchableOpacity
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "flex-end",
                          marginRight: 15,
                        }}
                        onPress={()=>this.requestAcceptReject(item.request_uuid,"1")}
                      >
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
                            Accept
                          </Text>
                        </View>
                      </TouchableOpacity>

                    ) : null}

                  </View>
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={() => {
              return (
                <View
                  style={{
                    height: SCREEN_SIZE.SCREEN_WIDTH * 1.5,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontFamily: fonts.Medium, fontSize: 17 }}>
                    No friends yet
                  </Text>
                </View>
              );
            }}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            this.props.navigation.navigate("AddSingleFriend", {
              isFromContact: true,
              group_member: this.state.group_member,
              isFromMySquad: this.state.isFromMySquad,
              squad_id: this.state.squad_id,
              friends: this.state.arrFriends,
            });
          }}
        >
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={["#38A5CA", "#54C8EE"]}
            style={styles.linearGradient}
          >
            <Text style={styles.textStyle}>Add Friend</Text>
          </LinearGradient>
        </TouchableOpacity>
        <Loader loading={this.state.loading} />
      </View>
    );
  }

  async componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      // const userId = await AsyncStorage.getItem('userId')
      AsyncStorage.getItem("userId").then((res) => {
        this.setState({
          current_user_Id: res,
        });
      });
      this.getFriendlist();
      // this.getListOfAllUsers()
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback_arrow) => {
      return;
    };
  }

  getListOfAllUsers = async () => {
    var parameter = new FormData();
    const userId = await AsyncStorage.getItem("userId");
    parameter.append("token", this.props.userInfo.token);

    ApiHelper.post("getContactList", parameter)
      .then((response) => {
        this.setState({ loading: false });
        if (response.status == 200) {
          if (response.data.status == "SUCCESS") {
            if (response.data.hasOwnProperty("getContactList")) {
              var contacts = response.data.getContactList.filter(
                (data) => data.id != userId
              );
              // const friends = (contacts && contacts.length > 0) ? response.data.getContactList.filter(data => data.is_friend == 1).map(data => data.id) : []
              // if(data.length>0)

              this.setState({
                arrFriends: contacts,
              });

              // else {

              // }
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

  getFriendlist = async () => {
    this.setState({ loading: true });
    const authToken = this.props.userInfo.token;

    var formdata = new FormData();
    formdata.append("token", authToken);
    // formdata.append("token",'sd3jP9J6H5KWi9kaWJFT'); // zubair bhai token
    postMethod(
      this.props.navigation,
      "friendList",
      formdata,
      (response) => {
        if (response.friendList.requestList.length > 0) {
          const arrFriends = [];

          response.friendList.requestList.forEach((elem, index) => {
            if (elem.full_name || elem.user_name) {
              arrFriends.push(elem);
              console.log("EEEEE", elem);
            }
            // if(obj[elem.user_id] == undefined){
            //   obj[elem.user_id] = "123"
            // }
          });

          this.setState({
            arrFriends: arrFriends,
            loading: false,
          });
        } else {
          this.setState({
            loading: false,
          });
        }
      },
      (error) => {
        this.setState({ loading: false });
        Toast.show(error.message);
      }
    );
  };

  requestAcceptReject = async (request_id, request_status) => {
    this.setState({ loading: true });
    // const authToken = await AsyncStorage.getItem('authToken')
    const authToken = this.props.userInfo.token;

    var formdata = new FormData();
    formdata.append("token", authToken);
    formdata.append("request_id", request_id);
    formdata.append("request_status", request_status);

    postMethod(
      this.props.navigation,
      "requestAcceptReject",
      formdata,
      (response) => {
        // this.setState({
        //   loading:false
        // })
        if (response.message) {
          Toast.show(response.message);
        }
        this.getFriendlist();
      },
      (error) => {
        Toast.show(error.message);
      }
    );
  };
}

const styles = StyleSheet.create({
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
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },
  profileImg: {
    width: 46,
    height: 46,
    borderRadius: 60,
    resizeMode: "cover",
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
    userInfo: state.user.userInfo,
  };
};
export default connect(mapStateToProps)(AddFriendComponent);
