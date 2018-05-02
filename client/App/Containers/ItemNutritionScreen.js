import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import theme from '../Themes/designer';

export default class ItemNutritionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemNutrition: {vitamins_minerals: {'301':null, '303':null, '320':null, '328':null, '401':null, '431':null}}
    }
  }
  componentWillMount() {
    fetch("https://pantry-mate-server.herokuapp.com/nutrition/getitem", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        item: this.props.navigation.state.params.item
      })
    }).then(response => response.json())
    .then(data => {
      this.setState({itemNutrition: data})
    }).catch(error => this.setState({itemNutrition: null}))
  }
  handleRouting = (nav) => () => {
    this.props.navigation.navigate(nav);
  }
  render () {
    return (
      <View style={theme.screen.mainContainer}>
        <Header pageTitle='' goBackButton handleGoBack={() => this.props.navigation.goBack()}/>

        <View style={{flex: 1, backgroundColor: '#1551B3', alignItems: 'center'}}>
          <View style={{flex: 0.2}}>
            <Text style={{color: '#F9FAFB', fontSize: 24}}>
              {this.state.itemNutrition.name && this.state.itemNutrition.name}
            </Text>
          </View>

          <Image source={{uri: this.state.itemNutrition.image}} style={{width: 150, height: 150, borderRadius: 75, borderColor: '#D6D4D7', borderWidth: theme.gutters.hairline, position: 'absolute', zIndex: 10, top: 50, backgroundColor: '#D6D4D7'}}/>

          {this.state.itemNutrition ?
            <View style={{flex: 0.75, flexDirection: 'row', justifyContent: 'center', paddingHorizontal: theme.gutters.wide * 2}}>

              <View style={{flex: 1, backgroundColor: '#F9FAFB', borderRadius: theme.gutters.wide * 2, borderColor: '#D6D4D7', borderWidth: theme.gutters.hairline, paddingTop: 110, paddingHorizontal: theme.gutters.wide * 2, justifyContent: 'space-between'}}>

                <View style={{flex: 0.1, alignItems: 'center'}}>
                  <Text style={{color: '#82A1D6', fontSize: 16, fontWeight: '600'}}>{this.state.itemNutrition.serving} serving</Text>
                </View>

                <View style={{flex: 0.2, flexDirection: 'row', justifyContent: 'space-between'}}>
                  <View style={{flexDirection: 'column', alignItems: 'center'}}>
                    <Text style={{color: '#1551B3'}}>Calories</Text>
                    <Text>{this.state.itemNutrition.calories}</Text>
                  </View>
                  <View style={{flexDirection: 'column', alignItems: 'center'}}>
                    <Text style={{color: '#1551B3'}}>Carbohydrates</Text>
                    <Text>{this.state.itemNutrition.total_carbs}g</Text>
                  </View>
                  <View style={{flexDirection: 'column', alignItems: 'center'}}>
                    <Text style={{color: '#1551B3'}}>Protein</Text>
                    <Text>{this.state.itemNutrition.protein}g</Text>
                  </View>
                </View>

                <View style={{flex: 0.6, flexDirection: 'row', justifyContent: 'space-between'}}>
                  <View>
                    <Text style={{fontSize: 13}}>Saturated fat: {this.state.itemNutrition.sat_fat}g</Text>
                    <Text style={{fontSize: 13, paddingTop: theme.gutters.base}}>Trans fat {this.state.itemNutrition.vitamins_minerals['605'] ? this.state.itemNutrition.vitamins_minerals['605'].toFixed(2) : 0}g</Text>
                    <Text style={{fontSize: 13, paddingTop: theme.gutters.base}}>Cholesterol: {this.state.itemNutrition.cholersterol ? this.state.itemNutrition.cholersterol.toFixed(2) : 0}mg</Text>
                    <Text style={{fontSize: 13, paddingTop: theme.gutters.base}}>Sodium: {this.state.itemNutrition.sodium ? this.state.itemNutrition.sodium.toFixed(2) : 0}mg</Text>
                    <Text style={{fontSize: 13, paddingTop: theme.gutters.base}}>Sugar: {this.state.itemNutrition.sugar ? this.state.itemNutrition.sugar.toFixed(2) : 0}g</Text>
                    <Text style={{fontSize: 13, paddingTop: theme.gutters.base}}>Dietary Fiber: {this.state.itemNutrition.fiber ? this.state.itemNutrition.fiber.toFixed(2) : 0}g</Text>
                  </View>

                  <View>
                    <Text style={{fontSize: 13}}>Potassium: {this.state.itemNutrition.potassium ? (this.state.itemNutrition.potassium/35).toFixed(2) : 0}%</Text>
                    <Text style={{fontSize: 13, paddingTop: theme.gutters.base}}>Calcium: {this.state.itemNutrition.vitamins_minerals['301'] ? (this.state.itemNutrition.vitamins_minerals['301']/10).toFixed(2) : 0}%</Text>
                    <Text style={{fontSize: 13, paddingTop: theme.gutters.base}}>Iron: {this.state.itemNutrition.vitamins_minerals['303'] ? (this.state.itemNutrition.vitamins_minerals['303']/.15).toFixed(2) : 0}%</Text>
                    <Text style={{fontSize: 13, paddingTop: theme.gutters.base}}>Vitamin A: {this.state.itemNutrition.vitamins_minerals['320'] ? (this.state.itemNutrition.vitamins_minerals['320']/6).toFixed(2) : 0}%</Text>
                    <Text style={{fontSize: 13, paddingTop: theme.gutters.base}}>Vitamin C: {this.state.itemNutrition.vitamins_minerals['401'] ? (this.state.itemNutrition.vitamins_minerals['401']/.75).toFixed(2) : 0}%</Text>
                    <Text style={{fontSize: 13, paddingTop: theme.gutters.base}}>Vitamin D: {this.state.itemNutrition.vitamins_minerals['328'] ? (this.state.itemNutrition.vitamins_minerals['328']/.05).toFixed(2) : 0}%</Text>
                  </View>
                </View>

              </View>
            </View> : <Text>NOTHING TO SHOW</Text>}
        </View>

        <Footer selected={this.props.navigation.state.params.screenSource} onPress={this.handleRouting}/>
      </View>
    )
  }
}
