import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {Icon} from 'native-base'
import Responsive from 'react-native-lightweight-responsive';

class MyEventCards extends Component {
  constructor(props) {
    super(props);
    this.state = {
        newName:'',
        useNewName:false,
        startDate:null,
        endDate:null
    };
  }

  componentDidMount(){
    let date=this.convertDate(this.props.data.tStartDate)
    this.setState({startDate:date})
    let enddate = this.convertDate(this.props.data.tEndDate)
    this.setState({endDate:enddate})
    let name=this.props.data.tournamentName
    let index= ''
    let splitter = 4

    // let nameLength=this.convertString(name)
    // if(nameLength>40){
    //     index = name.split(' ').slice(0,splitter).join(' ');
    //     this.setState({newName:index, useNewName:true})
    // }
    }

    convertDate(date){
        var d= new Date(date)
        var month = '' + (d.getMonth() + 1)
        var day = '' + d.getDate()
        var year = d.getFullYear()
        if (month.length < 2) 
        month = '0' + month;
        if (day.length < 2) 
        day = '0' + day;
        return [day, month, year].join('/');
    }

    convertString(name){
        name = name.replace(/(^\s*)|(\s*$)/gi,"");
        name = name.replace(/[ ]{2,}/gi," ");
        name = name.replace(/\n /,"\n");
        return name.length;
    }

  render() {
    const data = this.props.data
    const type = this.props.type
    return (
        <View style={styles.cardStyles}>

        <View style={{  paddingVertical:10,alignSelf:'center', width:'95%',justifyContent:'center'}}>
            <Text style={{fontSize:Responsive.font(12), color:'#585858', fontFamily:'Lato-Bold'}}>{this.state.useNewName?this.state.newName:data.tournamentName}</Text>
        </View>

        <View style={{borderWidth:0.5,marginHorizontal:10,borderColor:'#9CE1EF'}}></View>
        <View style={{  paddingVertical:10,width:'95%', alignSelf:'center', justifyContent:'space-between', flexDirection:'row'}}>

            <View style={{flex:1, flexDirection:'row',  justifyContent: 'flex-start',}}>
                <Icon type="MaterialIcons" name="date-range"  style={{ alignSelf:'center',fontSize:Responsive.font(14) ,color: '#585858'}}/>
                <Text style={{fontSize:Responsive.font(11), color:'#585858', fontFamily:'Lato-Medium',alignSelf:'center', paddingLeft:5}}>{this.state.startDate} - {this.state.endDate}</Text>
            </View>
            {type!='League'? !data.isPaid  ? <View style={{flex:1, flexDirection:'row',justifyContent:'flex-end' }}>
                <Icon type="Entypo" name="back-in-time"  style={{ alignSelf:'center',fontSize:Responsive.font(14) ,color: '#2B94A9'}}/>
                <Text  style={{fontSize:Responsive.font(11), color:'#2B94A9', fontFamily:'Lato-Medium', alignSelf:'center', paddingLeft:5}}>Payment Pending</Text>
            </View>:
            <View style={{flex:1, flexDirection:'row',justifyContent:'flex-end' }}>
            <Icon type="MaterialIcons" name="done"  style={{ alignSelf:'center',fontSize:Responsive.font(14) ,color: '#2B94A9'}}/>
            <Text  style={{fontSize:Responsive.font(11), color:'#2B94A9', fontFamily:'Lato-Medium', alignSelf:'center', paddingLeft:5}}>Payment Done</Text>
        </View>:null}
        </View>
    </View> 
    );
  }
}

export default MyEventCards;

const styles = StyleSheet.create({
    cardStyles: {
        alignSelf:'center',
        marginHorizontal:10,
        width: '92%',
        borderRadius:3,
        backgroundColor: '#BDF3FE',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        justifyContent:'center',
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 3,
        marginBottom:10
    },
    head: {
        color: 'white',
        fontFamily: 'Lato-Bold',
        fontWeight: 'bold',
        fontSize: Responsive.font(12)
    },
    inHead: {
        color: '#DCDCDC',
        fontFamily: 'Lato-Bold',
        fontSize: Responsive.font(12)
    },
    mySBtn: {
        backgroundColor: 'white',
        padding: 4,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 10,
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


});