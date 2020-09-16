import React, { Component } from 'react';
import { View, Text, Image, Modal, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions, AsyncStorage } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Responsive from 'react-native-lightweight-responsive';
import Toast from 'react-native-tiny-toast'
import { Icon } from 'native-base'
import { NavigationActions, StackActions } from 'react-navigation';
import axios from 'axios'
import notifications from '../helpers/handleNotifications';


class RegisterAsRefereeScreen extends Component {
    static navigationOptions = {
        headerMode:'float',
        headerTitle:
            <Text style={{ alignSelf:'center', color: 'white',fontFamily:'Lato-Medium',fontSize:Responsive.font(20)  }}>Register Referee</Text>
    }
  constructor(props) {
    super(props);
    this.user=''
    this.BidAmount=''
    this.state = {
        name:'',
        email:null,
        phone:'',
        address:'',
        sendingData:false,
        submitted:false,
        enableInput:true, 
        bid:'',
        cannotRegister:false
    };
  }
  componentDidMount(){
    const user = this.props.navigation.getParam('user')
    const tournament = this.props.navigation.getParam('tournament')
    this.BidAmount = tournament.bidAmount
    // console.log(this.BidAmount)
    this.user=user


    this.setState({name:user.firstName, email:user.email})
  }

  dataCompilation(){
    const tournament = this.props.navigation.getParam('tournament')
    const {name, address, phone, email} = this.state
    const Obj ={
        address:address,
        dob:this.user.dateOfBirth,
        fName:name,
        email:email,
        gender:this.user.gender,
        phone:phone,
        divisionName: tournament.divisionName,
        bidAmount:tournament.bidAmount,
        bracketType: tournament.bracketType,
        tEndDate:tournament.tEndDate,
        organizerName:tournament.organizerName,
        tournamentId: tournament.tournamentId,
        tournamentName: tournament.tournamentName,
        tournamentStartDate: tournament.tournamentStartDate,
        type:  tournament.type,                
        userId:  this.user.uid,
        isPaid: false,
        tournamentAddress:tournament.tournamentAddress

    }
    this.setState({sendingData:true, enableInput:false},()=>this.verifyRequests(Obj))
  }

  verifyRequests(Obj){
    var reqEvents = []
    let requestExist = false
    var gettingUrl = 'https://pickletour.com/api/get/referee/requests/'
    axios.get(gettingUrl+Obj.userId)
    .then((response)=>{
        reqEvents = response.data
        if(reqEvents.length>0){
            reqEvents.forEach(item=>{
                if(item.bracketType == Obj.bracketType && item.divisionName == Obj.divisionName && item.tournamentId == Obj.tournamentId){
                    requestExist = true
                }
            })
            if(requestExist == true){
                this.setState({cannotRegister:true})
            }
            else{
                this.sendingData(Obj)
            }
        }
        else {
            this.sendingData(Obj)
        }
    })
}

