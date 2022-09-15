import React,{useEffect, useState} from 'react'
import { View, Text,StyleSheet,Keyboard } from 'react-native'
import Header from "../components/header"
import Button from '../components/button'
import OTPInputView from '@twotalltotems/react-native-otp-input'
import { colors } from '../../common/colors'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import Toast from 'react-native-simple-toast';
import { setUserInfo } from '../../redux/Actions/UserAction'

export default function ChangeNumber({navigation,route}) {
    const [state, setstate] = useState('')
    const data = useSelector(state => state.user.userInfo)
    const dispatch = useDispatch()

    useEffect(() => {
    //    setstate(route.params.toString())
    }, [])

    const change = () => {

        const parameter = {
            token : data.token,
            phone_number : '+' + route.params,
            verification_code : parseInt(state)
        }

        axios.post("http://squadvibes.onismsolution.com/api/updateUserNo",parameter)
        .then(res => {
            if(res.data.message === 'Phone No Updated!'){
                dispatch(setUserInfo({
                    ...data,
                    phone_number : route.params
                }))
                Toast.show('Number Updated Successfully')
                navigation.navigate('Setting')
            }else{
                Toast.show('Error' + res.data.message)
            }
        })
    }

    // console.log("BBB", state)

    return (
        <View style={{flex:1,backgroundColor:'white'}}>
            <Header 
                heading = "OTP"
                back={navigation}
            />
            <Text style={{paddingHorizontal: 25,fontSize:18}}>Enter OTP here.</Text>

            <OTPInputView
                selectionColor="white"
                ref={(ref) => { this.OtpInputView = ref }}
                style={{ width: '100%', height: 60, color:"black",paddingHorizontal:25,marginTop:15 }}
                pinCount={6}
                code={state} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                onCodeChanged={verificationCode => {
                    setstate( verificationCode )
                    if (verificationCode.length == 6) {
                        Keyboard.dismiss()
                    }
                }}
                autoFocusOnLoad={false}
                codeInputFieldStyle={{color:colors.pinkbg,fontSize:20}}
                codeInputHighlightStyle={styles.underlineStyleHighLighted}
                onCodeFilled={(verificationCode => {
                    setstate( verificationCode )

                    if (verificationCode.length == 6) {
                        Keyboard.dismiss()
                    }
                })}
                keyboardType="number-pad"
                returnKeyLabel='Done'
                returnKeyType='done'
                keyboardAppearance="light"
            />

            {/* <SearchBar
                // editable={false}
                containerStyle={{borderWidth: 0, width:'100%',backgroundColor:null,borderBottomColor: 'transparent',borderTopColor: 'transparent',paddingHorizontal: 18}}
                placeholder="Write here.."
                placeholderTextColor='#7B817E'
                onChangeText={(text) => setstate(text)}
                value={state}
                inputContainerStyle={{ padding:10,  alignContent:'center',alignItems:'center',backgroundColor: 'white', borderRadius: 45, elevation:2,borderColor:'gray',borderWidth:1 }}
                inputStyle={{ color: colors.BLACK, fontSize:15 }}
                searchIcon={false}
            /> */}

            <Button name='Verify' clicked={change}/>
            
        </View>
    )
}


const styles = StyleSheet.create({
})
