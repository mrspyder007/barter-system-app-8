import React ,{Component} from 'react';
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native';
import{Card,Header,Icon} from 'react-native-elements';
import firebase from 'firebase';
import db from '../config.js';
import styles from '../styles';
import AppHeader from '../components/AppHeader.js';

export default class BarterDetailScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            userId          : firebase.auth().currentUser.email,
            userName        : "",
            barterId      : this.props.navigation.getParam('details')["user_id"],
            requestId       : this.props.navigation.getParam('details')["request_id"],
            itemName        : this.props.navigation.getParam('details')["ItemName"],
            description     : this.props.navigation.getParam('details')["Description"],
            status: this.props.navigation.getParam('details')["status"],
            giveOrWant:this.props.navigation.getParam('details')["GiveOrWant"],
            barterName    : '',
            barterContact : '',
            barterAddress : '',
            barterRequestDocId : ''
        }
    }

    getBarterDetails(){
        db.collection('users').where('email_id','==',this.state.barterId).get().then(snapshot=>{
          snapshot.forEach(doc=>{
            this.setState({
              barterName    : doc.data().first_name + ' ' + doc.data().last_name,
              barterContact : doc.data().contact,
              barterAddress : doc.data().address,
            })
          })
        });
    
        db.collection('Exchange_Request').where('request_id','==',this.state.requestId).get().then(snapshot=>{
          snapshot.forEach(doc => {
            this.setState({barterRequestDocId:doc.id})
         })
      })}
    
    
      getUserDetails=(userId)=>{
        db.collection("users").where('email_id','==', userId).get().then((snapshot)=>{
          snapshot.forEach((doc) => {
            this.setState({
              userName  :doc.data().first_name + " " + doc.data().last_name
            })
          })
        })
      }

      addNotification=()=>{
        var message = this.state.userName + " has shown interest in exchanging the item"
        db.collection("all_notifications").add({
          "targeted_user_id"    : this.state.receiverId,
          "donor_id"            : this.state.userId,
          "exchangeId"          : this.state.exchangeId,
          "item_name"           : this.state.itemName,
          "date"                : firebase.firestore.FieldValue.serverTimestamp(),
          "notification_status" : "unread",
          "message"             : message
        })
      }

    
      updateItemStatus=()=>{
        db.collection('My_Barter').add({
          "Itemname"           : this.state.itemName,
          "request_id"          : this.state.requestId,
          "BarterName"        : this.state.barterName,
          "user_id"            : this.state.userId,
          "status"      :  "Barter Interested"
        })
      }
    
      componentDidMount(){
        this.getBarterDetails()
        this.getUserDetails(this.state.userId)
      }
    
    
        render(){
          return(
            <View style={styles.container}>
              <View style={{flex:0.1}}>
              <AppHeader title="BarterDetails" navigation={this.props.navigation} />
              </View>
              <View style={{flex:0.3}}>
                <Card
                    title={"Item Information"}
                    titleStyle= {{fontSize : 20}}
                  >
                  <Card >
                    <Text style={{fontWeight:'bold'}}>Name : {this.state.itemName}</Text>
                  </Card>
                  <Card>
                    <Text style={{fontWeight:'bold'}}>Description : {this.state.description}</Text>
                  </Card>
                </Card>
              </View>
              <View style={{flex:0.3}}>
                <Card
                  title={"Barter Information"}
                  titleStyle= {{fontSize : 20}}
                  >
                  <Card>
                    <Text style={{fontWeight:'bold'}}>Name: {this.state.barterName}</Text>
                  </Card>
                  <Card>
                    <Text style={{fontWeight:'bold'}}>Contact: {this.state.barterContact}</Text>
                  </Card>
                  <Card>
                    <Text style={{fontWeight:'bold'}}>Address: {this.state.barterAddress}</Text>
                  </Card>
                </Card>
              </View>
              <View>
                {
                  this.state.barterId !== this.state.userId
                  ?(
                    <TouchableOpacity
                        style={styles.button,{width:'90%'}}
                        onPress={()=>{
                          this.updateItemStatus()
                          addNotification()
                          this.props.navigation.navigate('MyBarters')
                        }}>
                      <Text style = {styles.buttonText}>I want to Exchange</Text>
                    </TouchableOpacity>
                  )
                  : null
                }
              </View>
            </View>
          )
        }

}