import React, {useState} from 'react'
import { View, Text, Platform } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { selectButton } from './styles/inputField';
import { buttonContainer, inputButtonContainer } from './styles/inputFieldContainer';
import { inputText, labelText } from './styles/text';
import { useFormikContext } from 'formik'

const DatePicker = ({
    name,
    field,
    form,
    ...props
})=>{
    const { handleChange, setFieldTouched, errors, touched } = useFormikContext();

    const [date, setDate] = useState(new Date())
    const [show, setShow] = useState(false)
    const [clicked, setClicked] = useState(false)
    const showDatePicker=()=>{
        setShow(true)
    }
    const onChange = (event, selectedDate)=>{
        const currentDate = selectedDate || date;
        setShow(Platform.OS==='ios')
        setDate(currentDate)
        form.setFieldValue(field.name, currentDate)
        setClicked(true)
    }
    return(
        <View style={buttonContainer}>
            <TouchableOpacity style={selectButton}onPress={showDatePicker}>
                <Text style={clicked?inputText:labelText}>{clicked ? date.toDateString() : "Select Date of Birth"}</Text>
            </TouchableOpacity>
            {show &&
            <DateTimePicker
            onChange={onChange}
            maximumDate={new Date()}
            value={field.value}
            name={field.name}
            mode='date'
            display='calendar'
            {...props}
        />}
            <Text style={{color:'red'}}>{touched[name] && errors[name]}</Text>

        </View>
    )
}
export default DatePicker