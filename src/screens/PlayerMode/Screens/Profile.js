import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Modal, Alert, FlatList, PermissionsAndroid, Platform,TextInput, Image, AsyncStorage, StyleSheet, BackHandler, ActivityIndicator, Keyboard } from 'react-native';
import { Icon } from 'native-base'
import Responsive from 'react-native-lightweight-responsive';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import axios from 'axios'
import * as Progress from 'react-native-progress';
import { withNavigation, StackActions, NavigationActions, NavigationState } from 'react-navigation'
import Toast from 'react-native-tiny-toast'

class ProfileScreen extends Component {
  static navigationOptions = {
    headerMode:'float',
    headerTitle:
        <Text style={{ alignSelf:'center', color: 'white',fontFamily:'Lato-Bold',fontSize:Responsive.font(20) }}>My Profile</Text>
}
    constructor(props){
      super(props);
      this.data=''
      this.pressCount=0
      this.introduction='Not Defined'
      this.phone='Not Defined'
      this.languages='Not Defined'
      this.address='Not Defined'
      this.state={
        image:'',
        data:'',
        gender:'',
        age:'',
        phone:'',
        address:'',
        languages:'',
        introduction:'',
        phoneNumberStatus:false,
        languageStatus:false,
        addressStatus:false,
        introductionStatus:false,
        showModal:false,
        placeholder:'',
        sendingData:false,
        value:'',
        keyboradtype:'',
        picture:'',
        genericButtonStatus:true,
        backupData:'',
        enableEditing:true,
        RefereeMode:null,
        backPressed:false,
        pressCount:0
      }
    }
    componentDidMount(){
      this.backHandler = BackHandler.addEventListener("hardwareBackPress",this.backAction)
      this.getUserData()
      this.getMode()
    }

    
//   componentWillUnmount(){
//     global.currentScreenIndex =0
//     if(this.state.RefereeMode==true){

//     }
//     else{
//       this.props.navigation.dispatch(StackActions.reset({
//         index: 0,
//         actions: [NavigationActions.navigate({ routeName: 'FeaturedEvents' })],
//       }))
//     }
//    // this.focusListener.remove()
    
// }
    async getMode (){
      try{
        let mode = await AsyncStorage.getItem('Mode')
        console.log(mode)
        if(mode=='Referee'){
          this.setState({RefereeMode:true})
        }
        else{
          this.setState({RefereeMode:false})
        }
      }catch(error){}
    }

    backAction=()=>{
      if(this.pressCount==2){
        BackHandler.exitApp()
       }else{
         if(this.pressCount==1){
          this.pressCount = this.pressCount+1
          Toast.show('Press back again to exit app')
          setTimeout(()=>{
            this.pressCount=0
          },2000)
         }
         else{
          this.props.navigation.openDrawer()
          this.pressCount = this.pressCount+1
         }
         
       }
      return true
      
    }
    // backAction=()=>{
    //   global.currentScreenIndex = 0
    //   //this.props.navigation.dispatch(DrawerActions.toggleDrawer());
    //   //this.props.navigation.dispatch(StackActions.popToTop(),global.currentScreenIndex = 0)
    //   //this.props.navigation.toggleDrawer()
    //   if(this.state.RefereeMode==true){
    //     this.props.navigation.dispatch(StackActions.reset({
    //       index: 0,
    //       actions: [NavigationActions.navigate({ routeName: 'Dashboard' })],
    //     }))
    //   }
    //   else{
    //     this.props.navigation.dispatch(StackActions.reset({
    //       index: 0,
    //       actions: [NavigationActions.navigate({ routeName: 'FeaturedEvents' })],
    //     }))
    //   }
     
    //   return true
    // }

