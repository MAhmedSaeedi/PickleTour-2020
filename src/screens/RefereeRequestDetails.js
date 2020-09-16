import React from 'react';
import { ActivityIndicator, View, Text, TextInput, Dimensions, StyleSheet, ScrollView, FlatList, Modal, TouchableOpacity, BackHandler } from 'react-native';
import axios from 'axios'
import Responsive from 'react-native-lightweight-responsive';
import {Icon} from 'native-base'
import TimeZone from 'react-native-timezone';
import moment from 'moment-timezone';

export default class RefereeRequestDetails extends React.Component {
    static navigationOptions = {
        headerMode:'float',
        headerTitle:
            <Text style={{ alignSelf:'center', color: 'white',fontFamily:'Lato-Medium',fontSize:Responsive.font(20)  }}>Requested as Referee</Text>
    }
    constructor(props) {
        super(props);
        this.BracketData=''
        this.DivisionData=''
        this.startDate=''
        this.endDate=''
        this.state = {
            actScr: '1',
            tourData:[],
            dataLoaded:false,
            startDate:null,
            endDate:null,
            params:null,
            selectedValue:'',
            selectionModal:false,
            buttonDisabled:true,
            modalVisible:false,
            isSuccessFull:false,
            address:'',
            phoneNumber:'',
            incomData:false,
            submitted:false,
            arrayLocation:0,
            finallyComplete:false,
            disabledButton:true

        };
    }
  
    componentDidMount(){    
        this.backHandler = BackHandler.addEventListener("hardwareBackPress",this.backAction)
        const tournamentInfo = this.props.navigation.getParam('item')
        this.getTournamentData(tournamentInfo.tournamentId, tournamentInfo.tournamentStartDate, tournamentInfo.tEndDate)
        //console.log(tournamentInfo)
        // let date=this.convertDate(tournamentInfo.tournamentStartDate)
        // this.setState({startDate:date})

        // let endate=this.convertDate(tournamentInfo.tEndDate)
        // this.setState({endDate:endate})
    }

    backAction=()=>{
        this.props.navigation.goBack(null)
        return true    
    }

