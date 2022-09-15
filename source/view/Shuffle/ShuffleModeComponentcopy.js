import React, { PureComponent, Component } from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    Text,
    FlatList

} from 'react-native';
import { colors, fonts,SCREEN_SIZE } from '../../common/colors'
import { Button } from 'react-native-elements';
import { Icon } from 'react-native-elements';
import {postMethod} from '../../Networking/APIModel'
import Toast from 'react-native-simple-toast';
import moment from 'moment';
import { connect } from 'react-redux'
import Header from '../components/headerWithoutBack'
class ShuffleModeComponent extends PureComponent {

    constructor() {
        super()
        this.state = {
            code: '',
            isCheck: false,
            birthDate: '',
            images: ['ic_user_1.jpg','ic_user_2.jpg','ic_user_3.jpg','ic_user_4.jpg'],
            selectedIndex: -1,
            arrInterest: ['Drinking', 'Playing games'],
            arrEvent:[],
            loading:false,
            isFromChat:false,
            selectedIndex:-1,
            message:'',
            chatRoomId:''
        }
    }

    render() {

        return (
            <View style={{ flex: 1, backgroundColor: colors.white }}>
                <Header/>

                   
                    <View style={{ justifyContent: 'center', alignItems: 'center',marginTop:-150, paddingVertical: 15 }}>

                        <View style={{ marginBottom: 10, marginTop:20, borderWidth:0.5,borderRadius:50,backgroundColor:'#00000000', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity
                                onPress={() => this.setState({ isOpenInvitation: false })}
                                style={{ borderRadius: 50, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 0, backgroundColor: this.state.isOpenInvitation ? '#00000000' : colors.themeColor, height: 60, width: '40%' }}>
                                <Text style={{ color: this.state.isOpenInvitation?colors.themeColor:colors.white, fontFamily: fonts.regular, fontSize: 14 }}>Events</Text>
                            </TouchableOpacity>
                

                            <TouchableOpacity
                                onPress={() => this.setState({ isOpenInvitation: true })}
                                style={{ borderRadius: 50,  justifyContent: 'center', alignItems: 'center', paddingHorizontal: 0, backgroundColor: this.state.isOpenInvitation ? colors.themeColor : '#00000000', height: 60, width: '40%', }}>
                                <Text style={{ color: this.state.isOpenInvitation?colors.white:colors.themeColor, fontFamily: fonts.regular, fontSize: 14 }}>Open Invitations</Text>
                            </TouchableOpacity>

                        </View>


                    </View>

                <View style={{alignItems:"center",justifyContent:"center"}}>
                    <TouchableOpacity 
                    activeOpacity={0.9} 
                    style={{ flexDirection: 'row', elevation:10,padding:10,backgroundColor:colors.buttonBGcolor,borderRadius:10, marginHorizontal:16,marginTop: 20,alignItems:'center',alignContent:'center', }}
                    onPress={() => { this.props.navigation.navigate('AddEvent') }}
                    >
                        <Icon
                            type='antdesign'
                            name='pluscircleo'
                            size={22}
                            color={colors.white}
                            onPress={() => this.props.navigation.navigate('AddEvent')}
                        />
                        <Text style={{ color: colors.white,  marginLeft: 5,fontFamily: fonts.SemiBold, fontSize: 18 }}>
                            Create an event 
                        </Text>
                    
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 2,paddingBottom:0 }}>
                    <FlatList
                        style={{ marginTop: 10 }}
                        data={this.state.arrEvent}
                        keyExtractor={index => index.toString()}
                        renderItem={({ item, index }) => (
                            <View style={{ backgroundColor: colors.white,elevation:5, marginHorizontal: 10, marginVertical: 5, borderRadius: 4 }}>
                                
                                <View style={{ flexDirection: 'row', marginTop: 16, marginHorizontal: 10 }}>
                                    <View style={{ height: 51, width: 60, borderRadius: 2,elevation:2 }}>
                                        <View style={{ height: '60%', width: '100%', backgroundColor: '#F6F6F6', borderTopLeftRadius: 3, borderTopRightRadius: 3 }} >
                                            <Text style={{ textAlign: 'center', fontFamily: fonts.SemiBold, fontSize: 20, color: '#242E40' }}>{moment(item.event_date,'YYYY/MM/DD').format('DD')}</Text>
                                        </View>
                                        <View style={{ height: '40%', width: '100%', backgroundColor: colors.themeColor, borderBottomLeftRadius: 3, borderBottomRightRadius: 3 }} >
                                            <Text style={{ textAlign: 'center', fontFamily: fonts.SemiBold, fontSize: 13, color: 'white' }}>{moment(item.event_date,'YYYY/MM/DD').format('ddd')}</Text>
                                        </View>
                                    </View>
                                    <View style={{ marginLeft: 10,flex:1 }}>
                                     
                                            <Text style={{ color: colors.themeColor, fontSize: 17, fontFamily: fonts.Bold }}>{item.event_title}</Text>
                                        <Text style={{ color: '#9E9D98', fontSize: 14, fontFamily: fonts.Regular }}>{item.event_address}</Text>
                                    </View>
                                </View>
                                <View style={{ marginTop: 20, marginHorizontal: 12 }}>
                                    <FlatList
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        showsVerticalScrollIndicator={false}
                                        data={item.participant}
                                        initialNumToRender={20}
                                        // keyExtractor={(item, index) => item.event_id}
                                        renderItem={({ item, index }) => (
                                            <TouchableOpacity onPress={() => this.setState({ selectedIndex: index })} activeOpacity={0.6} style={{ marginHorizontal: 8, marginVertical: 5 }}>
                                                <View style={{ borderRadius: 3, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.themeColor, overflow: 'hidden', width: 72, height: 71 }}>
                                                <Image source={{uri:item.user_image}} style={{ height: '100%', width: '100%' }} />
                                                </View>
                                                <Text 
                                                style={{marginTop:5,color: 'white', fontFamily: fonts.Regular, fontSize: 13,textAlign:'center' }}
                                                allowFontScaling={true}
                                                >
                                                    {item.full_name}
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    />
                                </View>

                                <Button
                                    activeOpacity={0.6}
                                    title="DETAIL"
                                    titleStyle={{ fontSize: 14, fontFamily: fonts.SemiBold,paddingHorizontal:'36%' }}
                                    containerStyle={{ marginTop: 16, marginBottom: 23, marginHorizontal: 12 }}
                                    buttonStyle={{ height: 45, backgroundColor: colors.themeColor, borderRadius: 36 }}
                                    // iconRight
                                    // icon={<Image source={require('../../assets/button_white_arrow.png')} />}
                                    iconContainerStyle={{ left:100 }}
                                    onPress={() => this.props.navigation.navigate('ShuffleDetail',{eventData:item,isFromChat:false})}
                                />
                                {
                                    this.state.isFromChat ?
                                        <Text
                                            style={{
                                                right: 8,
                                                position: 'absolute',
                                                alignSelf: 'flex-end',
                                                color: colors.white,
                                                fontSize: 17,
                                                fontFamily: fonts.Bold
                                            }}
                                            onPress={() => {
                                                this.setState({ selectedIndex: this.state.selectedIndex == -1 ? index : -1 })
                                            }}
                                        >
                                            {'...'}
                                        </Text>
                                        : null
                                }
                                
                                {(this.state.selectedIndex === index) ?
                                    <View style={{ position: 'absolute', right: 0, marginTop: 25, marginRight: 12, width: 100, height: 40, backgroundColor: 'white', borderRadius: 3 }}>
                                        <TouchableOpacity onPress={() => {
                                            this.setState({ selectedIndex: -1 })
                                            var message = this.state.message
                                            message.event_title = item.event_title
                                            message.event_address = item.event_address
                                            message.event_date = moment(item.event_date,'YYYY/MM/DD').format('DD/MM/YYYY')
                                            message.event_data = item
                                            message.time = moment().unix()
                                            this.sendMessage(message)
                                        }} style={{ height: '100%', borderBottomWidth: 1, borderBottomColor: '#D8D8D8', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 }}>
                                            <Image source={require('../../assets/change_color_ic.png')} />
                                            <Text style={{ marginLeft: 8, fontSize: 14, fontFamily: fonts.Medium, color: colors.headingTextColor }}>Share</Text>
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    null}
                                
                            </View>
                        )}
                        ListEmptyComponent={() => {
                            return(
                                <View style={{height:SCREEN_SIZE.SCREEN_HEIGHT/2,justifyContent:'center',alignItems:'center'}}>
                                    <Text style={{fontFamily:fonts.Medium,fontSize:17}}>No event created yet</Text>
                                </View>
                                
                            )
                        }}
                    />
                </View>
                {/* <Loader loading={this.state.loading} /> */}
            </View>
        )
    }

    

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            console.log("route.params ======> ",this.props.route.params);
            if(this.props.route.params != undefined){
                const {message,chatRoomId,isFromChat} = this.props.route.params
                this.setState({
                    isFromChat:isFromChat,
                    message:message == undefined ? '' : message,
                    chatRoomId:chatRoomId == undefined ? '' : chatRoomId
                })
            }
            this.setState({ selectedIndex: -1 })
            this.getAllEvent()
        })
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    getAllEvent = () => {

        this.setState({loading:true})
        var formdata = new FormData();
        // formdata.append("token", "9E9yq8ylQNvxyVQrkNcl");
        formdata.append("token", this.props.userInfo.token);
        formdata.append("event_mode", 1);
        postMethod(this.props.navigation,'eventList',formdata,(success) => {
            if (success.event) {
                const suffleModeEvent = success.event.filter(data => data.event_mode == 1)
                this.setState({
                    loading: false,
                    arrEvent: suffleModeEvent,
                })
            }
        },(error) => {
            this.setState({loading:false})
            // Toast.show(JSON.stringify(error))
        })
    }