    correctAge() { 
      let date =''
      if(this.data.dateOfBirth.includes(' ')){
          
          var date1 = this.data.dateOfBirth.split(' ')
          var y1 = date1[0]
          var m1 = date1[1]
          var d1 = date1[2]
          
          if (m1.length < 2) 
          m1 = '0' + m1;
  
          if(d1.length<2)
          d1 = '0' + d1
          date =[y1,m1,d1].join('-')
          this.calculateAge(date)
      }
      else if (this.data.dateOfBirth.includes('-')){
              var date2 = this.data.dateOfBirth.split('-')
              if(date2[0].length==4){
                  var y2 = date2[0]
                  var m2 = date2[1]
                  var d2 = date2[2]
              }
              else{
                  var y2 = date2[2]
                  var m2 = date2[1]
                  var d2 = date2[0]
              }
              if(m2.length<2)
              m2 = '0'+m2
              if(d2.length<2)
              d2 = '0'+d2
              
              date = [y2, m2, d2].join('-')
              this.calculateAge(date)    
      }
    }
  
 
   
    async getUserData(){
      try{
        let user = await AsyncStorage.getItem('userProfileDataPlayer')
        this.data= JSON.parse(user)
        console.log(this.data)
        axios.get(`https://pickletour.appspot.com/api/user/get/${this.data.uid}`)
        .then(resp=>{
          let data = resp.data
          console.log(data)
          if(data.phone != undefined && data.phone != ''){
            this.phone = data.phone.toString()
            this.setState({phone:this.phone})
          }
          if(data.address != undefined && data.address !=''){
            this.address = data.address.toString()
            this.setState({address:this.address})
          }
          if(data.intro != undefined && data.intro != ''){
            this.introduction = data.intro.toString()
            this.setState({introduction:this.intro})
          }
          if(data.languages != undefined && data.languages != ''){
            this.languages = data.languages.toString()
            this.setState({languages:this.languages})
          }
          if(data.image !=undefined && data.image != ''){
            this.setState({image:data.image})
            this.image = data.image
            console.log(this.image)
          }
        })
        .catch((err)=>{
          console.log(err)
        })
        this.setState({data:this.data, gender:this.data.gender, showModal:false, sendingData:false, enableEditing:false})
        this.gender = this.data.gender
        this.correctAge(this.data.dateOfBirth)
      }catch(error){

        alert(error)
      }
    }
    calculateAge(date){
      var ageDifMs = Date.now() - new Date(date).getTime();
      var ageDate = new Date(ageDifMs);
      var res =  Math.abs(ageDate.getUTCFullYear() - 1970)
      this.age = res
      this.setState({age:res})
    }

    requestPermission(){

    }

    updateData(){
      Keyboard.dismiss()
      const { value, editingTitle } = this.state
      if(editingTitle=='Introduction')
      this.introduction = value.toString()
      //this.setState({introduction:value.toString()},()=>console.log('Introduction',this.state.introduction))
      else if(editingTitle=='Phone')
      this.phone = value.toString()
      //this.setState({phone:value},()=>console.log('Phone',this.state.phone))
      else if(editingTitle=='Languages')
      this.languages = value.toString()
      //this.setState({languages:value},()=>console.log('Languages',this.state.languages))
      else if(editingTitle=='Address')
      this.address = value.toString()
      //this.setState({address:value},()=>console.log('Address',this.state.address))
      axios.put(
        `https://pickletour.com/api/user/edit/${this.data.userMongoId}`,
        {
          firstName: this.data.firstName,
          email: this.data.email,
          picture: this.state.picture,
          dateOfBirth: this.data.dateOfBirth,
          clubName: '',
          gender: this.data.gender,
          rating: '',
          ratingByClub: '',
          skillLevel: '',
          phone: this.phone,
          tags: '',
          address: this.address,
          languages: this.languages,
          intro: this.introduction,
          martialStatus: '',
          isOrganizer: false,
          image: ''
        }).then(resp=>this.getUserData()).catch(err=>console.log(err))
    }

    componentWillUnmount(){
      this.backHandler.remove()
    }



