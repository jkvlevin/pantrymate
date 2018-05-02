import React, { Component } from 'react';
import { View, TouchableHighlight, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import theme from '../Themes/designer';

export default class ListSelector extends Component {
  navigateToList = () => {
    this.props.onNavigateToList(this.props.listId);
  }
  render () {
    return (
      <TouchableHighlight onPress={this.navigateToList} underlayColor={theme.colors.opaque} style={{paddingBottom: theme.gutters.wide}}>
        <View style={{backgroundColor: '#C5D8EF', borderRadius: theme.gutters.wide, padding: theme.gutters.base * 2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <Text style={{fontSize: 14, color: '#6073eb', flex: 0.8}}>{this.props.listTitle}</Text>
          <Text style={{fontSize: 14, color: '#6073eb'}}>{this.props.listSize} items</Text>
          <Icon
            name='chevron-right'
            backgroundColor={theme.colors.opaque}
            color='#6073eb'
            size={14}
          />
        </View>
      </TouchableHighlight>
    );
  }
};
