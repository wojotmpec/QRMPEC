import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TextInput } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Checkbox from 'expo-checkbox';
import styles from './styles'; 

import * as SQLite from 'expo-sqlite'
const db = SQLite.openDatabase('db.QRProject')

const Stack = createNativeStackNavigator();

function OverviewScreen({route, navigation}) {
  
    const { nodeDetails } = route.params;
    const [isChecked, setChecked] = useState(false);
    const [text, onChangeText] = useState("");
    
    const handleSubmit = () => {
      console.log('okx');
  
      db.transaction(tx => {
  
       // tx.executeSql(
       //   'DROP TABLE serwis'
       // )
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS serwis (id INTEGER PRIMARY KEY AUTOINCREMENT, rodzaj INT, w_id INT, serwis_id INT, opis TEXT, status INT, Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)'
        )
  
        tx.executeSql(
          'INSERT INTO serwis (rodzaj, w_id, serwis_id, opis, status) values ('+ nodeDetails.split(';;;')[0] + ',' + nodeDetails.split(';;;')[1] + ',' + isChecked + ',' + JSON.stringify(text) + ',0' + ')'
        )
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

  export default OverviewScreen  ;