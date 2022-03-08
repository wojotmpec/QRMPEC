import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TextInput } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Checkbox from 'expo-checkbox';
import {Picker} from '@react-native-picker/picker';
import styles from './styles'; 


import * as SQLite from 'expo-sqlite'
const db = SQLite.openDatabase('db.QRProject')

const Stack = createNativeStackNavigator();

function OverviewScreen({route, navigation}) {
  
    const { nodeDetails } = route.params;
    const [isChecked, setChecked] = useState(false);
    const [selectedValue, setSelectedValue] = useState("awaria");
    const [text, onChangeText] = useState("");
    
    const handleSubmit = () => {
      console.log('okx');
      console.log(selectedValue);
      let valService = '';
  
      db.transaction(tx => {
  
       // tx.executeSql(
       //   'DROP TABLE serwis'
       // )
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS serwis (id INTEGER PRIMARY KEY AUTOINCREMENT, rodzaj INT, w_id INT, serwis_id INT, opis TEXT, status INT, Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)'
        )
  
        tx.executeSql(
          'INSERT INTO serwis (rodzaj, w_id, serwis_id, opis, status) values ('+ nodeDetails.split(';;;')[0] + ',' + nodeDetails.split(';;;')[1] + ',' + selectedValue + ',' + JSON.stringify(text) + ',0' + ')'
        )
  
        tx.executeSql('SELECT * FROM serwis', [], (trans, result) => {
          console.log('cc');
          for (let i = 0; i < result.rows.length; ++i) {
            let values = result.rows._array[i]
            valService = '&rodzaj=' + values['rodzaj'] + '&wID=' + values['w_id'] + '&serwisID=' + values['serwis_id'] + '&opis=' + values['opis'] + '&status=' + values['status'] + '&timeService=' + values['Timestamp']
      //      console.log(val)
          }
          
          console.log(JSON.stringify({
            val: valService
            }));
  
  
            let res = fetch('http://hercules8.mpec.krakow.pl/postCreate.php', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                 'val': 'KKK-JG'
                 })        
            })
            .then(res => res.json())
            .then(data => {
  //            console.log(data);
              // enter you logic when the fetch is successful
               console.log( data.testJG)
             }).catch(error => {
              // enter your logic for when there is an error (ex. error toast)
               console.log(error)
             }) 
  
  
  
        });  
      })
  
  
    }
      
    return (
      <View style={{ flex: 0, alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>      
        <Text style={{fontSize: 20}}>{"\n"}{nodeDetails.split(';;;')[2]} {"\n"}{"\n"}</Text>
  
        <Checkbox style={styles.checkbox} value={isChecked} onValueChange={setChecked} />
        <Text>{isChecked ? 'true':'false'}przegląd turbiny{'\n\n'}</Text>   
  
        <TextInput
          onChangeText={onChangeText}
          value={text}
          style={styles.input}
        />
  
        <Button onPress={handleSubmit} title="Zapisz" />
  
      </View>
    );
  }
/*
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
    },
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    }
  });
*/
  export default OverviewScreen  ;