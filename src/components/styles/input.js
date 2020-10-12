import { View, TextInput, Text } from 'react-native'
import React from "react";

import {
    inputFieldContainer
} from './inputFieldContainer'
import {
    authField
} from './inputField'
const Input =({
    placeholder,
    touched,
    error,
    ...props
})=>{
    return(
        <View style={inputFieldContainer}>
            <TextInput style={authField} {...props} placeholder={placeholder} placeholderTextColor="grey"/>
            <Text style={{color:'red', marginTop:10}}>{touched && error}</Text>

        </View>
    )
}
export default Input