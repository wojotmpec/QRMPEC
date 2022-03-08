import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TextInput } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Checkbox from 'expo-checkbox';
import {Picker} from '@react-native-picker/picker';
import styles from './styles'; 


import * as SQLite from 'expo-sqlite'
const db = SQLite.openDatabase('db.QRProject')

const Stack = createNativeStackNavigator();


function ServiceScreen({route, navigation}) {
  
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
      
          <Picker
            selectedValue={selectedValue}
            style={{ height: 100, width: 250 }}
            onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
          >
            <Picker.Item label="awaria" value="13" />
            <Picker.Item label="elektryk" value="20" />
            <Picker.Item label="konserwacja" value="14" />
            <Picker.Item label="kontrola_parametrów" value="4" />
            <Picker.Item label="legalizacja" value="5" />
            <Picker.Item label="licznik" value="7" />
            <Picker.Item label="nieokreslony" value="1" />
            <Picker.Item label="plan" value="24" />
            <Picker.Item label="płukanie wymienników" value="17" />
            <Picker.Item label="pogotowie" value="19" />
            <Picker.Item label="pogotowie - korekta" value="31" />
            <Picker.Item label="przegląd węzła" value="3" />
            <Picker.Item label="przekroczenia" value="23" />
            <Picker.Item label="reklamacja" value="2" />
            <Picker.Item label="udt" value="6" />
            <Picker.Item label="uwagi" value="21" />
            <Picker.Item label="wymiana urządzenia" value="28" />
            <Picker.Item label="zgłoszenie" value="18" />
            <Picker.Item label="zmiana krzywej" value="27" />
            <Picker.Item label="zmiana parametrów" value="26" />
          </Picker>
    
    
  
        <TextInput
          onChangeText={onChangeText}
          value={text}
          style={styles.input}
        />
  
        <Button onPress={handleSubmit} title="Zapisz" />
       
      </View>
    );
  }

  export default ServiceScreen  ;