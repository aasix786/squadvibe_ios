import React, { PureComponent, Component } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  FlatList,
  ScrollView,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Alert,
  Modal,
  Pressable,
  Dimensions,
  findNodeHandle,
} from "react-native";
import { colors, fonts, SCREEN_SIZE } from "../../common/colors";
import { HeadingText } from "../../common/HeadingText";
import { Input, CheckBox, Icon, Chip, Button } from "react-native-elements";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment, { duration } from "moment";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import DropDown from "../../common/DropDown";
import Loader from "../../common/Loader";
import { postMethod } from "../../Networking/APIModel";
import Toast from "react-native-simple-toast";
import { connect } from "react-redux";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, {
  MarkerAnimated,
  PROVIDER_GOOGLE,
  MapViewAnimated,
} from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import RangeSlider from '@m15r/react-native-range-slider'
// import RangeSlider from '@jesster2k10/react-native-range-slider';
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import CustomLabel from "../../common/CustomLabel";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Platform } from "react-native";
import Header from "../components/header";
import FontAwesome from "react-native-vector-icons/FontAwesome";
// import Button from "../components/button"

const latitudeDelta = 0.025;
const longitudeDelta = 0.025;
const GOOGLE_API_KEY = "AIzaSyAis1VNdZkjXeCKL-STa0b9aHdKk83WFtk";

class AddEventComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      isCheck: false,
      images: [""],
      selectedIndex: 1,
      isPickerVisible: false,
      eventDate: "",
      eventTime: "",
      filePath: "",
      imageResponse: "",
      selected_number_of_participant: "",
      title: "",
      address: "",
      details: "",
      invite_friend: [],
      invite_squad: [],
      mode_type: 1,
      add_to_people_group_chat: false,
      loading: false,
      location: {
        latitude: 37.78825,
        longitude: -122.4324,
      },
      modalVisible: false,
      minAge: "",
      maxAge: "",
      arrSomeOneBrings: [],
      some_one_bring: "",
      showUsername: false,
      showAddress: false,
    };
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      console.log("route.params ", this.props.route.params);
      if (this.props.route.params !== undefined) {
        if (this.props.route.params.hasOwnProperty("squadIds")) {
          const { squadIds } = this.props.route.params;
          this.setState({
            invite_squad: squadIds,
          });
        }

        if (this.props.route.params.hasOwnProperty("friendsId")) {
          const { friendsId } = this.props.route.params;
          this.setState({
            invite_friend: friendsId,
          });
        }
      }

      this.showLocationOnMap();

      // AsyncStorage.multiGet(['latitude', 'longitude']).then(res => {
      //     console.log('Location ', JSON.stringify(res))
      //     if(res.length > 0){
      //         console.log('Location latitude', JSON.stringify(res[0][1]))
      //         const locationObj = {
      //             latitude: parseFloat(res[0][1]),
      //             longitude: parseFloat(res[1][1])
      //         }
      //         if (locationObj.latitude != null && locationObj.latitude != undefined &&
      //             locationObj.longitude != null && locationObj.longitude != undefined) {
      //             this.setState({ location: locationObj })
      //             this.mapView.animateToCoordinate(locationObj, 2000)
      //         }
      //     }
      // })
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  render() {
    const userInfo = {
      user_name: "",
    };
    alert("ABC");
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.themeColor }}>
        <SafeAreaView
          style={{ backgroundColor: colors.themeColor }}
        ></SafeAreaView>

        <KeyboardAvoidingView
          style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          enabled
          keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 70}
        >
          <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 0,
                paddingVertical: 10,
              }}
            >
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Image source={require("../../assets/back_arrow.png")} />
              </TouchableOpacity>
              <Text
                style={{
                  flex: 1,
                  alignSelf: "center",
                  textAlign: "center",
                  color: "#242E40",
                  fontFamily: fonts.SemiBold,
                  fontSize: 17,
                }}
              >
                Add Event
              </Text>
            </View>
            <View style={{ flex: 0 }}>
              <KeyboardAwareScrollView
                automaticallyAdjustContentInsets={false}
                bounces={false}
                keyboardShouldPersistTaps="always"
                scrollEventThrottle={10}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 154 }}
                ref={(ref) => (this.scrollView = ref)}
                resetScrollToCoords={{ x: 0, y: 0 }}
                extraHeight={0}
                extraScrollHeight={0}
                enableOnAndroid={false}
                scrollEnabled={true}
                enableAutomaticScroll={true}
                onKeyboardWillShow={(frame) => {
                  console.log("Frames ===> ", frame);
                }}
                onKeyboardWillHide={(frame) => {
                  console.log("Frames ===> ", frame);
                }}
              >
                <View>
                  <HeadingText
                    title={"Title"}
                    style={{
                      marginLeft: 8,
                      marginTop: 20,
                      fontSize: 14,
                      color: colors.headingTextColor,
                      fontFamily: fonts.SemiBold,
                    }}
                  />
                  <View style={{ flex: 2 }}>
                    <Input
                      placeholder="Beer pong"
                      placeholderTextColor={colors.txtPlaceholderColor}
                      inputStyle={{
                        marginVertical: 8,
                        fontFamily: fonts.Regular,
                        fontSize: 16,
                        color: colors.headingTextColor,
                      }}
                      inputContainerStyle={{
                        borderBottomColor: colors.bottomBorderColor,
                      }}
                      onChangeText={(title) => this.setState({ title })}
                      autoCorrect={false}
                    />
                    <HeadingText
                      title={"Where?"}
                      style={{
                        marginLeft: 8,
                        fontSize: 14,
                        color: colors.headingTextColor,
                        fontFamily: fonts.SemiBold,
                      }}
                    />

                    <Pressable
                      onPress={() => {
                        Keyboard.dismiss();
                        this.setModalVisible(true);
                      }}
                    >
                      <Input
                        pointerEvents="none"
                        placeholder="Address"
                        placeholderTextColor={colors.txtPlaceholderColor}
                        inputStyle={{
                          marginVertical: 8,
                          fontFamily: fonts.Regular,
                          fontSize: 16,
                          color: colors.headingTextColor,
                        }}
                        inputContainerStyle={{
                          borderBottomColor: colors.bottomBorderColor,
                        }}
                        onChangeText={(address) => this.setState({ address })}
                        editable={false}
                        onPressIn={() => {
                          Keyboard.dismiss();
                          this.setModalVisible(true);
                        }}
                        onPressOut={() => {
                          Keyboard.dismiss();
                          this.setModalVisible(true);
                        }}
                        defaultValue={this.state.address}
                      />
                    </Pressable>

                    <View style={{ height: 147, marginHorizontal: 10 }}>
                      {this.showMap()}
                    </View>

                    <View style={{ marginTop: 30 }}>
                      <HeadingText
                        title={"Date"}
                        style={{
                          marginLeft: 8,
                          fontSize: 14,
                          color: colors.headingTextColor,
                          fontFamily: fonts.SemiBold,
                        }}
                      />
                      <Input
                        defaultValue={this.state.eventDate}
                        placeholder="Add Date"
                        placeholderTextColor={colors.txtPlaceholderColor}
                        inputStyle={{
                          marginVertical: 8,
                          fontFamily: fonts.Regular,
                          fontSize: 16,
                          color: colors.headingTextColor,
                        }}
                        inputContainerStyle={{
                          borderBottomColor: colors.bottomBorderColor,
                        }}
                        rightIcon={
                          <TouchableOpacity
                            onPress={() =>
                              this.setState({ isPickerVisible: true })
                            }
                          >
                            <Image
                              source={require("../../assets/calendar_ic.png")}
                            />
                          </TouchableOpacity>
                        }
                        onChangeText={(date) => this.setState({ date })}
                        onPressOut={() =>
                          this.setState({ isPickerVisible: true })
                        }
                        editable={false}
                        autoCorrect={false}
                      />
                    </View>

                    <View style={{ marginTop: 0 }}>
                      <HeadingText
                        title={"Details"}
                        style={{
                          marginLeft: 8,
                          fontSize: 14,
                          color: colors.headingTextColor,
                          fontFamily: fonts.SemiBold,
                        }}
                      />
                      <Input
                        placeholder="Write here"
                        placeholderTextColor={colors.txtPlaceholderColor}
                        inputStyle={{
                          marginVertical: 8,
                          fontFamily: fonts.Regular,
                          fontSize: 16,
                          color: colors.headingTextColor,
                        }}
                        inputContainerStyle={{
                          borderBottomColor: colors.bottomBorderColor,
                        }}
                        multiline={true}
                        containerStyle={{ maxHeight: 80 }}
                        onChangeText={(details) => this.setState({ details })}
                        autoCorrect={false}
                        blurOnSubmit={true}
                        ref={(ref) => (this.txtDetail = ref)}
                      />
                    </View>

                    <View>
                      <HeadingText
                        title={"How many Participant"}
                        style={{
                          marginLeft: 8,
                          fontSize: 14,
                          color: colors.headingTextColor,
                          fontFamily: fonts.SemiBold,
                        }}
                      />
                      <Input
                        placeholder="Participant"
                        placeholderTextColor={colors.txtPlaceholderColor}
                        inputStyle={{
                          marginVertical: 8,
                          fontFamily: fonts.Regular,
                          fontSize: 16,
                          color: colors.headingTextColor,
                        }}
                        inputContainerStyle={{
                          borderBottomColor: colors.bottomBorderColor,
                        }}
                        autoCorrect={false}
                        keyboardType="number-pad"
                        returnKeyLabel="Done"
                        returnKeyType="done"
                        onChangeText={(value) => {
                          this.setState({
                            selected_number_of_participant: value,
                          });
                        }}
                        // rightIcon={<Image source={require('../../assets/dropdown_arrow_field.png')} />}
                      />
                      {/* <View style={{ marginVertical: 8, paddingHorizontal: 8 }}>
                                                <DropDown
                                                    data={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']}
                                                    placeholderTitle='Select'
                                                    onChangeValue={value => {
                                                        console.log("selected value ", value);
                                                        this.setState({
                                                            selected_number_of_participant: value
                                                        })
                                                    }}
                                                    defaultValue={this.state.selected_number_of_participant}
                                                />
                                            </View> */}
                    </View>

                    <View
                      style={{
                        marginTop: 10,
                        borderBottomColor: "#E2E0DA",
                        borderBottomWidth: 1,
                        paddingBottom: 20,
                      }}
                    >
                      <HeadingText
                        title={"Who will be able to take part?"}
                        style={{
                          marginLeft: 8,
                          fontSize: 14,
                          color: colors.headingTextColor,
                          fontFamily: fonts.SemiBold,
                        }}
                      />
                      <Button
                        containerStyle={{ marginTop: 15 }}
                        title={"INVITE SQUAD"}
                        icon={
                          <Image
                            source={require("../../assets/line_plus_ic_black.png")}
                            style={{ marginHorizontal: 8 }}
                          />
                        }
                        titleStyle={{
                          marginLeft: 89,
                          color: colors.headingTextColor,
                          fontFamily: fonts.Bold,
                          fontSize: 15,
                          textAlign: "center",
                        }}
                        buttonStyle={{
                          borderWidth: 1,
                          borderColor: "#CFCBBC",
                          height: 45,
                          backgroundColor: colors.themeColor,
                          borderRadius: 36.5,
                          justifyContent: "flex-start",
                        }}
                        onPress={() =>
                          this.props.navigation.navigate("squad_list")
                        }
                      />
                      <Button
                        containerStyle={{ marginTop: 10 }}
                        title={"INVITE SINGLE PERSON"}
                        icon={
                          <Image
                            source={require("../../assets/line_plus_ic_black.png")}
                            style={{ marginHorizontal: 8 }}
                          />
                        }
                        titleStyle={{
                          marginLeft: 60,
                          color: colors.headingTextColor,
                          fontFamily: fonts.Bold,
                          fontSize: 15,
                          textAlign: "center",
                        }}
                        buttonStyle={{
                          borderWidth: 1,
                          borderColor: "#CFCBBC",
                          height: 45,
                          backgroundColor: colors.themeColor,
                          borderRadius: 36.5,
                          justifyContent: "flex-start",
                        }}
                        onPress={() =>
                          this.props.navigation.navigate("InviteSinglePerson", {
                            isFromContact: false,
                          })
                        }
                      />

                      {/* <CheckBox
                                        onPress={() => this.setState({ selectedIndex: 1, mode_type: 1 })}
                                        containerStyle={{ padding: 0, marginTop: 26, backgroundColor: '', borderColor: '', borderWidth: 0 }}
                                        title='Shall be shown in shuffle mode'
                                        uncheckedIcon={<Image source={require('../../assets/Radio.png')} />}
                                        checkedIcon={<Image source={require('../../assets/Radio_check.png')} />}
                                        checked={this.state.selectedIndex == 1}
                                        activeOpacity={0.9}
                                    /> */}
                      <CheckBox
                        onPress={() =>
                          this.setState({
                            selectedIndex:
                              this.state.selectedIndex == 2 ? 1 : 2,
                            mode_type: this.state.mode_type == 2 ? 1 : 2,
                          })
                        }
                        containerStyle={{
                          padding: 0,
                          marginTop: 26,
                          backgroundColor: "",
                          borderColor: "",
                          borderWidth: 0,
                        }}
                        title="Just upon request"
                        checkedIcon={
                          <Image
                            source={require("../../assets/Radio_check.png")}
                          />
                        }
                        uncheckedIcon={
                          <Image source={require("../../assets/Radio.png")} />
                        }
                        checked={this.state.selectedIndex == 2}
                        activeOpacity={0.9}
                      />
                      <CheckBox
                        onPress={() =>
                          this.setState({
                            selectedIndex:
                              this.state.selectedIndex == 3 ? 1 : 3,
                            mode_type: this.state.mode_type == 3 ? 1 : 3,
                          })
                        }
                        containerStyle={{
                          padding: 0,
                          backgroundColor: "",
                          borderColor: "",
                          borderWidth: 0,
                        }}
                        title="Not shown  anywhere, just with invitation"
                        checkedIcon={
                          <Image
                            source={require("../../assets/Radio_check.png")}
                          />
                        }
                        uncheckedIcon={
                          <Image source={require("../../assets/Radio.png")} />
                        }
                        checked={this.state.selectedIndex == 3}
                        activeOpacity={0.9}
                      />

                      <View
                        style={{
                          marginTop: 20,
                          marginVertical: 8,
                          paddingHorizontal: 8,
                        }}
                      >
                        <HeadingText
                          title={"Age range"}
                          style={{
                            marginLeft: 8,
                            fontSize: 14,
                            color: colors.headingTextColor,
                            fontFamily: fonts.SemiBold,
                          }}
                        />

                        <View style={{ marginLeft: 15, marginTop: 20 }}>
                          <MultiSlider
                            sliderLength={320}
                            values={[0, 100]}
                            selectedStyle={{
                              backgroundColor: colors.greenButton,
                            }}
                            unselectedStyle={{
                              backgroundColor: "#D3CEC0",
                            }}
                            onValuesChange={(values) => {
                              console.log("VAL", values);
                              this.setState({
                                minAge: values[0],
                                maxAge: values[1],
                              });
                            }}
                            min={0}
                            max={100}
                            step={1}
                            enableLabel
                            enabledOne
                            enabledTwo
                            customLabel={CustomLabel}
                            minMarkerOverlapDistance={10}
                            trackStyle={{ height: 6, borderRadius: 4 }}
                            markerStyle={{
                              height: 24,
                              width: 24,
                              borderRadius: 12,
                              backgroundColor: colors.greenButton,
                            }}
                            pressedMarkerStyle={{
                              height: 24,
                              width: 24,
                              borderRadius: 12,
                              backgroundColor: colors.greenButton,
                            }}
                          />
                        </View>
                      </View>

                      <View style={{ marginVertical: 8 }}>
                        <HeadingText
                          title={"Some one bring"}
                          style={{
                            marginLeft: 8,
                            fontSize: 14,
                            color: colors.headingTextColor,
                            fontFamily: fonts.SemiBold,
                          }}
                        />
                        <View style={{ flexDirection: "row" }}>
                          <View style={{ flex: 1 }}>
                            <Input
                              value={this.state.some_one_bring}
                              placeholder="Some one bring"
                              placeholderTextColor={colors.txtPlaceholderColor}
                              inputStyle={{
                                marginVertical: 8,
                                fontFamily: fonts.Regular,
                                fontSize: 16,
                                color: colors.headingTextColor,
                              }}
                              inputContainerStyle={{
                                borderBottomColor: colors.bottomBorderColor,
                              }}
                              onChangeText={(some_one_bring) =>
                                this.setState({ some_one_bring })
                              }
                            />
                          </View>

                          <TouchableOpacity
                            style={{ alignSelf: "center", marginHorizontal: 8 }}
                            onPress={() => {
                              var arr = [
                                ...this.state.arrSomeOneBrings,
                                ...[this.state.some_one_bring],
                              ];
                              this.setState({
                                some_one_bring: "",
                                arrSomeOneBrings: arr,
                              });
                            }}
                          >
                            <Text
                              style={{
                                color: colors.greenButton,
                                fontFamily: fonts.Bold,
                              }}
                            >
                              ADD
                            </Text>
                          </TouchableOpacity>
                        </View>

                        <View
                          style={{
                            flexDirection: "row",
                            flex: 1,
                            flexWrap: "wrap",
                          }}
                        >
                          {this.state.arrSomeOneBrings.map((data, index) => {
                            return (
                              <View style={{ marginTop: 10, marginRight: 10 }}>
                                <Chip
                                  containerStyle={{
                                    backgroundColor: "#E7E1CD",
                                  }}
                                  buttonStyle={{ backgroundColor: "" }}
                                  titleStyle={{
                                    color: colors.headingTextColor,
                                    fontFamily: fonts.Bold,
                                  }}
                                  title={data}
                                  icon={{
                                    name: "close",
                                    type: "font-awesome",
                                    size: 20,
                                    color: "gray",
                                    onPress: () => this.closeIconPress(index),
                                  }}
                                  iconRight
                                />
                              </View>
                            );
                          })}
                        </View>
                      </View>
                    </View>

                    <CheckBox
                      onPress={() =>
                        this.setState({
                          add_to_people_group_chat:
                            !this.state.add_to_people_group_chat,
                        })
                      }
                      containerStyle={{
                        marginTop: 20,
                        padding: 0,
                        backgroundColor: "",
                        borderColor: "",
                        borderWidth: 0,
                      }}
                      title="Add people to group chat who join the event"
                      checkedIcon={
                        <Image
                          source={require("../../assets/checkbox_check.png")}
                        />
                      }
                      uncheckedIcon={
                        <Image source={require("../../assets/checkbox.png")} />
                      }
                      checked={this.state.add_to_people_group_chat}
                      activeOpacity={0.9}
                    />

                    {/* <RangeSlider
                                range={[0,100]}
                                defaultValues={[25,75]}
                                onChange={this.handleChange} /> */}

                    <View style={{ marginTop: 30 }}>
                      <Button
                        title="CANCEL"
                        titleStyle={{
                          color: colors.greenButton,
                          fontFamily: fonts.Bold,
                          fontSize: 15,
                        }}
                        buttonStyle={{ backgroundColor: "" }}
                        onPress={() => this.props.navigation.goBack()}
                      />
                      <Button
                        title="CREATE EVENT"
                        titleStyle={{
                          color: colors.white,
                          fontFamily: fonts.Bold,
                          fontSize: 15,
                        }}
                        buttonStyle={{
                          height: 45,
                          backgroundColor: colors.greenButton,
                          borderRadius: 36.5,
                        }}
                        // onPress={() => this.props.navigation.goBack()}
                        onPress={() => this.validation()}
                      />
                    </View>
                  </View>
                </View>
                {/* </KeyboardAvoidingView> */}
              </KeyboardAwareScrollView>
            </View>
          </View>

          <DateTimePickerModal
            isVisible={this.state.isPickerVisible}
            // mode="date"
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
                eventDate: moment(time).format("DD/MM/YYYY hh:mm A"),
                eventTime: moment(time).format("hh:mm A"),
                isPickerVisible: false,
              });
              const eventDate = moment(
                moment(time).format("DD/MM/YYYY hh:mm A"),
                "DD/MM/YYYY hh:mm A"
              ).format("YYYY-MM-DD hh:mm A");
              console.log("eventDate ", eventDate);
            }}
            onCancel={() => {
              this.setState({
                isPickerVisible: false,
              });
            }}
          />
          <Loader loading={this.state.loading} />

          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              this.setModalVisible(this.state.modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={{ fontFamily: fonts.SemiBold, fontSize: 17 }}>
                  Search Location
                </Text>
                <Pressable
                  style={{
                    alignSelf: "flex-end",
                    position: "absolute",
                    marginTop: 10,
                    right: 10,
                  }}
                >
                  <Icon
                    name="close"
                    onPress={() => {
                      this.setModalVisible(false);
                    }}
                  />
                </Pressable>
                {this.GooglePlacesInput()}
              </View>
            </View>
          </Modal>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  closeIconPress = (value) => {
    console.log("index =====> ", value);
    var arrData = [];
    this.state.arrSomeOneBrings.map((data, index) => {
      if (index != value) {
        arrData.push(data);
      }
    });
    console.log(arrData);
    this.setState({
      arrSomeOneBrings: arrData,
    });
  };

  GooglePlacesInput = () => {
    return (
      <View
        style={{
          flex: 0.5,
          flexDirection: "row",
          marginTop: 0,
          borderRadius: 5,
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 0,
        }}
      >
        <View style={{ flex: 1 }}>
          <GooglePlacesAutocomplete
            enablePoweredByContainer={false}
            placeholder="Address"
            returnKeyType={"search"}
            listViewDisplayed={"auto"} // true/false/undefined
            fetchDetails={true}
            minLength={2}
            autoFocus={true}
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true
              // props.notifyChange(details.geometry.location);
              console.log("search places data ", JSON.stringify(data));
              // console.log("search places details ", JSON.stringify(details));
              console.log("location ", details.geometry.location);
              console.log("formatted_address ", details.formatted_address);
              this.setModalVisible(false);
              const location = {
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
              };
              this.setState({ location, address: details.formatted_address });
              this.marker.animateMarkerToCoordinate(location, 2);
            }}
            query={{
              key: "AIzaSyCnQCCl0vve8_3D-OIh1b7cpINpH723Fvg",
              language: "en",
              radius: 10000,
            }}
            GooglePlacesSearchQuery={{
              rankby: "distance",
            }}
            nearbyPlacesAPI="GooglePlacesSearch"
            onFail={(error) => console.log(error)}
            onNotFound={(error) => console.log(error)}
            textInputProps={{
              inputStyle: {
                marginVertical: 8,
                fontFamily: fonts.Regular,
                fontSize: 16,
                color: colors.BLACK,
              },
              inputContainerStyle: {
                borderBottomColor: colors.bottomBorderColor,
              },
            }}
            styles={{
              container: {
                borderBottomWidth: 0,
                flex: 1,
              },
              textInputContainer: {
                borderBottomWidth: 0,
              },
              textInput: {
                // backgroundColor:colors.themeColor,
                color: colors.BLACK,
                fontFamily: fonts.regular,
                fontSize: 16,
                paddingHorizontal: 0,
                borderBottomColor: colors.bottomBorderColor,
              },
            }}
          ></GooglePlacesAutocomplete>
          {/* <GooglePlacesAutocomplete
                        enablePoweredByContainer={false}
                        placeholder='Address'
                        minLength={2} // minimum length of text to search
                        autoFocus={true}
                        returnKeyType={'search'} // Can be left out for default return key 
                        listViewDisplayed={'auto'}    // true/false/undefined
                        fetchDetails={true}
                        onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                            // props.notifyChange(details.geometry.location);
                            console.log("search places data ", JSON.stringify(data));
                            // console.log("search places details ", JSON.stringify(details));
                            console.log("location ", details.geometry.location);
                            console.log("formatted_address ", details.formatted_address);
                            this.setModalVisible(false)
                            const location = {
                                latitude: details.geometry.location.lat,
                                longitude: details.geometry.location.lng
                            }
                            this.setState({ location, address: details.formatted_address })
                            this.marker.animateMarkerToCoordinate(location, 2)

                        }}
                        query={{
                            key: 'AIzaSyDZRd7CisUH6tg733-02d57hQ23B1ANR1k',
                            language: 'en',
                            radius: 10000,
                        }}
                        GooglePlacesSearchQuery={{
                            rankby: 'distance',
                        }}
                        nearbyPlacesAPI='GooglePlacesSearch'
                        onFail={(error) =>
                            console.log(error)
                        }
                        onNotFound={(error) =>
                            console.log(error)
                        }
                        textInputProps={{
                            InputComp: Input,
                            inputStyle: { marginVertical: 8, fontFamily: fonts.Regular, fontSize: 16, color: colors.headingTextColor },
                            inputContainerStyle: { borderBottomColor: colors.bottomBorderColor }
                        }}
                        styles={{
                            container: {
                                borderBottomWidth: 0,
                                flex:1,
                                backgroundColor:colors.buttonBGcolor
                            },
                            textInputContainer: {
                                borderBottomWidth: 0
                            },
                            textInput: {
                                // backgroundColor:colors.themeColor,
                                color:colors.BLACK,
                                fontFamily: fonts.regular,
                                fontSize: 16,
                                paddingHorizontal: 0,
                                borderBottomColor: colors.bottomBorderColor,
                            },

                        }}
                    /> */}
        </View>
      </View>
    );
  };

  showMap = () => {
    console.log("latitude =======> ", this.state.location.latitude);
    console.log("longitude =======> ", this.state.location.longitude);
    return (
      <View style={styles.container}>
        <MapView
          ref={(ref) => {
            this.mapView = ref;
          }}
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={{
            latitude: Number(this.state.location.latitude),
            longitude: Number(this.state.location.longitude),
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
          initialRegion={{
            latitude: Number(this.state.location.latitude),
            longitude: Number(this.state.location.longitude),
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
          zoomEnabled={true}
          minZoomLevel={10}
          maxZoomLevel={20}
          scrollEnabled={false}
        >
          <MarkerAnimated
            ref={(marker) => {
              this.marker = marker;
            }}
            // coordinate={this.state.location}
            coordinate={{
              latitude: Number(this.state.location.latitude),
              longitude: Number(this.state.location.longitude),
            }}
          />
        </MapView>
      </View>
    );
  };

  handleChange = (values) => {
    // Your logic
    console.log("slider value change ====> ", values);
  };

  showLocationOnMap = async () => {
    const latitude = await AsyncStorage.getItem("latitude");
    const longitude = await AsyncStorage.getItem("longitude");
    console.log("latitude ", latitude);
    console.log("longitude ", longitude);

    if (latitude && longitude) {
      const locationObj = {
        latitude: latitude,
        longitude: longitude,
      };
      this.setState({ location: locationObj });
      // this.mapView.animateToCoordinate(locationObj, 2000)
      this.mapView.animateCamera({
        center: {
          latitude: locationObj.latitude,
          longitude: locationObj.longitude,
        },
      });
    }
  };

  addPicture = (index) => {
    if (index == 0) {
      this.openImagePicker(this.props.navigation);
    } else {
      this.setState({ selectedIndex: index });
    }
  };

  removePicture = (index) => {
    const image = this.state.images[index];
    const arrImage = this.state.images;
    const arrNewImages = arrImage.filter((data) => data !== image);
    this.setState({ images: arrNewImages });
  };

  captureImage = async (type) => {
    // let options = {
    //   mediaType: type,
    //   maxWidth: 300,
    //   maxHeight: 550,
    //   quality: 1,
    //   videoQuality: 'low',
    //   durationLimit: 30, //Video max duration in seconds
    //   saveToPhotos: true,
    // };

    var options = {
      title: "Select Image",
      includeBase64: false,
      quality: 0.5,
      mediaType: "photo",
    };

    // let isCameraPermitted = await requestCameraPermission();
    // let isStoragePermitted = await requestExternalWritePermission();
    // if (isCameraPermitted && isStoragePermitted) {
    launchCamera(options, (response) => {
      console.log("Response = ", response);

      if (response.didCancel) {
        alert("User cancelled camera picker");
        return;
      } else if (response.errorCode == "camera_unavailable") {
        alert("Camera not available on device");
        return;
      } else if (response.errorCode == "permission") {
        alert("Permission not satisfied");
        return;
      } else if (response.errorCode == "others") {
        alert(response.errorMessage);
        return;
      }
      // console.log('base64 -> ', response.base64);
      // console.log('uri -> ', response.uri);
      // console.log('width -> ', response.width);
      // console.log('height -> ', response.height);
      // console.log('fileSize -> ', response.fileSize);
      // console.log('type -> ', response.type);
      // console.log('fileName -> ', response.fileName);
      this.setFilePath(response.assets[0]);
    });
    // }
  };

  chooseFile = (type) => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
    };
    launchImageLibrary(options, (response) => {
      console.log("Response = ", response);

      if (response.didCancel) {
        alert("User cancelled camera picker");
        return;
      } else if (response.errorCode == "camera_unavailable") {
        alert("Camera not available on device");
        return;
      } else if (response.errorCode == "permission") {
        alert("Permission not satisfied");
        return;
      } else if (response.errorCode == "others") {
        alert(response.errorMessage);
        return;
      }
      //   console.log('base64 -> ', response.base64);
      //   console.log('uri -> ', response.uri);
      //   console.log('width -> ', response.width);
      //   console.log('height -> ', response.height);
      //   console.log('fileSize -> ', response.fileSize);
      //   console.log('type -> ', response.type);
      //   console.log('fileName -> ', response.fileName);
      this.setFilePath(response.assets[0]);
    });
  };

  setFilePath(response) {
    console.log("uri -> ", response.uri);
    let arrImage = this.state.images;
    arrImage.push(response.uri);
    this.setState({
      filePath: response.uri,
      imageResponse: response,
      images: arrImage,
    });
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
          onPress: () => this.captureImage("photo"),
        },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  }

  validation = () => {
    if (this.state.title.trim().length == 0) {
      Toast.show("Please enter event title");
      return;
    } else if (this.state.address.trim().length == 0) {
      Toast.show("Please enter address");
      return;
    } else if (this.state.eventDate.trim().length == 0) {
      Toast.show("Please select date");
      return;
    } else if (this.state.details.trim().length == 0) {
      Toast.show("Please enter details");
      return;
    } else if (this.state.selected_number_of_participant.trim().length == 0) {
      Toast.show("Please enter number of participant");
      return;
    }
    // else if (this.state.invite_friend.length == 0) {
    //     Toast.show('Please add perticipant')
    //     return
    // }
    else if (this.state.mode_type == 0) {
      Toast.show("Please select event mode");
      return;
    } else {
      // Add event call
      // Toast.show('event added succfully')
      this.callAddEventApi();
    }
  };

  callAddEventApi = async () => {
    var formdata = new FormData();
    formdata.append("token", this.props.userInfo.token);
    formdata.append("event_title", this.state.title);
    formdata.append("event_address", this.state.address);
    formdata.append("lats", this.state.location.latitude);
    formdata.append("longs", this.state.location.longitude);
    // formdata.append("event_date", "2021-07-30");
    const eventDate = moment(this.state.eventDate, "DD/MM/YYYY").format(
      "YYYY-MM-DD"
    );
    console.log("eventDate ", eventDate);
    formdata.append("event_date", eventDate);
    formdata.append("event_time", this.state.eventTime);
    formdata.append("event_description", this.state.details);
    formdata.append(
      "participants_limit",
      this.state.selected_number_of_participant
    );
    formdata.append("event_mode", this.state.mode_type);
    formdata.append("event_participant", this.state.invite_friend.join(",")); //- need to discuss with Praveen
    formdata.append("invite_squad", this.state.invite_squad.join(","));
    formdata.append("invite_user", this.state.invite_friend.join(","));
    formdata.append(
      "event_chat_enabled",
      this.state.add_to_people_group_chat ? 1 : 0
    );
    // const age_range = `${this.state.minAge}-${this.state.maxAge}`
    // formdata.append("age_range",age_range);
    formdata.append("min_age", String(this.state.minAge));
    formdata.append("max_age", String(this.state.maxAge));

    if (this.state.arrSomeOneBrings.length > 0) {
      formdata.append("someone_bring", this.state.arrSomeOneBrings.join(","));
    }

    console.log("Parameter ", formdata);
    postMethod(
      null,
      "createEvent",
      formdata,
      (success) => {
        this.props.navigation.goBack();
      },
      (error) => {
        console.error("postMethod error", error);
      }
    );
  };
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.user.userInfo,
  };
};
export default connect(mapStateToProps)(AddEventComponent);

const styles = StyleSheet.create({
  passwordContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#D9D5C6",
    paddingBottom: 10,
    // marginHorizontal: 16,
  },
  inputStyle: {
    // flex: 1,
    fontSize: 16,
    fontFamily: fonts.Regular,
  },
  bottomView: {
    flexDirection: "row",
    width: "92%",
    height: 50,
    backgroundColor: "#00A551",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    right: 20,
    left: 20,
    borderRadius: 25,
  },
  textStyle: {
    color: "#fff",
    fontSize: 17,
    fontFamily: fonts.Bold,
  },
  textInputStype: {
    height: 50,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
    position: "absolute",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export function getAddressComponent(address_components, key) {
  var value = "";
  var postalCodeType = address_components.filter((aComp) =>
    aComp.types.some((typesItem) => typesItem === key)
  );
  if (postalCodeType != null && postalCodeType.length > 0)
    value = postalCodeType[0].long_name;
  return value;
}
