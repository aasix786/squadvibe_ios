import React, { Component, PureComponent } from 'react';
import { View, StyleSheet, Dimensions, Text,TouchableOpacity, Platform, Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, MapViewAnimated } from 'react-native-maps';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { colors, fonts } from '../../common/colors'
import { Button} from 'react-native-elements'
import Geolocation from 'react-native-geolocation-service';
import { SafeAreaView } from 'react-native';
import moment from "moment";
import Header from "../components/header"

// const moduleName = Platform.OS === 'ios' ? 'MapView' : 'MapViewManager'
// // const TomtomMap = requireNativeComponent(moduleName)

let { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const latitudeDelta = 0.025
const longitudeDelta = 0.025

const headerHeight = (Platform.OS == 'ios') ? 84 : 60

const GOOGLE_API_KEY = "AIzaSyAis1VNdZkjXeCKL-STa0b9aHdKk83WFtk"
// AIzaSyDZRd7CisUH6tg733-02d57hQ23B1ANR1k

class MapComponent extends Component {

    refMap = null;

    constructor(props) {
        super(props)
        this.state = {
            region: {
                latitudeDelta,
                longitudeDelta,
                latitude: LATITUDE,
                longitude: LONGITUDE
            },
            center: '',
            locationName: '',
            address:'',
            location:'',
            message:'',
            chatRoomId:''
            
        };
        // getUserCurrentLocation()
    }

    render() {
        return (

            <SafeAreaView style={{ flex: 1,backgroundColor:colors.white }}>
                {/* <View style={{ flexDirection: 'row',marginHorizontal:16,backgroundColor:colors.white,paddingBottom:10 }}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Image source={require('../../assets/back_arrow.png')} />
                    </TouchableOpacity>
                    <Text style={{ flex: 1, alignSelf: 'center', textAlign: 'center', color: '#242E40', fontFamily: fonts.SemiBold, fontSize: 17 }}>Location</Text>
                </View> */}
                <Header 
                    heading = "Create Poll"
                    back ={this.props.navigation}
                />
               
                <MapView
                    zoomControlEnabled={true}
                    ref={map => { this.map = map }}
                    scrollEnabled={true}
                    // maxZoomLevel={20}
                    // minZoomLevel={14}
                    style={{ flex: 1, height: height,marginVertical:10, marginTop:-40 }}
                    // style={styles.mapStyle}
                    // style={styles.map}
                    onMapReady={() => {
                        console.log("Current Location ", this.props.currentLocation);
                    }}
                    provider={PROVIDER_GOOGLE}
                    zoomEnabled={true}
                    showsUserLocation={true}
                    initialRegion={{
                        latitude: this.state.region.latitude,
                        longitude: this.state.region.longitude,
                        latitudeDelta: latitudeDelta,
                        longitudeDelta: longitudeDelta
                    }}
                    showsMyLocationButton={true}
                >

                    <Marker.Animated
                        tracksInfoWindowChanges={false}
                        tracksViewChanges={false}
                        // draggable
                        coordinate={{ latitude: this.state.region.latitude, longitude: this.state.region.longitude }}
                        title={this.state.locationName}
                        description={this.state.locationName}
                        onDragEnd={(location) => {
                            console.log("Update Location while marker drag ", location.nativeEvent.coordinate);
                            this.setState({
                                region: {
                                    latitudeDelta,
                                    longitudeDelta,
                                    latitude: location.nativeEvent.coordinate.latitude,
                                    longitude: location.nativeEvent.coordinate.longitude
                                }
                            })
                            AsyncStorage.setItem('latitude', location.nativeEvent.coordinate.latitude.toString())
                            AsyncStorage.setItem('longitude', location.nativeEvent.coordinate.longitude.toString())
                        }}
                    />
                </MapView>
                {/* </View> */}

                {/* <View style={{ width: width - 40, marginTop: 100, marginHorizontal: 20, backgroundColor: 'white', borderRadius: 5, height: 50, justifyContent: 'center', padding: 10, position: 'absolute' }}> */}
                <View style={{ flex: 1, width: width - 40, marginTop: 110, marginHorizontal: 20, borderRadius: 5, justifyContent: 'center', padding: 10, position: 'absolute' }}>
                    {/* <Text>{this.state.locationName}</Text> */}
                    <GooglePlacesAutocomplete
                        placeholder='Search'
                        minLength={2} // minimum length of text to search
                        autoFocus={true}
                        returnKeyType={'search'} // Can be left out for default return key 
                        listViewDisplayed={'auto'}    // true/false/undefined
                        fetchDetails={true}
                        onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                            // props.notifyChange(details.geometry.location);
                            console.log("search places data ", JSON.stringify(data));
                            console.log("search places details ", JSON.stringify(details));
                            this.setState({
                                region: {
                                    latitudeDelta,
                                    longitudeDelta,
                                    latitude: details.geometry.location.lat,
                                    longitude: details.geometry.location.lng
                                },
                                address:details.formatted_address
                            })
                            AsyncStorage.setItem('latitude', details.geometry.location.lat.toString())
                            AsyncStorage.setItem('longitude', details.geometry.location.lng.toString())
                            this.map.animateToRegion(this.state.region, 2000);
                        }}
                        query={{
                            key: 'AIzaSyDZRd7CisUH6tg733-02d57hQ23B1ANR1k',
                            language: 'en',
                            radius: 10000,
                            // types: '(cities)'
                        }}
                        GooglePlacesSearchQuery={{
                            rankby: 'distance',
                        }}
                        nearbyPlacesAPI='GooglePlacesSearch'
                        debounce={300}
                        onFail={(error) =>
                            console.log(error)
                        }
                        onNotFound={(error) =>
                            console.log(error)
                        }
                        autoFillOnNotFound={(error) =>
                            console.log(error)
                        }
                    />
                </View>

                <Button
                    title="SHARE LOCATION"
                    titleStyle={{ color: colors.white, fontFamily: fonts.Bold, fontSize: 15 }}
                    buttonStyle={{ marginHorizontal:20,marginBottom:10,height: 45, backgroundColor: colors.pinkbg, borderRadius: 36.5 }}
                    // onPress={() => this.props.navigation.goBack()}
                    onPress={() => {
                        var message = this.state.message
                        message.latitude = this.state.region.latitude
                        message.longitude = this.state.region.longitude
                        message.time = moment().unix()
                        this.sendMessage(message)
                    }}
                />

                


            </SafeAreaView>

        )
    }

    componentDidMount() {
        // GoogleGeocoder.init(GOOGLE_API_KEY);
        this._unsubscribe = this.props.navigation.addListener('focus', () => {

            Geolocation.getCurrentPosition(
                position => {
                    
                    console.log('location ', position);
                    let coordinate = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };
                    AsyncStorage.setItem('latitude', coordinate.latitude.toString());
                    AsyncStorage.setItem('longitude', coordinate.longitude.toString());
                    const region = {
                        latitudeDelta,
                        longitudeDelta,
                        latitude: coordinate.latitude,
                        longitude: coordinate.longitude
                    }
                    this.setState({ location: position,region:region });
                    this.map.animateToRegion(region,true)
                },
                error => {
                    Alert.alert(`Code ${error.code}`, error.message);
                    this.setState({ location: '' });
                    console.log(error);
                },
                {
                    accuracy: {
                        android: 'high',
                        ios: 'best',
                    },
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 10000,
                    distanceFilter: 0,
                    forceRequestLocation: true,
                    forceLocationManager: false,
                    showLocationDialog: true,
                },
            );

            console.log("route params =====> ", this.props.route.params);
            if(this.props.route.params != undefined){
                const {message,chatRoomId} = this.props.route.params
                this.setState({
                    message:message == undefined ? '' : message,
                    chatRoomId:chatRoomId == undefined ? '' : chatRoomId
                })
            }
        })

    }

    componentWillUnmount() {
        this._unsubscribe();
    }

 

    getAddress = async () => {
        AsyncStorage.multiGet(['latitude', 'longitude']).then(coordinate => {
            console.log("coordinate ", coordinate);
            var latitude = parseFloat(coordinate[0][1])
            var longitude = parseFloat(coordinate[1][1])
            console.log("latitude =====> ", latitude);
            console.log("longitude =====> ", longitude);

            GoogleGeocoder.from(latitude, longitude)
                .then(json => {
                    console.log("Google address ", json);
                    var addressComponent = json.results[0].address_components[0];
                    console.log("Google addressComponent ", addressComponent);
                    var formattedAddress = json.results[0].formatted_address;
                    console.log("Google formatted Address ", formattedAddress);
                    this.setState({ locationName: formattedAddress })
                }).catch(error => console.warn(error));
        })
    }

    /* Silver style */

    silverCustomStyle = [
        {
            elementType: "geometry",
            stylers: [{ color: "#f5f5f5" }],
        },
        {
            elementType: "labels.icon",
            stylers: [{ visibility: "off" }],
        },
        {
            elementType: "labels.text.fill",
            stylers: [{ color: "#616161" }],
        },
        {
            elementType: "labels.text.stroke",
            stylers: [{ color: "#f5f5f5" }],
        },
        {
            featureType: "administrative.land_parcel",
            elementType: "labels.text.fill",
            stylers: [{ color: "#bdbdbd" }],
        },
        {
            featureType: "poi",
            elementType: "geometry",
            stylers: [{ color: "#eeeeee" }],
        },
        {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#757575" }],
        },
        {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [{ color: "#e5e5e5" }],
        },
        {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [{ color: "#9e9e9e" }],
        },
        {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#ffffff" }],
        },
        {
            featureType: "road.arterial",
            elementType: "labels.text.fill",
            stylers: [{ color: "#757575" }],
        },
        {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#dadada" }],
        },
        {
            featureType: "road.highway",
            elementType: "labels.text.fill",
            stylers: [{ color: "#616161" }],
        },
        {
            featureType: "road.local",
            elementType: "labels.text.fill",
            stylers: [{ color: "#9e9e9e" }],
        },
        {
            featureType: "transit.line",
            elementType: "geometry",
            stylers: [{ color: "#e5e5e5" }],
        },
        {
            featureType: "transit.station",
            elementType: "geometry",
            stylers: [{ color: "#eeeeee" }],
        },
        {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#c9c9c9" }],
        },
        {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#9e9e9e" }],
        }
    ]

    /* Night Mode style */
    customStyle = [

        {
            elementType: 'geometry',
            stylers: [
                {
                    color: '#242f3e',
                },
            ],
        },
        {
            elementType: 'labels.text.fill',
            stylers: [
                {
                    color: '#746855',
                },
            ],
        },
        {
            elementType: 'labels.text.stroke',
            stylers: [
                {
                    color: '#242f3e',
                },
            ],
        },
        {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [
                {
                    color: '#d59563',
                },
            ],
        },
        {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [
                {
                    color: '#d59563',
                },
            ],
        },
        {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [
                {
                    color: '#263c3f',
                },
            ],
        },
        {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [
                {
                    color: '#6b9a76',
                },
            ],
        },
        {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [
                {
                    color: '#38414e',
                },
            ],
        },
        {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [
                {
                    color: '#212a37',
                },
            ],
        },
        {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [
                {
                    color: '#9ca5b3',
                },
            ],
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [
                {
                    color: '#746855',
                },
            ],
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [
                {
                    color: '#1f2835',
                },
            ],
        },
        {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [
                {
                    color: '#f3d19c',
                },
            ],
        },
        {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [
                {
                    color: '#2f3948',
                },
            ],
        },
        {
            featureType: 'transit.station',
            elementType: 'labels.text.fill',
            stylers: [
                {
                    color: '#d59563',
                },
            ],
        },
        {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [
                {
                    color: '#17263c',
                },
            ],
        },
        {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [
                {
                    color: '#515c6d',
                },
            ],
        },
        {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [
                {
                    color: '#17263c',
                },
            ],
        },
    ];


}
const mapStateToProps = (state) => {
    console.log("state response ", state);
    return {
        currentLocation: state.user.currentLocation,
    }
}

export default connect(mapStateToProps)(MapComponent)

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        // ...StyleSheet.absoluteFillObject,
        zIndex: 0,
        width: width,
        height: height - headerHeight,
        marginTop: headerHeight,
        zIndex: 0
    },
    MainContainer: {
        // position: 'absolute',
        top: 100,
        left: 0,
        right: 0,
        bottom: 0,
        height: height - 100,
        alignItems: 'center',
        justifyContent: 'flex-end',
        // backgroundColor:'red'
    },
    mapStyle: {
        // position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    }
});