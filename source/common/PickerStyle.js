import {
    StyleSheet,
} from 'react-native';
import {colors} from './colors';
export default pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 3,
        // borderWidth: 1,
        // borderColor: colors.Darkgrey,
        // borderBottomWidth: 1,
        // borderColor: '#D9D5C6',
        // borderRadius: 10,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
        width:'100%'
    },
    inputAndroid: {
        fontSize: 16,
        // paddingHorizontal: 8,
        // paddingVertical: 8,
        // borderWidth: 1,
        // borderColor: colors.Darkgrey,
        // borderBottomWidth: 1,
        // borderColor: '#D9D5C6',
        // borderRadius: 10,
        color: 'black',
        width:'100%',
        // backgroundColor:'red',
    },
});