    componentWillUnmount(){
    this.backHandler.remove()  
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
        this.timeZone = zone
        const timeZone = await TimeZone.getTimeZone().then(zone => zone);
        var eventZone    = moment.tz(date, zone);
        var localZone = eventZone.clone().tz(timeZone);
        let eventDate = this.convertDate(localZone)
        if(this.startDate == ''){
            this.startDate = eventDate
            this.setState({startDate:eventDate})
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

   
    render() {
        const tournamentInfo = this.props.navigation.getParam('item')
        console.log(tournamentInfo)
        return (
            <View style={{flex:1, backgroundColor:'white'}}>
               

                    <View style={{ padding: 10 }}>
                        <FlatList
                            
                            data ={this.state.tourData}
                            extraData={this.props}
                            keyExtractor={item => item._id}
                            ListHeaderComponent={()=>(
                                <View>
                                        <View style={styles.cardStyles}>
                                        <View style={{ flexDirection: 'row' , paddingLeft:10, paddingTop:10}}>
                                            <View style={{ }} >
                                                <Text style={styles.inHead}>{tournamentInfo.tournamentName}</Text>
                                            </View>
                                        </View>
                                        
                                        <View style={{borderWidth:0.5,borderColor:'#D9D9D9', marginTop:10, marginRight:10, marginLeft:10}}></View>
                                        <View style={{flexDirection:'row', paddingTop:10, paddingLeft:10}}>
                                            <Icon type="MaterialIcons" name="date-range"  style={{ alignSelf:'center',fontSize:Responsive.font(14) ,color: '#585858'}}/>
                                            <Text style={{fontSize:Responsive.font(11), color:'#585858', fontFamily:'Lato-Medium', paddingLeft:5}}>{this.state.startDate} - {this.state.endDate}</Text>
                                        </View>

                                        <View style={{flexDirection:'row', paddingTop:10, paddingLeft:10}}>
                                            <Icon type="Entypo" name="location-pin"  style={{ alignSelf:'center',fontSize:Responsive.font(14) ,color: '#585858'}}/>
                                            <Text style={{fontSize:Responsive.font(11), width:'95%' ,color:'#585858', fontFamily:'Lato-Medium',  paddingLeft:5}}>{tournamentInfo.tournamentAddress}</Text>
                                        </View>
                                        <View style={{borderWidth:0.5,borderColor:'#D9D9D9', marginTop:10, marginRight:10, marginLeft:10}}></View>
                                        <View style={{ flexDirection: 'row', paddingTop: 10 , paddingLeft:10}}>
                                            <View style={{ flexDirection: 'row', width: '50%' }} >
                                                <Text style={styles.head}>Event Type : </Text>
                                                <Text style={styles.detail}>{tournamentInfo.type}</Text>
                                            </View>
                                        </View>

                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, paddingLeft:10 }}>
                                            <View style={{ flexDirection: 'row', width: '100%' }} >
                                                <Text style={styles.head}>Organizer : </Text>
                                                <Text style={styles.detail}>{tournamentInfo.organizerName}</Text>
                                            </View>
                                        </View>

                                        <View style={{ flexDirection: 'row', justifyContent: 'center', paddingTop:30, paddingBottom:23 }}>
                                            <View style={{ flexDirection: 'row', alignItems:'center'  }} >
                                                <Text style={styles.head}>Division : </Text>
                                                <TouchableOpacity disabled={this.state.disabledButton} onPress={()=>this.setState({selectionModal:true})} style={{flexDirection:'row', backgroundColor:'white',paddingLeft:5,justifyContent:'center', paddingVertical:2, paddingRight:10, borderColor:'#585858', borderWidth:0.5 }}>
                                                    {/* <Text style={{paddingLeft:5, color:'#474747', fontFamily:'Lato-Medium', fontSize:Responsive.font(11)}}>{tournamentInfo.bracketType=='Knock Out'?'Single Elimination':tournamentInfo.divisionName}</Text> */}
                                                    <Text style={{paddingLeft:5, color:'#474747', fontFamily:'Lato-Medium', fontSize:Responsive.font(11)}}>{tournamentInfo.divisionName}</Text>
                                                    {/* <Icon type="Entypo" name="chevron-small-down"  style={{ paddingLeft:10,alignSelf:'center',fontSize:Responsive.font(14) ,color: '#585858'}}/> */}
                                                </TouchableOpacity>
                                            </View>

                                            <View style={{alignItems:'center', justifyContent:'center', }}>
                                                <TouchableOpacity onPress={()=>this.setState({modalVisible:true})}  style={[styles.mySBtn,{backgroundColor: this.state.buttonDisabled?'#9FE8A9':'#48A080'}]} disabled={this.state.disabledButton}>
                                                    <Text style={styles.myStext}>Requested</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    

                                        <View>

                                        </View>
                                    
                                    </View>
                                </View>
                    
                            )}
                            
                            renderItem={({item})=>(
                                
                                <MatchCards navigation={this.props.navigation} data={item} />
                                
                                
                            
                            )}
                        />
                    </View>
            </View>

        );
    }
}
const styles = StyleSheet.create({
    cardStyles: {
        alignSelf:'center',
        width: '100%',
        backgroundColor:'#F1F1F1',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 3,
        marginBottom: 10
    },
    head: {
        color: '#585858',
        fontFamily: 'Lato-Bold',
        fontSize: Responsive.font(12)
    },
    inHead: {
        fontSize:Responsive.font(16), color:'#585858', fontFamily:'Lato-Bold'
    },
    detail:{
        fontSize:Responsive.font(11), color:'#585858', fontFamily:'Lato-Medium', alignSelf:'center'
    },
    mySBtn: {
        
        justifyContent:'center',
        alignSelf:'flex-end',
        paddingVertical:2,
        marginLeft:10,
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
        fontSize: Responsive.font(11),
        fontFamily:'Lato-Medium',
        color:'white',
        justifyContent:'center',
        alignSelf:'center'
    }


});