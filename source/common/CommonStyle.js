import { StyleSheet } from 'react-native';
import { colors,fonts } from './colors'

export const commonStyle = StyleSheet.create({
    headingTextStyle : {
        fontFamily:fonts.SemiBold,
        color:colors.headingTextColor,
        fontSize:20
    }
})