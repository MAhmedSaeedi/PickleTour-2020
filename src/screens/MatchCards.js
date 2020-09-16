import React from 'react';
import { View, Text, Switch, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import Responsive from 'react-native-lightweight-responsive';
import {Icon} from 'native-base'
import TimeZone from 'react-native-timezone';
import moment from 'moment-timezone';


export default class MatchCards extends React.Component {

    constructor(props) {
        super(props);
        this.matchDate = ''
        this.matchTime=''
        this.state = {
            actScr: '1',
            test:false,
            buttonDisabled:true,
            checkCourt:false,
            checkPlayer1:false,
            checkPlayer2:false,
            checkPlayer3:false,
            checkPlayer4:false,
            testTime:'11:10',
            convertedDate:null,
            showWidget:true,
            player1:'',
            player2:'',
            player3:'',
            player4:''
        };
    }

    getTimeZone = async(date, zone) => {
        const timeZone = await TimeZone.getTimeZone().then(zone => zone);
        var eventZone    = moment.tz(date, zone);
        var localZone = eventZone.clone().tz(timeZone);
        let eventDate = this.convertDate(localZone)
        this.setState({convertedDate:eventDate})
        let str = moment(date).tz(timeZone).format('ha')
        var result = str.match(/[a-zA-Z]+|[0-9]+/g);
        var result2= result.join(' ')
        this.matchTime = result2.toUpperCase()+' '+(moment(date).tz(timeZone).format('z'))
        
        
    }   

    convertForTimeZone(date, zone){
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
    }

    componentDidMount(){
        
        this.convertForTimeZone(this.props.data.matchDate, this.props.timeZone)
        if(this.props.showMulti==true){
            if(this.props.data.one.player1==undefined){
                if(this.props.data.one.tName==undefined){
                    this.setState({
                        player1:this.props.data.one.fName,
                        player3:this.props.data.two.fName
                    })
                }
                else{
                    this.setState({
                        player1:this.props.data.one.tName,
                        player3:this.props.data.two.tName
                    })
                }
            }
            else{
                this.setState({player1:this.props.data.one.player1.fName,
                               player2:this.props.data.one.player2.fName,
                               player3:this.props.data.two.player1.fName,
                               player4:this.props.data.two.player2.fName
                })
            }
        }
        else{
            if(this.props.data.one.tName==undefined){
                this.setState({
                    player1: this.props.data.one.fName,
                    player3: this.props.data.two.fName
                })
            }
            else{
                this.setState({
                    player1: this.props.data.one.tName,
                    player3: this.props.data.two.tName
                })
            }
           
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
    
    showingAlert(){
        Alert.alert(
          'Match not started !',
          'Cannot start before the time of match.',
          [
            {},
            {},
            {text: 'OK',style:'cancel'},
          ],
          {cancelable: false},
        );
      }
    getTime(){
        const today = new Date();
        const h = today.getHours();
        const s = today.getSeconds();
        let m = today.getMinutes();
        m = (m < 10) ? ("0" + m) : m;
        let time = h+':'+m
        if(time>this.state.testTime){
            
        }
    }

    checkTime(userData, checkMulti, matchData){
        const {player4, player3, player2, player1}=this.state
        const data = this.props.data

        let players=null
        
        if(checkMulti){
            players =[player1,  player2, player3, player4]
        }else{
            players=[player1, player3]
        }
        const today = new Date();
        var month = '' + (today.getMonth() + 1)
        var day = '' + today.getDate()
        var year = today.getFullYear()
        if (month.length < 2) 
        month = '0' + month;
        if (day.length < 2) 
        day = '0' + day;
        const date = [day,month,year].join('/')
        const h = today.getHours();
        const s = today.getSeconds();
        let m = today.getMinutes();
        m = (m < 10) ? ("0" + m) : m;
        let time = h+':'+m      
       // console.log(this.props.tourType)
        this.props.navigation.navigate('ScoreCardScreen',{userData, checkMulti, players, tourId:this.props.tourId, tourName:this.props.tourName, divName:this.props.divName, courtNumber:data.court, type:this.props.tourType, address:this.props.address, bracket:this.props.bracket, matchId:data._id, matchData})
        // if(time>=this.props.data.matchTime ) //&& this.props.data.matchDate <= today
        // {
        //     this.props.navigation.navigate('ScoreCardScreen',{userData, checkMulti, players})
        // }
        // else{
        //     this.showingAlert()
        // }
    }
  
    render() {
        const data = this.props.data
        //console.log(data)
        const show = this.props.showMulti
        const { checkCourt, checkPlayer1, checkPlayer2, checkPlayer4, checkPlayer3, player1, player2, player3, player4 } =this.state
        const enabled = checkCourt==true && checkPlayer1==true && checkPlayer3==true
        const enabled2 = checkCourt==true && checkPlayer1==true && checkPlayer2==true && checkPlayer4==true && checkPlayer3==true

        return (
            <View style={styles.cardStyles}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', justifyContent:'center', alignContent:'center' }} >
        <Text style={{paddingHorizontal:5,paddingVertical:2,alignSelf:'center',justifyContent:'center',alignContent:'center',color:'#5D5D5D',fontFamily:'Lato-Bold', fontSize:Responsive.font(13)}}>Match No {this.props.location+1}</Text>
                    </View>
                </View>

                <View style={{flexDirection:'row',marginTop:10, justifyContent:'space-between'}}>
                    <View style={{flexDirection:'row', width:'50%'}}>
                        <View style={{flexDirection:'row', }}>
                            <Icon type="MaterialCommunityIcons" name="calendar-today"  style={{ fontSize:Responsive.font(14) ,color: '#585858', alignSelf:'center'}}/>
                            <Text style={{alignSelf:'center',fontSize:Responsive.font(11), color:'#585858', fontFamily:'Lato-Medium', fontWeight:'600', paddingLeft:5}}>{this.state.convertedDate}</Text>
                        </View>

                        <View style={{flexDirection:'row', marginLeft:15}}>
                            <Icon type="Ionicons" name="md-time"  style={{ fontSize:Responsive.font(14) ,color: '#585858', alignSelf:'center'}}/>
                            <Text style={{alignSelf:'center',fontSize:Responsive.font(11), color:'#585858', fontFamily:'Lato-Medium', fontWeight:'600', paddingLeft:5}}>{this.matchTime}</Text>
                        </View>
                    </View>

                    <View style={{justifyContent:'flex-end', width:'50%', flexDirection:'row'}}>
                        <View style={{flexDirection:'row', paddingHorizontal:7, borderRadius:15, backgroundColor:'#C2FFFF'}}>
                            <Text style={{marginRight:5,alignSelf:'center',color:'#585858',fontSize:Responsive.font(12), fontFamily:'Lato-Medium'}}>Court no. {data.court}</Text>
                            <Switch thumbColor={this.state.checkCourt? '#69C674':'#E9835D'} trackColor={{false:'#E9835D' , true:'#69C674' }}
                                value={this.state.checkCourt}  
                                onValueChange ={(checkCourt)=>this.setState({checkCourt})}
                            /> 
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
                            <Text style={styles.head1}>{this.state.player1}</Text>
                           
                            {this.state.player3.includes(('Winner of'))  || this.state.player1.includes(('Loser of')) ||this.state.player1.includes(('Final')) ?
                            null:
                            
                            <Switch thumbColor={this.state.checkPlayer1? '#69C674':'#E9835D'} trackColor={{false:'#E9835D' , true:'#69C674' }}
                                value={this.state.checkPlayer1}  
                                onValueChange ={(checkPlayer1)=>this.setState({checkPlayer1})}
                            />}
                        </View>



                       {this.state.player2.length>0 &&  <View style={styles.teamNames} >
                            <Text style={styles.head1}>{this.state.player2}</Text>
                            <Switch thumbColor={this.state.checkPlayer2? '#69C674':'#E9835D'} trackColor={{false:'#E9835D' , true:'#69C674' }}
                                value={this.state.checkPlayer2}  
                                onValueChange ={(checkPlayer2)=>this.setState({checkPlayer2})}
                            /> 
                        </View>}
                    </View>



                    <View style={{ width: '48%' }}>
                        <View style={styles.teamName} >
                            <Text style={styles.head}>Team B - </Text>
                            <Text style={styles.head}>Beta </Text>
                        </View>
                        <View style={styles.teamNames} >

                        <Text style={styles.head1}>{this.state.player3}</Text>
                        {this.state.player3.includes(('Winner of'))  || this.state.player1.includes(('Loser of')) ||this.state.player1.includes(('Final')) ?
                        null
                        
                        :
                        <Switch thumbColor={this.state.checkPlayer3? '#69C674':'#E9835D'} trackColor={{false:'#E9835D' , true:'#69C674' }}
                                value={this.state.checkPlayer3}  
                                onValueChange ={(checkPlayer3)=>this.setState({checkPlayer3})}
                        /> 
                        }
                        </View>

                       {this.state.player4.length>0 &&  <View style={styles.teamNames} >
                            <Text style={styles.head1}>{this.state.player4}</Text>
                            <Switch thumbColor={this.state.checkPlayer4? '#69C674':'#E9835D'} trackColor={{false:'#E9835D' , true:'#69C674' }}
                                value={this.state.checkPlayer4}  
                                onValueChange ={(checkPlayer4)=>this.setState({checkPlayer4})}
                            />
                        </View>}
                    </View>
                </View>
                <View style={{ height: 1, marginBottom: 10, marginTop: 5 }} />

                    
                    
                   {!show &&  <View style={{ flexDirection: 'row', width: '100%', marginRight: 10 ,justifyContent:'flex-end', marginBottom:5}} >
                    <TouchableOpacity disabled={!enabled} onPress={() =>  this.checkTime(this.props.navigation.state.params.item,show, data) }style={[styles.mySBtn,{backgroundColor: enabled?'#51C560':'#87DC92'}]}>
                            <Text style={styles.myStext}>Start Match</Text>
                        </TouchableOpacity>
                    </View>}
                    {show && <View style={{ flexDirection: 'row', width: '100%', marginRight: 10 ,justifyContent:'flex-end'}} >
                    <TouchableOpacity disabled={!enabled2} onPress={() =>  this.checkTime(this.props.navigation.state.params.item,show, data) }style={[styles.mySBtn,{backgroundColor: enabled2?'#51C560':'#87DC92'}]}>
                            <Text style={styles.myStext}>Start Match</Text>
                        </TouchableOpacity>
                    </View>}
            </View>

        );
    }
}
const styles = StyleSheet.create({
    cardStyles: {
        alignSelf:'center',
        width: '97%',
        backgroundColor: '#BBF1F1',
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
        marginBottom: 15
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
        backgroundColor: '#65B7B7',
        padding: 5
    },
    teamNames: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: '#C2FFFF',
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