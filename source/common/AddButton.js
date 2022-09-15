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
import { fonts } from './colors';

class AddButton extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={{...this.props.style}}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={this.props.onSubmitPress}>
          <View style={{width: '90%'}}>
            <Text
              style={{
                fontSize: 14,
                textAlign: 'center',
                marginLeft: 35,
                color: 'white',
                fontFamily:fonts.Bold
              }}>
              {this.props.labelText}
            </Text>
          </View>
          <View
            style={{
              width: '10%',
            }}>
            <Image source={this.props.source} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    height:45,
    flexDirection: 'row',
    backgroundColor: 'rgb(33,31,26)',
    padding: 10,
    marginLeft: 30,
    marginRight: 30,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AddButton;
