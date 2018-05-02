import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  findNodeHandle,
  View,
  Button,
  Alert
} from 'react-native';
import { connect } from 'react-redux';
import Header from '../Components/Header';
import {
  BarcodePicker,
  ScanditModule,
  ScanSession,
  Barcode,
  SymbologySettings,
  ScanSettings
} from 'react-native-scandit';
import InventoryActions from '../Redux/InventoryRedux';
import theme from '../Themes/designer';

fetch("https://pantry-mate-server.herokuapp.com/getscannerkey", {
  method: "GET"
}).then(response => {
  return response.text()
}).then(data => {
  ScanditModule.setAppKey(data);
})

class ScannerScreen extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    this.settings = new ScanSettings();
    this.settings.setSymbologyEnabled(Barcode.Symbology.UPCA, true);
    this.settings.setSymbologyEnabled(Barcode.Symbology.UPCE, true);
  }
  handleRouting = (nav) => () => {
    this.props.navigation.navigate(nav);
  }
  onScan(session) {
    fetch("https://pantry-mate-server.herokuapp.com/nutrition/searchupc", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        upc: session.newlyRecognizedCodes[0].data
      })
    }).then(response => {
      return response.json()
    }).then((data) => {
      if (data.foods) {
        Alert.alert(
          'Confirm add product to inventory',
          `Do you want to add ${data.foods[0].food_name} to your inventory?`,
          [
            {text: 'Cancel', onPress: () => {}, style: 'cancel'},
            {text: 'Save', onPress: () => {
              fetch("https://pantry-mate-server.herokuapp.com/inventory/addscanneditem", {
                method: "POST",
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  item: data.foods[0],
                  uid: this.props.uid,
                  inventory: this.props.inventory
                })
              }).then(() => {
                this.scanner.stopScanning()
                this.props.navigation.navigate('InventoryScreen');
              })
            }},
          ],
          { cancelable: false }
        )
      } else {
        Alert.alert(
          'Product not found',
          'Sorry, this product was unable to be identified. Try adding it manually or through a shopping list.',
          [
            {text: 'OK', onPress: () => {}, style: 'cancel'},
          ],
          { cancelable: false }
        )
      }
    })
  }
  render () {
    return (
      <View style={theme.screen.mainContainer}>
        <Header pageTitle={'Scan Product'} goBackButton handleGoBack={() => this.props.navigation.goBack()} style={{paddingBottom: theme.gutters.wide}}/>

        <BarcodePicker
  				onScan={(session) => { this.onScan(session) }}
  				scanSettings= { this.settings }
          ref={(scan) => { this.scanner = scan }}
  				style={{ flex: 0.95 }}
        />

        <Button
          title="Start Scanning"
          onPress={() => this.scanner.startScanning()}
        />
        <Button
          title="Stop Scanning"
          onPress={() => this.scanner.stopScanning()}
        />
      </View>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    uid: state.auth.uid,
    inventory: state.inventory.inventory
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getInventory: (inventory) => dispatch(InventoryActions.getInventory(inventory))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ScannerScreen);
