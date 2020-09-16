import AsyncStorage from '@react-native-community/async-storage';

var User = {
    id:null,
    firstName:null,
    email:null,
    password:null,
    dateOfBirth:null,
    gender:null,
    mode:null,

    async init (responseObject){
        this.id = responseObject.uid,
        this.firstName = responseObject.firstName,
        this.email = responseObject.email,
        this.password = responseObject.password,
        this. dateOfBirth = responseObject.dateOfBirth,
        this.gender = responseObject.gender
        await AsyncStorage.setItem("userProfileDataPlayer", responseObject)
        
    },

    // async reload (responseObject){
    //     console.log(responseObject)
    //     this.id = responseObject.uid,
    //     this.firstName = responseObject.firstName,
    //     this.email = responseObject.email,
    //     this.password = responseObject.password,
    //     this. dateOfBirth = responseObject.dateOfBirth,
    //     this.gender = responseObject.gender        
    // },


    async changeMode (mode){
        this.mode = mode
        await AsyncStorage.setItem("Mode", this.mode)
    },

    clear(){
        this.id = null,
        this.firstName = null,
        this.email = null,
        this.password = null,
        this.dateOfBirth = null,
        this.gender = null,
        this.mode = null,
        AsyncStorage.setItem("Mode","")
    }
};

export default User;