  render() {
    return (
      <View style={{backgroundColor:'transparent', flex:1}}>
        <Modal
          transparent={true}
          animationType='none'
          visible={this.state.showModal}
        >
          <View  style={{ flex:1,justifyContent:'center', alignItems:'center', backgroundColor: 'rgba(52, 52, 52, 0.7)'}} >
            
            
            <View style={{justifyContent:'center',borderColor:'#64A8B5', borderRadius:10,paddingVertical:Responsive.height(10), backgroundColor:'white', width:'90%', borderWidth:1}}>


              <Text style={{ color:'#276091', alignSelf:'center',fontSize:Responsive.font(20),paddingVertical:Responsive.height(10),fontFamily:'Lato-Medium'}}>{this.state.editingTitle}</Text>
              <View style={{marginHorizontal:Responsive.width(20), borderColor:'grey', borderWidth:1, borderRadius:3}}>
                <TextInput
                  style={{paddingHorizontal:Responsive.height(10)}}
                  placeholder={this.state.placeholder}
                  value={this.state.value}
                  multiline={true}
                  ref="parentInput"
                  numberOfLines={1}
                  keyboardType={this.state.keyboradtype}
                  //onChangeText={value=>this.setState({value})}
                  onChangeText={(value)=>{
                    if(value==this.state.backupData)
                    this.setState({genericButtonStatus:true, value})
                    else
                    this.setState({genericButtonStatus:false, value})
                  }}
                />
              </View>
              <View style={{flexDirection:'row', justifyContent:'center', marginHorizontal:Responsive.width(20)}}>
                <TouchableOpacity onPress={()=>this.setState({showModal:false})} disabled={this.state.sendingData}
                //style={{justifyContent:'center', paddingVertical:10, backgroundColor:'white', width:'50%',}}
                style={{marginRight:20,justifyContent:'center',alignSelf:'center', backgroundColor:'#757575', width:'40%', paddingVertical:Responsive.height(5), marginTop:Responsive.height(10), borderRadius:5}}
                >
                           <Text style={{color:'white', alignSelf:'center',fontSize:Responsive.font(16),fontFamily:'Lato-Medium'}}>Cancel</Text>
                </TouchableOpacity>
                  {this.state.sendingData? <View style={{justifyContent:'center',alignSelf:'center',  width:'40%', paddingVertical:Responsive.height(5), marginTop:Responsive.height(10), borderRadius:5}}>
                    <ActivityIndicator />
                  </View> :
                      <TouchableOpacity onPress={()=>this.setState({ genericButtonStatus:true, sendingData:true},()=>this.updateData())} disabled={this.state.genericButtonStatus}
                      //style={{justifyContent:'center', paddingVertical:10, backgroundColor:'white', width:'50%'}}
                      style={{justifyContent:'center',alignSelf:'center', backgroundColor:'#40B64F', width:'40%', paddingVertical:5, marginTop:10, borderRadius:5}}
                      >
                                 <Text style={{color:'white', alignSelf:'center',fontSize:Responsive.font(16),fontFamily:'Lato-Medium'}}>Save</Text>
                      </TouchableOpacity> 
                  }
              </View>
            </View>
            
          </View>

        </Modal>
        <View style={{backgroundColor:'#757575', paddingBottom:20, shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 2,}}>
          <Image
              source={this.state.image!=''?{uri:this.state.image}:require('../../../../assets/User_Icon.png')}

              //source={require('../../../../assets/User_Icon.png')}
              style={{ width: 70, height: 70,borderRadius:100,marginTop:Responsive.height(66), marginLeft:Responsive.width(24), borderColor:'grey', borderWidth:2 }}
            />
          <Text style={styles.text}>{this.data.firstName}</Text>
          <Text style={styles.emailText}>{this.data.email}</Text>
          <View style={{flexDirection:'row', marginLeft:24}}>
            
            <Icon type="FontAwesome" name="star"  style={{ alignSelf:'center',fontSize:Responsive.font(14) ,color: '#FEC32D', marginTop:5}}/>
            <Icon type="FontAwesome" name="star"  style={{ alignSelf:'center',fontSize:Responsive.font(14) ,color: '#FEC32D', marginTop:5}}/>
            <Icon type="FontAwesome" name="star"  style={{ alignSelf:'center',fontSize:Responsive.font(14) ,color: '#FEC32D', marginTop:5}}/>
            <Icon type="FontAwesome" name="star"  style={{ alignSelf:'center',fontSize:Responsive.font(14) ,color: '#FEC32D', marginTop:5}}/>
            <Icon type="FontAwesome" name="star"  style={{ alignSelf:'center',fontSize:Responsive.font(14) ,color: '#FEC32D', marginTop:5}}/>
            <Text style={styles.reviews}>(24 Referee Reviews)</Text>
            <Text style={styles.viewAll}>View all</Text>
          </View>

          <View style={{flex:1, borderBottomColor:'white', borderBottomWidth:1, paddingTop:10}}></View>
          
          <Text style={styles.barText}>Pickletour win percentage (35/50 matches)</Text>
          <View style={{flexDirection:'row', marginLeft:24, marginTop:4, height:12, justifyContent:'space-between', marginRight:24}}>
            <Progress.Bar progress={0.7} width={null} color="#40B64F" borderColor='white' height={20} style={{flex:1}}  unfilledColor	='white'/>
            <Text style={styles.perText}> 70%</Text>
          </View>
          <Text style={styles.barText}>USAPA win percentage (15/30 matches)</Text>

          <View style={{flexDirection:'row', marginLeft:24, marginTop:4, height:12, justifyContent:'space-between', marginRight:24}}>
            <Progress.Bar progress={0.5} width={null} color="#40B64F" borderColor='white' height={20} style={{flex:1}} unfilledColor	='white'/>
            <Text style={styles.perText}> 50%</Text>
          </View>

        </View>
        <KeyboardAwareScrollView style={{marginLeft:24, marginRight:24}} showsVerticalScrollIndicator={false}>
          <Text style={styles.heading}>Introduction</Text>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}> 
            <Text style={styles.detail}>{this.introduction}</Text>
            {/* <TextInput 
              editable={false}
              style={styles.detail}
              multiline={true}
              ref='introduction'
              onChangeText={introduction => this.setState({introduction})}
              value={this.state.introduction}
            /> */}
            <Icon onPress={()=>this.setState({showModal:true, editingTitle:'Introduction', placeholder:'Enter Text', value:this.introduction, keyboradtype:'default'},()=>this.refs['parentInput'].focus())} type="FontAwesome" name="edit"  style={{ alignSelf:'center',fontSize:Responsive.font(20) ,color: '#40B64F'}}/>
          </View>
          <View style={{flex:1, borderBottomColor:'#757575', borderBottomWidth:0.5, paddingTop:10}}></View>
          <Text style={styles.heading}>Age</Text>
          <Text style={styles.detail}>{this.age} Years</Text>
          <View style={{flex:1, borderBottomColor:'#757575', borderBottomWidth:0.5, paddingTop:10}}></View>
          <Text style={styles.heading}>Gender</Text>
          <Text style={styles.detail}>{this.gender}</Text>
          {/* <TextInput 
            style={styles.inputStyle}
            editable={false}
            onChangeText={gender => this.setState({gender})}
            value={this.state.gender}
          /> */}
          

          <View style={{flex:1, borderBottomColor:'#757575', borderBottomWidth:0.5, paddingTop:10}}></View>
          <Text style={styles.heading}>Phone</Text>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}> 
          <Text style={styles.detail}>{this.phone}</Text>
            {/* <TextInput 
              editable={false}
              style={styles.detail}
              ref='phone'
              onChangeText={phone => this.setState({phone})}
              value={this.state.phone}
            /> */}
            <Icon onPress={()=>this.setState({showModal:true, editingTitle:'Phone', placeholder:'+923131111111', value:this.phone, backupData:this.state.phone, keyboradtype:'phone-pad'},()=>this.refs['parentInput'].focus())} type="FontAwesome" name="edit"  style={{ alignSelf:'center',fontSize:Responsive.font(20) ,color: '#40B64F'}}/>
          </View>
          <View style={{flex:1, borderBottomColor:'#757575', borderBottomWidth:0.5, paddingTop:10}}></View>
          <Text style={styles.heading}>Languages</Text>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}> 
            <Text style={styles.detail}>{this.languages}</Text>
            {/* <TextInput 
              editable={this.state.languageStatus}
              style={styles.detail}
              ref='language'
              multiline={true}
              onChangeText={languages => this.setState({languages})}
              value={this.state.languages}
            /> */}
            <Icon onPress={()=>this.setState({showModal:true, editingTitle:'Languages', placeholder:'Enter Text', value:this.languages, keyboradtype:'default'},()=>this.refs['parentInput'].focus())} 
            //onPress={()=>this.setState({languageStatus:true},()=>this.refs['language'].focus())} 
            type="FontAwesome" name="edit"  style={{ alignSelf:'center',fontSize:Responsive.font(20) ,color: '#40B64F'}}/>
          </View>
          <View style={{flex:1, borderBottomColor:'#757575', borderBottomWidth:0.5, paddingTop:10}}></View>
          <Text style={styles.heading}>Address</Text>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}> 
            <Text style={styles.detail}>{this.address}</Text>
            {/* <TextInput 
              editable={this.state.addressStatus}
              style={styles.detail}
              ref='address'
              multiline={true}
              onChangeText={address => this.setState({address})}
              value={this.state.address}
            /> */}
            <Icon onPress={()=>this.setState({showModal:true, editingTitle:'Address', placeholder:'Enter Text', value:this.address, keyboradtype:'default'},()=>this.refs['parentInput'].focus())} type="FontAwesome" name="edit"  style={{ alignSelf:'center',fontSize:Responsive.font(20) ,color: '#40B64F'}}/>
          </View>
          <View style={{flex:1,  paddingTop:10}}></View>

          {/* <TouchableOpacity 
          
        //   onPress={()=>this.props.navigation.navigate('ConfirmTRegister')} 
        onPress={()=>this.navigatrBaby()}
          style={{backgroundColor:'#32CDEA', width:'100%', height:40, marginBottom:20,justifyContent:'center', borderRadius:5,shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 2,
      },
      alignSelf:'center',
      shadowOpacity: 0.23,
      shadowRadius: 2.62,

      elevation: 2,}}>
              <Text style={{alignSelf:'center', color:'white', fontFamily:'Lato-Bold', fontSize:Responsive.font(14)}}>Update</Text>
          </TouchableOpacity> */}
        </KeyboardAwareScrollView>
      </View>
    )
  }
}

