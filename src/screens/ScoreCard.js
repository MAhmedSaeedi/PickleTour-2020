import React, { Component } from 'react';
import { Alert,Modal,View, Text,BackHandler,ImageBackground,StatusBar , TouchableOpacity, Image,Dimensions, ActivityIndicator} from 'react-native';
import { RadioGroup} from 'react-native-btr';
import { CheckBox, ListItem, Icon } from 'native-base'
import Responsive from 'react-native-lightweight-responsive';
import Orientation from 'react-native-orientation-locker';
import io from "socket.io-client";
const ENDPOINT = "https://pickletour.com/";
import axios from 'axios'

let padToTwo = (number) => (number <= 9 ? `0${number}`: number);

class ScoreCard extends Component {
  
  constructor(props) {
    

    super(props);
    this.playingSide=''
    this.interval=null
    this.bracketType=''
    this.socket=''
    this.matchId=''
    this.TargetSelected = 11
    this.msg=''
    this.state = {
      currentRound:'',
      nextRound:false,
      Round1TeamAScore:0,
      Round1TeamBScore:0,

      Round2TeamAScore:0,
      Round2TeamBScore:0,

      Round3TeamAScore:0,
      Round3TeamBScore:0,

      radioButtons:[
        {
          label:'Left',
          value:'left',
          checked: true,
          disabled:false,
          flexDirection:'row',
          size:11
        },
        {
          label:'Right',
          value:'right',
          checked: false,
          disabled:false,
          flexDirection:'row',
          size:11
        }],
      pointsButton:[
        {
          label:'11',
          value:11,
          checked:true,
          disabled:false,
          flexDirection:'row',
          size:11
        },
        {
          label:'15',
          value:15,
          checked:false,
          disabled:false,
          flexDirection:'row',
          size:11
        },
        {
          label:'21',
          value:21,
          checked:false,
          disabled:false,
          flexDirection:'row',
          size:11
        },
      ], 

      startClicked:false,
      start:false,
      min:0,
      sec:0,
      msec:0,
      ballpos1:false,
      ballpos2:false,
      ballpos3:false,
      ballpos4:false,
      GameStart:true,
      Team1Serving:false,
      Team2Serving:false,
      Serve:0,
      ScoreTeam1:0,
      ScoreTeam2:0,
      Section1:'Player #1',
      Section2:'Player #2',
      Section3:'Player #3',
      Section4:'Player #4',
      TeamFormation:'',
      Player1Name:'George set',
      Player2Name:'B',
      Player3Name:'William',
      Player4Name:'D',
      modalVisible:true,
      checked:true,
      PlayingSide:'',
      emittingObject:'',
      type:'',
      liveMatch:'',
      endMatch:'',
      updatingResults:false
      
    };
  }

  handleToggle = () =>{
    this.setState(
      {
        start:!this.state.start
      },
      () =>this.handleStart()
    )
  }


  handleStart = () =>{
    if(this.state.start){
      this.interval = setInterval(()=>{
         if(this.state.sec!==59){
            this.setState({
              msec:0,
              sec: ++ this.state.sec
            })
        } else {
          this.setState({
            msec:0,
            sec:0,
            min: ++this.state.min
          })
        }
      }, 1000)
    } else{
      clearInterval(this.interval)
    }
  }

  handleReset =()=>{
    this.setState({
      min:0,
      sec:0,
      msec:0,
      start: false
    });
    clearInterval(this.interval)

  }

  // async changeScreenOrientation() {
    
  //   await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
  // }

  // async exitScreenOrientation(){
  //   await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
  // }

