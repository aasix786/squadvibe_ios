/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar
} from "react-native";

import SubmitButton from "../../common/SubmitButton";
import { colors, fonts,resetStackAndNavigate } from "../../common/colors";
import Header from "../../common/Header";
import { SearchBar, Button } from 'react-native-elements'
import { connect } from 'react-redux';
import { setSelectedUserId } from '../../redux/Actions/SquadAction'
import ApiHelper from '../../Networking/NetworkCall'
import Loader from '../../common/Loader';
import Toast from 'react-native-simple-toast'


const icon_rightArrow = require("../../assets/button_white_arrow.png");
const icon_main = require("../../assets/add_tele_ic.png");
const icon_back_arrow = require("../../assets/back_arrow.png");
const icon_user_selected = require("../../assets/tick_green.png")
const icon_user_unselected = require("../../assets/grey_tick_ic.png")
var { width } = Dimensions.get("window");

class SquadListComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            search: '',
            loading: false,
            arrSquad: [],
            arrSelectedUserId: [],
            arrSearchData: [],
            group_member: [],
            isFromMySquad: false,
            squad_id: '',
            isFromContact: false
        };
    }

    updateSearch = (search) => {
        this.setState({ search });
        if (search.trim().length > 0) {
            const arrSearchData = this.state.arrSquad.filter(data => {
                return data.squad_name.includes(search)
            })
            this.setState({ arrSearchData })
        } else {
            this.setState({ arrSearchData: [] })
        }
    };

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {

            // do something
            this.getMySquad()
            console.log("route.params ", this.props.route.params);
        });


    }

    componentWillUnmount() {
        this._unsubscribe();
    }





    render() {
        return (
            <SafeAreaView style={styles.container}>
                <SafeAreaView />
                <StatusBar barStyle={'default'} />
                {/*header Container Start */}
                <Header title={"Squad list"} source={icon_back_arrow} onPressLeft={() => this.props.navigation.goBack()} />
                {/* <SearchBarExtended /> */}
                <SearchBar
                    containerStyle={styles.searchcontainer}
                    placeholder="Search"
                    placeholderTextColor='#7B817E'
                    onChangeText={this.updateSearch}
                    value={this.state.search}
                    inputContainerStyle={{ height: 44, borderBottomWidth: 1, backgroundColor: 'white', borderRadius: 3, borderWidth: 1, borderColor: colors.searchBorderColor }}
                    inputStyle={{ color: colors.headingTextColor }}
                    searchIcon={<Image source={require('../../assets/search_ic.png')} />}
                />
                {/*header Container End */}
                <View style={{ flex: 2, marginTop: 10 }}>
                    <FlatList
                        data={this.state.arrSearchData.length > 0 ? this.state.arrSearchData : this.state.arrSquad}
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
                                            <Image source={{ uri: (item.squad_image && item.squad_image.length > 0) ? item.squad_image[0].squad_image : '' }} style={styles.profileImg} />

                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    marginTop: 10,
                                                }}
                                            >
                                                <Text style={styles.headerView}>{item.squad_name}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.unReadViewContainer}>
                                            {/* {item.iconTick && ( */}
                                            <View style={styles.unReadMessageView}>
                                                <Image source={this.state.arrSelectedUserId.includes(item.squad_id) ? icon_user_selected : icon_user_unselected} />
                                            </View>
                                            {/* )} */}
                                        </View>
                                    </View>

                                    <View style={styles.lineVisibleView} />
                                </TouchableOpacity>
                            );
                        }}
                    />
                </View>
                <View style={{ marginHorizontal: 20, height: 45 }}>
                    {/* <SubmitButton
              labelText={"ADD"}
              onSubmitPress={(name) => this.onSubmitPress(name)}
            /> */}
                    <Button
                        containerStyle={{ backgroundColor: colors.greenButton, borderRadius: 36 }}
                        buttonStyle={{ backgroundColor: colors.greenButton, height: '100%' }}
                        title="ADD"
                        titleStyle={{
                            fontSize: 15,
                            fontFamily: fonts.Bold
                        }}
                        onPress={() => this.onPressAddUsers()}
                    />
                </View>
                <Loader loading={this.state.loading} />

            </SafeAreaView>
        );
    }

    onPressSelectedUser = (index) => {
        let squad_id = this.state.arrSquad[index].squad_id
        console.log("squad_id ",squad_id);
        let arrSelectedUserId = this.state.arrSelectedUserId
        if (arrSelectedUserId.includes(squad_id)) {
            // console.log("already selected");
            const data = arrSelectedUserId.filter(data => data != squad_id)
            console.log(data);
            this.setState({
                arrSelectedUserId: data
            })
        } else {
            // console.log("selected");
            arrSelectedUserId.push(squad_id)
            this.setState({
                arrSelectedUserId
            })
        }
    }

    onPressAddUsers = () => {
        this.props.navigation.navigate('AddEvent',{squadIds:this.state.arrSelectedUserId})
    }

   

    getMySquad = () => {
        this.setState({ loading: true })
        var formdata = new FormData();
        formdata.append("token", this.props.userInfo.token);

        ApiHelper.post('squadList', formdata).then(response => {
            // console.log("response ", response);
            this.setState({ loading: false })
            if (response.status == 200) {
                if (response.data.status == 'SUCCESS') {
                    if (response.data.hasOwnProperty('squadList')) {
                        this.setState({
                            arrSquad: response.data.squadList
                        })
                    }
                } else {
                    if (response.data.requestKey) {
                        Toast.show(response.data.requestKey)
                    }
                    if (response.data.is_token_expired && Boolean(response.data.is_token_expired)) {
                        
                        resetStackAndNavigate(this.props.navigation,'Login')
                    }
                }
            }
        }).catch((error) => {
            this.setState({ loading: false })
            Toast.show(error.message)
        })
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(255,250,234)",
    },
    searchcontainer: {
        backgroundColor: colors.themeColor,
        borderWidth: 0, //no effect
        // shadowColor: 'white', //no effect
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
        marginTop: 10,
        paddingHorizontal: 20
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


const mapStateToProps = (state) => {
    return {
        create_squad: state.manage_squad.create_squad,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = (dispatch) => {
    return ({
        setSelectedUserId: (data) => dispatch(setSelectedUserId(data)),
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(SquadListComponent);