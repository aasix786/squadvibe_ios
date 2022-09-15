import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

import {colors,fonts} from '../common/colors'

class Header extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {onPressLeft} = this.props
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.back_arrowImageContainer} onPress={onPressLeft}>
          <Image style={{width:25, height:25,resizeMode:"contain"}} source={this.props.source} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.titleTextStyle}>{this.props.title}</Text>
        </View>

        <View style={styles.leftTitleContainer}>
          <Text style={styles.leftTitleStyle}>{this.props.titleLeft}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    paddingHorizontal: 30,
    marginTop:28
  },
  back_arrowImageContainer: {
    flex: 1,
    right: 10,
  },
  titleContainer: {
    justifyContent: 'center',
    // flex: 1,
    alignItems: 'center',
  },
  titleTextStyle: {
    fontSize: 16,
    fontFamily:fonts.SemiBold,
    color:'#0D110F'
  },
  leftTitleContainer: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    left: 5,
  },
  leftTitleStyle: {
    color: 'rgb(152,147,128)',
    fontWeight: 'bold',
  },
});

export default Header;
