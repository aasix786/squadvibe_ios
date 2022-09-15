/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
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
  StatusBar
} from "react-native";

import SubmitButton from "../../common/SubmitButton";
import { colors, fonts } from "../../common/colors";
import Header from "../../common/Header";
import { SearchBar, Button } from 'react-native-elements'
import { connect } from 'react-redux';
import { setSelectedUserId } from '../../redux/Actions/SquadAction'
import Loader from '../../common/Loader';


const icon_rightArrow = require("../../assets/button_white_arrow.png");
const icon_main = require("../../assets/add_tele_ic.png");
const icon_back_arrow = require("../../assets/back_arrow.png");
const icon_user_selected = require("../../assets/tick_green.png")
const icon_user_unselected = require("../../assets/grey_tick_ic.png")
var { width } = Dimensions.get("window");

class MemberListComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      search: '',
      loading: false,
      arrSelectedUserId: [],
      arrSearchData: [],
      group_member: [],
      isFromMySquad: false,
      squad_id: '',
      isFromContact:false
    };
  }

  updateSearch = (search) => {
    this.setState({ search });
    if (search.trim().length > 0) {
      const arrSearchData = this.state.group_member.filter(data => {
        return data.full_name.includes(search) || data.phone_number.toString().includes(search) || data.email.includes(search)
      })
      this.setState({ arrSearchData })
    } else {
      this.setState({ arrSearchData: [] })
    }
  };

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      
      // do something
      
      if (this.props.route.params !== undefined) {
        const { isFromContact,isFromMySquad, group_member, squad_id } = this.props.route.params;

        if (group_member !== undefined) {
          const arrSelectedUserId = group_member.length > 0 ? group_member.map(data => data.member_id) : []
          this.setState({
            isFromMySquad,
            group_member,
            squad_id,
            arrSelectedUserId
          })
        }
        this.setState({isFromContact})
      }

      const {arrSelectedUser} = this.props
      this.setState({arrSelectedUserId:arrSelectedUser})

    });

    
  }

  componentWillUnmount() {
    this._unsubscribe();
  }



  render() {
    return (
      <SafeAreaView style={styles.container}>
        <SafeAreaView />
        <StatusBar barStyle={'default'} />
        {/*header Container Start */}
        <Header title={"Squad Member"} source={icon_back_arrow} onPressLeft={() => this.props.navigation.goBack()} />
        {/* <SearchBarExtended /> */}
        <SearchBar
          containerStyle={styles.searchcontainer}
          placeholder="Search"
          placeholderTextColor='#7B817E'
          onChangeText={this.updateSearch}
          value={this.state.search}
          inputContainerStyle={{ height: 44, borderBottomWidth: 1, backgroundColor: 'white', borderRadius: 3, borderWidth: 1, borderColor: colors.searchBorderColor }}
          inputStyle={{ color: colors.headingTextColor }}
          searchIcon={<Image source={require('../../assets/search_ic.png')} />}
        />
        {/*header Container End */}
        <View style={{ flex: 2, marginTop: 10 }}>
          <FlatList
            data={this.state.arrSearchData.length > 0 ? this.state.arrSearchData : this.state.group_member}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  style={{
                    flexDirection: "column",
                    paddingHorizontal: 8,
                    paddingVertical: 5
                  }}
                  onPress={() => {
                    // this.onPressSelectedUser(index)
                  }}
                >
                  <View style={styles.itemView}>
                    <View
                      style={{
                        flexDirection: "row",
                        paddingLeft: 10,
                        paddingRight: 10,
                        width: "85%",
                      }}
                    >
                      <Image source={{ uri: item.user_image }} style={styles.profileImg} />

                      <View
                        style={{
                          flexDirection: "row",
                          marginTop: 10,
                        }}
                      >
                        <Text style={styles.headerView}>{item.full_name}</Text>
                      </View>
                    </View>
                    {/* <View style={styles.unReadViewContainer}>
                      
                      <View style={styles.unReadMessageView}>
                        <Image source={this.state.arrSelectedUserId.includes(item.id) ? icon_user_selected : icon_user_unselected} />
                      </View>
                      
                    </View> */}
                  </View>

                  <View style={styles.lineVisibleView} />
                </TouchableOpacity>
              );
            }}
          />
        </View>
        {/* <View style={{ marginHorizontal: 20, height: 45 }}>
          
          <Button
            containerStyle={{ backgroundColor: colors.greenButton, borderRadius: 36 }}
            buttonStyle={{ backgroundColor: colors.greenButton, height: '100%' }}
            title="ADD"
            titleStyle={{
              fontSize: 15,
              fontFamily: fonts.Bold
            }}
            onPress={() => this.onPressAddUsers()}
          />
        </View> */}
        <Loader loading={this.state.loading} />

      </SafeAreaView>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(255,250,234)",
  },
  searchcontainer: {
    backgroundColor: colors.themeColor,
    borderWidth: 0, //no effect
    // shadowColor: 'white', //no effect
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    marginTop: 10,
    paddingHorizontal: 20
  },
  itemView: {
    flexDirection: "row",
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
    marginLeft: 10,
    marginRight: 10,
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
});


const mapStateToProps = (state) => {
  return {
    create_squad: state.manage_squad.create_squad,
    arrSelectedUser: state.manage_squad.arrSelectedUser,
    userInfo: state.user.userInfo
  };
};

const mapDispatchToProps = (dispatch) => {
  return ({
    setSelectedUserId: (data) => dispatch(setSelectedUserId(data)),
  })
}
export default connect(mapStateToProps, mapDispatchToProps)(MemberListComponent);