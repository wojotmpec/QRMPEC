import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TextInput } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import styles from './styles'; 

import ServiceScreen from './ServiceScreen';
import OverviewScreen from './OverviewScreen';

import * as SQLite from 'expo-sqlite'
const db = SQLite.openDatabase('db.QRProject')

const Tab = createBottomTabNavigator();

function HomeScreen({ navigation }) {

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const isFocused = useIsFocused(); 

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    navigation.navigate('Service', {
      nodeDetails: data
    });
    navigation.navigate('Overview', {
      nodeDetails: data
    });
 //   alert(`Bar code with type ${type} and data ${data} has been scanned!`);
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
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="HOME">
        <Tab.Screen name="QR scanner" component={HomeScreen} />
        <Tab.Screen name="Service" component={ServiceScreen} />
        {/* <Tab.Screen name="Service" component={ServiceScreen} options={{ title: "SERWIS",        
          headerLeft: () => (
            <Text></Text>
          ),
          headerRight: () => (
            <Button
              onPress={() =>alert('Right pressed')}
              title="Przeglądy >"
              color="blue"
            />
          ),
          headerStyle: {
            backgroundColor: '#F4EFC9',
          },
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold'
          } }} />         */}
        <Tab.Screen name="Overview" component={OverviewScreen} />  

      </Tab.Navigator>
    </NavigationContainer>
  );
}





