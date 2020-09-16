import React, { Component } from 'react';
import { View, Text, Image, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions, AsyncStorage, ScrollView, Switch, Modal } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Responsive from 'react-native-lightweight-responsive';
import { StackActions } from 'react-navigation'
import axios from 'axios';
import {Icon} from 'native-base'
import notifications from '../../../helpers/handleNotifications';

class RegisterTeamScreen extends Component {
    static navigationOptions = {
        headerMode:'float',
        headerTitle:
            <Text style={{ alignSelf:'center', color: 'white',fontFamily:'Lato-Bold',fontSize:Responsive.font(20)  }}>Register Team</Text>
    }
  constructor(props) {
    super(props);
    this.data=''
    this.tourData=''
    this.tournamentData=''
    this.state = {
        beAPlayer:false,
        leadName:'',
        leadEmail:'',
        teamName:'',
        numofPlayer:'',
        completed:false,
        teamCompleted:false,
        initializeVerification:false,
        nameTaken:false,
        url:'',
        showInvite:false,
        phone:'',
        address:'',
        allowRegister:true,
        showMinAge:false,
        minAge:'',
        finalData:'',
        shouldAllowUser:false
    };
  }
  componentDidMount(){
    const data = this.props.navigation.getParam('tournamentData')
    const userData = this.props.navigation.getParam('User')
    const tournamentData = this.props.navigation.getParam('tourData')
    this.data = userData


    
    this.tourData = data
    this.tournamentData = tournamentData
    console.log(this.data)
    if(this.tourData.userAge>=this.tourData.minAge){
        this.setState({leadEmail:this.data.email, leadName:this.data.firstName, minAge:this.tourData.minAge, shouldAllowUser:true})    
    }
    else{
        this.setState({leadEmail:this.data.email, leadName:this.data.firstName, minAge:this.tourData.minAge, shouldAllowUser:false})
    }
    
  }

  registration(){
    const { teamName } = this.state
    this.setState({teamCompleted:true, initializeVerification:true, allowRegister:true, showMinAge:false})
    let url=`https://pickletour.appspot.com/api/team/get/name/${teamName}/${this.tourData.tournamentId}`
    axios.get(url)
    .then((resp)=>{
        if(resp.data.length==0){
            this.registerTeam()
        }
        else{
            this.setState({initializeVerification:false, nameTaken:true })
        }
    })
  }
  registerTeam(){
      const { teamName, numofPlayer, leadName, leadEmail, beAPlayer } = this.state
      let url =`https://pickletour.appspot.com/api/team/register/`
      const Obj={
          address:this.data.address,
          dob:this.data.dateOfBirth,
          tName:teamName,
          teamLead:leadName,
          noOfPlayers:numofPlayer,
          email:leadEmail,
          gender:this.data.gender,
          phone:this.data.phone,
          divisionName:this.tourData.divisionName,
          tournamentId:this.tourData.tournamentId,
          userId:this.data.uid,
          isPaid:false,
          fee:this.tourData.fee,
          ind:this.tourData.index,
          tournamentName:this.tourData.tournamentName,
          tEndDate:this.tourData.tEndDate.toString(),
          tStartDate:this.tourData.tStartDate.toString(),
      }
    if(beAPlayer==true){
        this.checkGender(Obj, url)
    }
    else{
        axios.post(url,Obj)
        .then((resp)=>{
            this.getUserId(Obj.tournamentName,'You have successfully registered your team')
            this.createInviteLink(resp.data)
        })
    }
  }

  async getUserId(tournamentName, message){
    try{
        let user = await AsyncStorage.getItem('UserID')
        let parsed = JSON.parse(user)
        notifications.sendLocalNotifications(parsed, tournamentName, message)
        axios.post('https://pickletour.com/api/notification/add',{
            message: message,
            event: this.data.tournamentName,
            type: "Player",
            date: date, 
            time: time,
            userId: this.data.uid
        }).then(resp=>{
          // console.log(resp)
        }).catch(err=>{
          console.log(err)
        })
    }catch(error){
        console.log(error)
    }
    
}

