import React from 'react';
import {Text, View,ScrollView, TextInput} from 'react-native';
import * as firebase from 'firebase'
import db from '../config.js'


export default class SearchScreen extends React.Component{
    constructor(){
        super();
        this.state={
            allTransactions : [],
            lastVisibleTransactions : null,
            search: ''
        }
    }

    fetchMoreTransactions = async()=>{
      var text = this.state.search.toUpperCase()
      var enteredText = text.split("")

      
      if (enteredText[0].toUpperCase() ==='B'){
      const query = await db
      .collection("transactions")
      .where('bookId','==',text)
      .startAfter(this.state.lastVisibleTransaction)
      .limit(10)
      .get()
      query.docs.map((doc)=>{
        this.setState({
          allTransactions: [...this.state.allTransactions, doc.data()],
          lastVisibleTransaction: doc
        })
      })
    }
      else if(enteredText[0].toUpperCase() === 'S'){
        const query = await db
        .collection("transactions")
        .where('bookId','==',text)
        .startAfter(this.state.lastVisibleTransaction)
        .limit(10)
        .get()
        query.docs.map((doc)=>{
          this.setState({
            allTransactions: [...this.state.allTransactions, doc.data()],
            lastVisibleTransaction: doc
          })
        })
      }





    }

    searchTransactions = async(text) =>{
        var enteredText = text.split("")  
        if (enteredText[0].toUpperCase() ==='B'){
          const transaction =  await db.collection("transactions").where('bookId','==',text).get()
          transaction.docs.map((doc)=>{
            this.setState({
              allTransactions:[...this.state.allTransactions,doc.data()],
              lastVisibleTransaction: doc
            })
          })
        }
        else if(enteredText[0].toUpperCase() === 'S'){
          const transaction = await db.collection('transactions').where('studentId','==',text).get()
          transaction.docs.map((doc)=>{
            this.setState({
              allTransactions:[...this.state.allTransactions,doc.data()],
              lastVisibleTransaction: doc
            })
          })
        }
    }

    componentDidMount(){
        const query = await db
        .collection("transactions")
        .get()

        query.docs.map((doc)=>{
            this.setState({
                allTransactions: [...this.state.allTransactions, doc.data()]
            })
        })
    }
    
    
    render(){
        return(

            <View>
                
            <View>
                <TextInput 
                    placeholder = "Enter Book/Student Id"
                    onChangeText = {(text)=>{
                        this.setState({
                            search: text
                        })
                    }}>
                </TextInput>

                <TouchableOpacity onPress = {()=> {
                    this.searchTransactions(this.state.search)
                }}>
                    <Text>
                        
                    </Text>
                </TouchableOpacity>
            </View>

            
            <Flatlist
                data = {this.state.allTransactions}
                renderItem = {({item})=>(
                        <View style = {{borderBottomWidth:2}}>
                            <Text>{"Book Id :" +item.bookId}</Text>
                            <Text>{"StudentId Id : " +item.studentId}</Text>
                            <Text>{"Transaction type : "+ item.transactionType}</Text>
                            <Text>{"Date : " + item.date.toDate()}</Text>
                        </View>
                )}
                keyExtractor={(item,index)=>index.toString()}
                onEndReached={this.fetchMoreTransactions}
                onEndReachedThreshold = {0.7}
            />

            </View>
        )
        
    }
}

const styles = StyleSheet.create({
    
})
