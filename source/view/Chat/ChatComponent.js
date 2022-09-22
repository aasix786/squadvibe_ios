import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
  Linking,
  Platform,
  KeyboardAvoidingView,
  PermissionsAndroid,
  StatusBar,
  Dimensions,
} from "react-native";
import { colors, fonts, SCREEN_SIZE } from "../../common/colors";
import Loader from "../../common/Loader";
import moment from "moment";
import { connect } from "react-redux";

import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import ReceiverChatBubble from "../../common/ChatBubble/ReceiverChatBubble";
import SenderChatBubble from "../../common/ChatBubble/SenderChatBubble";
import { moderateScale } from "react-native-size-matters";
import { Icon, LinearProgress } from "react-native-elements";
import Header from "../components/header";
import messaging from "@react-native-firebase/messaging";
import axios from "axios";
import ApiHelper from "../../Networking/NetworkCall";
import Toast from "react-native-simple-toast";
import ImagePicker from "react-native-image-crop-picker";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import LinearGradient from "react-native-linear-gradient";
import Ripple from "react-native-material-ripple";
import { CustomInputField } from "../../common/inputField";

const WINDOW_WIDTH = Dimensions.get("window").width;

const icon_send = require("../../assets/plane.png");

// const GOOGLE_API_KEY = "AIzaSyAis1VNdZkjXeCKL-STa0b9aHdKk83WFtk"
const GOOGLE_API_KEY = "AIzaSyDZRd7CisUH6tg733-02d57hQ23B1ANR1k";

class ChatComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      selectedType: 0,
      height: 0,
      txtMessage: "",
      friends: [],
      messages: [
        // {message:'my first message my first message my first message my first message my first message my first message ', type:"text", time:new Date,senderId:"1" },
        // {message:'my first message', type:"image", time:new Date, image:"https://images.ctfassets.net/hrltx12pl8hq/7yQR5uJhwEkRfjwMFJ7bUK/dc52a0913e8ff8b5c276177890eb0129/offset_comp_772626-opt.jpg?fit=fill&w=800&h=300"},
        // {message:'my first message', type:"text", time:new Date,senderId:"1"},
        // {message:'my first message', type:"text", time:new Date},
        // {message:'my first message', type:"text", time:new Date,senderId:"1"},
        // {message:'my first message', type:"text", time:new Date,senderId:"1"},
      ],
      senderId: this.props.userInfo.id,
      receiverId: "",
      chatRoomId: "",
      pageNo: 1,
      current_user_Id: 30,
      current_user_name: "",
      firebase_login_userInfo: "",
      is_receiver_online: false,
      filePath: "",
      imageResponse: "",
      loading: false,
      profile_image: "",
      user_name: "",
      userData: "",
      unreadCount: 0,
      isGroup: false,
      group_member: [],
      arrFriends: [],
      members: [],
      squad_id: "",
      data: [
        {
          icon: "http://3.137.103.223/squad/public/profile_image/1638011059.jpg",
          isSelected: true,
        },
        {
          icon: "http://3.137.103.223/squad/public/profile_image/1638011059.jpg",
          isSelected: false,
        },
        {
          icon: "http://3.137.103.223/squad/public/profile_image/1638011059.jpg",
          isSelected: true,
        },
      ],
    };

    messaging().onMessage(async (messageData) => {
      const title = messageData.data;
      console.log("NOTI ", title);
      if (title.id === this.props.route.params.receiverId || title.isSquad) {
        const message = messageData.notification;
        console.log("MSG", message);
        if (title.type == "event") {
          if (title.isSquad == "true") {
            this.setState({ messages: [] }, () => this.getSquadMsgs(1));
          } else {
            this.setState({ messages: [] }, () => this.getGroupSquadMsgs(1));
          }
          return;
        }
        if (message.body) {
          console.log("INSIDE");
          const obj = {
            message: title.message,
            time: new Date(),
            name: title.full_name || title.username,
            type: title.type,
            event_image: title.eventImage,
            event_name: title.eventName,
            user_image: title.user_image,
            user_name: title.user_name,
            joined: title.joined,
            date_time: title.date_time,
          };
          const msgDay = parseInt(title.date.slice(8, 10));
          const date = new Date();
          const day = date.getDate();

          let am_pm = "AM";
          if (msgDay > 12) {
            am_pm = "PM";
          }
          if (day > msgDay) {
            const month = this.getMonth(parseInt(title.date.slice(5, 7)));
            obj.time = `${msgDay}-${month}`;
          } else {
            obj.time =
              parseInt(title.date.slice(11, 13)) +
              ":" +
              title.date.slice(14, 16) +
              " " +
              am_pm;
          }

          this.setState({ messages: [obj, ...this.state.messages] });
        }
      }
    });
    console.log("this.props.route.params",this.props.route.params)
  }

  captureImage2 = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      mediaType: "photo",
    }).then((image) => {
      this.setFilePath(image);
    });
  };

  getMonth(value) {
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
  }

  componentDidMount() {
    console.log("this.props.route.params?.userData?.isEvent",this.props.route.params?.userData?.isEvent)
    this.props.navigation.addListener("focus", () => {
      this.setState({ pageNo: 1, messages: [] });

      if (this.props.route.params.isFromShare) {
        const eventID = this.props.route.params.eventData.event_id;
        if (this.state?.messages[0]?.message != eventID) {
          this.sendMessageData(this.props.route.params.eventData, "event");
        } else {
          if (this.props.route.params?.userData?.isSquad) {
            // const intervalSq = setInterval(() => {
              this.getSquadMsgs();
            this.getSquadMembers();
            // }, 4000);
            // return () => clearInterval(intervalSq);
            
          } else {
            // const intervalSimple = setInterval(() => {
              this.getMessages();
              console.log("???????????????????????????????????????")
            // }, 4000);
            // return () => clearInterval(intervalSimple);
           
          }
        }
      }
      else if (this.props.route.params?.userData?.isEvent) {
        // const intervalSq = setInterval(() => {
          this.getEventMessage();
        this.getEventMembers();
        // }, 4000);
        // return () => clearInterval(intervalSq);
        
      }
      else if (this.props.route.params?.userData?.isSquad) {

        // const intervalSquadSimple = setInterval(() => {
          this.getSquadMsgs();
          this.getSquadMembers();
        // }, 4000);
        // return () => clearInterval(intervalSquadSimple);
       
      } else if (this.props.route.params?.userData.isSquadGroup) {
        // const intervalSquad = setInterval(() => {
          this.getGroupSquadMsgs();
        this.getGroupSquadMembers();
        // }, 4000);
        // return () => clearInterval(intervalSquad);

      
      } else {
        // const interval = setInterval(() => {
          this.getMessages();
          console.log("???????????????????????????????????????")
        // }, 4000);
        // return () => clearInterval(interval);
      }
    });
  }

  getSquadMembers = () => {
    const parameter = new FormData();
    parameter.append("token", this.props.userInfo.token);
    parameter.append("squad_id", this.props.route.params.receiverId);
    axios
      .post("http://squadvibes.onismsolution.com/api/getSquadMembers", parameter)
      .then((res) => {
        this.setState({ data: res.data.getSquadMembers });
      });
  };
  getEventMembers = () => {

    const parameter = new FormData();
    parameter.append("token", this.props.userInfo.token);
    parameter.append("event_id", this.props.route.params.receiverId);
    axios
      .post("http://squadvibes.onismsolution.com/api/getEventMembers", parameter)
      .then((res) => {
        this.setState({ data: res.data.getEventMembers });
      });
  };

  getGroupSquadMembers = () => {
    const parameter = new FormData();
    parameter.append("token", this.props.userInfo.token);
    parameter.append("group_squad_id", this.props.route.params.receiverId);
    axios
      .post("http://squadvibes.onismsolution.com/api/MergeGroupMembers", parameter)
      .then((res) => {
        console.log("MergeGroupMembers")
console.log(res.data)
        let array = [];
        res.data.MergeGroupMembers.forEach((element) => {
          if (!array.find((o) => o.id == element.id)) {
            array.push(element);
          }
        });
        this.setState({ data: array });
      });
  };

  getSquadMsgs = (pageNo = 1) => {
    const limit = 20;

    const parameter = new FormData();
    parameter.append("token", this.props.userInfo.token);
    parameter.append("squad_id", this.props.route.params.receiverId);
    parameter.append("limit", limit);
    parameter.append("pageNo", pageNo);

    axios
      .post("http://squadvibes.onismsolution.com/api/getSquadMessage", parameter)
      .then((res) => {
        console.log("getSquadMessage")
        console.log(res.data)
        const msgs = [];
        for (let elem of res.data.getSquadMessage) {
          const obj = {
            message: elem.message,
            name: elem.user_name || elem.full_name,
            type: elem.type,
            senderId: elem.user_id,
            event_image: elem.event_image,
            event_name: elem.event_name,
            user_image: elem.user_image,
            user_name: elem.user_name,
            joined: elem.joined,
            date_time: elem.date_time,
            expired: elem.expired,
            grp_name: elem.grp_name,
            grp_image: elem.grp_image,
            joinStatus: elem.joinStatus,
          };
          const msgDay = parseInt(elem.date_time.slice(8, 10));
          let msgHour = parseInt(elem.date_time.slice(11, 13));

          const date = new Date();
          const day = date.getDate();

          if (day > msgDay) {
            const month = this.getMonth(parseInt(elem.date_time.slice(5, 7)));
            obj.time = `${msgDay}-${month}`;
          } else {
            let am_pm = "AM";
            if (msgHour > 12) {
              msgHour = msgHour - 12;
              am_pm = "PM";
            }
            if (msgHour <= 9) {
              msgHour = `0${msgHour}`;
            }
            obj.time =
              msgHour + ":" + elem.date_time.slice(14, 16) + " " + am_pm;
          }

        
          msgs.push(obj);
        }
        console.log("HHHH", msgs);
        this.setState({ messages: [this.state.messages, ...msgs] });
      })
      .catch((err) => console.log("EREEEEROR", err));
  };
  getEventMessage = (pageNo = 1) => {
    const limit = 20;

    const parameter = new FormData();
    parameter.append("token", this.props.userInfo.token);
    parameter.append("event_id", this.props.route.params.receiverId);
    parameter.append("limit", limit);
    parameter.append("pageNo", pageNo);

    axios
      .post("http://squadvibes.onismsolution.com/api/getEventMessage", parameter)
      .then((res) => {
        console.log("getEventMessage")
        console.log(res.data)
        const msgs = [];
        for (let elem of res.data.getSquadMessage) {
          const obj = {
            message: elem.message,
            name: elem.user_name || elem.full_name,
            type: elem.type,
            senderId: elem.user_id,
            event_image: elem.event_image,
            event_name: elem.event_name,
            user_image: elem.user_image,
            user_name: elem.user_name,
            joined: elem.joined,
            date_time: elem.date_time,
            expired: elem.expired,
            grp_name: elem.grp_name,
            grp_image: elem.grp_image,
            joinStatus: elem.joinStatus,
          };
          const msgDay = parseInt(elem.date_time.slice(8, 10));
          let msgHour = parseInt(elem.date_time.slice(11, 13));

          const date = new Date();
          const day = date.getDate();

          if (day > msgDay) {
            const month = this.getMonth(parseInt(elem.date_time.slice(5, 7)));
            obj.time = `${msgDay}-${month}`;
          } else {
            let am_pm = "AM";
            if (msgHour > 12) {
              msgHour = msgHour - 12;
              am_pm = "PM";
            }
            if (msgHour <= 9) {
              msgHour = `0${msgHour}`;
            }
            obj.time =
              msgHour + ":" + elem.date_time.slice(14, 16) + " " + am_pm;
          }

        
          msgs.push(obj);
        }
        console.log("HHHH", msgs);
        this.setState({ messages: [this.state.messages, ...msgs] });
      })
      .catch((err) => console.log("EREEEEROR", err));
  };

  getGroupSquadMsgs = (pageNo = 1) => {
    const limit = 20;

    const parameter = new FormData();
    parameter.append("token", this.props.userInfo.token);
    parameter.append("group_squad_id", this.props.route.params.receiverId);
    parameter.append("limit", limit);
    parameter.append("pageNo", pageNo);

    console.log("SQUAD PARAM", parameter);

    axios
      .post("http://squadvibes.onismsolution.com/api/GetMergeGroupMessage", parameter)
      .then((res) => {
        console.log("GetMergeGroupMessage")
        console.log(res.data)
        const msgs = [];
        for (let elem of res.data.GetMergeGroupMessage) {
          const obj = {
            message: elem.message,
            name: elem.name,
            type: elem.type,
            senderId: elem.user_id,
            event_image: elem.event_image,
            event_name: elem.event_name,
            user_image: elem.user_image,
            user_name: elem.user_name,
            joined: elem.joined,
            date_time: elem.date_time,
            expired: elem.expired,
            grp_name: elem.grp_name,
            grp_image: elem.grp_image,
            joinStatus: elem.joinStatus,
          };

          const msgDay = parseInt(elem.date_time.slice(8, 10));
          let msgHour = parseInt(elem.date_time.slice(11, 13));

          const date = new Date();
          const day = date.getDate();

          if (day > msgDay) {
            const month = this.getMonth(parseInt(elem.date_time.slice(5, 7)));
            obj.time = `${msgDay}-${month}`;
          } else {
            let am_pm = "AM";
            if (msgHour > 12) {
              msgHour = msgHour - 12;
              am_pm = "PM";
            }
            if (msgHour <= 9) {
              msgHour = `0${msgHour}`;
            }
            obj.time =
              msgHour + ":" + elem.date_time.slice(14, 16) + " " + am_pm;
          }

        
          msgs.push(obj);
        }

        // this.setState({ messages: [...this.state.messages, ...msgs] });
        this.setState({ messages: [this.state.messages, ...msgs] });
      })
      .catch((err) => console.log("ERRORRRR", err));
  };

  getMessages = (pageNo = 1) => {
    const limit = 20;
    const parameter = new FormData();
    parameter.append("token", this.props.userInfo.token);
    parameter.append("reciever_id", this.props.route.params.receiverId);
    parameter.append("pageNo", pageNo);
    parameter.append("limit", limit);
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>")
    console.log(parameter)
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>")

    axios
      .post("http://squadvibes.onismsolution.com/api/getAllMessages", parameter)
      .then((res) => {
        const msgs = [];
console.log("res.data.getAllMessages.messages")
console.log(res.data.getAllMessages.messages.length)
        for (let elem of res.data.getAllMessages.messages) {
          const obj = {
            message: elem.message,
            type: elem.type,

            // message : elem.message,
            // type : elem.type,
            name: elem.full_name,
            senderId: elem.user_id,
            event_image: elem.event_image,
            event_name: elem.event_name,
            user_image: elem.user_image,
            user_name: elem.user_name,
            joined: elem.joined,
            date_time: elem.date_time,
            expired: elem.expired,
          };

          let msgDay = parseInt(elem.date_time.slice(8, 10));
          let msgHour = parseInt(elem.date_time.slice(11, 13));
          const date = new Date();
          const day = date.getDate();

          if (day > msgDay) {
            const month = this.getMonth(parseInt(elem.date_time.slice(5, 7)));
            obj.time = `${msgDay}-${month}`;
          } else {
            let am_pm = "AM";
            if (msgHour > 12) {
              msgHour = msgHour - 12;
              am_pm = "PM";
            }
            if (msgHour <= 9) {
              // msgHour = `${msgHour - 12}`
              msgHour = `0${msgHour}`;
            }

            obj.time =
              msgHour + ":" + elem.date_time.slice(14, 16) + " " + am_pm;
          }
        
          msgs.push(obj);
        }
        this.setState({ messages: [this.state.messages, ...msgs] });
      })
      .catch((err) => console.log("ERROR", err));
  };

  sendMsgObj = (message, type) => {
    const obj = {
      message,
      type: type,
      senderId: this.props.userInfo.id,
    };

    const date = new Date();
    let msgDay = date.getHours();
    let month = date.getMinutes();

    if (month <= 9) {
      month = "0" + month;
    }

    let am_pm = "AM";
    if (msgDay > 12) {
      msgDay = `${msgDay - 12}`;
      am_pm = "PM";
    } else if (msgDay <= 9) {
      msgDay = `0${msgDay}`;
    }

    obj.time = `${msgDay}:${month} ${am_pm}`;

    this.setState({ messages: [obj, ...this.state.messages], txtMessage: "" });
  };

  sendMessageData = (message, type = "text") => {
    this.setState({ sending: true });
    if (type !== "event") {
      this.sendMsgObj(message, type);
    }
    const parameter = new FormData();
    parameter.append("token", this.props.userInfo.token);
    parameter.append("message", type == "event" ? message.event_id : message);
    parameter.append("type", type);

    if (this.props.route.params.userData.isSquad) {
      parameter.append("squad_id", this.props.route.params.receiverId);
      axios
        .post("http://squadvibes.onismsolution.com/api/sendSquadMessage", parameter)
        .then((res) => {
          this.setState({ txtMessage: "", sending: false });
          if (type === "event") {
            this.getSquadMsgs();
          }
        })
        .catch((err) => console.log("ERROR", err));
    } 
    if (this.props.route.params.userData.isEvent) {
      parameter.append("event_id", this.props.route.params.receiverId);
      axios
        .post("http://squadvibes.onismsolution.com/api/sendEventMessage", parameter)
        .then((res) => {
          this.setState({ txtMessage: "", sending: false });
          if (type === "event") {
            this.getEventMessage();
          }
        })
        .catch((err) => console.log("ERROR", err));
    } 
     if (this.props.route.params?.userData.isSquadGroup) {
      parameter.append("group_squad_id", this.props.route.params.receiverId);
      axios
        .post("http://squadvibes.onismsolution.com/api/MergeGroupMessage", parameter)
        .then((res) => {
          this.setState({ txtMessage: "", sending: false });
          if (type === "event") {
            this.getGroupSquadMsgs();
          }
        })
        .catch((err) => console.log("ERROR", err));
    } else {
      parameter.append("reciever_id", this.props.route.params.receiverId);

      axios
        .post("http://squadvibes.onismsolution.com/api/sendmsg", parameter)
        .then((res) => {
          this.setState({ txtMessage: "", sending: false });
          if (type === "event") {
            this.getMessages();
          }
        })
        .catch((err) => console.log("ERROR", err));
    }
  };

  onContentOffsetChanged = (distanceFromTop) => {
    // distanceFromTop === 0 && makeSomething();
  };

  loadMsgs = (position) => {
    this.setState({ pageNo: this.state.pageNo + 1 });
    if (this.props.route.params?.userData?.isSquad) {
      this.getSquadMsgs(this.state.pageNo + 1);
    } 
    else if (this.props.route.params?.userData?.isEvent) {
      this.getEventMessage(this.state.pageNo + 1);
    }
    else if (this.props.route.params?.userData.isSquadGroup) {
      this.getGroupSquadMsgs(this.state.pageNo + 1);
    } else {
      this.getMessages(this.state.pageNo + 1);
    }
  };

  acceptEvent = (item, status) => {
    const parameter = new FormData();

    parameter.append("token", this.props.userInfo.token);
    parameter.append("user_id", this.props.userInfo.id);
    parameter.append("group_squad_id", item.message);
    parameter.append("squad_id", this.props.route.params.receiverId);
    parameter.append("status", status);

    console.log("PARAMETER", parameter);

    axios
      .post("http://squadvibes.onismsolution.com/api/groupSquadPoll", parameter)
      .then((res) => {
        const filterData = this.state.messages.map((elem) => {
          if (elem.message == item.message) {
            const obj = {
              ...elem,
              joinStatus: status == 1 ? "Joined" : "Rejected",
            };
            return obj;
          }
          return elem;
        });
        this.setState({ messages: filterData });
        // Toast.show('HIT successfully.')
        // this.props.navigation.navigate('HomeTab')
      })
      .catch((err) => {
        Toast.show(err);
      });
  };

  joinEvent = (item) => {
    if (item.expired == 1) {
      Toast.show("This event is expired, You can't join");
      return;
    } else if (item.joined == 1) {
      Toast.show("You are already in Event");
      return;
    }

    const parameter = new FormData();
    parameter.append("token", this.props.userInfo.token);
    parameter.append("event_id", item.message);

    console.log("EVENTT PARAM", parameter);

    axios
      .post("http://squadvibes.onismsolution.com/api/JoinEventConform", parameter)
      .then((res) => {
        console.log("RESSS", res.data);
        const dupMsgs = this.state.messages.map((elem) => {
          const obj = { ...elem };
          if (elem.message === item.message) {
            obj.joined = 1;
            return obj;
          }
          return elem;
        });

        this.setState({ messages: dupMsgs });
        Toast.show("Joined in the event.");
      })
      .catch((err) => {
        console.log("JOIN ERR", err);
      });
  };

  render() {
    const { isSquad, isSquadGroup,isEvent } = this.props.route.params.userData;
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
                  onPress={() => this.props.navigation.goBack()}
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
                  {isSquad || isSquadGroup || isEvent
                    ? this.props.route.params.name
                    : "Chat"}
                </Text>
              </View>
              <View style={{ width: 60 }} />
            </View>
          </View>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={[styles.container, { flex: 1 }]}
        >
          {isSquad || isSquadGroup || isEvent ? (
            <View
              style={{
                backgroundColor: "white",
                flexDirection: "column",
                position: "relative",
                alignItems: "center",
                marginHorizontal: 30,
                marginVertical: 20,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ selectedType: 0 });
                  }}
                  style={{
                    backgroundColor:
                      this.state.selectedType == 0 ? "white" : "#50C4E9",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "35%",
                    borderRadius: 17,
                    height: 41,
                    borderColor: "#50C4E9",
                    borderWidth: 2.5,
                  }}
                >
                  <Text
                    style={{
                      color: this.state.selectedType == 0 ? "#50C4E9" : "white",
                      fontWeight: "bold",
                    }}
                  >
                    Chat
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => this.setState({ selectedType: 1 })}
                  style={{
                    backgroundColor:
                      this.state.selectedType == 1 ? "white" : "#50C4E9",
                    marginLeft: 15,
                    width: "60%",
                    borderRadius: 17,
                    height: 41,
                    borderColor: "#50C4E9",
                    borderWidth: 2.5,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: this.state.selectedType == 1 ? "#50C4E9" : "white",
                      fontWeight: "bold",
                    }}
                  >
                    Group Members
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View
              style={{
                backgroundColor: "white",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <View style={{ marginTop: 30, marginBottom: 10 }}>
                <View style={{ height: 90 }}>
                  <Image
                    style={{
                      width: 90,
                      height: 90,
                      borderRadius: 80,
                      resizeMode: "cover",
                    }}
                    source={{ uri: this.props.route.params.image }}
                  />
                  <View
                    style={{
                      height: 17,
                      width: 17,
                      borderRadius: 20,
                      backgroundColor: "#4EF300",
                      position: "absolute",
                      zIndex: 99,
                      bottom: 6,
                      right: 4,
                    }}
                  />
                </View>
                <View style={{marginTop:20}}>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 16,
                    fontWeight:"bold",
                    color:"#000"
                  }}
                >
                  {this.props.route.params.name}
                </Text>
                </View>
              
              </View>
              <View style={{flexDirection:"row"}}>
                <View style={{width:"30%", paddingTop:5}}>
              <View style={{width:"100%", borderWidth:1, borderColor:"#808080"}}></View>

                </View>
                <View style={{width:"40%"}}>
                  <View style={{paddingHorizontal:10}}>
                    <Text numberOfLines={1} style={{fontSize:10, textAlign:"center", overflow:"hidden"}}>{this.props.route.params.address}</Text>
                  </View>
                </View>
                <View style={{width:"30%", paddingTop:5}}>
              <View style={{width:"100%", borderWidth:1, borderColor:"#808080"}}></View>

                </View>
              </View>

            </View>
          )}

          {this.state.selectedType == 0 ? (
            <FlatList
              inverted
              ref={(ref) => (this.flatlistMessages = ref)}
              onContentSizeChange={(contentWidth, contentHeight) => {
                // this.flatlistMessages.scrollToOffset({ animated: false, offset: contentHeight })
              }}
              onEndReached={(a) => this.loadMsgs(a)}
              // onScroll={
              //   (event) =>
              //       this.onContentOffsetChanged(event.nativeEvent.contentOffset.y)
              // }
              contentContainerStyle={{ paddingTop: 10, paddingBottom: 10 }}
              data={this.state.messages}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => {
                console.log(this.state.senderId+"<---------->"+item.senderId+">>>>>>>>>"+this.props.route.params.userData.id+">>>>>"+this.props.userInfo.id)
                if (this.props.userInfo.id == item.senderId) {
                  return (
                    <>
                    
                      {item.type == "text" ? (
                        <View
                          style={{
                            marginTop: 15,
                            marginBottom: 5,
                            // backgroundColor: "red",
                          }}
                        >
                          <SenderChatBubble
                            color={index === 0 ? this.state.sending : false}
                            value={item?.message}
                            type={item.type}
                            name={"javed"}
                          />
                         
                        </View>
                      ) : item.type == "image" ? (
                        <View
                          style={{
                            marginTop: 15,
                            marginBottom: 5,
                            // backgroundColor: "green",
                          }}
                        >
                          <SenderChatBubble
                            value={item.message}
                            type={item.type}
                          />
                        </View>
                      ) : item.type == "GroupSquad" ? (
                        <View
                          style={{
                            alignItems: "flex-end",
                            marginTop: 15,
                            marginBottom: 10,
                            marginHorizontal: 20,
                          }}
                        >
                          <View
                            style={{
                              elevation: 3,
                              padding: 15,
                              backgroundColor: "white",
                              width: "60%",
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <Image
                                style={{
                                  width: 50,
                                  resizeMode: "contain",
                                  height: 50,
                                }}
                                source={{ uri: item.grp_image }}
                              />

                              <View style={{ marginLeft: 10 }}>
                                <Text
                                  numberOfLines={2}
                                  multiline={false}
                                  style={{ fontSize: 19, width: "50%" }}
                                >
                                  {item.grp_name}
                                </Text>
                                {/* <Text multiline={false} style={{fontSize:19}}>{item.grp_name}</Text> */}
                              </View>
                            </View>

                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: 10,
                              }}
                            >
                              {item.joinStatus === "Joined" ? (
                                <Text style={{ color: "gray" }}>
                                  You have accepted
                                </Text>
                              ) : item.joinStatus === "Rejected" ? (
                                <Text style={{ color: "gray" }}>
                                  You have rejected
                                </Text>
                              ) : (
                                <>
                                  <TouchableOpacity
                                    style={{ marginRight: 10 }}
                                    onPress={() => this.acceptEvent(item, 2)}
                                  >
                                    <Image
                                      style={{
                                        resizeMode: "contain",
                                        width: 40,
                                        height: 40,
                                      }}
                                      source={require("../../assets/cross.png")}
                                    />
                                  </TouchableOpacity>

                                  <TouchableOpacity
                                    onPress={() => this.acceptEvent(item, 1)}
                                  >
                                    <Image
                                      style={{
                                        resizeMode: "contain",
                                        width: 40,
                                        height: 40,
                                      }}
                                      source={require("../../assets/tick.png")}
                                    />
                                  </TouchableOpacity>
                                </>
                              )}
                            </View>
                          </View>
                        </View>
                      ) : item.type == "EventInvite" || item.type == "event" ? (
                        <View
                          style={{
                            alignItems: "flex-end",
                            marginTop: 15,
                            marginBottom: 10,
                            marginHorizontal: 20,
                          }}
                        >
                          <View
                            style={{
                              elevation: 3,
                              padding: 15,
                              backgroundColor: "white",
                              width: "60%",
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <Image
                                style={{
                                  width: 50,
                                  resizeMode: "contain",
                                  height: 50,
                                }}
                                source={{ uri: item.event_image }}
                              />

                              <View style={{ marginLeft: 10, width: "100%" }}>
                                <Text
                                  numberOfLines={2}
                                  multiline={false}
                                  style={{ fontSize: 19, width: "60%" }}
                                >
                                  {item.event_name}
                                </Text>
                              </View>
                            </View>

                            <TouchableOpacity
                              style={{
                                backgroundColor:
                                  item.joined == 1 || item.expired == 1
                                    ? "#4AACCD"
                                    : "#4AACCD",
                                borderRadius: 15,
                                padding: 5,
                                marginTop: 15,
                              }}
                              onPress={() => this.joinEvent(item)}
                            >
                              <Text
                                style={{
                                  textAlign: "center",
                                  color: colors.white,
                                  fontSize: 15,
                                }}
                              >
                                Join Event
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ) : item.type == "Info message" ? (
                        <View
                          style={{
                            marginTop: 20,
                            marginBottom: 10,
                            backgroundColor: "white",
                            elevation: 4,
                            padding: 15,
                            marginHorizontal: 20,
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <Image
                                style={{ width: 40, height: 40 }}
                                source={{ uri: item.user_image }}
                              />
                              <Text style={{ marginLeft: 10 }}>
                                {item.user_name}
                              </Text>
                            </View>

                            <Text style={{ color: "gray", fontSize: 13 }}>
                              {item.date_time}
                            </Text>
                          </View>
                          <Text style={{ fontSize: 18, marginVertical: 15 }}>
                            Created a new poll in Squad.
                          </Text>

                          <TouchableOpacity
                            style={{
                              backgroundColor: "#4AACCD",
                              borderRadius: 15,
                              padding: 12,
                            }}
                            onPress={() => {
                              this.props.navigation.navigate("poll", {
                                chatRoomId: this.state.chatRoomId,
                                squad_id: this.props.route.params.userData.id,
                                // message: message
                              });
                            }}
                          >
                            <Text
                              style={{
                                textAlign: "center",
                                color: colors.white,
                                fontSize: 18,
                              }}
                            >
                              open
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ) : item.type == "location" ? (
                        <View style={{ marginTop: 15, marginBottom: 5 }}>
                          <TouchableOpacity
                            onPress={() => {
                              this.openGoogleMap(item.latitude, item.longitude);
                            }}
                          >
                            <SenderChatBubble
                              value={`https://maps.googleapis.com/maps/api/staticmap?center=${item.latitude},${item.longitude}&zoom=13&size=600x300&maptype=roadmap
                          &markers=${item.latitude},${item.longitude}
                          &key=${GOOGLE_API_KEY}`}
                              type={item.type}
                            />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        item.type == "event" && this.eventView(item)
                      )}
                      <Text
                        style={{
                          fontFamily: fonts.regular,
                          fontSize: Platform.OS == "android" ? 11 : 13,
                          alignSelf: "flex-end",
                          color: "#A5A195",
                          position: "absolute",
                          bottom: -8,
                          right: 22,
                        }}
                      >
                        {item.time}
                      </Text>
                    </>
                  );
                } else {
                  return (
                    <>
                      {
                        item.type == "text" ? (
                          <View style={{ marginTop: 15, marginBottom: 5 }}>
                            <ReceiverChatBubble
                              name={item.name}
                              value={item.message}
                              type={item.type}
                              image={this.props.route.params.image}
                            />
                          </View>
                        ) : item.type == "image" ? (
                          <View style={{ marginTop: 15, marginBottom: 5 }}>
                            <ReceiverChatBubble
                              name={item.name}
                              value={item.message}
                              type={item.type}
                              image={this.props.route.params.image}
                            />
                          </View>
                        ) : item.type == "GroupSquad" ? (
                          <View
                            style={{
                              alignItems: "flex-start",
                              marginTop: 15,
                              marginBottom: 10,
                              marginHorizontal: 20,
                            }}
                          >
                            <View
                              style={{
                                elevation: 3,
                                padding: 15,
                                backgroundColor: "white",
                                width: "60%",
                              }}
                            >
                              <Text style={{ marginBottom: 5 }}>
                                {item.name}
                              </Text>
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                }}
                              >
                                <Image
                                  style={{
                                    width: 50,
                                    resizeMode: "contain",
                                    height: 50,
                                  }}
                                  source={{ uri: item.grp_image }}
                                />

                                <View style={{ marginLeft: 10 }}>
                                  <Text
                                    numberOfLines={2}
                                    multiline={false}
                                    style={{ fontSize: 19, width: "50%" }}
                                  >
                                    {item.grp_name}
                                  </Text>
                                </View>
                              </View>

                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  marginTop: 10,
                                }}
                              >
                                {item.joinStatus === "Joined" ? (
                                  <Text style={{ color: "gray" }}>
                                    You have accepted
                                  </Text>
                                ) : item.joinStatus === "Rejected" ? (
                                  <Text style={{ color: "gray" }}>
                                    You have rejected
                                  </Text>
                                ) : (
                                  <>
                                    <TouchableOpacity
                                      style={{ marginRight: 10 }}
                                      onPress={() => this.acceptEvent(item, 2)}
                                    >
                                      <Image
                                        style={{
                                          resizeMode: "contain",
                                          width: 40,
                                          height: 40,
                                        }}
                                        source={require("../../assets/cross.png")}
                                      />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                      onPress={() => this.acceptEvent(item, 1)}
                                    >
                                      <Image
                                        style={{
                                          resizeMode: "contain",
                                          width: 40,
                                          height: 40,
                                        }}
                                        source={require("../../assets/tick.png")}
                                      />
                                    </TouchableOpacity>
                                  </>
                                )}
                              </View>
                            </View>
                          </View>
                        ) : item.type == "EventInvite" ||
                          item.type == "event" ? (
                          <View
                            style={{
                              alignItems: "flex-start",
                              marginTop: 15,
                              marginBottom: 10,
                              marginHorizontal: 20,
                            }}
                          >
                            <View
                              style={{
                                elevation: 3,
                                padding: 15,
                                backgroundColor: "white",
                                width: "60%",
                              }}
                            >
                              <Text>{item.name}</Text>

                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                }}
                              >
                                <Image
                                  style={{
                                    width: 50,
                                    resizeMode: "contain",
                                    height: 50,
                                  }}
                                  source={{ uri: item.event_image }}
                                />

                                <View style={{ marginLeft: 10, width: "100%" }}>
                                  <Text
                                    numberOfLines={2}
                                    multiline={false}
                                    style={{ fontSize: 19, width: "60%" }}
                                  >
                                    {item.event_name}
                                  </Text>

                                  {/* <Text multiline={false} style={{fontSize:19}}>{item.event_name}</Text> */}
                                </View>
                              </View>

                              <TouchableOpacity
                                style={{
                                  backgroundColor:
                                    item.joined == 0 ? colors.pinkbg : "pink",
                                  borderRadius: 15,
                                  padding: 5,
                                  marginTop: 15,
                                }}
                                onPress={() => this.joinEvent(item)}
                              >
                                <Text
                                  style={{
                                    textAlign: "center",
                                    color: colors.white,
                                    fontSize: 15,
                                  }}
                                >
                                  Join Event
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        ) : item.type == "Info message" ? (
                          <View
                            style={{
                              marginTop: 20,
                              marginBottom: 10,
                              backgroundColor: "white",
                              elevation: 4,
                              padding: 15,
                              marginHorizontal: 20,
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text>{item.name}</Text>

                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                }}
                              >
                                <Image
                                  style={{ width: 40, height: 40 }}
                                  source={{ uri: item.user_image }}
                                />
                                <Text style={{ marginLeft: 10 }}>
                                  {item.user_name}
                                </Text>
                              </View>

                              <Text style={{ color: "gray", fontSize: 13 }}>
                                {item.date_time}
                              </Text>
                            </View>
                            <Text style={{ fontSize: 18, marginVertical: 15 }}>
                              Created a new poll in Squad.
                            </Text>

                            <TouchableOpacity
                              style={{
                                backgroundColor: colors.pinkbg,
                                borderRadius: 15,
                                padding: 12,
                              }}
                              onPress={() => {
                                this.props.navigation.navigate("poll", {
                                  chatRoomId: this.state.chatRoomId,
                                  squad_id: this.props.route.params.userData.id,
                                  // message: message
                                });
                              }}
                            >
                              <Text
                                style={{
                                  textAlign: "center",
                                  color: colors.white,
                                  fontSize: 18,
                                }}
                              >
                                {" "}
                                open
                              </Text>
                            </TouchableOpacity>
                          </View>
                        ) : item.type == "location" ? (
                          <View style={{ marginTop: 15, marginBottom: 5 }}>
                            <TouchableOpacity
                              onPress={() => {
                                this.openGoogleMap(
                                  item.latitude,
                                  item.longitude
                                );
                              }}
                            >
                              {this.state.isGroup ? (
                                <ReceiverChatBubble
                                  value={`https://maps.googleapis.com/maps/api/staticmap?center=${item.latitude},${item.longitude}&zoom=13&size=600x300&maptype=roadmap
                                &markers=${item.latitude},${item.longitude}
                                &key=${GOOGLE_API_KEY}`}
                                  type={item.type}
                                  name={item.sender_name}
                                  image={this.props.route.params.image}
                                />
                              ) : (
                                <ReceiverChatBubble
                                  value={`https://maps.googleapis.com/maps/api/staticmap?center=${item.latitude},${item.longitude}&zoom=13&size=600x300&maptype=roadmap
                          &markers=${item.latitude},${item.longitude}
                          &key=${GOOGLE_API_KEY}`}
                                  type={item.type}
                                  image={this.props.route.params.image}
                                />
                              )}
                            </TouchableOpacity>
                          </View>
                        ) : (
                          item.type == "event" && this.eventView(item)
                        )
                        // :
                        // this.pollView(item)
                      }
                      {/* </View> */}
                      <Text
                        style={{
                          fontFamily: fonts.regular,
                          fontSize: Platform.OS == "android" ? 11 : 13,
                          color: "#A5A195",
                          marginLeft: 20,
                          position: "absolute",
                          bottom: -8,
                        }}
                      >
                        {item.time}
                      </Text>
                    </>
                  );
                }
              }}
            />
          ) : (
            <FlatList
              data={this.state.data}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => {
                return (
                  <View
                    style={{
                      flexDirection: "column",
                      paddingHorizontal: 10,
                    }}
                  >
                    <View style={styles.itemView}>
                      <View
                        style={{
                          width: 60,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Image
                          style={styles.profileImg}
                          source={{ uri: item.image }}
                        />
                      </View>

                      <View
                        style={{
                          flex: 1,
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: fonts.SemiBold,
                            fontSize: 14,
                            color: colors.greenButton,
                            marginLeft: 15,
                          }}
                        >
                          {item.full_name}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              }}
            />
          )}

          {this.state.selectedType == 0 ? (
            <View
              style={{
                height: 50,
                width: WINDOW_WIDTH - 60,
                alignSelf: "center",
                flexDirection: "row",
                borderRadius: 30,
                backgroundColor: "#EFEFEF",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              {this.state.txtMessage.length === 0 && (
                <TouchableOpacity
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#4AACCD",
                    alignSelf: "center",
                    marginLeft: 5,
                  }}
                  activeOpacity={0.8}
                  onPress={() => this.openImagePicker()}
                >
                  <Image
                    source={require("../../assets/camera_ic_chat.png")}
                    style={{}}
                  />
                </TouchableOpacity>
              )}
              <TextInput
                placeholder={"Message..."}
                style={[styles.textInput]}
                multiline
                // blurOnSubmit
                // returnKeyLabel='Done'
                // autoCorrect={false}
                // returnKeyType='done'
                value={this.state.txtMessage}
                // onFocus={() => this.flatlistMessages.scrollToEnd({ animated: true })}
                onChangeText={(message) => {
                  this.setState({ txtMessage: message });
                }}
              />

              {isSquad && isEvent && (
                <TouchableOpacity
                  onPress={() => {
                    const message = {
                      senderId: this.state.current_user_Id,
                      receiverId: this.state.receiverId,
                      read:
                        this.state.is_receiver_online == undefined
                          ? false
                          : this.state.is_receiver_online,
                      type: "poll",
                      sender_name: this.state.isGroup
                        ? this.state.current_user_name
                        : "",
                    };
                    this.props.navigation.navigate("poll", {
                      chatRoomId: this.state.chatRoomId,
                      squad_id: this.props.route.params.userData.id,
                      message: message,
                    });
                  }}
                  style={{
                    height: 30,
                    width: 30,
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                  }}
                >
                  <Image
                    style={{ width: 20, height: 20 }}
                    source={require("../../assets/ballot.png")}
                  />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={{
                  height: 30,
                  width: 30,
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                }}
                onPress={() => {
                  const message = {
                    senderId: this.state.current_user_Id,
                    receiverId: this.state.receiverId,
                    read:
                      this.state.is_receiver_online == undefined
                        ? false
                        : this.state.is_receiver_online,
                    type: "event",
                    sender_name: this.state.isGroup
                      ? this.state.current_user_name
                      : "",
                  };
                  this.props.navigation.navigate("ShareEvent", {
                    isFromChat: true,
                    chatRoomId: this.state.chatRoomId,
                    message: message,
                    receiverId:this.props.route.params.receiverId,
                      userData:this.props.route.params.userData,
                      name:this.props.route.params.name,
                      image:this.props.route.params.image,
                      address:this.props.route.params.address
                  });
                }}
              >
                <Image
                  source={require("../../assets/calendar_ic_black.png")}
                  style={{ marginRight: 10 }}
                />
              </TouchableOpacity>

              {this.state.txtMessage.length > 0 && (
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    const messageTime = moment().unix();
                    const message = {
                      senderId: this.state.current_user_Id,
                      receiverId: this.state.receiverId,
                      message: this.state.txtMessage,
                      time: messageTime,
                      read:
                        this.state.is_receiver_online == undefined
                          ? false
                          : this.state.is_receiver_online,
                      type: "text",
                      sender_name: this.state.isGroup
                        ? this.state.current_user_name
                        : "",
                    };
                    if (!this.state.sending && message.message) {
                      this.sendMessageData(message.message);
                    }
                  }}
                >
                  <Text
                    style={{
                      color: "#4AACCD",
                      fontSize: 16,
                      fontWeight: "bold",
                      paddingRight: 15,
                    }}
                  >
                    Send
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : null}
        </KeyboardAvoidingView>
        <Loader loading={this.state.loading} />
      </View>
    );
  }

  eventView = (item) => {
    return (
      <View
        style={{
          alignSelf:
            this.state.senderId == item.senderId ? "flex-end" : "flex-start",
          width: "60%",
          borderRadius: 20,
          marginVertical: Platform.OS == "android" ? 10 : 16,
          marginHorizontal: 20,
          marginTop: 25,
        }}
      >
        <Text>{item.name}</Text>
        <View
          style={{
            height: 100,
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
            backgroundColor:
              this.state.senderId == item.senderId
                ? colors.chatSenderBGColor
                : colors.chatReceiverBGColor,
            justifyContent: "center",
          }}
        >
          <Icon
            type="font-awesome"
            name="calendar-check-o"
            color="white"
            size={30}
          />
        </View>
        <View
          style={{
            backgroundColor: "rgba(221,221,221,1)",
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
          }}
        >
          <View
            style={{
              paddingHorizontal: 8,
              backgroundColor: "rgba(221,221,221,1)",
            }}
          >
            <View style={{ marginLeft: 8, marginVertical: 8 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: fonts.Bold,
                  textAlign: "center",
                }}
              >
                111
              </Text>
            </View>
            {/* <View style={{ flexDirection: 'row', marginTop: 8, alignItems: 'center' }}>
              <Icon name='location' type='evilicon' />
              <Text style={{ flex: 1, fontSize: 15, fontFamily: fonts.Medium }} numberOfLines={2}>{item.event_address}</Text>
            </View> */}
            {/* <View style={{ flexDirection: 'row', marginVertical: 8, alignItems: 'center' }}>
              <Icon name='calendar' type='entypo' size={18} />
              <Text style={{ marginLeft: 8, flex: 1, fontSize: 15, fontFamily: fonts.Medium }}>{moment(item.event_date, 'DD/MM/YYYY').format('DD MMMM YYYY')}</Text>
            </View> */}
          </View>
          <TouchableOpacity
            activeOpacity={0.6}
            style={{
              height: 44,
              borderTopColor: "rgba(190,190,190,1)",
              borderTopWidth: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              this.props.navigation.navigate("ShuffleDetail", {
                eventData: { event_id: parseInt(item.message) },
                isFromChat: true,
              });
            }}
          >
            <Text style={{ fontSize: 15, fontFamily: fonts.Bold }}>View</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  pollView = (item) => {
    return (
      <View
        style={{
          alignSelf:
            this.state.senderId == item.senderId ? "flex-end" : "flex-start",
          width: "75%",
          borderRadius: 20,
          marginVertical: Platform.OS == "android" ? 10 : 16,
          padding: 20,
          margin: 20,
          backgroundColor: "rgba(221,221,221,1)",
        }}
      >
        <View
          style={{
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
            justifyContent: "center",
            backgroundColor: "rgba(221,221,221,1)",
          }}
        >
          <Text style={{ fontSize: 17, fontFamily: fonts.Bold }}>
            Q:{item.question}
          </Text>
        </View>
        <View
          style={{
            marginTop: 20,
            backgroundColor: "rgba(221,221,221,1)",
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              backgroundColor: "rgba(221,221,221,1)",
              borderBottomLeftRadius: 15,
              borderBottomRightRadius: 15,
            }}
          >
            <View>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <LinearProgress
                  value={
                    item.select_option1.includes(this.state.current_user_Id)
                      ? item.select_option1.length /
                        this.state.group_member.length
                      : 0
                  }
                  variant={"determinate"}
                  style={{ height: 44, borderRadius: 8, width: "88%" }}
                  trackColor={colors.lightgray}
                  color={colors.greenButton}
                />
                <Text
                  style={{
                    color: colors.headingTextColor,
                    fontSize: 17,
                    fontFamily: fonts.Medium,
                    marginHorizontal: 8,
                  }}
                >
                  {item.creator_id == this.state.current_user_Id ||
                  item.select_option1.includes(this.state.current_user_Id) ||
                  item.select_option2.includes(this.state.current_user_Id)
                    ? `${parseInt(
                        (item.select_option1.length /
                          this.state.group_member.length) *
                          100
                      )}%`
                    : ""}
                </Text>
              </TouchableOpacity>
              <Text
                style={{
                  position: "absolute",
                  fontFamily: fonts.Bold,
                  fontSize: 17,
                  marginTop: 8,
                  marginLeft: 10,
                }}
              >
                {item.option1}
              </Text>
            </View>
            <View>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  marginVertical: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: colors.headingTextColor,
                    fontSize: 17,
                    fontFamily: fonts.Medium,
                    marginHorizontal: 8,
                  }}
                >
                  {item.creator_id == this.state.current_user_Id ||
                  item.select_option1.includes(this.state.current_user_Id) ||
                  item.select_option2.includes(this.state.current_user_Id)
                    ? `${parseInt(
                        (item.select_option2.length /
                          this.state.group_member.length) *
                          100
                      )}%`
                    : ""}
                </Text>
              </TouchableOpacity>
              <Text
                style={{
                  position: "absolute",
                  fontFamily: fonts.Medium,
                  fontSize: 17,
                  marginVertical: 15,
                  marginLeft: 10,
                }}
              >
                {item.option2}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  /* Image Picker Methods */
  captureImage = async (type) => {
    var options = {
      title: "Select Image",
      includeBase64: false,
      quality: 0.7,
      mediaType: "photo",
    };

    let granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: "App Geolocation Permission",
        message: "App needs access to your phone's location.",
      }
    );
    if (granted == "granted") {
      launchCamera(options, (response) => {
        if (response.didCancel) {
          // alert('User cancelled camera picker');
          return;
        } else if (response.errorCode == "camera_unavailable") {
          // alert('Camera not available on device');
          return;
        } else if (response.errorCode == "permission") {
          // alert('Permission not satisfied');
          return;
        } else if (response.errorCode == "others") {
          // alert(response.errorMessage);
          return;
        }
        this.setFilePath(response.assets[0]);
      });
    }
  };

  chooseFile = (type) => {
    let options = {
      mediaType: type,
      maxWidth: SCREEN_SIZE.SCREEN_HEIGHT,
      maxHeight: SCREEN_SIZE.SCREEN_HEIGHT,
      quality: 0.7,
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        // alert('User cancelled camera picker');
        return;
      } else if (response.errorCode == "camera_unavailable") {
        // alert('Camera not available on device');
        return;
      } else if (response.errorCode == "permission") {
        // alert('Permission not satisfied');
        return;
      } else if (response.errorCode == "others") {
        // alert(response.errorMessage);
        return;
      }
      this.setFilePath(response.assets[0]);
    });
  };

  uploadProfileImage = (uri, fileName) => {
    this.setState({ loading: true });

    var parameter = new FormData();
    parameter.append("image", {
      uri: Platform.OS === "android" ? uri : uri.replace("file:/", ""),
      type: "image/jpeg",
      name: fileName.toString(),
    });

    ApiHelper.post("uploadProfileImage", parameter)
      .then((response) => {
        this.setState({ loading: false });
        if (response.status == 200) {
          if (response.data.status == "SUCCESS") {
            if (response.data.hasOwnProperty("uploadProfileImage")) {
              let image = response.data.uploadProfileImage.image;
              this.sendMessageData(image, "image");
              this.setState({ image: image });
            }
          } else {
            console.error(response.data.message);
            if (response.data.message) {
              Toast.show(response.data.message);
            }
          }
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.error("errrrrr", error);
        Toast.show(error.message);
      });
  };

  setFilePath(response) {
    this.setState({
      filePath: response.path,
      imageResponse: response,
    });
    if (response.path) {
      this.uploadProfileImage(response.path, new Date().getTime());
    } else if (response.uri) {
      this.uploadProfileImage(response.uri, new Date().getTime());
    }
  }

  openImagePicker(navigation) {
    Alert.alert(
      "Photo",
      "Please select or capture the image",
      [
        {
          text: "Gallery",
          onPress: () => this.chooseFile("photo"),
        },
        {
          text: "Camera",
          onPress: () => this.captureImage2("photo"),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  }

  openGoogleMap = (lat, lng) => {
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    });
    const latLng = `${lat},${lng}`;
    const label = "Custom Label";
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });
    if (Linking.canOpenURL(url)) {
      Linking.openURL(url);
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemView: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 10,
  },
  profileImg: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    resizeMode: "cover",
  },

  headerView: {
    fontSize: 14,
    marginLeft: 10,
    fontWeight: "bold",
  },
  lineVisibleView: {
    flex: 1,
    flexDirection: "row",
    height: 1,
    backgroundColor: colors.BORDER_COLOR,
    marginTop: 5,
    marginLeft: 60,
  },

  messageBox: {
    borderRadius: 200,
    padding: 18,
    borderBottomRightRadius: 10,
  },
  name: {
    color: colors.BLACK,
    marginBottom: 5,
    fontSize: 12,
  },
  message: {
    color: colors.BLACK,
    fontSize: 12,
  },
  time: {
    alignSelf: "flex-end",
    color: colors.BLACK,
    fontSize: 10,
    marginTop: 5,
  },
  textInput: {
    flex: 1,
    marginLeft: 8,
    justifyContent: "center",
    alignContent: "center",
    maxHeight: moderateScale(60, 2),
  },

  ///////

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
    marginBottom: 10,
    height: 58,
    width: WINDOW_WIDTH - 60,
    alignSelf: "center",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },
  profileImg: {
    width: 46,
    height: 46,
    borderRadius: 60,
    resizeMode: "cover",
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

const mapStateToProps = (state) => {
  return {
    userInfo: state.user.userInfo,
  };
};

export default connect(mapStateToProps)(ChatComponent);
