/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Keyboard,
  Image,
  StyleSheet,
} from 'react-native';
import { colors, fonts } from './colors';

class SubmitButton extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={this.props.onSubmitPress}>
          <View style={{width: '90%'}}>
            <Text
              style={{
                fontSize: 14,
                textAlign: 'center',
                // fontWeight: 'bold',
                fontFamily:fonts.Bold,
                // marginLeft: 35,
                color: 'white',
              }}>
              {this.props.labelText}
            </Text>
          </View>
          {/* <View
            style={{
              width: '10%',
            }}>
            <Image source={this.props.source} />
          </View> */}
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    backgroundColor: colors.pinkbg,
    padding: 10,
    marginLeft: 30,
    marginRight: 30,
    marginHorizontal:16,
    height:45,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SubmitButton;
