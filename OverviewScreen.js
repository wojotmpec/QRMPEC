import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TextInput, ToastAndroid} from 'react-native';

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


    let val1 = 0;
    if(isChecked == 1) {
      val1 = 1;
    }
    
    db.transaction(tx => {

      // tx.executeSql(
      //   'DROP TABLE serwis'
      // )
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS serwis (id INTEGER PRIMARY KEY AUTOINCREMENT, rodzaj INT, w_id INT, serwis_id INT, opis TEXT, status INT, Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)'
      )

      tx.executeSql(
        'INSERT INTO serwis (rodzaj, w_id, serwis_id, opis, status) values ('+ Number.parseInt(nodeDetails.split(';;;')[0]) + ',' + Number.parseInt(nodeDetails.split(';;;')[1]) + ',' + val1 + ',' + JSON.stringify(text) + ',0' + ')'
      )

      ToastAndroid.showWithGravityAndOffset(
        "Zapisano pomyślnie!",
        ToastAndroid.LONG,
        ToastAndroid.TOP,
        25,
        50
      );
    })  
  }
      
  if(nodeDetails == '') {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Musisz zeskanować najpierw obiekt</Text>
      </View>);
    } else {

    return (
      <View style={styles.mainContainer}>      
        <Text style={styles.addressText}>{nodeDetails.split(';;;')[2]}</Text>

        <Checkbox style={styles.checkbox} value={isChecked} onValueChange={setChecked} />
        <Text>{isChecked ? 'true':'false'}przegląd turbiny{'\n\n'}</Text>   

        <TextInput
          onChangeText={onChangeText} 
          value={text}
          style={styles.input}
        />

        <Button onPress={handleSubmit} title="Zapisz" />

      </View>);
    }
  }

export default OverviewScreen  ;