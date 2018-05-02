import React, { Component } from 'react';
import { View, Text, Button, TouchableHighlight, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import ListSelector from '../Components/ListSelector';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ListsActions from '../Redux/ListsRedux';
import theme from '../Themes/designer';


class AllActiveListsScreen extends Component {
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
  navigateToActiveList = (listId) => {
    this.props.navigation.navigate('ActiveListScreen', {listId: listId})
  }
  render () {
    return (
      <View style={theme.screen.mainContainer}>
        <Header pageTitle='Active Lists' goBackButton handleGoBack={() => this.props.navigation.goBack()}/>

        <View style={{flex: 1, backgroundColor: '#1551B3', paddingTop: 20, justifyContent: 'space-between'}}>

          <View style={{flexGrow: 1}}>


            <View style={sectionStyle}>
              <ScrollView style={{flex: 0.8, overflow: 'scroll'}}>
                {this.props.lists && Object.values(this.props.lists).filter(list => list.status == 'active').map((list, index) => {
                  return (
                    <ListSelector
                      key={index}
                      listTitle={list.title}
                      listId={list.id}
                      listSize={list.items.length}
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

export default connect(mapStateToProps, mapDispatchToProps)(AllActiveListsScreen);



const titleStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingVertical: theme.gutters.wide,
}

const sectionStyle = {
  flex: 1,
  backgroundColor: '#F9FAFB',
  borderColor: '#7D8288',
  padding: theme.gutters.wide,
  overflow: 'scroll'
}