    showGroupImages = (data) => {
        if (data != undefined) {
            if (data.length >= 5) {
                return (
                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                        <Image style={{ width: 26, height: 26, borderRadius: 13, borderColor: '#211F1A', borderWidth: 3 }} source={(data[0].user_image) ? { uri: data[0].user_image } : require('../../assets/avtar.jpg')} />
                        <Image style={{ right: 10, width: 26, height: 26, borderRadius: 13, borderColor: '#211F1A', borderWidth: 3 }} source={(data[1].user_image) ? { uri: data[1].user_image } : require('../../assets/avtar.jpg')} />
                        <Image style={{ right: 20, width: 26, height: 26, borderRadius: 13, borderColor: '#211F1A', borderWidth: 3 }} source={(data[2].user_image) ? { uri: data[2].user_image } : require('../../assets/avtar.jpg')} />
                        <Image style={{ right: 30, width: 26, height: 26, borderRadius: 13, borderColor: '#211F1A', borderWidth: 3 }} source={(data[3].user_image) ? { uri: data[3].user_image } : require('../../assets/avtar.jpg')} />
                        <Image style={{ right: 40, width: 26, height: 26, borderRadius: 13, borderColor: '#211F1A', borderWidth: 3 }} source={(data[4].user_image) ? { uri: data[4].user_image } : require('../../assets/avtar.jpg')} />
                        <View style={{ backgroundColor: '#F5843B', right: 50, width: 26, height: 26, borderRadius: 13, borderColor: '#211F1A', borderWidth: 3, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontFamily: fonts.Bold, fontSize: 13, color: 'white' }}>{`+${data.length - 5}`}</Text></View>
                    </View>
                )
            } else if (data.length >= 4) {
                return (
                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                        <Image style={{ width: 26, height: 26, borderRadius: 13, borderColor: '#211F1A', borderWidth: 3 }} source={data[0].user_image ? { uri: data[0].user_image } : require('../../assets/avtar.jpg')} />
                        <Image style={{ right: 8, width: 26, height: 26, borderRadius: 13, borderColor: '#211F1A', borderWidth: 3 }} source={data[1].user_image ? { uri: data[1].user_image } : require('../../assets/avtar.jpg')} />
                        <Image style={{ right: 16, width: 26, height: 26, borderRadius: 13, borderColor: '#211F1A', borderWidth: 3 }} source={data[2].user_image ? { uri: data[2].user_image } : require('../../assets/avtar.jpg')} />
                        <Image style={{ right: 24, width: 26, height: 26, borderRadius: 13, borderColor: '#211F1A', borderWidth: 3 }} source={data[3].user_image ? { uri: data[3].user_image } : require('../../assets/avtar.jpg')} />
                    </View>
                )
            } else if (data.length >= 3) {
                return (
                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                        <Image style={{ width: 26, height: 26, borderRadius: 13, borderColor: '#211F1A', borderWidth: 3 }} source={(data[0].user_image) ? { uri: data[0].user_image } : require('../../assets/avtar.jpg')} />
                        <Image style={{ right: 8, width: 26, height: 26, borderRadius: 13, borderColor: '#211F1A', borderWidth: 3 }} source={(data[1].user_image) ? { uri: data[1].user_image } : require('../../assets/avtar.jpg')} />
                        <Image style={{ right: 16, width: 26, height: 26, borderRadius: 13, borderColor: '#211F1A', borderWidth: 3 }} source={(data[2].user_image) ? { uri: data[2].user_image } : require('../../assets/avtar.jpg')} />
                    </View>
                )
            } else if (data.length >= 2) {
                return (
                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                        <Image style={{ width: 26, height: 26, borderRadius: 13, borderColor: '#211F1A', borderWidth: 3 }} source={(data[0].user_image) ? { uri: data[0].user_image } : require('../../assets/avtar.jpg')} />
                        <Image style={{ right: 8, width: 26, height: 26, borderRadius: 13, borderColor: '#211F1A', borderWidth: 3 }} source={(data[1].user_image) ? { uri: data[1].user_image } : require('../../assets/avtar.jpg')} />
                    </View>
                )
            } else if (data.length >= 1) {
                return (
                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                        <Image style={{ width: 26, height: 26, borderRadius: 13, borderColor: '#211F1A', borderWidth: 3 }} source={(data[0].user_image) ? { uri: data[0].user_image } : require('../../assets/avtar.jpg')} />
                    </View>
                )
            } else {
                if (data.length > 5) {
                    return (
                        <View style={{ flexDirection: 'row', marginTop: 5 }}>
                            <Image style={{ width: 26, height: 26, borderRadius: 13, borderColor: '#211F1A', borderWidth: 3 }} source={require('../../assets/avtar.jpg')} />
                            <Image style={{ right: 8, width: 26, height: 26, borderRadius: 13, borderColor: '#211F1A', borderWidth: 3 }} source={require('../../assets/avtar.jpg')} />
                            <Image style={{ right: 16, width: 26, height: 26, borderRadius: 13, borderColor: '#211F1A', borderWidth: 3 }} source={require('../../assets/avtar.jpg')} />
                            <Image style={{ right: 24, width: 26, height: 26, borderRadius: 13, borderColor: '#211F1A', borderWidth: 3 }} source={require('../../assets/avtar.jpg')} />
                            <Image style={{ right: 32, width: 26, height: 26, borderRadius: 13, borderColor: '#211F1A', borderWidth: 3 }} source={require('../../assets/avtar.jpg')} />
                            <View style={{ backgroundColor: '#F5843B', right: 32, width: 26, height: 26, borderRadius: 13, borderColor: '#211F1A', borderWidth: 3, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontFamily: fonts.SemiBold, fontSize: 12 }}>{`+${data.length - 5}`}</Text></View>
                        </View>
                    )
                }
            }
        }
    }

 


}
const mapStateToProps = (state) => {
    return {
        userInfo: state.user.userInfo
    };
};
export default connect(mapStateToProps)(ShuffleModeComponent)