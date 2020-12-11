import React ,{Component} from 'react'
import {View, Text,TouchableOpacity,ScrollView,FlatList,StyleSheet} from 'react-native';
import {Card,Icon,ListItem} from 'react-native-elements'
import AppHeader from '../components/AppHeader.js'
import firebase from 'firebase';
import db from '../config.js';
import styles from '../styles';

export default class MyBarterScreen extends Component {
   constructor(){
     super()
     this.state = {
       userId : firebase.auth().currentUser.email,
       userName : "",
       allBarters : []
     }
     this.requestRef= null
   }

   static navigationOptions = { header: null };

   getUserDetails=(userId)=>{
     db.collection("users").where("email_id","==", userId).get().then((snapshot)=>{
       snapshot.forEach((doc) => {
         this.setState({
           "userName" : doc.data().first_name + " " + doc.data().last_name
         })
       });
     })
   }

   getAllBarters =()=>{
     this.requestRef = db.collection("My_Barter").where("user_id" ,'==', this.state.userId).onSnapshot((snapshot)=>{
       var allBarters = []
       snapshot.docs.map((doc) =>{
         var barters = doc.data()
         barters["doc_id"] = doc.id
         allBarters.push(barters)
       });
       this.setState({
         allBarters : allBarters
       });
     })
   }

   exchangeItems=(itemDetails)=>{
     if(itemDetails.status === "forExchange"){
       var requestStatus = "Barter Interested"
       db.collection("My_Barter").doc(itemDetails.doc_id).update({
         "request_status" : "Barter Interested"
       })
     }
     else{
       var requestStatus = "forExchange"
       db.collection("My_Barter").doc(itemDetails.doc_id).update({
         "status" : "forExchange"
       })
     }
   }

   keyExtractor = (item, index) => index.toString()

   renderItem = ( {item, i} ) =>(
     <ListItem
       key={i}
       title={item.ItemName}
       subtitle={item.Description+"\nStatus : " + item.status}
       leftElement = {<Text style = {styles.GiveOrWant} >{item.GiveOrWant}</Text>}
       titleStyle={{ color: 'black', fontWeight: 'bold' }}
       rightElement={
           <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor : item.status === "forExchange" ? "green" : "red"
              }
            ]}
            onPress = {()=>{
              this.exchangeItems(item)
            }}
           >
             <Text style={{color:'#ffff'}}>{
               item.status === "forExchange" ? "forExchange" : "Send Item"
             }</Text>
           </TouchableOpacity>
         }
       bottomDivider
     />
   )


   componentDidMount(){
     this.getUserDetails(this.state.userId)
     this.getAllBarters()
   }

   componentWillUnmount(){
     this.requestRef();
   }

   render(){
     return(
       <View style={styles.container}>
         <AppHeader navigation={this.props.navigation} title="My Barters" />
         <View style={{flex:1}}>
           {
             this.state.allBarters.length === 0
             ?(
               <View>
                 <Text style={styles.modalTitle}>List of all My Barters</Text>
               </View>
             )
             :(
               <FlatList
                 keyExtractor={this.keyExtractor}
                 data={this.state.allBarters}
                 renderItem={this.renderItem}
               />
             )
           }
         </View>
       </View>
     )
   }
   }
