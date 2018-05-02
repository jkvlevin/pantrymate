import React, { Component } from 'react';
import { ScrollView, StyleSheet, Button, View, TouchableHighlight, TextInput, Text, CheckBox } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import RadioButton from './RadioButton';
import theme from '../Themes/designer';

const ListItem = ({
  item,
  index,
  handleChangeItemLabel,
  handleChangeItemQuantity,
  handleRemoveItem,
  handleSelectItem,
  onSelectNutrition,
  isNew
}) => {
  return (
    <View style={itemRowStyle}>
      {isNew ?
        <Icon.Button
          name='close'
          size={14}
          backgroundColor={theme.colors.opaque}
          color={'#FC3D39'}
          onPress={(index) => handleRemoveItem(index)}
        /> :
        <RadioButton
          size={12}
          animation={'bounceIn'}
          isSelected={item.isSelected}
          onPress={handleSelectItem(index)}
        />}

      <TextInput
        style={itemInputStyle}
        onChangeText={(text) => handleChangeItemLabel(text, index)}
        value={item.label}
      />

      <Text style={{fontSize: 12, color: '#82A1D6'}}>Qty</Text>
      <TextInput
        style={quantityInputStyle}
        value={item.quantity}
        onChangeText={(text) => handleChangeItemQuantity(text, index)}
        keyboardType='numeric'
      />

      <TouchableHighlight onPress={() => onSelectNutrition(item.label)} underlayColor={theme.colors.opaque}>
        <View style={{flexDirection: 'row'}}>
          <Text style={{color: '#82A1D6', fontSize: 12}}>Nutrition</Text>
          <Icon
            name={'chevron-right'}
            size={14}
            color={'#82A1D6'}
          />
        </View>
      </TouchableHighlight>
    </View>
  )
};

export class RecentList extends Component {
  render () {
    return (
      <View style={{backgroundColor: '#F9FAFB', borderRadius: theme.gutters.base * 2, padding: theme.gutters.wide, flex: 1}}>
        <Text style={titleStyle}>{this.props.list.title}</Text>
        <View style={listStyle}>
          <ScrollView>
            {this.props.list.items && this.props.list.items.map((item, index) => {
              return (
                <View style={itemRowStyle} key={index}>
                  <RadioButton
                    size={12}
                    animation={'bounceIn'}
                    isSelected={item.isSelected}
                  />

                  <Text style={itemInputStyle}>{item.label}</Text>
                  <Text style={{fontSize: 12, color: '#82A1D6'}}>Qty</Text>
                  <Text style={quantityInputStyle}>{item.quantity}</Text>
                  <TouchableHighlight onPress={() => this.props.onSelectNutrition(item.label)} underlayColor={theme.colors.opaque}>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{color: '#82A1D6', fontSize: 12}}>Nutrition</Text>
                      <Icon
                        name={'chevron-right'}
                        size={14}
                        color={'#82A1D6'}
                      />
                    </View>
                  </TouchableHighlight>
                </View>)
              })}
          </ScrollView>
        </View>
      </View>
    )
  }
}

export default class ShoppingList extends Component {
  onAddItemPress = () => {
    this._addInput.focus();
  }
  render () {
    return (
        <View style={{backgroundColor: '#F9FAFB', borderRadius: theme.gutters.base * 2, padding: theme.gutters.wide, flex: 1}}>
          <TextInput style={titleStyle}
            value={this.props.list.title}
            onChangeText={(text) => this.props.onChangeListTitle(text)}
          />
            {/* <Icon.Button
              name='rename-box'
              size={14}
              onPress={this.onChangeTitle}
              backgroundColor={theme.colors.opaque}
              color={'#82A1D6'}
            /> */}
          <View style={listStyle}>
            <ScrollView>
              {this.props.list.items && this.props.list.items.map((item, index) => {
                return (
                  <ListItem
                    key={index}
                    index={index}
                    item={item}
                    handleChangeItemLabel={this.props.onChangeItemLabel}
                    handleChangeItemQuantity={this.props.onChangeItemQuantity}
                    handleRemoveItem={this.props.onRemoveItem}
                    handleSelectItem={this.props.onSelectItem}
                    isNew={this.props.isNew}
                    onSelectNutrition={this.props.onSelectNutrition}
                  />
                )
              })}
            </ScrollView>
          </View>

          <TouchableHighlight underlayColor={theme.colors.foreground} onPress={this.onAddItemPress} style={{flexGrow: 1}}>
            <View style={addItemStyle}>
              <Icon
                name={'plus'}
                color={'#55C08E'}
                size={22}
              />
              <TextInput
                ref={x => this._addInput = x}
                placeholder='New Item'
                style={{flex: 1, paddingLeft: theme.gutters.wide, fontSize: 16, color: '#454545'}}
                value={this.props.newItemValue}
                onChangeText={(text) => this.props.onNewInputChange(text)}
                onEndEditing={this.props.onAddItem}
                spellCheck
                autoCorrect
              />
            </View>
          </TouchableHighlight>

        </View>
    );
  }
};

const itemRowStyle = {
  borderBottomWidth: StyleSheet.hairlineWidth,
  borderBottomColor: theme.border.color,
  padding: theme.gutters.base,
  paddingLeft: theme.gutters.base * 2,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const itemInputStyle = {
  fontSize: 16,
  flex: 1,
  color: '#454545',
  paddingLeft: theme.gutters.base * 2
}

const quantityInputStyle = {
  fontSize: 14,
  color: '#454545',
  paddingLeft: theme.gutters.base * 2,
  flex: 0.3,
}

const addItemStyle = {
  paddingTop: theme.gutters.base,
  paddingLeft: theme.gutters.wide,
  borderTopWidth: StyleSheet.hairlineWidth,
  flexDirection: 'row',
}

const titleStyle = {
  paddingLeft: theme.gutters.base,
  paddingTop: theme.gutters.base,
  fontSize: 18,
  color: '#1551B3',
};

const listStyle = {
  flexShrink: 1,
  paddingTop: theme.gutters.wide,
}
