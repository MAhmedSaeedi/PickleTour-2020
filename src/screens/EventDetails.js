import React from 'react';
import { ActivityIndicator, View, Text, StyleSheet, FlatList, AsyncStorage, Dimensions, TouchableOpacity, BackHandler } from 'react-native';
import MatchCards from './MatchCards';
import Responsive from 'react-native-lightweight-responsive';
import {Icon} from 'native-base'
import axios from 'axios';
import TimeZone from 'react-native-timezone';
import moment from 'moment-timezone';
// import socketIOClient from "socket.io-client";
// const ENDPOINT = "https://pickletour.com/";

export default class EventDetails extends React.Component {
    static navigationOptions = {
        headerMode:'float',
        headerTitle:
            <Text style={{ alignSelf:'center', color: 'white',fontFamily:'Lato-Medium',fontSize:Responsive.font(20)  }}>Event Details</Text>
    }
    constructor(props) {
        super(props);
        this.data=''
        this.scheduleData=[]
        this.timeZone = ''
        this.round=[]
        this.finalSchedule=''
        this.startDate=''
        this.endDate=''
        this.state = {
            actScr: '1',
            tourData:[],
            dataLoaded:false,
            startDate:null,
            loading:true,
            showMessage:false,
            showMulti:null,
            endDate:null,
            showDescription:false
        };
    }
    async getItem(){
        try{
            let user  =await AsyncStorage.getItem('userProfileDataPlayer')
            this.data= JSON.parse(user)
        }catch (error){
            //console.log(error)
        }
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

    checkForResults(bracket, division, id, type, name){
      if(bracket =='Round Robin' || bracket=='Single Elimination'){
          axios.get(`https://pickletour.com/api/get/resultRS/${division}/${id}`)
          .then(resp=>{
            if(resp.data.length>0){
              const Obj ={
                result:this.finalSchedule,
                tournamentId:id,
                divisionName:division,
                firstPos:'',
                secondPos:'',
                thirdPos:'',
                isPublished:false,
                bracketType:bracket,
                type:type,
                name:name
  
              }
              axios.put('https://pickletour.com/api/resultRS/edit',Obj)
              .then(resp=>{
                //console.log(resp.data)
              })
            }
            else{
              const Obj ={
                result:this.finalSchedule,
                tournamentId:id,
                divisionName:division,
                firstPos:'',
                secondPos:'',
                thirdPos:'',
                isPublished:false,
                bracketType:bracket,
                type:type,
                name:name
  
              }
              axios.post('https://pickletour.com/api/resultRS/post',Obj)
              .then(resp=>{
               // console.log(resp.data)
              })
            }
          })
      }
      else if(bracket=='Double Elimination' || bracket=='Knock Out'){
        axios.get(`https://pickletour.com/api/get/resultBD/${division}/${id}`)
        .then(resp=>{
          if(resp.data.length>0){
            const Obj ={
              result:this.finalSchedule,
              tournamentId:id,
              divisionName:division,
              firstPos:'',
              secondPos:'',
              thirdPos:'',
              isPublished:false,
              bracketType:bracket,
              type:type,
              name:name

            }
            axios.put('https://pickletour.com/api/resultBD/edit',Obj)
            .then(resp=>{
             // console.log(resp.data)
            })
          }
          else{
            const Obj ={
              result:this.finalSchedule,
              tournamentId:id,
              divisionName:division,
              firstPos:'',
              secondPos:'',
              thirdPos:'',
              isPublished:false,
              bracketType:bracket,
              type:type,
              name:name

            }
            axios.post('https://pickletour.com/api/resultBD/post',Obj)
            .then(resp=>{
              //console.log(resp.data)
            })
          }
        })
      }
    }


    componentDidMount(){
        this.getItem()
        const tournamentInfo = this.props.navigation.getParam('item')
        //console.log(tournamentInfo)
        let decide = this.decisionForMatchCard(tournamentInfo.divisionName)
        this.getTournamentData(tournamentInfo.tournamentId, tournamentInfo.tournamentStartDate, tournamentInfo.tEndDate)        
        this.setState({showMulti:decide, tourData:[]})
        this.getData(tournamentInfo)
        this.backHandler = BackHandler.addEventListener("hardwareBackPress",this.backAction)
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

    decisionForMatchCard(divisionType){
        if(divisionType.includes('Men\'s Doubles') || divisionType.includes('Women\'s Doubles') || divisionType.includes('Mixed Doubles')){
            return true
        }
        else
            return false
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

    createSchedule(data, bracketType, type, divisionName){
    var finalSchedule=[]
      if(bracketType === "Box League"){
          for(var i=0; i<data.length; i++){
            var box=[]
            for(var j=0; j<data[i].length; j++){
              var round=[]
               for(var k=0; k<data[i][j].length; k++){
                   round.push({
                     one: {
                       player1:  data[i][j][k].match.one.team.tName,
                       score: ''
                     },
                     two: {
                      player2:  data[i][j][k].match.two.team.tName,
                      score: ''
                     }
                   })
              }
              box.push(round)
          }
  
            finalSchedule.push(box)
          }
      
      }else if(bracketType === "Double Elimination"){
  
        if(divisionName === "Men's Singles" || divisionName === "Women's Singles"){
          if(data.length > 0 && (data[0][1].length === (data[0][0].length)/2)){
            for(var i=0; i<data.length; i++){
              var bracket=[]
              for(var j=0; j<data[i].length; j++){
                var round=[]
                for(var k=0; k<data[i][j].length; k++){
                   if(j===0){
                     round.push({
                       one: {
                         fName: data[i][j][k].one.fName,
                         score: ''
                       },
                       two: {
                        fName: data[i][j][k].two.fName,
                        score: ''
                       }
                     })
                   }else{
                    round.push({
                      one: {
                        fName: '',
                        score: ''
                      },
                      two: {
                       fName: '',
                       score: ''
                      }
                    })
                   }
              }
              bracket.push(round)
            }
  
              finalSchedule.push(bracket)
            }
          }else{
            for(var i=0; i<data.length; i++){
              var bracket=[]
              for(var j=0; j<data[i].length; j++){
                var round=[]
                for(var k=0; k<data[i][j].length; k++){
                   if(j===0 || j===1){
                     round.push({
                       one: {
                         fName: data[i][j][k].one.fName,
                         score: ''
                       },
                       two: {
                        fName: data[i][j][k].two.fName,
                        score: ''
                       }
                     })
                   }else{
                    round.push({
                      one: {
                        fName: '',
                        score: ''
                      },
                      two: {
                       fName: '',
                       score: ''
                      }
                    })
                  }
              }
              bracket.push(round)
            }
  
              finalSchedule.push(bracket)
            }
          }
        }else{
          if(data.length > 0 && (data[0][1].length === (data[0][0].length)/2)){
            for(var i=0; i<data.length; i++){
              var bracket=[]
              for(var j=0; j<data[i].length; j++){
                var round=[]
                for(var k=0; k<data[i][j].length; k++){
                   if(j===0){
                    round.push({
                      one: {
                        fName: data[i][j][k].one.player1 && data[i][j][k].one.player2 ? data[i][j][k].one.player1.fName +" and "+ data[i][j][k].one.player2.fName : data[i][j][k].one.fName,
                        score: ''
                      },
                      two: {
                       fName: data[i][j][k].two.player1 && data[i][j][k].two.player2  ? data[i][j][k].two.player1.fName +" and "+ data[i][j][k].two.player2.fName : data[i][j][k].two.fName,
                       score: ''
                      }
                    })
                   }else{
                    round.push({
                      one: {
                        fName: '',
                        score: ''
                      },
                      two: {
                       fName: '',
                       score: ''
                      }
                    })
                   }
              }
              bracket.push(round)
            }
  
              finalSchedule.push(bracket)
            }
          }else{
            for(var i=0; i<data.length; i++){
              var bracket=[]
              for(var j=0; j<data[i].length; j++){
                var round=[]
                for(var k=0; k<data[i][j].length; k++){
                   if(j===0 || j===1){
                    round.push({
                      one: {
                        fName: data[i][j][k].one.player1 && data[i][j][k].one.player2 ? data[i][j][k].one.player1.fName +" and "+ data[i][j][k].one.player2.fName : data[i][j][k].one.fName,
                        score: ''
                      },
                      two: {
                       fName: data[i][j][k].two.player1 && data[i][j][k].two.player2  ? data[i][j][k].two.player1.fName +" and "+ data[i][j][k].two.player2.fName : data[i][j][k].two.fName,
                       score: ''
                      }
                    })
                   }else{
                    round.push({
                      one: {
                        fName: '',
                        score: ''
                      },
                      two: {
                       fName: '',
                       score: ''
                      }
                    })
                   }
              }
              bracket.push(round)
            }
  
              finalSchedule.push(bracket)
            }
          }
        }
  
          
      }else{  
        if(divisionName === "Men's Singles" || divisionName === "Women's Singles"){
            
          if(bracketType === "Knock Out"){
            
            if(data.length > 0 && (data[1].length === (data[0].length)/2)){
              for(var i=0; i<data.length; i++){
                var round=[]
                for(var j=0; j<data[i].length; j++){
                     if(i===0){
                       round.push({
                         one: {
                           fName: data[i][j].one.fName,
                           score: ''
                         },
                         two: {
                          fName: data[i][j].two.fName,
                          score: ''
                         }
                       })
                     }else{
                      round.push({
                        one: {
                          fName: '',
                          score: ''
                        },
                        two: {
                         fName: '',
                         score: ''
                        }
                      })
                     }
                }
  
                finalSchedule.push(round)
              }
            }else{
              for(var i=0; i<data.length; i++){
                var round=[]
                for(var j=0; j<data[i].length; j++){
                     if(i===0 || i === 1){
                       round.push({
                         one: {
                           fName: data[i][j].one.fName,
                           score: ''
                         },
                         two: {
                          fName: data[i][j].two.fName,
                          score: ''
                         }
                       })
                     }else{
                      round.push({
                        one: {
                          fName: '',
                          score: ''
                        },
                        two: {
                         fName: '',
                         score: ''
                        }
                      })
                     }
                }
  
                finalSchedule.push(round)
              }
            }
  
          }else{
            for(var i=0; i<data.length; i++){
              var round=[]
              for(var j=0; j<data[i].length; j++){
                     round.push({
                       one: {
                         fName: data[i][j].one.fName ? data[i][j].one.fName : data[i][j].one.tName,
                         score: ''
                       },
                       two: {
                        fName: data[i][j].two.fName ? data[i][j].two.fName : data[i][j].two.fName,
                        score: ''
                       }
                     })
              }
  
              finalSchedule.push(round)
            }
          }
          
        }else{
          
          if(bracketType === "Knock Out"){
            
            if(data.length > 0 && (data[1].length === (data[0].length)/2)){
              for(var i=0; i<data.length; i++){
                var round=[]
                for(var j=0; j<data[i].length; j++){
                     if(i===0){
                       round.push({
                         one: {
                           fName: data[i][j].one.player1.fName +" and "+ data[i][j].one.player2.fName,
                           score: ''
                         },
                         two: {
                          fName: data[i][j].two.player1.fName +" and "+ data[i][j].two.player2.fName,
                          score: ''
                         }
                       })
                     }else{
                      round.push({
                        one: {
                          fName: '',
                          score: ''
                        },
                        two: {
                         fName: '',
                         score: ''
                        }
                      })
                     }
                }
  
                finalSchedule.push(round)
              }
            }else{
              for(var i=0; i<data.length; i++){
                var round=[]
                for(var j=0; j<data[i].length; j++){
                     if(i===0 || i === 1){
                       round.push({
                         one: {
                           fName: data[i][j].one.player1 && data[i][j].one.player2 ? data[i][j].one.player1.fName +" and "+ data[i][j].one.player2.fName : data[i][j].one.fName,
                           score: ''
                         },
                         two: {
                          fName: data[i][j].two.player1 && data[i][j].two.player2  ? data[i][j].two.player1.fName +" and "+ data[i][j].two.player2.fName : data[i][j].two.fName,
                          score: ''
                         }
                       })
                     }else{
                      round.push({
                        one: {
                          fName: '',
                          score: ''
                        },
                        two: {
                         fName: '',
                         score: ''
                        }
                      })
                     }
                }
  
                finalSchedule.push(round)
              }
            }
  
          }else{
            for(var i=0; i<data.length; i++){
              var round=[]
              for(var j=0; j<data[i].length; j++){
                     round.push({
                       one: {
                         fName: data[i][j].one.player1 ? data[i][j].one.player1.fName +" and "+ data[i][j].one.player2.fName : data[i][j].one.tName,
                         score: ''
                       },
                       two: {
                        fName: data[i][j].two.player1 ? data[i][j].two.player1.fName +" and "+ data[i][j].two.player2.fName : data[i][j].two.tName,
                        score: ''
                       }
                     })
              }
  
              finalSchedule.push(round)
            }
          }
        }
      }
      this.finalSchedule=finalSchedule
    }

    getData= (tournamentInfo)=>{
        let bracketType = ''
        if(tournamentInfo.bracketType==''){
          bracketType = tournamentInfo.leagueType
        }else{
          bracketType = tournamentInfo.bracketType
        }
        let tournamentId = tournamentInfo.tournamentId
        let divisionName = tournamentInfo.divisionName
        
        var newData = [];
        var dummyData=[]
        let url=''        
     
        if(bracketType=='Round Robin' || bracketType=='Single Elimination' || bracketType=='Knock Out')
            url='https://pickletour.com/api/get/schedule'

        else if(bracketType=='Box League')
            url = 'https://pickletour.com/api/get/bschedule'

        else if(bracketType=='Flex Ladder')
            url = 'https://pickletour.com/api/get/fschedule'

        else if(bracketType=='Double Elimination')
            url ='https://pickletour.com/api/get/dschedule'
        
            
        axios.get(url+'/'+tournamentId+'/'+divisionName)
        .then((response)=>{
            
            if (response.data.length > 0 ) {
                newData = response.data[0].schedule
                //this.createSchedule(newData, bracketType, type, divisionName)
                // this.flatSchedule(newData, bracketType,type)
                newData.forEach(element => {

                    if(bracketType == 'Double Elimination' || bracketType =='Box League'){
                        element.map(item=>{
                            item.map(nItem=>{
                             if(nItem.refereeId == this.data.uid){
                               if(nItem.isComplete == false || nItem.isComplete == undefined)
                                 {
                                  dummyData.push(nItem)
                                 }
                             }  
                            })                      
                         })
                    }
                    else{
                        element.map(item=>{
                            if(item.refereeId == this.data.uid){
                              if(item.isComplete ==false || item.isComplete == undefined){
                                
                                dummyData.push(item)
                              }
                            }                        
                        })
                    }
                });
                if(dummyData.length>0){
                    this.setState({
                        tourData: dummyData,
                        dataLoaded:true,
                        loading:false
                    })
                }
                else{
                    this.setState({
                        dataLoaded:false,
                        loading:false,
                        showMessage:true
                        
                    })
                }
            }
            else {
                this.setState({
                    dataLoaded:false,
                    loading:false,
                    showMessage:true
                    
                })
            }
        }).catch((error)=>{
           // console.log(error)
        })
    }

    render() {
        
        const tournamentInfo = this.props.navigation.getParam('item')
        return(
            <View style={{ alignSelf:'center', paddingLeft:10, paddingRight:10, backgroundColor:'white'}}>
                <FlatList                            
                data ={this.state.tourData}
                extraData={this.props}
                keyExtractor={item => item._id}
                ListHeaderComponent={()=>{
                    return(
                        <View style={{backgroundColor:'white'}}>
                            <TouchableOpacity onPress={()=>this.setState({showDescription:!this.state.showDescription})} activeOpacity={1} style={{flexDirection:'row',paddingLeft:5, paddingRight:5,marginLeft:3, marginRight:3,paddingTop:8,paddingBottom:8,marginTop:10,
                                                        alignItems:'center',backgroundColor:'#5AACAC', borderRadius:5, justifyContent:'space-between', 
                                                        shadowColor: "#000",
                                                        shadowOffset: {
                                                            width: 0,
                                                            height: 2,
                                                        },
                                                        
                                                        shadowOpacity: 0.23,
                                                        shadowRadius: 2.62,
                                                        elevation: 3,
                                                        }}>
                            <View style={{flexDirection:'row'}}>
                                {this.state.showDescription?<Icon style={{ fontSize: 18, color:'white', paddingLeft:2, alignSelf:'center' }} name="caret-down" type="FontAwesome"/>:<Icon style={{ fontSize: 18, color:'white', paddingLeft:5, alignSelf:'center' }} name="caret-right" type="FontAwesome"/>}
                                <Text style={{ paddingLeft:5, width:'98%', fontFamily:'Lato-Bold', color:'white',fontSize:Responsive.font(13)}}>{tournamentInfo.tournamentName}</Text>
                            </View>
                        </TouchableOpacity>
                        {this.state.showDescription?<View style={{backgroundColor:'#F1F1F1',marginLeft:5, marginRight:5, borderBottomRightRadius:5,borderBottomLeftRadius:5,shadowColor: "#000",
                                                        shadowOffset: {
                                                            width: 0,
                                                            height: 2,
                                                        },
                                                        
                                                        shadowOpacity: 0.23,
                                                        shadowRadius: 2.62,
                                                        elevation: 3,}}>
                                         <View style={{flexDirection:'row', paddingTop:20, paddingLeft:20}}>
                                             <Icon type="MaterialIcons" name="date-range"  style={{ alignSelf:'center',fontSize:Responsive.font(14) ,color: '#585858'}}/>
                                             <Text style={{fontSize:Responsive.font(11), color:'#585858', fontFamily:'Lato-Medium', fontWeight:'600', paddingLeft:5}}>{this.state.startDate} - {this.state.endDate}</Text>
                                         </View>

                                         <View style={{flexDirection:'row', paddingTop:20, paddingLeft:20}}>
                                             <Icon type="Entypo" name="location-pin"  style={{ alignSelf:'center',fontSize:Responsive.font(14) ,color: '#585858'}}/>
                                             <Text style={{fontSize:Responsive.font(11), color:'#585858', fontFamily:'Lato-Medium', fontWeight:'600', paddingLeft:5}}>{tournamentInfo.tournamentAddress}</Text>
                                         </View>

                                        
                                         <View style={{borderWidth:0.5,borderColor:'#DDDDDD', marginTop:10, marginRight:10, marginLeft:10}}></View>

                                         <View style={{ flexDirection: 'row', paddingTop: 10 , paddingLeft:20, paddingRight:20}}>
                                             <View style={{ flexDirection: 'row', width: '50%' }} >
                                                 <Text style={styles.head}>Event Type : </Text>
                                                 <Text style={styles.detail}>{tournamentInfo.type}</Text>
                                             </View>
                                         </View>

                                         <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, paddingLeft:20, paddingRight:20 }}>
                                             <View style={{ flexDirection: 'row', width: '100%' }} >
                                                <Text style={styles.head}>Organizer : </Text>
                                                 <Text style={styles.detail}>{tournamentInfo.organizerName}</Text>
                                             </View>
                                         </View>

                                         <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 20, paddingTop:10, paddingBottom:10, paddingRight:10 }}>
                                             <View style={{ flexDirection: 'row', width: '100%' }} >
                                                 <Text style={styles.head}>Division : </Text>
                                                 <Text style={styles.detail}>{tournamentInfo.divisionName}</Text>
                                             </View>
                                           </View>
        
                        </View>:null}

                        <View style={{borderWidth:0.5,borderColor:'#E2E2E2', marginTop:10, marginRight:10, marginLeft:10, marginBottom:10}}></View>
                        </View>
                    )
                }}
                stickyHeaderIndices={[0]}
                ListEmptyComponent={()=>
                    {
                        if(this.state.loading){
                            return <View style={{width:100000, alignSelf:'center', paddingTop:'50%'}}>
                                <ActivityIndicator size='large'/>
                            </View>
                        }
                        else if(this.state.showMessage){
                            return <View style={{width:1000000, alignSelf:'center', paddingTop:'50%'}}>
                                <Text style={{fontFamily:'Lato-Bold',alignSelf:'center',fontSize:Responsive.font(20)}}>Schedule not found !</Text>
                            </View>
                        }
                    }
                }

                showsVerticalScrollIndicator={false}
                renderItem={({item, index})=>
                {
                    if(item.isComplete == undefined || item.isComplete == false){
                        return <MatchCards navigation={this.props.navigation} data={item} location={index} timeZone={this.timeZone} showMulti={this.state.showMulti} tourId={tournamentInfo.tournamentId} tourName={tournamentInfo.tournamentName} divName={tournamentInfo.divisionName} tourType={tournamentInfo.type} address={tournamentInfo.tournamentAddress} bracket={tournamentInfo.bracketType}/>
                    }
                }
                
                }
            />
            </View>

        );
        // return (
        //     <View style={{flex:1, backgroundColor:'white'}}>
                
                    

