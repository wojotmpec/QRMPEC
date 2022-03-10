import { Text, View, StyleSheet, Button, TextInput, ToastAndroid} from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';


import * as SQLite from 'expo-sqlite'
const db = SQLite.openDatabase('db.QRProject')

const Stack = createNativeStackNavigator();

function SynchScreen({navigation}) {
  
    
    const handleSubmit = () => {
      console.log('oky');

      var dataArray = Array();
      var successVal = '0';
      db.transaction(tx => {
   
        tx.executeSql('SELECT * FROM serwis WHERE status = 0', [], (trans, result) => {
          console.log('pp');
          for (let i = 0; i < result.rows.length; ++i) {
            let values = result.rows._array[i];
            dataArray.push({rodzaj: values['rodzaj'], wID: values['w_id'], serwisID: values['serwis_id'], opis: values['opis'], status: values['status'], timeService: values['Timestamp']})
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
             }) 
  
        })
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