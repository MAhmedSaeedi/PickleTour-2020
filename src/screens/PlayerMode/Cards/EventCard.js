import React,{Component} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import { Icon } from 'native-base'
import Responsive from 'react-native-lightweight-responsive';
import firebase from 'firebase'

class EventCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      convertedDate:null,
      endDate:null,
      newName:'',
      useNewName:false,
      image:''
    };
  }

  // const ref = firebase
  //     .storage()
  //     .ref("/tournament_pic/"+this.props.id+".jpg");
  //     ref.getDownloadURL().then(url => {
  //     this.setState({ image: url });
  //    });
 async getPicture(id){
    // const ref = firebase.storage().ref("/tournament_pic/"+id+".jpg")
    // ref.getDownloadURL().then(url=>{
    //   this.setState({image:url})
    //   console.log(url)
    // })
    // .catch(err=>{
    //   console.log(err)
    // })
  }

  componentDidMount(){
    let id = this.props.data._id
    this.getPicture(id)
    let date = this.convertDate(this.props.data.tStartDate)
    this.setState({convertedDate:date})
    let eDate = this.convertDate(this.props.data.tEndDate)
    this.setState({endDate:eDate})

    let name = this.props.data.tournamentName
    let index= ''
    let splitter = 3
    
    let nameLength=this.convertString(name)
      if(nameLength>40){
        index = name.split(' ').slice(0,splitter).join(' ');
        console.log(index)
        this.setState({newName:index, useNewName:true})
    }

  }

  convertString(name){
    name = name.replace(/(^\s*)|(\s*$)/gi,"");
    name = name.replace(/[ ]{2,}/gi," ");
    name = name.replace(/\n /,"\n");
    return name.length;
  }
  convertDate(date){
    const months =[
      'Jan',
      'Feb',
      'Mar',
      'April',
      'May',
      'June',
      'July',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'

    ]
    var d = new Date(date)
    var monthIndex = d.getMonth()
    var monthName = months[monthIndex]
    var day = ''+d.getDate()
    var year = d.getFullYear()
    return [day, monthName, year].join(' ')
  }
  render() {
    const item = this.props.data
    
    // console.log(item.tStartDate.toDateString())
    return (
      <View style={styles.cardStyles}>
        <View style={{justifyContent:'center', }}>
            <Image  style={{width:Responsive.width(120), height:Responsive.height(95), margin:Responsive.width(5)}} 
            source={item.image!=undefined || item.image!=''?{uri:item.image}:require('../../../../assets/Pickleball-Court-1030x773.png')}
            //source={require('../../../../assets/Pickleball-Court-1030x773.png')}
            />
        </View>
        <View style={{flexDirection:'column', flex:1, justifyContent:'space-between'}}>
            <Text style={{ paddingLeft:10, fontFamily:'Lato-Medium', fontSize:Responsive.font(13) , color:'#585858'}}>{this.state.useNewName?this.state.newName:item.tournamentName}</Text>
            {item.type=='Sanctioned League'?
                <View style={{flexDirection:'row'}}>
                <Icon type="FontAwesome" name="star"  style={{ marginLeft:8,fontSize:Responsive.font(14) ,color: '#EF8700'}}/>
                <Text style={{color:'#EF8700',fontFamily:'Lato-Medium', fontSize:Responsive.font(11)}}>  USAPA Sanctioned</Text>
            </View>
            :
            null}

            {item.type=='USAPA Event'?
                <View style={{flexDirection:'row'}}>
                <Icon type="FontAwesome" name="star"  style={{ marginLeft:8,fontSize:Responsive.font(14) ,color: '#EF8700'}}/>
                <Text style={{color:'#EF8700',fontFamily:'Lato-Medium', fontSize:Responsive.font(11)}}>  USAPA Event</Text>
            </View>
            :
            null}


            {item.type=='Sanctioned Tournament'?
                <View style={{flexDirection:'row'}}>
                <Icon type="FontAwesome" name="star"  style={{ marginLeft:8,fontSize:Responsive.font(14) ,color: '#EF8700'}}/>
                <Text style={{color:'#EF8700',fontFamily:'Lato-Medium', fontSize:Responsive.font(11)}}>  USAPA Sanctioned</Text>
            </View>
            :
            null}
            
            <View style={{flexDirection:'row', marginTop:10}}>
              <Icon type="MaterialIcons" name="today"  style={{ marginLeft:8,fontSize:Responsive.font(14) ,color: '#585858'}}/>
              <Text style={{fontFamily:'Lato-Medium', fontSize:Responsive.font(11),color:'#585858'}}>  {this.state.convertedDate}</Text>
            </View>

            <Icon type="MaterialCommunityIcons" name="dots-vertical"  style={{ marginLeft:8,fontSize:Responsive.font(14) ,color: '#585858'}}/>

            <View style={{flexDirection:'row'}}>
              <Icon type="MaterialIcons" name="today"  style={{ marginLeft:8,fontSize:Responsive.font(14) ,color: '#585858'}}/>
              <Text style={{fontFamily:'Lato-Medium', fontSize:Responsive.font(11),color:'#585858'}}>  {this.state.endDate}</Text>
            </View>
        </View>
      </View>
    );
  }
}

export default EventCard;

const styles = StyleSheet.create({
    cardStyles: {
        flexDirection:'row',
        alignSelf:'center',
        borderRadius:3,
        marginHorizontal:10,
        width: '92%',
        backgroundColor: '#BDF3FE',
        // height:110,
        paddingTop:5,
        paddingBottom:5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        justifyContent:'space-between',
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 3,
        marginBottom:10
    },
}) 