        //             <View style={{ paddingTop: 10, paddingLeft:10, paddingRight:10 }}>
        //             <View>
        //                 <View style={styles.cardStyles}>
        //                                 <View style={{ flexDirection: 'row' , paddingLeft:10, paddingTop:10}}>
        //                                     <View style={{ }} >
        //                                         <Text style={styles.inHead}>{tournamentInfo.tournamentName}</Text>
        //                                     </View>
        //                                 </View>
        //                                 <View style={{borderWidth:0.5,borderColor:'#CAECDF', marginTop:10, marginRight:10, marginLeft:10}}></View>
                                        
        //                                 <View style={{flexDirection:'row', paddingTop:10, paddingLeft:10}}>
        //                                     <Icon type="MaterialIcons" name="date-range"  style={{ alignSelf:'center',fontSize:Responsive.font(14) ,color: '#585858'}}/>
        //                                     <Text style={{fontSize:Responsive.font(11), color:'#585858', fontFamily:'Lato-Medium', fontWeight:'600', paddingLeft:5}}>{this.state.startDate} - {this.state.endDate}</Text>
        //                                 </View>

        //                                 <View style={{flexDirection:'row', paddingTop:10, paddingLeft:10}}>
        //                                     <Icon type="Entypo" name="location-pin"  style={{ alignSelf:'center',fontSize:Responsive.font(14) ,color: '#585858'}}/>
        //                                     <Text style={{fontSize:Responsive.font(11), color:'#585858', fontFamily:'Lato-Medium', fontWeight:'600', paddingLeft:5}}>{tournamentInfo.tournamentAddress}</Text>
        //                                 </View>

                                        
        //                                 <View style={{borderWidth:0.5,borderColor:'#CAECDF', marginTop:10, marginRight:10, marginLeft:10}}></View>

