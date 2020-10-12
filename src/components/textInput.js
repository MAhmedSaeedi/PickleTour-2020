import { View, TextInput, Text } from 'react-native'
import React from "react";
import { useFormikContext } from 'formik'
import {
    inputFieldContainer
} from './styles/inputFieldContainer'
import {
    authField
} from './styles/inputField'

const TextInputField = ({
    name,
    keyboardType,
    placeholder,
    ...props
})=>{
    const { handleChange, setFieldTouched, errors, touched } = useFormikContext();
    return(
        <View style={inputFieldContainer}>
            <TextInput 
                keyboardType={keyboardType}
                onChangeText={handleChange(name)}
                onBlur={()=>setFieldTouched(name)}
                style={authField} 
                {...props} 
                placeholder={placeholder} 
                placeholderTextColor="grey"/>
                
                <Text style={{color:'red'}}>{touched[name] && errors[name]}</Text>
            

        </View>
    )

}

export default TextInputField
