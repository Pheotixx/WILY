import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet,Alert, KeyboardAvoidingView, ToastAndroid} from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner'
import * as Permissions from 'expo-permissions' 
import * as firebase from 'firebase'
import db from '../config.js'

export default class TransactionScreen extends React.Component{
    constructor(){
        super();
        this.state = {
            hasCameraPemissions: null,
            scanned: false,
            scannedStudentId: '',
            scannedBookId: '',
            buttonState: normal
        }
    }

    getCameraPermissions = async(id)=>{
        const [status] = await Permissions.askAsync(Permissions.CAMERA);

        this.setState({
            hasCameraPermissions: status === "granted",
            buttonState: id
        })
    }

    handleBarCodeScanned = async({type,data})=>{
        const {buttonState} = this.state

        if(buttonState === "BookId"){
            this.setState({
                scanned: true,
                scannedData: data,
                buttonState: normal
            })
        }
        else if(buttonState === "StudentId"){
            this.setState({
                scanned: true,
                scannedData: data,
                buttonState: normal
            }) 
        }
    }

    initiateBookIssue = async()=>{
        db.collection("transactions").add({
            "studentId" : this.state.scannedStudentId,
            "bookId": this.state.scannedBookId,
            "date": firebase.firestore.TimeStamp.now().toDate(),
            "transactionType": "issue"
        })

         //change book status
         db.collection("books").doc(this.state.scannedBookId).update({
            'bookAvailability' : false
        })

        //change number of books issued to student
        db.collection("student").doc(this.state.scannedStudentId).update({
            'noOfBooksIssued' : firebase.firestore.FieldValue.increment(1)
        })

        Alert.alert("bookIssued");
        this.setState({
            scannedBookId: '',
            scannedStudentId: ''
        })
    }

    initiateBookReturn = async()=>{
        db.collection("transactions").add({
            "studentId" : this.state.scannedStudentId,
            "bookId": this.state.scannedBookId,
            "date": firebase.firestore.TimeStamp.now().toDate(),
            "transactionType": "return"
        })

         //change book status
         db.collection("books").doc(this.state.scannedBookId).update({
            'bookAvailability' : true
        })

        //change number of books issued to student
        db.collection("student").doc(this.state.scannedStudentId).update({
            'noOfBooksIssued' : firebase.firestore.FieldValue.increment(-1)
        })

        Alert.alert("bookReturned");
        this.setState({
            scannedBookId: '',
            scannedStudentId: ''
        })


    }

    handleTransactions =async()=>{
       //verify if student is eligible for book issue or return
      //student details exist in database
      //issue:books issued<2
      //verify book availability
      //return:last transaction:book issued by student id

      var transactionType = await this.checkBookEligibility();
      if(!transactionType){
          Alert.alert("The book does not exist in library database");
          this.setState({
              scannedBookId : '',
              scannedStudentId : ''
          })
      }

      else if(transactionType === "Issue"){
        var isStudentEligible = await this.checkStudentEligibilityForBookIssue();
        if(isStudentEligible){
            this.initiateBookIssue();
            Alert.alert("Book issued to student")
        }
      }
      
      else{
        var isStudentEligible = await this.checkStudentEligibilityForBookReturn();
        if(isStudentEligible){
            this.initiateBookReturn();
            Alert.alert("Book returned by the student.")
        }
      }
    }

    checkBookEligibility = async()=>{
        const bookref = await db
        .collection("books")
        .where("bookId","==",this.state.scannedBookId)
        .get()
        var transactionType = "";
        if(bookref.docs.length == 0){
            transactionType = false;
        }
        else{
            bookref.docs.map((doc) =>{
              var book = doc.data();
              if(book.bookAvailability){
                  transactionType ="Issue"
              }
              else{
                  transactionType = "Return"
              }
            })
        }
        return transactionType();
    }
    
    checkStudentEligibilityForBookIssue = async() =>{
        const studentref = await db
        .collection(students)
        .where("studentId","==",this.state.scannedStudentId)
        .get()

        var isStudentEligible = "";
        if(studentref.docs.length == 0){
            this.setState({
                scannedBookId: '',
                scannedStudentId: ''
            })
            isStudentEligible = false
            Alert.alert("This student ID does not exist in the database.")
        }else{
            studentref.docs.map((doc)=>{
                var student = doc.data();
                if(student.noOfBooksIssued < 2){
                    isStudentEligible = true;
                }else{
                    isStudentEligible = false;
                    Alert.alert("Student has already been issued to books.")
                    this.setState({
                        scannedBookId: '',
                        scannedStudentId: ''
                    })
                }
            })
        }
        return isStudentEligible;
    }

