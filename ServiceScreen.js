import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, ToastAndroid, TouchableOpacity, Button, Alert } from 'react-native';

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
    const [serviceTechnician, setServicetechnician] = useState("");
    
    useEffect(() => {
      if(startValue != serviceID) {
        setSelectedValue(serviceID);           
        setStartValue(serviceID);
      }
    });
         
    const handleSubmit = () => {

      db.transaction(tx => {
  
        // tx.executeSql(
        //   'DROP TABLE serwis'
        // )

        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS serwis (id INTEGER PRIMARY KEY AUTOINCREMENT, typ INT, typ_opcje TEXT, serwisant TEXT, rodzaj INT, w_id INT, serwis_id INT, opis TEXT, status INT, Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)', [], (tx, results) => {
              console.log(results);
          },
          (tx, error) => {
            console.log(error);
          })
  
        tx.executeSql(
          'INSERT INTO serwis (typ, serwisant, rodzaj, w_id, serwis_id, opis, status, Timestamp) values (1, '+ JSON.stringify(serviceTechnician) +',' + Number.parseInt(nodeDetails.split(';;;')[0]) + ',' + Number.parseInt(nodeDetails.split(';;;')[1]) + ',' + selectedValue + ',' + JSON.stringify(text) + ',0, datetime("now", "localtime"))', [], (tx, results) => {
            console.log(results);
        },
        (tx, error) => {
          console.log(error);
        })

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


    const todoFunction = () => {
      Alert.alert(
        "Otwarcie/zamknięcie obiegu",
        "Funkcja jeszcze nie jest dostępna",
        [
          { text: "Zamknij", onPress: () => console.log("Closed") }
        ]
      );
    }

    const confirmAlert = () => {
        if (serviceTechnician == '') {
          ToastAndroid.showWithGravityAndOffset(
            "Musisz wybrać użytkownika!",
            ToastAndroid.LONG,
            ToastAndroid.TOP,
            25,
            50
          );
          return;
        }

        if (selectedValue == '-1') {
          ToastAndroid.showWithGravityAndOffset(
            "Musisz wybrać rodzaj serwisu!",
            ToastAndroid.LONG,
            ToastAndroid.TOP,
            25,
            50
          );
          return;
        }

        Alert.alert(
          "Zapisz serwis",
          "Czy na pewno chcesz zapisac serwis?",
          [{
              text: "Anuluj",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            {
              text: "Zapisz",
              onPress: () => handleSubmit()
            }
          ]
        );
    }

    var serviceTechniciansArr = Device.deviceName.split(";");
      
    if(nodeDetails == '') {
      return (
        <View style={styles.emptyView}>
          <TouchableOpacity onPress={() => navigation.navigate('Skaner kodu QR')}>
            <Text style={styles.emptyText}>Musisz zeskanować najpierw obiekt</Text>
          </TouchableOpacity> 
        </View>);
    } else if(nodeDetails.split(';;;')[0]){

      if (nodeDetails.split(';;;')[0] == '1' || nodeDetails.split(';;;')[0] == '4') {
        var pickerItemsArr = {
          "Wybierz rodzaj serwisu":-1,
          "kontrola parametrów":4,
          "konserwacja":14,
          "wymiana urządzenia":28,
          "zgłoszenie przez odbiorcę":32,
          "przegląd: okresowy, udt":33,
          "zmiana parametrów regulatora/sterownika":34,
          "inne":35,
        }
      } else if (nodeDetails.split(';;;')[0] == '2') {
        var pickerItemsArr = {
          "nieokreslony": 8,
          "awaria": 15,
          "konserwacja": 16,
          "kontrola_parametrów": 10,
          "odczyt parametrów": 11,
          "plan": 25,
          "przegląd komory": 9,
          "remont": 12,
          "uwagi": 22,
        }
      } else if (nodeDetails.split(';;;')[0] == '3') {
        var pickerItemsArr = {
          "próba ciśnieniowa": 29,
          "remont": 30,
        }
      } else {
        var pickerItemsArr = {
          "nieokreslony": 8,
        }
      }


      
      var pickerItemsDetailsArr = {
        4: "kontrola parametrów inicjowana przez MPEC, kontrola przekroczeń, regulacja hydrauliczna",
        14: "odmulanie, drobne naprawy bez wymiany urządzeń, chemiczne czyszczenie wymienników",
        28: "wymiana urządzenia, licznika, legalizacja licznika",
        32: "kontrola parametrów inicjowana przez Odbiorcę, reklamacja, kontrola działania licznika",

      }

       return (
          <View style={styles.mainContainer}>      
            <Text style={styles.addressText}>{nodeDetails.split(';;;')[2]}</Text>
            
            <Picker
              selectedValue={serviceTechnician}
              style={styles.picker} 
              onValueChange={(itemValue, itemIndex) => setServicetechnician(itemValue)}
            >
              <Picker.Item label="Wybierz użytkownika" value="" />
               {serviceTechniciansArr.map(technician => {return <Picker.Item key={technician} label={technician} value={technician} />})}
              </Picker>   

              <Picker
                selectedValue={selectedValue}
                style={styles.picker} 
                onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
              >
                {Object.keys(pickerItemsArr).map(key => {return <Picker.Item key={pickerItemsArr[key]} label={key} value={pickerItemsArr[key]} />})}
            </Picker>       

            <Text style={styles.itemsDetails}>{pickerItemsDetailsArr[selectedValue]}</Text>

            <View style={styles.circulationContainer}> 
            
            <TouchableOpacity onPress={todoFunction} style={styles.openCirculationTouchable}>
              <Text style={styles.openCirculationText}>Otwórz obieg</Text>
            </TouchableOpacity> 
            
            <TouchableOpacity onPress={todoFunction} style={styles.closeCirculationTouchable}>
              <Text style={styles.closeCirculationText}>Zamknij obieg</Text>
            </TouchableOpacity> 
            </View>
      
            <TextInput
              onChangeText={onChangeText}
              value={text}
              multiline
              numberOfLines={3}
              style={styles.input}
            />

            <TouchableOpacity onPress={confirmAlert} style={styles.saveTouchable}>
              <Text style={styles.saveText}>Zapisz serwis</Text>
            </TouchableOpacity> 
          
          </View>
        ); 
      } 
   }

  export default ServiceScreen;