import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
// import fonts from '../constants/fonts';
import {colors} from '../common/colors'

const searchIcon = require('../assets/search_ic_black.png');

class SearchBarExtended extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.back_arrowgroundStyle}>
        <Image style={styles.iconStyle} source={searchIcon} />
        <View style={{marginLeft: 5, marginRight: 10}}>
          <TextInput
            style={{
              height: 40,
              fontSize: 12,
              // fontFamily: fonts.MONT_REGULAR,
            }}
            placeholderTextColor={colors.LIGHT_GRAY}
            placeholder={'Search'}
          />
        </View>

        {/* <TouchableOpacity style={{justifyContent: 'center'}}>
            <Image style={styles.iconStyle} source={searchIcon} />
          </TouchableOpacity>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.inputStyle}
            placeholder="Search What Intrested You"
            // value={}
            // onChangeText={}
            // onEndEditing={}
          /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  back_arrowgroundStyle: {
    backgroundColor: colors.WHITE,
    margin: 10,
    borderRadius: 5,
    flexDirection: 'row',
    borderColor: colors.BORDER_COLOR,
    borderWidth: 1,
    alignItems: 'center',
  },
  inputStyle: {
    fontSize: 12,
    height: 40,
    // fontFamily: fonts.MONT_REGULAR,
  },
  iconStyle: {
    height: 18,
    width: 18,
    alignSelf: 'center',
    marginLeft: 10,
  },
});

export default SearchBarExtended;