  updatingSchdeule(){
    const { emittingObject } = this.state
    let matchId = this.matchId
    let bracketType = this.bracketType
    let tournamentId = emittingObject.tournamentId
    let divisionName = emittingObject.divisionName
    let type= emittingObject.type
    let url=''         
    var newData = [];

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
      newData = response.data[0].schedule
      newData.forEach(element=>{
        if(bracketType == 'Double Elimination' || bracketType =='Box League'){
          element.map(item=>{
            item.map(nItem=>{
             if(nItem._id == matchId){
                 nItem.isComplete = true
             }  
            })                      
         })
        }
        else{
          element.map(item=>{
            if(item._id == matchId){
                item.isComplete = true
            }                        
          })
        }

      })
      this.updateMatches(newData)
    })
    

  }

  updateMatches(schedule){
    const { emittingObject } = this.state
    let bracketType = this.bracketType
    let tournamentId = emittingObject.tournamentId
    let divisionName = emittingObject.divisionName
    let type= emittingObject.type
    let tournamentName = emittingObject.tournamentName
    let url =''
    if(bracketType =='Double Elimination'){
      url = 'https://pickletour.com/api/schedule/doubleElimination/edit'
    }
    else{
      url = 'https://pickletour.com/api/schedule/edit'
    }
    
    //this.checkforRecentResults(schedule, bracketType, type,  divisionName, tournamentId, tournamentName)
    axios.put(url, {
      schedule: schedule,
      tournamentId: tournamentId,
      divisionName: divisionName
    }).then((resp=>{
      this.checkforRecentResults(schedule, bracketType, type,  divisionName, tournamentId, tournamentName)
      //this.createRecentResults(schedule, bracketType, type, divisionName)
      //console.log(resp.data)
      //this.checkforRecentResults(schedule, bracketType, type,  divisionName, tournamentId, tournamentName)
      //this.setState({updatingResults:false},()=>this.props.navigation.navigate('Dashboard'))
    }))

  }

  checkforRecentResults(schedule, bracket, type, division, id, name){
    const matchData = this.props.navigation.state.params.matchData
    if(bracket =='Round Robin' || bracket=='Single Elimination' || bracket=='Knock Out'){
      axios.get(`https://pickletour.com/api/get/resultRS/${division}/${id}`)
      .then(resp=>{
        if(resp.data.length>0){
          var newData = resp.data[0].result
          newData.forEach(element=>{
            element.map(item=>{
                if(item._id==matchData._id){
                  if(matchData.one.player1 && matchData.two.player2){
                    nItem.one.player1 = matchData.one.player1
                    nItem.one.player2 = matchData.one.player2
                    nItem.one.fName   = matchData.one.player1.fName+' and ' + matchData.one.player2.fName
                    nItem.one.score   = this.state.ScoreTeam1

                    nItem.two.player1 = matchData.two.player1
                    nItem.two.player2 = matchData.two.player2
                    nItem.two.fName   = matchData.two.player1.fName+' and ' + matchData.two.player2.fName
                    nItem.two.score   = this.state.ScoreTeam2
                  }else{
                    item.one.player1 = matchData.one
                  item.one.fName =  matchData.one.fName
                  item.one.score = this.state.ScoreTeam1

                  item.two.player2 = matchData.two
                  item.two.fName = matchData.two.fName
                  item.two.score = this.state.ScoreTeam2
                  }
                  
                }
              
            })
          })
          const Obj = {
            result: newData,
            tournamentId: id,
            divisionName: division,
            firstPos: '',
            secondPos:  '',
            thirdPos: '',
            isPublished:  false,
            bracketType:  bracket,
            type: type,
            name: name
          }

          axios.put('https://pickletour.com/api/resultRS/edit',Obj)
              .then(resp=>{
                console.log(resp.data)
                this.setState({updatingResults:false},()=>this.props.navigation.navigate('Dashboard'))
          })
          
        }
        else{
          this.createRecentResults(schedule, bracket, type, division, id, name)
        }
      })
    }
    else if(bracket=='Double Elimination' || bracket=='Box League'){
      axios.get(`https://pickletour.com/api/get/resultBD/${division}/${id}`)
        .then(resp=>{
          if(resp.data.length>0){
            var newData = resp.data[0].result
            newData.forEach(element=>{
              element.map(item=>{
                item.map(nItem=>{
                 if(nItem._id == matchData._id){
                  if(matchData.match.one.team){
                    nItem.one.player1 = matchData.match.one.team
                    nItem.one.fName   = matchData.match.one.team.tName
                    nItem.one.score   = this.state.ScoreTeam1

                    nItem.two.player2 = matchData.match.two.team
                    nItem.two.fName   = matchData.match.two.team.tName
                    nItem.two.score   = this.state.ScoreTeam2  
                  }
                 else if(matchData.one.player1 && matchData.two.player2){
                    nItem.one.player1 = matchData.one.player1
                    nItem.one.player2 = matchData.one.player2
                    nItem.one.fName   = matchData.one.player1.fName+' and ' + matchData.one.player2.fName
                    nItem.one.score   = this.state.ScoreTeam1

                    nItem.two.player1 = matchData.two.player1
                    nItem.two.player2 = matchData.two.player2
                    nItem.two.fName   = matchData.two.player1.fName+' and ' + matchData.two.player2.fName
                    nItem.two.score   = this.state.ScoreTeam2
                 }
                 else{
                    item.one.player1 = matchData.one
                    item.one.fName =  matchData.one.fName? matchData.one.fName : matchData.one.tName
                    item.one.score = this.state.ScoreTeam1

                    item.two.player2 = matchData.two
                    item.two.fName = matchData.two.fName? matchData.two.fName : matchData.two.tName
                    item.two.score = this.state.ScoreTeam2
                
                 }
                 }  
                })                      
             })

            })
            
            const Obj = {
              result: newData,
              tournamentId: id,
              divisionName: division,
              firstPos: '',
              secondPos:  '',
              thirdPos: '',
              isPublished:  false,
              bracketType:  bracket,
              type: type,
              name: name
            }
  
            axios.put('https://pickletour.com/api/resultBD/edit',Obj)
                .then(resp=>{
                  console.log(resp.data)
                  this.setState({updatingResults:false},()=>this.props.navigation.navigate('Dashboard'))
            })
          }
          else{
            this.createRecentResults(schedule, bracket, type, division, id, name)
          }
        })
    }
  }

  insertRecentResults(bracket, division, type, name, id, finalSchedule){
    if(bracket =='Round Robin' || bracket=='Single Elimination' || bracket=='Knock Out'){
      const obj = {
        result : finalSchedule,
        tournamentId: id,
        divisionName: division,
        firstPos:'',
        secondPos:'',
        thirdPos:'',
        isPublished:false,
        bracketType: bracket,
        type: type,
        name: name
      }

      axios.post('https://pickletour.com/api/resultRS/post',obj)
            .then(resp=>{
              console.log(resp.data)
              this.setState({updatingResults:false},()=>this.props.navigation.navigate('Dashboard'))
              
      })

    }
    else if(bracket=='Double Elimination' || bracket =='Box League'){
      const obj = {
        result : finalSchedule,
        tournamentId: id,
        divisionName: division,
        firstPos:'',
        secondPos:'',
        thirdPos:'',
        isPublished:false,
        bracketType: bracket,
        type: type,
        name: name
      }

      axios.post('https://pickletour.com/api/resultBD/post',obj)
            .then(resp=>{
              console.log(resp.data)
              this.setState({updatingResults:false},()=>this.props.navigation.navigate('Dashboard'))
      })
    }
  }

  createRecentResults(data, bracketType, type, divisionName, id, name){
    const { ScoreTeam1, ScoreTeam2 } = this.state
    var finalSchedule=[]
      if(bracketType === "Box League"){
          for(var i=0; i<data.length; i++){
            var box=[]
            for(var j=0; j<data[i].length; j++){
              var round=[]
               for(var k=0; k<data[i][j].length; k++){
                   round.push({
                     one: {
                       player1:  data[i][j][k].match.one.team,
                       fName:   data[i][j][k].match.one.team.tName,
                       score: data[i][j][k]._id==this.matchId ? ScoreTeam1 :''
                     },
                     two: {
                      player2:  data[i][j][k].match.two.team,
                      fName:   data[i][j][k].match.two.team.tName,
                      score: data[i][j][k]._id==this.matchId ? ScoreTeam2 :''
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
                         player1: data[i][j][k].one,
                         fName: data[i][j][k].one.fName,
                         score: data[i][j][k]._id==this.matchId ? ScoreTeam1 :''
                       },
                       two: {
                        player2:data[i][j][k].two,
                        fName: data[i][j][k].two.fName,
                        score: data[i][j][k]._id==this.matchId ? ScoreTeam2 :''
                       }
                     })
                   }else{
                    round.push({
                      one: {
                        player1:{},
                        fName: '',
                        score: ''
                      },
                      two: {
                        player2:{},
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
                         player1: data[i][j][k].one,
                         fName: data[i][j][k].one.fName,
                         score: data[i][j][k]._id==this.matchId ? ScoreTeam1 :''
                       },
                       two: {
                        player2:  data[i][j][k].two,
                        fName: data[i][j][k].two.fName,
                        score: data[i][j][k]._id==this.matchId ? ScoreTeam2 :''
                       }
                     })
                   }else{
                    round.push({
                      one: {
                        player1:{},
                        fName: '',
                        score: ''
                      },
                      two: {
                        player2:{},
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
                    if(data[i][j][k].one.player1 && data[i][j][k].one.player2 && data[i][j][k].two.player1 && data[i][j][k].two.player2){
                      console.log(data) 
                      round.push({
                    
                        one: {
                          player1:  data[i][j][k].one.player1,
                          player2:  data[i][j][k].one.player2,
                          fName:    data[i][j][k].one.player1.fName +" and "+ data[i][j][k].one.player2.fName,
                          score:    data[i][j][k]._id==this.matchId ? ScoreTeam1 :''
                        },
                        two: {
                          player1:  data[i][j][k].two.player1,
                          player2:  data[i][j][k].two.player2,
                          fName:    data[i][j][k].two.player1.fName +" and "+ data[i][j][k].two.player2.fName,
                          score:    data[i][j][k]._id==this.matchId ? ScoreTeam2 :''
                        }
                      })
                    }
                    else{
                      round.push({
                        one :{
                          player1:  data[i][j][k].one,
                          fName:    data[i][j][k].one.fName,
                          score:    data[i][j][k]._id==this.matchId ? ScoreTeam1 :''

                        }, 
                        two:{
                          player2:  data[i][j][k].two,
                          fName:    data[i][j][k].two.fName,
                          score:    data[i][j][k]._id==this.matchId ? ScoreTeam2 :''                        
                        }
                      })
                    }
                    
                   }else{
                    round.push({
                      one: {
                        player1:{},
                        player2:{},
                        fName: '',
                        score: ''
                      },
                      two: {
                        player1:{},
                        player2:{},
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
                    if(data[i][j][k].one.player1 && data[i][j][k].one.player2 && data[i][j][k].two.player1 && data[i][j][k].two.player2){
                      
                      round.push({
                    
                        one: {
                          player1:  data[i][j][k].one.player1,
                          player2:  data[i][j][k].one.player2,
                          fName:    data[i][j][k].one.player1.fName +" and "+ data[i][j][k].one.player2.fName,
                          score:    data[i][j][k]._id==this.matchId ? ScoreTeam1 :''
                        },
                        two: {
                          player1:  data[i][j][k].two.player1,
                          player2:  data[i][j][k].two.player2,
                          fName:    data[i][j][k].two.player1.fName +" and "+ data[i][j][k].two.player2.fName,
                          score:    data[i][j][k]._id==this.matchId ? ScoreTeam2 :''
                        }
                      })
                    }
                    else{
                      round.push({
                        one :{
                          player1:  data[i][j][k].one,
                          fName:    data[i][j][k].one.fName,
                          score:    data[i][j][k]._id==this.matchId ? ScoreTeam1 :'' 

                        }, 
                        two:{
                          player2:  data[i][j][k].two,
                          fName:    data[i][j][k].two.fName,
                          score:    data[i][j][k]._id==this.matchId ? ScoreTeam2 :''                          
                        }
                      })
                    }
                   }else{
                    round.push({
                      one: {
                        player1:{},
                        player2:{},
                        fName: '',
                        score: ''
                      },
                      two: {
                       player2:{},
                       player1:{},
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
                           player1: data[i][j].one,
                           fName:   data[i][j].one.fName,
                           score:   data[i][j]._id==this.matchId ? ScoreTeam1 :''
                         },
                         two: {
                          player2:  data[i][j].two,
                          fName:    data[i][j].two.fName,
                          score:    data[i][j]._id==this.matchId ? ScoreTeam2 :'' 
                         }
                       })
                     }else{
                      round.push({
                        one: {
                          player1:{},
                          fName: '',
                          score: ''
                        },
                        two: {
                          player2:{},
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
                           player1: data[i][j].one,
                           fName:   data[i][j].one.fName,
                           score:   data[i][j]._id==this.matchId ? ScoreTeam1 :''
                         },
                         two: {
                          player2:  data[i][j].two,
                          fName:    data[i][j].two.fName,
                          score:    data[i][j]._id==this.matchId ? ScoreTeam2 :''
                         }
                       })
                     }else{
                      round.push({
                        one: {
                          player1:{},
                          fName: '',
                          score: ''
                        },
                        two: {
                         player2:{},
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
                         player1: data[i][j].one,
                         fName:   data[i][j].one.fName ? data[i][j].one.fName : data[i][j].one.tName,
                         score:   data[i][j]._id==this.matchId ? ScoreTeam1 :''
                       },
                       two: {
                        player2:  data[i][j].two,
                        fName:    data[i][j].two.fName ? data[i][j].two.fName : data[i][j].two.tName,
                        score:    data[i][j]._id==this.matchId ? ScoreTeam2 :''
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
                           player1: data[i][j].one.player1,
                           player2: data[i][j].one.player2,
                           fName:   data[i][j].one.player1.fName +" and "+ data[i][j].one.player2.fName,
                           score:   data[i][j]._id==this.matchId ? ScoreTeam1 :''
                         },
                         two: {
                          player1:  data[i][j].twp.player1,
                          player2:  data[i][j].two.player2,
                          fName:    data[i][j].two.player1.fName +" and "+ data[i][j].two.player2.fName,
                          score:    data[i][j]._id==this.matchId ? ScoreTeam2 :''
                         }
                       })
                     }else{
                      round.push({
                        one: {
                          player1:{},
                          player2:{},
                          fName: '',
                          score: ''
                        },
                        two: {
                         player1:{},
                         player2:{},
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
                       if(data[i][j].one.player1 && data[i][j].one.player2){
                         round.push({
                           one:{
                             player1: data[i][j].one.player1,
                             player2: data[i][j].one.player2,
                             fName:   data[i][j].one.player1.fName +" and "+ data[i][j].one.player2.fName,
                             score:   data[i][j]._id==this.matchId ? ScoreTeam1 :''
                           },
                           two:{
                            player1: data[i][j].two.player1,
                            player2: data[i][j].two.player2,
                            fName:   data[i][j].two.player1.fName +" and "+ data[i][j].two.player2.fName,
                            score:   data[i][j]._id==this.matchId ? ScoreTeam2 :''
                           }
                         })
                       }
                       else{
                         round.push({
                           one:{
                             player1: data[i][j].one,
                             fName:   data[i][j].one.fName,
                             score:   data[i][j]._id==this.matchId ? ScoreTeam1 :''

                           },
                           two:{
                            player2:  data[i][j].two,
                            fName:    data[i][j].two.fName,
                            score:    data[i][j]._id==this.matchId ? ScoreTeam2 :''
                           }
                         })
                       }
                     }else{
                      round.push({
                        one: {
                          player1:{},
                        player2:{},
                          fName: '',
                          score: ''
                        },
                        two: {
                          player1:{},
                        player2:{},
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
                if(data[i][j].one.player1){
                  round.push({
                    one:{
                      player1:  data[i][j].one.player1,
                      player2 : data[i][j].one.player2,
                      fName:    data[i][j].one.player1.fName +" and "+ data[i][j].one.player2.fName,
                      score :   data[i][j]._id==this.matchId ? ScoreTeam1 :''
                    },
                    two:{
                      player1:  data[i][j].two.player1,
                      player2 : data[i][j].two.player2,
                      fName:    data[i][j].two.player1.fName +" and "+ data[i][j].two.player2.fName,
                      score :   data[i][j]._id==this.matchId ? ScoreTeam2 :''
                    }
                  })
                }
                else{
                  round.push({
                    one:{
                      player1:  data[i][j].one,
                      fName:    data[i][j].one.tName,
                      score :   data[i][j]._id==this.matchId ? ScoreTeam1 :''
                    },
                    two:{
                      player1:  data[i][j].two,
                      fName:    data[i][j].two.tName,
                      score :   data[i][j]._id==this.matchId ? ScoreTeam2 :''
                    }
                  })
                }
              }
  
              finalSchedule.push(round)
            }
          }
        }
      }
  this.insertRecentResults(bracketType, divisionName, type, name, id, finalSchedule )
      
  }
  // verifyingScore(whichTeam){
  //   const { checked,TeamFormation, Player1Name, Player3Name, emittingObject, type, liveMatch, endMatch, ScoreTeam2, ScoreTeam1, currentRound, Round1TeamAScore, Round1TeamBScore, Round2TeamAScore, Round2TeamBScore } =this.state
  //   let msg=''

  //   let data = emittingObject
  //   data.score1 = this.state.ScoreTeam1
  //   data.score2 = this.state.ScoreTeam2

  //   this.socket.emit(liveMatch, { websiteData: data });
  //   if(whichTeam == 'ByOne'){
  //     if(checked==true){
  //       if(this.state.ScoreTeam2==this.TargetSelected && this.state.ScoreTeam2-this.state.ScoreTeam1>=2){
  //         this.socket.emit(endMatch, { websiteData: data });

  //       }
  //     }
  //     else{

  //     }
  //   }else if(whichTeam == 'ByTwo'){

  //   }
  // }
  checkingScore(whichTeam){
    const { TeamFormation, Player1Name, Player3Name, emittingObject, type, liveMatch, endMatch, ScoreTeam2, ScoreTeam1, currentRound, Round1TeamAScore, Round1TeamBScore, Round2TeamAScore, Round2TeamBScore } =this.state
    let msg=''

    let data = emittingObject
    data.score1 = this.state.ScoreTeam1
    data.score2 = this.state.ScoreTeam2

    this.socket.emit(liveMatch, { websiteData: data });
    if(whichTeam=='ByOne'){
      
      if(this.state.checked==true){
        if(this.state.ScoreTeam2==this.TargetSelected && this.state.ScoreTeam2-this.state.ScoreTeam1>=2){
          
          if(TeamFormation=='Singles'){
            // msg = Player3Name+' is the Winner'
            // this.msg = msg

            if(currentRound == 'Round 2'){
              if(Round1TeamAScore+ScoreTeam1 > Round1TeamBScore+ScoreTeam2){
                this.socket.emit(endMatch, { websiteData: data });
                this.msg = Player1Name+ ' is the Winner'
                this.setState({updatingResults:true},()=>this.updatingSchdeule())
              }
              else if(Round1TeamAScore+ScoreTeam1 < Round1TeamBScore+ScoreTeam2){
                this.socket.emit(endMatch, { websiteData: data });
                this.msg = Player3Name+ ' is the Winner'
                this.setState({updatingResults:true},()=>this.updatingSchdeule())
              }
              else{
                if(ScoreTeam1>ScoreTeam2)
                this.msg = Player1Name+ ' is the Winner'
                else
                this.msg = Player3Name+ ' is the Winner'
                this.setState({nextRound:true})
              }
            }
            else if(currentRound == 'Round 3'){
              if(Round1TeamAScore+ScoreTeam1+Round2TeamAScore > Round1TeamBScore+ScoreTeam2+Round2TeamBScore){
                this.socket.emit(endMatch, { websiteData: data });
                this.msg = Player1Name+ ' is the Winner'
                this.setState({updatingResults:true},()=>this.updatingSchdeule())
              }
              else if(Round1TeamAScore+ScoreTeam1+Round2TeamAScore < Round1TeamBScore+ScoreTeam2+Round2TeamBScore){
                this.socket.emit(endMatch, { websiteData: data });
                this.msg = Player3Name+ ' is the Winner'
                this.setState({updatingResults:true},()=>this.updatingSchdeule())
              }
            }
            else{
              this.msg = Player3Name+ ' is the Winner'
              this.setState({nextRound:true})
            }
          } 
          else{
            // this.msg = 'Team B is the Winner'
            if(currentRound == 'Round 2'){
              if(Round1TeamAScore+ScoreTeam1 > Round1TeamBScore+ScoreTeam2){
                console.log(Round1TeamAScore+ScoreTeam1 + '  '+Round1TeamBScore+ScoreTeam2)
                this.socket.emit(endMatch, { websiteData: data });
                this.msg = 'Team A is the Winner'
                this.setState({updatingResults:true},()=>this.updatingSchdeule())
              }
              else if(Round1TeamAScore+ScoreTeam1 < Round1TeamBScore+ScoreTeam2){
                console.log(Round1TeamAScore+ScoreTeam1 + '  '+Round1TeamBScore+ScoreTeam2)
                this.socket.emit(endMatch, { websiteData: data });
                this.msg = 'Team B is the Winner'
                this.setState({updatingResults:true},()=>this.updatingSchdeule())
              }
              else{
                if(ScoreTeam1>ScoreTeam2)
                this.msg = 'Team A is the Winner'
                else
                this.msg = 'Team B is the Winner'
                this.setState({nextRound:true})
              }
            }
            else if(currentRound == 'Round 3'){
              if(Round1TeamAScore+ScoreTeam1+Round2TeamAScore > Round1TeamBScore+ScoreTeam2+Round2TeamBScore){
                this.socket.emit(endMatch, { websiteData: data });
                this.msg = 'Team A is the Winner'
                this.setState({updatingResults:true},()=>this.updatingSchdeule())
              }
              else if(Round1TeamAScore+ScoreTeam1+Round2TeamAScore < Round1TeamBScore+ScoreTeam2+Round2TeamBScore){
                this.socket.emit(endMatch, { websiteData: data });
                this.msg = 'Team B is the Winner'
                this.setState({updatingResults:true},()=>this.updatingSchdeule())
              }
            }
            else{
              this.msg = 'Team B is the Winner'
              
              this.setState({nextRound:true})
            }
            
          }
        }
        else if(this.state.ScoreTeam2>this.TargetSelected && this.state.ScoreTeam2-this.state.ScoreTeam1>=2){
          this.socket.emit(endMatch, { websiteData: data });
          if(TeamFormation=='Singles'){
            // msg = Player3Name+' is the Winner'
            // this.msg = msg
            
            if(currentRound == 'Round 2'){
              if(Round1TeamAScore+ScoreTeam1 > Round1TeamBScore+ScoreTeam2){
                this.socket.emit(endMatch, { websiteData: data });
                this.msg = Player1Name+ ' is the Winner'
                this.setState({updatingResults:true},()=>this.updatingSchdeule())
              }
              else if(Round1TeamAScore+ScoreTeam1 < Round1TeamBScore+ScoreTeam2){
                this.socket.emit(endMatch, { websiteData: data });
                this.msg = Player3Name+ ' is the Winner'
                this.setState({updatingResults:true},()=>this.updatingSchdeule())
              }
              else{
                if(ScoreTeam1>ScoreTeam2)
                this.msg = Player1Name+ ' is the Winner'
                else
                this.msg = Player3Name+ ' is the Winner'
                this.setState({nextRound:true})
              }
            }
            else if(currentRound == 'Round 3'){
              if(Round1TeamAScore+ScoreTeam1+Round2TeamAScore > Round1TeamBScore+ScoreTeam2+Round2TeamBScore){
                this.socket.emit(endMatch, { websiteData: data });
                this.msg = Player1Name+ ' is the Winner'
                this.setState({updatingResults:true},()=>this.updatingSchdeule())
              }
              else if(Round1TeamAScore+ScoreTeam1+Round2TeamAScore < Round1TeamBScore+ScoreTeam2+Round2TeamBScore){
                this.socket.emit(endMatch, { websiteData: data });
                this.msg = Player3Name+ ' is the Winner'
                this.setState({updatingResults:true},()=>this.updatingSchdeule())
              }
            }
            else{
              this.msg = Player3Name+ ' is the Winner'
              this.setState({nextRound:true})
            }
          } 
          else{
            if(currentRound == 'Round 2'){
              if(Round1TeamAScore+ScoreTeam1 > Round1TeamBScore+ScoreTeam2){
                this.socket.emit(endMatch, { websiteData: data });
                this.msg = 'Team A is the Winner'
                this.setState({updatingResults:true},()=>this.updatingSchdeule())
              }
              else if(Round1TeamAScore+ScoreTeam1 < Round1TeamBScore+ScoreTeam2){
                this.socket.emit(endMatch, { websiteData: data });
                this.msg = 'Team B is the Winner'
                this.setState({updatingResults:true},()=>this.updatingSchdeule())
              }
              else{
                if(ScoreTeam1>ScoreTeam2)
                this.msg = 'Team A is the Winner'
                else
                this.msg = 'Team B is the Winner'
                this.setState({nextRound:true})
              }
            }
            else if(currentRound == 'Round 3'){
              if(Round1TeamAScore+ScoreTeam1+Round2TeamAScore > Round1TeamBScore+ScoreTeam2+Round2TeamBScore){
                this.socket.emit(endMatch, { websiteData: data });
                this.msg = 'Team A is the Winner'
                this.setState({updatingResults:true},()=>this.updatingSchdeule())
              }
              else if(Round1TeamAScore+ScoreTeam1+Round2TeamAScore < Round1TeamBScore+ScoreTeam2+Round2TeamBScore){
                this.socket.emit(endMatch, { websiteData: data });
                this.msg = 'Team B is the Winner'
                this.setState({updatingResults:true},()=>this.updatingSchdeule())
              }
            }
            else{
              this.msg = 'Team B is the Winner'
              this.setState({nextRound:true})
            }
          } 
        }
      }
      else{
        if(this.state.ScoreTeam2==this.TargetSelected){
          this.socket.emit(endMatch, { websiteData: data });
          if(TeamFormation=='Singles'){
            // msg = Player3Name+' is the Winner'
            // this.msg = msg
       
            if(currentRound == 'Round 2'){
              if(Round1TeamAScore+ScoreTeam1 > Round1TeamBScore+ScoreTeam2){
                this.socket.emit(endMatch, { websiteData: data });
                this.msg = Player1Name+ ' is the Winner'
                this.setState({updatingResults:true},()=>this.updatingSchdeule())
              }
              else if(Round1TeamAScore+ScoreTeam1 < Round1TeamBScore+ScoreTeam2){
                this.socket.emit(endMatch, { websiteData: data });
                this.msg = Player3Name+ ' is the Winner'
                this.setState({updatingResults:true},()=>this.updatingSchdeule())
              }
              else{
                if(ScoreTeam1>ScoreTeam2)
                this.msg = Player1Name+ ' is the Winner'
                else
                this.msg = Player3Name+ ' is the Winner'
                this.setState({nextRound:true})
              }
            }
            else if(currentRound == 'Round 3'){
              if(Round1TeamAScore+ScoreTeam1+Round2TeamAScore > Round1TeamBScore+ScoreTeam2+Round2TeamBScore){
                this.socket.emit(endMatch, { websiteData: data });
                this.msg = Player1Name+ ' is the Winner'
                this.setState({updatingResults:true},()=>this.updatingSchdeule())
              }
              else if(Round1TeamAScore+ScoreTeam1+Round2TeamAScore < Round1TeamBScore+ScoreTeam2+Round2TeamBScore){
                this.socket.emit(endMatch, { websiteData: data });
                this.msg = Player3Name+ ' is the Winner'
                this.setState({updatingResults:true},()=>this.updatingSchdeule())
              }
            }
            else{
              this.msg = Player3Name+ ' is the Winner'
              this.setState({nextRound:true})
            }
          } 
          else{
            if(currentRound == 'Round 2'){
              if(Round1TeamAScore+ScoreTeam1 > Round1TeamBScore+ScoreTeam2){
                this.socket.emit(endMatch, { websiteData: data });
                this.msg = 'Team A is the Winner'
                this.setState({updatingResults:true},()=>this.updatingSchdeule())
              }
              else if(Round1TeamAScore+ScoreTeam1 < Round1TeamBScore+ScoreTeam2){
                this.socket.emit(endMatch, { websiteData: data });
                this.msg = 'Team B is the Winner'
                this.setState({updatingResults:true},()=>this.updatingSchdeule())
              }
              else{
                if(ScoreTeam1>ScoreTeam2)
                this.msg = 'Team A is the Winner'
                else
                this.msg = 'Team B is the Winner'
                this.setState({nextRound:true})
              }
            }
            else if(currentRound == 'Round 3'){
              if(Round1TeamAScore+ScoreTeam1+Round2TeamAScore > Round1TeamBScore+ScoreTeam2+Round2TeamBScore){
                this.socket.emit(endMatch, { websiteData: data });
                this.msg = 'Team A is the Winner'
                this.setState({updatingResults:true},()=>this.updatingSchdeule())
              }
              else if(Round1TeamAScore+ScoreTeam1+Round2TeamAScore < Round1TeamBScore+ScoreTeam2+Round2TeamBScore){
                this.socket.emit(endMatch, { websiteData: data });
                this.msg = 'Team B is the Winner'
                this.setState({updatingResults:true},()=>this.updatingSchdeule())
              }
            }
            else{
              this.msg = 'Team B is the Winner'
              this.setState({nextRound:true})
            }
          }
        }
      }
        
    }
  else if(whichTeam=='ByTwo'){
    if(this.state.checked==true){
      if(this.state.ScoreTeam1==this.TargetSelected && this.state.ScoreTeam1-this.state.ScoreTeam2>=2){
        this.socket.emit(endMatch, { websiteData: data });
        if(TeamFormation=='Singles'){
          // msg = Player1Name+' is the Winner'
          // this.msg = msg
          
          if(currentRound == 'Round 2'){
            if(Round1TeamAScore+ScoreTeam1 > Round1TeamBScore+ScoreTeam2){
              this.socket.emit(endMatch, { websiteData: data });
              this.msg = Player1Name+ ' is the Winner'
              this.setState({updatingResults:true},()=>this.updatingSchdeule())
            }
            else if(Round1TeamAScore+ScoreTeam1 < Round1TeamBScore+ScoreTeam2){
              this.socket.emit(endMatch, { websiteData: data });
              this.msg = Player3Name+ ' is the Winner'
              this.setState({updatingResults:true},()=>this.updatingSchdeule())
            }
            else{
              if(ScoreTeam1>ScoreTeam2)
              this.msg = Player1Name+ ' is the Winner'
              else
              this.msg = Player3Name+ ' is the Winner'
              this.setState({nextRound:true})
            }
          }
          else if(currentRound == 'Round 3'){
            if(Round1TeamAScore+ScoreTeam1+Round2TeamAScore > Round1TeamBScore+ScoreTeam2+Round2TeamBScore){
              this.socket.emit(endMatch, { websiteData: data });
              this.msg = Player1Name+ ' is the Winner'
              this.setState({updatingResults:true},()=>this.updatingSchdeule())
            }
            else if(Round1TeamAScore+ScoreTeam1+Round2TeamAScore < Round1TeamBScore+ScoreTeam2+Round2TeamBScore){
              this.socket.emit(endMatch, { websiteData: data });
              this.msg = Player3Name+ ' is the Winner'
              this.setState({updatingResults:true},()=>this.updatingSchdeule())
            }
          }
          else{
            this.msg = Player1Name+ ' is the Winner'
            this.setState({nextRound:true})
          }
        } 
        else{
          if(currentRound == 'Round 2'){
            if(Round1TeamAScore+ScoreTeam1 > Round1TeamBScore+ScoreTeam2){
              this.msg = 'Team A is the Winner'
              this.socket.emit(endMatch, { websiteData: data });
              this.setState({updatingResults:true},()=>this.updatingSchdeule())
            }
            else if(Round1TeamAScore+ScoreTeam1 < Round1TeamBScore+ScoreTeam2){
              this.socket.emit(endMatch, { websiteData: data });
              this.msg = 'Team B is the Winner'
              this.setState({updatingResults:true},()=>this.updatingSchdeule())
            }
            else{
              if(ScoreTeam1>ScoreTeam2)
              this.msg = 'Team A is the Winner'
              else
              this.msg = 'Team B is the Winner'
              this.setState({nextRound:true})
            }
          }
          else if(currentRound == 'Round 3'){
            if(Round1TeamAScore+ScoreTeam1+Round2TeamAScore > Round1TeamBScore+ScoreTeam2+Round2TeamBScore){
              this.socket.emit(endMatch, { websiteData: data });
              this.msg = 'Team A is the Winner'
              this.setState({updatingResults:true},()=>this.updatingSchdeule())
            }
            else if(Round1TeamAScore+ScoreTeam1+Round2TeamAScore < Round1TeamBScore+ScoreTeam2+Round2TeamBScore){
              this.socket.emit(endMatch, { websiteData: data });
              this.msg = 'Team B is the Winner'
              this.setState({updatingResults:true},()=>this.updatingSchdeule())
            }
          }
          else{
            this.msg = 'Team A is the Winner'
            this.setState({nextRound:true})
          }
        }
      }
      else if(this.state.ScoreTeam1>this.TargetSelected && this.state.ScoreTeam1-this.state.ScoreTeam2>=2){
        this.socket.emit(endMatch, { websiteData: data });
        if(TeamFormation=='Singles'){
          // msg = Player1Name+' is the Winner'
          // this.msg = msg
 
          if(currentRound == 'Round 2'){
            if(Round1TeamAScore+ScoreTeam1 > Round1TeamBScore+ScoreTeam2){
              this.socket.emit(endMatch, { websiteData: data });
              this.msg = Player1Name+ ' is the Winner'
              this.setState({updatingResults:true},()=>this.updatingSchdeule())
            }
            else if(Round1TeamAScore+ScoreTeam1 < Round1TeamBScore+ScoreTeam2){
              this.socket.emit(endMatch, { websiteData: data });
              this.msg = Player3Name+ ' is the Winner'
              this.setState({updatingResults:true},()=>this.updatingSchdeule())
            }
            else{
              if(ScoreTeam1>ScoreTeam2)
              this.msg = Player1Name+ ' is the Winner'
              else
              this.msg = Player3Name+ ' is the Winner'
              this.setState({nextRound:true})
            }
          }
          else if(currentRound == 'Round 3'){
            if(Round1TeamAScore+ScoreTeam1+Round2TeamAScore > Round1TeamBScore+ScoreTeam2+Round2TeamBScore){
              this.socket.emit(endMatch, { websiteData: data });
              this.msg = Player1Name+ ' is the Winner'
              this.setState({updatingResults:true},()=>this.updatingSchdeule())
            }
            else if(Round1TeamAScore+ScoreTeam1+Round2TeamAScore < Round1TeamBScore+ScoreTeam2+Round2TeamBScore){
              this.socket.emit(endMatch, { websiteData: data });
              this.msg = Player3Name+ ' is the Winner'
              this.setState({updatingResults:true},()=>this.updatingSchdeule())
            }
          }
          else{
            this.msg = Player1Name+ ' is the Winner'
            this.setState({nextRound:true})
          }
        } 
        else{
          if(currentRound == 'Round 2'){
            if(Round1TeamAScore+ScoreTeam1 > Round1TeamBScore+ScoreTeam2){
              this.socket.emit(endMatch, { websiteData: data });
              this.msg = 'Team A is the Winner'
              this.setState({updatingResults:true},()=>this.updatingSchdeule())
            }
            else if(Round1TeamAScore+ScoreTeam1 < Round1TeamBScore+ScoreTeam2){
              this.socket.emit(endMatch, { websiteData: data });
              this.msg = 'Team B is the Winner'
              this.setState({updatingResults:true},()=>this.updatingSchdeule())
            }
            else{
              if(ScoreTeam1>ScoreTeam2)
              this.msg = 'Team A is the Winner'
              else
              this.msg = 'Team B is the Winner'
              this.setState({nextRound:true})
            }
          }
          else if(currentRound == 'Round 3'){
            if(Round1TeamAScore+ScoreTeam1+Round2TeamAScore > Round1TeamBScore+ScoreTeam2+Round2TeamBScore){
              this.socket.emit(endMatch, { websiteData: data });
              this.msg = 'Team A is the Winner'
              this.setState({updatingResults:true},()=>this.updatingSchdeule())
            }
            else if(Round1TeamAScore+ScoreTeam1+Round2TeamAScore < Round1TeamBScore+ScoreTeam2+Round2TeamBScore){
              this.socket.emit(endMatch, { websiteData: data });
              this.msg = 'Team B is the Winner'
              this.setState({updatingResults:true},()=>this.updatingSchdeule())
            }
          }
          else{
            this.msg = 'Team A is the Winner'
            this.setState({nextRound:true})
          }
        }
      }
    }
    else{
      if(this.state.ScoreTeam1==this.TargetSelected){
        this.socket.emit(endMatch, { websiteData: data });
        if(TeamFormation=='Singles'){

          // msg = Player1Name+' is the Winner'
          // this.msg = msg
      
          if(currentRound == 'Round 2'){
            if(Round1TeamAScore+ScoreTeam1 > Round1TeamBScore+ScoreTeam2){
              this.socket.emit(endMatch, { websiteData: data });
              this.msg = Player1Name+ ' is the Winner'
              this.setState({updatingResults:true},()=>this.updatingSchdeule())
            }
            else if(Round1TeamAScore+ScoreTeam1 < Round1TeamBScore+ScoreTeam2){
              this.socket.emit(endMatch, { websiteData: data });
              this.msg = Player3Name+ ' is the Winner'
              this.setState({updatingResults:true},()=>this.updatingSchdeule())
            }
            else{
              if(ScoreTeam1>ScoreTeam2)
              this.msg = Player1Name+ ' is the Winner'
              else
              this.msg = Player3Name+ ' is the Winner'
              this.setState({nextRound:true})
            }
          }
          else if(currentRound == 'Round 3'){
            if(Round1TeamAScore+ScoreTeam1+Round2TeamAScore > Round1TeamBScore+ScoreTeam2+Round2TeamBScore){
              this.socket.emit(endMatch, { websiteData: data });
              this.msg = Player1Name+ ' is the Winner'
              this.setState({updatingResults:true},()=>this.updatingSchdeule())
            }
            else if(Round1TeamAScore+ScoreTeam1+Round2TeamAScore < Round1TeamBScore+ScoreTeam2+Round2TeamBScore){
              this.socket.emit(endMatch, { websiteData: data });
              this.msg = Player3Name+ ' is the Winner'
              this.setState({updatingResults:true},()=>this.updatingSchdeule())
            }
          }
          else{
            this.msg = Player1Name+ ' is the Winner'
            this.setState({nextRound:true})
          }
          
        } 
        else{
          if(currentRound == 'Round 2'){
            if(Round1TeamAScore+ScoreTeam1 > Round1TeamBScore+ScoreTeam2){
              this.socket.emit(endMatch, { websiteData: data });
              this.msg = 'Team A is the Winner'
              this.setState({updatingResults:true},()=>this.updatingSchdeule())
            }
            else if(Round1TeamAScore+ScoreTeam1 < Round1TeamBScore+ScoreTeam2){
              this.socket.emit(endMatch, { websiteData: data });
              this.msg = 'Team B is the Winner'
              this.setState({updatingResults:true},()=>this.updatingSchdeule())
            }
            else{
              if(ScoreTeam1>ScoreTeam2)
              this.msg = 'Team A is the Winner'
              else
              this.msg = 'Team B is the Winner'
              this.setState({nextRound:true})
            }
          }
          else if(currentRound == 'Round 3'){
            if(Round1TeamAScore+ScoreTeam1+Round2TeamAScore > Round1TeamBScore+ScoreTeam2+Round2TeamBScore){
              this.socket.emit(endMatch, { websiteData: data });
              this.msg = 'Team A is the Winner'
              this.setState({updatingResults:true},()=>this.updatingSchdeule())
            }
            else if(Round1TeamAScore+ScoreTeam1+Round2TeamAScore < Round1TeamBScore+ScoreTeam2+Round2TeamBScore){
              this.socket.emit(endMatch, { websiteData: data });
              this.msg = 'Team B is the Winner'
              this.setState({updatingResults:true},()=>this.updatingSchdeule())
            }
          }
          else{
            this.msg = 'Team A is the Winner'
            this.setState({nextRound:true})
          }
        }
      }
    }
  }
}

showingAlertConfirmStart(){
  Alert.alert(
    'Game Resetted !',
    'Click on Start ',
    [
      {},
      {},
      {text: 'OK'}
    ],
    {cancelable: false},
  )}
  showingAlert(teamMsg){
    Alert.alert(
      'Game Over !',
      teamMsg,
      [
        {},
        {},
        {text: 'OK', onPress: () => this.setState({modalVisible:true})},
      ],
      {cancelable: false},
    );
  }

  fault(whichTeam){
    if(this.state.TeamFormation=='Doubles'){
    if(whichTeam=='ByOne' && this.state.Team1Serving==true && this.state.Serve==2){
      this.setState({ballpos1:false, ballpos3:true, Serve:1, GameStart:false, Team1Serving:false, Team2Serving:true, ballpos2:false},()=>this.checkingScore(whichTeam))
    }
    else if(whichTeam=='ByOne' && this.state.Team2Serving==true && this.state.Serve==1){
      if(this.state.ballpos3==true){
        this.setState({ballpos4:true, ballpos3:false, ScoreTeam2:this.state.ScoreTeam2+1, Section4:this.state.Player3Name, Section3:this.state.Player4Name},()=>this.checkingScore(whichTeam))
      }
      else if(this.state.ballpos3==false && this.state.ballpos4==true){
        this.setState({ballpos3:true, ballpos4:false, ScoreTeam2:this.state.ScoreTeam2+1,  Section4:this.state.Player4Name, Section3:this.state.Player3Name},()=>this.checkingScore(whichTeam))  
      }
    }
    else if(whichTeam=='ByTwo' && this.state.Team2Serving==true && this.state.Serve==1){
      if(this.state.ballpos3==true){
        this.setState({ballpos3:false, ballpos4:true, Serve:2})
      }
      else if(this.state.ballpos4==true){
        this.setState({ballpos3:true, ballpos4:false, Serve:2})
      }
    }
    else if(whichTeam=='ByTwo' && this.state.Team2Serving==true && this.state.Serve==2){
      this.setState({ballpos3:false, ballpos4:false, ballpos1:true, Serve:1, Team1Serving:true, Team2Serving:false})
    }  
    else if(whichTeam=='ByOne' && this.state.Team2Serving==true && this.state.Serve==2){
      // this.setState({ScoreTeam2:this.state.ScoreTeam2+1, player3Move:true, player4Move:false})
      if(this.state.ballpos3==true){
        if(this.state.Section3==this.state.Player3Name){
          this.setState({ballpos3:false, ballpos4:true, ScoreTeam2:this.state.ScoreTeam2+1, Section3:this.state.Player4Name, Section4:this.state.Player3Name},()=>this.checkingScore(whichTeam))
        }
        else{
          this.setState({ballpos3:false, ballpos4:true, ScoreTeam2:this.state.ScoreTeam2+1, Section3:this.state.Player3Name, Section4:this.state.Player4Name},()=>this.checkingScore(whichTeam))
        }
      }
      else if(this.state.ballpos4==true){
        if(this.state.Section3==this.state.Player3Name){
          this.setState({ballpos3:true, ballpos4:false, ScoreTeam2:this.state.ScoreTeam2+1, Section3:this.state.Player4Name, Section4:this.state.Player3Name },()=>this.checkingScore(whichTeam))
        }
        else{
          this.setState({ballpos3:true, ballpos4:false, ScoreTeam2:this.state.ScoreTeam2+1, Section3:this.state.Player3Name, Section4:this.state.Player4Name },()=>this.checkingScore(whichTeam))
        }
      }
    }
    else if(whichTeam=='ByOne' && this.state.Team1Serving==true && this.state.Serve==1){
      if(this.state.ballpos1==true){
        this.setState({ballpos1:false, ballpos2:true, Serve:2})
      }
      else if(this.state.ballpos2==true){
        this.setState({ballpos1:true, ballpos2:false, Serve:2})
      }
    }
    else if(whichTeam=='ByTwo' && this.state.Team1Serving==true && this.state.Serve==1){
      if(this.state.ballpos1==true){
        this.setState({ballpos2:true, ballpos1:false, ScoreTeam1:this.state.ScoreTeam1+1, Section1:this.state.Player2Name, Section2:this.state.Player1Name},()=>this.checkingScore(whichTeam))
      }
      else if(this.state.ballpos2==true){
        this.setState({ballpos1:true, ballpos2:false, ScoreTeam1:this.state.ScoreTeam1+1, Section1:this.state.Player1Name, Section2:this.state.Player2Name},()=>this.checkingScore(whichTeam))
      }
    }
    else if(whichTeam=='ByTwo' && this.state.Team1Serving==true && this.state.Serve==2){
      if(this.state.ballpos1==true){
        this.setState({ballpos2:true, ballpos1:false, ScoreTeam1:this.state.ScoreTeam1+1, Section1:this.state.Player1Name, Section2:this.state.Player2Name },()=>this.checkingScore(whichTeam))
      }
      else if(this.state.ballpos2==true){
        this.setState({ballpos1:true, ballpos2:false, ScoreTeam1:this.state.ScoreTeam1+1, Section1:this.state.Player2Name, Section2:this.state.Player1Name},()=>this.checkingScore(whichTeam))
      }
    }
  }

  else{
    if(whichTeam=='ByOne' && this.state.Team1Serving==true){
      if(this.state.ballpos1==true){
        this.setState({ballpos3:true, Team2Serving:true, Serve:1, ballpos1:false, Team1Serving:false})
      }
      else{
        this.setState({ballpos4:true, ballpos2:false, Serve:1, Team2Serving:true, Team1Serving:false})
      }
    }
    else if(whichTeam=='ByTwo' && this.state.Team1Serving==true){
      if(this.state.ballpos1==true){
        this.setState({
          ballpos1:false, ballpos2:true, Section2:this.state.Player1Name, ScoreTeam1:this.state.ScoreTeam1+1, Section1:'', Section3:'', Section4:this.state.Player3Name
        },()=>this.checkingScore(whichTeam))
      }
      else{
        this.setState({
          ballpos2:false, ballpos1:true, Section3:this.state.Player3Name, Section4:'', Section2:'', Section1:this.state.Player1Name, ScoreTeam1:this.state.ScoreTeam1+1
        },()=>this.checkingScore(whichTeam))
      }
    }

    else if(whichTeam=='ByTwo' && this.state.Team2Serving==true){
      if(this.state.ballpos3==true){
        this.setState({
          ballpos3:false, ballpos1:true, Team1Serving:true, Team2Serving:false, Serve:1
        })
      }
      else{
        this.setState({
          ballpos4:false, ballpos2:true, Team1Serving:true, Team2Serving:false, Serve:1
        })
      }
    }

    else if(whichTeam=='ByOne' && this.state.Team2Serving==true){
      if(this.state.ballpos3==true){
        this.setState({
          ballpos4:true, ballpos3:false, Section4:this.state.Player3Name, Section3:'', ScoreTeam2:this.state.ScoreTeam2+1, Section2:this.state.Player1Name, Section1:''
        },()=>this.checkingScore(whichTeam))
      }
      else{
        this.setState({
          ballpos3:true, ballpos4:false, Section4:'', Section3:this.state.Player3Name, ScoreTeam2:this.state.ScoreTeam2+1, Section2:'', Section1:this.state.Player1Name
        },()=>this.checkingScore(whichTeam))
      }
    }
  }
  }

  componentDidMount(){
    this.socket = io(ENDPOINT);
    this.socket.on("FromAPI", msg => {
      //  console.log(msg)
    });

    Orientation.lockToLandscape()

    

    this.matchId = this.props.navigation.state.params.matchId
    this.bracketType = this.props.navigation.state.params.bracket
    let userData = this.props.navigation.state.params.userData
    let Obj=''
    let players = this.props.navigation.state.params.players
    let showMulti = this.props.navigation.state.params.checkMulti
    let tourId = this.props.navigation.state.params.tourId
    let tourName = this.props.navigation.state.params.tourName
    let divName = this.props.navigation.state.params.divName
    let courtNumber = this.props.navigation.state.params.courtNumber
    let type = this.props.navigation.state.params.type
    let address = this.props.navigation.state.params.address
    if(showMulti==false){
      Obj={
        tournamentId:tourId,
        tournamentName:tourName,
        divisionName:divName,
        player1:players[0],
        score1:this.state.ScoreTeam1,
        player2:players[1],
        score2:this.state.ScoreTeam2,
        courtNumber,
        type,
        address
      }
      this.setState({
        Player1Name: players[0],
        Player3Name: players[1],
        TeamFormation:'Singles',
        emittingObject:Obj,
        type
      })
    }
    else{
      Obj={
        tournamentId:tourId,
        tournamentName:tourName,
        divisionName:divName,
        player1:`${players[0]} ${players[1]}`,
        score1:this.state.ScoreTeam1,
        player2:`${players[2]} ${players[3]}`,
        score2:this.state.ScoreTeam2,
        courtNumber,
        type,
        address
      }
      this.setState({
        Player1Name: players[0],
        Player2Name: players[1],
        Player3Name: players[2],
        Player4Name: players[3],
        TeamFormation:'Doubles',
        emittingObject:Obj,
        type
      })
    }

    if(type == 'Tournament'){
      this.setState({liveMatch:'livescoreTournament', endMatch:'tournamentMatchEnd'})
    }
    else if(type == 'Recreational'){
      this.setState({liveMatch:'livescoreRecreational', endMatch:'recreationalMatchEnd'})
    }
    else if(type == 'League'){
      this.setState({liveMatch:'livescoreLeague', endMatch:'leagueMatchEnd'})
    }
    // this.changeScreenOrientation()
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

  }
  componentWillUnmount() {
    Orientation.unlockAllOrientations()
    this.backHandler.remove()
  }

  handleBackPress = () => {
    if(this.state.startClicked){
      this.setState({modalVisible:true})
    }
    return true;
  }

  settingSingles(){
    if(this.playingSide=='left'){
      this.setState({
        ballpos1:true, ballpos2:false,ballpos3:false, ballpos4:false,Team1Serving:true,Team2Serving:false, Serve:1, Section2:'', Section4:'', Section1:this.state.Player1Name, Section3:this.state.Player3Name, TeamFormation:'Singles'
      })
    }
    else{
      this.setState({
        ballpos3:true, ballpos2:false, ballpos4:false,ballpos1:false,Team2Serving:true,Team1Serving:false, Serve:1, Section2:'', Section4:'', Section1:this.state.Player1Name, Section3:this.state.Player3Name, TeamFormation:'Singles'
      })
    }
  }

  settingDoubles(playingSide){
    if(playingSide=='left'){
      this.setState({ballpos3:false,ballpos1:true,ballpos2:false, ballpos4:false,Team2Serving:false,Team1Serving:true,Serve:2, Section1:this.state.Player1Name, Section2:this.state.Player2Name, Section3:this.state.Player3Name, Section4:this.state.Player4Name})
      
    }
    else{
      this.setState({ballpos3:true,ballpos1:false,ballpos2:false, ballpos4:false,Team2Serving:true,Team1Serving:false,Serve:2, Section1:this.state.Player1Name, Section2:this.state.Player2Name, Section3:this.state.Player3Name, Section4:this.state.Player4Name})
    }
  }

  gameStyle(side, gamePattern){
    if(gamePattern=='Doubles'){
      this.settingDoubles(side)
    }
    else{
      this.settingSingles(side)
    }
  }

  startingGame(){
    this.resettingGame()
    this.setState({
      modalVisible:!this.state.modalVisible, startClicked:false
    },()=>this.gameStyle(this.playingSide, this.state.TeamFormation))  

  }

  resettingGame(flag){
    if(flag=="yes"){
      this.showingAlertConfirmStart()
    }
    this.setState({
      startClicked:false,
      GameStart:true,
      Serve:0,
      ScoreTeam1:0,
      ScoreTeam2:0,
      currentRound:'Round 1',
      PlayingSide:''})
    }

  nextRound(){
    const { currentRound, ScoreTeam1, ScoreTeam2, Player1Name, Player2Name, TeamFormation } = this.state
    let round = ''
    if(currentRound=='Round 1'){
      round='Round 2'
      
      this.setState({
        startClicked:false,
        nextRound:false,
        //GameStart:true,
        Serve:TeamFormation=='Singles'?1:2,
        Round1TeamAScore:ScoreTeam1,
        Round1TeamBScore:ScoreTeam2,
        ScoreTeam1:0,
        ScoreTeam2:0,
        currentRound:round,
        PlayingSide:''})
      
    }
    else if(currentRound =='Round 2'){
      round ='Round 3'
      this.setState({
        startClicked:false,
        nextRound:false,
        GameStart:true,
        Serve:TeamFormation=='Singles'?1:2,
        Round2TeamAScore:ScoreTeam1,
        Round2TeamBScore:ScoreTeam2,
        ScoreTeam1:0,
        ScoreTeam2:0,
        currentRound:round,
        PlayingSide:''})
      }

    }
    
  
  


  render() {   
    const { currentRound } = this.state 
    let selectedItem = this.state.radioButtons.find(e=>e.checked == true)
    selectedItem = selectedItem? selectedItem.value: this.state.radioButtons[0].value
    this.playingSide=selectedItem

    let selectedTarget = this.state.pointsButton.find(e=>e.checked == true)
    selectedTarget= selectedTarget?selectedTarget.value:this.state.pointsButton[0].value
    this.TargetSelected = selectedTarget

    return (
      <View style={{flex:1, }}>
        <StatusBar hidden={true} />

        {/* Next Round*/}
        <Modal
          animationType='slide'
          visible={this.state.nextRound}
        >
           <View style={{ flex:1,justifyContent:'center', alignItems:'center',backgroundColor:'rgba(52, 52, 52, 0.7)' }} >
              <View style={{justifyContent:'center',borderRadius:10,backgroundColor:'white', width:'70%', borderWidth:1, borderColor:'#64A8B5'}}>
                <Text style={{alignSelf:'center',fontFamily:'Lato-Bold', color:'#585858', marginTop:20,marginBottom:20,fontSize:Responsive.font(15)}}>{`${currentRound} : ${this.msg}`}</Text>
                <TouchableOpacity onPress={()=>this.nextRound()} style={{ height:Responsive.height(30),width:Responsive.width(150),paddingHorizontal:20,marginTop:10,backgroundColor:'#91c549', justifyContent:'center',borderRadius:12, alignSelf:'center', marginBottom:20}}>
                  <Text style={{fontFamily: 'Lato-Bold',alignSelf:'center', color:'#515151',fontSize:Responsive.font(15)}}>Next Round</Text>
                </TouchableOpacity>
                {/* <Text style={{alignSelf:'center',fontFamily:'Lato-Bold', color:'#585858', marginBottom:30,fontSize:Responsive.font(15)}}>Updating results, please wait..</Text> */}
              </View>
          </View>

        </Modal>
        {/* Final Modal----------------- */}
        <Modal 
          animationType='slide'
          visible={this.state.updatingResults}
        >
          <View style={{ flex:1,justifyContent:'center', alignItems:'center',backgroundColor:'rgba(52, 52, 52, 0.7)' }} >
              <View style={{justifyContent:'center',borderRadius:10,backgroundColor:'white', width:'70%', borderWidth:1, borderColor:'#64A8B5'}}>
                

                <Text style={{alignSelf:'center',fontFamily:'Lato-Bold', color:'#585858', marginTop:20,marginBottom:20,fontSize:Responsive.font(15)}}>{this.msg}</Text>

                <Text style={{alignSelf:'center',fontFamily:'Lato-Bold', color:'#585858', marginBottom:30,fontSize:Responsive.font(15)}}>Updating results, please wait..</Text>
                <ActivityIndicator color='#51C560' size='large' style={{marginBottom:30}} />
              </View>
          </View>

        </Modal>
        {/* Modal Settings-`--`-------------------- */}
        <Modal  animationType='slide'
                visible={this.state.modalVisible}>
            <StatusBar hidden={true} />
            {/* Heading */}
            <View style={{backgroundColor:'white', flex:0.15, justifyContent:'center', flexDirection:'row'}}>
              <View style={{flex:0.1}}>

              </View>
              <View style={{flex:0.8, justifyContent:'center'}}>
              <Text style={{ fontFamily: 'Lato-Bold', alignSelf:'center',fontSize:Responsive.font(20)}}>Settings</Text>
              </View>

              <View style={{flex:0.1, justifyContent:'center'}}>
               {this.state.startClicked? <Icon onPress={()=>this.setState({modalVisible:false})} type="FontAwesome" name="close"/>:<View></View>}   

                
              </View>
            </View>
            {/* Options */}
            <View style={{flex:0.6, flexDirection:'column'}}>

              <View style={{flex:0.5, flexDirection:'row',alignItems:'center', }}>
                <View style={{flex:0.5}}>
                  <Text style={{fontFamily: 'open-sans-simple',paddingLeft:50,fontSize:Responsive.font(20)}}>Starting Side</Text>
                </View>
                <View style={{flex:0.5}}>
                <RadioGroup
                  labelStyle={{fontFamily: 'open-sans-simple',fontSize:Responsive.font(16)}}
                  color='#0277BD'
                  radioButtons={this.state.radioButtons}
                  onPress={radioButtons=>this.setState({radioButtons})}
                  style={ {flexDirection:'row'}}
                />
                </View>
              
              </View>



              <View style={{flex:0.5,flexDirection:'row',alignItems:'center',}}>
              <View style={{flex:0.5}}>
                  <Text style={{fontFamily: 'open-sans-simple',paddingLeft:50,fontSize:Responsive.font(20)}}>Points to win</Text>
                </View>
                <View style={{flex:0.5}}>
               <RadioGroup
                  labelStyle={{fontFamily: 'open-sans-simple',fontSize:Responsive.font(16)}}
                  color='#0277BD'
                  radioButtons={this.state.pointsButton}
                  onPress={pointsButton=>this.setState({pointsButton})}
                  style={{ flexDirection:'row',}}
                />
                </View>
              </View>



              <View style={{flex:0.5,flexDirection:'row',alignItems:'center',}}>
              <View style={{flex:0.5}}>
                  <Text style={{fontFamily: 'open-sans-simple',paddingLeft:50,fontSize:Responsive.font(20)}}>Win By 2</Text>
                </View>
                <View style={{flex:0.5}}>
                <ListItem >
                    <CheckBox checked={this.state.checked} onPress={()=>this.setState({checked:!this.state.checked})}/>     
                  </ListItem>
                </View>
              </View>

            
              </View>

            <View style={{ flex:0.25, justifyContent:'space-around', flexDirection:'row'}}>
                <TouchableOpacity  onPress={()=>this.startingGame()} style={{ height:'50%',paddingHorizontal:20,marginTop:10,backgroundColor:'#91c549', justifyContent:'center', borderRadius:12}}>
                  <Text style={{fontFamily: 'Lato-Bold',alignSelf:'center', color:'#515151',fontSize:Responsive.font(15)}}>Start</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ height:'50%',paddingHorizontal:20,marginTop:10,backgroundColor:'transparent', justifyContent:'center',borderRadius:12}} 
                //onPress={()=>this.resettingGame('yes')}
                >
                {/* <Text style={{fontFamily: 'Lato-Bold',alignSelf:'center', color:'#515151',fontSize:Responsive.font(15)}}>Reset</Text> */}
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.props.navigation.goBack()} style={{ height:'50%',paddingHorizontal:20,marginTop:10,backgroundColor:'#91c549', justifyContent:'center',borderRadius:12}}>
                <Text style={{fontFamily: 'Lato-Bold',alignSelf:'center', color:'#515151',fontSize:Responsive.font(15)}}>Exit</Text>
                </TouchableOpacity>
            </View>

        </Modal>





        {/* Modal Settings-`--`-------------------- */}
        <ImageBackground style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height, flexDirection:'column', flex:1,overflow: 'hidden',position:'absolute'}} resizeMode='stretch' source={require('../../assets/background.png')}>
                  <View style={{width:Dimensions.get('window').width, height:Dimensions.get('window').height -35, flexDirection:'row'}}>
                  <View style={{width:Dimensions.get('window').width/2, flex:1, flexDirection:'row' }}>
          <View style={{flex:0.7, flexDirection:'column'}}>
            {this.state.Team1Serving?<View style={{backgroundColor:'#91c549', width:Responsive.width(100), height:Responsive.height(30), alignSelf:'flex-end', borderColor:'#707070', borderWidth:1,marginTop:Dimensions.get('window').height/25}}>
              <Text style={{fontFamily: 'Lato-Bold',color:'#515151', alignSelf:'center', fontSize:Responsive.font(20)}}>{'Serve '+this.state.Serve}</Text>
            </View>:<View style={{ height:Responsive.height(30)}}></View>}
            {/* Player 2 Name and Ball */}
            
            <View style={{flex:0.6, flexDirection:'row', justifyContent:'space-between', paddingLeft:Responsive.width(70), alignItems:'center'}}> 

              <View>
                {this.state.ballpos2?<Image style={{marginLeft:Responsive.width(10)}} source={require('../../assets/ball.png')}/>:<View></View>}
              </View>


              <View>
                <Text style={{fontFamily: 'Lato-Bold',color:'white', fontSize:Responsive.font(16)}}>{this.state.Section2}</Text>
              </View>

              
            </View>
            <TouchableOpacity onPress={()=>this.fault('ByOne')} style={{ height:Responsive.height(40), width:Responsive.width(100),marginLeft:Responsive.width(80), alignSelf:'center'}}>

            </TouchableOpacity>

            {/* Player 1 Name and Ball*/}
            <View style={{flex:0.4, flexDirection:'row',justifyContent:'space-between',  paddingLeft:Responsive.width(70), alignItems:'center', marginBottom:Responsive.height(40)}}>
            <View>
               {this.state.ballpos1? <Image style={{marginLeft:Responsive.width(10)}}source={require('../../assets/ball.png')}/>:<View></View>}
              </View>


              <View>
                <Text style={{fontFamily: 'Lato-Bold',color:'white',fontSize:Responsive.font(16)}}>{this.state.Section1}</Text>
              </View> 
            </View>



            {/* Timer------------------------------------------------------------------------ */}
            
          </View> 
        {/* ------------------------------ */}
          <View style={{ flex:0.3}}>
            <View style={{height:Responsive.height(40),width:Responsive.width(50),backgroundColor:this.state.Team1Serving?'#91c549':'white', alignSelf:'center', justifyContent:'center', borderWidth:1,borderColor:'#707070', marginTop:Dimensions.get('window').height/40}}>
              <Text style={{fontFamily: 'Lato-Bold',color:'#515151', alignSelf:'center', fontSize:Responsive.font(16)}}>{this.state.ScoreTeam1}</Text>
            </View>
          </View>
        </View>
            
            
            
            
            
        <View style={{width:'50%',flex:1, flexDirection:'row'}}>
          <View style={{ flex:0.3}}>
            <View style={{height:Responsive.height(40),width:Responsive.width(50), backgroundColor:this.state.Team2Serving?'#91c549':'white', alignSelf:'center', justifyContent:'center', borderWidth:1, borderColor:'#707070', marginTop:Dimensions.get('window').height/40}}>
              <Text style={{fontFamily: 'Lato-Bold',color:'#515151', alignSelf:'center', fontSize:Responsive.font(16)}}>{this.state.ScoreTeam2}</Text>
            </View>
          </View> 
        {/* ------------------------------ */}
          <View style={{ flex:0.7, flexDirection:'column'}}>
            {this.state.Team2Serving?<View style={{backgroundColor:'#91c549', width:Responsive.width(100), height:Responsive.height(30), borderColor:'#707070',borderWidth:1,alignSelf:'flex-start', marginTop:'1%'}}>
            <Text style={{fontFamily: 'Lato-Bold',color:'#515151',alignSelf:'center', fontSize:Responsive.font(20)}}>{'Serve '+this.state.Serve}</Text>
            </View>:<View style={{height:Responsive.height(30)}}></View>}
            <View style={{flex:0.6, flexDirection:'row', justifyContent:'space-between', paddingRight:Responsive.width(70), alignItems:'center'}}> 

              


              <View>
                <Text style={{fontFamily: 'Lato-Bold',color:'white', fontSize:Responsive.font(16)}}>{this.state.Section3}</Text>
              </View>

              <View>
                {this.state.ballpos3?<Image style={{marginRight:Responsive.width(10)}} source={require('../../assets/ball.png')}/>:<View></View>}
              </View>

              </View>
              <TouchableOpacity onPress={()=>this.fault('ByTwo')} style={{ height:Responsive.height(40), width:Responsive.width(100),marginRight:Responsive.width(80), alignSelf:'center'}}>

              </TouchableOpacity>

              <View style={{flex:0.4, flexDirection:'row',justifyContent:'space-between',  paddingRight:Responsive.width(70), alignItems:'center', marginBottom:Responsive.height(40)}}>
           


              <View>
                <Text style={{fontFamily: 'Lato-Bold',color:'white',fontSize:Responsive.font(16)}}>{this.state.Section4}</Text>
              </View>
              <View>
                {this.state.ballpos4?<Image style={{marginRight:Responsive.width(10)}}source={require('../../assets/ball.png')}/>:<View></View>}
              </View>
            </View>

          </View>
        </View>
        


                  </View>

                    

                  <View style={{width:'100%', height:'10%', justifyContent:'flex-start', flexDirection:'row'}}>
                  <View style={{marginLeft:10,marginBottom:10,flexDirection:'row', borderColor:'white', borderWidth:2}}>
                    <Text style={{color:'white',fontSize:Responsive.font(20), fontFamily:'Lato-Bold', alignSelf:'center'}}>{'  '+padToTwo(this.state.min)+' : '}</Text>
                    <Text style={{color:'white',fontSize:Responsive.font(20), fontFamily:'Lato-Bold', alignSelf:'center'}}>{padToTwo(this.state.sec) +'  '}</Text>
                  </View>
                  
                  {/* <Text style={{fontSize:Responsive.font(20), fontFamily:'Lato-Bold'}}>{padToTwo(this.state.msec)}</Text> */}
                  <TouchableOpacity onPress={this.handleToggle} style={{ marginBottom:10,marginLeft:20,paddingHorizontal:20, justifyContent:'center',backgroundColor:'#91c549',borderRadius:12}}>
                    <Text style={{fontFamily: 'Lato-Bold', color:'#515151',fontSize:Responsive.font(15)}}>Start</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.handleReset} style={{marginBottom:10,marginLeft:20,paddingHorizontal:20, justifyContent:'center',backgroundColor:'#91c549',borderRadius:12}}>
                    <Text style={{fontFamily: 'Lato-Bold', color:'#515151',fontSize:Responsive.font(15)}}>Reset</Text>
                  </TouchableOpacity>

            
                  </View>
          
          
        </ImageBackground>
      </View>
    );
  }
}

export default ScoreCard;
