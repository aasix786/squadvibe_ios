import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StatusBar,
  Image,
  TouchableOpacity,
} from "react-native";

export default function Header(props) {
  return (
    <View>
      <ImageBackground
        style={[
          { width: "100%", paddingTop: 25, height: 230 },
          props.right && {
            flexDirection: "row",
            justifyContent: "space-between",
          },
        ]}
        source={require("../../assets/homebg.png")}
        resizeMode="cover"
      >
        {props.lines ? (
          <TouchableOpacity
            style={{ marginTop: 10, marginLeft: 20 }}
            onPress={() => {}}
          >
            <Image
              style={{ resizeMode: "contain", width: 30, height: 20 }}
              source={require("../../assets/left_icon.png")}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{
              marginTop: 25,
              paddingHorizontal: 10,
              width: 40,
              height: 50,
              position: "relative",
            }}
            onPress={() =>
              props.cancle ? props.clicked() : props.back.goBack()
            }
          >
            <Image
              style={{ resizeMode: "contain", width: 30, height: 20 }}
              source={require("../../assets/back.png")}
            />
          </TouchableOpacity>
        )}

        <View
          style={
            !props.right
              ? { marginTop: -25 }
              : { position: "relative", left: "50%" }
          }
        >
          <Image
            style={{
              alignSelf: "center",
              height: 50,
              marginTop: -35,
              // width:50,
              // position:"absolute",
              // left:'50%'
            }}
            resizeMode="contain"
            source={require("../../assets/logo_bird.png")}
          />
          {props.heading && (
            <Text
              style={{
                color: "black",
                textAlign: "center",
                marginTop: 15,
                fontSize: 20,
                fontFamily: "avenir-light",
              }}
            >
              {props.heading}
            </Text>
          )}
        </View>

        {props.right && (
          <TouchableOpacity>
            <Image
              style={{
                resizeMode: "contain",
                width: 30,
                height: 20,
                marginTop: 20,
                marginRight: 10,
              }}
              source={require("../../assets/right_top.png")}
            />
          </TouchableOpacity>
        )}
      </ImageBackground>
    </View>
  );
}
//
