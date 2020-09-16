import React, { Component } from 'react'
import { Text, View, AsyncStorage, FlatList, ActivityIndicator, BackHandler } from 'react-native'
import axios from 'axios'
import Notifications from './PlayerMode/Cards/Notifications';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { withNavigation, StackActions, NavigationActions, NavigationState } from 'react-navigation'
import Toast from 'react-native-tiny-toast'


class NotificationsScreen extends Component {
    static navigationOptions = {
        headerMode:'float',
        headerTitle:
            <Text style={{ alignSelf:'center', color: 'white',fontFamily:'Lato-Bold',fontSize:Responsive.font(20)  }}>Notifications</Text>
    }

    constructor(props) {
        super(props);
        this.userId=''
        this.pressCount=0
        this.state={
          notifications:[],
          loading:true,
          dataFound:false,
          backPressed:false
        }
    }

    componentDidMount(){
      this.backHandler = BackHandler.addEventListener("hardwareBackPress",this.backAction)
      this.getUserData()
    }
    componentWillUnmount(){
      this.backHandler.remove()
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

    async getUserData(){
        try{
            let user = await AsyncStorage.getItem('userProfileDataPlayer')
            let parsed = JSON.parse(user)
            this.userData= parsed
            this.userId=this.userData.uid
            this.getNotifications()
      
          }catch(error){
            console.log(error)
          }
    }

    getNotifications(){
        this.setState({
          loading:true,
          dataFound:false
        })
        var dummyData=[]
        axios
          .get(
            "https://pickletour.com/api/notification/get/" + this.userId
          )
          .then((resp)=>{
              if(resp.data.length>0){
                console.log(resp.data)
                resp.data.map(item=>{
                  if(item.type=='Player'){
                    dummyData.push(item)
                  }
                })
                console.log(dummyData)
                this.setState({notifications:dummyData, loading:false, dataFound:true})
              }
              else{
                this.setState({
                  loading:false,
                  dataFound:false
                })
              }
          })
          .catch((err)=>{
              
          })
    }

    updateNotification(item){
      console.log(item.isViewed)
      if(item.isViewed==false){
        axios.put(`https://pickletour.com/api/notification/change/${item._id}`)
        .then((resp)=>{
            console.log(resp.data)
            this.getNotifications()
        })
        .catch((err)=>{
            console.log(err)
        })
      }
    }
  render() {
    return (
      <View style={{flex:1, backgroundColor:'white'}}>
        <FlatList
          // ListHeaderComponent={

          // }
          extraData={this.state}
          data={this.state.notifications}
          keyExtractor={(item, index)=>index}
          renderItem={({item})=>(
            <TouchableOpacity  onPress={()=>this.updateNotification(item)} disabled={item.isViewed} >
              <Notifications data={item}/>
            </TouchableOpacity>
            
          )}
          ListFooterComponent={
            this.state.loading?
            <View style={{marginTop:'50%'}}>
              <ActivityIndicator size="large" color="#48A080" />
            </View> : 
            this.state.dataFound?null:<Text> </Text>
          }
          ListEmptyComponent={() => (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 50
              }}
            >
              {!this.state.loading && <Text style={{ color: 'black', fontFamily:'Lato-Medium', fontSize:Responsive.font(16) , marginTop:'25%'}}>Notifications not found</Text>}
            </View>
          )}
        />
      </View>
    )
  }
}

export default NotificationsScreen