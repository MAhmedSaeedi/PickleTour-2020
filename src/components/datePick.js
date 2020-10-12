import React, {useState} from 'react'
import { View, Text, Button } from "react-native";
import { DatePicker } from 'native-base'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment'
import { selectButton } from './styles/inputField';

export const DatePickerForm = props =>{
   const setDate=(date)=>{
    console.log(date)
    props.setFieldValue=date
   }

    return (
        <View style={[selectButton,{width:'85%', marginTop:10, marginBottom:10, paddingLeft:10}]}>
        <DatePicker
              modalTransparent={false}
              animationType={"fade"}
              androidMode={"default"}
              placeHolderText="Select Date"
              textStyle={{ color: "black" }}
              placeHolderTextStyle={{ color: "grey" }}
              onDateChange={setDate}
        />
        </View>
    );
}