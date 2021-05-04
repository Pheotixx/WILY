import React from 'react';
import {Text, View, TextInput,KeyboardAvoidingView, TouchableOpacity, Switch, Alert } from 'react-native';
import * as firebase from 'firebase';

export default class LoginScreen extends React.Component{
    constructor(){
        super();
        this.state = {
            password: '',
            emailId: ''
        }
    }

    login = async(email, password)=>{
        if(email && password){
            try{
                const response = await firebase.auth().signInWithEmailAndPassword(email, password)
                if(response){
                    this.props.navigation.navigate('transaction')
                }
            }
            catch(error){
                switch(error.code){
                    case 'auth/user-not-found':
                        Alert.alert("User does not exist.")
                        console.log("Does Not Exist")
                        break
                    case 'auth/invalid-email':
                        Alert.alert("Incorrect Email or Password")
                        console.log("Invalid")
                        break
                }
            }
        }
        else{
            Alert.alert("Enter your email and password.");
        }
    }
    
    render(){
        return(
            <KeyboardAvoidingView style = {{alignItems:'center',marginTop:20}}>
                <View>
                    <Image
                    source={require("../assets/booklogo.jpg")}
                    style={{width:200, height: 200}}/>
                    <Text style={{textAlign: 'center', fontSize: 30}}>Wily</Text>
                </View>

                <View>
                    <TextInput 
                        style={styles.loginBox}
                        placeholder = "Email Id" 
                        keyboardType ='email-address'
                        onChangeText={(text)=>{
                            this.setState({
                                emailId: text
                            })
                        }}
                    />
                    
                    <TextInput 
                        style={styles.loginBox}
                        secureTextEntry={true}
                        placeholder = "Password"
                        keyboardType ='email-address'
                        onChangeText={(text)=>{
                            this.setState({
                                password: text
                            })
                        }}
                    />
                </View>
                
                <View>
                    <TouchableOpacity
                        style = {styles.loginButton}
                        onPress = {()=>{
                            this.login(this.state.emailId, this.state.password);
                        }}>
                        <Text>Login</Text>
                    </TouchableOpacity>
                </View>
        
            </KeyboardAvoidingView>
                    
        )
    }

    
}

const styles = StyleSheet.create({
    loginBox:
    {
        width: 300,
        height: 40,
        borderWidth: 1.5,
        fontSize: 20,
        margin:10,
        paddingLeft:10
    },
    loginButton:{
        width: 90,
        height: 30,
        borderWidth: 1.5,
        paddingTop: 5
    }
  })