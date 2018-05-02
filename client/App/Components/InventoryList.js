import React, { Component } from 'react';
import { View, TouchableHighlight, Text, ScrollView } from 'react-native';
import InventoryItem from './InventoryItem';
import theme from '../Themes/designer';

export default class InventoryList extends Component {
  render () {
    return (
      <View style={{flex: 1}}>
        <ScrollView>
          {this.props.inventoryItems.map((item, idx) => {
            return(
              <InventoryItem
                key={idx}
                label={item.label}
                expiration={item.expiration ? item.expiration : {pantry: "", refrigerator: "", freezer: ""}}
                cookedExpiration={item.cooked_expiration}
                openedExpiration={item.opened_expiration}
                quantity={item.quantity}
                onItemNutritionPress={this.props.onItemNutritionPress}
                onDeleteItem={() => this.props.onDeleteItem(item)}
                onCookItem={() => this.props.onCookItem(idx)}
                onOpenItem={() => this.props.onOpenItem(idx)}
                isCooked={item.isCooked}
                isOpened={item.isOpened}
              />
            )
          })}
        </ScrollView>
      </View>
    );
  }
};
