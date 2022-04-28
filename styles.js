// import React, { useState, useEffect } from 'react';
import {
  StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  emptyView: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  emptyText: {
    backgroundColor: 'tomato',
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 20,
    paddingRight: 20,
    width: "100%",
  },
  syncView: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  syncText: {
    backgroundColor: '#DAF7A6',
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 50,
    paddingRight: 50,
    width: "100%",
  },
  addressText: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DAF7A6',
    width: '100%',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  mainContainer: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxContainer: {
    flex: 0,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '70%',
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 120,
    width: "100%",
  },
  checkboxText:{
    marginBottom: 20,
  },
  scanAgainButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanAgainText: {
    backgroundColor: '#DAF7A6',
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 50,
    paddingRight: 50,
  },
  saveTouchable: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  saveText: {
    backgroundColor: '#DAF7A6',
    paddingTop: 30,
    paddingBottom: 10,
    paddingLeft: 100,
    paddingRight: 100,
    width: "70%",
  },  
  cancelText: {
    backgroundColor: 'tomato',
    paddingTop: 30,
    paddingBottom: 10,
    paddingLeft: 100,
    paddingRight: 100,
    width: "70%",
  },  
  circulationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 10,
    height: 50,
    width: '100%',
  },
  openCirculationTouchable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  openCirculationText: {
    backgroundColor: '#DAF7A6',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    height: 50,
    width: "100%",
  },
  closeCirculationTouchable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeCirculationText: {
    backgroundColor: 'tomato',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    height: 50,
    width: "100%",
  },
  picker: {
    width: '70%',
    height: 60
  },
  input: {
    width: '75%',
    padding: 10,
    backgroundColor: '#E5E4E2',
    borderBottomColor: '#ababab',
    borderBottomWidth: 1,
    borderTopColor: '#d4d4d4',
    borderTopWidth: 1,
  },
  itemsDetails: {
    marginBottom: 20,
  }
});

export default styles;