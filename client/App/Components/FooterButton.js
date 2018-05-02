import React, { Component } from 'react';
import { View, TouchableHighlight, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import theme from '../Themes/designer';

export default class FooterButton extends Component {
  render () {
    return (
        <TouchableHighlight onPress={this.props.onPress} underlayColor={theme.colors.opaque}>
          <View style={{alignItems: 'center'}}>
            <Icon
              name={this.props.name}
              size={20}
              color={this.props.isSelected ? '#3BE4A1' : '#F4F6FC'}
            />
            <Text style={{fontSize: 12, color:this.props.isSelected ? '#3BE4A1' : '#F4F6FC'}}>
              {this.props.label}
            </Text>
          </View>
        </TouchableHighlight>
    );
  }
};
