import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TextInput, ToastAndroid } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import styles from './styles';  

import ServiceScreen from './ServiceScreen';
import OverviewScreen from './OverviewScreen';
import SynchScreen from './SynchScreen';

import * as SQLite from 'expo-sqlite'
const db = SQLite.openDatabase('db.QRProject')

const Tab = createBottomTabNavigator();

function HomeScreen({ navigation }) {

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const isFocused = useIsFocused(); 

//  const [nodeDetails, setNodeDetails] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      navigation.navigate('Przeglądy', {
        nodeDetails: ''
      });
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

    var dataArr = data.split(';;;');
    
    if (dataArr.length == 3) {
      if (!(Number.isInteger(Number.parseInt(dataArr[0])) && dataArr[0] > 0)) {
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
        
        navigation.navigate('Synchronizacja');
        navigation.navigate('Przeglądy', {
          nodeDetails: data
        });
        navigation.navigate('Serwisy', {
          nodeDetails: data
        });
        
      }
    } else {
      ToastAndroid.showWithGravityAndOffset(
        "Nieprawidłowy kod QR!",
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
        25,
        50
      );
    }
    
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
      {scanned && <Button title={'Skanuj nowy obiekt'} onPress={() => setScanned(false)} />}
    </View>
  );
}

export default function App() {
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
              } else if (route.name === 'Przeglądy') {              
                iconName = focused
                ? 'construct'
                : 'construct-outline';
              } else if (route.name === 'Synchronizacja') {              
                iconName = focused
                ? 'repeat'
                : 'repeat-outline';
              }

              // You can return any component that you like here!
              return <Ionicons name={iconName} size={50} color={color} />;
            },
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: { height:120, size: 150 },
            tabBarLabelStyle: {
              fontSize: 22,
            },
            tabBarLabelPosition:'below-icon',
          })}
        >

        <Tab.Screen name="Skaner kodu QR" component={HomeScreen} />        
        <Tab.Screen name="Serwisy" component={ServiceScreen} />
        <Tab.Screen name="Przeglądy" component={OverviewScreen} />  
        <Tab.Screen name="Synchronizacja" component={SynchScreen} />  

      </Tab.Navigator>
    </NavigationContainer>
  );
}





