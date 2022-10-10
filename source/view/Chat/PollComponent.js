import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { colors, fonts, SCREEN_SIZE } from "../../common/colors";
import { Button, Input } from "react-native-elements";
import { connect } from "react-redux";
import { HeadingText } from "../../common/HeadingText";
import moment from "moment";
import Toast from "react-native-simple-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/header";
import { TextInput } from "react-native-gesture-handler";
import { postMethod } from "../../Networking/APIModel";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import axios from "axios";

import LinearGradient from "react-native-linear-gradient";
import Ripple from "react-native-material-ripple";
import { CustomInputField } from "../../common/inputField";

const WINDOW_WIDTH = Dimensions.get("window").width;

const Active = () => (
  <Image
    style={{ width: 30, height: 30, resizeMode: "contain" }}
    source={require("../../assets/eple-02.png")}
  />
);

const Inactive = () => (
  <Image
    style={{ width: 30, height: 30, resizeMode: "contain" }}
    source={require("../../assets/eple-03.png")}
  />

  // <View style={{width:20,height:20,borderColor:'gray',marginLeft:10,borderRadius:50,borderWidth:2}}>

  // </View>
);
const Radio = ({ text, active, percentageText }) => (
  <View
    activeOpacity={0.6}
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      width: "100%",
      height: 60,
    }}
  >
    <Text
      style={[
        percentageText !== "" ? { width: "70%" } : { width: "85%" },
        { color: "black" },
      ]}
    >
      {text}
    </Text>
    {active ? <Active /> : <Inactive />}
    {percentageText !== "" ? (
      <Text style={{ width: 38, marginLeft: 5, textAlign: "center" }}>
        {percentageText.toFixed()}%
      </Text>
    ) : (
      <></>
    )}
  </View>
);

const Percentage = ({ text, percentage }) => (
  <View
    activeOpacity={0.6}
    style={{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 10,
      width: "100%",
      height: 60,
    }}
  >
    <Text style={{ width: "85%" }}>{text}</Text>
    <Text
      style={{ marginLeft: 15, color: "black", width: 50, textAlign: "center" }}
    >
      {percentage}%
      {/* {percentage.toFixed()}% */}
    </Text>
  </View>
);

const Question = ({ text }) => (
  <View style={{ flexDirection: "row", marginBottom: 15 }}>
    {/* <Text style={{marginTop:1, color:"black"}}>Q)</Text> */}
    <HeadingText
      title={text}
      style={{
        marginLeft: 8,
        fontSize: 14,
        color: colors.black,
        fontFamily: fonts.SemiBold,
      }}
    />
  </View>
);

class PollComponent extends Component {
  constructor() {
    super();
    this.state = {
      question: "",
      option1: "",
      option2: "",
      message: "",
      chatRoomId: "",
      answers: ["", ""],
      selectedType: 0,
      multiple: false,
      isPickerVisible: false,
      eventDate: "",
      eventTime: "",
      data: [],
      question_ids: [],
      answer_ids: [],
      poll_exist: true,
      showUsername: false,
    };
  }

