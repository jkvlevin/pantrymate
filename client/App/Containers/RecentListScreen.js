import React, { Component } from 'react';
import { View, Text, TouchableHighlight, Alert } from 'react-native';
import { connect } from 'react-redux';
import update from 'immutability-helper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {RecentList} from '../Components/ShoppingList';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import CircularButton from '../Components/CircularButton';

import theme from '../Themes/designer';


class RecentListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listData: {title: '', items: []},
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
  handleDeleteList = () => {
    Alert.alert(
      'Confirm Delete',
      'Do you want to delete Pantrymate\'s record of this list?',
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
  handleReactivateList = () => {
    Alert.alert(
      'Confirm Reactivate List',
      'Reactivating this list will allow you to reuse it for future grocery shopping.',
      [
        {text: 'Cancel', onPress: () => {}, style: 'cancel'},
        {text: 'OK', onPress: () => {
          const items = this.state.listData.items.map(item => {
            return {...item, 'isSelected': false}
          })
          const list = Object.assign({}, this.state.listData, {status: 'active', items: items});
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
        <Header pageTitle={'Recent List'} goBackButton handleGoBack={() => this.props.navigation.goBack()}/>

        <View style={{flex: 1, padding: theme.gutters.wide, backgroundColor: '#1551B3'}}>
          <RecentList
            list={this.state.listData}
            onSelectNutrition={this.handleNavigateItemNutrition}
          />

          <View style={{paddingTop: theme.gutters.wide, paddingHorizontal: theme.gutters.wide, justifyContent: 'center', flexDirection: 'row', marginTop: -6, backgroundColor: '#F9FAFB', borderBottomRightRadius: 8, borderBottomLeftRadius: 8, paddingBottom: theme.gutters.wide}}>
            <CircularButton onPress={this.handleDeleteList} size={42} backgroundColor='#FC3D39' paddingHorizontal={theme.gutters.wide}>
              <Icon
                name="delete"
                size={24}
                color='#F9FAFB'
              />
            </CircularButton>
            <CircularButton onPress={this.handleReactivateList} size={42} backgroundColor='#3BE4A1' paddingHorizontal={theme.gutters.wide}>
              <Icon
                name="cached"
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
  }
}

export default connect(mapStateToProps, null)(RecentListScreen);
