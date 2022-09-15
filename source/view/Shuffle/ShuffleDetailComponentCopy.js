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
    ScrollView,
    StatusBar
} from 'react-native';
import { colors, fonts, SCREEN_SIZE } from '../../common/colors'
import { HeadingText } from '../../common/HeadingText'
import { Button, CheckBox } from 'react-native-elements'
import moment from 'moment';
import MapView, { MarkerAnimated, PROVIDER_GOOGLE, MapViewAnimated } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { postMethod } from '../../Networking/APIModel'
import { connect } from 'react-redux'
import Loader from '../../common/Loader';
import Header from "../components/header"


class ShuffleDetailComponent extends PureComponent {

    constructor() {
        super()
        this.state = {
            code: '',
            isCheck: false,
            birthDate: '',
            images: ['', '', '', ''],
            selectedIndex: -1,
            arrInterest: ['Drinking', 'Playing games'],
            eventData: {},
            latitude: Number(0),
            longitude: Number(0),
            arrSomeOneBrings: [],
            arrSelectedIndex: [],
            otherUserSelectedCheckList: [],
            arrSelectedCheckList: [],
            event_users : [],
            event_squads : [],
            is_participant: false,
            event_owner_id:'',
            request_list:'',
            bring_list:[],
            is_requested:false,
            loading:false,
            min_age : ''
        }
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: colors.white }}>
               
                <Header heading="Event Details" back ={this.props.navigation}/>
                <View style={{ flex: 2, marginVertical: 15, marginTop:-80,zIndex:8 }}>
                    <ScrollView contentContainerStyle={{ marginHorizontal: 16, paddingBottom: 30 }}>

                        <HeadingText title={this.state.eventData.event_title} style={{ fontSize: 18, color: colors.black, fontFamily: fonts.SemiBold }} />
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 13 }}>
                            <Image source={require('../../assets/location_ic_shu.png')} />
                            <Text style={{ alignSelf: 'center', marginHorizontal: 10, color: colors.black, fontSize: 15, fontFamily: fonts.Regular }}>{this.state.eventData.event_address}</Text>
                        </View>

                        <View style={{ height: 147 }}>
                            {this.showMap()}
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 30 }}>
                            <Image source={require('../../assets/calendar_ic.png')} />
                            <Text style={{ alignSelf: 'center', marginHorizontal: 10, color: '#0D110F', fontSize: 15, fontFamily: fonts.SemiBold }}>
                                {moment(this.state.eventData.event_date).format('DD MMMM YYYY')} {this.state.eventData.event_time}
                            </Text>
                        </View>

                        {this.state.event_users.length
                        ?
                        <>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <HeadingText title={'Members'} style={{ fontSize: 18, color: colors.black, fontFamily: fonts.SemiBold }} />
                            </View>
                            <View style={{ marginTop: 17, paddingBottom: 10 }}>
                                <FlatList
                                    numColumns={4}
                                    data={this.state.event_users}
                                    keyExtractor={({ item, index }) => String(index)}
                                    renderItem={({ item, index }) => (
                                        <TouchableOpacity onPress={() => this.setState({ selectedIndex: index })} activeOpacity={0.6} style={{ width: "25%", marginVertical: 3 }}>
                                            <View style={{ borderRadius: 3, justifyContent: 'center', alignItems: 'center', marginHorizontal: 5, backgroundColor: '#F5843B', height: 76, overflow: 'hidden' }}>
                                                <Image source={{ uri: item.image }} style={{ height: '100%', width: '100%' }} />
                                            </View>
                                            <Text numberOfLines={1} style={{ marginVertical: 5, color: '#0D110F', fontFamily: fonts.Regular, fontSize: 13, textAlign: 'center' }}>{item.full_name}</Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        </>
                        :
                        <></>
                        }
                        
                        {this.state.event_squads.length
                        ?
                        <>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <HeadingText title={'Squads'} style={{ fontSize: 18, color: colors.black, fontFamily: fonts.SemiBold }} />
                            </View>
                            <View style={{ marginTop: 17, paddingBottom: 10 }}>
                                <FlatList
                                    numColumns={4}
                                    data={this.state.event_squads}
                                    keyExtractor={({ item, index }) => String(index)}
                                    renderItem={({ item, index }) => (
                                        <TouchableOpacity onPress={() => this.setState({ selectedIndex: index })} activeOpacity={0.6} style={{ width: "25%", marginVertical: 3 }}>
                                            <View style={{ borderRadius: 3, justifyContent: 'center', alignItems: 'center', marginHorizontal: 5, backgroundColor: '#F5843B', height: 76, overflow: 'hidden' }}>
                                                <Image source={{ uri: item.squad_image }} style={{ height: '100%', width: '100%' }} />
                                            </View>
                                            <Text numberOfLines={1} style={{ marginVertical: 5, color: '#0D110F', fontFamily: fonts.Regular, fontSize: 13, textAlign: 'center' }}>{item.squad_name}</Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        </>
                        :
                        <></>
                        }

                        <View style={{ paddingBottom: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                                <HeadingText title={'Detail'} style={{ fontSize: 18, color: colors.black, fontFamily: fonts.SemiBold }} />
                            </View>
                            <Text style={{ marginTop: 5, color: '#211F1A', fontSize: 14, fontFamily: fonts.Regular }}>
                                {this.state.eventData.event_description}
                            </Text>

                        </View>

                        <View style={{ paddingBottom: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                                <HeadingText title={'Someone bring'} style={{ fontSize: 18, color: colors.black, fontFamily: fonts.SemiBold }} />
                            </View>
                         
                            <View style={{ flex: 1, flexWrap: 'wrap' }}>
                                <FlatList
                                    data={this.state.arrSomeOneBrings}
                                    extraData={this.state.arrSomeOneBrings}
                                    keyExtractor={(item, index) => String(index)}
                                    renderItem={({ item, index }) => (
                                        <View style={{ marginTop: 8, backgroundColor:'white', elevation:3 }}>
                                            <Text>{item}</Text>
                                        </View>
                                    )}
                                />
                            </View>
                        </View>

                        <View style={{ paddingBottom: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                                <HeadingText title={'Age Range'} style={{ fontSize: 18, color: colors.black, fontFamily: fonts.SemiBold }} />
                            </View>

                            <Text style={{ marginTop: 5, color: colors.black, fontSize: 14, fontFamily: fonts.Regular }}>
                                {parseInt(this.state.min_age) || 0} - {parseInt(this.state.max_age)}
                                {/* {this.state.eventData.min_age} to {this.state.eventData.max_age} */}

                            </Text>
                        </View>

                    </ScrollView>
                </View>

                { this.state.eventData.event_owner_id == this.props.userInfo.id || this.state.is_requested  ? null :
                     
                    <Button
                        activeOpacity={0.6}
                        title="ASK TO JOIN"
                        titleStyle={{ fontSize: 14, fontFamily: fonts.Bold }}
                        containerStyle={{ marginHorizontal: 20 }}
                        buttonStyle={{ height: 45, backgroundColor: colors.pinkbg, borderRadius: 36, marginBottom:15 }}
                        onPress={() => {
                            const EventID = String(this.state.eventData.event_id)
                            const someOneBring = this.state.arrSelectedCheckList.join(',')
                            this.askToJoinEvent(EventID, someOneBring)
                        }}
                    />
                }

                <Loader loading={this.state.loading}/>
            </View>
        )
    }

    userRow = (item) => {
        return (
            <View style={{ backgroundColor:'red',paddingBottom: 8,borderBottomWidth: 1, borderBottomColor: colors.bottomBorderColor }}>
                <View style={{ flexDirection: 'row', marginVertical: 5, paddingVertical: 5 }}>
                    <View>
                        <Image source={{ uri: item.requested_user_image }} style={styles.profileImg} />
                    </View>
                    <View style={{ flex: 1, paddingLeft: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontFamily: fonts.SemiBold, fontSize: 15 }}>{item.request_by_user}</Text>
                            <Text style={{ fontFamily: fonts.regular, fontSize: 11 }}>{item.lastMessage ? moment.unix(item.lastMessage.time).format('hh:mm a') : ''}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row',paddingHorizontal:10}}>
                    <TouchableOpacity
                        style={{ borderRadius: 5, paddingHorizontal: 10, paddingVertical: 0, height: 28, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.greenButton }}
                        onPress={() => { this.eventAcceptReject(item.requested_user_id,1) }}
                    >
                        <Text style={{ color: colors.white, fontFamily: fonts.SemiBold }}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginHorizontal: 10, borderRadius: 5, paddingHorizontal: 10, paddingVertical: 0, height: 28, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.black }}
                        onPress={() => { this.eventAcceptReject(item.requested_user_id,0) }}
                    >
                        <Text style={{ color: colors.white, fontFamily: fonts.SemiBold }}>Deny</Text>
                    </TouchableOpacity>

                </View>
            </View>
        )
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {

            const { eventData } = this.props.route.params
            const { someone_bring,event_id } = eventData

            if(event_id){
                this.callEventDetail(event_id)
            }

            
        })
    }

    componentWillUnmount() {
        this._unsubscribe();
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state, callback_arrow) => {
            return;
        };
    }


    showMap = () => {
        return (

            <View style={styles.container}>
                <MapView
                    ref={ref => { this.mapView = ref }}
                    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={styles.map}
                    region={{
                        latitude: Number(this.state.latitude),
                        longitude: Number(this.state.longitude),
                        latitudeDelta: 0.050,
                        longitudeDelta: 0.0121,
                    }}
                    initialRegion={{
                        latitude: Number(this.state.latitude),
                        longitude: Number(this.state.longitude),
                        latitudeDelta: 0.050,
                        longitudeDelta: 0.0121,
                    }}
                    zoomEnabled={true}
                    minZoomLevel={10}
                    maxZoomLevel={20}
                    scrollEnabled={false}
                    zoomTapEnabled={false}
                >
                    <MarkerAnimated
                        ref={marker => { this.marker = marker }}
                        // coordinate={this.state.location}
                        coordinate={{
                            latitude: Number(this.state.latitude),
                            longitude: Number(this.state.longitude)
                        }}
                    />
                </MapView>
            </View>
        )
    }

    askToJoinEvent = async (eventId, someoneBring) => {
        var formdata = new FormData();
        formdata.append("token", this.props.userInfo.token);
        formdata.append("event_id", eventId);
        formdata.append("someone_bring", someoneBring);
        postMethod(this.props.navigation,'askToJoin', formdata, (success) => {
            this.props.navigation.goBack()
        }, (error) => {
            console.error(error);
        })
    }

    callEventDetail = async (eventId) => {
        this.setState({ loading: true })
        var formdata = new FormData();
        formdata.append("token", this.props.userInfo.token);
        formdata.append("event_id", eventId);
        postMethod(this.props.navigation,'eventDetail', formdata, (success) => {
            this.setState({ loading: false })
            if (success.hasOwnProperty('eventDetail')) {
                const eventData = success.eventDetail
                const { someone_bring } = eventData
                var arr = []
                var arrBring_list = []

                if (String(someone_bring) != '') {
                    arr = String(someone_bring).split(',')
                }

                if (eventData.hasOwnProperty('bring_list')) {
                    arrBring_list = eventData.bring_list
                }
                this.setState({
                    latitude: Number(eventData.lats),
                    longitude: Number(eventData.longs),
                    arrSomeOneBrings: arr,
                    otherUserSelectedCheckList: eventData.hasOwnProperty('bring_list') ? eventData.bring_list : [],
                    is_participant: Boolean(eventData.is_participant),
                    bring_list: arrBring_list,
                    event_owner_id: success.eventDetail.event_owner_id,
                    request_list: success.eventDetail.request_list,
                    is_requested: Boolean(success.eventDetail.is_requested),
                    eventData: success.eventDetail,
                    min_age : success.eventDetail.min_age,
                    max_age : success.eventDetail.max_age,
                    event_users : success.eventDetail.event_users,
                    event_squads : success.eventDetail.event_squads,
                })
            }
        }, (error) => {
            this.setState({ loading: false })
            console.error(error);
        })
    }

    eventAcceptReject = (id,status) => {
        this.setState({loading:true})
        var formdata = new FormData();
        formdata.append("token", this.props.userInfo.token);
        formdata.append("event_id", this.state.eventData.event_id);
        formdata.append("requested_user_id",id);
        formdata.append("request_status", status);

        postMethod(this.props.navigation,'eventAcceptReject',formdata,(success) => {
            this.setState({loading:false})
            if(this.state.eventData.event_id){
                this.callEventDetail(this.state.eventData.event_id)
            }
        },(error) => {
            this.setState({loading:false})
            Toast.show(JSON.stringify(error))
        })
    }

}

const mapStateToProps = (state) => {
    console.log("Event Detail state", state);
    return {
        userInfo: state.user.userInfo
    };
};

export default connect(mapStateToProps)(ShuffleDetailComponent)

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
        width: '84%',
        height: 50,
        backgroundColor: '#00A551',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 40,
        marginHorizontal: 36,
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
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
        position: 'absolute'
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    profileImg: {
        width: 40,
        height: 40,
        borderRadius: 20,
        resizeMode: "cover",
      }
})

