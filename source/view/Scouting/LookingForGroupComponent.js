/* eslint-disable eslint-comments/no-unused-disable */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  StatusBar,
  ScrollView,
} from "react-native";
import { Button, Icon } from "react-native-elements";
import { colors, fonts } from "../../common/colors";
import CardStack, { Card } from "react-native-card-stack-swiper";
import { postMethod } from "../../Networking/APIModel";
import { connect } from "react-redux";
import Toast from "react-native-simple-toast";
import HeaderWithoutBack from "../components/headerWithoutBack";
import ApiHelper from "../../Networking/NetworkCall";
import axios from "axios";
import Entypo from "react-native-vector-icons/Entypo";

const WINDOW_WIDTH = Dimensions.get("window").width;

class LookingForGroupComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFromScounting: false,
      arrCards: [Card],
      arrSquads: [],
      loading: false,
      selectedIndex: 0,
      arrAllSquad: [],
      showPopup: false,
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      this.setState({ arrSquads: [] });
      if (this.props.route.params != undefined) {
        const { isFromScouting } = this.props.route.params;
        this.setState({ isFromScounting: isFromScouting });
      }
      // this.getMySquad()
      this.getAllSquad();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
    this.setState = (state, callback_arrow) => {
      return;
    };
  }

  getMySquad = () => {
    const currentSquad = this.state.arrSquads[this.state.selectedIndex];

    this.setState({ loading: true });
    var formdata = new FormData();
    formdata.append("token", this.props.userInfo.token);
    formdata.append("squad_id", currentSquad.squad_id);

    console.log("PARAMMM", formdata);

    ApiHelper.post("MergeGroupList", formdata)
      .then((response) => {
        console.log("MergeGroupList");  
            console.log(response);
        this.setState({ loading: false });
        if (response.status == 200) {
          if (response.data.status == "SUCCESS") {
            if (response.data.hasOwnProperty("MergeGroupList")) {
              this.setState({
                arrAllSquad: response.data.MergeGroupList,
              });
            }
          } else {
            if (response.data.requestKey) {
              Toast.show(response.data.requestKey);
            }
          }
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        Toast.show(error.message);
      });
  };

  getAllSquad = () => {
    this.setState({ loading: true, arrSquads: [] });
    var formdata = new FormData();
    formdata.append("token", this.props.userInfo.token);
    postMethod(
      this.props.navigation,
      "getsquadList",
      formdata,
      (success) => {
        console.log("getsquadList")
        console.log(success.getsquadList[0].group_member)
        const allSquads = [];
        success.getsquadList.forEach((squad, index) => {
          squad.squad_image.forEach((squadImg, ind) => {
            const obj = { ...squad };
            obj["squad_image"] = [squadImg];
            allSquads.push(obj);
            // console.log('INDEX', index , ind, allSquads[index].squad_image, squadImg, allSquads.length)
          });
        });

        this.setState({
          loading: false,
          arrSquads: allSquads,
        });
        this.swiper.initialIndex = 0;
        this.swiper.forceUpdate();
        this.swiper.initDeck();
      },
      (error) => {
        this.setState({ loading: false });
        // Toast.show(JSON.stringify(error))
      }
    );
  };

  sendGroupMerge = (id) => {
    const currentSquad = this.state.arrSquads[this.state.selectedIndex];

    const parameter = new FormData();
    parameter.append("token", this.props.userInfo.token);
    parameter.append("squad_first", id);
    parameter.append("squad_second", currentSquad.squad_id);
    console.log(parameter);
    axios
      .post("http://squadvibes.onismsolution.com/api/sendGroupMerge", parameter)
      .then((res) => {
        console.log("sendGroupMerge")
        console.log(res)
        this.setState({ showPopup: false });
        Toast.show("Matching activity has sent to your group to decide.");
        console.log("RESSSS", res.data);
      })
      .catch((err) => console.warn("err", err));
  };

  render() {
    const currentSquad = this.state.arrSquads[this.state.selectedIndex];
    const { isFromScouting } = this.props.route.params;

    return (
      <>
        <View style={{ flex: 1, backgroundColor: colors.white }}>
          <StatusBar
            backgroundColor={"transparent"}
            translucent
            barStyle="dark-content"
          />
          {/* <ImageBackground
            source={{
              uri: "https://media.istockphoto.com/photos/mountain-landscape-picture-id517188688?k=20&m=517188688&s=612x612&w=0&h=i38qBm2P-6V4vZVEaMy_TaTEaoCMkYhvLCysE7yJQ5Q=",
            }}
            style={{ height: "100%", width: "100%" }}
          > */}
          <View style={{ marginTop: 70, marginLeft: 30 }}>
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>
              Match Group
            </Text>
          </View>

          <CardStack
            style={styles.content}
            disableBottomSwipe={true}
            // horizontalSwipe={false}
            verticalSwipe={false}
            // horizontalSwipe = {false}
            renderNoMoreCards={() => (
              <Button
                onPress={() => this.reloadCards()}
                icon={
                  <Icon
                    type="material-community"
                    name="reload"
                    color="white"
                    size={30}
                  />
                }
                buttonStyle={{
                  height: 50,
                  width: 50,
                  backgroundColor: colors.greenButton,
                  borderRadius: 25,
                }}
              />
            )}
            ref={(swiper) => {
              this.swiper = swiper;
            }}
            onSwipedLeft={(index) => {
              this.setState({ selectedIndex: index + 1 });
              // this.likeDislikeSquad(squadId, '0')
            }}
            onSwipedRight={(index) => {
              console.log("onSwipedRight =======>", index);
              this.setState({ selectedIndex: index + 1 });
              // this.likeDislikeSquad(squadId, '1')
            }}
            onSwipe={(index) => {
              console.log("onSwipe =======>", index);
            }}
          >
            {this.state.arrSquads.map((squad, index) => {
              return (
                <Card
                  horizontalSwipe={false}
                  key={String(index)}
                  // style={styles.card}
                >
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                      this.props.navigation.navigate("UserDetail", {
                        isFromScouting: isFromScouting,
                        data: this.state.arrSquads[index],
                      })
                    }
                  >
                    <ImageBackground
                      source={{
                        uri:
                          squad.squad_image.length > 0
                            ? squad.squad_image[0].squad_image
                            : "",
                      }}
                      style={{
                        width: WINDOW_WIDTH - 100,
                        height: 480,
                        alignSelf: "center",
                        justifyContent: "flex-end",
                        marginBottom: 80,
                        shadowColor: "#000",
                        shadowOffset: { width: 2, height: 2 },
                        shadowOpacity: 0.4,
                        shadowRadius: 3,
                        elevation: 5,
                      }}
                      imageStyle={{ borderRadius: 32 }}
                    >
                      <View
                        style={{
                          height: 315,
                          width: "90%",
                          alignSelf: "center",
                          backgroundColor: "transparent",
                          flexDirection: "row",
                        }}
                      >
                        <ScrollView
                          showsHorizontalScrollIndicator={false}
                          horizontal={true}
                        >
                          {squad.group_member &&
                            squad.group_member.map((member) => (
                              <Image
                                style={{
                                  height: 65,
                                  width: 73,
                                  borderRadius: 17,
                                  marginRight: 10,
                                }}
                                source={{ uri: member.user_image }}
                              />
                            ))}
                        </ScrollView>
                      </View>
                      <Text
                        style={{
                          fontSize: 17,
                          fontFamily: "BeVietnam-SemiBold",
                          color: colors.white,
                          paddingLeft: 30,
                        }}
                      >
                        {squad.squad_name}
                      </Text>

                      <View style={{ flexDirection: "row", marginLeft: 30 }}>
                        <Image
                          style={{ height: 12, width: 12, marginTop: 5 }}
                          source={require("../../assets/marker.png")}
                        />
                        <Text
                          style={{
                            fontSize: 12,
                            fontFamily: "BeVietnam-SemiBold",
                            color: "#38A5CA",
                            paddingLeft: 5,
                          }}
                        >
                          {squad.location}
                        </Text>
                      </View>
                      <View
                        style={{
                          height: 90,
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => {
                            this.swiper.swipeLeft();
                          }}
                          style={{
                            height: 40,
                            width: 40,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 50,
                            backgroundColor: "white",
                          }}
                        >
                          <Image
                            style={{ height: 11, width: 11 }}
                            source={require("../../assets/reject.png")}
                          />
                        </TouchableOpacity>

                        <View style={{ width: 20 }} />

                        <TouchableOpacity activeOpacity={0.8} 
                        onPress={() => this.likeDislikeSquad(squad.squad_id)}
                        >
                          <Image
                            style={{ height: 65, width: 65 }}
                            source={require("../../assets/like.png")}
                          />
                        </TouchableOpacity>

                        <View style={{ width: 20 }} />

                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => {
                            this.setState({ showPopup: true }, () =>
                              this.getMySquad()
                            );
                          }}
                          style={{
                            height: 40,
                            width: 40,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 50,
                            backgroundColor: "white",
                          }}
                        >
                          <Image
                            style={{ height: 18, width: 18 }}
                            source={require("../../assets/accept.png")}
                          />
                        </TouchableOpacity>
                      </View>

                      <View style={{ height: 10 }} />
                    </ImageBackground>
                  </TouchableOpacity>
                </Card>
              );
            })}
          </CardStack>
          {/* </ImageBackground> */}
        </View>

        {this.state.showPopup && (
          <View
            style={{
              position: "absolute",
              backgroundColor: "white",
              top: 50,
              bottom: 120,
              left: 20,
              right: 20,
              elevation: 5,
            }}
          >
            <View style={{ elevation: 3 }}>
              <TouchableOpacity
                onPress={() => this.setState({ showPopup: false })}
                style={{ position: "absolute", top: 15, zIndex: 10, right: 20 }}
              >
                <Entypo name="cross" size={25} color="gray" />
              </TouchableOpacity>

              <Text
                style={{
                  fontSize: 22,
                  backgroundColor: "white",
                  textAlign: "center",
                  padding: 10,
                }}
              >
                Match with your groups
              </Text>
            </View>

            <FlatList
              style={{ marginTop: 10 }}
              data={this.state.arrAllSquad}
              keyExtractor={(item) => item.squad_id || Math.random()}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{
                    marginVertical: 5,
                    borderRadius: 4,
                    borderBottomColor: "gray",
                    borderBottomWidth:
                      index !== this.state.arrAllSquad.length - 1 ? 1 : 0,
                    padding: 10,
                  }}
                  onPress={() => {
                    this.sendGroupMerge(item.squad_id);
                    // this.props.navigation.navigate('ManageSquad', { data: item, isFromEditSquad: false })
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      marginHorizontal: 10,
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={{
                        uri:
                          item.squad_image.length > 0
                            ? item.squad_image[0].squad_image
                            : "http://3.137.103.223/squad/public/default_image.png",
                      }}
                      style={{ height: 55, width: 55, borderRadius: 32 }}
                    />
                    <View style={{ marginLeft: 20, justifyContent: "center" }}>
                      <Text
                        style={{
                          color: colors.black,
                          fontSize: 14,
                          fontFamily: fonts.Medium,
                        }}
                        numberOfLines={1}
                      >
                        {item.squad_name}
                      </Text>
                    </View>
                    <View
                      style={{
                        marginLeft: "auto",
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
                      {/* <Text style={{color:colors.black, fontSize:10,marginRight:10}}>{this.getDate(item.created_date)}</Text> */}
                      <TouchableOpacity
                        onPress={() =>
                          this.setState({
                            selectedIndex:
                              this.state.selectedIndex == -1 ? index : -1,
                          })
                        }
                      >
                        <Image
                          source={require("../../assets/three_dots_ic.png")}
                          resizeMode={"center"}
                          style={{ height: 15, width: 10 }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={() => {
                return (
                  <View
                    style={{
                      height: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontFamily: fonts.Medium, fontSize: 17 }}>
                      No squad created yet
                    </Text>
                  </View>
                );
              }}
            />
          </View>
        )}
      </>
    );
  }

  addCards = () => {
    for (let index = 0; index < this.state.arrSquads.length; index++) {
      const squad = array[index];
      return (
        <Card key={String(index)} style={styles.card}>
          <TouchableOpacity
            style={{
              backgroundColor: "#FEFAEA",
              flex: 1,
              height: "100%",
              width: "100%",
            }}
            activeOpacity={0.9}
            onPress={() =>
              this.props.navigation.navigate("UserDetail", {
                isFromScouting: this.state.isFromScounting,
                data: squad,
              })
            }
          >
            <View
              style={{
                marginHorizontal: 0,
                marginVertical: 0,
                backgroundColor: "#F9E6A4",
              }}
            >
              <View>
                <Image
                  source={{
                    uri:
                      squad.squad_image.length > 0
                        ? squad.squad_image[0].squad_image
                        : "",
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    overflow: "hidden",
                  }}
                  resizeMode={"cover"}
                />
                <View
                  style={{
                    bottom: 0,
                    backgroundColor: "#000000",
                    opacity: 0.5,
                    height: "15%",
                    width: "100%",
                    position: "absolute",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 22,
                      fontFamily: "BeVietnam-SemiBold",
                      color: "#FFFFFF",
                      width: "100%",

                      textAlign: "center",
                    }}
                  >
                    {squad.squad_name}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Card>
      );
    }
  };

  reloadCards = () => {
    this.getAllSquad();
    this.swiper.initDeck();
  };
  likeDislikeSquad = (squadID) => {
    this.setState({ loading: true });
    var formdata = new FormData();
    formdata.append("token", this.props.userInfo.token);
    formdata.append("squad_id", squadID);
    postMethod(
      this.props.navigation,
      "likeSquad",
      formdata,
      (success) => {
        console.log("likedislikeSquad")
        console.log(success)

        this.setState({
          loading: false,
        });
        Toast.show(success.message)
      },
      (error) => {
        console.log("ERROR", error);
        this.setState({ loading: false });
      }
    );
  };
  // likeDislikeSquad = (squadID, status) => {
  //   this.setState({ loading: true });
  //   var formdata = new FormData();
  //   formdata.append("token", this.props.userInfo.token);
  //   formdata.append("squad_id", squadID);
  //   formdata.append("like_dislike_status", status);

  //   postMethod(
  //     this.props.navigation,
  //     "likedislikeSquad",
  //     formdata,
  //     (success) => {
  //       console.log("likedislikeSquad")
  //       console.log(success)
  //       this.setState({
  //         loading: false,
  //       });
  //     },
  //     (error) => {
  //       console.log("ERROR", error);
  //       this.setState({ loading: false });
  //       // Toast.show("card not found")
  //     }
  //   );
  // };
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: Dimensions.get("window").width,
    height: 480,
    backgroundColor: "transparent",
    // overflow: "hidden",
    justifyContent: "center",
    alignSelf: "center",
  },
  card1: {
    backgroundColor: "#FE474C",
  },
  card2: {
    backgroundColor: "#FEB12C",
  },
  label: {
    lineHeight: 400,
    textAlign: "center",
    fontSize: 55,
    fontFamily: "System",
    color: "#ffffff",
    backgroundColor: "transparent",
  },
});

// export default LookingForGroupComponent;
const mapStateToProps = (state) => {
  return {
    userInfo: state.user.userInfo,
  };
};
export default connect(mapStateToProps)(LookingForGroupComponent);