  async sendingData(obj){
    const config = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj)
    }
    try{
        let url ='https://pickletour.appspot.com/api/referee/register'
        const res = await fetch(url, config)
        const data = await res.json()
        if(data.message =='referee Registered'){
            Toast.showSuccess('Request Sent')
            this.getUserId(obj.tournamentName,obj.userId)
            setTimeout(()=>{
                this.props.navigation.dispatch(StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'FindEvents' })]
                }))
            },1000)
        }
    }catch(error){

    }
    }

    sendNotification(name, id){
        var today = new Date()
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        
        axios.post('https://pickletour.com/api/notification/add',{
            message: "Your request to register as a referee has been submitted",
            event: name,
            type: "Referee",
            date: date, 
            time: time,
            userId: id
        }).then(resp=>{
            // console.log(resp)
        }).catch(err=>{
            console.log(err)
        })
    }
    async getUserId(tournamentName, userId){
        try{
            let user = await AsyncStorage.getItem('UserID')
            let parsed = JSON.parse(user)
            notifications.sendLocalNotifications(parsed, tournamentName, 'Your request to register as a referee has been submitted')
            this.sendNotification(tournamentName, userId)
        }catch(error){
            console.log(error)
        }
    }
  render() {
    const { name, address, phone, enableInput, bid} =  this.state
    const enabled = address.length>0 && phone.length>0 && name.length>0 && bid.length>0
    return (
    
      <View style={{flex:1, backgroundColor:'white'}}>

<Modal 
        transparent={true}
        animationType='none'
        visible={this.state.cannotRegister}
        >
            <View
                style={{ flex:1,justifyContent:'center', alignItems:'center',backgroundColor:'rgba(52, 52, 52, 0.7)' }} 
            >
               
                <View style={{justifyContent:'center',borderRadius:10,backgroundColor:'white', width:'80%', borderWidth:1, borderColor:'#64A8B5'}}>
                    <Icon type="Entypo" name="circle-with-cross"  style={{marginTop:30, alignSelf:'center',fontSize:Responsive.font(50) ,color: '#E9835D'}}/>
                    <Text style={{alignSelf:'center',fontFamily:'Lato-Bold', color:'#585858', fontSize:Responsive.font(13)}}>Request is already sent to organzier</Text>
                    <TouchableOpacity onPress={()=>this.setState({cannotRegister:false},()=>this.props.navigation.dispatch(StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'FindEvents' })]
                })))} style={{alignSelf:'center', backgroundColor:'#757575', width:'90%', paddingVertical:5, marginTop:10, borderRadius:5, marginBottom:10}}><Text style={{alignSelf:'center',fontFamily:'Lato-Medium', color:'white', fontSize:Responsive.font(15)}}>Close</Text></TouchableOpacity>
                    
                </View>
            </View>


        </Modal>
          
          
          <KeyboardAwareScrollView enableOnAndroid={true}>
          <Text style={{color:'#585858', width:'98%', alignSelf:'center', paddingLeft:10, fontSize:Responsive.font(14), fontFamily:'Lato-Bold', paddingTop:20}}>Name</Text>
          <View style={styles.SectionStyle}>     
            <TextInput
                editable={enableInput}
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
                editable={enableInput}
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
                editable={enableInput}
                placeholderTextColor={'#b0b0b0'}
                onChangeText={address => this.setState({ address })}
                value={this.state.address}
                placeholder="City, State, Country"
                keyboardType="default"
                returnKeyType="next"
            />
                
        </View>

        <Text style={{color:'#585858', width:'98%', alignSelf:'center', paddingLeft:10, fontSize:Responsive.font(14), fontFamily:'Lato-Bold', paddingTop:20}}>Rate</Text>
        <View style={styles.SectionStyle}>     
            <TextInput
                style={styles.forms}
                editable={enableInput}
                placeholderTextColor={'#b0b0b0'}
                onChangeText={bid => this.setState({ bid })}
                value={this.state.bid}
                placeholder="$"
                keyboardType="phone-pad"
                returnKeyType="next"
            />
                
        </View>
        
        <Text style={{color:'#585858', width:'98%', alignSelf:'center', paddingLeft:10, fontSize:Responsive.font(12), fontFamily:'Lato-Regular', paddingTop:5}}>The reward price from the organizer is ${this.BidAmount} per match, kindly bid accordingly.</Text>
        <View style={{flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        
        margin: 10, paddingTop:30}}>
            {this.state.sendingData?<ActivityIndicator size="large"/>:
            <TouchableOpacity 
            disabled={!enabled}
            onPress={()=>this.dataCompilation()} 
            style={{backgroundColor:enabled?'#008080':'#BEBAC5', width:'98%', height:40, justifyContent:'center', borderRadius:5,shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 2,}}>
                <Text style={{alignSelf:'center', color:'white', fontFamily:'Lato-Bold', fontSize:Responsive.font(14)}}>Register</Text>
            </TouchableOpacity>}
        </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

export default RegisterAsRefereeScreen;

const styles = StyleSheet.create({
    forms: {
        fontSize: Responsive.font(14),
        padding: 8,
        paddingLeft: 10,
        
        width: '98%',
        borderWidth: 1,
        borderColor: '#64A8B5',
        borderRadius: 5,
        backgroundColor: '#BBF1F1',
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
