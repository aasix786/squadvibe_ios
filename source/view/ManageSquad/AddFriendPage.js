/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
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
} from 'react-native';

import SubmitButton from '../../common/SubmitButton';
import { colors, fonts, SCREEN_SIZE,resetStackAndNavigate } from '../../common/colors';
import Header from '../components/header';
import AddButton from '../../common/AddButton';
import { Dialog, Input, Button } from 'react-native-elements'
import { HeadingText } from '../../common/HeadingText'
import SimpleToast from 'react-native-simple-toast';
import ApiHelper from '../../Networking/NetworkCall';
import { connect } from 'react-redux';
import { setSelectedUserId } from '../../redux/Actions/SquadAction'
import AsyncStorage from '@react-native-async-storage/async-storage';

const icon_back_arrow = require('../../assets/back_arrow.png');
const icon_rightArrow = require('../../assets/button_white_arrow.png');
const icon_main = require('../../assets/add_tele_ic.png');
var { width } = Dimensions.get('window');

class AddPeopleComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          id: 1,
          icon: require('../../assets/add_tele_ic.png'),
          title: 'Add by telephone number',
          color: 'rgb(199,21,140)',
        },
        // {
        //   id: 2,
        //   icon: require('../../assets/qr_code_ic.png'),
        //   title: 'Add by QR Code',
        //   color: 'rgb(199,21,140)',
        // },
        // {
        //   id: 3,
        //   icon: require('../../assets/user_id_ic.png'),
        //   title: 'Add by User ID',
        //   color: 'rgb(199,21,140)',
        // },
        {
          id: 4,
          icon: require('../../assets/choose_from_contacts_ic.png'),
          title: 'Choose from contacts',
          color: 'rgb(199,21,140)',
        },
      ],

      show_add_by_user_id_popup: false,
      add_by_user_id: '',
      group_member: [],
      isFromMySquad: false,
      squad_id: '',
      title: '',
      isFromAddFriend: false,
      friends: [],
      arrUsers: ['', '', '']
    };
  }

  render() {
    const { navigation } = this.props;
    // const { isFromAddFriend} = this.props.route.params;
    // this.props.navigation.navigate('AddGroup')
    return (
      <View style={styles.container}>
        <Header 
          back ={this.props.navigation}
          heading={this.state.title == '' ? 'Add People' : this.state.title}
        />

        <View style={{ marginTop:-70 }}>
          <FlatList
            style={{ marginTop: this.state.isFromAddFriend == undefined || this.state.isFromAddFriend == false ? 20 : 90 }}
            data={this.state.data}
            keyExtractor={item => item.id}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  onPress={() => this.onPressOption(index)}
                  style={{
                    backgroundColor: colors.pinkbg,
                    width: SCREEN_SIZE.SCREEN_WIDTH / 1.5,
                    height: 125,
                    borderRadius: 20,
                    elevation:4,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    marginTop: 30,
                  }}>
                  <Image
                    style={{
                      justifyContent: 'center',
                      alignSelf: 'center',
                      bottom: 10,
                      resizeMode:"contain",
                      width:50,
                      height:45
                    }}
                    source={item.icon}
                  />
                  <Text
                    style={{
                      color: colors.white,
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontFamily: fonts.SemiBold,
                      fontSize: 16
                    }}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />

         

        </View>
        {/* {

          this.state.isFromAddFriend == undefined || this.state.isFromAddFriend == false ?

            <View style={{ marginTop: 0 }}>
              <SubmitButton
                labelText={'ACCEPT IT'}
                source={icon_rightArrow}
                onSubmitPress={() => {
                  const arrSelectedUserId = this.props.arrSelectedUser.join(',')
                  if (this.state.isFromMySquad) {
                    if (arrSelectedUserId != '') {
                      this.addMemberInSquad()
                    } else {
                      this.props.navigation.goBack()
                    }
                  } else {
                    if (arrSelectedUserId == '') {
                      SimpleToast.show('Please select at-least one member add in squad')
                      return
                    }
                    this.props.navigation.navigate('AddGroup')
                  }
                }}
              />
              <View style={{ height: 10 }}></View>
              {
                this.state.isFromMySquad ? null :
                  <AddButton
                    style ={{marginBottom:20}}
                    labelText={'ADD ANOTHER ONE'}
                    onSubmitPress={() => {
                      const arrSelectedUserId = this.props.arrSelectedUser.join(',')
                      if (this.state.isFromMySquad) {
                        // const arrSelectedUserId = this.props.arrSelectedUser.join(',')
                        if (arrSelectedUserId != '') {
                          this.addMemberInSquad()
                        } else {
                          this.props.navigation.goBack()
                        }
                      } else {
                        if (arrSelectedUserId == '') {
                          SimpleToast.show('Please select at-least one member add in squad')
                          return
                        }
                        this.props.navigation.navigate('AddGroup')
                      }
                    }}
                  />
              }
            </View> : null

        } */}
        <Dialog visible={this.state.show_add_by_user_id_popup} onback_arrowdropPress={() => {
          this.setState({ show_add_by_user_id_popup: !this.state.show_add_by_user_id_popup })
        }}>
          <View>
            {/* <HeadingText title={'Add By User ID'} style={{ marginLeft: 10, fontSize: 14, color: colors.headingTextColor, fontFamily: fonts.SemiBold }} /> */}
            <Input
              style={{ marginVertical: 10 }}
              placeholder="Add By User ID"
              placeholderTextColor={colors.txtPlaceholderColor}
              inputStyle={{ marginVertical: 5, fontFamily: fonts.Regular, fontSize: 16 }}
              inputContainerStyle={{ borderBottomColor: colors.bottomBorderColor }}
              onChangeText={(userId) => {
                this.setState({
                  add_by_user_id: userId
                })
              }}
            />
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Button
              title="ADD"
              buttonStyle={{ width: 100, backgroundColor: colors.headingTextColor }}
              onPress={() => {
                if (this.state.add_by_user_id != '') {
                  this.props.arrSelectedUser.push(this.state.add_by_user_id)
                  this.setState({ show_add_by_user_id_popup: !this.state.show_add_by_user_id_popup })
                } else {
                  SimpleToast.show('Please enter user id')
                }

              }}
            />
          </View>
        </Dialog>
      </View>
    );
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      // do something
      if (this.props.route.params != undefined) {

        const { isFromMySquad, group_member, squad_id, title, isFromAddFriend, friends } = this.props.route.params;
        const headerTitle = title == '' || title == undefined ? 'Add People' : title
        this.setState({
          isFromMySquad,
          group_member,
          squad_id,
          title: headerTitle,
          isFromAddFriend
        })

        if (this.props.route.params.hasOwnProperty('friends') && friends.length > 0) {
          this.setState({ friends })
        }
      }
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  onPressOption = index => {
    if (index === 0) {
      this.props.navigation.navigate('AddByTelephoneNumber', {
        isFromMySquad: this.state.isFromMySquad,
        group_member: this.state.group_member,
        squad_id: this.state.squad_id,
        isFromAddFriend: this.state.isFromAddFriend,
        friends: this.state.friends
      });
    } 
    
    else if(index == 1
      ){
      this.props.navigation.navigate('AddSingleFriend', {
        isFromContact: true,
        group_member: this.state.group_member,
        isFromMySquad: this.state.isFromMySquad,
        squad_id: this.state.squad_id,
        isFromAddFriend: false,
        friends:this.props.route.params.friends
      })
    }
     else {
      this.props.navigation.navigate('member_list', { group_member: this.state.group_member });
    }
  }

  addMemberInSquad = () => {
    this.setState({ loading: true })
    var formdata = new FormData();
    formdata.append("token", this.props.userInfo.token);
    formdata.append("squad_id", this.state.squad_id);
    var arrSelectedUserId = this.props.arrSelectedUser.join(',')
    formdata.append("member_id", arrSelectedUserId);


    ApiHelper.post('addMember', formdata).then(response => {
      this.setState({ loading: false })
      if (response.status == 200) {
        if (response.data.status == 'SUCCESS') {
          if (response.data.hasOwnProperty('addMember')) {
            this.addFriendsInGroupFirebase(this.props.arrSelectedUser)
            this.props.navigation.navigate('MySquad')
          }
          if (response.data.message) {
            SimpleToast.show(response.data.message)
          }
        } else {
          if (response.data.requestKey) {
            SimpleToast.show(response.data.requestKey)
          }
          if (response.data.is_token_expired && Boolean(response.data.is_token_expired)) {
            
            resetStackAndNavigate(this.props.navigation, 'Login')
          }
        }
      }
    }).catch((error) => {
      this.setState({ loading: false })
      SimpleToast.show(error.message)
    })
  }




}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  BundleText: {
    color: colors.BLACK,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 15,
    justifyContent: 'center',
  },
  Button: {
    marginRight: 30,
    height: 55,
    backgroundColor: 'green',
    justifyContent: 'flex-start',
    marginTop: 20,
    borderRadius: 25,
    marginBottom: 15,
    padding: 10,
    marginLeft: 30,
  },
});
const mapStateToProps = (state) => {
  console.log("Add Members ", state.manage_squad.arrSelectedUser);
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
export default connect(mapStateToProps, mapDispatchToProps)(AddPeopleComponent);
