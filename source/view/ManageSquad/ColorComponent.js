import React, { Component } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { ColorWheel } from 'react-native-color-wheel';

const ColorComponent = ({onChange}) => (
  <View style={{flex: 1}}>
    <ColorWheel
      initialColor="#ee0000"
      onColorChange={color => console.log({color})}
      onColorChangeComplete={color => onChange(color)}
      style={{width: Dimensions.get('window').width}}
      thumbStyle={{ height: 30, width: 30, borderRadius: 30}}
    />
  </View>
);