  quickTeamRegistration(obj, url){
        axios.post(url,obj)
        .then((resp)=>{
            this.setState({nameTaken:false},()=>this.registerAsPlayer(resp.data))
        })
  }

  checkAgeOfUser(obj, url){
      if(this.state.shouldAllowUser){
        this.setState({allowRegister:true, showMinAge:false},()=>this.quickTeamRegistration(obj, url))
        
      }
      else{
        this.setState({allowRegister:false, teamCompleted:true, initializeVerification:false, showMinAge:true})
      }
  }

  checkGender(obj, url){
    const userGender = this.data.gender
    if(userGender=='Male'){
        if(this.tourData.divisionName=='Men\'s Singles' || this.tourData.divisionName=='Men\'s Doubles' || this.tourData.divisionName=='Mixed\'s Doubles'){
            this.checkAgeOfUser(obj, url)
        }
        else{
            this.setState({allowRegister:false, teamCompleted:true, initializeVerification:false})
        }
    }
    else{
        if(this.tourData.divisionName=='Men\'s Singles' || this.tourData.divisionName=='Men\'s Doubles'){
            this.setState({allowRegister:false,teamCompleted:true, initializeVerification:false})
        }
        else{
            this.checkAgeOfUser(obj, url)
        }
    }
  }

  registerAsPlayer(data){
      const { numofPlayer,phone, address, leadName, leadEmail  } = this.state
      let url =`https://pickletour.appspot.com/api/player/register/edit/${data.team._id}`
      const Obj ={
          players:{
              address,
              dob:this.data.dateOfBirth,
              fName: leadName,
              email: leadEmail,
              gender: this.data.gender,
              phone,
              userId: this.data.uid,
              tournamentName:this.tourData.tournamentName,
              tEndDate:this.tourData.tEndDate.toString(),
              tStartDate:this.tourData.tStartDate.toString(),
              isPaid:false,
              rating:0,
              lName:null
          },
          noOfPlayers:numofPlayer - 1,
      }
      const userData={
          address,
          phone,
          email:leadEmail,
          dob:this.data.dateOfBirth,
          userId:this.data.uid,
          divisionName:this.tourData.divisionName,
          fName:leadName,
          fee:this.tourData.fee,
          bracketType: this.tourData.bracketType,
          index:this.tourData.index,  
          tournamentName:this.tourData.tournamentName,
          tEndDate:this.tourData.tEndDate.toString(),
          tStartDate:this.tourData.tStartDate.toString(),
          teamId:data.team._id,
          tournamentId:this.tourData.tournamentId
      }

      
      axios.put(url,Obj)
      .then((resp)=>{
          console.log(resp.data)
          if(resp.data.message=='team updated'){
            this.getUserId(this.tourData.tournamentName, 'You have registered as a waiting player in your team, Pay now to reserve your spot')
            this.setState({showInvite:false, nameTaken:false, initializeVerification:false, showPayment:true, finalData:userData }
                //,()=>this.props.navigation.navigate('PaymentScreen',{data:userData,tourData:this.tournamentData})
                )
          }
      })
  }
  createInviteLink(data){
    let res1= `https://pickletour.com/Team/Register/player/${data.team.tournamentId}/${data.team._id}/${data.team.ind}`
    let res2 = res1.replace(" ","%20")
    let url = res2.replace("'","%27")
    // this.setState({url,showInvite:true,initializeVerification:false, nameTaken:false})
    this.setState({showInvite:false, teamCompleted:false, nameTaken:false, initializeVerification:false },()=>this.props.navigation.navigate('ConfirmTRegister',{url}))
  }


