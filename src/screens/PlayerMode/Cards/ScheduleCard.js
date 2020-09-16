import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Responsive from 'react-native-lightweight-responsive';



class ScheduleCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
        <View style={styles.cardStyles}>
            <Text style={{marginLeft:10,fontSize:Responsive.font(12), color:'#585858', fontFamily:'Lato-Medium'}}>Round</Text>
            <TouchableOpacity onPress={()=> this.props.navigation.navigate('RoundSchedule')} style={styles.mySBtn}><Text style={{color:'#7E7E7E',fontFamily:'Lato-Medium', fontSize:Responsive.font(11)}}>See Schedule</Text></TouchableOpacity>
        </View>
        
    );
  }
}

export default ScheduleCard;

const styles = StyleSheet.create({
    
    cardStyles:{
        flexDirection:'row',
        alignSelf:'center',
        marginHorizontal:10,
        width: '95%',
        backgroundColor: '#BDF3FE',
        // height:100,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        
        
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        borderRadius:5,
        elevation: 3,
        marginBottom:10,
        paddingTop:10,
        paddingBottom:10,
        justifyContent:'space-between'

    },
    mySBtn: {
        backgroundColor: 'white',
        padding: 2,
        justifyContent:'center',
        alignSelf:'center',
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 10,
        marginRight:10,
        alignContent: 'flex-end',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
    },
    
})