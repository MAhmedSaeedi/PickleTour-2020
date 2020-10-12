import React,{ useEffect, useState, useRef } from 'react'
import { View, Text, Image, ActivityIndicator,Alert,KeyboardAvoidingView, ScrollView
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import firebase from 'firebase';
import  LinearGradient from 'react-native-linear-gradient';
import { DatePicker, Icon } from 'native-base'
import { useSelector, useDispatch } from 'react-redux'
import { notificationSelector, fetchNotificationID } from '../store/slices/notifictionID'
import { authSelector, authUser } from '../store/slices/auth'
import { TouchableOpacity } from 'react-native';
import { Formik } from 'formik'
import * as Yup from 'yup'
import Input from '../components/styles/input'
import { standardContainer, authImageStyle } from '../components/styles/layout';
import { Login } from '../components/styles/authButton';
import Responsive from 'react-native-lightweight-responsive';
import { orText, registerText } from '../components/styles/text';
import moment from 'moment'
import { DatePickerForm } from '../components/datePick';
import InputButton from '../components/styles/inputButton'
import { Select } from '../components/styles/selction';
import TextInputField from '../components/textInput';



const genderData = [{value: 'Male'}, {value: 'Female'}];


const SignUpSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(8, "Minimun length of 8").required("Password is required"),
    firstName: Yup.string().min(2, "Minimun length of 2").required("Required"),
    lastName: Yup.string().min(2, "Minimun length of 2").required("Required"),
    confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    dob: Yup.string().required('Please select Date of Birth')
    
})

export default function NewSignUp() {
  
    return (
        <LinearGradient colors={['#B9F0FB','#65A8B5']} style={standardContainer}>

            <Formik
                initialValues={{
                    email:'',
                    password:'',
                    firstName:'',
                    lastName:'',
                    confirmPassword:'',
                    dob:new Date(1598051730000),
                    gender:'Select Gender'
                }}
                validationSchema={SignUpSchema}
            >
                {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    touched,
                    errors,
                    isSubmitting,
                    setFieldValue,
                    setFieldTouched
                })=>{
                    return(
                        <>
                            <ScrollView>
                            <Text style={{alignSelf:'center',marginTop:Responsive.height(50), marginBottom:Responsive.height(20),fontFamily:'Lato-Medium',color:'#3D737D', textShadowOffset:{width:0.2, height:0.2},textShadowColor:'black',textShadowRadius:2,fontSize:Responsive.font(35)}}>SignUp</Text>

                            <Input
                onChangeText={handleChange("firstName")}
                onBlur={handleBlur("firstName")}
                value={values.firstName}
                touched={touched.firstName}
                error={errors.firstName}
                placeholder="First Name"
            />
            <Input
                onChangeText={handleChange("lastName")}
                onBlur={handleBlur("lastName")}
                value={values.lastName}
                touched={touched.lastName}
                error={errors.lastName}
                placeholder="Last Name"
            />
            <Input
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                touched={touched.email}
                error={errors.email}
                placeholder="Email"
            />  

            <Input
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                touched={touched.password}
                error={errors.password}
                placeholder="Password"
            />
            <Input
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                value={values.confirmPassword}
                touched={touched.confirmPassword}
                error={errors.confirmPassword}
                placeholder="Confirm Password"
            />
           

            <Select
                data={genderData}
                label="Gender"
                autoCapitalize="none"
                value={values.gender}
                onChange={setFieldValue}
                
                onTouch={setFieldTouched}
            />
            <DatePickerForm
                values={values}
                onChange={setFieldValue}
            />

            <TouchableOpacity onPress={console.log(values)}>
                <Text>sada</Text>
            </TouchableOpacity>
            {/* <InputButton
                value={values.gender}
         
                onChange={setFieldValue}
            /> */}

            
         

                            </ScrollView>
                        </>
                    )
                }}

            </Formik>
            
         
        </LinearGradient>
    )
}


