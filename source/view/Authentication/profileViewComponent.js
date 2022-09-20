import React, { PureComponent } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
} from "react-native";
import { colors, fonts } from "../../common/colors";
import Ripple from "react-native-material-ripple";

const WINDOW_WIDTH = Dimensions.get("window").width;

class ProfileViewComponent extends PureComponent {
  constructor() {
    super();
    this.state = {
      user: null,
    };
  }

  componentDidMount() {
    const user = this.props.route.params.user;
    console.log("user")
    console.log(user)
    this.setState({user:user});
  }

  render() {
    console.log("HAHAHHAHAHAHAHAHHAHA", this.state.user);
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <StatusBar
          backgroundColor={"transparent"}
          translucent
          barStyle="light-content"
        />

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

        <Image
          style={{ height: 300, width: "100%" }}
          source={{
            uri:
              this.state.user &&
              this.state.user.image &&
              this.state.user.image[0].image,
          }}
          resizeMode={"cover"}
        />
        <View
          style={{
            height: 70,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              height: 105,
              width: 93,
              borderRadius: 20,
              borderColor: "#4AACCD",
              borderWidth: 2,
              position: "absolute",
              zIndex: 999,
              top: -50,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
            }}
          >
            <Image
              style={{ height: 95, width: 83, borderRadius: 15 }}
              source={{
                uri:
                  this.state.user &&
                  this.state.user.image &&
                  this.state.user.image[0].image,
              }}
            />
          </View>
        </View>

        <Text
          style={{
            color: "#2D3F7B",
            fontSize: 16,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {this.state.user && this.state.user.full_name}
        </Text>
        {this.state.user && this.state.user.about == "" ? (
          false
        ) : (
          <Text
            style={{
              color: "#2D3F7B",
              fontSize: 12,
              textAlign: "center",
              width: WINDOW_WIDTH - 80,
              alignSelf: "center",
              // padding: 12,
            }}
          >
            {this.state.user && this.state.user.about && this.state.user.about}
          </Text>
        )}
         <View style={{ justifyContent: "center", alignItems: "center" ,  flexDirection: "row",
            // marginVertical: 20,
            marginHorizontal: 10,}}>
              <Image
                style={{ height: 12, width: 12,resizeMode:"contain"}}
                source={require("../../assets/marker.png")}
              />
              <Text
              style={{
                // textAlign: "center",
                paddingHorizontal:5,
                width: 200,
                // alignSelf: "center",
                // marginTop: 12,
                color: colors.lightskyblue,
                fontFamily: fonts.Bold,
                fontSize: 12,
              }}

            >
       {this.state.user && this.state.user.location && this.state.user.location}
            </Text>
            </View>
            <View style={{ justifyContent: "center", alignItems: "center" ,  flexDirection: "row",
            marginTop:5,
            marginHorizontal: 10,}}>
         
              <Text
              style={{
                textAlign: "center",
                width: 200,
                alignSelf: "center",
                // marginTop: 12,
                color: colors.lightskyblue,
                fontFamily: fonts.Bold,
                fontSize: 12,
              }}

            >
       {this.state.user && this.state.user.bio && this.state.user.bio}
            </Text>
            </View>

        <View
          style={{
            flexDirection: "row",
            marginVertical: 20,
            marginHorizontal: 20,
          }}
        >
          {this.state.user &&
            this.state.user.interest_list &&
            this.state.user.interest_list.map((interestData) => {
              return (
                <View
                  style={{
                    marginRight: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  
           
                  <Image
                    // source={require("../../assets/trackingImage.png")}
                    source={{
                      uri:interestData.image
                    }}
                    style={{ height: 46, width: 46, borderRadius: 46, resizeMode:"cover" }}
                  />

                  <Text
                    style={{
                      margin: 10,
                      fontSize: 13,
                      fontFamily: fonts.Regular,
                      paddingRight: 10,
                      paddingLeft: 10,
                    }}
                  >
                    {interestData.interest}
                  </Text>
                </View>
              );
            })}
        </View>
      </View>
    );
  }
}

export default ProfileViewComponent;

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
    width: "84%",
    height: 50,
    backgroundColor: "#00A551",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 40,
    marginHorizontal: 36,
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
  profileImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: "cover",
  },
  backButtonStyle: {
    height: 34,
    width: 34,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    position: "absolute",
    zIndex: 99,
    top: 50,
    left: 27,
  },
  linearGradient: {
    height: 72,
    width: "70%",
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
