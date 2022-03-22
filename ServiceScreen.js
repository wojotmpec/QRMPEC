import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, ToastAndroid, TouchableOpacity } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Device from 'expo-device';

import {Picker} from '@react-native-picker/picker';
import styles from './styles'; 


import * as SQLite from 'expo-sqlite'
const db = SQLite.openDatabase('db.QRProject')

const Stack = createNativeStackNavigator();


function ServiceScreen({route, navigation}) {
  
    const { nodeDetails, serviceID } = route.params;
    const [text, onChangeText] = useState("");
    const [selectedValue, setSelectedValue] = useState(serviceID);
    const [startValue, setStartValue] = useState("");
  
    useEffect(() => {
      if(startValue != serviceID) {
        setSelectedValue(serviceID);           
        setStartValue(serviceID);
      }
    });
         
    console.log('SFXY:' + serviceID + ' B ' + selectedValue + ':E');

    const handleSubmit = () => {
      console.log('okx');
      console.log(selectedValue);
      var mistrz = Device.deviceName;

      db.transaction(tx => {
  
        tx.executeSql(
          'DROP TABLE serwis'
        )
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS serwis (id INTEGER PRIMARY KEY AUTOINCREMENT, typ INT, typ_opcje TEXT, mistrz TEXT, rodzaj INT, w_id INT, serwis_id INT, opis TEXT, status INT, Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)'
        )
  
        tx.executeSql(
          'INSERT INTO serwis (typ, mistrz, rodzaj, w_id, serwis_id, opis, status) values (1, '+ JSON.stringify(mistrz) +',' + Number.parseInt(nodeDetails.split(';;;')[0]) + ',' + Number.parseInt(nodeDetails.split(';;;')[1]) + ',' + selectedValue + ',' + JSON.stringify(text) + ',0' + ')'
        ) 

        ToastAndroid.showWithGravityAndOffset(
          "Zapisano pomyślnie!",
          ToastAndroid.LONG,
          ToastAndroid.TOP,
          25,
          50
        );
      }) 

      navigation.navigate('Synchronizacja');

    }
      
    if(nodeDetails == '') {
      return (
        <View style={styles.emptyView}>
          <TouchableOpacity onPress={() => navigation.navigate('Skaner kodu QR')}>
            <Text style={styles.emptyText}>Musisz zeskanować najpierw obiekt</Text>
          </TouchableOpacity> 
        </View>);
    } else if(nodeDetails.split(';;;')[0] == '1' || nodeDetails.split(';;;')[0] == '4') {

//      setSelectedValue({serviceID});

       return (
          <View style={styles.mainContainer}>      
            <Text style={styles.addressText}>{nodeDetails.split(';;;')[2]}</Text>
            <Text>{Device.deviceName}</Text>

              <Picker
                selectedValue={selectedValue}
                style={styles.picker} 
                onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
              >
                <Picker.Item label="nieokreslony" value="1" />
                <Picker.Item label="awaria" value="13" />
                <Picker.Item label="elektryk" value="20" />
                <Picker.Item label="konserwacja" value="14" />
                <Picker.Item label="kontrola_parametrów" value="4" />
                <Picker.Item label="legalizacja" value="5" />
                <Picker.Item label="licznik" value="7" />                
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
              multiline
              numberOfLines={4}
              style={styles.input}
            />

            <TouchableOpacity onPress={handleSubmit} style={styles.saveTouchable}>
              <Text style={styles.saveText}>Zapisz serwis</Text>
            </TouchableOpacity> 
          
          </View>
        ); 
      } else if(nodeDetails.split(';;;')[0] == '2') {
      
        return (
          <View style={styles.mainContainer}>      
          <Text style={styles.addressText}>{nodeDetails.split(';;;')[2]}</Text>
          <Text>{Device.deviceName}</Text>

            <Picker
              selectedValue={selectedValue}
              style={styles.picker} 
              onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
            >
              <Picker.Item label="nieokreslony" value="8" />
              <Picker.Item label="awaria" value="15" />
              <Picker.Item label="konserwacja" value="16" />
              <Picker.Item label="kontrola_parametrów" value="10" />              
              <Picker.Item label="odczyt parametrów" value="11" />
              <Picker.Item label="plan" value="25" />
              <Picker.Item label="przegląd komory" value="9" />
              <Picker.Item label="remont" value="12" />
              <Picker.Item label="uwagi" value="22" />
            </Picker>       

          <TextInput
            onChangeText={onChangeText}
            value={text}
            multiline
            numberOfLines={4}
            style={styles.input}
          />
          
          <TouchableOpacity onPress={handleSubmit} style={styles.saveTouchable}>
            <Text style={styles.saveText}>Zapisz serwis</Text>
          </TouchableOpacity> 

          </View>
        );  
        
      } else if(nodeDetails.split(';;;')[0] == '3') {
      
        return (
          <View style={styles.mainContainer}>      
          <Text style={styles.addressText}>{nodeDetails.split(';;;')[2]}</Text>
          <Text>{Device.deviceName}</Text>

            <Picker
              selectedValue={selectedValue}
              style={styles.picker} 
              onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
            >
              <Picker.Item label="próba ciśnieniowa" value="29" />
              <Picker.Item label="remont" value="30" />
            </Picker>       

          <TextInput
            onChangeText={onChangeText}
            value={text}
            multiline
            numberOfLines={4}
            style={styles.input}
          />
          
          <TouchableOpacity onPress={handleSubmit} style={styles.saveTouchable}>
            <Text style={styles.saveText}>Zapisz serwis</Text>
          </TouchableOpacity> 

          </View>
        );  
      }  else  {
        return (
          <View style={styles.mainContainer}>      
          <Text style={styles.addressText}>{nodeDetails.split(';;;')[2]}</Text>
          <Text>{Device.deviceName}</Text>

            <Picker
              selectedValue={selectedValue}
              style={styles.picker} 
              onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
            >
              <Picker.Item label="nieokreslony" value="8" />
            </Picker>       

          <TextInput
            onChangeText={onChangeText}
            value={text}
            multiline
            numberOfLines={4}
            style={styles.input}
          />

          <TouchableOpacity onPress={handleSubmit} style={styles.saveTouchable}>
            <Text style={styles.saveText}>Zapisz serwis</Text>
          </TouchableOpacity> 

          </View>
        );  
      }
   }

  export default ServiceScreen;