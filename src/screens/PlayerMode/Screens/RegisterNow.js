import React, { Component } from 'react';
import { Modal, View, Text, Image, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions, AsyncStorage } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Responsive from 'react-native-lightweight-responsive';
import axios from 'axios';
import { StackActions } from 'react-navigation';
import { Icon } from 'native-base'
import notifications from '../../../helpers/handleNotifications';

class RegisterNowScreen extends Component {
    static navigationOptions = {
        headerMode:'float',
        headerTitle:
            <Text style={{ alignSelf:'center', color: 'white',fontFamily:'Lato-Bold',fontSize:Responsive.font(20)  }}>Register Player</Text>
    }
  constructor(props) {
    super(props);
    this.data=''
    this.regData=''
    this.tourData=''
    this.userData = ''
    this.tournamentData=''
    this.state = {
      email:'',
      phone:'',
      name:'',
      address:'',
      completed:false,
      initializeRegistration:false,
      userData:''
    };
  }

  componentDidMount(){
      // this.getUserData()
      const data = this.props.navigation.getParam('tournamentData')
      const userData = this.props.navigation.getParam('User')
      const tournamentData = this.props.navigation.getParam('tourData')
      this.data = userData
      this.tourData = data
      this.tournamentData = tournamentData
      
      this.setState({email:this.data.email, name:this.data.firstName})   
  }

