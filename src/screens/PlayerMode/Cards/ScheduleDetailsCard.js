import React, { Component } from 'react';
import { View, Text, Switch, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import Responsive from 'react-native-lightweight-responsive';
import {Icon} from 'native-base'

class ScheduleDetailsCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const schedule = this.props.data
    console.log(schedule)
    return (
        <View style={styles.cardStyles}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', justifyContent:'center', alignContent:'center' }} >
<Text style={{paddingVertical:2,alignSelf:'center',justifyContent:'center',alignContent:'center',color:'#5D5D5D',fontFamily:'Lato-Bold', fontSize:Responsive.font(13)}}>Match No {schedule.serial}</Text>
            </View>
        </View>
        {/* <View style={{flexDirection:'row'}}>
        <Text style={{color:'#5D5D5D',fontFamily:'Lato-Bold', fontSize:Responsive.font(11)}}>Referee Name : </Text>
        <Text style={{color:'#5D5D5D',fontFamily:'Lato-Medium', fontSize:Responsive.font(11)}}>Agenda Morara</Text>
        </View> */}
        <View style={{flexDirection:'row',marginTop:10, justifyContent:'space-between'}}>
            <View style={{flexDirection:'row', width:'50%'}}>
                <View style={{flexDirection:'row', }}>
                    <Icon type="MaterialCommunityIcons" name="calendar-today"  style={{ fontSize:Responsive.font(14) ,color: '#585858', alignSelf:'center'}}/>
                    <Text style={{alignSelf:'center',fontSize:Responsive.font(11), color:'#585858', fontFamily:'Lato-Medium', fontWeight:'600', paddingLeft:5}}>{schedule.date}</Text>
                </View>

                <View style={{flexDirection:'row', marginLeft:15}}>
                    <Icon type="Ionicons" name="md-time"  style={{ fontSize:Responsive.font(14) ,color: '#585858', alignSelf:'center'}}/>
                    <Text style={{alignSelf:'center',fontSize:Responsive.font(11), color:'#585858', fontFamily:'Lato-Medium', fontWeight:'600', paddingLeft:5}}>{schedule.time}</Text>
                </View>
            </View>

            <View style={{justifyContent:'flex-end', width:'50%', flexDirection:'row'}}>
                <View style={{flexDirection:'row', paddingHorizontal:7, borderRadius:15, backgroundColor:'#D8F4FA'}}>
                    <Text style={{marginRight:5,alignSelf:'center',color:'#585858',fontSize:Responsive.font(12), fontFamily:'Lato-Medium'}}>Court no. {schedule.court}</Text>
                 
                </View>
            </View>

        <View style={{justifyContent:'flex-end', flexDirection:'row'}}>
           
             


                
            </View>

        </View>


        <View style={{ height: 1,  marginBottom: 5, marginTop: 5 }} />
        <View style={{ flexDirection: 'row' }}>
            <View style={{ width: '48%', marginRight: '4%' }}>
                <View style={styles.teamName} >
                    <Text style={styles.head}>Team A - </Text>
                    <Text style={styles.head}>Alpha</Text>
                </View>
                
                
                
                <View style={styles.teamNames} >
                    <Text style={styles.head1}>{schedule.players}</Text>
                   
                  
                </View>



              
            </View>



            <View style={{ width: '48%' }}>
                <View style={styles.teamName} >
                    <Text style={styles.head}>Team B - </Text>
                    <Text style={styles.head}>Beta </Text>
                </View>
                <View style={styles.teamNames} >

                <Text style={styles.head1}>{schedule.opponent}</Text>
                </View>

               
            </View>
        </View>


    </View>

    );
  }
}

export default ScheduleDetailsCard;
const styles = StyleSheet.create({
    cardStyles: {
        alignSelf:'center',
        width: '97%',
        backgroundColor: '#BDF3FE',
        padding: 10,
        borderRadius:15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
        marginBottom: 15,
    },
    head: {
        color: 'white',
        fontFamily: 'Lato-Bold',
        fontSize: Responsive.font(12)
    },
    head1: {
        color: '#585858',
        fontFamily: 'Lato-Medium',
        fontSize: Responsive.font(12),
        alignSelf:'center'
    },
    inHead: {
        color: '#DCDCDC',
        fontFamily: 'Lato-Medium',
        fontSize: Responsive.font(12)
    },
    mySBtn: {
        
        color:'white',
        // s
        // borderColor:'white',
        padding: 4,
        justifyContent:'center',
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 20,
        alignContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 2,
    },
    mcde: {
        alignSelf:'center',
        justifyContent:'center',
        color: 'white',
        backgroundColor: '#5D5D5D',
        padding: 3,
        borderRadius: 5,
        paddingLeft: 10,
        paddingRight: 10,
        marginRight: 10,
        fontWeight: 'bold',
        height: 28,
        
        fontSize: Responsive.font(11)
    },
    teamName: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: '#999999',
        padding: 5
    },
    teamNames: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: '#D8F4FA',
        padding: 5,
        color: 'black',
        justifyContent:'space-between'
    },
    myStext:{
        color:'white',
        alignSelf:'center',
        fontFamily:'Lato-Medium',
        fontSize: Responsive.font(12)
    }


});