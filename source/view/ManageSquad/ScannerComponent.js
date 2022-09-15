import React, { Component } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, Image, StatusBar, SafeAreaView, View, ImageBackground } from 'react-native';
import { colors, fonts } from '../../common/colors'
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import Loader from '../../common/Loader';
import { connect } from 'react-redux'
import { setCreateSquad, setSelectedUserId } from '../../redux/Actions/SquadAction'
import Toast from 'react-native-simple-toast';
import ApiHelper from '../../Networking/NetworkCall'
import { postMethod } from '../../Networking/APIModel'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/header';


class ScannerComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isFromAddFriend: false
    }
  }

  onSuccess = e => {
    // Linking.openURL(e.data).catch(err =>
    //   console.error('An error occured', err),
    // );
    if (e.data) {
      this.getUserInfoFromQRCode(e.data)
    }
    // this.props.navigation.navigate('AddPeople', { data: e });
  };

  componentDidMount() {
    if (this.props.route.params !== undefined) {
      const { isFromAddFriend } = this.props.route.params
      this.setState({
        isFromAddFriend: isFromAddFriend == undefined ? false : isFromAddFriend
      })
    }
  }

  render() {
    return (
      <View style={{ flex: 1 ,backgroundColor:'white'}}>
          <Header heading='QRCode Scanner' back={this.props.navigation}/>
        <View style={{marginTop:-60}}>
          <QRCodeScanner
            onRead={this.onSuccess}
            reactivate={true}
            checkAndroid6Permissions
            // showMarker
            flashMode={RNCamera.Constants.FlashMode.auto}
            // cameraProps={{ barCodeTypes: ['QR_CODE','org.iso.QRCode','org.iso.PDF417']}}
            cameraProps={{ barCodeTypes: [RNCamera.Constants.BarCodeType.qr] }}
          />

        </View>
        

      </View>
    );
  }

  getUserInfoFromQRCode = async (data) => {
    var formdata = new FormData();
    formdata.append("token", this.props.userInfo.token);
    formdata.append("qr_code", data);
    ApiHelper.post('userQRCode', formdata).then(response => {
      if (response.status == 200) {
        if (response.data.status == 'SUCCESS') {
          if (response.data.hasOwnProperty('userQRCode') && response.data.userQRCode !== null) {
            const userId = response.data.userQRCode.id
            if (this.state.isFromAddFriend == true) {
              this.sentFriendRequest(userId)
            } else {
              this.props.arrSelectedUser.push(userId)
            }
            this.props.navigation.navigate('AddPeople');
          }
        } else {
          if (response.data.requestKey) {
            Toast.show(response.data.requestKey)
          }
          if (response.data.is_token_expired && Boolean(response.data.is_token_expired)) {

            resetStackAndNavigate(this.props.navigation, 'Login')
          }
        }
      }
    }).catch((error) => {
      Toast.show(error.message)
    })
  }

  sentFriendRequest = (userId) => {
    var formdata = new FormData();
    formdata.append("token", this.props.userInfo.token);
    formdata.append("user_id", userId);
    postMethod(this.props.navigation, 'sendfriendRequest', formdata, (response) => {
    }, (error) => {
      Toast.show(error.message)
    })
  }
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
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
    setCreateSquad: (data) => dispatch(setCreateSquad(data)),
    setSelectedUserId: (data) => dispatch(setSelectedUserId(data)),
  })
}
export default connect(mapStateToProps, mapDispatchToProps)(ScannerComponent);
