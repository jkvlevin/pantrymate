import React, { Component } from 'react';
import { View } from 'react-native';
import FooterButton from './FooterButton';
import theme from '../Themes/designer';

export default class Footer extends Component {
  render () {
    return (
      <View style={footerStyle}>
        {/* <FooterButton name="home" label="Home" isSelected={this.props.selected == 'home'} onPress={this.props.onPress('HomeScreen')} /> */}
        <FooterButton name="th" label="My Inventory" isSelected={this.props.selected == 'inventory'} onPress={this.props.onPress('InventoryScreen')} />
        <View style={{flex: 0.5}} />
        <FooterButton name="list-alt" label="Shopping Lists" isSelected={this.props.selected == 'lists'} onPress={this.props.onPress('ListsScreen')} />
        {/* <FooterButton name="bar-chart" label="Nutrition" isSelected={this.props.selected == 'nutrition'} onPress={this.props.onPress('NutritionScreen')} /> */}
      </View>
    );
  }
};

const footerStyle = {
  flex: 0.12,
  flexShrink: 0.12,
  flexGrow: 0.12,
  paddingHorizontal: theme.gutters.wide * 2,
  paddingVertical: theme.gutters.wide * 2,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#1551B3'
}
