import React, { Component } from 'react';
import {ScrollView,Text} from 'react-native';

class SideBar extends Component {

    static propTypes = {
      onItemSelected: React.PropTypes.func.isRequired,
    };
  
    constructor(props) {
        super(props);
    }
  
    render() {
  
      return (
  
        <ScrollView scrollsToTop={false} style={styles.menu}>
  
          <Text
            onPress={() => this.props.onItemSelected('first')}
            style={styles.item}>
            First
          </Text>
  
          <Text
            onPress={() => this.props.onItemSelected('second')}
            style={styles.item}>
            Second
          </Text>
  
          <Text
            onPress={() => this.props.onItemSelected('third')}
            style={styles.item}>
            Third
          </Text>
        </ScrollView>
      );
    }
  };

  var styles = StyleSheet.create({
    menuButton: {
        marginTop: 20,
        backgroundColor: '#777'
    },
    menu: {
      flex: 1,
      width: window.width,
      height: window.height,
      padding: 20,
    },
    item: {
      fontSize: 16,
      fontWeight: '300',
      paddingTop: 20,
    },    
    page: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#777'
    },
    pageContent: {
        flex: 1,
        alignItems: 'center',
        top: 200,
    },
    menu: {
      flex: 1,
      width: window.width,
      height: window.height,
      padding: 20,
    },
    item: {
      fontSize: 16,
      fontWeight: '300',
      paddingTop: 20,
  },   
});

export default SideBar
