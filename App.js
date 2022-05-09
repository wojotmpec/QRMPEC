import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity, ToastAndroid, Image } from 'react-native';

import { BarCodeScanner } from 'expo-barcode-scanner';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as SQLite from 'expo-sqlite'

import { Ionicons } from '@expo/vector-icons';
import logo from './assets/logo.png'; 
import styles from './styles';  

import ServiceScreen from './ServiceScreen';
// import OverviewScreen from './OverviewScreen';
import SynchScreen from './SynchScreen';

const db = SQLite.openDatabase('db.QRProject')
const Tab = createBottomTabNavigator();

function LogoTitle() {
  return (
    <><Text style={{height:80}}><Image source={logo} style={{ width: 40, height: 40,}} /> {'          '} MPEC aplikacja QR wersja 1.0.0</Text></>
  );
}

function HomeScreen({ navigation }) {

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const isFocused = useIsFocused(); 
  var dataTMP = '';    
  

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      // navigation.navigate('Przeglądy', {
      //   nodeDetails: ''
      // });
      navigation.navigate('Serwisy', {
        nodeDetails: ''
      });
      navigation.navigate('Skaner kodu QR');

    })();
  }, []);

  const handleBarCodeScanned = ({
    type,
    data
  }) => {

    if(dataTMP == data) {
      return;
    }  
    dataTMP = data;
    var dataArr = data.split(';;;');
    var serviceStartID = '';
    var serviceItemStartID = '';
    var newScanValueStart = '';
    
    if (dataArr.length == 3) {
      if (dataArr[0] == '') {
        ToastAndroid.showWithGravityAndOffset(
          "Pierwszy parametr jest nieprawidłowy!",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
          25,
          50
        );
      } else if (!(Number.isInteger(Number.parseInt(dataArr[1])) && dataArr[1] > 0)) {
        ToastAndroid.showWithGravityAndOffset(
          "Drugi parametr jest nieprawidłowy!",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
          25,
          50
        );
      } else if (dataArr[2].length < 3) {
        ToastAndroid.showWithGravityAndOffset(
          "Trzeci parametr jest za krótki!",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
          25,
          50
        );
      } else {
        
        setScanned(true);

        serviceStartID = '-1';
        serviceItemStartID = '-1';
        newScanValueStart = 'true';

        navigation.navigate('Synchronizacja');
        // navigation.navigate('Przeglądy', {
        //   nodeDetails: data
        // });
        navigation.navigate('Serwisy', {
          nodeDetails: data,
          serviceID: serviceStartID,
          serviceItemID: serviceItemStartID,
          newScanValue: newScanValueStart
        });
        
      }
    } else {
      ToastAndroid.showWithGravityAndOffset(
        "Nieprawidłowy kod QR!",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
        25,
        50
      );
    }

    setTimeout(() => {
      dataTMP = '';
    }, 2000);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
     {isFocused && <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />}
      {/* {scanned && <Button style={styles.button} title={'Skanuj nowy obiekt'} onPress={() => setScanned(false)} />}    */}

      {scanned && <TouchableOpacity onPress={() => setScanned(false)} style={styles.scanAgainButton}>
          <Text style={styles.scanAgainText}>Kliknij aby zeskanować nowy obiekt</Text>
      </TouchableOpacity>}

    </View>
  );
}

export default function App() {
  const [toSync, setToSync] = useState(0);

  useEffect(() => {    
    
    db.transaction(tx => {

//      tx.executeSql(
//        'DROP TABLE serwis'
//      )

      tx.executeSql(
      'CREATE TABLE IF NOT EXISTS serwis (id INTEGER PRIMARY KEY AUTOINCREMENT, typ INT, typ_opcje TEXT, serwisant TEXT, rodzaj TEXT, o_id INT, serwis_id INT, opis TEXT, status INT, Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)', [], (tx, results) => {
          console.log(results);
      },
      (tx, error) => {
        console.log(error);
      })

      tx.executeSql(`SELECT COUNT(*) AS do_wyslania FROM serwis WHERE status = 0;`,
      [], (transaction, resultSet) =>{
        setToSync(resultSet.rows._array[0]['do_wyslania']);
      },
      (transaction, error) => console.log(error));
    });
  });

  return (
    <NavigationContainer>
      
        <Tab.Navigator  
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Skaner kodu QR') {
                iconName = focused
                  ? 'apps'
                  : 'apps-outline';
              } else if (route.name === 'Serwisy') {              
                iconName = focused
                ? 'key'
                : 'key-outline';
              // } else if (route.name === 'Przeglądy') {              
              //   iconName = focused
              //   ? 'construct'
              //   : 'construct-outline';
              } else if (route.name === 'Synchronizacja') {              
                iconName = focused
                ? 'repeat'
                : 'repeat-outline';
              }

              return <Ionicons name={iconName} size={40} color={color} />;
            },
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: { height: '8%' },
            headerTitleAlign: 'center',
            tabBarLabelPosition:'below-icon',
            tabBarBadgeStyle: { backgroundColor: 'rgba(220, 219, 220, 0.5)', color:'tomato', alignItems:'center', justifyContent: 'center'},
            headerTitle: (props) => <LogoTitle {...props} />,
          })} 
        >
          {/* ,  width: 30, height: 30, fontSize:5 do tabBarBadgeStyle */}

        <Tab.Screen name="Skaner kodu QR" component={HomeScreen} />        
        <Tab.Screen name="Serwisy" component={ServiceScreen} />
        {/* <Tab.Screen name="Przeglądy" component={OverviewScreen} />   */}
        <Tab.Screen name="Synchronizacja" component={SynchScreen} options={{ tabBarBadge: toSync }}/>          
      </Tab.Navigator>
    </NavigationContainer>
  );
}





