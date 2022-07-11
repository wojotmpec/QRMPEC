import React, { useState, useEffect } from 'react';
import { Text, View, Button, ToastAndroid, TouchableOpacity, Alert} from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import styles from './styles'; 
import {Picker} from '@react-native-picker/picker';

import * as SQLite from 'expo-sqlite'
const db = SQLite.openDatabase('db.QRProject')

//const Stack = createNativeStackNavigator();

function SynchScreen({route, navigation}) {

    const [userID, setUserID] = useState("");
    const [userItemID, setUserItemID] = useState("-1");
    const [selectedUserValue, setSelectedUserValue] = useState(userItemID);
    const [users, setUsers] = useState([]);

    const userPickerFun = (itemValue, itemIndex) => {
      setSelectedUserValue(itemValue)
      // console.log('PP' + itemValue + 'YY');
      db.transaction(tx => {
           
        tx.executeSql(
          'DELETE FROM uzytkownik_qr', [], (tx, results) => {
            console.log(results);
        },
        (tx, error) => {
          console.log(error);
        })

        tx.executeSql(
          'INSERT INTO uzytkownik_qr(login) values ("'+itemValue+'")', [], (tx, results) => {
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
    }

//    console.log('USERX:' + userID);

    db.transaction(transaction => {
      transaction.executeSql(`SELECT COUNT(*) AS do_wyslania FROM serwis WHERE status = 0;`,
      [], (transaction, resultSet) =>{
        navigation.setOptions({
          tabBarBadge: resultSet.rows._array[0]['do_wyslania'] });
      },
      (transaction, error) => console.log(error));
    });

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

    useEffect(() => {
      
      db.transaction(tx => {   

   //     tx.executeSql(
   //       'DROP TABLE uzytkownik_qr'
   //     )

        tx.executeSql(
        'CREATE TABLE IF NOT EXISTS uzytkownik_qr (id INTEGER PRIMARY KEY AUTOINCREMENT, nazwa TEXT, login TEXT, dzial TEXT)', [], (tx, results) => {
            console.log(results);
        },
        (tx, error) => {
          console.log(error);
        })      

        tx.executeSql(`SELECT login FROM uzytkownik_qr;`, [], (transaction, resultSet) =>{
          if(resultSet.rows._array[0] != null) {
            setUserID(resultSet.rows._array[0]['login']);
          }
        },
        (transaction, error) => console.log(error));
      });

      if(userID == '') {
          let res = fetch('http://hercules8.mpec.krakow.pl/postGetUsersFromFile.php', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          }     
        })
        .then(res => res.json())
        .then(data => {

            let usersList = []; let usersListTmp=[];

            let i;
            for(i=0; i < data.length; i++){
                usersListTmp = data[i].split('#');
                usersList[usersListTmp[0]]=usersListTmp[1];
            }
            
            setUsers(usersList);

            // console.log(data[0])

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
      }    
    }, []);

    const handleSubmit = () => {

      if(userID == '') {
        Alert.alert(
          "Brak użytkownika",
          "Nie wybrano użytkownika telefonu, synchronizacja nie jest możliwa !",
          [{
              text: "OK",
              style: "cancel"
            }
          ]
        );
        
        return;
      }

      var dataArray = Array();
      var successVal = '0';
      var isData = 0;
      db.transaction(tx => {
//        tx.executeSql(
//          'DROP TABLE serwis'
//        )
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS serwis (id INTEGER PRIMARY KEY AUTOINCREMENT, typ INT, typ_opcje TEXT, serwisant TEXT, mistrz TEXT, rodzaj TEXT, o_id INT, serwis_id INT, opis TEXT, status INT, Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)'
        )

        var counter = 0;
        tx.executeSql(`SELECT COUNT(*) AS to_delete FROM serwis WHERE status = 1;`,
        [], (tx, result) =>{
          counter = result.rows._array[0]['to_delete'];
          
          if(counter > 0) {
            tx.executeSql(
              'DELETE FROM serwis WHERE status = 1 AND Timestamp < datetime("now", "-2 months" )'               
            )
          }
        },
        (tx, error) => console.log(error));

        tx.executeSql('SELECT * FROM serwis WHERE status = 0', [], (trans, result) => {

          for (let i = 0; i < result.rows.length; ++i) {
            let values = result.rows._array[i];
            if(values['typ_opcje'] == null) {
              values['typ_opcje'] = '';
            }
            values['serwisant'] = userID;
            dataArray.push({ type: values['typ'], typeOptions: values['typ_opcje'], serviceMan: values['serwisant'], rodzaj: values['rodzaj'], oID: values['o_id'], serwisID: values['serwis_id'], opis: values['opis'], status: values['status'], timeService: values['Timestamp']})
            isData = 1;
          }
          // console.log(dataArray);
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

               db.transaction(tx1 => {
   
                if(successVal == '1') {
                  tx1.executeSql(
                    'UPDATE serwis SET status=1 WHERE status = 0;'
                  )
                  db.transaction(transaction => {
                    transaction.executeSql(`SELECT COUNT(*) AS do_wyslania FROM serwis WHERE status = 0;`,
                    [], (transaction, resultSet) =>{
                      navigation.setOptions({
                        tabBarBadge: resultSet.rows._array[0]['do_wyslania'] });
                    },
                    (transaction, error) => console.log(error));
                  });
                  ToastAndroid.showWithGravityAndOffset(
                    "Synchronizacja przebiegła pomyślnie!",
                    ToastAndroid.LONG,
                    ToastAndroid.TOP,
                    25,
                    50
                  );
                  console.log( 'DATA SENT')
                } else {
                  console.log( 'FAILED')
//                  console.log( successVal)
                  ToastAndroid.showWithGravityAndOffset(
                    "Nie udało sie zsynchronizować!",
                    ToastAndroid.LONG,
                    ToastAndroid.TOP,
                    25,
                    50
                  );
                }        
              }) 
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

    if(userID == '' || userID == '-1') {
      return (
        <View  style={styles.syncView}>

          <Picker
            selectedValue={selectedUserValue}
            style={styles.picker} 
            onValueChange={(itemValue, itemIndex) => userPickerFun(itemValue, itemIndex)}              
          >

          <Picker.Item key={-1} label={'Wybierz użytkownika'} value={'-1'} /> 
            {Object.keys(users).map(key => {return <Picker.Item key={users[key]} label={key} value={users[key]} />})}
          </Picker>   

          <TouchableOpacity onPress={handleSubmit}>
            <Text style={styles.syncText}>Synchronizuj</Text>
          </TouchableOpacity> 

        </View>
      );
    } else {
      return (
        <View  style={styles.syncView}>

          <TouchableOpacity onPress={handleSubmit}>
            <Text style={styles.syncText}>Synchronizuj</Text>
          </TouchableOpacity> 

        </View>
      );
    }
  }

  export default SynchScreen  ;