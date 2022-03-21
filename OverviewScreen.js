import React, { useState, } from 'react';
import { Text, View, TextInput, ToastAndroid, TouchableOpacity} from 'react-native';

import {Picker} from '@react-native-picker/picker';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Checkbox from 'expo-checkbox';
import styles from './styles'; 

import * as SQLite from 'expo-sqlite'
const db = SQLite.openDatabase('db.QRProject')

const Stack = createNativeStackNavigator();

function OverviewScreen({route, navigation}) {
  
  const { nodeDetails } = route.params;
  const [isChecked, setChecked] = useState(false);
  const [isChecked2, setChecked2] = useState(false);
  const [isChecked3, setChecked3] = useState(false);
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
      <View style={styles.emptyView}>
      <TouchableOpacity onPress={() => navigation.navigate('Skaner kodu QR')}>
        <Text style={styles.emptyText}>Musisz zeskanować najpierw obiekt</Text>
      </TouchableOpacity> 
    </View>);
    } else {

    return (
      <View>
        <View style={styles.mainContainer}>      
          <Text style={styles.addressText}>{nodeDetails.split(';;;')[2]}</Text>
        </View>
          
        <View style={styles.checkboxContainer}>
          <Text style={styles.checkboxText} onPress={()=>setChecked(!isChecked)}><Checkbox value={isChecked} onValueChange={setChecked} /> Przegląd węzła</Text>
          <Text style={styles.checkboxText} onPress={()=>setChecked2(!isChecked2)}><Checkbox value={isChecked2} onValueChange={setChecked2} /> Serwis węzła</Text>
          <Text style={styles.checkboxText} onPress={()=>setChecked3(!isChecked3)}><Checkbox value={isChecked3} onValueChange={setChecked3} /> Bardzo długi tekst nt. serwisu węzła</Text>
        </View>

        <View style={styles.mainContainer}>      
          <TextInput
            onChangeText={onChangeText}
            value={text}
            multiline
            numberOfLines={4}
            style={styles.input}
          />

          <TouchableOpacity onPress={handleSubmit} style={styles.saveTouchable}>
            <Text style={styles.saveText}>Zapisz przegląd</Text>
          </TouchableOpacity> 

        </View>
      </View>);
    }
  }

export default OverviewScreen;