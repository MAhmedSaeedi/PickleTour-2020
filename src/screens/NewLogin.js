import React,{ useEffect, useState } from 'react'
import { View, Text, Image, ActivityIndicator,Alert } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import firebase from 'firebase';
import  LinearGradient from 'react-native-linear-gradient';
import { Icon } from 'native-base'
import { useSelector, useDispatch } from 'react-redux'
import { notificationSelector, fetchNotificationID } from '../store/slices/notifictionID'
import { authSelector, authUser, googleSignIn, googleSignOut } from '../store/slices/auth'
import { TouchableOpacity } from 'react-native';
import { Formik } from 'formik'
import * as Yup from 'yup'
import Input from '../components/styles/input'
import { standardContainer, authImageStyle } from '../components/styles/layout';
import { Login } from '../components/styles/authButton';
import Responsive from 'react-native-lightweight-responsive';
import { orText, registerText } from '../components/styles/text';
import {
    GoogleSigninButton,
    GoogleSignin,
    statusCodes
} from '@react-native-community/google-signin'
import { WEB_CLIENT_ID } from '../configurations/keys'
import { googleButton } from '../components/styles/button';

const SignInSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(8, "Minimun length of 8").required("Required"),
})
export default function NewLogin(props) {
    const { notificationID, hasFound } = useSelector(notificationSelector)
    const { loading, hasErrors } = useSelector(authSelector)

    const [userInfo, setUserInfo] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState(null);

    const dispatch = useDispatch()
    useEffect(() => {
        configureGoogleSign();
    }, []);
    
    function configureGoogleSign() {
    GoogleSignin.configure({
        webClientId: WEB_CLIENT_ID,
        offlineAccess: false
    });
    }

    useEffect(()=>{
        dispatch(fetchNotificationID())
    },[dispatch])

    const login =()=>{
        dispatch(googleSignIn())
    }
    return (
        <LinearGradient colors={['#B9F0FB','#65A8B5']} style={standardContainer}>
            <Image resizeMode='contain' style={authImageStyle} source={require('../../assets/NLogo.png')}/>
            <Formik
                initialValues={{
                    email:"",
                    password:""
                }}
                onSubmit={(values)=>{
                    console.log(values)
                }}
                validationSchema={SignInSchema}
            >
                {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    touched,
                    errors,
                    isSubmitting
                })=>{
                   
                    return(
                    <>
                        <View>
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
                            touched={touched.password}
                            value={values.password}
                            error={errors.password}
                            placeholder="Password"
                        />
                        {loading ? <ActivityIndicator size="large" style={{marginTop:20}}/>:
                        <Login title="Sign In"/>
                        }
                        </View>
                    </>
                    )
                }}

            </Formik>
            <Text style={orText}>or</Text>
            <GoogleSigninButton onPress={login} style={googleButton}/>
            <View style={{ height: 1, backgroundColor: '#E2E2E2', marginTop: Responsive.height(30), marginBottom: 30, opacity:0.6, width:'80%', alignSelf:'center' }} />
            
            <TouchableOpacity onPress={() => props.navigation.navigate('SignUpScreen')}>
                <Text style={registerText}>Don't have an account?</Text>
            </TouchableOpacity>
        </LinearGradient>
    )
}
