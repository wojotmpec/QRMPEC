import { Text, View, StyleSheet, Button, TextInput } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';


import * as SQLite from 'expo-sqlite'
const db = SQLite.openDatabase('db.QRProject')

const Stack = createNativeStackNavigator();

function SynchScreen({navigation}) {
  
    
    const handleSubmit = () => {
      console.log('oky');

      var dataArray = Array();
      db.transaction(tx => {
   
        tx.executeSql('SELECT * FROM serwis WHERE status = 0', [], (trans, result) => {
          console.log('pp');
          for (let i = 0; i < result.rows.length; ++i) {
            let values = result.rows._array[i];
  //          {id:1,name:'aaa'},{id:2,name:'bbb'}
//            valService = 'rodzaj:' + values['rodzaj'] + ',wID:' + values['w_id'] + '&serwisID=' + values['serwis_id'] + '&opis=' + values['opis'] + '&status=' + values['status'] + '&timeService=' + values['Timestamp']
            dataArray.push({rodzaj: values['rodzaj'], wID: values['w_id'], serwisID: values['serwis_id'], opis: values['opis'], status: values['status'], timeService: values['Timestamp']})
      //      console.log(val)
          }
          console.log(dataArray);
           
  
            let res = fetch('http://hercules8.mpec.krakow.pl/postCreate.php', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                dataArray
//                 'val': 'KKK-JG'
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
      <Text>{"\n"}{"\n"}</Text>
      <Button onPress={handleSubmit} title="Synchronizuj" />
  
      </View>
    );
  }

  export default SynchScreen  ;