        //                                 <View style={{ flexDirection: 'row', paddingTop: 10 , paddingLeft:10}}>
        //                                     <View style={{ flexDirection: 'row', width: '50%' }} >
        //                                         <Text style={styles.head}>Event Type : </Text>
        //                                         <Text style={styles.detail}>{tournamentInfo.type}</Text>
        //                                     </View>
        //                                 </View>

        //                                 <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, paddingLeft:10 }}>
        //                                     <View style={{ flexDirection: 'row', width: '100%' }} >
        //                                         <Text style={styles.head}>Organizer : </Text>
        //                                         <Text style={styles.detail}>{tournamentInfo.organizerName}</Text>
        //                                     </View>
        //                                 </View>

        //                                 <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 10, paddingTop:10, paddingBottom:10 }}>
        //                                     <View style={{ flexDirection: 'row', width: '100%' }} >
        //                                         <Text style={styles.head}>Division : </Text>
        //                                         <Text style={styles.detail}>{tournamentInfo.divisionName}</Text>
        //                                     </View>
        //                                 </View>
                                    
                                    
        //                             </View>

        //                             <View style={{ height: 1, backgroundColor: '#E2E2E2', marginTop: 0, marginBottom: 15 }} />
        //                         </View>
        //                 <View style={{paddingBottom:Dimensions.get('window').height/1.5}}>
        //                 <FlatList
                            