  componentDidMount() {
    // this.setState({answers : new Array(4).fill(0)})
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      if (this.props.route.params != undefined) {
        this.getPolls();
      }
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  getPolls = () => {
    const parameter = new FormData();
    parameter.append("token", this.props.userInfo.token);
    parameter.append("squad_id", this.props.route.params.squad_id);
    parameter.append("question_id", 7);
    console.log("AAA", parameter);
    postMethod(
      this.props.navigation,
      "getPoll",
      parameter,
      (response) => {
        console.log("getPoll", response.getPoll);
        this.setState({
          data: response.getPoll.poll ? response.getPoll.poll : [],
          poll_exist: !!response.getPoll.pollExist,
        });
      },
      (error) => {
        this.setState({ loading: false });
        Toast.show(error.message);
      }
    );

    const { message, chatRoomId } = this.props.route.params;
    this.setState({
      message: message == undefined ? "" : message,
      chatRoomId: chatRoomId == undefined ? "" : chatRoomId,
    });
  };

  Multiple = (text, active) => (
    <TouchableOpacity
      onPress={() => this.setState({ multiple: !this.state.multiple })}
      activeOpacity={0.6}
      style={{ flexDirection: "row", marginTop: 20 }}
    >
      <Text style={{ color: "black" }}>{text}</Text>
      {active ? <Active /> : <Inactive />}
    </TouchableOpacity>
  );

  setAnswer = (val, index) => {
    const dupAnswers = [...this.state.answers];
    dupAnswers[index] = val;
    this.setState({ answers: dupAnswers });
  };

  deleteID = (poll_id) => {
    const parameter = new FormData();
    parameter.append("poll_id", poll_id);
    parameter.append("token", this.props.userInfo.token);

    axios
      .post("http://squadvibes.onismsolution.com/api/DeletePoll", parameter)
      .then((res) => {
        console.log("RESDATA", res.data);
        Toast.show("Poll deleted");
        this.getPolls();
      })
      .catch((err) => {
        Toast.show("Error in deleting Poll");

        // console.log("ERR", err)
      });
  };

  All_POLLS = () => (
    <View style={{ flex: 2, paddingHorizontal: 16, paddingBottom: 20 }}>
      {this.state.data.length !== 0 ? (
        this.state.data.map((elem) => {
          console.log("DATA CHECKING", elem.user_id);
          console.log("INFO", this.props.userInfo.id);
          let showPercentage = false;
          if (elem.answeredKeys) {
            elem.answeredKeys.forEach((key) => {
              elem.answers.map((ans, index) => {
                console.log("CHECK", ans);
                if (key == ans.id) {
                  showPercentage = true;
                }
              });
            });
          }

          return (
            <View
              style={{
                paddingHorizontal: 18,
                borderRadius: 15,
                elevation: 3,
                marginVertical: 8,
                paddingVertical: 30,
                shadowColor: "gray",
                shadowOffset: {
                  width: 0,
                  height: 7,
                },
                shadowOpacity: 0.53,
                shadowRadius: 5.51,
                backgroundColor: "white",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  position: "relative",
              
                }}
              >
                <Image
                  style={{ width: 30, height: 30, borderRadius: 30 }}
                  source={{ uri: elem.user_image }}
                />
                <Text style={{ color: "gray", marginLeft: 15,fontSize:15 }}>
                  {elem.user_name}
                </Text>
                {/* <Text
                  style={{
                    color: "gray",
                    // marginLeft: "auto",
                    marginRight: 30,
                    marginTop: 3,
                  }}
                  
                >
               {moment(elem.created_at).format("DD-MM-YYYY HH:mm:ss")}
                </Text> */}

                {this.props.userInfo.id == elem.user_id && (
                  <TouchableOpacity
                    onPress={() => this.deleteID(elem.question_id)}
                    style={{
                      alignSelf: "flex-end",
                      position: "absolute",
                      right: 0,
                    }}
                  >
                    <AntDesign name="delete" color="#50C4E9" size={22} />
                  </TouchableOpacity>
                 )} 
              </View>
              <View
                style={{
                  // alignItems: "center",
                  // position: "relative",
                  marginBottom: 15
                

                }}
              >
               
                <Text
                  style={{
                    color: "gray",
                    paddingHorizontal:45, fontSize:10 
                  }}
                  
                >
               {moment(elem.created_at).format("DD-MMMM-YYYY HH:mm:ss")}
                </Text>

                
              </View>
              {/* <View></View> */}
              <Question text={elem.question} />

              {elem.hasVoted == 0
                ? elem.answers.map((ans, index) => {
                    let found = false;
                    this.state.answer_ids.forEach((elem) => {
                      if (elem == ans.id) {
                        found = true;
                      }
                    });

                    if (elem.answeredKeys) {
                      elem.answeredKeys.forEach((key, index) => {
                        if (key == ans.id) {
                          found = true;
                        }
                      });
                    }

                    console.log("percent", found);

                    return (
                      <TouchableOpacity
                        onPress={() =>
                          this.sendVote(
                            elem.question_id,
                            ans.id,
                            elem.type,
                            found
                          )
                        }
                        style={{
                          width: "100%",
                          shadowOffset: {
                            width: 0,
                            height: 7,
                          },
                          shadowOpacity: 0.13,
                          shadowRadius: 5.51,
                          marginTop: 10,
                          borderRadius: 15,

                          backgroundColor: "white",
                        }}
                      >
                        <Radio
                          percentageText={showPercentage ? ans.percent : ""}
                          active={found}
                          text={ans.answer}
                        />
                      </TouchableOpacity>
                    );
                  })
                : elem.answers.map((ans) => {
                    return (
                      <View
                        style={{
                          shadowOffset: {
                            width: 0,
                            height: 7,
                          },
                          shadowOpacity: 0.13,
                          shadowRadius: 5.51,
                          borderRadius: 15,
                          alignSelf: "center",
                          marginTop: 10,
                          width: "100%",
                          paddingHorizontal: 18,
                          backgroundColor: "white",
                        }}
                      >
                        <Percentage
                          text={ans.answer}
                          percentage={ans.percent}
                        />
                      </View>
                    );
                  })}
            </View>
          );
        })
      ) : (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: 130,
            flex: 1,
          }}
        >
          <Text style={{ fontSize: 25 }}>No Poll Available</Text>
        </View>
      )}
    </View>
  );

  Create_Poll = () => (
    <View style={{ alignItems: "center", padding: 15, paddingBottom: 150 }}>
      {/* <TouchableOpacity onPress={() => this.setState({isPickerVisible : true})} style={{flexDirection:'row',width:'100%',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
                <Text style={{color:colors.black,fontSize:18}}>Expiry Date</Text>
                
                {
                    this.state.eventDate
                    ?
                    <Text>{this.state.eventDate} </Text>
                    :
                    <Text>Not Selected</Text>
                }
            </TouchableOpacity> */}

      <Text
        style={{
          color: colors.black,
          alignSelf: "flex-start",
          fontSize: 16,
          fontWeight: "700",
          marginBottom: 15,
        }}
      >
        Question
      </Text>

      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <TextInput
          onChangeText={(text) => this.setState({ question: text })}
          placeholder="Type a Question"
          style={styles.inputStylee}
        />
      </View>

      <Text
        style={{
          color: colors.black,
          alignSelf: "flex-start",
          marginTop: 35,
          fontSize: 16,
          fontWeight: "700",
          marginBottom: 15,
        }}
      >
        Answer selection type
      </Text>

      <View style={{ alignSelf: "flex-start" }}>
        <TouchableOpacity
          onPress={() => this.setState({ multiple: true })}
          style={{ flexDirection: "row", alignItems: "center", marginTop: 15 }}
        >
          {this.state.multiple ? (
            <Image
              style={{ height: 35, width: 35, resizeMode: "contain" }}
              source={require("../../assets/eple-02.png")}
            />
          ) : (
            <Image
              style={{ height: 35, width: 35, resizeMode: "contain" }}
              source={require("../../assets/eple-03.png")}
            />
          )}
          <Text style={{ marginLeft: 20 }}>Select Multiple Answers</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => this.setState({ multiple: false })}
          style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}
        >
          {this.state.multiple ? (
            <Image
              style={{ height: 35, width: 35, resizeMode: "contain" }}
              source={require("../../assets/eple-03.png")}
            />
          ) : (
            <Image
              style={{ height: 35, width: 35, resizeMode: "contain" }}
              source={require("../../assets/eple-02.png")}
            />
          )}
          <Text style={{ marginLeft: 20 }}>Select Single Answer</Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: "row",
          width: "100%",
          marginTop: 20,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: colors.black,
            fontSize: 16,
            alignSelf: "flex-start",
            fontWeight: "700",
            marginTop: 20,
            marginBottom: 5,
          }}
        >
          Answers
        </Text>
      </View>

      <TextInput
        onChangeText={(text) => this.setAnswer(text, 0)}
        placeholder="Answer 1"
        style={styles.inputStylee}
      />

      <TextInput
        onChangeText={(text) => this.setAnswer(text, 1)}
        placeholder="Answer 2"
        style={styles.inputStylee}
      />

      {this.state.answers.length > 2 && (
        <View style={{ width: "100%" }}>
          {this.state.answers
            .filter((elem, index) => index >= 2)
            .map((elem, index) => (
              <View
                style={{
                  position: "relative",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* <TextInput value={this.state.answers[index+2]} onChangeText={(text) => this.setAnswer(text,index+2)} multiline={true} placeholder={`Answer ${index+3}`} style={{borderColor:'gray',width:'100%',borderWidth:2,borderRadius:10,marginTop:10,padding:12,fontSize:16}}/> */}
                <TextInput
                  onChangeText={(text) => this.setAnswer(text, index + 2)}
                  value={this.state.answers[index + 2]}
                  placeholder={`Answer ${index + 3}`}
                  style={styles.inputStylee}
                />
                <TouchableOpacity
                  onPress={() => this.removeAns(index)}
                  style={{ position: "absolute", right: 10, top: 30 }}
                >
                  <Entypo color="gray" name="cross" size={25} />
                </TouchableOpacity>
              </View>
            ))}
        </View>
      )}

      <TouchableOpacity
        onPress={() => this.setState({ answers: [...this.state.answers, ""] })}
        activeOpacity={0.6}
        style={{
          backgroundColor: colors.GRAY,
          padding: 10,
          width: 140,
          borderRadius: 20,
          alignItems: "center",
          marginVertical: 20,
        }}
      >
        <Text style={{ textAlign: "center", color: colors.white }}>
          Add Answer
        </Text>
      </TouchableOpacity>
      {/* {this.state.showUsername ? (
        <View style={{ marginHorizontal: 10 }}>
          <View
            style={{
              alignContent: "center",
              alignItems: "center",
              padding: 10,
              borderRadius: 50,
              flexDirection: "row",
            }}
          >
            <TextInput
              value={this.state.eventDate}
              onPressIn={() =>
                this.setState({ showUsername: true, isPickerVisible: true })
              }
              style={styles.inputStyle}
              autoCorrect={false}
              placeholder="Date"
              placeholderTextColor="#8D8B82"
              onChangeText={(user_name) => this.setState({ user_name })}
            />
          </View>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() =>
            this.setState({ showUsername: true, isPickerVisible: true })
          }
          style={{
            marginTop: 20,
            height: 56,
            width: WINDOW_WIDTH - 60,
            alignSelf: "center",
            borderRadius: 10,
            backgroundColor: "white",
            flexDirection: "row",
            shadowColor: "#000",
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 0.4,
            shadowRadius: 3,
            elevation: 5,
            alignItems: "center",
          }}
        >
          <Image
            style={{
              width: 23,
              height: 23,
              resizeMode: "contain",
              marginLeft: 15,
            }}
            source={require("../../assets/eventLocationIcons.png")}
          />

          <View style={{ marginLeft: 15, flex: 1 }}>
            <Text
              style={{
                color: "black",
                fontSize: 14,
                fontWeight: "bold",
                //   marginBottom: 6,
              }}
            >
              Expiry Date
            </Text>
            <Text style={{ color: "black", fontSize: 12 }}>
              Poll expiry date?
            </Text>
          </View>

          <Image
            style={{ height: 16, width: 16, marginRight: 15 }}
            source={require("../../assets/arrowRight.png")}
          />
        </TouchableOpacity>
      )} */}
    </View>
  );

  removeAns = (index) => {
    console.log(index);
    const dupAnswers = [...this.state.answers];
    dupAnswers.splice(index + 2, 1);
    console.log(dupAnswers);
    this.setState({ answers: dupAnswers });
  };

  onCreatePoll = () => {
    // const { answers, question, eventDate } = this.state;
    const { answers, question } = this.state;

    // let date = this.state.eventDate.replace('/', '-')
    // date = date.replace('/', '-')
    let error = false;
    answers.forEach((elem) => {
      if (!elem) {
        error = true;
      }
    });
    // const am_pm = eventDate.slice(eventDate.length - 2, eventDate.length);

    // let date = eventDate;

    // if (am_pm == "PM") {
    //   date = parseInt(eventDate.slice(11, 13)) + 12;
    //   if (date == 24) {
    //     date = "00";
    //   }
    //   date = eventDate.slice(0, 11) + date + eventDate.slice(13, 19);
    // }

    // console.log("DATEEE", am_pm, date);

    if (
      this.props.userInfo.token &&
      question &&
      // eventDate &&
      this.props.userInfo.id &&
      !error
    ) {
      const parameter = new FormData();
      parameter.append("token", this.props.userInfo.token);
      parameter.append("squad_id", this.props.route.params.squad_id);
      parameter.append("question", question);
      parameter.append("type", this.state.multiple ? "multi" : "single");
      // parameter.append("expiry_date", date);
      parameter.append("user_id", this.props.userInfo.id);
      answers.map((elem, index) => parameter.append(`answers[${index}]`, elem));
      console.log("parameterparameter", parameter);

      postMethod(
        this.props.navigation,
        "createPoll",
        parameter,
        (response) => {
          console.log("createPoll")
          console.log(response)
          if (response.createPoll == "Poll Created Successfully") {
            console.log("ABCDEF");
            this.setState({
              selectedType: 0,
              answers: ["", ""],
              question: "",
              multiple: false,
              eventDate: "",
            });
            this.getPolls();
          }
        },
        (error) => {
          this.setState({ loading: false });
          Toast.show(error.message);
        }
      );
    } else {
      Toast.show("Missing fields are there");
    }
  };

  sendVote = (question_id, ans_id, type, answerInAnswerdKey) => {
    let found = false;

    this.state.question_ids.forEach((elem) => {
      if (elem == question_id) {
        found = true;
      }
    });

    let ansFound = false;
    this.state.answer_ids.forEach((elem) => {
      if (elem == ans_id) {
        ansFound = true;
      }
    });

    if (ansFound || answerInAnswerdKey) {
      Toast.show("Already Polled on it.");
    } else if ((!found && type == "single") || type == "multi") {
      const parameter = new FormData();

      parameter.append("token", this.props.userInfo.token);
      parameter.append("question_id", question_id);
      parameter.append("answers[0]", ans_id);

      console.log("SENDVOTE", parameter);

      postMethod(
        this.props.navigation,
        "votePoll",
        parameter,
        (response) => {
          console.log("RESPONSE response", response);
          this.setState({
            question_ids: [...this.state.question_ids, question_id],
            answer_ids: [...this.state.answer_ids, ans_id],
          });
          Toast.show("Poll successfully sent");
        },
        (error) => {
          this.setState({ loading: false });
          Toast.show(error.message);
        }
        
      );
    } else {
      Toast.show("You can select single only");
      // alert("You can select single only")
    }
  };

  render() {
    const component =
      this.state.selectedType === 0 ? this.All_POLLS() : this.Create_Poll();
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
                  Poll
                </Text>
              </View>
              <View style={styles.headerButtonsViewStyle}>
              <Ripple
                  rippleCentered={true}
                  rippleContainerBorderRadius={50}
                  style={styles.backButtonStyle}
                  onPress={() => this.props.navigation.navigate("NotificationPanel")}
                >
                  <Image
                    source={require("../../assets/bell_Icon.png")}
                    style={{ width: 22, height: 22 }}
                    resizeMode={"contain"}
                  />
                </Ripple>
              </View>
            </View>
          </View>
        </View>
        {!this.state.poll_exist ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                marginBottom: 10,
                marginTop: 20,
                borderWidth: 0.5,
                borderRadius: 50,
                borderColor: "white",
                backgroundColor: "white",
                flexDirection: "row",
                justifyContent: "space-between",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.4,
                shadowRadius: 3,
                height: 53,
                elevation: 5,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => this.setState({ selectedType: 0 })}
                style={{
                  borderRadius: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 0,
                  backgroundColor:
                    this.state.selectedType === 1 ? "#00000000" : "#50C4E9",
                  height: 45,
                  width: "40%",
                  marginLeft: 4,
                }}
              >
                <Text
                  style={{
                    color:
                      this.state.selectedType === 1
                        ? colors.themeColor
                        : colors.white,
                    fontFamily: fonts.Bold,
                    fontSize: 14,
                  }}
                >
                  All Polls
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.setState({ selectedType: 1 })}
                style={{
                  borderRadius: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 0,
                  backgroundColor:
                    this.state.selectedType === 1 ? "#50C4E9" : "#00000000",
                  height: 45,
                  width: "40%",
                  marginRight: 3,
                }}
              >
                <Text
                  style={{
                    color:
                      this.state.selectedType === 1
                        ? colors.white
                        : colors.themeColor,
                    fontFamily: fonts.Bold,
                    fontSize: 14,
                  }}
                >
                  Create Poll
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          false
        )}

        <ScrollView style={{ zIndex: 30 }}>{component}</ScrollView>

        {this.state.selectedType === 1 && (
          <TouchableOpacity activeOpacity={0.8} onPress={this.onCreatePoll}>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={["#38A5CA", "#54C8EE"]}
              style={styles.linearGradient}
            >
              <Text style={styles.textStyle}>POST</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        <DateTimePickerModal
          isVisible={this.state.isPickerVisible}
          // mode="date"
          minimumDate={new Date().getTime()}
          mode="datetime"
          onConfirm={(time) => {
            console.warn(
              "A date has been picked: ",
              moment(time).format("DD/MM/YYYY ")
            );
            console.warn(
              "A time has been picked: ",
              moment(time).format("hh:mm A")
            );
            this.setState({
              // eventDate: moment(time).format('DD/MM/YYYY hh:mm A'),
              eventDate: moment(time).format("YYYY-MM-DD hh:mm:ss A"),
              eventTime: moment(time).format("hh:mm A"),
              isPickerVisible: false,
            });
            // const eventDate = moment(moment(time).format('DD/MM/YYYY hh:mm A'), 'DD/MM/YYYY hh:mm A').format('YYYY-MM-DD hh:mm A')
          }}
          onCancel={() => {
            this.setState({
              isPickerVisible: false,
            });
          }}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.user.userInfo,
  };
};
export default connect(mapStateToProps)(PollComponent);

const styles = StyleSheet.create({
  headerView: {
    fontSize: 14,
    marginLeft: 10,
    fontWeight: "bold",
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
  ///////////
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
  inputStyle: {
    color: "black",
    fontSize: 16,
    fontFamily: fonts.Regular,
    backgroundColor: "white",
    elevation: 2,
    width: "100%",
    height: 65,
    borderRadius: 180,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "gray",
  },

  inputStylee: {
    color: "black",
    fontSize: 15,
    fontFamily: fonts.Regular,
    backgroundColor: "white",
    elevation: 2,
    width: "100%",
    height: 48,
    borderRadius: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#F5F5F5",
    marginTop: 20,
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
    shadowOpacity: 0.2,
    shadowRadius: 2,
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
