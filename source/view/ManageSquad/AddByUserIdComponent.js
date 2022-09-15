import React, { PureComponent, Component } from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    Text,
    SafeAreaView,
    StyleSheet,
    TextInput,
    FlatList,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Keyboard,
    StatusBar
} from 'react-native';
import { colors, fonts } from '../../common/colors'
import { HeadingText } from '../../common/HeadingText'
import { CustomButtonWithLeftIcon } from '../../common/ThemeButton'
import HyperlinkedText from 'react-native-hyperlinked-text';
import { Input, Button } from 'react-native-elements'
import Toast from 'react-native-simple-toast';
import ApiHelper from '../../Networking/NetworkCall'
import { postMethod } from '../../Networking/APIModel'
import Loader from '../../common/Loader';
import { connect } from 'react-redux'
import { setCreateSquad, setSelectedUserId } from '../../redux/Actions/SquadAction'
import Header from '../components/header';

const icon_user_selected = require("../../assets/tick_green.png")
const icon_user_unselected = require("../../assets/grey_tick_ic.png")

class AddByUserIdComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            code: '',
            isCheck: false,
            phone_number: '',
            images: ['', '',],
            selectedIndex: -1,
            group_member: [],
            isFromMySquad: false,
            squad_id: '',
            arrSearchUsers: [],
            arrSelectedUserId: [],
            isFromAddFriend: false,
            alreadySentRequest: []
        }
    }
    render() {
        const { navigation } = this.props
        return (
            <TouchableWithoutFeedback style={{ flex: 1, backgroundColor: colors.white }} onPress={Keyboard.dismiss}>
                <View style={{ flex: 1, backgroundColor: colors.white }}>
                    <Header back ={this.props.navigation} heading="Add by UserId"/>
                    <View style={{ flex: 2, paddingHorizontal: 16,marginTop:-70 }}>

                        <HeadingText title={'Enter UserId'} style={{ marginLeft: 8, marginTop: 20, fontSize: 14, color: colors.black, fontFamily: fonts.SemiBold }} />
                        <View>
                            <Input
                                placeholder="Enter UserId"
                                placeholderTextColor={colors.txtPlaceholderColor}
                                inputStyle={{ marginVertical: 8, fontFamily: fonts.Regular, fontSize: 16, color: colors.black }}
                                inputContainerStyle={{ borderBottomColor: colors.black }}
                                // keyboardType={'phone-pad'}
                                onChangeText={(name) => {
                                    if (name.trim() == '') {
                                        this.setState({
                                            arrSearchUsers: []
                                        })
                                    } else {
                                        this.findUserByName(name)
                                    }
                                }}
                            />

                            {/* <HeadingText title={'OR'} style={{ textAlign: 'center', color: colors.headingTextColor, fontFamily: fonts.SemiBold }} />
                            <Button
                                containerStyle={{ marginTop: 20 }}
                                title={'CHOOSE FROM CONTACTS'}
                                icon={<Image source={require('../../assets/choose_from_contacts_ic.png')} style={{ marginHorizontal: 15 }} />}
                                titleStyle={{ marginHorizontal: 25, fontFamily: fonts.Bold, fontSize: 15 }}
                                buttonStyle={{ height: 45, backgroundColor: colors.greenButton, borderRadius: 36.5, justifyContent: 'flex-start' }}
                                onPress={() => this.props.navigation.navigate('InviteSinglePerson', {
                                    isFromContact: true,
                                    group_member: this.state.group_member,
                                    isFromMySquad: this.state.isFromMySquad,
                                    squad_id: this.state.squad_id
                                })}
                            /> */}

                        </View>
                        <View style={{ marginTop: 30, flex: 1, marginHorizontal: 0 }}>
                            <FlatList
                                data={this.state.arrSearchUsers}
                                // data={['','','','','','','']}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item, index }) => {
                                    return (
                                        <TouchableOpacity
                                            style={{
                                                flexDirection: "column",
                                                paddingHorizontal: 8,
                                                paddingVertical: 5
                                            }}
                                            onPress={() => {
                                                this.onPressSelectedUser(index)
                                                // if (this.state.arrSearchUsers.length > 0) {
                                                //     this.props.arrSelectedUser.push(this.state.arrSearchUsers[0].id)
                                                //     this.props.navigation.navigate('AddPeople',
                                                //         {
                                                //             selected_user_id: this.state.arrSearchUsers[0].id
                                                //         })
                                                // }
                                            }}
                                        >
                                            <View style={styles.itemView}>
                                                <View
                                                    style={{
                                                        flexDirection: "row",
                                                        paddingLeft: 10,
                                                        paddingRight: 10,
                                                        width: "85%",
                                                    }}
                                                >
                                                    <Image source={{ uri: item.profile_image }} style={styles.profileImg} />

                                                    <View
                                                        style={{
                                                            flexDirection: "row",
                                                            marginTop: 10,
                                                        }}
                                                    >
                                                        <Text style={styles.headerView}>{item.full_name}</Text>
                                                    </View>
                                                </View>
                                                {this.state.isFromAddFriend == false ?
                                                    <View style={styles.unReadViewContainer}>
                                                        {/* {item.iconTick && ( */}
                                                        <View style={styles.unReadMessageView}>
                                                            <Image source={this.state.arrSelectedUserId.includes(item.id) ? icon_user_selected : icon_user_unselected} />
                                                        </View>
                                                        {/* )} */}
                                                    </View>
                                                    :
                                                    this.state.alreadySentRequest.includes(item.id) || item.is_friend == 1 ? null :
                                                        <TouchableOpacity style={{ marginTop: 8, paddingHorizontal: 10, height: 30, backgroundColor: colors.greenButton }}
                                                            onPress={() => {
                                                                this.sentFriendRequest(item.id)
                                                                var alreadySentRequest = this.state.alreadySentRequest
                                                                alreadySentRequest.push(item.id)
                                                                this.setState({
                                                                    alreadySentRequest: alreadySentRequest
                                                                })
                                                            }}
                                                        >
                                                            <Text style={{ height: '100%', marginTop: 3, fontFamily: fonts.Bold, fontSize: 14, color: 'white' }}>ADD</Text>
                                                        </TouchableOpacity>
                                                }
                                            </View>

                                            <View style={styles.lineVisibleView} />
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                        </View>
                    </View>

                    {this.state.arrSearchUsers.length > 0 ?
                        this.state.isFromAddFriend ? null :
                            <Button
                                style={{ marginHorizontal: 20 }}
                                containerStyle={{ marginBottom: 20,paddingHorizontal:15 }}
                                title={'ADD'}
                                titleStyle={{ fontFamily: fonts.Bold, fontSize: 17 }}
                                buttonStyle={{ height: 45, backgroundColor: colors.pinkbg, borderRadius: 36.5 }}
                                onPress={() => {
                                    const userIds = this.state.arrSelectedUserId
                                    if (userIds.length > 0) {
                                        this.state.arrSelectedUserId.map(data => {
                                            if (this.props.arrSelectedUser.includes(data)) {
                                            } else {
                                                this.props.arrSelectedUser.push(data)
                                            }
                                        })
                                        this.props.navigation.navigate('AddPeople', {
                                            selected_user_id: userIds
                                        })
                                    }
                                }}
                            />
                        : null} 



                </View>
            </TouchableWithoutFeedback>
        )
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            // do something
            if (this.props.route.params != undefined) {
                const { friends,isFromMySquad, group_member, squad_id, isFromAddFriend } = this.props.route.params;
                this.setState({
                    isFromMySquad,
                    group_member,
                    squad_id,
                    isFromAddFriend: isFromAddFriend == undefined ? false : isFromAddFriend
                    
                })
                if(friends && friends.length > 0){
                    const Ids = friends.map(data => data.user_id)
                    this.setState({
                        alreadySentRequest:Ids
                    })
                }
            }
        });
    }

    componentWillUnmount() {
        this._unsubscribe();
    }


    findUserByName = name => {
        var parameter = new FormData();
        parameter.append("token", this.props.userInfo.token);
        parameter.append("user_name", name);

        postMethod(this.props.navigation,'findByUserName', parameter, (response) => {
            if (response.hasOwnProperty('findByUserName')) {
                // Keyboard.dismiss()
                this.setState({
                    arrSearchUsers: response.findByUserName
                })
            }
        }, (error) => {
            Toast.show(error.message)
        })
    }

    onPressSelectedUser = (index) => {
        let userId = this.state.arrSearchUsers[index].id
        let arrSelectedUserId = this.state.arrSelectedUserId
        if (arrSelectedUserId.includes(userId)) {
            const data = arrSelectedUserId.filter(data => data != userId)
            this.setState({
                arrSelectedUserId: data
            })
        } else {
            arrSelectedUserId.push(userId)
            this.setState({
                arrSelectedUserId
            })
        }
    }

    sentFriendRequest = (userId) => {
        var formdata = new FormData();
        formdata.append("token", this.props.userInfo.token);
        formdata.append("user_id", userId);
        postMethod(this.props.navigation,'sendfriendRequest', formdata, (response) => {
        }, (error) => {
            Toast.show(error.message)
        })
    }
}

