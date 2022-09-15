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
  Dimensions,
  StatusBar,
  ImageBackground,
} from "react-native";
import { colors, fonts } from "../../common/colors";
import { HeadingText } from "../../common/HeadingText";
import { CustomButtonWithLeftIcon } from "../../common/ThemeButton";
import HyperlinkedText from "react-native-hyperlinked-text";
import { CheckBox } from "react-native-elements";
import { connect } from "react-redux";
import { setGender } from "../../redux/Actions/UserAction";
import Toast from "react-native-simple-toast";
import Ripple from "react-native-material-ripple";

const WINDOW_WIDTH = Dimensions.get("window").width;

class GenderComponent extends PureComponent {
  constructor() {
    super();
    this.state = {
      code: "",
      isCheck: false,
      birthDate: "",
      genders: ["Male", "Female", "Others"],
      selectedIndex: 3,
      selectedGenderType: "", //1=Male, 2= Female , 3=Othwe
      // images:[
      //     require('../../assets/male_ic_h.png'),
      //     require('../../assets/femail_ic.png'),
      //     require('../../assets/others_ic.png')
      // ]
    };
  }

  componentDidMount() {
    this.props.navigation.addListener("focus", () => {
      const isFromManageSquad = this.props.route.params?.isFromManageSquad;
      const data = this.props.route.params?.data;
      if (isFromManageSquad) {
        if (data == "Male Group") {
          this.setState({ selectedIndex: 0 });
        } else if (data == "Female Group") {
          this.setState({ selectedIndex: 1 });
        } else {
          this.setState({ selectedIndex: 2 });
        }
      }
    });
  }
  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
        <StatusBar
          backgroundColor={"transparent"}
          translucent
          barStyle="light-content"
        />
        <View>
          <ImageBackground
            source={require("../../assets/genderHeader.png")}
            style={{ width: WINDOW_WIDTH, height: 250, marginTop: -1 }}
            resizeMode={"stretch"}
          >
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
          </ImageBackground>
        </View>
        <View style={{ flex: 2 }}>
          <View style={{ flex: 1, marginTop: 45 }}>
            <FlatList
              data={this.state.genders}
              keyExtractor={(index) => index.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      selectedIndex: index,
                      selectedGenderType: index,
                    })
                  }
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.barStyle,
                      {
                        borderColor:
                          this.state.selectedIndex == index
                            ? "#3c766f"
                            : colors.black,
                        backgroundColor:
                          this.state.selectedIndex == index
                            ? "#3c766f"
                            : colors.white,
                      },
                    ]}
                  >
                    {/* {index == 0 ? (
                      <Image
                        style={{
                          resizeMode: "contain",
                          width: 35,
                          height: 35,
                        }}
                        source={require("../../assets/male.png")}
                      />
                    ) : index == 1 ? (
                      <Image
                        style={{
                          resizeMode: "contain",
                          width: 35,
                          height: 35,
                        }}
                        source={require("../../assets/female.png")}
                      />
                    ) : (
                      <Image
                        style={{
                          resizeMode: "contain",
                          width: 35,
                          height: 35,
                        }}
                        source={require("../../assets/others.png")}
                      />
                    )} */}

                    <Text
                      style={[
                        styles.barTextStyle,
                        {
                          color:
                            this.state.selectedIndex == index
                              ? colors.white
                              : colors.black,
                        },
                      ]}
                    >
                      {item}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.bottomView}
          activeOpacity={0.5}
          onPress={() => {
            if (this.state.selectedGenderType.length == 0) {
              Toast.show("Please select gender");
            } else if (this.props.route.params?.isFromManageSquad) {
              this.props.navigation.navigate("ManageSquad", {
                isFromGender: true,
                gender: this.state.selectedIndex,
              });
            } else {
              this.props.setGender(this.state.selectedGenderType);
              this.props.navigation.navigate("current_status");
            }
          }}
        >
          <Text style={styles.textStyle}>Next</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  console.log("redux state", state.user);
  return {
    gender: state.user.gender,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setGender: (data) => dispatch(setGender(data)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(GenderComponent);

const styles = StyleSheet.create({
  backButtonStyle: {
    height: 34,
    width: 34,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    top: 70,
    left: 25,
  },
  bottomView: {
    flexDirection: "row",
    height: 46,
    width: WINDOW_WIDTH - 60,
    alignSelf: "center",
    backgroundColor: "#3c766f",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    borderRadius: 30,
  },
  barStyle: {
    flexDirection: "row",
    height: 45,
    width: WINDOW_WIDTH - 60,
    borderRadius: 30,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2.5,
    marginBottom: 20,
  },
  barTextStyle: {
    fontFamily: fonts.Medium,
    fontSize: 12,
    paddingBottom: 1.5,
  },
  textStyle: {
    color: "#fff",
    fontSize: 18,
    fontFamily: fonts.Bold,
    paddingBottom: 3,
  },
});
