  import React from 'react'
  import { View, Text,ImageBackground,StatusBar,Image, TouchableOpacity} from 'react-native'
  
  export default function HeaderWithoutBack(props) {
      return (
          <View>
                <ImageBackground 
                    style={[{width:'100%',paddingTop: 35,height:230,alignItems:'center'}]} 
                    source={require('../../assets/homebg.png')} 
                    resizeMode="cover">
                    

                        <View style={ {position:'relative'}}>
                            <Image style={{
                                alignSelf: 'center',
                                height: 50,
                            }} resizeMode='contain' source={require('../../assets/logo_bird.png')} />
                            {props.heading &&
                                <Text style={{color : "black", textAlign:"center",marginTop:15, fontSize:20, fontFamily : "avenir-light"}}>
                                    {props.heading}</Text>
                            }
                        </View>


                        {props.right &&
                            <TouchableOpacity>
                                <Image
                                    style={{resizeMode:"contain", width:30, height:20, marginTop:20,marginRight:10}}
                                    source ={require("../../assets/right_top.png")}
                                />
                            </TouchableOpacity>
                        }
                      
                </ImageBackground>
          </View>
      )
  }
//   