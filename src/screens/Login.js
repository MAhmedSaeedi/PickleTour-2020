import React from 'react';
import { View, Text, Image, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions, AsyncStorage, Modal } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import firebase from 'firebase';
import  LinearGradient from 'react-native-linear-gradient';
import Responsive from 'react-native-lightweight-responsive';
import { Icon } from 'native-base'
import axios from 'axios'

export default class Login extends React.Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props);
        this.state = {
            isFetching:false,
            userName: '',
            Password: '',
            msg: "",
            userId:'',
            backtoLogin:false,
            cannotSignIn:false,
            sendingRequest:false,
            notificationId:''
        };
    }
    componentDidMount(){
        this.getUserId()
        this.setState({
            userName:'',
            Password:''
        })
    }

    async getUserId(){
        try{
            let user = await AsyncStorage.getItem('UserID')
            let parsed = JSON.parse(user)
            this.setState({notificationId:parsed})
        }catch(error){
            //console.log(error)
        }
    }

    async letsHandleLogin(){
        try{
            this.setState({isFetching:true, msg:''})
            const {userName, Password}= this.state
            let user = await firebase.auth().signInWithEmailAndPassword(userName,Password)
            let url = 'https://pickletour.appspot.com/api/user/get/'+ user.user.uid
            const res = await fetch(url)
            
            const data = await res.json()
            const newUser ={
                userMongoId:data._id,
                uid: data.uid,
                firstName:data.firstName,
                email: data.email,
                password: data.password,
                dateOfBirth: data.dateOfBirth,
                gender:data.gender,
                isVerified:data.isVerified,
                notificationId:data.notificationId       
            }
            this.checkingUser(newUser)
        }catch(error){
            if(error.message.includes('There is no user record')){
                this.setState({isFetching:false,msg:'User not found.'})
            }
            else if(error.message.includes('The password is invalid or')){
                this.setState({isFetching:false,msg:'Incorrect email or password.'})
            }
            else if(error.message.includes('A network error')) {
                
                this.setState({isFetching:false,msg:'An unknown network error has occurred.'})
            }
            else{
                this.setState({isFetching:false,msg:'The email address is invalid.'})
            }
           
            
        }
    }


    updateUserNotificationId(userId, user){
        const Obj = {
            notificationId:this.state.notificationId
        }
        axios.put(`https://pickletour.appspot.com/api/user/add/notificationId/${userId}`,Obj)
        .then((resp)=>{
            user.notificationId=this.state.notificationId
            this.storingUserData(user)
        })
        .catch((err)=>{
            //console.log(err)
        })
    }

    checkingUser(user){
        if(user.isVerified==true){
            if(user.notificationId==this.state.notificationId){
                this.storingUserData(user)    
            }
            else{
                this.updateUserNotificationId(user.userMongoId, user)
            }
            
        }
        else{
            this.setState({cannotSignIn:true})
        }
    }

    async storingUserData(user){
        try{
            await AsyncStorage.setItem('userProfileDataPlayer', JSON.stringify(user))
            this.setState({isFetching:false},()=>this.props.navigation.navigate('Drawer'))
            // setTimeout(()=>{
            //     this.setState({isFetching:false})
            // },3000)
        }catch(error){
            //console.log(error)
        }
    }

    async resendEmail(){
        const { userName } =  this.state
        let url = 'https://pickletour.appspot.com/api/email/resend/'
        axios.get(url+userName)
        .then((resp)=>{
            //console.log(resp.data)
            this.setState({cannotSignIn:false})
        })
        .catch((err)=>{
            //console.log(err)
        })
    }

    render() {
        const { userName, Password, sendingRequest } =this.state
        const enabled = userName.length>0 && Password.length>0
        return (
            <LinearGradient           
                colors={['#B9F0FB','#65A8B5']}
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Modal 
                transparent={true}
                animationType='none'
                visible={this.state.cannotSignIn}
            >
            <View
                style={{ flex:1,justifyContent:'center', alignItems:'center',backgroundColor:'rgba(52, 52, 52, 0.7)' }} 
            >
               
                <View style={{justifyContent:'center',borderRadius:10,backgroundColor:'white', width:'80%', borderWidth:1, borderColor:'#64A8B5'}}>
                    <Icon type="Entypo" name="circle-with-cross"  style={{marginTop:30, alignSelf:'center',fontSize:Responsive.font(50) ,color: '#E9835D'}}/>
                    <Text style={{alignSelf:'center',fontFamily:'Lato-Bold', color:'#585858', fontSize:Responsive.font(13)}}>Your email is not verified yet</Text>
                    <Text style={{alignSelf:'center',fontFamily:'Lato-Bold', color:'#585858', fontSize:Responsive.font(13)}}>Didn't get a verification link?</Text>
                    {sendingRequest?<ActivityIndicator size='large' style={{paddingVertical:5, marginTop:10, marginBottom:10}}/>:
                        <TouchableOpacity onPress={()=>this.setState({sendingRequest:true, isFetching:false},()=>this.resendEmail())} style={{alignSelf:'center', backgroundColor:'#E9835D', width:'90%', paddingVertical:5, marginTop:10, borderRadius:5, marginBottom:10}}><Text style={{alignSelf:'center',fontFamily:'Lato-Medium', color:'white', fontSize:Responsive.font(15)}}>Resend</Text></TouchableOpacity>
                    }
                    
                    <TouchableOpacity onPress={()=>this.setState({cannotSignIn:false, isFetching:false})} style={{alignSelf:'center', backgroundColor:'#E9835D', width:'90%', paddingVertical:5, marginTop:10, borderRadius:5, marginBottom:10}}><Text style={{alignSelf:'center',fontFamily:'Lato-Medium', color:'white', fontSize:Responsive.font(15)}}>Close</Text></TouchableOpacity>
                    
                </View>
            </View>


        </Modal>
                <KeyboardAwareScrollView enableOnAndroid={true}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center',marginTop: Dimensions.get('window').height/3.9}}>
                        <View style={styles.SectionStyle}>
                           <Image resizeMode='contain' style={{ height:'100%',marginBottom:100, width: '100%'}} source={require('../../assets/NLogo.png')}/>
                        </View>
                        <View style={styles.SectionStyle}>
                            <TextInput
                                style={styles.forms}
                                placeholderTextColor={'gray'}
                                onChangeText={userName => this.setState({ userName })}
                                value={this.state.userName}
                                placeholder="Email"
                                autoCapitalize = 'none'
                                keyboardType="email-address"
                                returnKeyType="next"
                            />
                        </View>
                        <View style={styles.SectionStyle}>

                            <TextInput
                                style={styles.forms
                                }
                                onChangeText={Password => this.setState({ Password })}
                                value={this.state.Password}
                                placeholderTextColor={'gray'}

                                placeholder="Password"
                                keyboardType="default"
                                returnKeyType="next"
                                secureTextEntry={true}
                            />
                        </View>

                        {
                            this.state.isFetching? <ActivityIndicator size='large'
                            style={{marginTop: 20}}/>:
                            <TouchableOpacity onPress={() =>
                                this.letsHandleLogin()
                            } disabled={!enabled} style={{fontFamily: 'Lato-Bold',
                            alignItems: 'center',
                            backgroundColor: enabled?'#32CDEA':'#BEBAC5',
                            paddingTop:5,
                            paddingBottom:5,
                            borderRadius: 100,
                            marginTop: 20,
                            paddingLeft:50,
                            paddingRight:50,
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.23,
                            shadowRadius: 2.62,
                    
                            elevation: 4,
                            }} >
                                <Text style={styles.regButton1} >Sign in</Text>
                            </TouchableOpacity>
                        
                        }
                          <View style={{marginTop:Dimensions.get('window').height/20}}>
                            <Text style={{color:'white', fontFamily:'Lato-Bold', fontSize:Responsive.font(16), alignSelf:'center', textAlign:'center'}}>
                                {this.state.msg}
                            </Text>
                        </View>
                        {/* <View style={{marginTop:20}}>
                            <Text style={styles.forgButton}>Forgot Password?</Text>
                        </View> */}
                      
                    </View>
                    <View style={{ height: 1, backgroundColor: '#E2E2E2', marginTop: 30, marginBottom: 30, opacity:0.6, width:'80%', alignSelf:'center' }} />
                    <View style={{ alignItems: 'center', marginTop:Dimensions.get('window').height/20 }}>
                        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.props.navigation.navigate('SignUpScreen')}>
                            <Text style={styles.reg1}>Don't have an account?</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
            </LinearGradient>

        );
    }
}
const styles = StyleSheet.create({
    SectionStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: Responsive.height(50),
        margin: 10,
        

    },
    ImageStyle: {
        padding: 10,
        margin: 5,
        marginLeft: 15,
        marginRight: 15,
        height: 10,
        width: 10,
        resizeMode: 'stretch',
        alignItems: 'center'
    },
    ImageStyle1: {
        padding: 10,
        margin: 5,
        marginLeft: 15,
        marginRight: 15,
        height: 10,
        width: 25,
        resizeMode: 'stretch',
        alignItems: 'center'
    },
    forms: {
        fontSize: Responsive.font(14),
        padding: 8,
        paddingLeft: Responsive.width(20),
        width: '90%',
        // borderWidth: 1,
        // borderColor: '#48A080',
        borderRadius: 50,
        backgroundColor: 'white',
        height: Responsive.height(50),
        fontFamily: 'Lato-Medium',
        color: 'black',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
    },
    regButton1: {
        fontSize:Responsive.font(16),
        fontFamily: 'Lato-Medium',
        color: 'white',
        
        
    },
    regButton: {
        fontFamily: 'Lato-Medium',
        
        //width: Dimensions.get('window').width - 105,
        alignItems: 'center',
        // backgroundColor: '#48D5A0',
        paddingTop:5,
        paddingBottom:5,
        borderRadius: 100,
        marginTop: 20,
        paddingLeft:50,
        paddingRight:50,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
    },
    reg: {
        textDecorationLine: 'underline',
        color: '#48A080',
        fontWeight: 'bold',
        fontFamily: 'open-sans-simple',
        fontSize: 20
    },
    reg1: {
        fontFamily: 'Lato-Medium',
        color: 'white',
        fontSize:Responsive.font(16),
        textDecorationLine:'underline',
        

    },
    forgButton:{
        fontFamily: 'Lato-Bold',
        color: '#D0EEE3',
        fontSize:Responsive.font(16),
        // textShadowOffset:{width:0.5, height:0.5},
        // textShadowColor:'black',
        // textShadowRadius:1
        
    }
});