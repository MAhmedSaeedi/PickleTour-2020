import React, { Component } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, BackHandler, StyleSheet, TextInput, Modal, ActivityIndicator, AsyncStorage } from 'react-native';
import Responsive from 'react-native-lightweight-responsive';
import { Icon } from 'native-base'
import { StackActions } from 'react-navigation';
import axios from 'axios';
import Toast from 'react-native-tiny-toast'
import notifications from '../../../helpers/handleNotifications';

var stripe = require('stripe-client')('pk_test_1EY0R4cujCqr0aL02h9d9zhX000XbA0n0b')

class RegistrationPaymentScreen extends Component {
    static navigationOptions = {
        headerMode:'float',
        headerTitle:
            <Text style={{ alignSelf:'center', color: 'white',fontFamily:'Lato-Bold',fontSize:Responsive.font(20)  }}>Payment</Text>
    }
  constructor(props) {
    super(props);
    this.data=''
    this.tourData=''
    this.players=''
    this.cardText='Card Number'
    this.state = {
      name:'',
      email:'',
      cp1:'4242',
      cp2:'4242',
      cp3:'4242',
      cp4:'4242',
      ccvc:'333',
      cyear:'22',
      cmonth:'12',
      completed:false,
      initialize:false,
      showError:false,
      addToWaitlist:false,
      cardText:true,
      error:'',
      invoiceNumber:'',
      showCard:false
    };
  }
  componentDidMount(){
    const data = this.props.navigation.getParam('data')
    this.data=data
    const tourData = this.props.navigation.getParam('tourData')
    this.tourData = tourData
    const invoice = this.generateNumber()
    const date = this.getDate()
    this.setState({name:this.data.fName, todayDate:date, invoiceNumber:invoice})
    this.backHandler = BackHandler.addEventListener("hardwareBackPress",this.backAction)
  }
  componentWillUnmount(){
    this.backHandler.remove()
  }

