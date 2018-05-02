import React, { Component } from 'react';
import { View, Text, ScrollView, TextInput, Alert, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import update from 'immutability-helper';
import levenshtein from 'fast-levenshtein';
import async from 'async';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import DatePicker from 'react-native-datepicker';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import InventoryList from '../Components/InventoryList';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import InventoryActions from '../Redux/InventoryRedux';

import theme from '../Themes/designer';

class InventoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: 'expiring', title: 'Expiring' },
        { key: 'cooked', title: 'Leftovers' },
        { key: 'all', title: 'All' },
      ],
      newItem: {label: '', datePurchased: new Date(new Date().setHours(0,0,0,0))},
    };
  }

  componentWillMount() {
    const user = AsyncStorage.getItem('user', (err, result) => {
      if (err) {
        this.props.navigation.navigate('LaunchScreen');
      } else {
        this.setState({user: JSON.parse(decodeURI(result))});
        fetch("https://pantry-mate-server.herokuapp.com/inventory/get", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            uid: this.props.uid
          })
        }).then(response => response.json())
        .then((data) => {
          fetch("https://pantry-mate-server.herokuapp.com/expiration/update", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              uid: this.props.uid,
              inv: data
            })
          }).then(response => response.json())
          .then(data2 => {
            this.props.getInventory(data2)
          })
        }).catch(error => this.props.getInventory({inventoryItems: []}))
      }
    });
  }

  handleCookItem = (idx) => {
    const temp = Object.assign({}, this.props.inventory.inventoryItems[idx], {'isCooked': true, 'dateCooked': new Date(new Date().setHours(0,0,0,0))})
    const i1 = this.props.inventory.inventoryItems.slice(0, idx)
    const i2 = this.props.inventory.inventoryItems.slice(idx + 1, this.props.inventory.inventoryItems.length+1);
    const inv = {...this.props.inventory, 'inventoryItems': i1.concat(i2).concat([temp])};
    fetch("https://pantry-mate-server.herokuapp.com/inventory/update", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uid: this.props.uid,
        data: inv
      })
    }).then(() => {
      fetch("https://pantry-mate-server.herokuapp.com/inventory/get", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uid: this.props.uid
        })
      }).then(response => response.json())
      .then(data => {
        this.props.getInventory(data);
        this.setState({newItem: {label: '', datePurchased: new Date(new Date().setHours(0,0,0,0))}})
      }).catch(error => this.props.getInventory({inventoryItems: []}))
    })
  }

  handleOpenItem = (idx) => {
    const temp = Object.assign({}, this.props.inventory.inventoryItems[idx], {'isOpened': true, 'dateOpened': new Date(new Date().setHours(0,0,0,0))})
    const i1 = this.props.inventory.inventoryItems.slice(0, idx)
    const i2 = this.props.inventory.inventoryItems.slice(idx + 1, this.props.inventory.inventoryItems.length+1);
    const inv = {...this.props.inventory, 'inventoryItems': i1.concat(i2).concat([temp])};
    fetch("https://pantry-mate-server.herokuapp.com/inventory/update", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uid: this.props.uid,
        data: inv
      })
    }).then(() => {
      fetch("https://pantry-mate-server.herokuapp.com/inventory/get", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uid: this.props.uid
        })
      }).then(response => response.json())
      .then(data => {
        this.props.getInventory(data);
        this.setState({newItem: {label: '', datePurchased: new Date(new Date().setHours(0,0,0,0))}})
      }).catch(error => this.props.getInventory({inventoryItems: []}))
    })
  }

  handleDeleteItem = (item) => {
    const idx = this.props.inventory.inventoryItems.findIndex(data => data === item)
    const invItems = [...this.props.inventory.inventoryItems.slice(0, idx), ...this.props.inventory.inventoryItems.slice(idx + 1)]
    fetch("https://pantry-mate-server.herokuapp.com/inventory/update", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uid: this.props.uid,
        data: {inventoryItems: invItems}
      })
    }).then(() => {
      fetch("https://pantry-mate-server.herokuapp.com/inventory/get", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uid: this.props.uid
        })
      }).then(response => response.json())
      .then(data => {
        this.props.getInventory(data);
        this.setState({newItem: {label: '', datePurchased: new Date(new Date().setHours(0,0,0,0))}})
      }).catch(error => this.props.getInventory({inventoryItems: []}))
    })
  }

  addItem = () => {
    fetch("https://pantry-mate-server.herokuapp.com/expiration/getexpirations", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: [this.state.newItem]
      })
    }).then(response => {
      return response.json()
    }).then(data => {
      const inv = update(this.props.inventory, {inventoryItems: {$push: data }})
      fetch("https://pantry-mate-server.herokuapp.com/inventory/update", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uid: this.props.uid,
          data: inv
        })
      }).then(() => {
        fetch("https://pantry-mate-server.herokuapp.com/inventory/get", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            uid: this.props.uid
          })
        }).then(response => response.json())
        .then(data => {
          this.props.getInventory(data);
          this.setState({newItem: {label: '', datePurchased: new Date(new Date().setHours(0,0,0,0))}})
        }).catch(error => this.props.getInventory({inventoryItems: []}))
      })
    })
  }

  handleAddItem = () => {
    if (this.state.newItem.label == '') {
      return;
    } else if (this.props.inventory.inventoryItems && this.props.inventory.inventoryItems.length > 0) {
      let hasAlerted = false;
      this.props.inventory.inventoryItems.forEach((item) => {
        if (levenshtein.get(item.label.toLowerCase(), this.state.newItem.label.toLowerCase()) <= 2) {
          hasAlerted = true;
          Alert.alert(
            'Item in stock',
            'It appears you might already have this item in your inventory. Please check and confirm you need more of this item.',
            [
              {text: 'Cancel Add Item', onPress: () => {}, style: 'cancel'},
              {text: 'Add Item', onPress: () => { this.addItem() }},
            ],
            { cancelable: false }
          )
        }
      })
      if (!hasAlerted) {
        this.addItem()
      }
    } else {
      this.addItem()
    }
  }

  handleNewItemChange = (text) => {
    this.setState({newItem: Object.assign({}, this.state.newItem, {label: text})})
  }

  handleNavigateItemNutrition = (item) => {
    this.props.navigation.navigate('ItemNutritionScreen', {item: item, screenSource: 'inventory'})
  }

  handleIndexChange = index => this.setState({ index });

  renderHeader = props => <TabBar getLabelText={this.handleLabelText} labelStyle={{fontSize: 13}} {...props} />;

  isExpiring = (item) => {
    if (item.expiration && (item.expiration.pantry[0] <= 3 || item.expiration.refrigerator[0] <= 3 || item.expiration.freezer[0] <= 3)) {
      return true;
    } else if (item.cooked_expiration && item.isCooked && (item.cooked_expiration.pantry[0] <= 3 || item.cooked_expiration.refrigerator[0] <= 3 || item.cooked_expiration.freezer[0] <= 3)) {
      return true;
    } else if (item.opened_expiration &&  item.isOpened && (item.opened_expiration.pantry[0] <= 3 || item.opened_expiration.refrigerator[0] <= 3 || item.opened_expiration.freezer[0] <= 3)) {
      return true;
    } else {
      return false;
    }
  }

  renderScene = ({ route }) => {
    switch (route.key) {
      case 'expiring':
        return this.props.inventory.inventoryItems && this.props.inventory.inventoryItems.filter(this.isExpiring).length ?
          <InventoryList inventoryItems={this.props.inventory.inventoryItems.filter(this.isExpiring)} onItemNutritionPress={this.handleNavigateItemNutrition} onCookItem={this.handleCookItem} onOpenItem={this.handleOpenItem} onDeleteItem={this.handleDeleteItem}/> :
          <View style={{flex: 1, padding: theme.gutters.wide * 3}}>
            <Text style={{color: '#7D8288', textAlign: 'center'}}>Congratulations! Nothing in your inventory is close to expiring.</Text>
          </View>;
      case 'all':
        return this.props.inventory.inventoryItems && this.props.inventory.inventoryItems.length ?
          <InventoryList inventoryItems={this.props.inventory.inventoryItems} onItemNutritionPress={this.handleNavigateItemNutrition} onCookItem={this.handleCookItem} onOpenItem={this.handleOpenItem} onDeleteItem={this.handleDeleteItem}/> :
          <View style={{flex: 1, padding: theme.gutters.wide * 3}}>
            <Text style={{color: '#7D8288', textAlign: 'center'}}>You have nothing in your inventory. Add items manually or with the barcode scanner above, or create new shopping lists to add items to your inventory automatically as you shop!</Text>
          </View>;
      case 'cooked':
        return this.props.inventory.inventoryItems && this.props.inventory.inventoryItems.filter(item => item.isCooked || item.isOpened).length ?
          <InventoryList inventoryItems={this.props.inventory.inventoryItems.filter(item => item.isCooked || item.isOpened)} onItemNutritionPress={this.handleNavigateItemNutrition} onCookItem={this.handleCookItem} onOpenItem={this.handleOpenItem} onDeleteItem={this.handleDeleteItem}/> :
          <View style={{flex: 1, padding: theme.gutters.wide * 3}}>
            <Text style={{color: '#7D8288', textAlign: 'center'}}>Swipe left along an item in your inventory and press cook/open to indicate item was cooked or opened but there are leftovers.</Text>
          </View>;
      default:
        return null;
    }
  }
  navigateScanner = () => {
      this.props.navigation.navigate('ScannerScreen');
  }
  handleRouting = (nav) => () => {
    this.props.navigation.navigate(nav);
  }
  render () {
    return (
      <View style={theme.screen.mainContainer}>
        <Header pageTitle='My Inventory' additionalIcon='barcode-scan' additionalIconOnPress={this.navigateScanner}/>

        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1551B3', paddingHorizontal: theme.gutters.wide}}>
            <TextInput
              style={formStyle}
              value={this.state.newItem.label}
              placeholder='New item'
              placeholderTextColor='#D6D4D7'
              onChangeText={(text) => this.handleNewItemChange(text)}
              onSubmitEditing={this.handleAddItem}
              spellCheck
              autoCorrect
            />

            <DatePicker
              style={{flex: 1}}
              date={this.state.newItem.datePurchased}
              mode="date"
              format="YYYY-MM-DD"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              onDateChange={(date) => {this.setState({newItem: Object.assign({}, this.state.newItem, {datePurchased: date})})}}
              placeholder='Date of purchase'
              iconComponent={
                <Icon.Button
                  name='plus-circle-outline'
                  size={18}
                  backgroundColor={theme.colors.opaque}
                  color={'#82A1D6'}
                  onPress={this.handleAddItem}
                />
              }
              customStyles={{
                dateInput: {
                  borderWidth: 0,
                  paddingHorizontal: theme.gutters.base
                },
                dateText: {
                  color: '#F4F6FC'
                }
              }}
            />
        </View>

        <TabViewAnimated
          navigationState={this.state}
          renderScene={this.renderScene}
          renderHeader={this.renderHeader}
          onIndexChange={this.handleIndexChange}
          initialLayout={{height: 0, width: theme.window.width}}
          swipeEnabled={false}
        />

        <Footer selected='inventory' onPress={this.handleRouting}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(InventoryScreen);


const formStyle = {
  flex: 1,
  fontSize: 14,
  paddingHorizontal: theme.gutters.wide * 2,
  paddingVertical: theme.gutters.base * 4,
  backgroundColor: '#1551B3',
  color: '#F4F6FC',
}
