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
  
    const { nodeDetails, serviceID, serviceItemID, newScanValue } = route.params;
    const [text, onChangeText] = useState("");
    const [selectedBaseValue, setSelectedBaseValue] = useState(serviceID);
    const [selectedServiceValue, setSelectedServiceValue] = useState(serviceItemID);
    const [startValue, setStartValue] = useState("");
    const [startItemValue, setStartItemValue] = useState("");
    const [serviceTechnician, setServicetechnician] = useState(Device.deviceName);
    const [pickerItemListArrState, setPickerItemListArrState] = useState({});
    const [picker2Color, setPicker2Color] = useState("grey");
    
    navigation.addListener('focus', () => {
      setStartValue('');
      setStartItemValue('');
      onChangeText('');
      servicePickerFun("-1", 0);
    });  

    useEffect(() => {

      if(startValue != serviceID) {
        setSelectedBaseValue(serviceID);           
        setStartValue(serviceID);
      }
      if(startItemValue != serviceItemID) {
        setSelectedServiceValue(serviceItemID);           
        setStartItemValue(serviceItemID);
      }
    });
         
    const handleSubmit = () => {

      db.transaction(tx => {
  
//         tx.executeSql(
//           'DROP TABLE serwis'
//         )

        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS serwis (id INTEGER PRIMARY KEY AUTOINCREMENT, typ INT, typ_opcje TEXT, serwisant TEXT, rodzaj TEXT, o_id INT, serwis_id INT, opis TEXT, status INT, Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)', [], (tx, results) => {
              console.log(results);
          },
          (tx, error) => {
            console.log(error);
          })
  
        tx.executeSql(
          'INSERT INTO serwis (typ, serwisant, rodzaj, o_id, serwis_id, opis, status, Timestamp) values (1, '+ JSON.stringify(serviceTechnician) +',' + JSON.stringify(nodeDetails.split(';;;')[0]) + ',' + Number.parseInt(nodeDetails.split(';;;')[1]) + ',' + selectedServiceValue + ',' + JSON.stringify(text) + ',0, datetime("now", "localtime"))', [], (tx, results) => {
            console.log(results);
        },
        (tx, error) => {
          console.log(error);
        })

        ToastAndroid.showWithGravityAndOffset(
          "Zapisano pomy??lnie!",
          ToastAndroid.LONG,
          ToastAndroid.TOP,
          25,
          50
        );
      }) 

      navigation.navigate('Synchronizacja');
    }

    const cancelAndGoToScan = () =>{
      setStartValue('');
      setStartItemValue('');
      onChangeText('');
      navigation.navigate('Skaner kodu QR')
    }
    
    const subServicePickerFun = (itemValue, itemIndex) => {
      if(itemValue == -1){
        setPicker2Color("grey");
      } else {
        setPicker2Color("black");
      }
      setSelectedServiceValue(itemValue)
    }

    const servicePickerFun = (itemValue, itemIndex) => {

      if(itemValue == 7) {
        setSelectedServiceValue(35);
      } else if(itemValue == 8) {
          setSelectedServiceValue(100);        
      } else if(itemValue == 9) {
          setSelectedServiceValue(101);                  
      } else {
        setSelectedServiceValue(-1);
      }
      setSelectedBaseValue(itemValue);
      var pickerItemListArr = {};

      switch(itemValue) {
        case 1:
           pickerItemListArr = {
             "Kontrola parametr??w":4,
             "Przekroczenia":23,
             "Inne":40,
           }
           break;
         case 2:
           pickerItemListArr = {
             "Konserwacja w??z??a":14,
             "Chemiczne czyszczenie wymiennik??w":41,
             "Inne":42,
           }
           break;          
         case 3:
           pickerItemListArr = {
             "Wymiana urz??dzenia":28,
             "Legalizacja licznika":5,
             "Inne":43,
           }
           break;          
         case 4:
           pickerItemListArr = {
             "Kontrola parametr??w":44,
             "Reklamacja":2,
             "Kontrola licznika":7,
             "Pogotowie":19,
             "Inne":45,
           }
           break;
         case 5:             
         pickerItemListArr = {
             "Przegl??d okresowy":33,
             "Przegl??d Automatyki":46,
             "UDT":6,
             "Inne":47,
           }
           break;   
         case 6:                         
         pickerItemListArr = {
             "Zmiana krzywej":48,
             "Zmiana temp. wy????czenia":49,
             "Inne":50,
           }
           break;                        
         case 7:                         
         pickerItemListArr = {
             "Inne":35,
           }
           break;   
         case 8:                         
         pickerItemListArr = {
            "Otw??rz obieg":100,
          }
           break;              
         case 9:                         
         pickerItemListArr = {
            "Zamknij obieg":101,
          }
           break;                           
         default:
           pickerItemListArr = {
             "Nie wybrano sewrisu":500,
           }
           break;   
       }  

       setPickerItemListArrState(pickerItemListArr);

    }

    const confirmAlert = () => {
        if (serviceTechnician == '') {
          ToastAndroid.showWithGravityAndOffset(
            "Musisz wybra?? u??ytkownika!",
            ToastAndroid.LONG,
            ToastAndroid.TOP,
            25,
            50
          );
          return;
        }

        if (selectedBaseValue == '-1') {
          ToastAndroid.showWithGravityAndOffset(
            "Musisz wybra?? rodzaj serwisu!",
            ToastAndroid.LONG,
            ToastAndroid.TOP,
            25,
            50
          );
          return;
        }

        if (selectedServiceValue == '-1') {
          ToastAndroid.showWithGravityAndOffset(
            "Musisz wybra?? rodzaj i pozycje serwisu!",
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
     
    if(nodeDetails == '') {
      return (
        <View style={styles.emptyView}>
          <TouchableOpacity onPress={() => navigation.navigate('Skaner kodu QR')}>
            <Text style={styles.emptyText}>Musisz zeskanowa?? najpierw obiekt</Text>
          </TouchableOpacity> 
        </View>);
    } else if(nodeDetails.split(';;;')[0]){

      var pickerItemsArr = {          
        "Kontrola w??z??a":1,
        "Konserwacja":2,
        "Wymiana urz??dzenia":3,
        "Zg??oszenie":4,
        "Przegl??d":5,
        "Zmiana parametr??w":6,
        "Inne":7,
      }
   
      var pickerItemsDetailsArr = {
        1: "kontrola parametr??w inicjowana przez MPEC, kontrola przekrocze??, regulacja hydrauliczna",
        2: "Odmulanie, drobne naprawy bez wymiany urz??dze??, chemiczne czyszczenie wymiennik??w",
        3: "Wymiana urz??dzenia, licznika, legalizacja licznika",
        4: "Kontrola parametr??w inicjowana przez Odbiorc??, reklamacja, kontrola dzia??ania licznika",
        5: "Przegl??d okresowy, przegl??d automatyki, udt",
        6: "Zmiana parametr??w regulatora/sterownika",
      }  
    
       return (
          <View style={styles.mainContainer}>      
            <Text style={styles.addressText}>{nodeDetails.split(';;;')[1]+ ', ' + nodeDetails.split(';;;')[0] + '\n' + nodeDetails.split(';;;')[2]}</Text>
            
            <Picker
              selectedValue={selectedBaseValue}
              style={styles.picker} 
              itemStyle={styles.pickerItem}
              onValueChange={(itemValue, itemIndex) => servicePickerFun(itemValue, itemIndex)}
            >
              <Picker.Item style={{fontSize:13}} key={-1} color='grey' label={'Wybierz rodzaj serwisu'} value={-1} />
              {Object.keys(pickerItemsArr).map(key => {return <Picker.Item style={{fontSize:13}} key={pickerItemsArr[key]} color="black" label={key} value={pickerItemsArr[key]} />})}
              <Picker.Item style={{fontSize:13}} color='green' key={8} label={'Otw??rz obieg'} value={8} />
              <Picker.Item style={{fontSize:13}} color='red' key={9} label={'Zamknij obieg'} value={9} />
            </Picker>

            <Picker
              selectedValue={selectedServiceValue}
              style={styles.picker} 
              onValueChange={(itemValue, itemIndex) => subServicePickerFun(itemValue, itemIndex)}              
            >
              <Picker.Item style={{fontSize:13}} key={-1} color={picker2Color} label={'Wybierz'} value={'-1'} />
              {Object.keys(pickerItemListArrState).map(key => {return <Picker.Item style={{fontSize:13}} key={pickerItemListArrState[key]} label={key} value={pickerItemListArrState[key]} />})}
            </Picker>       

            <Text style={styles.itemsDetails}>{pickerItemsDetailsArr[selectedBaseValue]}</Text>
    
            <TextInput
              onChangeText={onChangeText}
              value={text}
              multiline
              numberOfLines={3}
              style={styles.input}
            />

            <View style={styles.buttonsContainer}>
              <TouchableOpacity onPress={confirmAlert} style={styles.saveTouchable}>
                <Text style={styles.saveText}>Zapisz serwis</Text>
              </TouchableOpacity> 
              <TouchableOpacity onPress={() => cancelAndGoToScan()} style={styles.saveTouchable}>
                <Text style={styles.cancelText}>Anuluj serwis</Text>
              </TouchableOpacity> 
            </View>    
          </View>
        ); 
      } 
   }

  export default ServiceScreen;