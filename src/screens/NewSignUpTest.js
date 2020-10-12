import React from 'react'
import { View, Text,ScrollView, TouchableOpacity } from 'react-native'
import TextInputField from '../components/textInput'
import {Field, Formik} from 'formik'
import * as Yup from 'yup'
import DatePicker from '../components/datePicker'
import  LinearGradient from 'react-native-linear-gradient';
import { standardContainer, authImageStyle } from '../components/styles/layout';

const SignUpSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is equired"),
    password: Yup.string().min(8, "Minimun length of 8").required("Password is required"),
    confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    dateOfBirth: Yup.date().required('Please select Date of Birth'),
    firstName: Yup.string().min(2, "Minimun length of 2").required("First Name is required"),
    lastName: Yup.string().min(2, "Minimun length of 2").required("Last Name is required"),
})

export default function NewSignUpTest() {
    return (
        <LinearGradient colors={['#B9F0FB','#65A8B5']} style={standardContainer}>

        <Formik
            initialValues={{
                email:'',
                password:'',
                confirmPassword:'',
                firstName:'',
                lastName:'',
                dateOfBirth:new Date(),

            }}
            validationSchema={SignUpSchema}
            onSubmit={(values)=>{
                console.log(values)
            }}
        >
            {({
                handleSubmit,
                touched,
                errors,
            })=>(
                <ScrollView>
                     
                    <TextInputField
                        placeholder="First Name"
                        name="firstName"
                        keyboardType="default"
                    />
                     
                    <TextInputField
                        placeholder="Last Name"
                        name="lastName"
                        keyboardType="default"
                    />
                    
                    <TextInputField
                        placeholder="Email"
                        name="email"
                        keyboardType="email-address"

                    />
                    <TextInputField
                        placeholder="Password"
                        name="password"
                        keyboardType="default"
                        secureTextEntry={true}

                    />
                    <TextInputField
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        keyboardType="default"
                        secureTextEntry={true}

                    />
                    <Field
                        name="dateOfBirth"
                        component={DatePicker}  
                    />
                    <TouchableOpacity onPress={handleSubmit}><Text>here</Text></TouchableOpacity>
                </ScrollView>
                

            )}
            
        </Formik>
        </LinearGradient>
    )
}
