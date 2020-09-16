// import React, { Component } from 'react';
// import { AsyncStorage, Dimensions, StyleSheet, Text, View, TextInput, Image, FlatList, ActivityIndicator, TouchableOpacity, Keyboard} from 'react-native';
// import Responsive from 'react-native-lightweight-responsive';
// import ToBeRequestedEvents from './ToBeRequestedEvents';
// import axios from 'axios';

// class FindEventsScreen extends Component {
//     static navigationOptions = {
//         headerTitle:
//             <Text style={{ alignSelf:'center', color: 'white',fontFamily:'Lato-Bold',fontSize:Responsive.font(20)  }}>Find Events</Text>
//     }
//     constructor(props) {
//         super(props);
//         this.state = {
//             tourData:[],
//             page:0,
//             loading:true,
//             loadingMore:false,
//             filtering:false,
//             refreshing:false,
//             error:null,
//             todayDate:null,
//             todayTime:null,
//             showMessage:false
//         };
//     }
//     componentDidMount(){
//         this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide)
//         const today = new Date();
//         const h = today.getHours();
//         let m = today.getMinutes();
//         m = (m < 10) ? ("0" + m) : m;
//         let time = h+':'+m      
//         this.setState({todayDate:today, todayTime:time})
//         this.getUserData()
//         this.getTourData()
//     }

//     async getUserData(){
//         try{
//             let user = await AsyncStorage.getItem('userProfileDataPlayer')
//             this.data= JSON.parse(user)
      
//           }catch(error){
//             console.log(error)
//           }
//     }

//     getTourData(){
//         const { page } = this.state
//         var myEvents =[]
//         const url = 'https://pickletour.com/api/get/tournament/page/'
//         axios.get(url+page)
//     .then((response)=>{
//         myEvents = response.data
//         if(myEvents.length>0){
//             this.setState({
//                 tourData:myEvents,
//                 loading:false
//             })
//         }
//         else{
//             this.setState({
//                 loading:false,
//                 showMessage:true
//             })
//         }
//     })
//     .catch((error)=>{
//         console.log(error)
//     })

//     }

//     render() {
//         return (
//             <View>
//                 <View style={styles.SectionStyle}>
//                     <TextInput
//                     placeholder="Search by name or location"
//                     placeholderTextColor="#B1B1B1"
//                     style={styles.forms}
//                     onChangeText={value => this.searchFilterFunction(value)}
//                     />
//                     <Image style={{ marginRight:10, width: 20, height: 20 }} source={require('../../assets/Path100.png')} />
//                 </View>
//                     <FlatList
//                         style={{paddingTop:10, paddingBottom:10}}
//                         data={this.state.tourData}
//                         renderItem ={({item})=>
//                         (
//                             <TouchableOpacity onPress={() => { this.props.navigation.navigate('RefereeRequestScreen',{item:item, user:this.data}) }}>
//                             <ToBeRequestedEvents key={item._id} data={item} user={this.data} />
//                             </TouchableOpacity>
//                         )
                        
//                         }
                        
//                         ListEmptyComponent={()=>
//                             {
//                                 if(this.state.loading){
//                                     return <ActivityIndicator size='large'/>
//                                 }
//                                 else if(this.state.showMessage){
//                                     return <Text style={{fontFamily:'Lato-Bold',alignSelf:'center',fontSize:Responsive.font(20)}}>Events not found !</Text>
//                                 }
//                             }
//                         }
//                         keyExtractor={(item, index) => index.toString()}
//                         />
               

//             </View>
//         );
//     }
// }

const styles = StyleSheet.create({
    SectionStyle: {
        
        marginBottom:10,
        alignSelf:'center',
        width:'92%',
        borderRadius:20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F2F2F2',
        // borderRadius: 5,
        borderColor: "#48A080",
        borderWidth: 1,
        
    },
    forms: {
        paddingTop: 5,
        paddingRight: 5,
        paddingBottom: 5,
        paddingLeft: 0,
        backgroundColor: '#F2F2F2',
        color: '#48A080',
        width: Dimensions.get('window').width - 100,
        fontSize: Responsive.font(16),
    },
    topBarSty: {
        height: 40,
        width: Dimensions.get('window').width / 3,
        alignItems: 'center',
        justifyContent: 'center'
    },

    wrapTopSty: {
        backgroundColor: '#686868',
        flexDirection: 'row',
    },
    topBarText: {
        color: 'white',
        fontFamily: 'Lato-Bold',
        fontSize:Responsive.font(13)
    },
    selectedtopBarText:{
        color:'#9EEACE',
        fontFamily: 'Lato-Bold',
        textDecorationLine:'underline',
        fontSize:Responsive.font(13)
    },
    topBarStyAct: {
        height: 40,
        width: Dimensions.get('window').width / 3,
        alignItems: 'center',
        justifyContent: 'center',
        
    },




});


