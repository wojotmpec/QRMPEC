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
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 20,
    paddingRight: 20,
  },
  mainContainer: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginTop: 50,
  },
  saveText: {
    backgroundColor: '#DAF7A6',
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 100,
    paddingRight: 100,
    width: "70%",
  },
  picker: {
    width: '70%',
    height: 150
  },
  input: {
    width: '70%',
    padding: 10,
    backgroundColor: '#E5E4E2',
    borderBottomColor: '#ababab',
    borderBottomWidth: 1,
    borderTopColor: '#d4d4d4',
    borderTopWidth: 1,
  }
});

export default styles;