import React, { Component } from 'react';
import { View, Text, Button, TouchableHighlight, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import ListSelector from '../Components/ListSelector';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ListsActions from '../Redux/ListsRedux';
import theme from '../Themes/designer';


class ListsScreen extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    fetch("https://pantry-mate-server.herokuapp.com/shoppinglist/getlists/", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uid: this.props.uid
      })
    })
    .then(response => response.json())
    .then(data => this.props.getListsSuccess(data))
    .catch(error => this.props.getListsSuccess({}))
  }
  handleRouting = (nav) => () => {
    this.props.navigation.navigate(nav);
  }
  navigateNewList = () => {
    this.props.navigation.navigate('NewListScreen');
  }
  navigateToActiveList = (listId) => {
    this.props.navigation.navigate('ActiveListScreen', {listId: listId})
  }
  navigateToActiveLists = () => {
    this.props.navigation.navigate('AllActiveListsScreen');
  }
  navigateToRecentList = (listId) => {
    this.props.navigation.navigate('RecentListScreen', {listId: listId});
  }
  navigateToRecentLists = () => {
    this.props.navigation.navigate('AllRecentListsScreen');
  }
  render () {
    return (
      <View style={theme.screen.mainContainer}>
        <Header pageTitle='Shopping Lists' additionalIcon='note-plus' additionalIconOnPress={this.navigateNewList}/>

        <View style={{flex: 1, backgroundColor: '#1551B3', paddingBottom: theme.gutters.wide, justifyContent: 'space-between'}}>

          <View style={{flexGrow: 0.6, paddingHorizontal: theme.gutters.wide * 2}}>
            <View style={titleStyle}>
              <Text style={{fontSize: 16, color: '#C5D8EF'}}>Active Lists</Text>
              <TouchableHighlight onPress={this.navigateToActiveLists} underlayColor={theme.colors.opaque}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{fontSize: 14, color: '#C5D8EF'}}>See all</Text>
                  <Icon
                    name='chevron-right'
                    size={18}
                    backgroundColor={theme.colors.opaque}
                    color={'#C5D8EF'}
                  />
                </View>
              </TouchableHighlight>
            </View>

            <View style={sectionStyle}>
              <ScrollView style={{flex: 0.8, overflow: 'scroll'}}>
                {this.props.lists && Object.values(this.props.lists).filter(list => list.status == 'active').map((list, index) => {
                  return (
                    <ListSelector
                      key={index}
                      listTitle={list.title}
                      listId={list.id}
                      listSize={list.items ? list.items.length : 0}
                      onNavigateToList={this.navigateToActiveList}
                    />
                  )
                })}

                {this.props.lists && !Object.values(this.props.lists).filter(list => list.status == 'active').length &&
                  <View style={{alignItems: 'center', paddingTop: theme.gutters.wide}}>
                    <Text style={{color: '#7D8288'}}>You have no active lists.</Text>
                  </View>
                }
              </ScrollView>
              <View style={{flex: 0.2, shadowColor: '#F9FAFB', shadowOffset: { width: 0, height: -5 }, shadowOpacity: 1}}>
                <Button
                  title='Create New Shopping List'
                  onPress={this.navigateNewList}
                />
              </View>
            </View>
          </View>

          <View style={{flexGrow: 0.35, paddingHorizontal: theme.gutters.wide * 2}}>
            <View style={titleStyle}>
              <Text style={{fontSize: 16, color: '#C5D8EF'}}>Recent Lists</Text>

              <TouchableHighlight onPress={this.navigateToRecentLists} underlayColor={theme.colors.opaque}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{fontSize: 14, color: '#C5D8EF'}}>See all</Text>
                  <Icon
                    name='chevron-right'
                    size={18}
                    backgroundColor={theme.colors.opaque}
                    color={'#C5D8EF'}
                  />
                </View>
              </TouchableHighlight>
            </View>

            <View style={sectionStyle}>
              <ScrollView style={{flex: 1, overflow: 'scroll'}}>
                {this.props.lists && Object.values(this.props.lists).filter(list => list.status == 'recent').map((list, index) => {
                  return (
                    <ListSelector
                      key={index}
                      listTitle={list.title}
                      listId={list.id}
                      listSize={list.items.length}
                      onNavigateToList={this.navigateToRecentList}
                    />
                  )
                })}

                {this.props.lists && !Object.values(this.props.lists).filter(list => list.status == 'recent').length &&
                  <View style={{alignItems: 'center', paddingTop: theme.gutters.wide}}>
                    <Text style={{color: '#7D8288'}}>You have no recent lists.</Text>
                  </View>
                }
              </ScrollView>
            </View>
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
    lists: state.lists.lists
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getListsSuccess: (lists) => dispatch(ListsActions.getListsSuccess(lists))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListsScreen);



const titleStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingVertical: theme.gutters.wide,
}

const sectionStyle = {
  flex: 1,
  backgroundColor: '#F9FAFB',
  borderRadius: theme.gutters.hairline,
  borderColor: '#7D8288',
  borderRadius: theme.gutters.base * 2,
  padding: theme.gutters.wide,
  overflow: 'hidden'
}