  generateNumber(){
    let min = 111111
    let max = 999999
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random()*(max-min))+min
  }

  backAction=()=>{
    const data = this.props.navigation.getParam('sender')
    const popAction = StackActions.pop({
      n: 1,
    });
    if(data==true){
      this.props.navigation.dispatch(popAction);
    }
    else{
      this.props.navigation.dispatch(StackActions.popToTop())
    }
  }

  getDate(){
    var d= new Date()
    var month = '' + (d.getMonth() + 1)
    var day = '' + d.getDate()
    var year = d.getFullYear()
    if (month.length < 2) 
    month = '0' + month;
    if (day.length < 2) 
    day = '0' + day;
    return [day, month, year].join('-');
  }
  createPayment(){
    const { cp1, cp2, cp3, cp4, cyear, cmonth, ccvc } = this.state
    this.setState({initialize:true})
    const Obj ={
      card:{
        number:cp1.toString()+cp2.toString()+cp3.toString()+cp4.toString(),
        exp_month: cmonth.toString(),
        exp_year: cyear.toString(),
        cvc: ccvc.toString()
      }
    }
    this.onPayment(Obj)
  }
  async onPayment(information) {
    var card = await stripe.createToken(information);
    var token = card.id;
    
    if(token){
      let response =  await fetch("https://pickletour.appspot.com/charge/"+this.data.fee*100,
      {
        method:"POST",
        headers: { "Content-Type": "text/plain" },
        body: token
      });
      
      if(response.ok){
        this.payUpdate()
      }
      //this.setState({completed:true})
    }
    else{
      this.setState({completed:true, showError:true, error:card.error.message})
      
    }
  }



  getTeams(userId, tournamentName){
    
    axios.get(`https://pickletour.appspot.com/api/team/get/team/${userId}`)
    .then((resp)=>{
      let data = resp.data
      data.forEach(a=>{
        if(a._id===this.data.teamId){
          this.players=a.players
        }
      })

      for(var i=0; i<this.players.length; i++){
        if(this.players[i].userId === userId){
            this.players[i].isPaid = true
            break
        }
      }
      let id=''
      if(this.data.teamId!=undefined){
        id=this.data.teamId
      }
      else{
        id=this.data._id
      }

      axios.put('https://pickletour.appspot.com/api/team/edit/paid/'+id,{
        players: this.players
      })
      .then((resp) => { 
        Toast.showSuccess('Payment Successful')
        this.getUserId(tournamentName, 'You have successfully registered as a player in your Team')
        setTimeout(()=>{
          // Toast.hide(toast)
          this.props.navigation.dispatch(StackActions.popToTop())
        },1000)
        
      }).catch((error) => {
        console.log("mongodb edit error", error)
      })
      
    })
    .catch(err=>{
      console.log(err)
    })
  }


  payUpdate(){
      const PlayerDetailsTwo = this.props.navigation.getParam('PlayerDetailsTwo')
      const eventType = this.props.navigation.getParam('eventType')
      const tournamentName = this.data.tournamentName

      if(eventType!=undefined){
        if(this.data.players==undefined){
          this.getTeams(this.data.userId, tournamentName)
        }
        else{
            for(var i=0; i<this.data.players.length; i++){
              if(this.data.players[i].userId === this.data.userId){
                  this.data.players[i].isPaid = true
                  break
              }
            }
            let id=''
            if(this.data.teamId!=undefined){
              id=this.data.teamId
            }
            else{
              id=this.data._id
            }
            axios.put('https://pickletour.appspot.com/api/team/edit/paid/'+id,{
              players: this.data.players
            })
            .then((resp) => { 
              Toast.showSuccess('Payment Successful')
              this.getUserId(this.data.tournamentName, 'You have successfully registered as a player in your Team')
              setTimeout(()=>{
                // Toast.hide(toast)
                this.props.navigation.dispatch(StackActions.popToTop())
              },1000)
            }).catch((error) => {
              console.log("mongodb edit error", error)
            })
        }
        
        

      }
      else{
        axios.put('https://pickletour.appspot.com/api/user/edit/isPaid/'+this.data.userId+"/"+this.data.tournamentId)
        .then((resp)=>{
        }).catch((error)=>{
          
        })
      
      for(var i=0; i<this.tourData.division.length;i++){
        if(this.tourData.division[i].nameOfDivision === this.data.divisionName){
          this.tourData.division[i].slotsAvailable = this.tourData.division[i].slotsAvailable-1
        }
      }
      
      
     
      axios.put('https://pickletour.appspot.com/api/tournament/slotChange/'+this.data.tournamentId,{
        division:this.tourData.division
      }).then(resp=>{
        if(PlayerDetailsTwo!=undefined){
          Toast.showSuccess('Payment Successful')
          this.getUserId(this.data.tournamentName, 'You have successfully registered as a player')
          setTimeout(()=>{
            // Toast.hide(toast)
            this.props.navigation.navigate('PlayerMyEvents')
            // this.props.navigation.dispatch(StackActions.popToTop())
          },1000)
        }
        else{
          this.getUserId(this.data.tournamentName, 'You have successfully registered as a player')
          this.getInviteLink()
        }
      })
      .catch(err=>console.log(err))
      }
      // var today = new Date()
      // var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      
      // axios.post('https://pickletour.com/api/notification/add',{
      //     message: "You have successfully registered as a player",
      //     event: this.data.tournamentName,
      //     type: "Player",
      //     date: date, 
      //     time: time,
      //     userId: this.data.userId
      // }).then(resp=>{
      //   // console.log(resp)
      // }).catch(err=>{
      //   console.log(err)
      // })
  }

  getInviteLink(){
    let res1=''
    let team=false
    if(this.tourData.type=='League' || this.tourData.type=='Sanctioned League'){
      res1= `https://pickletour.com/Team/Register/player/${this.data.tournamentId}/${this.data.teamId}/${this.data.index}`
      team=true
    }
    else{
      res1 =`https://pickletour.com/Player/Register/${this.data.divisionName}/${this.data.tournamentId}/${this.data.userId}/${this.data.index}`
      team=false
    }
    let res2 = res1.replace(" ","%20")
    let url = res2.replace("'","%27")
    this.setState({completed:false, initialize:false, showError:false},()=>this.props.navigation.navigate(team?'ConfirmTRegister':'InvitePlayers',{url}))
  }

  async getUserId(tournamentName, message){
    try{
        console.log('sending notification')
        let user = await AsyncStorage.getItem('UserID')
        let parsed = JSON.parse(user)
        notifications.sendLocalNotifications(parsed, tournamentName, message)
        axios.post('https://pickletour.com/api/notification/add',{
          message: message,
          event: tournamentName,
          type: "Player",
          date: date, 
          time: time,
          userId: this.data.userId
        }).then(resp=>{
          // console.log(resp)
        }).catch(err=>{
          //console.log(err)
        })
    }catch(error){
        //console.log(error)
    }
  }

  render() {
    const { cp1, cp2, cp3, cp4, cmonth, cyear, ccvc, error, showError, initialize, invoiceNumber } = this.state
    const enable = cp1.length==4 && cp2.length ==4 && cp3.length ==4 && cp4.length ==4 && cmonth.length ==2 && cyear.length ==2 && ccvc.length ==3
    return (
    <ScrollView style={{flex:1, backgroundColor:'white'}} contentContainerStyle={{alignItems:'center'}}>

      <Modal 
        transparent={true}
        animationType='none'
        visible={this.state.addToWaitlist}
        >
            <View
                style={{ flex:1,justifyContent:'center', alignItems:'center',backgroundColor:'rgba(52, 52, 52, 0.7)' }} 
            >
               
                <View style={{justifyContent:'center',borderRadius:10,backgroundColor:'white', width:'80%', borderWidth:1, borderColor:'#64A8B5'}}>
                    <Icon type="MaterialCommunityIcons" name="alert-outline"  style={{marginTop:30, alignSelf:'center',fontSize:Responsive.font(50) ,color: '#e5d335'}}/>
                    <Text style={{alignSelf:'center',fontFamily:'Lato-Bold', color:'#585858', fontSize:Responsive.font(13)}}>Pay now to confirm your seat in event.</Text>
                    <TouchableOpacity onPress={()=>this.setState({addToWaitlist:false})} style={{alignSelf:'center', backgroundColor:'#32CDEA', width:'90%', paddingVertical:5, marginTop:10, borderRadius:5}}><Text style={{alignSelf:'center',fontFamily:'Lato-Medium', color:'white', fontSize:Responsive.font(15)}}>Pay Now</Text></TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.setState({addToWaitlist:false},()=>this.props.navigation.dispatch(StackActions.popToTop()),global.currentScreenIndex = 0)} style={{alignSelf:'center', backgroundColor:'#757575', width:'90%', paddingVertical:5, marginTop:10, borderRadius:5, marginBottom:10}}><Text style={{alignSelf:'center',fontFamily:'Lato-Medium', color:'white', fontSize:Responsive.font(15)}}>Skip</Text></TouchableOpacity>
                    
                </View>
            </View>

 
        </Modal>
      <Modal 
        transparent={true}
        animationType='none'
        visible={this.state.completed}
        >
            <View
                style={{ flex:1,justifyContent:'center', alignItems:'center',backgroundColor:'white', opacity:0.9 }} 
            >
               
                <View style={{justifyContent:'center',borderRadius:10,backgroundColor:'white', width:'80%', borderWidth:1, borderColor:'#64A8B5'}}>
                    {!showError && <Icon type="Ionicons" name="ios-checkmark-circle-outline"  style={{marginTop:30, alignSelf:'center',fontSize:Responsive.font(50) ,color: '#51C560'}}/>}    
                    {showError && <Icon type="Entypo" name="circle-with-cross"  style={{marginTop:30, alignSelf:'center',fontSize:Responsive.font(50) ,color: '#E9835D'}}/>}
                    {showError?
                    <Text style={{alignSelf:'center',fontFamily:'Lato-Bold', color:'#585858', fontSize:Responsive.font(15), marginTop:30}}>{error}</Text>
                    :
                    <Text style={{alignSelf:'center',fontFamily:'Lato-Bold', color:'#585858', fontSize:Responsive.font(15)}}>Payment Successful.</Text>
                    }
                    
                    {showError?
                    <TouchableOpacity onPress={()=>this.setState({completed:false, initialize:false})} style={{alignSelf:'center', backgroundColor:'#757575', width:'90%', paddingVertical:5, marginTop:10, borderRadius:5, marginBottom:10}}><Text style={{alignSelf:'center',fontFamily:'Lato-Medium', color:'white', fontSize:Responsive.font(15)}}>Retry</Text></TouchableOpacity>
                    :
                    // <TouchableOpacity onPress={()=>this.setState({completed:false, initialize:false},()=>this.props.navigation.dispatch(StackActions.popToTop()))} style={{alignSelf:'center', backgroundColor:'#E9835D', width:'90%', paddingVertical:5, marginTop:10, borderRadius:5, marginBottom:10}}><Text style={{alignSelf:'center',fontFamily:'Lato-Medium', color:'white', fontSize:Responsive.font(15)}}>Close</Text></TouchableOpacity>  
                    <TouchableOpacity onPress={()=>this.setState({completed:false, initialize:false},()=>this.getInviteLink())} style={{alignSelf:'center', backgroundColor:'#51C560', width:'90%', paddingVertical:5, marginTop:10, borderRadius:5, marginBottom:10}}><Text style={{alignSelf:'center',fontFamily:'Lato-Medium', color:'white', fontSize:Responsive.font(15)}}>Invite</Text></TouchableOpacity>  
                    }
                    
                </View>
            </View>


        </Modal>
        <View style={{paddingTop:10, width:'98%', alignSelf:'center', paddingHorizontal:10}}>
            <View style={{backgroundColor:'#90E3F3', borderTopRightRadius:5, borderTopLeftRadius:5, paddingBottom:10, flexDirection:'row', justifyContent:'space-between',shadowColor: "#000",
                              shadowOffset: {
                                  width: 0,
                                  height: 2,
                              },
                              shadowOpacity: 0.23,
                              shadowRadius: 2.62,
                              elevation: 3,}}>
                <View style={{ paddingTop:10, paddingLeft:20}}>
                    <Image source={require('../../../../assets/NLogo.png')} style={{height:Responsive.height(50), width:Responsive.width(120)}} resizeMode="contain"/>
                    <Text style={{color:'#438C9A', fontFamily:'Lato-Medium', fontSize:Responsive.font(8)}}>California Sillicon Valley America - 90201</Text>
                    <Text style={{color:'#438C9A', fontFamily:'Lato-Medium', fontSize:Responsive.font(8)}}>support@pickletour.com</Text>
                    <Text style={{color:'#438C9A', fontFamily:'Lato-Medium', fontSize:Responsive.font(8)}}>+447566456664</Text>
                </View>
                
                <View style={{paddingTop:20, paddingRight:20, justifyContent:'space-between'}}>
                    <Text style={{alignSelf:'center', fontFamily:'Lato-Bold', fontSize:Responsive.font(18)}}>#{invoiceNumber}</Text>
                    <View style={{flexDirection:'row'}}>
                    <Text style={{margin:0,color:'#585858', fontFamily:'Lato-Bold', fontSize:Responsive.font(10)}}>Date : </Text>
                    <Text style={{margin:0,color:'#585858', fontFamily:'Lato-Medium', fontSize:Responsive.font(10)}}>{this.state.todayDate}</Text>
                    </View>
                </View>
            </View>
            <View style={{backgroundColor:'#BDF3FE', paddingTop:10, borderBottomRightRadius:5, borderBottomLeftRadius:5,shadowColor: "#000",
                              shadowOffset: {
                                  width: 0,
                                  height: 2,
                              },
                              shadowOpacity: 0.23,
                              shadowRadius: 2.62,
                              elevation: 3,}}>
                <Text style={{paddingLeft:20, fontFamily:'Lato-Bold', color:'#585858', fontSize:Responsive.font(14)}}>Payer Details</Text>
                <View style={{paddingLeft:20, flexDirection:'row'}}>
                  <Text style={{color:'#438C9A', fontFamily:'Lato-Bold', fontSize:Responsive.font(12)}}>Name : </Text>
                  <Text style={{color:'#438C9A', fontFamily:'Lato-Medium', fontSize:Responsive.font(12)}}>{this.data.fName?this.data.fName:this.data.teamLead}</Text>

                </View>

                <View style={{paddingLeft:20, flexDirection:'row'}}>
                  <Text style={{color:'#438C9A', fontFamily:'Lato-Bold', fontSize:Responsive.font(12)}}>Email : </Text>
                  <Text style={{color:'#438C9A', fontFamily:'Lato-Medium', fontSize:Responsive.font(12)}}>{this.data.email} </Text>
                </View>

                <View style={{borderWidth:0.5,borderColor:'#9CE1EF', marginTop:10, marginRight:10, marginLeft:10, marginBottom:10}}></View>

                <Text style={{paddingLeft:20, fontFamily:'Lato-Bold', color:'#585858', fontSize:Responsive.font(14)}}>Invoice Details</Text>

                <View style={{borderRadius:5,marginHorizontal:20, backgroundColor:'#E6FBFF', marginTop:10, paddingTop:10, paddingBottom:10, shadowColor: "#000",
                              shadowOffset: {
                                  width: 0,
                                  height: 2,
                              },
                              shadowOpacity: 0.23,
                              shadowRadius: 2.62,
                              elevation: 3,}}>
                  <Text style={{paddingLeft:10,color:'#438C9A', fontFamily:'Lato-Bold', fontSize:Responsive.font(12)}}>Description</Text>
                  <Text style={{paddingLeft:10,color:'#438C9A', fontFamily:'Lato-Medium', fontSize:Responsive.font(12)}}>{this.data.tournamentName}</Text>
                </View>

                <View style={{marginTop:10, flexDirection:'row', marginHorizontal:20, justifyContent:'space-between'}}>
                  <View style={{borderRadius:5,backgroundColor:'#E6FBFF', marginTop:10, paddingTop:10, paddingBottom:10, width:Responsive.font(90),shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.23,
                                shadowRadius: 2.62,
                                elevation: 3,}}>
                    <Text style={{color:'#438C9A', fontFamily:'Lato-Bold', fontSize:Responsive.font(12), alignSelf:'center'}}>Division</Text>
                    <Text style={{alignSelf:'center',color:'#438C9A', fontFamily:'Lato-Medium', fontSize:Responsive.font(11)}}>{this.data.divisionName}</Text> 
                  </View>
                  <View style={{borderRadius:5,backgroundColor:'#E6FBFF', marginTop:10, paddingTop:10, paddingBottom:10, width: Responsive.font(90),shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.23,
                                shadowRadius: 2.62,
                                elevation: 3,}}>
                    <Text style={{alignSelf:'center',color:'#438C9A', fontFamily:'Lato-Bold', fontSize:Responsive.font(12)}}>Registrations</Text>
                    <Text style={{alignSelf:'center',color:'#438C9A', fontFamily:'Lato-Medium', fontSize:Responsive.font(11)}}>1</Text> 
                  </View>
                  <View style={{ borderRadius:5,backgroundColor:'#E6FBFF', marginTop:10, paddingTop:10, paddingBottom:10, width:Responsive.font(90),shadowColor: "#000",
                                  shadowOffset: {
                                      width: 0,
                                      height: 2,
                                  },
                                  shadowOpacity: 0.23,
                                  shadowRadius: 2.62,
                                  elevation: 3,}}>
                  <Text style={{alignSelf:'center',color:'#438C9A', fontFamily:'Lato-Bold', fontSize:Responsive.font(12)}}>Unit Price</Text>
                    <Text style={{alignSelf:'center',color:'#438C9A', fontFamily:'Lato-Medium', fontSize:Responsive.font(11)}}>$ {this.data.fee}</Text> 
                  </View>
                  
                </View>
                <View style={{borderWidth:0.5,borderColor:'#9CE1EF', marginTop:15, marginRight:10, marginLeft:10, marginBottom:15}}></View>

                
                    <Text style={{paddingRight:20,alignSelf:'flex-end', color:'#585858', fontFamily:'Lato-Bold', fontSize:Responsive.font(16)}}>Invoice Total</Text>
                
                    <View style={{flexDirection:'row', justifyContent:'flex-end', paddingBottom:20}}>
                      <Text style={{paddingRight:5, color:'#519AA9', alignSelf:'center', fontFamily:'Lato-Bold',fontSize:Responsive.font(16)}}>$ {this.data.fee}</Text>
                      <Text style={{paddingRight:20, color:'#BD6262', alignSelf:'center',fontFamily:'Lato-Medium', fontSize:Responsive.font(12)}}>(Unpaid)</Text>
                    </View>
                
            </View>
            <Text style={{fontSize:Responsive.font(10),textAlign:'center', marginTop:10}}>This is electoronically generated invoice there is no need of signature and any approval, However invoice number have to be valid</Text>

            <View style={{alignSelf:'center', paddingTop:10, flexDirection:'row'}}>
              <Text style={{color:'#747474', alignSelf:'center',fontFamily:'Lato-Medium', fontSize:Responsive.font(12), paddingRight:10}}>Pay via</Text>
              <Image source={require('../../../../assets/strip_icon.png')}/>
            </View>

            <View style={{ alignItems:'center', paddingBottom:10, paddingTop:10}}>
             <View style={styles.cardStyle}>
              <Icon type="FontAwesome" name="credit-card"  style={{ marginRight:8,marginLeft:8,fontSize:Responsive.font(20) ,color: '#585858'}}/>
      
              <TouchableOpacity onPress={()=>this.setState({showCard:true},()=>this.refs['first'].focus())} style={{ width:this.state.showCard?0:'100%', height:this.state.showCard?0:undefined}} ><Text style={styles.cardText}>{this.cardText}</Text></TouchableOpacity>
             <TextInput
                style={styles.textInputStyle,{height:this.state.showCard?undefined:0, width:this.state.showCard?undefined:0}}
                placeholder='4242'
                ref='first'
                placeholderTextColor='transparent'
                maxLength={4}
                onFocus={()=>this.cardText=''} 
              // onTouchStart={()=>this.cardText=''}
               // onKeyPress={()=>this.cardText=''}
                //onAccessibilityTap={()=>this.cardText=''}
                keyboardType='numeric'
                onChangeText={(val)=>{
                  if(val.length==4){
                    this.refs['second'].focus()
                    this.setState({cp1:val})
                  }
                }}                
              />
              <TextInput
                style={styles.textInputStyle,{height:this.state.showCard?undefined:0, width:this.state.showCard?undefined:0}}
                placeholder='4242'    
                placeholderTextColor='transparent'
                ref='second'
                maxLength={4}
                keyboardType='numeric'
                onChangeText={(val)=>{
                  if(val.length==4){
                    this.refs['third'].focus()
                    this.setState({cp2:val})
                  }
                }}      

              />
              <TextInput
                style={styles.textInputStyle,{height:this.state.showCard?undefined:0, width:this.state.showCard?undefined:0}}
                placeholder='4242'
                placeholderTextColor='transparent'
                maxLength={4}
                ref='third'
                keyboardType='numeric'
                onChangeText={(val)=>{
                  if(val.length==4){
                    this.refs['fourth'].focus()
                    this.setState({cp3:val})
                  }
                }}                      
              />
              <TextInput
                style={styles.textInputStyle,{height:this.state.showCard?undefined:0, width:this.state.showCard?undefined:0}}
                placeholder='4242'   
                placeholderTextColor='transparent'
                maxLength={4}
                ref='fourth'
                keyboardType='numeric'
                onChangeText={(val)=>{
                  if(val.length==4){
                    this.refs['month'].focus()
                    this.setState({cp4:val})
                  }
                }}                   
              />

              <TextInput
                style={styles.textInputStyle,{height:this.state.showCard?undefined:0, width:this.state.showCard?undefined:0}}
                placeholder='MM'  
                placeholderTextColor={'#b0b0b0'}
                ref='month'
                maxLength={2}
                keyboardType='numeric'
                onChangeText={(val)=>{
                  if(val.length==2){
                    this.refs['year'].focus()
                    this.setState({cmonth:val})
                  }
                }}     
              
              />
              <Text style={{fontFamily:'lato-Medium', fontSize:Responsive.font(13), width:this.state.showCard?undefined:0, height:this.state.showCard?undefined:0}}>/</Text>
              <TextInput
                style={styles.textInputStyle,{height:this.state.showCard?undefined:0, width:this.state.showCard?undefined:0}}
                placeholder='YY'      
                ref='year' 
                maxLength={2}
                keyboardType='numeric'
                placeholderTextColor={'#b0b0b0'}
                onChangeText={(val)=>{
                  if(val.length==2){
                    this.refs['cvc'].focus()
                    this.setState({cyear:val})
                  }
                }}     
              />

              <TextInput
                style={styles.textInputStyle,{height:this.state.showCard?undefined:0, width:this.state.showCard?undefined:0}}
                placeholder='CVC'
                placeholderTextColor={'#b0b0b0'}
                ref='cvc'
                maxLength={3}
                keyboardType='numeric'
                onChangeText={(val)=>{this.setState({ccvc:val})
                }}
                
              />
             </View>
              {/* <PaymentCardTextField
                ref={(ref)=>{
                  this.paymentCardInput = ref
                }}
                style={styles.field}
                disabled={false}
              
              /> */}
            </View>

            <View style={{flexDirection:'row', justifyContent:'flex-end', alignItems:'center'}}>
              {!initialize && <TouchableOpacity style={{flexDirection:'row'}} onPress={()=>this.setState({addToWaitlist:true})}>
                <Icon type="AntDesign" name="plus"  style={{ marginRight:8,fontSize:Responsive.font(14) ,color: '#585858'}}/>
                <Text style={{fontSize:Responsive.font(12), fontFamily:'Lato-Medium', textDecorationLine:'underline'}}>Add to waitlist</Text>
              </TouchableOpacity>}
              
              {this.state.initialize?<ActivityIndicator style={{marginLeft:10, marginBottom:20}} color='#51C560' size='large'/>:
              <TouchableOpacity 
              onPress={()=>this.createPayment()}
              disabled={!enable}
              style={{marginLeft:10,paddingHorizontal:20,paddingVertical:10, marginBottom:20,backgroundColor:enable?'#4AAA4D':'#BEBAC5', borderRadius:5,shadowColor: "#000",
                                  shadowOffset: {
                                      width: 0,
                                      height: 2,
                                  },
                                  shadowOpacity: 0.23,
                                  shadowRadius: 2.62,
                                  elevation: 3,}}>
                <Text style={{fontFamily:'Lato-Medium', color:'white', fontSize:Responsive.font(12)}}>Pay</Text>
              </TouchableOpacity>
              }
              
            </View>

        </View>
      </ScrollView>
    );
  }
}

export default RegistrationPaymentScreen;

const styles = StyleSheet.create({
  field: {
    width: 300,
    color: '#449aeb',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    
  },
  cardStyle:{
    width:'100%',
    height:50,
    borderWidth:1,
    borderRadius:5,
    borderColor:'#585858',
    flexDirection:'row',
    alignItems:'center'
     
  },
  textInputStyle:{
    fontSize: Responsive.font(13),
    marginLeft: 1,
    fontFamily: 'Lato-Medium',
    color: 'black',
  },
  cardText:{
    fontSize: Responsive.font(13),
    fontFamily: 'Lato-Medium',
    color: '#b0b0b0',
  }
})