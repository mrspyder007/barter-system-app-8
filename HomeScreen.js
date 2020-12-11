import React, { Component } from 'react';
import { View, Text, FlatList,TouchableOpacity } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import firebase from 'firebase';
import db from '../config'
import AppHeader from '../components/AppHeader';
import styles from '../styles';

export default class HomeScreen extends Component{
  constructor(){
    super();
    this.state = {
      items : [],
      barterId : firebase.auth().currentUser.email,
      donorName : "",
      allDonations : []
    }
    this.requestRef= null
  }

  static navigationOptions = { header: null };

  getItems =()=>{
    this.requestRef = db.collection("Exchange_Request").onSnapshot((snapshot)=>{
      var items = snapshot.docs.map(document => document.data());
      this.setState({
        items : items
      });
    })
  }

  getBarterDetails = ()=>{
    db.collection('users').where('email_id','==',this.state.barterId).get().then((snapshot)=>{
      snapshot.forEach((doc)=>{
        this.setState({
          donorName: doc.data().first_name + ' ' +doc.data().last_name
        })
      })
    })
  }

  componentDidMount(){
    this.getItems();
    this.getBarterDetails();
  }

  componentWillUnmount(){
    this.requestRef();
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ( {item, i} ) =>{
    return (
      <ListItem
        key={i}
        style = {styles.item}
        title={item.ItemName}
        leftElement = {<Text style = {styles.GiveOrWant} >{item.GiveOrWant}</Text>}
        subtitle={item.Description}
        titleStyle={{ color: 'black', fontWeight: 'bold' }}
        rightElement={
            <TouchableOpacity 
              style={styles.listButton,{backgroundColor: item.status === 'forExchange' ? 'green' : 'red', width:'15%', borderRadius : 10 }}
              onPress = {()=>{
                this.props.navigation.navigate("BarterDetails",{"details": item});
              }}
            >
              <Text style={{color:'#fff', marginLeft : 10}}>View</Text>
            </TouchableOpacity>
          }
        bottomDivider
      />
    )
  }

  render(){
    return(
      <View style={styles.box}>
        <AppHeader 
          title="Home" navigation ={this.props.navigation} 
          leftComponent ={<Icon name='arrow-left' type='feather' color='#696969'  onPress={() => this.props.navigation.goBack()}/>}
        />
        <View>
          {
            this.state.items.length === 0
            ?(
              <View>
                <Text style={styles.modalTitle}>List Of All needed Items</Text>
              </View>
            )
            :(
              <FlatList
                style = {styles.list}
                keyExtractor={this.keyExtractor}
                data={this.state.items}
                renderItem={this.renderItem}
              />
            )
          }
        </View>
      </View>
    )
  }
}