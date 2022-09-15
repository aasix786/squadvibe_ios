import React from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  Text,
  Image,
  View,
  StyleSheet,
  Platform,
  StatusBar,
  Dimensions,
} from "react-native";
const WINDOW_WIDTH = Dimensions.get("window").width;

import Welcome from "../view/Authentication/SplashComponent";
import Login from "../view/Authentication/LoginComponent";
import MobileNumber from "../view/Authentication/MobileNumberComponent";
import OtpComponent from "../view/Authentication/OtpComponent";
import EmailComponent from "../view/Authentication/EmailComponent";
import EmailComponentCopy from "../view/Authentication/EmailComponentCopy";
import FullNameComponent from "../view/Authentication/FullNameComponent";
import BirthDayComponent from "../view/Authentication/BirthDayComponent";
import GenderComponent from "../view/Authentication/GenderComponent";
import GenderComponentCopy from "../view/Authentication/GenderComponentCopy";
import CurrentStatusComponent from "../view/Authentication/CurrentStatusComponent";
import AddPictureComponent from "../view/Authentication/AddPictureComponent";
import ManageSquadComponent from "../view/ManageSquad/ManageSquadComponent";
import ProfileComponent from "../view/Authentication/ProfileComponent";
import ProfileViewComponent from "../view/Authentication/profileViewComponent";
import SettingComponent from "../view/Authentication/SettingComponent";
import EditProfileComponent from "../view/Authentication/EditProfileComponent";
import EventsComponent from "../view/Event/EventsComponent";
import MySquadComponent from "../view/ManageSquad/MySquadComponent";
import AddGroupComponent from "../view/ManageSquad/AddGroupComponent";
import DetermineLocationComponent from "../view/ManageSquad/DetermineLocationComponent";
import EditLocation from "../view/ManageSquad/EditLocation";

import GroupTypeComponent from "../view/ManageSquad/GroupTypeComponent";
import AddNewFriendType from "../view/Authentication/AddNewFriendType";
import AddByTelephoneNumberComponent from "../view/ManageSquad/AddByTelephoneNumberComponent";
import AddEventComponent from "../view/Event/AddEventComponent";
import DashboardComponent from "../view/Authentication/DashboardComponent";
import UserDetailComponent from "../view/Scouting/UserDetailComponent";
import ActivateScountingComponent from "../view/Authentication/ActivateScountingComponent";
import ShuffleModeComponent from "../view/Shuffle/ShuffleModeComponent";
import ShuffleDetailComponent from "../view/Shuffle/ShuffleDetailComponent";
import ShareEvent from "../view/Shuffle/ShareEvent";

