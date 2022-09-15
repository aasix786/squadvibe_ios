import React, { PureComponent, Component } from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    Text,
    StyleSheet,
} from 'react-native';
import { colors, fonts,resetStackAndNavigate } from '../../common/colors'
import { HeadingText } from '../../common/HeadingText'
import { Input, Slider, SearchBar } from 'react-native-elements'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { setGroupRadius, setGroupZipCode,setGroupCity } from '../../redux/Actions/SquadAction'
import { connect } from 'react-redux'
import Toast from 'react-native-simple-toast';
import ApiHelper from '../../Networking/NetworkCall'
import Loader from '../../common/Loader';
import Header from '../components/header';
import Geolocation from '@react-native-community/geolocation';

class DetermineLocationComponent extends PureComponent {

    constructor() {
        super()
        this.state = {
            code: '',
            isCheck: false,
            birthDate: '',
            images: ['', '',],
            selectedIndex: -1,
            search: '',
            radius: 10,
            address: '',
            squad_id:'',
            isFromMySquad:'',
            zip_code:'',
            city:'',
            loading:false
        }
    }

    updateSearch = (search) => {
        this.setState({ search });
    };

    componentDidMount(){
     
    }

    getlocationanmefromltlng = async () => {
        let placename;
        let latlng = this.state.aregion.latitude + "," + this.state.aregion.longitude;
        var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latlng + "&key=AIzaSyCAcgEQMvho7rnMg-cV7wLEZjJLoH50ehk";
        await fetch(url, { method: 'GET' }).then(res => res.json()).then((res) => {
          let mcountry;
          let mstate;
          let mcity;
          let zipCode;

          res.results.forEach(element => {
           var mainarr = element.address_components;
            for (let i = 0; i < mainarr.length; i++) {
              if (mainarr[i].types.includes('country')) {
                mcountry = mainarr[i].long_name?mainarr[i].long_name:mcountry;
              }
              if (mainarr[i].types.includes('administrative_area_level_1')) {
                mstate = mainarr[i].long_name?mainarr[i].long_name:mstate;
              }
              if (mainarr[i].types.includes('locality')) {
                mcity = mainarr[i].long_name?mainarr[i].long_name:mcity;
              }
            }
            zipCode = getAddressComponent(element.address_components, placeAddresCompoponent.ZIP_CODE)
          });
          if (res.results[0]) {
            placename = res.results[0].formatted_address;
          } else {
            placename = " ";
          }
          this.setState({
            country: mcountry,
            state: mstate,
            city: mcity,
            formattedadress: placename,
            selectedlocatiom: placename,
            location : placename,
            zip_code : '0'
          });
          this.placesRef && this.placesRef.setAddressText(placename)
          this.props.setGroupCity(mcity)
          this.props.setGroupZipCode('0')
        }).catch((ers) => {
          console.warn(ers);
        });
      };

