import { View, TouchableOpacity, Text } from 'react-native'
import React from "react";
import { inputButtonContainer } from './inputFieldContainer';
import { authFieldSignUp } from './inputField';
import { inputTextButton, loginText } from './text';
import { loginButton } from './button';



const InputButton = ({
    value,
    label,
    
    ...props
})=>{
    
    const click=()=>{
        console.log('dasds')
    }
    const _handleChange = newValue =>{
        props.onChange(value, newValue)
    }
    return(
        <View style={inputButtonContainer}>
            <TouchableOpacity onPress={_handleChange} style={authFieldSignUp}>
                <Text style={inputTextButton}>{value}</Text>
            </TouchableOpacity>
        </View>
    )
}
export default InputButton