        //                     data ={this.state.tourData}
        //                     extraData={this.props}
        //                     keyExtractor={item => item._id}
        //                     ListFooterComponent={
        //                         <View style={{marginBottom:Dimensions.get('window').height>=700?70:150}}></View>
        //                     }
        //                     ListEmptyComponent={()=>
        //                         {
        //                             if(this.state.loading){
        //                                 return <ActivityIndicator size='large'/>
        //                             }
        //                             else if(this.state.showMessage){
        //                                 return <Text style={{fontFamily:'Lato-Bold',alignSelf:'center',fontSize:Responsive.font(20)}}>Schedule not found !</Text>
        //                             }
        //                         }
        //                     }

        //                     showsVerticalScrollIndicator={false}
        //                     renderItem={({item, index})=>
        //                     {
        //                         if(item.refereeId==this.data.uid){
        //                             return <MatchCards navigation={this.props.navigation} data={item} location={index} showMulti={this.state.showMulti}/>
        //                         }
        //                     }
                            
        //                     }
        //                 />
        //                 </View>
        //             </View>
        //     </View>

        // );
    }
}
const styles = StyleSheet.create({
    cardStyles: {
        alignSelf:'center',
        width: '100%',
        borderRadius:3,
        backgroundColor:'#DBFFF1',
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
        fontSize:Responsive.font(14), color:'#585858', fontFamily:'Lato-Bold'
    },
    detail:{
        fontSize:Responsive.font(11), color:'#585858', fontFamily:'Lato-Medium'
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