import { View, TextInput, Text, TouchableOpacity } from 'react-native'
import React from "react";
import { googleButton, loginButton } from './button';
import { loginText } from './text';

export const Login =({
    title
})=>{
    return(
        <TouchableOpacity style={loginButton}>
            <Text style={loginText}>{title}</Text>
        </TouchableOpacity>
    )
}

export const GoogleAuthButton = ({

})=>{
    return(
        <TouchableOpacity style={googleButton}>
            <Text>Sign in with google</Text>
        </TouchableOpacity>
    )
}