import GroupInterestComponent from "../view/Authentication/GroupInterestComponent";
import GroupInterestComponentCopy from "../view/Authentication/GroupInterestComponentCopy";
import AddPeopleComponent from "../view/ManageSquad/AddPeopleComponent";
import AddFriendComponent from "../view/Chat/AddFriendComponent";
import Archived from "../view/Chat/Archived";
import ChatComponent from "../view/Chat/ChatComponent";
import InviteSinglePerson from "../view/Authentication/InviteSinglePersonComponent";
import InviteEventMembers from "../view/Authentication/inviteEventMembers";
import Chat from "../view/Chat/Chat";
import LookingForGroupComponent from "../view/Scouting/LookingForGroupComponent";
import ScannerComponent from "../view/ManageSquad/ScannerComponent";
import MemberListComponent from "../view/ManageSquad/MemberListComponent";
import MapComponent from "../view/Event/MapComponent";
import SquadListComponent from "../view/Event/SquadListComponent";
import AddByUserIdComponent from "../view/ManageSquad/AddByUserIdComponent";
import AddSquadInEVent from "../view/ManageSquad/AddSquadInEvent";
import PollComponent from "../view/Chat/PollComponent";
import AddEvent2 from "../view/Event/AddEvent2";
import AddEvent3 from "../view/Event/AddEvent3";
// import AddGroup from "../view/others/Add-Group"
import AppTracking from "../view/others/app-tracking";
import LocationActivation from "../view/others/location-activation";
import Notification from "../view/others/notification";
import AddFriendPage from "../view/ManageSquad/AddFriendPage";
import AddSingleFriend from "../view/Authentication/AddSingleFriend";
import AddSquad from "../view/ManageSquad/AddSquad";
import ChangeNumber from "../view/others/change-number";
import ChangeNumberOTP from "../view/others/change-number-otp";
import ChangeEmail from "../view/others/change-email";
import { colors, fonts, SCREEN_SIZE } from "../common/colors";
import NotificationPanel from "../view/others/notification-panel";
import ShuffleDetailComponentCopy from "../view/Shuffle/ShuffleDetailComponentCopy";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function MainStackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          headerTransparent: true,
        }}
      >
        <Stack.Screen
          name="HomeTab"
          component={HomeTab}
          initialParams={(isFromScouting = false)}
        />

        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="mobile_number" component={MobileNumber} />
        <Stack.Screen name="otp" component={OtpComponent} />

        <Stack.Screen
          name="LocationActivation"
          component={LocationActivation}
        />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="AppTracking" component={AppTracking} />

        <Stack.Screen name="email" component={EmailComponent} />
        <Stack.Screen name="emailCopy" component={EmailComponentCopy} />
        <Stack.Screen name="fullName" component={FullNameComponent} />
        <Stack.Screen name="birthday" component={BirthDayComponent} />
        <Stack.Screen name="gender" component={GenderComponent} />
        <Stack.Screen name="genderCopy" component={GenderComponentCopy} />
        <Stack.Screen
          name="current_status"
          component={CurrentStatusComponent}
        />
        <Stack.Screen name="GroupInterest" component={GroupInterestComponent} />
        <Stack.Screen
          name="GroupInterestCopy"
          component={GroupInterestComponentCopy}
        />
        <Stack.Screen name="AddPicture" component={AddPictureComponent} />
        <Stack.Screen name="NotificationPanel" component={NotificationPanel} />

        <Stack.Screen name="Setting" component={SettingComponent} />
        <Stack.Screen name="ChangeEmail" component={ChangeEmail} />
        <Stack.Screen name="ChangeNumber" component={ChangeNumber} />
        <Stack.Screen name="ChangeNumberOTP" component={ChangeNumberOTP} />
        <Stack.Screen name="ManageSquad" component={ManageSquadComponent} />
        <Stack.Screen name="Profile" component={ProfileComponent} />
        <Stack.Screen name="ProfileView" component={ProfileViewComponent} />
        <Stack.Screen name="EditProfile" component={EditProfileComponent} />
        <Stack.Screen name="Events" component={EventsComponent} />
        <Stack.Screen name="MySquad" component={MySquadComponent} />
        <Stack.Screen name="AddGroup" component={AddGroupComponent} />
        <Stack.Screen
          name="DetermineLocation"
          component={DetermineLocationComponent}
        />
        <Stack.Screen name="EditLocation" component={EditLocation} />
        <Stack.Screen name="GroupType" component={GroupTypeComponent} />
        <Stack.Screen name="AddNewFriendType" component={AddNewFriendType} />
        <Stack.Screen
          name="AddByTelephoneNumber"
          component={AddByTelephoneNumberComponent}
        />
        <Stack.Screen name="AddEvent" component={AddEventComponent} />
        <Stack.Screen name="AddEvent2" component={AddEvent2} />
        <Stack.Screen name="AddEvent3" component={AddEvent3} />
        <Stack.Screen name="Dashboard" component={DashboardComponent} />
        <Stack.Screen name="UserDetail" component={UserDetailComponent} />
        <Stack.Screen
          name="ActivateScounting"
          component={ActivateScountingComponent}
        />
        <Stack.Screen name="ShuffleMode" component={ShuffleModeComponent} />
        <Stack.Screen name="ShuffleDetail" component={ShuffleDetailComponent} />
        <Stack.Screen
          name="ShuffleDetailCopy"
          component={ShuffleDetailComponentCopy}
        />
        <Stack.Screen name="ShareEvent" component={ShareEvent} />

        <Stack.Screen name="AddPeople" component={AddPeopleComponent} />
        <Stack.Screen name="AddFriend" component={AddFriendComponent} />
        <Stack.Screen name="AddFriendPage" component={AddFriendPage} />
        <Stack.Screen name="AddSingleFriend" component={AddSingleFriend} />
        <Stack.Screen name="AddSquad" component={AddSquad} />

        <Stack.Screen name="Chat" component={ChatComponent} />
        <Stack.Screen name="Archived" component={Archived} />
        <Stack.Screen name="chat_message" component={Chat} />
        <Stack.Screen
          name="InviteSinglePerson"
          component={InviteSinglePerson}
        />
        <Stack.Screen
          name="LookingForGroup"
          component={LookingForGroupComponent}
        />
        <Stack.Screen
          name="InviteEventMembers"
          component={InviteEventMembers}
        />
        <Stack.Screen name="AddSquadInEVent" component={AddSquadInEVent} />

        <Stack.Screen name="sideMenu" component={sideMenu} />
        <Stack.Screen name="scanner" component={ScannerComponent} />
        <Stack.Screen name="member_list" component={MemberListComponent} />
        <Stack.Screen name="map" component={MapComponent} />
        <Stack.Screen name="squad_list" component={SquadListComponent} />
        <Stack.Screen name="AddByUserId" component={AddByUserIdComponent} />
        <Stack.Screen name="poll" component={PollComponent} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function sideMenu() {
  const navigation = useNavigation();
  return (
    // <Drawer.Navigator initialRouteName="Home"
    //                   drawerContent={() => <SideBar navigation={navigation}/>}
    // >
    <Drawer.Navigator initialRouteName="HomeTab">
      <Drawer.Screen name="HomeTab" component={HomeTab} />
      <Drawer.Screen name="Events" component={EventsComponent} />
    </Drawer.Navigator>
  );
}

