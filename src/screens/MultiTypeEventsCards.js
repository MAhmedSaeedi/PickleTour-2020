import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base'
import Responsive from 'react-native-lightweight-responsive';
import TimeZone from 'react-native-timezone';
import moment from 'moment-timezone';
import axios from 'axios';


export default class MultiTypeEventsCards extends React.Component {

    constructor(props) {
        super(props);
        this.startDate=''
        this.endDate=''
        this.state = {
            newName:'',
            useNewName:false,
            convertedDate:'12/12/2020',
            endDate:'12/12/2020'
        };
    }
  
    componentDidMount(){
        // let date=this.convertDate(this.props.data.tournamentStartDate)
        // this.setState({convertedDate:date})
        // let enddate = this.convertDate(this.props.data.tEndDate)
        // this.setState({endDate:enddate})
        let tournamentInfo = this.props.data
        this.getTournamentData(tournamentInfo.tournamentId, tournamentInfo.tournamentStartDate, tournamentInfo.tEndDate)
        let name=this.props.data.tournamentName
        let index= ''
        let splitter = 4

        let nameLength=this.convertString(name)
        if(nameLength>40){
            index = name.split(' ').slice(0,splitter).join(' ');
            this.setState({newName:index, useNewName:true})
        }
    }

    getTournamentData(id, startDate, tEndDate){
    
        axios.get(`https://pickletour.appspot.com/api/tournament/gett/${id}`)
        .then((resp)=>{
            this.convertForTimeZone([startDate, tEndDate], resp.data.timeZone)
        })
    }

    convertForTimeZone(dateArray, zone){
        dateArray.forEach(date=>{
            var d= new Date(date)
            var month = '' + (d.getMonth() + 1)
            var day = '' + d.getDate()
            var year = d.getFullYear()
            if (month.length < 2) 
            month = '0' + month;
            if (day.length < 2) 
            day = '0' + day;
            let str =  [year, month, day].join('-');
            str = str + ' 00:00'
            this.getTimeZone(str, zone)
        })
    }

    getTimeZone = async(date, zone) => {
        const timeZone = await TimeZone.getTimeZone().then(zone => zone);
        var eventZone    = moment.tz(date, zone);
        var localZone = eventZone.clone().tz(timeZone);
        let eventDate = this.convertDate(localZone)
        if(this.startDate == ''){
            this.startDate = eventDate
            this.setState({convertedDate:eventDate})
        }
        else{
            this.endDate = eventDate
            this.setState({endDate:eventDate})
        }
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
        const item = this.props.data
        const show = this.props.show
        return (
            <View style={styles.cardStyles}>
                <View style={{ paddingVertical:10, alignSelf:'center', width:'95%',justifyContent:'center'}}>
                    <Text style={{fontSize:Responsive.font(13), color:'#585858', fontFamily:'Lato-Bold'}}>{this.state.useNewName?this.state.newName:item.tournamentName}</Text>
                </View>
                {/* Rows here */}

                <View style={{borderWidth:0.5,marginHorizontal:10,borderColor:'#99E1E1'}}></View>
                <View style={{ paddingVertical:10, width:'95%', alignSelf:'center', justifyContent:'space-between', flexDirection:'row'}}>
                    <View style={{flex:1, flexDirection:'row', alignSelf:'center'}}>
                        <Icon type="MaterialIcons" name="date-range"  style={{ alignSelf:'center',fontSize:Responsive.font(15) ,color: '#585858'}}/>
                        <Text style={{fontSize:Responsive.font(11), color:'#585858', fontFamily:'Lato-Medium', }}>  {this.state.convertedDate} - {this.state.endDate}</Text>
                    </View>


                    <View style={{flex:1, justifyContent:'center'}}>
                    <TouchableOpacity style={styles.mySBtn} onPress={()=>this.props.navigation.navigate('EventDetailsScreen',{item})}>
                                  
                                  <Text style={styles.myStext}>Manage</Text>
                  </TouchableOpacity>
                    </View> 
                </View>
            </View>

        );
    }
}
const styles = StyleSheet.create({
    cardStyles: {
        alignSelf:'center',
        borderRadius:3,
        marginHorizontal:10,
        width: '92%',
        backgroundColor: '#BBF1F1',
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
        fontSize: Responsive.font(13)
    },
    inHead: {
        color: '#DCDCDC',
        fontFamily: 'Lato-Medium',
        fontSize: Responsive.font(13)
    },
    mySBtn: {
        backgroundColor: 'white',
        justifyContent:'center',
        alignSelf:'flex-end',
        padding: 2,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 10,
        alignContent: 'flex-end',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 2,
    },
    myStext:{
        fontSize: Responsive.font(12),
        fontFamily:'Lato-Medium',
        color:'#7E7E7E',
        alignSelf:'center'
    }

});