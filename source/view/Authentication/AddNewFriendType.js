import React, { PureComponent, Component } from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    Text,
    SafeAreaView,
    StyleSheet,
    FlatList
} from 'react-native';
import { colors, fonts } from '../../common/colors'

export default class AddNewFriendType extends PureComponent {

    constructor() {
        super()
        this.state = {
            code: '',
            isCheck: false,
            birthDate: '',
            groupType: ['Add by telephone number', 'Add by QR Code', 'Add by User ID'],
            selectedIndex: -1,
            search: '',
        }
    }


    render() {
        return (
            <View style={{ flex: 1, backgroundColor: colors.themeColor }}>
                <View style={{ paddingHorizontal: 16 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity>
                            {/* <Image source={require('../../assets/phone_ic_2.png')}/> */}
                            <Image style={{width:25, height:25,resizeMode:"contain"}} source={require('../../assets/back_arrow.png')} />
                        </TouchableOpacity>
                        <Text style={{ flex: 1, alignSelf: 'center', textAlign: 'center', color: '#242E40', fontFamily: fonts.SemiBold, fontSize: 17 }}>
                            Add a new friend</Text>
                    </View>

                    <View style={{ marginTop: 100 }}>
                        <FlatList
                            contentContainerStyle={{flexGrow:1,paddingBottom:120}}
                            style={{ marginHorizontal: 20 }}
                            data={this.state.groupType}
                            keyExtractor={index => index.toString()}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    onPress={() => this.setState({ selectedIndex: index })}
                                    style={{ marginVertical: 10, borderRadius: 3, backgroundColor: '#C7158C', height: 147, justifyContent: 'center', alignItems: 'center' }}>
                                    {(index == 0) ?
                                        <Image source={require('../../assets/add_tele_ic.png')} />
                                        : (index == 1) ?
                                            <Image source={require('../../assets/qr_code_ic.png')} />
                                        :
                                            <Image source={require('../../assets/user_id_ic.png')} />
                                    }

                                    <Text style={{ marginTop: 13, fontSize: 14, fontFamily: fonts.SemiBold, color: 'white'}}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.bottomView} activeOpacity={0.5}>

                    <Text style={styles.textStyle}>Next</Text>
                    <Image source={require('../../assets/button_white_arrow.png')} style={{
                        position: 'absolute',
                        right: 20,
                        top: 18
                    }} />

                </TouchableOpacity>


            </View>
        )
    }
}

const styles = StyleSheet.create({
    searchcontainer: {
        backgroundColor: colors.themeColor,
        borderWidth: 0, //no effect
        // shadowColor: 'white', //no effect
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent'
    },
    passwordContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: '#D9D5C6',
        paddingBottom: 10,
        // marginHorizontal: 16,
    },
    inputStyle: {
        // flex: 1,
        fontSize: 16,
        fontFamily: fonts.Regular
    },
    bottomView: {
        flexDirection: 'row',
        // width: '92%',
        height: 45,
        backgroundColor: '#00A551',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        right: 36,
        left: 36,
        borderRadius: 25
    },
    textStyle: {
        color: '#fff',
        fontSize: 17,
        fontFamily: fonts.Bold
    },
    textInputStype: {
        height: 50,
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1
    }
})