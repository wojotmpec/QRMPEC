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
  
    const { nodeDetails, serviceID, serviceItemID } = route.params;
    const [text, onChangeText] = useState("");
    const [selectedValue, setSelectedValue] = useState(serviceID);
    const [selectedServiceValue, setSelectedServiceValue] = useState(serviceItemID);
    const [startValue, setStartValue] = useState("");
    const [startItemValue, setStartItemValue] = useState("");
    const [serviceTechnician, setServicetechnician] = useState("");
    
    useEffect(() => {
      if(startValue != serviceID) {
        setSelectedValue(serviceID);           
        setStartValue(serviceID);
      }
      if(startItemValue != serviceItemID) {
        setSelectedServiceValue(serviceItemID);           
        setStartItemValue(serviceItemID);
      }
    });
         
    const handleSubmit = () => {

      db.transaction(tx => {
  
         tx.executeSql(
           'DROP TABLE serwis'
         )

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
          "Kontrola węzła":1,
          "Konserwacja":2,
          "Wymiana urządzenia":3,
          "Zgłoszenie":4,
          "Przegląd":5,
          "Zmiana parametrów":6,
          "Inne":7,
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
      } 

      /*
      var pickerItemsDetailsArr = {
        4: "kontrola parametrów inicjowana przez MPEC, kontrola przekroczeń, regulacja hydrauliczna",
        14: "odmulanie, drobne naprawy bez wymiany urządzeń, chemiczne czyszczenie wymienników",
        28: "wymiana urządzenia, licznika, legalizacja licznika",
        32: "kontrola parametrów inicjowana przez Odbiorcę, reklamacja, kontrola działania licznika",

      }
      */
      var pickerItemsDetailsArr = {
        1: "kontrola parametrów inicjowana przez MPEC, kontrola przekroczeń, regulacja hydrauliczna",
        2: "Odmulanie, drobne naprawy bez wymiany urządzeń, chemiczne czyszczenie wymienników",
        3: "Wymiana urządzenia, licznika, legalizacja licznika",
        4: "Kontrola parametrów inicjowana przez Odbiorcę, reklamacja, kontrola działania licznika",
        5: "Przegląd okresowy, przegląd automatyki, udt",
        6: "Zmiana parametrów regulatora/sterownika",
      }  
      
      switch(selectedValue) {
         case 1:
            var pickerItemListArr = {
              "Kontrola parametrów":4,
              "Przekroczenia":54,
              "Inne":55,
            }
            break;
          case 2:
            var pickerItemListArr = {
              "Konserwacja węzła":14,
              "Chemiczne czyszczenie wymienników":54,
              "Inne":55,
            }
            break;          
          case 3:
            var pickerItemListArr = {
              "Wymiana urządzenia":28,
              "Legalizacja licznika":54,
              "Inne":55,
            }
            break;          
          case 4:
            var pickerItemListArr = {
              "Kontrola parametrów":32,
              "Reklamacja":54,
              "Kontrola licznika":55,
              "Pogotowie":56,
              "Inne":57,
            }
            break;
          case 5:             
          var pickerItemListArr = {
              "Przegląd okresowy":33,
              "Przegląd Automatyki":54,
              "UDT":55,
              "Inne":56,
            }
            break;   
          case 6:                         
          var pickerItemListArr = {
              "Zmiana krzywej":34,
              "Zmiana temp. wyłączenia":54,
              "Inne":55,
            }
            break;                        
          case 7:                         
          var pickerItemListArr = {
              "Inne":55,
            }
            break;   
          default:
            var pickerItemListArr = {
              "Nie wybrano sewrisu":100,
            }
            break;   
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
              <Picker.Item key={-1} color='grey' label={'Wybierz rodzaj serwisu'} value={'-1'} />
              {Object.keys(pickerItemsArr).map(key => {return <Picker.Item key={pickerItemsArr[key]} label={key} value={pickerItemsArr[key]} />})}
              <Picker.Item color='green' key={8} label={'Otwórz obieg'} value={'8'} />
              <Picker.Item color='red' key={9} label={'Zamknij obieg'} value={'9'} />
            </Picker>       

            <Picker
              selectedServiceValue={selectedServiceValue}
              style={styles.picker} 
              onValueChange={(itemValue, itemIndex) => setSelectedServiceValue(itemValue)}              
            >
              <Picker.Item key={-1} color='grey' label={'Wybierz'} value={'-1'} />
              {Object.keys(pickerItemListArr).map(key => {return <Picker.Item key={pickerItemListArr[key]} label={key} value={pickerItemListArr[key]} />})}
            </Picker>       

            <Text style={styles.itemsDetails}>{pickerItemsDetailsArr[selectedValue]}</Text>
    
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