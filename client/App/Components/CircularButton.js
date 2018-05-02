import React, { Component } from 'react';
import { View, TouchableHighlight } from 'react-native';
import theme from '../Themes/designer';


export default class CircularButton extends Component {
  render () {
    return (
      <TouchableHighlight onPress={this.props.onPress} underlayColor={theme.colors.opaque} style={{paddingHorizontal: this.props.paddingHorizontal}}>
        <View style={{backgroundColor: this.props.backgroundColor, height: this.props.size, width: this.props.size, borderRadius: this.props.size, alignItems: 'center', justifyContent: 'center'}}>
          {this.props.children}
        </View>
      </TouchableHighlight>
    )
  }
}