    getCurrentLocation = () => {
        Geolocation.getCurrentPosition((position) => {
            this.setState({
              aregion: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.025,
                longitudeDelta: 0.025
              },
            }, () => this.getlocationanmefromltlng())
        },(error) => {
        
          this.setState({ error: error.message })
        },
        { enableHighAccuracy: true, timeout: 200000, forceRequestLocation: true, showLocationDialog: true, });
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: colors.white }}>
                <Header back ={this.props.navigation} heading="Edit Location"/>

                <View style={{ paddingHorizontal: 16,marginTop:-70 }}>
                   
                    <View style={{ marginTop: 15 }}>
                      
                        <View style={{marginTop:5,zIndex:3, flexDirection: 'row', justifyContent: 'space-between', alignItems:'center'}}>
                            <HeadingText title={'Search Location'} style={{ marginTop: 0, fontSize: 14, color: colors.black, fontFamily: fonts.Bold }} />
                            <TouchableOpacity style={{backgroundColor:colors.whitesmoke,elevation:8, borderRadius:5, paddingVertical:6,paddingHorizontal:8}} onPress={this.getCurrentLocation}>
                                <Text style={{fontSize:12}}>Current location</Text>
                            </TouchableOpacity>
                        </View>


                        <View style={{
                            flexDirection: 'row',
                            position: 'absolute',
                            borderWidth: 1,
                            backgroundColor: 'white',
                            top:40,
                            borderRadius: 3, borderWidth: 1, borderColor: colors.searchBorderColor,
                            zIndex:2
                        }}>

                            <Image source={require('../../assets/search_ic.png')} style={{ marginLeft: 8, marginVertical: 15 }} />
                            {this.GooglePlacesInput()}
                        </View>
                    </View>

                    <View style={{ marginTop: 70,zIndex:1 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <HeadingText title={'Search Radius'} style={{ marginTop: 20, fontSize: 14, color: colors.black, fontFamily: fonts.Bold }} />
                                <HeadingText title={`${this.state.radius} km`} style={{ marginTop: 20, fontSize: 14, color: colors.pinkbg, fontFamily: fonts.Bold }} />
                            </View>
                            <View style={{ marginTop: 15 }}>
                                <Slider
                                    value={this.state.radius}
                                    maximumValue={100}
                                    style={{ zIndex: 5 }}
                                    thumbTintColor={colors.pinkbg}
                                    maximumTrackTintColor={'#D3CEC0'}
                                    minimumTrackTintColor={colors.pinkbg}
                                    thumbStyle={{ width: 25, height: 25 }}
                                    onValueChange={(value) => {
                                        this.setState({
                                            radius: parseInt(value)
                                        })
                                    }}
                                />
                            </View>
                        </View>
                </View>

                <TouchableOpacity style={styles.bottomView} activeOpacity={0.5} onPress={() => {
                    if (!this.state.city) {
                        Toast.show("You have not selected Location!")
                    } else {
                        if (this.state.city && this.state.zip_code) {
                            this.props.navigation.navigate('ManageSquad', { location : {city:this.state.city, zip_code:this.state.zip_code, radius : this.state.radius}, isFromEditLocation: true })
                        } else {
                            Toast.show('Please search your location')
                        }
                    }
                }}>

                    <Text style={styles.textStyle}>Next</Text>
                    {/* <Image source={require('../../assets/button_white_arrow.png')} style={{
                        position: 'absolute',
                        right: 20,
                        top: 18
                    }} /> */}

                </TouchableOpacity>

                <Loader loading={this.state.loading}/>
            </View>
        )
    }

    GooglePlacesInput = () => {
        return (
            <View style={{
                flex: 1, flexDirection: 'row', marginTop: 0,
                borderRadius: 5, justifyContent: 'center', alignItems: 'center',
                marginHorizontal: 5,
            }}>


                <View style={{ flex: 1 }}>
                    <GooglePlacesAutocomplete
                        placeholder='Type in Zip or City'
                        minLength={2} // minimum length of text to search
                        autoFocus={true}
                        returnKeyType={'search'} // Can be left out for default return key 
                        fetchDetails={true}
                        onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                            // props.notifyChange(details.geometry.location);
                            var zipCode = getAddressComponent(details.address_components, placeAddresCompoponent.ZIP_CODE)
                            var city = getAddressComponent(details.address_components, placeAddresCompoponent.CITY)
                            var coutry = getAddressComponent(details.address_components, placeAddresCompoponent.COUNTRY)
                            var state = getAddressComponent(details.address_components, placeAddresCompoponent.STATE)
                            if (this.state.isFromMySquad !== undefined && this.state.isFromMySquad) {
                                var city_name = ''
                                if (city != undefined) {
                                    city_name = city
                                } else if (state != undefined) {
                                    city_name = state
                                } else if (coutry != undefined) {
                                    city_name = coutry
                                }
                                this.setState({
                                    city:city_name,
                                    zip_code:zipCode,
                                })
                            } else {
                                // alert('hii')
                                var city_name = ''
                                if (city != undefined) {
                                    city_name = city
                                    this.props.setGroupCity(city)
                                } else if (state != undefined) {
                                    city_name = state
                                    this.props.setGroupCity(state)
                                } else if (coutry != undefined) {
                                    city_name = coutry
                                    this.props.setGroupCity(coutry)
                                }

                                this.setState({
                                    city:city_name,
                                    zip_code:zipCode != '' ? zipCode : '0',
                                })
                                if (zipCode.trim() != ''){
                                    this.props.setGroupZipCode(zipCode)
                                } else {
                                    this.props.setGroupZipCode('0')
                                }
                                
                            }
                            

                        }}
                        query={{
                            key: 'AIzaSyDZRd7CisUH6tg733-02d57hQ23B1ANR1k',
                            language: 'en',
                            radius: 10000,
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
                        ref={ref => {this.placesRef = ref}}

                    />
                </View>
            </View>
        );
    }

    callUpdateSquadInfo = () => {
        this.setState({ loading: true })
        var formdata = new FormData();
        formdata.append("token", this.props.userInfo.token);
        formdata.append("squad_id", this.state.squad_id);
        formdata.append("zip_code", this.state.zip_code);
        formdata.append("city", this.state.city);
        formdata.append("distance", this.state.radius);

        ApiHelper.post('updateSquadInfo',formdata).then(response => {
          if (response.status == 200) {
            this.setState({ loading: false })
            if (response.data.status == 'SUCCESS') {
              if (response.data.message) {
                Toast.show(response.data.message)
              }
              this.props.navigation.navigate('MySquad')
            } else {
                console.error(response.data.message);
                if (response.data.message) {
                    Toast.show(response.data.message)
                }
                if (response.data.is_token_expired && Boolean(response.data.is_token_expired)) {
                    
                    resetStackAndNavigate(this.props.navigation, 'Login')
                }
            }
          }
        }).catch((error) => {
          this.setState({ loading: false })
          console.error(error);
          Toast.show(error.message)
        })
      }
}

const mapStateToProps = (state) => {
    return {
        interest: state.user.interest,
        group_interest: state.manage_squad.group_interest,
        userInfo: state.user.userInfo,
        city: state.manage_squad.group_city,
        zip_code: state.manage_squad.group_zipCode,
        distance: state.manage_squad.group_radius,
    };
};

const mapDispatchToProps = (dispatch) => {
    return ({
        setGroupCity: (data) => dispatch(setGroupCity(data)),
        setGroupZipCode: (data) => dispatch(setGroupZipCode(data)),
        setGroupRadius: (data) => dispatch(setGroupRadius(data)),
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(DetermineLocationComponent);

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
        height: 50,
        backgroundColor: colors.pinkbg,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 25,
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
    }
})

export let placeAddresCompoponent = {
    ZIP_CODE: 'postal_code',
    COUNTRY: 'country',
    STATE: 'administrative_area_level_1',
    CITY: 'administrative_area_level_2',
    TOWN: 'sublocality_level_1',
    AREA: 'sublocality_level_2',
    NEAREST_ROAD: 'route'
}


export function getAddressComponent(address_components, key) {
    var value = '';
    var postalCodeType = address_components.filter(aComp =>
        aComp.types.some(typesItem => typesItem === key))
    if (postalCodeType != null && postalCodeType.length > 0)
        value = postalCodeType[0].long_name
    return value;
}