function HomeTab() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        showLabel: false,
      }}
      screenOptions={{
    tabBarStyle: { ...tabBarStyle.boxWithShadow },
    headerShown:false
  }}
      initialRouteName="profile"
      
    >
      <Tab.Screen
        name="favourite"
        initialParams={{ isFromScouting: false }}
        component={LookingForGroupComponent}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View style={tabBarStyle.footerViewStyle}>
                <View
                  style={
                    focused
                      ? tabBarStyle.focusedViewStyle
                      : tabBarStyle.unfocusedViewStyle
                  }
                >
                  <Image
                    resizeMode={"contain"}
                    source={require("../assets/bt_home_ic.png")}
                    style={{ tintColor: "white", width: 17, height: 17 }}
                  />
                </View>
                {focused ? (
                  false
                ) : (
                  <Text style={tabBarStyle.footerTitleStyle}>Match</Text>
                )}
              </View>
            );
          },
          tabBarLabel: "Favorite",
        }}
      />

      <Tab.Screen
        name="event"
        component={EventsComponent}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View style={tabBarStyle.footerViewStyle}>
                <View
                  style={
                    focused
                      ? tabBarStyle.focusedViewStyle
                      : tabBarStyle.unfocusedViewStyle
                  }
                >
                  <Image
                    resizeMode={"contain"}
                    source={require("../assets/star.png")}
                    style={{ tintColor: "white", width: 17, height: 17 }}
                  />
                </View>
                {focused ? (
                  false
                ) : (
                  <Text style={tabBarStyle.footerTitleStyle}>Public</Text>
                )}
              </View>
            );
          },
          tabBarLabel: "Events",
        }}
      />

      <Tab.Screen
        name="profile"
        component={ShuffleModeComponent}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View style={tabBarStyle.footerViewStyle}>
                <View
                  style={
                    focused
                      ? tabBarStyle.focusedViewStyle
                      : tabBarStyle.unfocusedViewStyle
                  }
                >
                  <Image
                    resizeMode={"contain"}
                    source={require("../assets/bt_plus_ic.png")}
                    style={{ tintColor: "white", width: 17, height: 17 }}
                  />
                </View>
                {focused ? (
                  false
                ) : (
                  <Text style={tabBarStyle.footerTitleStyle}>Private</Text>
                )}
              </View>
            );
          },
          tabBarLabel: "profile",
        }}
      />

      <Tab.Screen
        name="chat"
        component={Chat}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View style={tabBarStyle.footerViewStyle}>
                <View
                  style={
                    focused
                      ? tabBarStyle.focusedViewStyle
                      : tabBarStyle.unfocusedViewStyle
                  }
                >
                  <Image
                    resizeMode={"contain"}
                    source={require("../assets/bt_chat_ic.png")}
                    style={{ tintColor: "white", width: 17, height: 17 }}
                  />
                </View>
                {focused ? (
                  false
                ) : (
                  <Text style={tabBarStyle.footerTitleStyle}>Messages</Text>
                )}
              </View>
            );
          },
          tabBarLabel: "chat",
        }}
      />

      <Tab.Screen
        name="home"
        component={DashboardComponent} /*component={HomeStackNavigator}*/
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View style={tabBarStyle.footerViewStyle}>
                <View
                  style={
                    focused
                      ? tabBarStyle.focusedViewStyle
                      : tabBarStyle.unfocusedViewStyle
                  }
                >
                  <Image
                    resizeMode={"contain"}
                    source={require("../assets/bt_profile_ic.png")}
                    style={{ tintColor: "white", width: 17, height: 17 }}
                  />
                </View>
                {focused ? (
                  false
                ) : (
                  <Text style={tabBarStyle.footerTitleStyle}>Menu</Text>
                )}
              </View>
            );
          },
          tabBarLabel: "Home",
        }}
      />
    </Tab.Navigator>
  );
}

const tabBarStyle = StyleSheet.create({
  boxWithShadow: {
    position: "absolute",
    zIndex: 999,
    bottom: 15,
    left: 30,
    right: 30,
    height: 70,
    borderRadius: 20,
    backgroundColor: colors.black,
    alignItems: "center",
    elevation: 10,
    shadowColor: "white",
    shadowOffset: { width: 10, height: 10 }, // change this for more shadow
    shadowOpacity: 0,
    shadowRadius: 3,
  },
  footerViewStyle: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  focusedViewStyle: {
    backgroundColor: "#4AACCD",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 80,
    width: 40,
    height: 40,
    // borderColor: "white",
    // borderWidth: 2,
  },
  unfocusedViewStyle: {
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 30,
  },
  footerTitleStyle: {
    color: "white",
    fontSize: 9,
    fontFamily: fonts.regular,
    bottom: 3,
  },
});

export default MainStackNavigator;
