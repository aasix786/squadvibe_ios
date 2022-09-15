import React, { Component, PureComponent } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import Svg, { Path } from "react-native-svg";
import {
  scale,
  verticalScale,
  moderateScale,
  NamedStyles,
} from "react-native-size-matters";
import PropTypes from "prop-types";
import { colors, fonts } from "../colors";
import { Image } from "react-native-elements";

export default class ReceiverChatBubble extends Component {
  render() {
    const { value, type, name } = this.props;
    return (
      <View style={[styles.item, styles.itemIn]}>
        <View style={[styles.balloon, { backgroundColor: "#E7F9FF" }]}>
          {name ? (
            <Text
              style={{
                paddingTop: 0,
                color: "#404040",
                fontFamily: fonts.regular,
                fontSize: 11,
              }}
            >
              {name}
            </Text>
          ) : null}
          {type == "text" ? (
            <Text
              style={{
                paddingTop: 0,
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
              style={{ height: 220, width: 250, marginTop: name ? 10 : 5 }}
              borderRadius={5}
              source={{ uri: value, cache: true }}
              PlaceholderContent={<ActivityIndicator color="white" />}
              placeholderStyle={{ backgroundColor: "" }}
              progressiveRenderingEnabled={true}
            />
          ) : type == "location" ? (
            <Image
              styleName="small"
              style={{ height: 220, width: 250, marginTop: name ? 10 : 5 }}
              borderRadius={5}
              source={{ uri: value, cache: true }}
              PlaceholderContent={<ActivityIndicator color="white" />}
              placeholderStyle={{ backgroundColor: "" }}
              progressiveRenderingEnabled={true}
            />
          ) : null}
          {/* <Text style={{ paddingTop: 5, color: 'white' }}>{props.value}</Text> */}
          <View style={[styles.arrowContainer, styles.arrowLeftContainer]}>
            {/* <Image source={require('../../assets/bubble_light_blue.png')}/> */}

            {/* <Svg style={styles.arrowLeft} width={moderateScale(15.5, 0.6)} height={moderateScale(17.5, 0.6)} viewBox="32.484 17.5 15.515 17.5" enable-back_arrowground="new 32.485 17.5 15.515 17.5">
              <Path
                d="M38.484,17.5c0,8.75,1,13.5-6,17.5C51.484,35,52.484,17.5,38.484,17.5z"
                fill={colors.chatReceiverBGColor}
                x="0"
                y="0"
              />
            </Svg> */}
          </View>
        </View>
      </View>
    );
  }
}

ReceiverChatBubble.propTypes = {
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
    paddingTop: 4,
    paddingBottom: moderateScale(10, 2),
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
