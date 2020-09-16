import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet, ActivityIndicator, AsyncStorage, FlatList, TouchableOpacity, BackHandler } from 'react-native';
import Responsive from 'react-native-lightweight-responsive';
import axios from 'axios'
import { withNavigation } from 'react-navigation'
import EventCard from '../PlayerMode/Cards/EventCard';
import Toast from 'react-native-tiny-toast'


class Tournaments extends Component {
  constructor(props) {
    super(props);
    this.data=''
    this.pressCount=0
    this.state = {
        backPressed:false,
        eventType: '',
        seLoc: '',
        tourData: [],
        loading: true,
        dataFound: false,
        counter: 0,
        dropChanged: false,
        gettingUrl: 'https://pickletour.com/api/get/tournament/page/'
    };
    this.onEndReachedCalledDuringMomentum = true;
    this.getData = this.getData.bind(this)
  }

  getData =()=>{
    var prevData =[]
    var con = this.state.counter
    if(this.state.dropChanged){
      this.setState({
        loading:true,
        dataFound:false,
        counter:0,
        dropChanged:false
      })
      con = 0
    }
    else{
      prevData = this.state.tourData
    }

    var newData =[]
    var dummyData=[]
    var gettingUrl = 'https://pickletour.com/api/get/bothTournaments/'
    axios.get(gettingUrl)
    .then((response)=>{
      newData = response.data
      
      var con = this.state.counter
      if(newData.length > 0){
        newData.map(item=>{
          var msDiff = new Date(item.regEndDate).getTime() - new Date().getTime()
          if(msDiff>=0){
              dummyData.push(item)
          }
        })
        if(dummyData.length>0){
          var allData = [...dummyData]
          var sortedArray = allData.sort((a,b)=> new Date(a.tStartDate) - new Date (b.tStartDate))
          this.setState({
            tourData:allData,
            loading:false,
            dataFound:true,
            counter:con+1
          })
        }
        else{
          this.setState({
            loading:false
          })
        }
      
      }
      else{
        //var allData =[...prevData]
        this.setState({
          //tourData:allData,
          loading:false,
          dataFound:false
        })
      }
    }).catch((error)=>{
      console.log(error)
    })
    
  }

  onEndReached = ({ distanceFromEnd }) => {
    var con = this.state.counter
    if (this.state.dataFound) {
        if (!this.onEndReachedCalledDuringMomentum) {
            this.setState({    // prevState?
                loading: true,
                counter: con + 1
            });
            this.forceUpdate()
            this.getData()
            this.onEndReachedCalledDuringMomentum = true;
        }
    }
  }

  componentDidMount(){
    this.setState({backPressed:false})
    this.getData()
    this.backHandler = BackHandler.addEventListener("hardwareBackPress",this.backAction)
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

  componentWillUnmount(){
    this.setState({backPressed:false})
    this.backHandler.remove()
  }
  render() {
    return (
      <View style={{backgroundColor:'white', flex:1, paddingTop:10}}>
        
        <FlatList
            data={this.state.tourData}
            renderItem={({item})=>(
              <TouchableOpacity onPress={()=>this.props.navigation.navigate('PlayerEventDetails',{item:item, type:'Tournament'})}>
                <EventCard data={item}/>
              </TouchableOpacity>
            )}
            ListFooterComponent={
              this.state.loading?
              <View style={{paddingTop:"50%"}}>
                <ActivityIndicator size="large" color="#48A080" />
              </View> : 
              this.state.dataFound?null:<Text style={{paddingTop:'50%', alignSelf:'center'}}></Text>
            }
            keyExtractor={(item, index)=>index}
            // onEndReached={this.onEndReached.bind(this)}
            // onEndReachedThreshold={0.5}
            // onMomentumScrollBegin={()=>{this.onEndReachedCalledDuringMomentum=false}}
            ListEmptyComponent={() => (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 50
                }}
              >
                {!this.state.loading && <Text style={{ color: 'black', fontFamily:'Lato-Medium', fontSize:Responsive.font(16) , marginTop:'50%'}}>No events Found</Text>}
              </View>
            )}
          />
      </View>
    );
  }
}

export default Tournaments;
