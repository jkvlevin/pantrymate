import React, { Component } from 'react';
import { View, Text, TouchableHighlight, Alert } from 'react-native';
import { connect } from 'react-redux';
import levenshtein from 'fast-levenshtein';
import update from 'immutability-helper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ShoppingList from '../Components/ShoppingList';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import CircularButton from '../Components/CircularButton';

import theme from '../Themes/designer';


class ActiveListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listData: {title: '', items: []},
      newItemValue: '',
      hasChangedList: false
    };
  }
  componentWillMount() {
    const list = Object.assign({}, this.props.lists[this.props.navigation.state.params.listId]);
    update(list, {items: {}})
    this.setState({listData: list});
  }
  handleRouting = (nav) => () => {
    if (this.state.hasChangedList) {
      Alert.alert(
        'Save changes?',
        'Do you want to save any changes you have made to this active shopping list?',
        [
          {text: 'Discard', onPress: () => {this.props.navigation.navigate(nav)}, style: 'cancel'},
          {text: 'Save', onPress: () => {
            fetch("https://pantry-mate-server.herokuapp.com/shoppinglist/update/", {
              method: "POST",
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                listId: this.state.listData.id,
                uid: this.props.uid,
                data: this.state.listData
              })
            })
            .then(() => {
              this.props.navigation.navigate(nav);
            });
          }},
        ],
        { cancelable: false }
      )
    } else {
      this.props.navigation.navigate(nav);
    }
  }
  handleGoBack = () => {
    if (this.state.hasChangedList) {
      Alert.alert(
        'Save changes?',
        'Do you want to save any changes you have made to this active shopping list?',
        [
          {text: 'Discard', onPress: () => {this.props.navigation.navigate('ListsScreen')}, style: 'cancel'},
          {text: 'Save', onPress: () => {
            fetch("https://pantry-mate-server.herokuapp.com/shoppinglist/update/", {
              method: "POST",
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                listId: this.state.listData.id,
                uid: this.props.uid,
                data: this.state.listData
              })
            })
            .then(() => {
              this.props.navigation.goBack();
            });
          }},
        ],
        { cancelable: false }
      )
    } else {
      this.props.navigation.goBack();
    }
  }

  handleChangeItemLabel = (text, index) => {
    this.setState({listData:
      update(this.state.listData, {items: {[index]: {label: {$set: text} } } } )
    })
  }
  handleChangeItemQuantity = (text, index) => {
    this.setState({listData:
      update(this.state.listData, {items: {[index]: {quantity: {$set: text} } } } )
    })
  }
  handleNewItemInputChange = (newItemValue) => {
    this.setState({newItemValue});
  }
  handleChangeListTitle = (text) => {
    this.setState({listData: {...this.state.listData, 'title': text}})
  }
  handleAddItem = () => {
    if (this.state.newItemValue === '') return;
    const newItem = {
      label: this.state.newItemValue,
      quantity: '1',
      isSelected: true
    };
    if (this.state.listData.items) {
      this.setState({
        listData: update(this.state.listData, {items: {$push: [newItem]} }),
        newItemValue: '',
        hasChangedList: true
      })
    } else {
      this.setState({
        listData: {...this.state.listData, 'items': [newItem]},
        newItemValue: '',
        hasChangedList: true
      })
    }
  }
  handleSelectItem = (index) => () => {
    if (this.props.inventory.inventoryItems && this.props.inventory.inventoryItems.length > 0) {
      let hasAlerted = false;
      this.props.inventory.inventoryItems.forEach(item => {
        if (levenshtein.get(item.label.toLowerCase(), this.state.listData.items[index].label.toLowerCase()) <= 2) {
          hasAlerted = true;
          Alert.alert(
            'Confirm Purchase Item',
            'It appears you might already have this item in your inventory. Please check and confirm you need more of this item before purchasing more.',
            [
              {text: 'Cancel Selection', onPress: () => {}, style: 'cancel'},
              {text: 'Confirm Selection', onPress: () => {
                this.setState({listData:
                  update(this.state.listData, {items: {[index]: {isSelected: {$set: !this.state.listData.items[index].isSelected} } } } )
                });
              }}
            ],
            { cancelable: false }
          )
        }
      })
      if (!hasAlerted) {
        this.setState({listData:
          update(this.state.listData, {items: {[index]: {isSelected: {$set: !this.state.listData.items[index].isSelected} } } } )
        });
      }
    } else {
      this.setState({listData:
        update(this.state.listData, {items: {[index]: {isSelected: {$set: !this.state.listData.items[index].isSelected} } } } )
      });
    }
  }

  handleDeleteList = () => {
    Alert.alert(
      'Confirm Delete',
      'If you delete an active list Pantrymate will assume you did not purchase any of the items on the list. Are you sure you want to delete this shopping list?',
      [
        {text: 'Cancel', onPress: () => {}, style: 'cancel'},
        {text: 'OK', onPress: () => {
          fetch("https://pantry-mate-server.herokuapp.com/shoppinglist/delete/", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              listId: this.state.listData.id,
              uid: this.props.uid
            })
          })
          .then(() => {
            this.props.navigation.navigate('ListsScreen');
          });
        }},
      ],
      { cancelable: false }
    )
  }

  handleAddToInventory = () => {
    Alert.alert(
      'Confirm Submit List to Inventory',
      'Upon submition, all selected items in your list will be added to your inventory. Please confirm that only the items you have purchased are selected. For best application performance, add any unlisted items through the manual interface or barcode scanning.',
      [
        {text: 'Cancel', onPress: () => {}, style: 'cancel'},
        {text: 'OK', onPress: () => {
          const datedItems = this.state.listData.items.filter(item => item.isSelected).map(item => {
            return Object.assign({}, item, {'datePurchased': new Date(new Date().setHours(0,0,0,0))})
          })

          datedItems.length && fetch("https://pantry-mate-server.herokuapp.com/expiration/getexpirations", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              data: datedItems
            })
          }).then(response => {
            return response.json()
          }).then(data => {
            const inv = Object.assign({}, this.props.inventory, {inventoryItems: update(this.props.inventory.inventoryItems, {$push: data})})
            fetch("https://pantry-mate-server.herokuapp.com/inventory/update", {
              method: "POST",
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                uid: this.props.uid,
                data: inv
              })
            }).then(response => {
              const list = Object.assign({}, this.state.listData, {status: 'recent'});
              fetch("https://pantry-mate-server.herokuapp.com/shoppinglist/update", {
                method: "POST",
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  uid: this.props.uid,
                  listId: this.props.navigation.state.params.listId,
                  data: list
                })
              }).then(response => this.props.navigation.navigate('ListsScreen'))
            })
          })
        }},
      ],
      { cancelable: false }
    )
  }

  handleNavigateItemNutrition = (item) => {
    this.props.navigation.navigate('ItemNutritionScreen', {item: item, screenSource: 'lists'})
  }

  render () {
    return (
      <View style={theme.screen.mainContainer}>
        <Header pageTitle={'Active List'} goBackButton handleGoBack={this.handleGoBack}/>

        <View style={containerStyle}>
          <ShoppingList
            list={this.state.listData}
            newItemValue={this.state.newItemValue}
            onChangeItemLabel={this.handleChangeItemLabel}
            onChangeItemQuantity={this.handleChangeItemQuantity}
            onChangeListTitle={this.handleChangeListTitle}
            onNewInputChange={this.handleNewItemInputChange}
            onAddItem={this.handleAddItem}
            onSelectItem={this.handleSelectItem}
            onSelectNutrition={this.handleNavigateItemNutrition}
          />

          <View style={{paddingTop: theme.gutters.wide, paddingHorizontal: theme.gutters.wide, justifyContent: 'center', flexDirection: 'row'}}>
            <CircularButton onPress={this.handleDeleteList} size={42} backgroundColor='#FC3D39' paddingHorizontal={theme.gutters.wide}>
              <Icon
                name="delete"
                size={24}
                color='#F9FAFB'
              />
            </CircularButton>
            <CircularButton onPress={this.handleAddToInventory} size={42} backgroundColor='#3BE4A1' paddingHorizontal={theme.gutters.wide}>
              <Icon
                name="check"
                size={24}
                color='#F9FAFB'
              />
            </CircularButton>
            {/* <CircularButton onPress={this.handleShowAnalytics} size={42} backgroundColor='#7180AC' paddingHorizontal={theme.gutters.wide}>
              <Icon
                name="chart-pie"
                size={24}
                color='#F9FAFB'
              />
            </CircularButton> */}
          </View>
        </View>

        <Footer selected='lists' onPress={this.handleRouting}/>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    uid: state.auth.uid,
    lists: state.lists.lists,
    inventory: state.inventory.inventory
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getListsSuccess: (lists) => dispatch(ListsActions.getListsSuccess(lists))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActiveListScreen);

const containerStyle = {
  flex: 1,
  padding: theme.gutters.wide,
  backgroundColor: '#1551B3'
};
