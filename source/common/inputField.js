import * as React from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  TextInput,
} from "react-native";
import { colors, fonts } from "./colors";
const WINDOW_WIDTH = Dimensions.get("window").width;

export const CustomInputField = (props) => {
  const {
    icon,
    iconWidth,
    iconHeight,
    value,
    onChangeText,
    placeholder,
    inputTextAlign,
    keyboardType,
    maxLength,
    editable,
    inputHeight,
    iconMarginLeft,
  } = props;

  return (
    <View style={styles.viewStyle}>
      <View>
        <Image
          source={icon}
          style={{
            width: iconWidth ? iconWidth : 45,
            height: iconHeight ? iconHeight : 45,
            marginLeft: iconMarginLeft ? iconMarginLeft : 2,
          }}
          resizeMode={"contain"}
        />
      </View>
      <View style={styles.textFieldViewStyle}>
        <TextInput
          style={[
            styles.inputStyle,
            {
              textAlign: inputTextAlign ? inputTextAlign : "center",
              paddingLeft: inputTextAlign ? 30 : 0,
              height: inputHeight ? inputHeight : 46,
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor="#989ba2"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          maxLength={maxLength}
          editable={editable}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  viewStyle: {
    width: WINDOW_WIDTH - 60,
    borderRadius: 36,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    alignSelf: "center",
  },
  textFieldViewStyle: {
    flex: 1,
    justifyContent: "center",
  },

  inputStyle: {
    color: "black",
    fontSize: 12,
    fontFamily: fonts.regular,
    paddingRight: 45,
  },
});
