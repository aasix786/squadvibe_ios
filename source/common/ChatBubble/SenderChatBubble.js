import React, { Component, PureComponent } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import Svg, { Path } from "react-native-svg";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import PropTypes from "prop-types";
import { colors, fonts } from "../colors";
import { Image } from "react-native-elements";

export default class SenderChatBubble extends Component {
  render() {
    const { value, type, name, color } = this.props;
    // console.log("VAL", value)
    return (
      <View style={[styles.item, styles.itemOut]}>
        <View
          style={[
            styles.balloon,
            {
              backgroundColor:
                type == "image" ? "#e6e6e6" : color ? "#4AACCD" : "#4AACCD",
            },
          ]}
        >
          {/* {(name) ? <Text style={{ paddingTop: 5, color: '#C3D9CE',fontFamily:fonts.Bold,fontSize:13 }}>{name}</Text> : null} */}
          {type == "text" ? (
            <Text
              style={{
                paddingTop: 5,
                color: colors.white,
                fontFamily: fonts.Bold,
                fontSize: 14,
              }}
            >
              {value}
            </Text>
          ) : type == "image" ? (
            <Image
              styleName="small"
              style={{ height: 220, width: 220, marginTop: 5 }}
              borderRadius={5}
              source={{ uri: value }}
              PlaceholderContent={<ActivityIndicator color="white" />}
              placeholderStyle={{ backgroundColor: "" }}
              progressiveRenderingEnabled={true}
            />
          ) : type == "location" ? (
            <Image
              styleName="small"
              style={{ height: 220, width: 220, marginTop: 5 }}
              borderRadius={5}
              source={{ uri: value }}
              PlaceholderContent={<ActivityIndicator color="white" />}
              placeholderStyle={{ backgroundColor: "" }}
              progressiveRenderingEnabled={true}
            />
          ) : null}
        </View>
      </View>
    );
  }
}

SenderChatBubble.propTypes = {
  value: PropTypes.String,
  type: PropTypes.String,
};

const styles = StyleSheet.create({
  item: {
    marginVertical: moderateScale(7, 2),
    flexDirection: "row",
  },
  itemIn: {
    marginLeft: 20,
  },
  itemOut: {
    alignSelf: "flex-end",
    marginRight: 20,
  },
  balloon: {
    maxWidth: moderateScale(250, 2),
    // minWidth:moderateScale(40, 2),
    paddingHorizontal: moderateScale(10, 2),
    paddingTop: moderateScale(1, 2),
    paddingBottom: moderateScale(6, 2),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  arrowContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    flex: 1,
  },
  arrowLeftContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },

  arrowRightContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },

  arrowLeft: {
    left: moderateScale(-6, 0.5),
  },

  arrowRight: {
    right: moderateScale(-6, 0.5),
  },
});
