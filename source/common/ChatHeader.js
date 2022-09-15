import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

class ChatHeader extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.back_arrowImageContainer} onPress={() => {}}>
          <Image source={this.props.source} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.titleTextStyle}>{this.props.title}</Text>
        </View>
        <TouchableOpacity style={styles.leftImageContainer} onPress={() => {}}>
          <Image source={this.props.iconSource} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    padding: 0,
  },
  back_arrowImageContainer: {
    flex: 1,
    right: 10,
  },
  titleContainer: {
    justifyContent: "center",
    // flex: 1,
    alignItems: "center",
  },
  titleTextStyle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  leftImageContainer: {
    flex: 1,
    flexDirection: "row-reverse",
    alignItems: "center",
    left: 5,
  },
  leftImageStyle: {
    color: "rgb(152,147,128)",
    fontWeight: "bold",
  },
});

export default ChatHeader;