    checkStudentEligibilityForBookReturn = async() =>{
        const studentref = await db
        .collection("transactions")
        .where("bookId","==",this.state.scannedBookId)
        .limit(1)
        .get()

        var isStudentEligible = "";
        
            transactionref.docs.map((doc)=>{
                var lastBookTransaction = doc.data();
                if(lastBookTransaction.studentId === this.state.scannedstudentId){
                    isStudentEligible = true;
                }else{
                    isStudentEligible = false;
                    Alert.alert("The book has been already issued to other student")
                    this.setState({
                        scannedBookId: '',
                        scannedStudentId: ''
                    })
                }
            })
        
        return isStudentEligible;
    }



    /*
    handleTransactions = async()=>{
        var transactionMessage
        db.collection("books").doc(this.state.scannedBookId).get()
        .then((doc)=>{
            var book = doc.data();
            if(book.bookAvailability){
                this.initiateBookIssue();
                transactionMessage = "bookIssued"
                ToastAndroid.show(transactionMessage,ToastAndroid.SHORT)
            }else{
                this.initiateBookReturn();
                transactionMessage = "bookReturned"
                ToastAndroid.show(transactionMessage,ToastAndroid.SHORT)
            }
        })
        this.setState({
            transactionMessage: transactionMessage
        })
    }
    */

    render(){

        const getCameraPermission = this.getCameraPermissions;
        const scanned = this.state.scanned;
        const buttonState = this.state.buttonState;

        if(buttonState !== "normal" && hasCameraPemissions){
            return(
                <BarCodeScanner
                    onBarCodeScanned = {scanned? undefined: this.handleBarCodeScanned }
                    style = {StyleSheet.absoluteFillObject}
                />
            )
        }

        else if(buttonState === "normal"){
             return(

                <KeyboardAvoidingView style = {styles.container} behavior="padding" enabled>
                <View style = {this.styles.container}>

                    
                    <View>
                    <Image
                        source = {require('../assets/booklogo.jpg')}
                        style = {{width:200, height: 200 }}
                        />

                        <Text style = {{textAlign: center, fontSize: 30, textDecorationLine: bold}}>WILY</Text>
                    </View>

                    
                    <View style = {styles.inputView}>

                        <TextInput 
                        style = {styles.inputBox}
                        placeholder="BookId"
                        onChangeText = {
                            text => this.setState({
                                scannedBookId : text
                            })
                        }
                        value = {this.state.scannedBookId}
                        />
                        <TouchableOpacity
                            style = {styles.scanButton}
                            onPress = {()=>{
                                this.getCameraPermissions("BookId")
                            }}
                            >
                         <Text style = {styles.buttonText}>
                             Scanned
                         </Text>
                        </TouchableOpacity>
                    </View>

                    <View style = {styles.inputView}>
                        <TextInput 
                        style = {styles.inputBox}
                        placeholder="StudentId"
                        onChangeText = {
                            text => this.setState({
                                scannedStudentId : text
                            })
                        }
                        value = {this.state.scannedStudentId}
                        />
                        <TouchableOpacity
                            style = {styles.scanButton}
                            onPress = {()=>{
                                this.getCameraPermissions("StudentId")
                            }}
                            >
                         <Text style = {styles.buttonText}>
                             Scanned
                         </Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.transactionAlert}>{this.state.transactionMessage}</Text>
                    <TouchableOpacity style = {styles.submitButton}
                       onPress = {async()=>{
                           var transactionMessage = this.handleTransactions()
                           this.setState({
                               scannedBookId: '',
                               scannedId: ''
                           })
                       }}
                    >
                        <Text style = {styles.submitButtonText}>Submit</Text>
                        </TouchableOpacity>
                    
                </View>
                </KeyboardAvoidingView>
            )
        }
     }
}



const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    displayText:{
        fontSize: 35,
        textDecorationLine: 'underline'
    },
    scanButton:{
        backgroundColor: 'blue',
        padding: 10,
        margin: 10
    },
    buttonText:{
        fontSize: 20
    },
    inputView:{
        flexDirection: 'row',
        margin: 20
      },
    inputBox:{
        width: 200,
        height: 40,
        borderWidth: 1.5,
        borderRightWidth: 0,
        fontSize: 20
    },
    scanButton:{
        backgroundColor: '#66BB6A',
        width: 50,
        borderWidth: 1.5,
        borderLeftWidth: 0
    },
    submitButton:{
        backgroundColor: "orange",
        width: 100,
        height: 75
    },
    submitButtonText:{
        textAlign: 'center',
        color: "green",
        fontWeight: 'bold'
    }
})
