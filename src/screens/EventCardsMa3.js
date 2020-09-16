import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {Icon} from 'native-base'
export default class EventCardsMa3 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            actScr: '1',
            newName:'',
            useNewName:false,
            startDate:null,
            endDate:null
        };
    }
    
    componentDidMount(){
        if(this.props.data.tournamentStartDate)
        {
            let date=this.convertDate(this.props.data.tournamentStartDate)
            this.setState({startDate:date})
        }
        let name=this.props.data.tournamentName
        let index= ''
        let splitter = 4

        let nameLength=this.convertString(name)
        if(nameLength>40){
            index = name.split(' ').slice(0,splitter).join(' ');
            this.setState({newName:index, useNewName:true})
        }
    }
    convertDate(date){
        var d= new Date(date)
        var month = '' + (d.getMonth() + 1)
        var day = '' + d.getDate()
        var year = d.getFullYear()
        if (month.length < 2) 
        month = '0' + month;
        if (day.length < 2) 
        day = '0' + day;
        return [day, month, year].join('/');
    }

    convertString(name){
        name = name.replace(/(^\s*)|(\s*$)/gi,"");
        name = name.replace(/[ ]{2,}/gi," ");
        name = name.replace(/\n /,"\n");
        return name.length;
    }

    render() {
        const data = this.props.data
        return (
           <View style={styles.cardStyles}>

                <View style={{ height:'45%', alignSelf:'center', width:'95%',justifyContent:'center'}}>
                   <Text style={{fontSize:Responsive.font(14), color:'#585858', fontFamily:'Lato-Bold'}}>{this.state.useNewName?this.state.newName:data.tournamentName}</Text>
               </View>

               <View style={{borderWidth:0.5,marginHorizontal:10,borderColor:'#81D4B6'}}></View>
               <View style={{ height:'45%', width:'95%', alignSelf:'center', justifyContent:'space-between', flexDirection:'row'}}>

                   <View style={{flex:1, flexDirection:'row',  justifyContent: 'flex-start',}}>
                       <Icon type="MaterialIcons" name="date-range"  style={{ alignSelf:'center',fontSize:Responsive.font(14) ,color: '#585858'}}/>
                       <Text style={{fontSize:Responsive.font(11), color:'#585858', fontFamily:'Lato-Medium',alignSelf:'center', paddingLeft:5}}>{this.state.startDate} - 28/01/2020</Text>
                   </View> 
               </View>
           </View> 

       );
   }
}
const styles = StyleSheet.create({
   cardStyles: {
       alignSelf:'center',
       marginHorizontal:10,
       width: '92%',
       borderRadius:3,
       backgroundColor: '#9EEACE',
       height:70,
       shadowColor: "#000",
       shadowOffset: {
           width: 0,
           height: 2,
       },
       justifyContent:'center',
       shadowOpacity: 0.23,
       shadowRadius: 2.62,

       elevation: 3,
       marginBottom:10
   },
   head: {
       color: 'white',
       fontFamily: 'Lato-Bold',
       fontWeight: 'bold',
       fontSize: Responsive.font(12)
   },
   inHead: {
       color: '#DCDCDC',
       fontFamily: 'Lato-Bold',
       fontSize: Responsive.font(12)
   },
   mySBtn: {
       backgroundColor: 'white',
       padding: 4,
       paddingLeft: 20,
       paddingRight: 20,
       borderRadius: 10,
       alignContent: 'flex-end',
       shadowColor: "#000",
       shadowOffset: {
           width: 0,
           height: 2,
       },
       shadowOpacity: 0.23,
       shadowRadius: 2.62,

       elevation: 4,
   },


});