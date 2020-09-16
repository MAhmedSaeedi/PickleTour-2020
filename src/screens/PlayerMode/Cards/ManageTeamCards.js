import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, } from 'react-native';
import Responsive from 'react-native-lightweight-responsive';
import { TouchableOpacity } from 'react-native-gesture-handler';

class ManageTeamCards extends Component {
  constructor(props) {
    super(props);
    this.state = {
        registeredPlayers:0,
        availableSlots:0,
        totalSlots:0,
        url:null
    };
  }
  componentDidMount(){
    const data = this.props.data
    // this.countPlayers(data.players, data.noOfPlayers)
    this.createUrl(data)
  }

  createUrl(data){
    let url= `https://pickletour.com/Team/Register/player/${data.tournamentId}/${data._id}/${data.ind}`
    this.setState({url})
  }

//   countPlayers(data, availableSlots){
//     let n =0
//     data.forEach(element=>{
//         n=n+1
//     })
//     this.setState({
//         availableSlots,
//         totalSlots:availableSlots+n
//     })
//   }

  render() {
    const data = this.props.data
    const fileName = this.props.fileName
    let n = 0
    data.players.forEach(e=>{
        n=n+1
    })
    let availableSlots = data.noOfPlayers
    let totalSlots = data.noOfPlayers+n
    
    return (
      <View style={styles.cardStyles}>
        <View style={{paddingHorizontal:10, paddingTop:15}}>
            <Text style={{color:'#377884' ,fontFamily:'Lato-Bold', fontSize:Responsive.font(14)}}>{data.tName}</Text>
        </View>
        <View style={{borderWidth:1,borderColor:'#9CE1EF', marginTop:10, marginRight:10, marginLeft:10, marginBottom:10}}></View>
        <View style={{paddingHorizontal:10}}>
            <View style={{flexDirection:'row', alignItems:'center'}}>
                <Text style={{color:'#377884' ,fontFamily:'Lato-Bold', fontSize:Responsive.font(12)}}>Event Name : </Text>
                <Text style={{color:'#377884' ,fontFamily:'Lato-Medium', width:'78%', fontSize:Responsive.font(11)}}>{data.tournamentName}</Text>
            </View>
            <View style={{flexDirection:'row', alignItems:'center'}}>
                <Text style={{color:'#377884' ,fontFamily:'Lato-Bold', fontSize:Responsive.font(12)}}>Division : </Text>
                <Text style={{color:'#377884' ,fontFamily:'Lato-Medium', fontSize:Responsive.font(11)}}>{data.divisionName}</Text>
            </View>
        </View>
        <View style={{borderWidth:1,borderColor:'#9CE1EF', marginTop:10, marginRight:10, marginLeft:10, marginBottom:10}}></View>
        <View style={{ flexDirection:'row', justifyContent:'space-between'}}>
            <View style={{width:'50%', flexDirection:'row'}}>
                <View style={{width:'50%',alignItems:'center'}}>
                    <Text style={{color:'#377884', borderBottomWidth:1, borderColor:'#377884', fontFamily:'Lato-Bold', fontSize:Responsive.font(10)}}>Total Slots</Text>
                    <Text style={{color:'#377884', fontFamily:'Lato-Bold', fontSize:Responsive.font(10)}}>{totalSlots}</Text>
                </View>
                <View style={{width:'50%',alignItems:'center'}}>
                    <Text style={{color:'#377884', borderBottomWidth:1, borderColor:'#377884', fontFamily:'Lato-Bold', fontSize:Responsive.font(10)}}>Available Slots</Text>
                    <Text style={{color:'#377884', fontFamily:'Lato-Bold', fontSize:Responsive.font(10)}}>{availableSlots}</Text>
                </View>
            </View>
            <View style={{flexDirection:'row', alignItems:'center'}}>
                <TouchableOpacity style={styles.mySBtn} onPress={()=>this.props.navigation.navigate('InviteTwo',{url:this.state.url})}>
                    <Text style={{color:'#377884', fontFamily:'Lato-Bold', fontSize:Responsive.font(10)}}>Invite</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.mySBtn} onPress={()=>this.props.navigation.navigate('PlayerList',{data:data.players,fileName})}>
                    <Text style={{color:'#377884', fontFamily:'Lato-Bold', fontSize:Responsive.font(10)}}>See Players</Text>
                </TouchableOpacity>
            </View>
        </View>
      </View>
    );
  }
}

export default ManageTeamCards;

const styles = StyleSheet.create({
    cardStyles:{
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
        
        justifyContent:'center',
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        borderRadius:15,
        elevation: 3,
        marginBottom:10,
        paddingBottom:10
    },
    mySBtn: {
        backgroundColor: 'white',
        padding: 2,
        marginBottom:Platform.OS=='ios'?4:0,
        
        justifyContent:'center',
        alignSelf:'center',
        alignItems:'center',
        width:Responsive.width(75),
        borderRadius: 10,
        marginRight:10,
        alignContent: 'flex-end',
        shadowColor: "#000",
        shadowOffset: {
            width: 3,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
    },
})