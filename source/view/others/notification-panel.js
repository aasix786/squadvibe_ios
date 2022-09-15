import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ToastAndroid,
  Image,
  RefreshControl,
  Dimensions,
  StatusBar,
  StyleSheet,
} from "react-native";
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { colors, fonts, SCREEN_SIZE } from "../../common/colors";
import Header from "../components/header";
import axios from "axios";
import { useSelector } from "react-redux";
import Toast from "react-native-simple-toast";
import LinearGradient from "react-native-linear-gradient";
import Ripple from "react-native-material-ripple";
import { CustomInputField } from "../../common/inputField";

const WINDOW_WIDTH = Dimensions.get("window").width;

export default function ChangeNumber({ navigation, route }) {
  const [state, setstate] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const data = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    notifications();
  }, []);

  const notifications = () => {
    const parameter = new FormData();
    parameter.append("token", data.token);
    parameter.append("user_id", data.id);
    console.log(parameter);
    axios
      .post("http://squadvibes.onismsolution.com/api/getUserNoti", parameter)
      .then((res) => {
        console.log("notifications", res.data)
        setstate(res.data.getUserNoti);
        // if(res.data.message === 'Verification Code Sent'){
        //     Toast.show('OTP Sent Successfully')
        //     navigation.navigate('ChangeNumberOTP', state)
        // }else{
        //     Toast.show('Error')
        // }
      });
  };

  const onRefresh = () => {
    notifications();
  };

  const getMonth = (value) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[value - 1];
  };

  const open = (elem) => {
    console.log("ele", elem);

    switch (elem.type) {
      case "message":
        navigation.navigate("Chat", {
          receiverId: elem.sender_id,
          name: elem.full_name,
          userData: {},
        });
        break;

      case "squadMessage":
        navigation.navigate("Chat", {
          receiverId: elem.user_id,
          name: elem.squad_name,
          userData: { isSquad: true },
        });
        break;

      case "squad":
        navigation.navigate("MySquad");
        break;

      case "Poll":
        navigation.navigate("Chat", {
          receiverId: elem.user_id,
          // name : elem.squad_name,
          userData: { isSquad: true },
        });
        break;
      case "EventInvite":
        navigation.navigate("ShuffleDetail", {
          eventData: { event_id: elem.user_id },
        });
        break;
    }
  };
  // ShuffleDetailCopy

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
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
                onPress={() => navigation.goBack()}
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
                Notifications
              </Text>
            </View>
            <View style={{ width: 60 }} />
          </View>
        </View>
      </View>

      <ScrollView
        style={{ marginTop: 30 }}
        refreshControl={
          <RefreshControl
            // enabled={true}
            refreshing={refresh}
            onRefresh={onRefresh}
          />
        }
      >
        {state.map((elem) => {
          let title = elem.full_name;
          let image = elem.image;
          if (
            elem.type === "squad" ||
            elem.type === "squadMessage" ||
            elem.type == "Poll" ||
            elem.type == "likedislike"
          ) {
            title = elem.squad_name;
            image = elem.squad_image;
          } else if (elem.type == "EventInvite") {
            title = elem.event_title;
            image =
              "https://sv2109.com/sites/default/files/field/image/bigstock-events-7444309_1.jpg";
          }
          console.log("ELEM", elem, image);

          const date_time = elem.date_time;
          const msgDay = parseInt(date_time?.slice(8, 10));

          const month = getMonth(parseInt(date_time?.slice(5, 7)));
          const time = `${msgDay}-${month}`;
          return (
            <TouchableOpacity
              onPress={() => open(elem)}
              style={{
                flexDirection: "column",
                paddingHorizontal: 10,
              }}
              activeOpacity={0.8}
            >
              <View style={styles.itemView}>
                <Image style={styles.profileImg} source={{ uri: image }} />
                <View style={{ marginLeft: 15 }}>
                  <Text style={{ color: "black", fontSize: 17 }}>{title}</Text>
                  <Text style={{ marginTop: 5 }}>{elem.message}</Text>
                </View>

                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "flex-end",
                  }}
                >
                  <Text style={{ margin: 10 }}>{time}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
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
    marginBottom: 20,
    height: 58,
    width: WINDOW_WIDTH - 60,
    alignSelf: "center",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  profileImg: {
    width: 46,
    height: 46,
    borderRadius: 60,
    resizeMode: "cover",
    alignSelf: "center",
    marginLeft: 7,
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
