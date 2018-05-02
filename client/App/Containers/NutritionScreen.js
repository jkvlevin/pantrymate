import React, { Component } from 'react';
import {
  Text,
  View,
  Button
} from 'react-native';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import theme from '../Themes/designer';


export default class NutritionScreen extends Component {
  constructor(props) {
    super(props);
  }
  handleRouting = (nav) => () => {
    this.props.navigation.navigate(nav);
  }
  render () {
    return (
      <View style={theme.screen.mainContainer}>
        <Header pageTitle='My Nutrition' />


        <View style={{flex: 1, backgroundColor: '#1551B3'}}>
        </View>


        <Footer selected='nutrition' onPress={this.handleRouting}/>
      </View>
    )
  }
}
