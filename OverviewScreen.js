// import React, { useState, } from 'react';
// import { Text, View, TextInput, ToastAndroid, TouchableOpacity} from 'react-native';

// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import * as Device from 'expo-device';

// import {Picker} from '@react-native-picker/picker';
// import Checkbox from 'expo-checkbox';
// import styles from './styles'; 

// import * as SQLite from 'expo-sqlite'
// const db = SQLite.openDatabase('db.QRProject')

// const Stack = createNativeStackNavigator();

// function OverviewScreen({route, navigation}) {
  
//   const { nodeDetails } = route.params;
//   const [isChecked1, setChecked1] = useState(false);
//   const [isChecked2, setChecked2] = useState(false);
//   const [isChecked3, setChecked3] = useState(false);
//   const [text, onChangeText] = useState("");
//   const [serviceTechnician, setServicetechnician] = useState("");
  
//   const handleSubmit = () => {

//     if(serviceTechnician == ''){
//       ToastAndroid.showWithGravityAndOffset(
//         "Musisz wybrać użytkownika!",
//         ToastAndroid.LONG,
//         ToastAndroid.TOP,
//         25,
//         50
//       );
//       return;
//     }

//     let val = '';
//     if(isChecked1 == 1) { val = '1'; } else {val = '0';}
//     if(isChecked2 == 1) { val = val+',1'; } else {val = val+',0';}
//     if(isChecked3 == 1) { val = val+',1'; } else {val = val+',0';}
    
   
//     db.transaction(tx => {

// //       tx.executeSql(
// //         'DROP TABLE serwis'
// //       )
//       tx.executeSql(
//         'CREATE TABLE IF NOT EXISTS serwis (id INTEGER PRIMARY KEY AUTOINCREMENT, typ INT, typ_opcje TEXT, serwisant TEXT, rodzaj INT, w_id INT, serwis_id INT, opis TEXT, status INT, Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)'
//       )
      
//       tx.executeSql(
//         'INSERT INTO serwis (typ, typ_opcje, serwisant, rodzaj, w_id, serwis_id, opis, status, Timestamp) values (2,' + JSON.stringify(val) + ',' + JSON.stringify(serviceTechnician) +','+ Number.parseInt(nodeDetails.split(';;;')[0]) + ',' + Number.parseInt(nodeDetails.split(';;;')[1]) + ',0,' + JSON.stringify(text) + ',0, datetime("now", "localtime"))'
//       )

//       ToastAndroid.showWithGravityAndOffset(
//         "Zapisano pomyślnie!",
//         ToastAndroid.LONG,
//         ToastAndroid.TOP,
//         25,
//         50
//       );
//     })  

//     navigation.navigate('Synchronizacja');
//   }

  
//   var serviceTechniciansArr = Device.deviceName.split(";");
      
//   if(nodeDetails == '') {
//     return (
//       <View style={styles.emptyView}>
//       <TouchableOpacity onPress={() => navigation.navigate('Skaner kodu QR')}>
//         <Text style={styles.emptyText}>Musisz zeskanować najpierw obiekt</Text>
//       </TouchableOpacity> 
//     </View>);
//     } else {

//     return (
//       <View>
//         <View style={styles.mainContainer}>      
//           <Text style={styles.addressText}>{nodeDetails.split(';;;')[2]}</Text>
//         </View>


//         <View style={styles.mainContainer}>    
//           <Picker
//               selectedValue={serviceTechnician}
//               style={styles.picker} 
//               onValueChange={(itemValue, itemIndex) => setServicetechnician(itemValue)}
//             >
//             <Picker.Item label="Wybierz użytkownika" value="" />
//             {serviceTechniciansArr.map(technician => {return <Picker.Item key={technician} label={technician} value={technician} />})}
//           </Picker>   
//           </View>
          
//         <View style={styles.checkboxContainer}>
//           <Text style={styles.checkboxText} onPress={()=>setChecked1(!isChecked1)}><Checkbox value={isChecked1} onValueChange={setChecked1} /> Przegląd węzła</Text>
//           <Text style={styles.checkboxText} onPress={()=>setChecked2(!isChecked2)}><Checkbox value={isChecked2} onValueChange={setChecked2} /> Serwis węzła</Text>
//           <Text style={styles.checkboxText} onPress={()=>setChecked3(!isChecked3)}><Checkbox value={isChecked3} onValueChange={setChecked3} /> Bardzo długi tekst nt. serwisu węzła</Text>
//         </View>

//         <View style={styles.mainContainer}>      
//           <TextInput
//             onChangeText={onChangeText}
//             value={text}
//             multiline
//             numberOfLines={4}
//             style={styles.input}
//           />

//           <TouchableOpacity onPress={handleSubmit} style={styles.saveTouchable}>
//             <Text style={styles.saveText}>Zapisz przegląd</Text>
//           </TouchableOpacity> 

//         </View>
//       </View>);
//     }
//   }

// export default OverviewScreen;