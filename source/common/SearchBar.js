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
import {colors} from '../common/colors';

const searchIcon = require('../assets/search_ic_black.png');

class SearchBar extends Component {
  constructor(props) {
    super(props);
  }

  // render() {
  //   return (
  //     <View style={styles.back_arrowgroundStyle}>
  //       <Image style={styles.iconStyle} source={searchIcon} />
  //       <View style={{marginLeft: 5, marginRight: 10}}>
  //         <TextInput
  //           style={{
  //             height: 40,
  //             fontSize: 12,
  //             // fontFamily: fonts.MONT_REGULAR,
  //           }}
  //           placeholderTextColor={colors.LIGHT_GRAY}
  //           placeholder={'Search'}
  //         />
  //       </View>
  //     </View>
  //   );
  // }

  render() {
    return (
      <SearchBar
        containerStyle={styles.searchcontainer}
        placeholder="Type in Zip or City"
        placeholderTextColor='#7B817E'
        // onChangeText={this.updateSearch}
        // value={this.state.search}
        inputContainerStyle={{ borderBottomWidth: 1, backgroundColor: 'white', borderRadius: 3, borderWidth: 1, borderColor: colors.searchBorderColor }}
        inputStyle={{ color: colors.headingTextColor }}
        // searchIcon={<Image source={require('../../assets/search_ic.png')} />}
        searchIcon={<Image source={require('../assets/search_ic.png')} />}
      />
    )
  }

  
}

const styles = StyleSheet.create({
  back_arrowgroundStyle: {
    backgroundColor: colors.WHITE,
    marginLeft: 30,
    marginRight: 30,
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

export default SearchBar;