const mapStateToProps = (state) => {
    console.log("redux state", state);
    return {
        create_squad: state.manage_squad.create_squad,
        arrSelectedUser: state.manage_squad.arrSelectedUser,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = (dispatch) => {
    return ({
        setCreateSquad: (data) => dispatch(setCreateSquad(data)),
        setSelectedUserId: (data) => dispatch(setSelectedUserId(data)),
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(AddByUserIdComponent)

const styles = StyleSheet.create({
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
        width: '92%',
        height: 50,
        backgroundColor: '#00A551',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        right: 20,
        left: 20,
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
    },
    itemView: {
        flexDirection: "row",
        borderRadius: 10,
        marginBottom: 10,
    },
    profileImg: {
        width: 40,
        height: 40,
        borderRadius: 40 / 2,
        resizeMode: "cover",
    },

    headerView: {
        fontSize: 14,
        marginLeft: 10,
        fontWeight: "bold",
    },
    lineVisibleView: {
        flex: 1,
        flexDirection: "row",
        height: 1,
        backgroundColor: colors.BORDER_COLOR,
        marginLeft: 10,
        marginRight: 10,
    },
    unReadViewContainer: {
        flexDirection: "column",
        justifyContent: "flex-start",
        paddingTop: 5,
        width: "15%",
        fontSize: 8,
        color: colors.GRAY,
    },
    unReadMessageView: {
        width: 20,
        height: 20,
        borderRadius: 20 / 2,
        margin: 5,
        marginTop: 5,
        marginLeft: 20,
        justifyContent: "center",
    },
});