import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity} from 'react-native'
import { Icon } from 'native-base'
import Responsive from 'react-native-lightweight-responsive'
import axios from 'axios';


class Notifications extends Component {
  constructor(props){
    super(props)
    this.state={
      date:'',
      time:''
    }
  }
  convertDate(date){
    const months =[
      'Jan',
      'Feb',
      'Mar',
      'April',
      'May',
      'June',
      'July',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'

    ]

    let newDate = date.split('-')
    let day = newDate[2]
    let month = months[newDate[1]]
    return [day, month, 'at'].join(' ')
  }

  componentDidMount(){
    
    let date = this.convertDate(this.props.data.date)
    let time = this.convertTime(this.props.data.time)
    this.setState({date, time})
  }

  convertTime(time){
    
    var hourEnd = time.indexOf(":");
    var minuteEnd = time.indexOf(":", hourEnd ); // 7

    var H = +time.substr(0, hourEnd);
    var h = H % 12 || 12;
    var ampm = (H < 12 || H === 24) ? "AM" : "PM";
    time = h + time.substr(hourEnd, minuteEnd+1) + ' '+ampm;
    return time
  }
 
  render() {
    const item = this.props.data
    let color =undefined
    if(item.isViewed==false){
      if(item.type=='Player')
        color='#DBF9FF'
      else
        color='#D5FFFF'
    }
    return (
      <View style={{
        flexDirection:'row',
        alignSelf:'center',
        borderBottomWidth:0.5,
        borderBottomColor:'#585858',
        width:'100%',
        backgroundColor:color,
        paddingTop:15,
        paddingBottom:15,
      }}> 
        {
            item.type == 'Player' ?
            item.isViewed==false ?
            <Icon type="Ionicons" name="ios-notifications"  style={{ marginLeft:20,fontSize:Responsive.font(30) ,color: '#585858', alignSelf:'center'}}/>
            :
            <Icon type="Ionicons" name="ios-notifications-outline"  style={{ marginLeft:20,fontSize:Responsive.font(30) ,color: '#585858', alignSelf:'center'}}/>
            :null

        }
        {
            item.type == 'Referee'? 
            item.isViewed==false ?
            <Icon type="Ionicons" name="ios-notifications"  style={{ marginLeft:20,fontSize:Responsive.font(30) ,color: '#585858', alignSelf:'center'}}/>
            :
            <Icon type="Ionicons" name="ios-notifications-outline"  style={{ marginLeft:20,fontSize:Responsive.font(30) ,color: '#585858', alignSelf:'center'}}/>
            :null

        }
        {/* {item.type == 'Referee' && <Icon type="Ionicons" name="ios-notifications"  style={{ marginLeft:8,fontSize:Responsive.font(25) ,color: '#5AACAC', alignSelf:'center'}}/>} */}
        {/* {item.type == 'Player' && <Icon type="Ionicons" name="ios-notifications"  style={{ marginLeft:8,fontSize:Responsive.font(25) ,color: '#db3c30', alignSelf:'center'}}/>} */}
          
          <View style={{flexDirection:'column', flex:1}}>
            <Text style={{ paddingLeft:20, fontFamily:'Lato-Bold', fontSize:Responsive.font(13) , color:'#585858'}}>{item.event}</Text>
            <Text style={{ paddingLeft:20, fontFamily:'Lato-Medium', fontSize:Responsive.font(11) , color:'#585858', paddingRight:20}}>{item.message}</Text>
            <Text style={{ paddingLeft:20, fontFamily:'Lato-Medium', fontSize:Responsive.font(11) , color:'#585858'}}>{this.state.date + " "+ this.state.time}</Text>
          </View>
      </View>
    )
  }
}

export default Notifications


const styles =  StyleSheet.create({
    cardStyles:{
        flexDirection:'row',
        alignSelf:'center',
        borderBottomWidth:0.5,
        borderBottomColor:'#585858',
        //borderRadius:10,
        //borderWidth:2,
        //borderColor:'#C0C0C0',
        //marginHorizontal:10,
        width:'100%',
       /// backgroundColor:isViewed?undefined:'#DBF9FF',
        paddingTop:15,
        paddingBottom:15,
        // justifyContent:'space-between',
        //marginBottom:10
    }
})