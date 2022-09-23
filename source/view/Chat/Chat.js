import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
} from "react-native";
import axios from "axios";
import { colors, fonts } from "../../common/colors";
import { SearchBar } from "react-native-elements";
import { postMethod } from "../../Networking/APIModel";
import { connect } from "react-redux";
import HeaderWithoutBack from "../components/headerWithoutBack";
import LinearGradient from "react-native-linear-gradient";
import Ripple from "react-native-material-ripple";
import  Icon1 from 'react-native-vector-icons/Ionicons';
import  Icon2 from 'react-native-vector-icons/Entypo';
import Toast from "react-native-simple-toast";
const WINDOW_WIDTH = Dimensions.get("window").width;

class Chat extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    search: "",
    data: [
      {
        id: 1,
        icon: require("../../assets/ic_user_1.jpg"),
        iconTick: require("../../assets/tick_green.png"),
        name: "Craig Dennis",
        lastMessage: "Nam mi dui, volutpat in euismod sed",
        time: "11:26",
        isSelected: true,
      },
      {
        id: 2,
        icon: require("../../assets/ic_user_2.jpg"),
        name: "Ricardo Cannon",
        iconTick: require("../../assets/tick_green.png"),
        lastMessage: "Nam mi dui, volutpat in euismod sed",
        time: "11:26",
      },
    ],
    all_users: [],
    arrSearchUsers: [],
    loading: false,
    current_user_Id: "",
    Archive: false,
    arrUsers: [],
    arrFriends: [],
  };

  updateSearch = (search) => {
    this.setState({ search, arrSearchUsers: [] });
    if (search.trim() != "") {
      const arrSearchUsers = this.state.arrUsers.filter((data) =>
        data.name.toLowerCase().includes(search.toLowerCase())
      );
      this.setState({ arrSearchUsers });
    }
  };

  getFriendlist = async () => {
    this.setState({ loading: true });
    const authToken = this.props.userInfo.token;

    var formdata = new FormData();
    formdata.append("token", authToken);
    postMethod(
      this.props.navigation,
      "friendList",
      formdata,
      (response) => {
        if (
          response.friendList.requestList &&
          response.friendList.requestList.length > 0
        ) {
          if (response.friendList.friendList) {
            const arrFriends = [];

            let obj = {};
            response.friendList.requestList.forEach((elem, index) => {
              if (obj[elem.user_id] == undefined) {
                arrFriends.push(elem);
                obj[elem.user_id] = "123";
              }
            });

            this.setState({
              arrFriends: arrFriends,
              loading: false,
            });
          }
        } else {
          if (
            response.friendList.friendList &&
            response.friendList.friendList.length > 0
          ) {
            const friends = response.friendList.friendList.map((data) => {
              return {
                user_id: data.user_id,
                full_name: data.full_name,
                profile_image: data.profile_image,
              };
            });
            this.setState({
              arrFriends: friends,
              // arrFriends:response.requestList,
              loading: false,
            });
          } else {
            this.setState({
              arrFriends: [],
              loading: false,
            });
          }
        }
      },
      (error) => {
        this.setState({ loading: false });
        // Toast.show(error.message)
      }
    );
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

  getMessenger = async () => {
    const authToken = this.props.userInfo.token;
    var formdata = new FormData();
    formdata.append("token", authToken);
    postMethod(this.props.navigation, "messenger", formdata, (response) => {
      let data = response.messenger.messages.map((item, index) => {
   
        let date_time;
        let obj = {};

        if (item.user_id && item.reciever_id) {
          console.log("ITEM 1 > ", item)
          let user = response.messenger.userProfiles.filter(
            (elem) => item.user_id == elem.id || item.reciever_id == elem.id
          );
          if (user.length) {
            user = user[0];
            obj = {
              name: user.full_name,
              image: user.image,
              id: user.id,
              lastMessage: { type: item.type, message: item.message, time: "" },
            };
            date_time = item.date_time;

            if (item.type == "EventInvite" || item.type == "event") {
              if (item.user_id == this.props.userInfo.id) {
                obj.lastMessage.message = "You have invited to an event.";
              } else {
                obj.lastMessage.message = "You are invited to an event.";
              }
            }
          }
        } 
        else if (item.group_squad_id) {
          console.log("ITEM 2 > ", item)
          let groupSquad = response.messenger.groupSquads.filter(
            (elem) => item.group_squad_id == elem.id
          );
          if (groupSquad.length) {
            groupSquad = groupSquad[0];
            obj = {
              name: groupSquad.name,
              image:
                "https://thumbs.dreamstime.com/b/friend-groups-silhouette-sunrise-59553702.jpg",
              id: groupSquad.id,
              isSquadGroup: true,
              lastMessage: { type: item.type, message: item.message, time: "" },
            };
            date_time = item.date_time;

            if (item.type == "EventInvite" || item.type == "event") {
              if (item.user_id == this.props.userInfo.id) {
                obj.lastMessage.message = "You have invited users to an event.";
              } else {
                obj.lastMessage.message = "You are invited to an event.";
              }
            }
          }
        } 
        else if (item.event_id) {
          console.log("ITEM 3 > ", item)
          let event = response.messenger.events.filter(
            (elem) => item.event_id == elem.id
          );
          if (event.length) {
            event = event[0];
            obj = {
              name: event.event_name,
              image: event.event_image,
              id:event.id,
              isEvent: true,
              lastMessage: { type: item.type, message: item.message, time: "" },
            };
            date_time = item.date_time;

            // if (item.type == "EventInvite" || item.type == "event") {
            //   if (item.sender_id == this.props.userInfo.id) {
            //     obj.lastMessage.message = "You have invited users to an event.";
            //   } else {
            //     obj.lastMessage.message = "You are invited to an event.";
            //   }
            // }
          }
        }
        else {
          console.log("ITEM 4 > ", item)
          let squad = response.messenger.squads.filter(
            (elem) => item.squad_id == elem.id
          );
          if (squad.length) {
            squad = squad[0];
            obj = {
              name: squad.squad_name,
              image: squad.squad_image,
              id: squad.id,
              isSquad: true,
              lastMessage: { type: item.type, message: item.message, time: "" },
            };
            date_time = item.date_time;

            if (item.type == "EventInvite" || item.type == "event") {
              if (item.sender_id == this.props.userInfo.id) {
                obj.lastMessage.message = "You have invited users to an event.";
              } else {
                obj.lastMessage.message = "You are invited to an event.";
              }
            }
          }
        }

        if (item.type == "image") {
          obj.lastMessage.message = "Image sent";
        }

        if (obj.name) {
          const msgDay = parseInt(date_time?.slice(8, 10));
          const month = this.getMonth(parseInt(date_time?.slice(5, 7)));

          obj.lastMessage.time = `${msgDay}-${month}`;
        }
        return obj;
      });
      let ids = [];
      console.log("data",data)
      data = data.filter((elem) => {
        const find = ids.findIndex((val) => elem.name == val);
        if (find == -1) {
          ids.push(elem.name);
          return true;
        }
        return false;
      });
      this.setState({ arrUsers: data });

      let users = response.messenger.userProfiles.map((item) => {
        const lastMsg = response.messenger.messages.filter(
          (elem) => item.id == elem.user_id || item.id == elem.reciever_id
        );
        const obj = {
          name: item.full_name,
          image: item.image,
          id: item.id,
          address: item.address,
          lastMessage: { type: "text", message: "No message yet!!", time: "" },
        };
        const date_time = lastMsg[0]?.date_time;
        const msgDay = parseInt(date_time?.slice(8, 10));

        const month = this.getMonth(parseInt(date_time?.slice(5, 7)));
        obj.lastMessage.time = `${msgDay}-${month}`;

        if (lastMsg.length > 0) {
          obj.lastMessage.message = lastMsg[0].message;
        } else {
          obj.lastMessage.time = "";
        }
        return obj;
      });

      users = users.filter((elem) => elem.id != this.props.userInfo.id);

      let squads = response.messenger.squads.map((item) => {
        const lastMsg = response.messenger.messages.filter(
          (elem) => item.id == elem.squad_id
        );

        const obj = {
          name: item.squad_name,
          image: item.squad_image,
          id: item.id,
          isSquad: true,
          lastMessage: {
            type: "text",
            time: "",
            message: lastMsg.length ? lastMsg[0].message : "No message yet!!",
          },
        };
        return obj;
      });


      let events = response.messenger.events.map((item) => {
        const lastMsg = response.messenger.messages.filter(
          (elem) => item.id == elem.event_id
        );

        const obj = {
          name: item.event_name,
          image: item.event_image,
          id: item.id,
          isEvent: true,
          lastMessage: {
            type: "text",
            time: "",
            message: lastMsg.length ? lastMsg[0].message : "No message yet!!",
          },
        };
        return obj;
      });


      ids = [];
      squads = squads.filter((elem) => {
        const find = ids.findIndex((item) => item == elem.id);
        if (find == -1) {
          ids.push(elem.id);
        }
        return find == -1;
      });

      ids = [];
      events = events.filter((elem) => {
        const find = ids.findIndex((item) => item == elem.id);
        if (find == -1) {
          ids.push(elem.id);
        }
        return find == -1;
      });
      this.setState({ all_users: [...users, ...squads, ...events] });
    });
  };

  getArchivedLength = async () => {
    const authToken = this.props.userInfo.token;
    var formdata = new FormData();
    formdata.append("token", authToken);
    postMethod(this.props.navigation, "archive_messenger", formdata, (response) => {
     let data_archived = response.messenger.messages;
     let archiveStatus = false;
     if(data_archived.length > 0){
      archiveStatus = true
     }
     this.setState({Archive : archiveStatus})

    });
  };
  deleteMessage = (auth_id, receiver_id, type) => {
    let token = this.props.userInfo.token;
    let body = {
        "token" : token,
        "auth_id" : auth_id,
        "receiver_id" : receiver_id,
        "type": type
    };
    axios
    .post(
      "http://squadvibes.onismsolution.com/api/deleteChat",
      body
    )
    .then((res) => {
      this.getMessenger()
      this.getArchivedLength()
      Toast.show(res.data.message);
    })
    .catch((err) => Toast.show("Error in Deleting CHat"));
  }
  archiveMessage = (auth_id, receiver_id, type) => {
    let token = this.props.userInfo.token;
    let body = {
        "token" : token,
        "auth_id" : auth_id,
        "receiver_id" : receiver_id,
        "type" : type,
    };
    axios
    .post(
      "http://squadvibes.onismsolution.com/api/archiveChat",
      body
    )
    .then((res) => {
      this.getMessenger()
      this.getArchivedLength()
      Toast.show(res.data.message);
    })
    .catch((err) => {
      console.log(err)
      Toast.show("Error in Archive CHat")
    });
  }
  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      this.getMessenger();
      this.getArchivedLength()
    });
  }
  Archive = (item) =>{
console.log("item")
console.log(item)

  }
  componentWillUnmount() {
    this._unsubscribe();
  }

  userRow = (item) => {
    return (
      <View
        style={{
          height: 72,
          width: WINDOW_WIDTH - 60,
          alignSelf: "center",
          flexDirection: "row",
          backgroundColor: "white",
          borderRadius: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 1,
          elevation: 3,
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        <View
          style={{
            height: 72,
            width: 75,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={{ height: 52, width: 52 }}>
            {item.image ? (
                <Image
                source={{ uri: item.hasOwnProperty("image") ? item.image : "" }}
                style={styles.profileImg}
              />
            ):(
              <Image
              source={require("../../assets/dummy_image.png")}
              style={styles.profileImg}
            />
            )}
          
            <View
              style={{
                height: 10,
                width: 10,
                borderRadius: 20,
                backgroundColor: "#4EF300",
                position: "absolute",
                zIndex: 99,
                bottom: 6,
                right: 4,
              }}
            />
          </View>
        </View>
        <View style={{ flex: 1, paddingHorizontal: 5 }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{
                fontFamily: fonts.SemiBold,
                fontSize: 15,
                color: "black",
                marginTop: 5,
              }}
            >
              {item.name}
            </Text>
            {/* <Text style={{ fontFamily: fonts.regular, fontSize: 11 }}>{item.lastMessage ? moment.unix(item.lastMessage.time).format('hh:mm a') : ''}</Text> */}
            <Text
              numberOfLines={2}
              style={{ fontFamily: fonts.regular, fontSize: 11, marginTop: 8 }}
            >
              {item.lastMessage ? item.lastMessage.time : ""}
            </Text>
          </View>
          <View
            style={{
              marginVertical: 5,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ width:"75%" }}>
              {
                // (item.lastMessage && item.lastMessage.type == 'text' && item.lastMessage.message === 'Event shared') ?
                // <Text numberOfLines={2}  style={{ fontFamily: fonts.regular, fontSize: 12 }}>Join the created Event. </Text>
                //   :
                item.lastMessage && item.lastMessage.type == "text" ? (
                  <Text
                    numberOfLines={2}
                    style={{ fontFamily: fonts.regular, fontSize: 12 }}
                  >
                    {item.lastMessage ? item.lastMessage.message : ""}
                  </Text>
                ) : item.lastMessage &&
                  item.lastMessage.type == "EventInvite" ? (
                  <Text
                    numberOfLines={2}
                    style={{ fontFamily: fonts.regular, fontSize: 12 }}
                  >
                    {item.lastMessage.message}
                  </Text>
                ) : item.lastMessage && item.lastMessage.type == "location" ? (
                  <Text style={{ fontFamily: fonts.regular, fontSize: 12 }}>
                    📍
                  </Text>
                ) : item.lastMessage && item.lastMessage.type == "image" ? (
                  <Text style={{ fontFamily: fonts.regular, fontSize: 12 }}>
                    📷
                  </Text>
                ) : item.lastMessage &&
                  item.lastMessage.type == "GroupSquad" ? (
                  <Text style={{ fontFamily: fonts.regular, fontSize: 12 }}>
                    Squad group message
                  </Text>
                ) : item.lastMessage && item.lastMessage.type == "event" ? (
                  // <Text style={{ fontFamily: fonts.regular, fontSize: 12 }}>🗓</Text>
                  <Text style={{ fontFamily: fonts.regular, fontSize: 12 }}>
                    {item.lastMessage.message}
                  </Text>
                ) : null
              }
                
            </View>
            <TouchableOpacity style={{width:"25%",alignItems:"center",flexDirection:"row",justifyContent:"space-between"}}>
            <TouchableOpacity style={{width:"50%"}}
            onPress={()=>{
              let receiver_id = item.id;
              let auth_id = this.props.userInfo.id;
              let type = "";
              if(item.isSquad){
                type = "squad";
              }else if(item.isSquadGroup){
                type = "squad_group";
              }else if(item.isEvent){
                type = "event";
              }else{
                type = "message";
              }
              console.log("receiver_id",receiver_id)
              console.log("auth_id",auth_id)
              console.log("type",type)
              this.archiveMessage(auth_id,receiver_id, type)
              // this.setState({Archive:true})
              }}>
            <Icon2 name="archive" size={18} color= "#708090" />
            </TouchableOpacity>
            <TouchableOpacity style={{width:"50%"}}
            onPress={()=>{
              let receiver_id = item.id;
              let auth_id = this.props.userInfo.id;
              let type = "";
              if(item.isSquad){
                type = "squad";
              }else if(item.isSquadGroup){
                type = "squad_group";
              }else if(item.isEvent){
                type = "event";
              }else{
                type = "message";
              }
              console.log("receiver_id",receiver_id)
              console.log("auth_id",auth_id)
              console.log("type",type)
              this.deleteMessage(auth_id,receiver_id,type)
            }}
            >
            <Icon1 name="md-trash-bin-sharp" size={18} color= "#708090" />
            </TouchableOpacity>
            </TouchableOpacity>
         
          </View>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor={"transparent"}
          translucent
          barStyle="dark-content"
        />
        <View style={{ overflow: "hidden", paddingBottom: 5 }}>
          <View style={styles.headerViewStyle}>
            <View style={{ height: 30 }} />
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View style={styles.headerTitleViewStyle}>
                <Text style={{ fontSize: 15, fontFamily: fonts.Medium }}>
                  Chat
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View
          style={{
            overflow: "hidden",
          }}
        >
          <ScrollView
            style={styles.boxStyle}
            contentContainerStyle={{
              flexGrow: 1,
              marginTop: 7,
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            <View style={{ flexDirection: "row", paddingRight: 30 }}>
              {this.state.all_users.map((item) => {
                return (
                  <TouchableOpacity
                    style={styles.horizontalListContainer}
                    onPress={() =>
                      this.props.navigation.navigate("Chat", {
                        senderId: this.state.current_user_Id,
                        receiverId: item.id,
                        isSender: true,
                        userData: item,
                        image: item.image,
                        name: item.name,
                        address: item.address,
                        isGroup: item.isGroup ? item.isGroup : false,
                      })
                    }
                  >
                    <View style={{ height: 53 }}>
                      <Image
                        style={{
                          width: 53,
                          height: 53,
                          borderRadius: 80,
                          resizeMode: "cover",
                        }}
                        source={{ uri: item.image }}
                      />
                      <View
                        style={{
                          height: 10,
                          width: 10,
                          borderRadius: 20,
                          backgroundColor: "#4EF300",
                          position: "absolute",
                          zIndex: 99,
                          bottom: 6,
                          right: 1,
                        }}
                      />
                    </View>
                    <Text numberOfLines={1} style={styles.horizontalText}>
                      {item.name.split(" ")[0]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
{this.state.Archive == true ? (

<View style={{ width: "90%", marginVertical: 10 }}>
<TouchableOpacity style={{width:"100%",flexDirection:"row",justifyContent:"space-between",marginHorizontal:25}}>
    <TouchableOpacity style={{width:"10%",paddingTop:3}}>
    <Icon2 name="archive" size={15} color= "#708090" />
    </TouchableOpacity>
    <TouchableOpacity style={{width:"90%"}}
    onPress={()=>{
      this.props.navigation.navigate("Archived")}}>
<Text style={{ fontSize: 15, color: "#7e7e7e",fontFamily:fonts.Bold }}>
  Archived
  </Text>
    </TouchableOpacity>
    </TouchableOpacity>
</View>
):null}
       
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ marginTop: 0, marginHorizontal: 20 }}
        >
          <FlatList
            data={
              this.state.arrSearchUsers.length > 0
                ? this.state.arrSearchUsers
                : this.state.arrUsers
            }
            extraData={
              this.state.arrSearchUsers.length > 0
                ? this.state.arrSearchUsers
                : this.state.arrUsers
            }
            keyExtractor={(item, index) => String(item.id)}
            style={{ paddingBottom: 430 }}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("Chat", {
                      senderId: this.state.current_user_Id,
                      receiverId: item.id,
                      isSender: true,
                      userData: item,
                      image: item.image,
                      name: item.name,
                      isGroup: item.isGroup ? item.isGroup : false,
                    })
                  }
                >
                  {this.userRow(item)}
                </TouchableOpacity>
              );
            }}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  horizontalListContainer: {
    width: 50,
    height: 90,
    marginRight: 12,
    alignItems: "center",
  },
  horizontalText: {
    color: colors.gray,
    textAlign: "center",
    fontSize: 12,
    fontFamily: fonts.Medium,
  },
  itemView: {
    flexDirection: "row",
    borderRadius: 10,
    marginBottom: 10,
  },
  profileImg: {
    width: 50,
    height: 50,
    borderRadius: 50,
    resizeMode: "cover",
  },

  headerView: {
    fontSize: 14,
    fontWeight: "bold",
  },
  lineVisibleView: {
    flex: 1,
    flexDirection: "row",
    height: 1,
    backgroundColor: colors.BORDER_COLOR,
  },
  unReadViewContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingTop: 5,
    width: "15%",
    fontSize: 8,
    color: colors.GRAY,
  },
  unReadMessageView: {
    width: 20,
    height: 20,
    borderRadius: 20 / 2,
    margin: 5,
    marginTop: 5,
    marginLeft: 20,
    justifyContent: "center",
  },
  descriptionView: {
    fontSize: 12,
    color: colors.GRAY,
    textAlign: "left",
    marginTop: 5,
  },
  timeView: {
    fontSize: 9,
    color: colors.GRAY,
  },
  timeViewContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingTop: 2,
    width: "15%",
    fontSize: 8,
    color: colors.GRAY,
  },
  searchcontainer: {
    borderWidth: 0, //no effect
    width: "100%",
    backgroundColor: null,
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
    marginTop: 10,
    paddingHorizontal: 20,
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
  boxStyle: {
    height: 100,
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingRight: 40,
    height: 88,
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
  contentViewStyle: { flex: 2, justifyContent: "center", alignItems: "center" },
  contentTextStyle: {
    marginHorizontal: 48,
    marginTop: 15,
    textAlign: "center",
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.black,
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

export default connect(mapStateToProps)(Chat);