  registrationData(){
    const { name, email, address, phone } = this.state
    
    this.setState({initializeRegistration:true})
    const Obj ={
      address:address,
      fName:name,
      email:email,
      phone:phone,
      dob:this.data.dateOfBirth,
      gender:this.data.gender,
      isPaid:false,
      isWithdrawn:false,
      userId:this.data.uid,
      divisionName:this.tourData.divisionName,
      tournamentId:this.tourData.tournamentId,
      tournamentName:this.tourData.tournamentName,
      bracketType:this.tourData.bracketType,
      OrganizerName:this.tourData.organizerName,
      tEndDate:this.tourData.tEndDate,
      tStartDate:this.tourData.tStartDate,
      index:this.tourData.index,
      fee:this.tourData.fee,
      winningPer:0,
      rating:0,
      partnerId:"",
      slot:1,//mens women mixed double else zero
      teamFull:false,
    }
    
    let url = 'https://pickletour.appspot.com/api/player/register'
    axios.post(url,Obj)
    .then((response)=>{
      if(response.data.message=='player Registered'){
        this.getUserId(Obj.tournamentName)
        // this.setState({completed:true}, this.getRegistrationData())
        this.getRegistrationData()
      }
      else{
        this.setState({initializeRegistration:false})
      }
    })

  }
  async getUserId(tournamentName){
    try{
        let user = await AsyncStorage.getItem('UserID')
        let parsed = JSON.parse(user)
        notifications.sendLocalNotifications(parsed, tournamentName, 'You have registered as a waiting player, Pay now to reserve your spot')
        var today = new Date()
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        
        axios.post('https://pickletour.com/api/notification/add',{
            message: "You have registered as a waiting player, Pay now to reserve your spot",
            event: tournamentName,
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

  getRegistrationData(){
    let url ='https://pickletour.appspot.com/api/duo/player/get/checkReg/'
    axios.get(url+this.data.uid+'/'+this.tourData.tournamentId)
    .then((response)=>{
      this.setState({userData:response.data, completed:true})
    })
  }

  naviagteToPayment(){
    this.props.navigation.navigate('PaymentScreen',{data:this.state.userData, tourData:this.tournamentData})
  }


  render() {
    const { name, email, phone, address } = this.state
    const enabled = name.length>0 && email.length>0 && phone.length>0 && address.length>0
    return (
      <View style={{flex:1, backgroundColor:'white'}}>
        <Modal 
        transparent={true}
        animationType='none'
        visible={this.state.completed}
        >
            <View
                style={{ flex:1,justifyContent:'center', alignItems:'center',backgroundColor:'rgba(52, 52, 52, 0.7)' }} 
            >
               
                <View style={{justifyContent:'center',borderRadius:10,backgroundColor:'white', width:'80%', borderWidth:1, borderColor:'#64A8B5'}}>
                    <Icon type="Ionicons" name="ios-checkmark-circle-outline"  style={{marginTop:30, alignSelf:'center',fontSize:Responsive.font(50) ,color: '#51C560'}}/>
                    <Text style={{alignSelf:'center',fontFamily:'Lato-Bold', color:'#585858', fontSize:Responsive.font(13)}}>You have successfully registered.</Text>
                    <Text style={{alignSelf:'center',fontFamily:'Lato-Bold', color:'#585858', fontSize:Responsive.font(13)}}>Pay now to confirm your seat in event.</Text>
                    <TouchableOpacity onPress={()=>this.setState({completed:false},()=>this.naviagteToPayment())} style={{alignSelf:'center', backgroundColor:'#32CDEA', width:'90%', paddingVertical:5, marginTop:10, borderRadius:5}}><Text style={{alignSelf:'center',fontFamily:'Lato-Medium', color:'white', fontSize:Responsive.font(15)}}>Proceed to payment</Text></TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.setState({completed:false},()=>this.props.navigation.dispatch(StackActions.popToTop()))} style={{alignSelf:'center', backgroundColor:'#757575', width:'90%', paddingVertical:5, marginTop:10, borderRadius:5, marginBottom:10}}><Text style={{alignSelf:'center',fontFamily:'Lato-Medium', color:'white', fontSize:Responsive.font(15)}}>Close</Text></TouchableOpacity>
                    
                </View>
            </View>


        </Modal>
          <Text style={{color:'#585858', width:'98%', alignSelf:'center', paddingLeft:10, fontSize:Responsive.font(14), fontFamily:'Lato-Bold', paddingTop:20}}>Name</Text>
          
          <KeyboardAwareScrollView enableOnAndroid={true}>
          <View style={styles.SectionStyle}>     
            <TextInput
                style={styles.forms}
                placeholderTextColor={'#585858'}
                onChangeText={name => this.setState({ name })}
                value={this.state.name}
                placeholder="Name"
                keyboardType="default"
                returnKeyType="next"
            />    
        </View>

        <Text style={{color:'#585858', width:'98%', alignSelf:'center', paddingLeft:10, fontSize:Responsive.font(14), fontFamily:'Lato-Bold', paddingTop:20}}>Email</Text>
          <View style={styles.SectionStyle}>     
            <TextInput
                style={styles.forms}
                editable={false}
                placeholderTextColor={'#585858'}
                onChangeText={email => this.setState({ email })}
                value={this.state.email}
                placeholder="Email"
                keyboardType="default"
                returnKeyType="next"
            />    
        </View>

        <Text style={{color:'#585858', width:'98%', alignSelf:'center', paddingLeft:10, fontSize:Responsive.font(14), fontFamily:'Lato-Bold', paddingTop:20}}>Phone</Text>
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

        <Text style={{color:'#585858', width:'98%', alignSelf:'center', paddingLeft:10, fontSize:Responsive.font(14), fontFamily:'Lato-Bold', paddingTop:20}}>Address</Text>
          <View style={styles.SectionStyle}>     
            <TextInput
                style={styles.forms}
                placeholderTextColor={'#b0b0b0'}
                onChangeText={address => this.setState({ address })}
                value={this.state.address}
                placeholder="City, State, Country"
                keyboardType="default"
                returnKeyType="next"
            />
                
        </View>
        
        
        <View style={{flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        
        margin: 10, paddingTop:30}}>
        {this.state.initializeRegistration?<ActivityIndicator color='#51C560' size='large'/>:
         
         <TouchableOpacity 
         //onPress={()=>this.props.navigation.navigate('PaymentScreen',{data:this.regData})} 
         onPress={()=>this.registrationData()}
         disabled={!enabled}
         style={{backgroundColor:enabled?'#32CDEA':'#BEBAC5', width:'98%', height:40, justifyContent:'center', borderRadius:5,shadowColor: "#000",
         shadowOffset: {
             width: 0,
             height: 2,
         },
         shadowOpacity: 0.23,
         shadowRadius: 2.62,
 
         elevation: 2,}}>
                 <Text style={{alignSelf:'center', color:'white', fontFamily:'Lato-Bold', fontSize:Responsive.font(14)}}>Register</Text>
             </TouchableOpacity>
        
        
        }
        
       
        </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

export default RegisterNowScreen;

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