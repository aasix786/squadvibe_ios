import * as React from 'react';
import { Text,StyleSheet } from 'react-native';
import { colors,fonts } from './colors'
import PropTypes from 'prop-types'

export const HeadingText = (props) => {
    return (
        <Text style={props.style ? props.style : [styles.headingTextStyle,{fontFamily:props.fontFamily ? props.fontFamily : fonts.SemiBold,fontSize:props.fontSize ? props.fontSize : 17}]}>{props.title}</Text>
    );
};

HeadingText.propTypes = {
    style:PropTypes.object,
    title: PropTypes.string,
    fontFamily:PropTypes.string,
    fontSize:PropTypes.number
};

const styles = StyleSheet.create({
    headingTextStyle:{
        fontFamily:fonts.SemiBold,
        color:colors.headingTextColor,
        fontSize:HeadingText.propTypes.fontSize && 20  
    }
})