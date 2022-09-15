import * as React from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
} from "react-native";
import { colors, fonts } from "./colors";

const SCREEN_WIDTH = Dimensions.get("window").width;

export const CustomButtonWithLeftIcon = (props) => {
  const { title = "Enter", style = {}, textStyle = {}, onPress, icon } = props;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.button, style]}
    >
      <View>
        <Image
          source={icon}
          style={{ width: 40, height: 40 }}
          resizeMode={"contain"}
        />
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={[styles.text, textStyle]}>{props.title}</Text>
      </View>
    </TouchableOpacity>
  );
};
export const CustomFacebookButton = (props) => {
  const { title = "Enter", style = {}, textStyle = {}, onPress, icon } = props;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.facebook_button, style]}
    >
      <View style={{marginLeft: 10}}>
        <Image
          source={icon}
          style={{ width: 25, height: 25 }}
          resizeMode={"contain"}
        />
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={[styles.text, textStyle]}>{props.title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export const CustomButtonWithRightIcon = (props) => {
  const { title = "Enter", style = {}, textStyle = {}, onPress, icon } = props;

  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      <Image source={icon} style={{ marginLeft: 20, width: 17, height: 21 }} />
      <Text style={[styles.text, textStyle]}>{props.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 46,
    width: SCREEN_WIDTH - 60,
    borderRadius: 36,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.greenButton,
  },
  facebook_button: {
    height: 46,
    width: SCREEN_WIDTH - 60,
    borderRadius: 36,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",
    borderWidth:1,
    borderColor:"#fff"
  },

  text: {
    paddingRight: 53,
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.white,
  },
  buttonStyle: {
    backgroundColor: colors.headingTextColor,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 36,
  },
  textStyle: {
    fontFamily: fonts.Bold,
    fontSize: 14,
  },
});
