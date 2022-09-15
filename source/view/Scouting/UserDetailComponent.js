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
  Dimensions,
  StatusBar,
} from "react-native";
import { colors, fonts } from "../../common/colors";
import { HeadingText } from "../../common/HeadingText";
import { Button } from "react-native-elements";
import Header from "../components/header";
import Ripple from "react-native-material-ripple";

export default class UserDetailComponent extends PureComponent {
  constructor() {
    super();
    this.state = {
      code: "",
      isCheck: false,
      birthDate: "",
      images: ["", "", "", "", "", "", "", ""],
      selectedIndex: -1,
      arrInterest: ["Drinking", "Playing games"],
      isFromScouting: false,
      squadDetails: {},
      group_interest: [],
      group_members: [],
      squad_images: [],
    };
  }

  componentDidMount() {
    if (this.props.route.params != undefined) {
      const { isFromScouting, data } = this.props.route.params;
      this.setState({
        isFromScouting: isFromScouting,
        squadDetails: data,
        group_interest: data.interest_data ? data.interest_data : [],
        group_members: data.group_member ? data.group_member : [],
        squad_images: data.squad_image ? data.squad_image : [],
      });
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <StatusBar
          backgroundColor={"transparent"}
          translucent
          barStyle="light-content"
        />

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

        <Image
          style={{ height: 300, width: "100%" }}
          source={{
            uri:
              this.state.squad_images.length > 0
                ? this.state.squad_images[0].squad_image
                : "",
          }}
        />

        <ScrollView
          style={{
            flexGrow: 1,
            borderTopRightRadius: 30,
            borderTopLeftRadius: 30,
            overflow: "hidden",
            backgroundColor: "white",
            marginTop: -30,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              justifyContent: "center",
              paddingVertical: 20,
            }}
          >
            <Text
              style={{
                color: colors.black,
                fontFamily: fonts.SemiBold,
                fontSize: 22,
                paddingLeft: 20,
              }}
            >
              {this.state.squadDetails.squad_name}
            </Text>

            <View
              style={{ flexDirection: "row", marginLeft: 20, marginTop: 5 }}
            >
              <Image
                style={{ height: 18, width: 18, marginTop: 0 }}
                source={require("../../assets/marker.png")}
              />
              <Text
                style={{
                  fontSize: 14,
                  color: "#7B7B7B",
                  paddingLeft: 5,
                }}
              >
                {this.state.squadDetails.location}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: "#BFBFBF",
                  paddingLeft: 8,
                }}
              >
                {this.state.squadDetails.distance} km
              </Text>
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
                title={"Interests"}
                style={{
                  fontSize: 18,
                  color: colors.black,
                  fontFamily: fonts.SemiBold,
                }}
              />
            </View>
            <View style={{ flexDirection: "row", marginVertical: 10 }}>
              {this.state.group_interest.map((interestData) => {
                return (
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
                );
              })}
            </View>
          </View>

          {this.state.isFromScouting == true ? null : (
            <>
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
                </View>
                <View
                  style={{
                    marginVertical: 15,
                    height: 200,
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <Image
                    source={{
                      uri:
                        this.state.squad_images.length > 0
                          ? this.state.squad_images[0].squad_image
                          : "",
                    }}
                    style={{ width: "100%", height: "100%", borderRadius: 20 }}
                  />
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
                    title={"We are looking for"}
                    style={{
                      fontSize: 18,
                      color: colors.black,
                      fontFamily: fonts.SemiBold,
                    }}
                  />
                </View>

                <View
                  style={{
                    alignSelf: "flex-start",
                    marginVertical: 15,
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
                    {this.state.squadDetails.looking_for == 0 ? "Male Group" : this.state.squadDetails.looking_for == 1 ? "Female Group" : "Others"}
                  </Text>
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
                    title={"Planned activities"}
                    style={{
                      fontSize: 18,
                      color: colors.black,
                      fontFamily: fonts.SemiBold,
                    }}
                  />
                </View>
                <View style={{ flexDirection: "row", marginVertical: 10 }}>
                  <View
                    style={{
                      marginHorizontal: 10,
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
                      Drinking
                    </Text>
                  </View>
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <Text
                      style={{
                        margin: 10,
                        fontSize: 13,
                        fontFamily: fonts.Regular,
                      }}
                    >
                      23 Aug 2021
                    </Text>
                  </View>
                </View>
              </View>

              <View
                style={{
                  marginHorizontal: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <HeadingText
                  title={"Group Members"}
                  style={{
                    fontSize: 18,
                    color: colors.black,
                    fontFamily: fonts.SemiBold,
                  }}
                />
              </View>
              <View style={{ height: 16 }} />
              <View
                style={{
                  paddingBottom: 10,
                  marginHorizontal: 16,
                }}
              >
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={this.state.group_members}
                  keyExtractor={(item) => item.member_id}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ selectedIndex: index });
                        this.props.navigation.navigate("Profile", { item });
                      }}
                      activeOpacity={0.8}
                      //   style={{ width: "25%", marginVertical: 5 }}
                    >
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          marginHorizontal: 8,
                        }}
                      >
                        <Image
                          source={{ uri: item.user_image }}
                          style={{ height: 177, width: 122, borderRadius: 30 }}
                        />
                      </View>
                      <Text
                        style={{
                          marginVertical: 8,
                          color: "#0D110F",
                          fontFamily: fonts.Regular,
                          fontSize: 13,
                          textAlign: "center",
                        }}
                      >
                        {item.full_name}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </>
          )}

          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              icon={
                <Image
                  source={require("../../assets/black_cross_ic.png")}
                  style={{ height: 64, width: 64 }}
                />
              }
              buttonStyle={{ backgroundColor: "" }}
              activeOpacity={1}
              onPress={() => this.props.navigation.goBack()}
            />
            <Button
              icon={
                <Image
                  source={require("../../assets/pro_ic.png")}
                  style={{ height: 64, width: 64 }}
                />
              }
              buttonStyle={{ backgroundColor: "" }}
              activeOpacity={1}
              onPress={() => this.props.navigation.goBack()}
            />
            <Button
              icon={
                <Image
                  source={require("../../assets/green_tick_ic.png")}
                  style={{ height: 64, width: 64 }}
                />
              }
              buttonStyle={{ backgroundColor: "" }}
              activeOpacity={1}
              onPress={() => this.props.navigation.goBack()}
            />
          </View>

          <View style={{ height: 30 }} />
        </ScrollView>
      </View>
    );
  }
}

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
    width: "84%",
    // height: 50,
    backgroundColor: "#00A551",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 40,
    marginHorizontal: 36,
    // borderRadius: 25
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
  backButtonStyle: {
    height: 34,
    width: 34,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    position: "absolute",
    zIndex: 99,
    top: 50,
    left: 27,
  },
});
