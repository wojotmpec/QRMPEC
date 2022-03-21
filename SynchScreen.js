import React, { useEffect } from 'react';
import { Text, View, ToastAndroid, TouchableOpacity} from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import styles from './styles'; 

import * as SQLite from 'expo-sqlite'
const db = SQLite.openDatabase('db.QRProject')

const Stack = createNativeStackNavigator();

function SynchScreen({navigation}) {

    var focusListener = navigation.addListener('focus', () => {
      db.transaction(transaction => {
        transaction.executeSql(`SELECT COUNT(*) AS do_wyslania FROM serwis WHERE status = 0;`,
        [], (transaction, resultSet) =>{
          navigation.setOptions({
            tabBarBadge: resultSet.rows._array[0]['do_wyslania'] });
        },
        (transaction, error) => console.log(error));
      });
    });

    const handleSubmit = () => {
      console.log('oky');

      var dataArray = Array();
      var successVal = '0';
      var isData = 0;
      db.transaction(tx => {

        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS serwis (id INTEGER PRIMARY KEY AUTOINCREMENT, typ INT, typ_opcje TEXT, mistrz TEXT, rodzaj INT, w_id INT, serwis_id INT, opis TEXT, status INT, Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)'
        )

        tx.executeSql('SELECT * FROM serwis WHERE status = 0', [], (trans, result) => {

          for (let i = 0; i < result.rows.length; ++i) {
            let values = result.rows._array[i];
            if(values['typ_opcje'] == null) {
              values['typ_opcje'] = '';
            }
            dataArray.push({ type: values['typ'], typeOptions: values['typ_opcje'], serviceMan: values['mistrz'], rodzaj: values['rodzaj'], wID: values['w_id'], serwisID: values['serwis_id'], opis: values['opis'], status: values['status'], timeService: values['Timestamp']})
            isData = 1;
          }
          console.log(dataArray);
          if(isData == 1) {
              let res = fetch('http://hercules8.mpec.krakow.pl/postCreate.php', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                dataArray
                 })        
            })
            .then(res => res.json())
            .then(data => {
  //            console.log(data);
              // enter you logic when the fetch is successful               
               successVal = data.status
               console.log( 'PPR'+ successVal)
               db.transaction(tx1 => {
   
                console.log( 'HERE' + successVal)
                if(successVal == '1') {
                  tx1.executeSql(
                    'UPDATE serwis SET status=1 WHERE status = 0;'
                  )
                  console.log( 'DONE')
                  ToastAndroid.showWithGravityAndOffset(
                    "Synchronizacja przebiegła pomyślnie!",
                    ToastAndroid.LONG,
                    ToastAndroid.TOP,
                    25,
                    50
                  );
                } else {
                  console.log( 'FAILED')
                  ToastAndroid.showWithGravityAndOffset(
                    "Nie udało sie zsynchronizować!",
                    ToastAndroid.LONG,
                    ToastAndroid.TOP,
                    25,
                    50
                  );
                }        
              }) 
               console.log( 'EEE'+ successVal)
             }).catch(error => {
              // enter your logic for when there is an error (ex. error toast)
               console.log(error)
               ToastAndroid.showWithGravityAndOffset(
                "Problem z synchronizacją, brak połączenia!",
                ToastAndroid.LONG,
                ToastAndroid.TOP,
                25,
                50
              );
             }) 
            } else {
              ToastAndroid.showWithGravityAndOffset(
                "Brak danych do przesłania !",
                ToastAndroid.LONG,
                ToastAndroid.TOP,
                25,
                50
              );              
            }
  
        })
       
      }) 
    }

    return (
      <View  style={styles.syncView}>

        <TouchableOpacity onPress={handleSubmit}>
          <Text style={styles.syncText}>Synchronizuj</Text>
        </TouchableOpacity> 

      </View>
    );
  }

  export default SynchScreen  ;