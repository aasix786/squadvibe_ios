import React, { PureComponent } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  StatusBar,
  ImageBackground,
} from "react-native";
import { colors, fonts } from "../../common/colors";
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
      selectedGenderType: "", //1=Male, 2= Female , 3=Others
    };
  }

  componentDidMount() {
    const gender = this.props.route.params.gender;
    if (gender == "Male") {
      this.setState({ selectedIndex: 0, selectedGenderType: "0" });
    } else if (gender == "Female") {
      this.setState({ selectedIndex: 1, selectedGenderType: "1" });
    } else {
      this.setState({ selectedIndex: 2, selectedGenderType: "2" });
    }
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
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
            this.props.navigation.goBack();
          }}
        >
          <Text style={styles.textStyle}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default GenderComponent;

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
