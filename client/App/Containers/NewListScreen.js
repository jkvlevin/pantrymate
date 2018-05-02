import React, { Component } from 'react';
import { View, Text, TouchableHighlight, Alert } from 'react-native';
import { connect } from 'react-redux';
import levenshtein from 'fast-levenshtein';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ShoppingList from '../Components/ShoppingList';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import CircularButton from '../Components/CircularButton';

import theme from '../Themes/designer';

const today = new Date();
const date = parseInt(today.getMonth()+1) + "/" + today.getDate() + "/" + today.getFullYear();

class NewListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listData: {title: 'Groceries - ' + date, status: 'active', items: []},
      newItemValue: ''
    };
  }
  handleRouting = (nav) => () => {
    this.props.navigation.navigate(nav);
  }

  handleChangeListTitle = (text) => {
    const tList = this.state.listData;
    tList.title = text;
    this.setState({listData: tList});
  }
  handleChangeItemLabel = (text, index) => {
    const tList = this.state.listData;
    tList.items[index].label = text;
    this.setState({listData: tList});
  }
  handleChangeItemQuantity = (text, index) => {
    const tList = this.state.listData;
    tList.items[index].quantity = text;
    this.setState({listData: tList});
  }
  handleRemoveItem = (index) => {
    const tList = this.state.listData;
    tList.items.splice(index, 1);
    this.setState({listData: tList});
  }
  handleNewItemInputChange = (newItemValue) => {
    this.setState({newItemValue});
  }

  addItem = () => {
    const tList = this.state.listData;
    tList.items.push({
      label: this.state.newItemValue,
      quantity: '1',
      isSelected: false
    });
    this.setState({listData: tList, newItemValue: ''});
  }

  handleAddItem = () => {
    if (this.state.newItemValue === '') return;

    if (this.props.inventory.inventoryItems.length > 0) {
      let hasAlerted = false;
      this.props.inventory.inventoryItems.forEach((item) => {
        if (levenshtein.get(item.label.toLowerCase(), this.state.newItemValue.toLowerCase()) <= 2) {
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
      if (!hasAlerted) {this.addItem()}
    } else {
      this.addItem()
    }
  }

  handleDeleteList = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete your new shopping list?',
      [
        {text: 'Cancel', onPress: () => {}, style: 'cancel'},
        {text: 'OK', onPress: () => {this.props.navigation.navigate('ListsScreen')}},
      ],
      { cancelable: false }
    )
  }
  handleSaveSubmit = () => {
    fetch("https://pantry-mate-server.herokuapp.com/shoppinglist/createnew/", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        listData: this.state.listData,
        uid: this.props.uid
      })
    })
    .then(() => {
      this.props.navigation.navigate('ListsScreen');
    });
  }

  handleNavigateItemNutrition = (item) => {
    this.props.navigation.navigate('ItemNutritionScreen', {item: item, screenSource: 'lists'})
  }

  render () {
    return (
      <View style={theme.screen.mainContainer}>
        <Header pageTitle={'New List'} goBackButton handleGoBack={() => this.props.navigation.goBack()}/>

        <View style={containerStyle}>
          <ShoppingList
            list={this.state.listData}
            newItemValue={this.state.newItemValue}
            onChangeListTitle={this.handleChangeListTitle}
            onChangeItemLabel={this.handleChangeItemLabel}
            onChangeItemQuantity={this.handleChangeItemQuantity}
            onRemoveItem={this.handleRemoveItem}
            onNewInputChange={this.handleNewItemInputChange}
            onAddItem={this.handleAddItem}
            onSelectNutrition={this.handleNavigateItemNutrition}
            isNew
          />

          <View style={{paddingTop: theme.gutters.wide, paddingHorizontal: theme.gutters.wide, justifyContent: 'center', flexDirection: 'row', backgroundColor: '#F9FAFB', marginTop: -6, borderBottomRightRadius: 8, borderBottomLeftRadius: 8, paddingBottom: theme.gutters.wide}}>
            <CircularButton onPress={this.handleDeleteList} size={42} backgroundColor='#FC3D39' paddingHorizontal={theme.gutters.wide}>
              <Icon
                name="delete"
                size={24}
                color='#F9FAFB'
              />
            </CircularButton>
            <CircularButton onPress={this.handleSaveSubmit} size={42} backgroundColor='#3BE4A1' paddingHorizontal={theme.gutters.wide}>
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

const containerStyle = {
  flex: 1,
  padding: theme.gutters.wide,
  backgroundColor: '#1551B3'
};

const mapStateToProps = (state) => {
  return {
    uid: state.auth.uid,
    inventory: state.inventory.inventory
  }
}

export default connect(mapStateToProps)(NewListScreen);
