
import React, { PureComponent } from "react";
import { View, StyleSheet,Image } from "react-native";
import PropTypes from 'prop-types';
import RNPickerSelect from "react-native-picker-select";
import PickerStyle from './PickerStyle';

export default class DropDownComponent extends PureComponent {

    constructor(props) {
        super(props);
    }

    render() {
        return (

            <View style={[styles.passwordContainer, { width: '100%' }]}>
                <RNPickerSelect
                    style={PickerStyle}
                    value={this.props.defaultValue}
                    placeholder={{
                        label: this.props.placeholderTitle ? this.props.placeholderTitle : "Select",
                        value: "",
                        color: this.props.hasOwnProperty('placeholderColor') ? this.props.placeholderColor : "#8D8B82",
                    }}
                    useNativeAndroidPickerStyle={false}
                    onValueChange={(value) => this.props.hasOwnProperty('onChangeValue') ? this.props.onChangeValue(value) : null}
                    items={this.props.data.map(data => {
                        return { label: data, value: data }
                    })
                    }
                    Icon={() =>
                        <Image source={require('../assets/phone_dropdown_ic.png')} style={{ marginVertical: 20, justifyContent: 'center', alignItems: 'center' }} />
                    }
                />

            </View>
        );
    }
}

DropDownComponent.propTypes = { 
    defaultValue:PropTypes.string.isRequired,
    placeholderTitle: PropTypes.string.isRequired, 
    placeholderColor: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    onChangeValue: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
    dropdownStyle: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
    passwordContainer: {
        // flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: '#D9D5C6',
    }
})