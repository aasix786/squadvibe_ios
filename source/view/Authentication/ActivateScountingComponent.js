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
  StatusBar,
} from "react-native";
import { colors, fonts } from "../../common/colors";
import { HeadingText } from "../../common/HeadingText";
import { CustomButtonWithLeftIcon } from "../../common/ThemeButton";
import HyperlinkedText from "react-native-hyperlinked-text";
import { Button } from "react-native-elements";
import { color } from "react-native-elements/dist/helpers";
import Header from "../components/header";

export default class ActivateScountingComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.data=this.props.route.params
    this.state = {
      code: "",
      isCheck: false,
      birthDate: "",
      images: ["", "", "", "", "", "", "", ""],
      selectedIndex: -1,
      arrInterest: ["Drinking", "Playing games"],
    };
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <Header back={this.props.navigation} />
        <ScrollView
          style={{ flex: 1, marginTop: -70 }}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View>
          {this.data.activeScout !=false ? (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Image
                style={{ height: 156, width: 156, borderRadius: 78 }}
                source={require("../../assets/avtar.jpg")}
              />
              <Text
                style={{
                  marginTop: 10,
                  color: colors.black,
                  fontFamily: fonts.SemiBold,
                  fontSize: 18,
                }}
              >
                Callie Fuller
              </Text>
            </View>
          ):null}
            <Text
              style={{
                textAlign: "center",
                width: 164,
                alignSelf: "center",
                marginTop: 33,
                color: colors.black,
                fontFamily: fonts.Bold,
                fontSize: 25,
              }}
            >
              Coming Soon
            </Text>
          </View>
        </ScrollView>
{this.data.activeScout !=false ? (

<Button
activeOpacity={0.6}
title="ACTIVATE SCOUTING"
titleStyle={{ fontSize: 14, fontFamily: fonts.Bold }}
containerStyle={{ marginHorizontal: 20, marginBottom: 15 }}
buttonStyle={{
  height: 45,
  backgroundColor: colors.pinkbg,
  borderRadius: 36,
}}
onPress={() =>
  this.props.navigation.navigate("GroupType", {
    title: "I am Looking for",
    isFromScouting: true,
  })
}
/>
):null}
      
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
});
