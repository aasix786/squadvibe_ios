import React, { Component } from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    Text,
    SafeAreaView,
    StyleSheet,
    TextInput,
    ScrollView,
    FlatList,
    StatusBar,
    Alert,
    KeyboardAvoidingView,
    ActivityIndicator,
    PermissionsAndroid,
    Platform
} from 'react-native';
import { colors, fonts, confirmationAlert,resetStackAndNavigate } from '../../common/colors'
import { HeadingText } from '../../common/HeadingText'
import { CustomButtonWithLeftIcon } from '../../common/ThemeButton'
import HyperlinkedText from 'react-native-hyperlinked-text';
import { Input } from 'react-native-elements'
import {
    launchCamera,
    launchImageLibrary
} from 'react-native-image-picker';

import ApiHelper from '../../Networking/NetworkCall'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-simple-toast';
import { connect } from 'react-redux'
import { setUserInfo } from '../../redux/Actions/UserAction';
import Loader from '../../common/Loader';


const EDIT_PROFILE_API = {
    UPDATE_PROFILE_IMAGE: 'updateProfileImage',
    ABOUT: 'userAboutInfo',
    UPDATE_INTEREST: 'updateInterest',
    DELETE_INTEREST: 'deleteUserInterest',
    UPDATE_USER_STATUS: 'updateUserStatus',
    DELETE_USER_IMAGES: 'deleteUserImage'
};

class EditProfileComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            code: '',
            isCheck: false,
            birthDate: '',
            images: ['',],
            selectedIndex: -1,
            arrInterest: ['Drinking', 'Playing games'],
            arrRelationShipStatus: ['Single', 'In a relationship', 'Married', 'No answer'],
            filePath: '',
            imageResponse: '',
            loading: false,
            arrUploadImages: [],
            user_about: ''
        }
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            let index = this.state.arrRelationShipStatus.indexOf(this.props.userInfo.relationship_status)
            this.setState({ selectedIndex: index })
            this.getUserProfile()
        });
    }

    render() {
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS == 'android' ? 'height' : 'padding'}
                style={{ flex: 1, backgroundColor: colors.themeColor }}>
                <SafeAreaView style={{ flex: 2, backgroundColor: colors.themeColor }}>
                    <SafeAreaView></SafeAreaView>
                    <StatusBar barStyle={'default'} />

                    {/* <SafeAreaView> */}
                    <View style={{ flexDirection: 'row', paddingHorizontal: 16 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            {/* <Image source={require('../../assets/phone_ic_2.png')}/> */}
                            <Image source={require('../../assets/back_arrow.png')} />
                        </TouchableOpacity>
                        <Text style={{ flex: 1, alignSelf: 'center', textAlign: 'center', color: '#242E40', fontFamily: fonts.SemiBold, fontSize: 16 }}>Edit Profile</Text>
                    </View>
                    <ScrollView 
                        style={{flex: 2,marginTop:20}}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 20,flexDirection: 'column', justifyContent: 'space-between' }}
                        keyboardShouldPersistTaps='handled'
                    >
                        <View style={{ paddingHorizontal: 16 }}>


                            <View style={{ paddingBottom: 10, borderBottomColor: '#E0DDD3', borderBottomWidth: 1 }}>
                                <FlatList
                                    numColumns={4}
                                    data={this.state.images}
                                    keyExtractor={index => index.toString()}
                                    renderItem={({ item, index }) => (
                                        <TouchableOpacity onPress={() => this.addPicture(index)} style={{ width: "25%", marginVertical: 5 }} activeOpacity={index == 0 ? 0.5 : 1}>
                                            <View style={{ borderRadius: 6, justifyContent: 'center', alignItems: 'center', marginHorizontal: 5, backgroundColor: '#F5843B', height: 76, overflow: 'hidden' }}>
                                                {(index == 0) ?
                                                    <Image source={require('../../assets/add_pic_plus.png')} resizeMode={'center'} style={{ height: 27, width: 27 }} />
                                                    :
                                                    <Image source={{ uri: item.image }}
                                                        style={{ height: '100%', width: '100%', borderRadius: 6 }}
                                                        resizeMode={'cover'}
                                                        loadingIndicatorSource={<ActivityIndicator size={'large'} color={colors.darkgray} />}
                                                    />
                                                }
                                            </View>
                                            {index == 0 ? null :
                                                <TouchableOpacity onPress={() => this.removePicture(index)} activeOpacity={0.6} style={{ position: 'absolute', right: 0, top: -5 }}>
                                                    <Image source={require('../../assets/img_close-ic.png')} />
                                                </TouchableOpacity>
                                            }
                                        </TouchableOpacity>

                                    )}
                                />

                                <HeadingText
                                    title={'About Me'}
                                    style={{ marginTop: 20, marginBottom: 10, fontSize: 14, color: colors.headingTextColor, fontFamily: fonts.SemiBold }} />

                                {/* <Text style={{ fontSize: 16, fontFamily: fonts.Regular }}>
                                Nulla tristique sit amet dolor non sollicitudin. Morbi venenatis at metus id aliquet. Sed faucibus lorem nulla, vitae vulputate urna dapibus quis. Nullam tortor ligula.
                            </Text> */}
                                <Input
                                    style={{ fontSize: 16, fontFamily: fonts.Regular }}
                                    placeholder={'About Me'}
                                    defaultValue={this.state.user_about}
                                    inputContainerStyle={{ borderBottomWidth: 0, left: -8, marginVertical: 0 }}
                                    inputStyle={{ fontSize: 16, fontFamily: fonts.Regular, fontWeight: '500' }}
                                    multiline={true}
                                    containerStyle={{ maxHeight: 80, marginBottom: -10 }}
                                    onChangeText={(user_about) => this.setState({ user_about })}
                                    blurOnSubmit={true}
                                />

                            </View>

                            <View>
                                <HeadingText
                                    title={'Interests'}
                                    style={{ marginVertical: 15, fontSize: 14, color: colors.headingTextColor, fontFamily: fonts.SemiBold }} />
                                <View style={{ flexDirection: 'row', flex: 1, flexWrap: 'wrap' }}>
                                    {/* <ScrollView style={{flex:1}} contentContainerStyle={{ flexGrow: 1 }}> */}
                                    {
                                        this.props.userInfo.interest_list.map((data, index) => {
                                            return (

                                                <View style={{ marginRight: 10, backgroundColor: colors.greenButton, borderRadius: 4, marginVertical: 10 }}>
                                                    <Text style={{ marginHorizontal: 10, fontFamily: fonts.Medium, fontSize: 14, color: 'white', marginVertical: 10 }}>{data.interest}</Text>
                                                    <TouchableOpacity
                                                        activeOpacity={0.6}
                                                        style={{ position: 'absolute', right: -5, top: -5 }}
                                                        onPress={() => {
                                                            confirmationAlert('Delete', 'Are you sure you want to delete this interest?', () => {
                                                                this.callEditProfile(EDIT_PROFILE_API.DELETE_INTEREST, data.interest_id)
                                                                // alert("selected interest id "+  data.interest_id)
                                                            })
                                                        }}
                                                    >
                                                        <Image source={require('../../assets/img_close-ic.png')} />
                                                    </TouchableOpacity>
                                                </View>

                                            )
                                        })
                                    }
                                    {/* </ScrollView> */}

                                    {/* <View style={{ backgroundColor: colors.greenButton, borderRadius: 4, marginLeft: 11 }}>
                                    <Text style={{ fontFamily: fonts.Medium, fontSize: 14, color: 'white', marginHorizontal: 45, marginVertical: 10 }}>Shisha</Text>
                                    <TouchableOpacity 
                                    activeOpacity={0.6} 
                                    style={{ position: 'absolute', right: -5, top: -5 }}
                                    onPress={() => {
                                        confirmationAlert('Delete', 'Are you sure you want to delete this interest?', () => {
                                            //this.callEditProfile(EDIT_PROFILE_API.DELETE_USER_IMAGES, this.state.images[index].id)
                                            alert('deleted')
                                        })
                                    }}
                                    >
                                        <Image source={require('../../assets/img_close-ic.png')} />
                                    </TouchableOpacity>
                                </View> */}
                                </View>
                                <Text
                                    style={{ height: 24, alignSelf: 'flex-end', color: colors.greenButton, fontFamily: fonts.SemiBold, fontSize: 14 }}
                                    onPress={() => {
                                        this.props.navigation.push('GroupInterest', { isFromEditProfile: true, data: this.props.userInfo.interest_list })
                                    }}
                                >
                                    Add
                                </Text>
                            </View>

                            <View style={{ justifyContent: 'space-between' }}>
                                <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginVertical: 15 }}>
                                    <HeadingText
                                        title={'Life Status'}
                                        style={{ fontSize: 14, color: colors.headingTextColor, fontFamily: fonts.SemiBold }} />
                                    <Text style={{ height: 24, alignSelf: 'flex-end', color: colors.greenButton, fontFamily: fonts.SemiBold, fontSize: 14 }}
                                        onPress={() => {
                                            this.props.navigation.navigate('current_status', { isFromEditProfile: true })
                                        }}
                                    >
                                        Change
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ backgroundColor: colors.greenButton, borderRadius: 4 }}>
                                        <Text style={{ fontFamily: fonts.Medium, fontSize: 14, color: 'white', marginHorizontal: 10, marginVertical: 10 }}>{this.props.userInfo.current_status}</Text>
                                        <TouchableOpacity activeOpacity={0.6} style={{ position: 'absolute', right: -5, top: -5 }}>
                                            <Image source={require('../../assets/img_close-ic.png')} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                            <View style={{ justifyContent: 'space-between' }}>
                                <HeadingText
                                    title={'Relationship Status'}
                                    style={{ marginVertical: 15, fontSize: 14, color: colors.headingTextColor, fontFamily: fonts.SemiBold }} />

                                <View>
                                    <FlatList
                                        numColumns={2}
                                        data={this.state.arrRelationShipStatus}
                                        keyExtractor={index => index.toString()}
                                        renderItem={({ item, index }) => (
                                            <View style={{ width: '40%', marginHorizontal: 5 }}>
                                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }} onPress={() => this.setState({ selectedIndex: index })}>
                                                    {(index == this.state.selectedIndex) ?
                                                        <Image source={require('../../assets/checkbox_check.png')} resizeMode={'center'} style={{ height: 18, width: 18 }} />
                                                        :
                                                        <Image source={require('../../assets/checkbox.png')} style={{ height: 18, width: 18 }} />
                                                    }
                                                    <Text style={{ alignSelf: 'center', marginHorizontal: 8, fontSize: 14, fontFamily: fonts.Regular }}>{item}</Text>
                                                </TouchableOpacity>
                                            </View>

                                        )}
                                    />
                                </View>
                            </View>
                        </View>

                        <View style={{marginTop:100}}>
                        <TouchableOpacity
                            style={styles.bottomView}
                            activeOpacity={0.5}
                            onPress={() => {
                                if (this.state.user_about != '') {
                                    this.callEditProfile(EDIT_PROFILE_API.ABOUT, this.state.user_about)
                                }
                                this.props.navigation.goBack()
                                // this.callEditProfile()
                            }}
                        >
                            <Text style={styles.textStyle}>SAVE</Text>
                        </TouchableOpacity>
                        </View>
                        
                    </ScrollView>

                    <Loader loading={this.state.loading} />
                    

                </SafeAreaView>
            </KeyboardAvoidingView>
        )
    }


    addPicture = (index) => {
        if (index == 0) {
            this.openImagePicker()
        } else {
            this.setState({ selectedIndex: index })
        }
    }

    removePicture = (index) => {
        const image = this.state.images[index].id

        const arrImage = this.state.images
        const arrNewImages = arrImage.filter(data => data !== image)
        this.setState({ images: arrNewImages })

        confirmationAlert('Delete', 'Are you sure you want to delete this image?', () => {
            this.callEditProfile(EDIT_PROFILE_API.DELETE_USER_IMAGES, this.state.images[index].id)
        })
    }

    captureImage = async (type) => {
        
        // let options = {
        //     storageOptions: {
        //         skipback_arrowup: true,
        //         path: 'images',
        //     },
        // };
        var options = {
            title: 'Select Image',
            includeBase64:false,
            quality:0.5,
            mediaType: "photo",
        };

        
        
        launchCamera(options,(response) => {

            if (response.didCancel) {
                alert('User cancelled camera picker');
                return;
            } else if (response.errorCode == 'camera_unavailable') {
                alert('Camera not available on device');
                return;
            } else if (response.errorCode == 'permission') {
                alert('Permission not satisfied');
                return;
            } else if (response.errorCode == 'others') {
                alert(response.errorMessage);
                return;
            }
            this.setFilePath(response.assets[0]);
        });
        // }
    };

    chooseFile = (type) => {
        let options = {
            mediaType: type,
            maxWidth: 200,
            maxHeight: 200,
            quality: 0.5,
            //   selectionLimit:5,
        };

       

        launchImageLibrary(options, (response) => {

            if (response.didCancel) {
                alert('User cancelled camera picker');
                return;
            } else if (response.errorCode == 'camera_unavailable') {
                alert('Camera not available on device');
                return;
            } else if (response.errorCode == 'permission') {
                alert('Permission not satisfied');
                return;
            } else if (response.errorCode == 'others') {
                alert(response.errorMessage);
                return;
            }
            this.setFilePath(response.assets[0]);
        });

    };

    setFilePath(response) {
        let arrImage = this.state.arrUploadImages
        arrImage.push(response.uri)
        this.setState({
            filePath: response.uri,
            imageResponse: response,
        })

        this.uploadProfileImage()
    }

    openImagePicker() {
        Alert.alert(
            "Photo",
            "Please select or capture the image",
            [
                {
                    text: "Gallery",
                    onPress: () => this.chooseFile('photo')
                },
                {
                    text: "Camera",
                    onPress: () => this.captureImage('photo')
                },
                {
                    text: "Cancel",
                    style: "cancel"
                }
            ],
            { cancelable: false }
        );
    }

    getUserProfile = async () => {
        this.setState({ loading: true })
        const device_token = await AsyncStorage.getItem('token')
        const device_type = await AsyncStorage.getItem('device_type')

        var parameter = new FormData();
        parameter.append('phone_number', this.props.userInfo.phone_number)
        parameter.append('device_token', device_token)
        parameter.append("device_type", device_type);

        ApiHelper.post('viewProfile', parameter).then((response) => {
            if (response.status == 200) {
                this.setState({ loading: false })
                if (response.data.status == 'SUCCESS') {
                    if (response.data.hasOwnProperty('viewProfile')) {
                        let userInfo = response.data.viewProfile
                        this.props.setUserInfo(userInfo)
                        AsyncStorage.setItem('user_info', JSON.stringify(userInfo))
                        let index = this.state.arrRelationShipStatus.indexOf(userInfo.relationship_status)
                        if (userInfo.image.length > 0) {
                            const images = userInfo.image.filter(data => data != "")
                            const emptyImage = ['']
                            const arrImages = [...emptyImage, ...images]
                            this.setState({
                                images: arrImages,
                                selectedIndex: index,
                                user_about: userInfo.about
                            })
                        } else {
                            this.setState({ selectedIndex: index, user_about: userInfo.about })
                        }

                    }
                } else {
                    console.error(response.data.message);
                    if (response.data.message) {
                        Toast.show(response.data.message)
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

    callEditProfile = async (type = EDIT_PROFILE_API, data) => {
        var formData = new FormData()
        formData.append('token', this.props.userInfo.token)
        var apiName = ''
        switch (type) {
            case EDIT_PROFILE_API.UPDATE_PROFILE_IMAGE:
                // alert('UPDATE_PROFILE_IMAGE')
                formData.append('image', data)
                apiName = EDIT_PROFILE_API.UPDATE_PROFILE_IMAGE
                break;
            case EDIT_PROFILE_API.DELETE_USER_IMAGES:
                apiName = EDIT_PROFILE_API.DELETE_USER_IMAGES
                formData.append('image_id', data)
                // alert('DELETE_USER_IMAGES')
                break;
            case EDIT_PROFILE_API.ABOUT:
                // alert('ABOUT')
                apiName = EDIT_PROFILE_API.ABOUT
                formData.append('about', data)
                break;
                
            case EDIT_PROFILE_API.DELETE_INTEREST:
                // alert('ABOUT')
                apiName = EDIT_PROFILE_API.DELETE_INTEREST
                formData.append('interest_id', data)
                break;
            case EDIT_PROFILE_API.DELETE_INTEREST:
                // alert('ABOUT')
                apiName = EDIT_PROFILE_API.DELETE_INTEREST
                formData.append('interest_id', data)
                break;

            default:
                break;
        }


        if (apiName == "") {
            return
        }

        ApiHelper.post(apiName, formData).then((response) => {
            this.setState({ loading: false })
            if (response.status == 200) {
                if (response.data.status == 'SUCCESS') {
                    if (response.data.hasOwnProperty('updateProfileImage')) {
                        let image = response.data.updateProfileImage.img_data
                        var objImage = {
                            id: 0,
                            image: image
                        }
                        var arrImages = this.state.images
                        arrImages.push(objImage)
                        this.setState({ images: arrImages })
                    }
                    this.getUserProfile()
                } else {
                    console.error(response.data.message);
                    if (response.data.message) {
                        Toast.show(response.data.message)
                    }
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

    uploadProfileImage = () => {
        this.setState({ loading: true })
        var parameter = new FormData();
        parameter.append('image', {
            uri: Platform.OS === 'android' ? this.state.imageResponse.uri : this.state.imageResponse.uri.replace('file:/', ''),
            // type: this.state.imageResponse.type,
            type: 'image/jpeg',
            name: this.state.imageResponse.fileName,
        });
        ApiHelper.post('uploadProfileImage', parameter,{
            headers: {
                'Content-Type': 'multipart/form-data',
              }
        }).then((response) => {
            this.setState({ loading: false })
            if (response.status == 200) {
                if (response.data.status == 'SUCCESS') {
                    if (response.data.hasOwnProperty('uploadProfileImage')) {
                        let image = response.data.uploadProfileImage.image
                        this.callEditProfile(EDIT_PROFILE_API.UPDATE_PROFILE_IMAGE, image)
                    }
                } else {
                    console.error(response.data.message);
                    if (response.data.message) {
                        Toast.show(response.data.message)
                    }
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

    requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message: 'App needs camera permission',
                    },
                );
                // If CAMERA Permission is granted
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        } else return true;
    };

}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        userInfo: state.user.userInfo,
        mobile_number: state.user.mobile_number
    };
};

const mapDispatchToProps = (dispatch) => {
    return ({
        setUserInfo: (data) => dispatch(setUserInfo(data)),
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(EditProfileComponent)

const styles = StyleSheet.create({
    passwordContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#D9D5C6',
        paddingBottom: 10,
        marginHorizontal: 16,
    },
    inputStyle: {
        flex: 1,
        fontSize: 16,
        fontFamily: fonts.Regular
    },
    bottomView: {
        // marginTop:120,
        height: 50,
        backgroundColor: '#00A551',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 5,
        borderRadius: 25
    },
    textStyle: {
        color: '#fff',
        fontSize: 17,
        fontFamily: fonts.Bold
    }
})