import React, { Component } from 'react';
import { View, TouchableHighlight, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Swipeout from 'react-native-swipeout';
import theme from '../Themes/designer';

const DeleteIcon = () => {
  return (
    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      <Icon
        name="delete"
        size={22}
        color="#F9FAFB"
      />
      <Text style={{color: '#F9FAFB'}}>Delete</Text>
    </View>
  )
}
const CookIcon = () => {
  return (
    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      <Icon
        name="stove"
        size={22}
        color="#F9FAFB"
      />
      <Text style={{color: '#F9FAFB'}}>Cook</Text>
    </View>
  )
}
const OpenIcon = () => {
  return (
    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      <Icon
        name="cookie"
        size={22}
        color="#F9FAFB"
      />
      <Text style={{color: '#F9FAFB'}}>Open</Text>
    </View>
  )
}

class ExpirationDisplay extends Component {
  render() {
    return (
      <View style={{flexDirection: 'column', paddingLeft: theme.gutters.base * 2}}>
        {!this.props.expiration.pantry && !this.props.expiration.refrigerator && !this.props.expiration.freezer &&
          <Text style={{fontSize: 10}}>Data unavailable</Text>
        }
        {this.props.expiration.refrigerator != "" &&
          <View style={{flexDirection: 'row'}}>
            <Icon
              name={'fridge-filled'}
              size={16}
              color={'#1551B3'}
            />
            {this.props.expiration.refrigerator[0] > 7 ? <Text style={safe}>{this.props.expiration.refrigerator[1]}</Text> :
              this.props.expiration.refrigerator[0] > 3 ? <Text style={close}>{this.props.expiration.refrigerator[1]}</Text> :
              <Text style={expiring}>{this.props.expiration.refrigerator[1]}</Text>
            }
          </View>
        }
        {this.props.expiration.pantry != "" &&
          <View style={{flexDirection: 'row'}}>
            <Icon2
              name={'space-bar'}
              size={16}
              color={'#1551B3'}
            />
            {this.props.expiration.pantry[0] > 7 ? <Text style={safe}>{this.props.expiration.pantry[1]}</Text> :
              this.props.expiration.pantry[0] > 3 ? <Text style={close}>{this.props.expiration.pantry[1]}</Text> :
              <Text style={expiring}>{this.props.expiration.pantry[1]}</Text>
            }
          </View>
        }
        {this.props.expiration.freezer != "" &&
          <View style={{flexDirection: 'row'}}>
            <Icon
              name={'snowflake'}
              size={16}
              color={'#1551B3'}
            />
            {this.props.expiration.freezer[0] > 7 ? <Text style={safe}>{this.props.expiration.freezer[1]}</Text> :
              this.props.expiration.freezer[0] > 3 ? <Text style={close}>{this.props.expiration.freezer[1]}</Text> :
              <Text style={expiring}>{this.props.expiration.freezer[1]}</Text>
            }
          </View>
        }
      </View>
    )
  }
}

export default class InventoryItem extends Component {
  render () {
    return (
      <Swipeout autoClose right={this.props.openedExpiration && this.props.cookedExpiration && !this.props.isCooked && !this.props.isOpened ?
        [
          {
            component: <OpenIcon />,
            onPress: this.props.onOpenItem
          },
          {
            component: <CookIcon />,
            backgroundColor: '#F4912B',
            onPress: this.props.onCookItem
          },
          {
            component: <DeleteIcon />,
            backgroundColor: '#FC3D39',
            onPress: this.props.onDeleteItem
          }
        ] : this.props.cookedExpiration && !this.props.isCooked ?
        [
          {
            component: <CookIcon />,
            backgroundColor: '#F4912B',
            onPress: this.props.onCookItem
          },
          {
            component: <DeleteIcon />,
            backgroundColor: '#FC3D39',
            onPress: this.props.onDeleteItem
          }
        ] : this.props.openedExpiration && !this.props.isOpened && !this.props.isCooked ?
        [
          {
            component: <OpenIcon />,
            onPress: this.props.onOpenItem
          },
          {
            component: <DeleteIcon />,
            backgroundColor: '#FC3D39',
            onPress: this.props.onDeleteItem
          }
        ] :
        [
          {
            component: <DeleteIcon />,
            backgroundColor: '#FC3D39',
            onPress: this.props.onDeleteItem
          }
        ]
      }>
      <View style={itemContainerStyle}>

        <View style={{flex: 0.6, flexDirection: 'row'}}>
          <Text style={{fontSize: 14, color: '#454545'}}>
            {this.props.label.toUpperCase()}
          </Text>
        </View>

        <View style={{flex:1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={infoTitleStyle}>Exp:</Text>
            <ExpirationDisplay expiration={this.props.isCooked ? this.props.cookedExpiration : this.props.isOpened ? this.props.openedExpiration : this.props.expiration} date={this.props.date} />
          </View>

          <TouchableHighlight onPress={() => this.props.onItemNutritionPress(this.props.label)} underlayColor={theme.colors.opaque}>
            <View style={{flexDirection: 'row'}}>
              <Text style={infoTitleStyle}>Nutrition</Text>
              <Icon
                name={'chevron-right'}
                size={16}
                color={'#82A1D6'}
              />
            </View>
          </TouchableHighlight>
        </View>

      </View>
    </Swipeout>
    );
  }
};

const itemContainerStyle = {
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: theme.gutters.wide,
  paddingHorizontal: theme.gutters.wide * 2,
  backgroundColor: '#F9FAFB',
  flexDirection: 'row',
  borderBottomColor: '#C5D8EF',
  borderBottomWidth: theme.gutters.hairline,
  minHeight: 50
}

const infoTitleStyle = {
  color: '#82A1D6',
  fontSize: 13
}

const infoStyle = {
  color: '#454545'
}

const close = {
  fontSize: 13, color: '#F4912B', paddingLeft: theme.gutters.base
}
const safe = {
  fontSize: 13, color: '#454545', paddingLeft: theme.gutters.base
}
const expiring = {
  fontSize: 13, color: '#FC3D39', paddingLeft: theme.gutters.base
}
