import React, { PureComponent, Component } from 'react';
import { View } from "react-native";
import { Dialog } from 'react-native-elements'
import {colors} from './colors';

export default class Loader extends PureComponent{

    constructor(props){
        super(props)
    }

    render(){
        const {loading} = this.props
        return (
            <View>
                <Dialog isVisible={loading}
                    onback_arrowdropPress={() => this.props.loading = !this.props.loading}
                    overlayStyle={{ width: 100, height: 100, justifyContent: 'center', alignItems: 'center' }}
                >
                    <Dialog.Loading loadingProps={{ color: colors.themeColor }} />
                </Dialog>
            </View>
        )
    }
}