export default ProfileScreen

const styles = StyleSheet.create({
  text:{
    fontSize:Responsive.font(14),
    color:'white',
    fontFamily: 'Lato-Medium',
    marginLeft:24,
    marginTop:10
  },
  emailText:{
    fontSize:Responsive.font(12),
    color:'white',
    fontFamily: 'Lato-Regular',
    marginLeft:24
  },
  barText:{
    fontSize:Responsive.font(11),
    color:'white',
    fontFamily: 'Lato-Regular',
    marginLeft:24,
    marginTop:15
  },
  perText:{
    fontSize:Responsive.font(10),
    color:'white',
    fontFamily: 'Lato-Regular',    
    alignSelf:'center',
    marginLeft:10
  },
  reviews:{
    fontSize:Responsive.font(11),
    color:'white',
    fontFamily: 'Lato-Regular',
    marginLeft:24,
    marginTop:5
  },
  viewAll:{
    fontSize:Responsive.font(11),
    color:'#5DFF71',
    fontFamily: 'Lato-Regular',
    marginLeft:10,
    marginTop:5
  },
  heading:{
    fontSize:Responsive.font(14),
    color:'#464646',
    fontFamily: 'Lato-Bold',
    paddingTop:10
  },
  detail:{
    fontSize:Responsive.font(12),
    color:'#464646',
    width:'90%',
    fontFamily: 'Lato-Regular',
    paddingTop:10
  },
  inputStyle:{
    fontSize:Responsive.font(12),
    color:'#464646',
    fontFamily: 'Lato-Regular',
    
  }
})