  render() {
    const { leadEmail, leadName, teamName, numofPlayer, initializeVerification, nameTaken, showInvite, beAPlayer, phone, address, allowRegister, showMinAge, minAge,showPayment } = this.state
    const enabled = leadEmail.length>0 && leadName.length>0 && teamName.length>0 && numofPlayer.length>0 && numofPlayer>0
    const enabled2 = leadEmail.length>0 && leadName.length>0 && teamName.length>0 && numofPlayer.length>0 && numofPlayer>0 && phone.length>0 && address.length>0

    return (
        <ScrollView style={{flex:1, backgroundColor:'white'}}>

        <Modal 
        transparent={true}
        animationType='none'
        visible={this.state.teamCompleted}
        >
            <View
                style={{ flex:1,justifyContent:'center', alignItems:'center',backgroundColor:'rgba(52, 52, 52, 0.7)' }} 
            >
               
                <View style={{justifyContent:'center',borderRadius:10,backgroundColor:'white', width:'80%', borderWidth:1, borderColor:'#64A8B5'}}>
                    {/* <Text style={{alignSelf:'center',fontFamily:'Lato-Bold', color:'#585858', fontSize:Responsive.font(15), marginTop:30}}>You have successfully registered.</Text>
                    <TouchableOpacity onPress={()=>this.setState({completed:false},()=>this.props.navigation.navigate('PaymentScreen',{data:this.state.userData, tourData:this.tournamentData}))} style={{alignSelf:'center', backgroundColor:'#32CDEA', width:'90%', paddingVertical:5, marginTop:10, borderRadius:5}}><Text style={{alignSelf:'center',fontFamily:'Lato-Medium', color:'white', fontSize:Responsive.font(15)}}>Proceed to payment.</Text></TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.setState({completed:false},()=>this.props.navigation.dispatch(StackActions.popToTop()))} style={{alignSelf:'center', backgroundColor:'#E9835D', width:'90%', paddingVertical:5, marginTop:10, borderRadius:5, marginBottom:10}}><Text style={{alignSelf:'center',fontFamily:'Lato-Medium', color:'white', fontSize:Responsive.font(15)}}>Close</Text></TouchableOpacity> */}
                    {initializeVerification&&<ActivityIndicator color='#51C560' size='large' style={{marginTop:50}}/>}
                    {initializeVerification&&<Text style={{alignSelf:'center',fontFamily:'Lato-Bold', color:'#585858', marginBottom:50,fontSize:Responsive.font(15)}}>Verifying, please wait..</Text>}
                    {nameTaken && <Icon type="Entypo" name="circle-with-cross"  style={{marginTop:30, alignSelf:'center',fontSize:Responsive.font(50) ,color: '#E9835D'}}/>}
                    {nameTaken && <Text style={{alignSelf:'center',fontFamily:'Lato-Bold', color:'#585858', fontSize:Responsive.font(13)}}>Sorry! Team name is not available.</Text>}
                    {nameTaken &&<TouchableOpacity onPress={()=>this.setState({teamCompleted:false, nameTaken:false, initializeVerification:false})} style={{alignSelf:'center', backgroundColor:'#757575', width:'90%', paddingVertical:5, marginTop:10, borderRadius:5, marginBottom:10}}><Text style={{alignSelf:'center',fontFamily:'Lato-Medium', color:'white', fontSize:Responsive.font(15)}}>Close</Text></TouchableOpacity>}
                    {showInvite && <Icon type="Ionicons" name="ios-checkmark-circle-outline"  style={{marginTop:30, alignSelf:'center',fontSize:Responsive.font(50) ,color: '#51C560'}}/>}
                    {showInvite && <Text style={{alignSelf:'center',fontFamily:'Lato-Bold', color:'#585858', fontSize:Responsive.font(13)}}>Team registered successfully.</Text>}
                    {!allowRegister && <Icon type="Entypo" name="circle-with-cross"  style={{marginTop:30, alignSelf:'center',fontSize:Responsive.font(50) ,color: '#E9835D'}}/>}
                    {showMinAge && <Text style={{alignSelf:'center',fontFamily:'Lato-Bold', color:'#585858', fontSize:Responsive.font(13)}}>Minimum Age Restriction : {this.tourData.minAge}</Text>}
                    {!allowRegister && <Text style={{alignSelf:'center',fontFamily:'Lato-Bold', color:'#585858', textAlign:'center' ,fontSize:Responsive.font(13)}}>Sorry! You cannot register in this event.</Text>}
                    {!allowRegister &&<TouchableOpacity onPress={()=>this.setState({teamCompleted:false, alreadyRegistered:false, alreadyPaid:false})} style={{alignSelf:'center', backgroundColor:'#757575', width:'90%', paddingVertical:5, marginTop:10, borderRadius:5, marginBottom:10}}><Text style={{alignSelf:'center',fontFamily:'Lato-Medium', color:'white', fontSize:Responsive.font(15)}}>Close</Text></TouchableOpacity>}
                    
                    {showPayment && <Icon type="Ionicons" name="ios-checkmark-circle-outline"  style={{marginTop:30, alignSelf:'center',fontSize:Responsive.font(50) ,color: '#51C560'}}/>}
                    {showPayment && <Text style={{alignSelf:'center',fontFamily:'Lato-Bold', color:'#585858', fontSize:Responsive.font(13)}}>You have successfully registered.</Text>}
                    {showPayment && <Text style={{alignSelf:'center',fontFamily:'Lato-Bold', color:'#585858', fontSize:Responsive.font(13)}}>Pay now to confirm your seat in event.</Text>}
                    {showPayment && <TouchableOpacity onPress={()=>this.setState({teamCompleted:false},()=>this.props.navigation.navigate('PaymentScreen',{data:this.state.finalData,tourData:this.tournamentData,eventType:true}))} style={{alignSelf:'center', backgroundColor:'#32CDEA', width:'90%', paddingVertical:5, marginTop:10, borderRadius:5}}><Text style={{alignSelf:'center',fontFamily:'Lato-Medium', color:'white', fontSize:Responsive.font(15)}}>Proceed to payment</Text></TouchableOpacity>}
                    {showPayment && <TouchableOpacity onPress={()=>this.setState({teamCompleted:false},()=>this.props.navigation.dispatch(StackActions.popToTop()))} style={{alignSelf:'center', backgroundColor:'#757575', width:'90%', paddingVertical:5, marginTop:10, borderRadius:5, marginBottom:10}}><Text style={{alignSelf:'center',fontFamily:'Lato-Medium', color:'white', fontSize:Responsive.font(15)}}>Close</Text></TouchableOpacity>}
                    
                    
                    {showInvite && <TouchableOpacity onPress={()=>this.setState({showInvite:false, teamCompleted:false},()=>this.props.navigation.navigate('ConfirmTRegister',{url:this.state.url}))} style={{alignSelf:'center', backgroundColor:'#51C560', width:'90%', paddingVertical:5, marginTop:10, borderRadius:5, marginBottom:10}}><Text style={{alignSelf:'center',fontFamily:'Lato-Medium', color:'white', fontSize:Responsive.font(15)}}>Invite</Text></TouchableOpacity>  }

                </View>
            </View>


        </Modal>
        <Text style={{color:'#377884', width:'98%', alignSelf:'center', paddingLeft:10, fontSize:Responsive.font(14), fontFamily:'Lato-Bold', paddingTop:20}}>Team Lead Name</Text>
        
        <KeyboardAwareScrollView enableOnAndroid={true}>
        <View style={styles.SectionStyle}>     
          <TextInput
              style={styles.forms}
              placeholderTextColor={'#585858'}
              onChangeText={leadName => this.setState({ leadName })}
              value={this.state.leadName}
              placeholder="Team Lead Name"
              keyboardType="default"
              returnKeyType="next"
          />    
      </View>

      <Text style={{color:'#377884', width:'98%', alignSelf:'center', paddingLeft:10, fontSize:Responsive.font(14), fontFamily:'Lato-Bold', paddingTop:20}}>Team Lead Email</Text>
        <View style={styles.SectionStyle}>     
          <TextInput
              style={styles.forms}
              placeholderTextColor={'#585858'}
              onChangeText={leadEmail => this.setState({ leadEmail })}
              value={this.state.leadEmail}
              placeholder="Team Lead Email"
              keyboardType="default"
              returnKeyType="next"
          />    
      </View>

      <Text style={{color:'#377884', width:'98%', alignSelf:'center', paddingLeft:10, fontSize:Responsive.font(14), fontFamily:'Lato-Bold', paddingTop:20}}>Team Name</Text>
        <View style={styles.SectionStyle}>     
          <TextInput
              style={styles.forms}
              placeholderTextColor={'#b0b0b0'}
              onChangeText={teamName => this.setState({ teamName })}
              value={this.state.teamName}
              placeholder="Team Name"
              keyboardType="default"
              returnKeyType="next"
          />    
      </View>

      <Text style={{color:'#377884', width:'98%', alignSelf:'center', paddingLeft:10, fontSize:Responsive.font(14), fontFamily:'Lato-Bold', paddingTop:20}}>Number of Players</Text>
        <View style={styles.SectionStyle}>     
          <TextInput
              style={styles.forms}
              placeholderTextColor={'#b0b0b0'}
              onChangeText={numofPlayer => this.setState({ numofPlayer:numofPlayer.replace(/[^0-9]/g, '') })}
              value={this.state.numofPlayer}
              placeholder="Number of Players"
              keyboardType="number-pad"
              returnKeyType="next"
          />
              
      </View>
      
      <View style={{borderWidth:0.5,borderColor:'#E8E8E8', marginTop:10, marginRight:10, marginLeft:10}}></View>
      <View style={{flexDirection:'row', justifyContent:'space-between', width:'98%', alignSelf:'center', marginVertical:5}}>
          <Text style={{marginLeft:10, color:'#585858', fontFamily:'Lato-Bold', fontSize:Responsive.font(14)}}>Become a player</Text>
          <Switch thumbColor={this.state.beAPlayer? '#69C674':'#E9835D'} trackColor={{false:'#E9835D' , true:'#69C674' }}
                                value={this.state.beAPlayer}  
                                onValueChange ={(beAPlayer)=>this.setState({beAPlayer})}
                            /> 
      </View>
      <View style={{borderWidth:0.5,borderColor:'#E8E8E8', marginRight:10, marginLeft:10, marginBottom:10}}></View>
      
     {this.state.beAPlayer ?
     <View>
         <Text style={{color:'#377884', width:'98%', alignSelf:'center', paddingLeft:10, fontSize:Responsive.font(14), fontFamily:'Lato-Bold', paddingTop:20}}>Phone</Text>
        <View style={styles.SectionStyle}>     
          <TextInput
              style={styles.forms}
              placeholderTextColor={'#b0b0b0'}
              onChangeText={phone => this.setState({ phone:phone.replace(/[^0-9+]/g, '') })}
              value={this.state.phone}
              placeholder="+923131111111"
              keyboardType="phone-pad"
              returnKeyType="next"
          />     
      </View>

      <Text style={{color:'#377884', width:'98%', alignSelf:'center', paddingLeft:10, fontSize:Responsive.font(14), fontFamily:'Lato-Bold', paddingTop:20}}>Address</Text>
        <View style={styles.SectionStyle}>     
          <TextInput
              style={styles.forms}
              placeholderTextColor={'#b0b0b0'}
              onChangeText={address => this.setState({ address})}
              value={this.state.address}
              placeholder="City, State, Country"
              keyboardType="default"
              returnKeyType="next"
          />     
      </View>
     </View>:null}
      
      <View style={{flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      
      margin: 10, paddingTop:30}}>
          <TouchableOpacity disabled={beAPlayer?!enabled2 : !enabled} 
          onPress={()=>this.registration()}
        //   onPress={()=>this.props.navigation.navigate('ConfirmTRegister')} 
          style={{backgroundColor:beAPlayer?enabled2?'#32CDEA':'#BEBAC5':enabled?'#32CDEA':'#BEBAC5', width:'98%', height:40, justifyContent:'center', borderRadius:5,shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,

      elevation: 2,}}>
              <Text style={{alignSelf:'center', color:'white', fontFamily:'Lato-Bold', fontSize:Responsive.font(14)}}>Register</Text>
          </TouchableOpacity>
      </View>
      </KeyboardAwareScrollView>
    </ScrollView>
    );
  }
}

export default RegisterTeamScreen;

const styles = StyleSheet.create({
    forms: {
        fontSize: Responsive.font(14),
        padding: 8,
        paddingLeft: 10,
        
        width: '98%',
        borderWidth: 1,
        borderColor: '#64A8B5',
        borderRadius: 5,
        backgroundColor: '#D3F8FF',
        height: 40,
        fontFamily: 'Lato-Medium',
        color: '#585858',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
    },
    SectionStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        
        margin: 10,
        

    },
})