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
  input: {
    width: 240,
    height: 90,
    padding: 10,
    marginBottom: 5,
    backgroundColor: '#e8e8e8',
    fontSize: 18
  },
  emptyContainer: {
    flex: 1,
    flexDirection: "column",
    margin: 10,
    justifyContent: "center",
  },
  emptyText: {
    flex: 0,
    alignItems: 'center',
    fontSize: 20,
    justifyContent: 'center',
    backgroundColor: "tomato",
    height: 100,
    paddingTop: 30,
    paddingLeft: 20,
    paddingRight: 20,
  },
  addressText: {
    flex: 0,
    alignItems: 'center',
    fontSize: 25,
    justifyContent: 'center',
    backgroundColor: "#DAF7A6",
    height: 70,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  mainContainer: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 40
  }
});

export default styles;