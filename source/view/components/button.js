import React from "react";
import { View, Text, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { colors } from "../../common/colors";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function Button(props) {
  return (
    <View
      style={[
        {
          alignItems: "center",
          position: "absolute",
          bottom: 20,
          left:0,
          right:0,
          height: 80
        },
        { ...props.style },
      ]}
    >
      <TouchableOpacity
        onPress={props.clicked}
        style={{
          width: SCREEN_WIDTH - 60,
          backgroundColor: props.bg ? props.bg : colors.pinkbg,
          height: 50,
          borderRadius: 60,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: props.textColor ? props.textColor : "white",
            fontFamily: "avenir-medium",
          }}
        >
          {props.name ? props.name : "Next"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
