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
import { colors, fonts,resetStackAndNavigate } from '../../common/colors'
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/header';

const icon_user_selected = require("../../assets/tick_green.png")
const icon_user_unselected = require("../../assets/grey_tick_ic.png")

class AddByTelephoneNumberComponent extends Component {

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
            alreadySentRequest:[]
        }
    }
    render() {
        const { navigation } = this.props
        return (
            <TouchableWithoutFeedback style={{ flex: 1, backgroundColor: colors.white }} onPress={Keyboard.dismiss}>
                <View style={{ flex: 1, backgroundColor: colors.white }}>
                <Header back = {this.props.navigation} heading="Add by telephone number"/>
                    <View style={{ flex: 2, paddingHorizontal: 16 }}>

                        <View>
                            <Text style={{marginLeft:25,fontSize:18,marginBottom:10}}>Enter Phone Number</Text>
                            <Input
                                placeholder="923456789000"
                                placeholderTextColor={colors.txtPlaceholderColor}
                                inputStyle={{ marginVertical: 8, fontFamily: fonts.regular,borderRadius:10, fontSize: 18, color: colors.black }}
                                inputContainerStyle={{ elevation:2,paddingHorizontal:15,borderRadius:15 }}
                                keyboardType={'numeric'}
                                returnKeyLabel='Done'
                                returnKeyType='done'
                                onChangeText={(phone_number) => {
                                    console.log('phone_number ', phone_number);
                                    this.setState({phone_number})
                                }}
                            />
                            <HeadingText title={'OR'} style={{ textAlign: 'center', color: colors.headingTextColor, fontFamily: fonts.SemiBold }} />
                        </View>
                        <View style={{ marginTop: 50, flex: 1, marginHorizontal: 10 }}>
                            <FlatList
                                data={this.state.arrSearchUsers}
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
                                                if (this.state.isFromAddFriend == false) {
                                                    this.onPressSelectedUser(index)
                                                }

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
                                                    <TouchableOpacity style={{ width: 80, height: 30, backgroundColor: colors.greenButton }}
                                                    onPress={() => {
                                                        this.sentFriendRequest(item.id)
                                                        var alreadySentRequest = this.state.alreadySentRequest
                                                        alreadySentRequest.push(item.id)
                                                        this.setState({
                                                            alreadySentRequest:alreadySentRequest
                                                        })
                                                    }}
                                                    >
                                                        <Text style={{ height: '100%', marginHorizontal: 15, marginTop: 3, fontFamily: fonts.Bold, fontSize: 14, color: 'white' }}>
                                                            ADD</Text>
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

                    {/* <Button
                            containerStyle={{ marginTop: 0,paddingHorizontal:25 }}
                            title={'CHOOSE FROM CONTACTS'}
                            icon={<Image source={require('../../assets/choose_from_contacts_ic.png')} style={{ position:"absolute", left:15 }} />}
                            titleStyle={{  fontFamily: fonts.Bold, fontSize: 15, textAlign:"center" }}
                            buttonStyle={{ height: 45, backgroundColor: colors.pinkbg, borderRadius: 36.5,display:"flex", justifyContent: 'center' }}
                            onPress={() => this.props.navigation.navigate('InviteSinglePerson', {
                                isFromContact: true,
                                group_member: this.state.group_member,
                                isFromMySquad: this.state.isFromMySquad,
                                squad_id: this.state.squad_id,
                                isFromAddFriend: this.state.isFromAddFriend,
                                friends:this.state.alreadySentRequest
                            })}
                    /> */}
                        <Button
                            style={{ marginHorizontal: 20,paddingHorizontal:25 }}
                            containerStyle={{ marginTop: 20,marginBottom:15,paddingHorizontal:25 }}
                            title={'ADD'}
                            titleStyle={{ fontFamily: fonts.Bold, fontSize: 17 }}
                            buttonStyle={{ height: 45, backgroundColor: colors.pinkbg, borderRadius: 36.5 }}
                            onPress={() => {
                                this.sendNumber()
                            }}
                        />

                </View>
            </TouchableWithoutFeedback>
        )
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            // do something
            if (this.props.route.params != undefined) {
                const { isFromMySquad, group_member, squad_id, isFromAddFriend,friends } = this.props.route.params;
                this.setState({
                    isFromMySquad,
                    group_member,
                    squad_id,
                    isFromAddFriend: isFromAddFriend == undefined ? false : isFromAddFriend
                })

                if(friends && friends.length > 0){
                    const ids = friends.map(data => data.user_id)
                    this.setState({ alreadySentRequest: ids })
                }
            }
            const arrSelectedUserId = this.props.arrSelectedUser
            this.setState({ arrSelectedUserId: arrSelectedUserId })

            
        });
    }

    componentWillUnmount() {
        this._unsubscribe();
    }


    userSearchByNumber = phone_number => {
        var parameter = new FormData();
        parameter.append("phone_number", phone_number);
        postMethod(this.props.navigation,'searchNumber', parameter, (response) => {
            console.log("searchNumber response ", response);
            if (response.hasOwnProperty('searchNumber')) {
                this.setState({
                    arrSearchUsers: response.searchNumber
                })
            }
        }, (error) => {
            Toast.show(error.message)
        })
    }


    findUserByNumber = phone_number => {
        var parameter = new FormData();
        parameter.append("token", this.props.userInfo.token);
        parameter.append("phone_number", phone_number);

        ApiHelper.post('getInfoByNumber', parameter)
            .then(response => {
                console.log(response);
                this.setState({ loading: false })
                if (response.status == 200) {
                    console.log("response ", JSON.stringify(response));
                    if (response.data.status == 'SUCCESS') {
                        // alert(JSON.stringify(response.data.getInfoByNumber))
                        if (response.data.hasOwnProperty('getInfoByNumber')) {
                            Toast.show('user found')
                            Keyboard.dismiss()
                            this.setState({
                                arrSearchUsers: [response.data.getInfoByNumber]
                            })
                        }
                    } else {
                        console.error(response.data.requestKey);
                        // if (response.data.requestKey) {
                        //     Toast.show(response.data.requestKey)
                        // }
                        if (response.data.is_token_expired && Boolean(response.data.is_token_expired)) {
                            
                            resetStackAndNavigate(this.props.navigation,'Login')
                        }
                    }
                }
            }).catch((error) => {
                this.setState({ loading: false })
                console.error(error);
                Toast.show(error.message)
            })
    }

    onPressSelectedUser = (index) => {
        let userId = this.state.arrSearchUsers[index].id
        // console.log("userId ",userId);
        let arrSelectedUserId = this.state.arrSelectedUserId
        if (arrSelectedUserId.includes(userId)) {
            // console.log("already selected");
            const data = arrSelectedUserId.filter(data => data != userId)
            //   const selectedUser = this.props.arrSelectedUser.filter(data => data != userId)
            //   this.props.setSelectedUserId(selectedUser)
            console.log(data);
            this.setState({
                arrSelectedUserId: data
            })
        } else {
            // console.log("selected");
            arrSelectedUserId.push(userId)
            this.setState({
                arrSelectedUserId
            })
            //   this.props.arrSelectedUser.push(userId)
        }
    }

    sendNumber  = () => {

        if(this.state.phone_number != this.props.userInfo.phone_number){
            var formdata = new FormData();
            console.log("phone numberrr =====", this.state.phone_number)
            formdata.append("token", this.props.userInfo.token);
            formdata.append("phone_number", this.state.phone_number);
            postMethod(this.props.navigation,'sendfriendRequestByNumber', formdata, (response) => {
                console.log("sendfriendRequestByNumber = ", JSON.stringify(response));
                Toast.show("Friend request sent Successfully.")
            }, (error) => {
                if(error.requestKey==='Number does not exist')
                {
                    Toast.show('Please enter the correct number')
                }
                console.error("error = ", JSON.stringify(error));
                Toast.show(error.message)
            })
        }else{
            alert("You cannot add your number")
        }
    }

    sentFriendRequest = (userId) => {
        var formdata = new FormData();
        formdata.append("token", this.props.userInfo.token);
        formdata.append("user_id", userId);
        postMethod(this.props.navigation,'sendfriendRequest', formdata, (response) => {
            console.log("response ===> ", JSON.stringify(response));
        }, (error) => {
            console.error("error ===> ", JSON.stringify(error));
            Toast.show(error.message)
        })
    }
}

const mapStateToProps = (state) => {
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
export default connect(mapStateToProps, mapDispatchToProps)(AddByTelephoneNumberComponent)

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