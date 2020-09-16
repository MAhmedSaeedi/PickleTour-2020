import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Icon } from 'native-base'
import Responsive from 'react-native-lightweight-responsive';


class TeamPlayerCards extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const data = this.props.data
    console.log(data)
    return (
      <View style={styles.cardStyles}>
          <Image style={{marginLeft:10, alignSelf:'center'}} source={require('../../../../assets/User_Icon.png')}/>
          <View style={{paddingLeft:20, alignSelf:'center'}}>
          <Text style={{fontSize:Responsive.font(12), fontFamily:'Lato-Bold', color:'#377884'}}>{data.fName}</Text>
          
          <View style={{flexDirection:'row'}}>
            <Icon type="MaterialIcons" name="email"  style={{marginRight:8,fontSize:Responsive.font(14) ,color: '#377884'}}/>
            <Text style={{fontSize:Responsive.font(11), fontFamily:'Lato-Medium', color:'#377884'}}>{data.email}</Text>            
          </View>
          
          <View style={{flexDirection:'row',}}>
            <Icon type="MaterialIcons" name="phone"  style={{marginRight:8,fontSize:Responsive.font(14) ,color: '#377884'}}/>
            <Text style={{fontSize:Responsive.font(11), fontFamily:'Lato-Medium', color:'#377884'}}>{data.phone}</Text>            
          </View>

        </View>
        
      </View>
    );
  }
}

export default TeamPlayerCards;

const styles = StyleSheet.create({
    
    cardStyles:{
        flexDirection:'row',
        alignSelf:'center',
        marginHorizontal:10,
        width: '92%',
        backgroundColor: '#BDF3FE',
        // height:100,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        
        
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        borderRadius:15,
        elevation: 3,
        marginBottom:10,
        paddingTop:10,
        paddingBottom:10
    },
    
})