// export default FindEventsScreen;





import React from 'react';
import { View, Text, Picker, Button, ImageBackground, Image, TextInput, Dimensions, StyleSheet, ScrollView, ActivityIndicator, FlatList, TouchableOpacity, AsyncStorage } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { NavigationActions, StackActions } from 'react-navigation';
import axios from 'axios';
import ToBeRequestedEvents from './ToBeRequestedEvents';
export default class FindEventsScreen extends React.Component {
    static navigationOptions = {
        headerMode:'float',
        headerTitle:
            <Text style={{ alignSelf:'center', color: 'white',fontFamily:'Lato-Bold',fontSize:Responsive.font(20)  }}>Find Events</Text>
    }
    constructor(props) {
        super(props);
        this.data=''
        this.state = {
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
        this.getAlldata = this.getAlldata.bind(this)
    }
    async getUserData(){
        try{
            let user = await AsyncStorage.getItem('userProfileDataPlayer')
            this.data= JSON.parse(user)
      
          }catch(error){
           // console.log(error)
          }
    }
    getAlldata = () => {
        //console.log('in grtAllDatsa')
        var prevData = []
        var con = this.state.counter
        if(this.state.dropChanged){
            this.setState({
                loading: true,
                dataFound: false,
                counter: 0,
                dropChanged: false,
            })
            con = 0
        }
        else{
            prevData = this.state.tourData
        }
        var newData = [];
        var gettingUrl = 'https://pickletour.com/api/get/tournament/page/'
        //console.log(prevData, 'my prevData')
        ///console.log(con, 'my counter')
        //console.log(this.state.dropChanged, 'drop Changes')
        //console.log(this.state.eventType, 'asd')
        if (this.state.eventType == 'Recreational') {
            gettingUrl = 'https://pickletour.com/api/get/recreational/page/'
        }
        else if (this.state.eventType == 'League') {
            gettingUrl = 'https://pickletour.com/api/get/league/page/'
        }
        else if (this.state.eventType == 'Tournament') {
            gettingUrl = 'https://pickletour.com/api/get/tournament/page/'
        }
        //console.log(gettingUrl, 'my uRl')
      //console.log( gettingUrl + con) 
        axios
            .get(gettingUrl + con)
            .then((response) => {
                newData = response.data
                //console.log(newData,'asdasd')
                var allData = [...prevData, ...newData]
                var con = this.state.counter
                if (newData.length > 0) {
                    this.setState({
                        tourData: allData,
                        loading: false,
                        dataFound: true,
                        counter: con + 1
                    })
                }
                else {
                    this.setState({
                        tourData: allData,
                        loading: false,
                        dataFound: false
                    })
                }

            }).catch((error) => {
                //console.log("mongodb get register error", error)
                this.setState({ msg: "you are not connect to the internet" })
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
                this.getAlldata()
                this.onEndReachedCalledDuringMomentum = true;
            }
        }
    }
    componentDidMount() {
        this.getUserData()
        this.getAlldata()

    }
    render() {
        return (
            <View style={{ paddingTop: 10, paddingBottom:10 }}>
                <View style={styles.SectionStyle}>
                    <TextInput
                    placeholder="Search by name or location"
                    placeholderTextColor="#B1B1B1"
                    style={styles.forms}
                    onChangeText={value => this.searchFilterFunction(value)}
                    />
                    <Image style={{ marginRight:10, width: 20, height: 20 }} source={require('../../assets/Path100.png')} />
                </View>
                {this.state.tourData.length > 0 ?
                    <View>
                        <FlatList
                        data={this.state.tourData}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => { this.props.navigation.navigate('RefereeRequestScreen',{item:item, user:this.data}) }}>
                                <ToBeRequestedEvents key={item._id} data={item} user={this.data}/>
                            </TouchableOpacity>
                        )} 
                        keyExtractor={(item, index) => index}
                        onEndReached={this.onEndReached.bind(this)}
                        disableVirtualization={false}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent=
                        {this.state.loading ? <ActivityIndicator size="large" color="#48A080" /> : this.state.dataFound ? null : <Text style={{ justifyContent: 'center', textAlign: 'center' }}>No Remaining Data</Text>}
                        onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                    />
                    </View>
                    : <ActivityIndicator size="large" color="#48A080" />}
            </View>
        );
    }
}
