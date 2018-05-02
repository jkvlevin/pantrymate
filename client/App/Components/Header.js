import React, { Component } from 'react';
import { ScrollView, Button, View, Text, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import theme from '../Themes/designer';


export default class Header extends Component {
  render () {
    return (

      <View>
        <View style={headerStyle}>

          <View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
            {this.props.goBackButton ?
              <TouchableHighlight onPress={this.props.handleGoBack} underlayColor={theme.colors.opaque}>
                <View  style={{paddingTop: 8, flexDirection: 'row', alignItems: 'center'}}>
                  <Icon
                    name={"chevron-left"}
                    backgroundColor={theme.colors.opaque}
                    color={'#F4F6FC'}
                    size={24}
                    onPress={this.props.handleGoBack}
                  />
                  <Text style={{fontSize: 16, color: '#F4F6FC', textAlign: 'center', paddingLeft: theme.gutters.base}}>
                    {this.props.pageTitle}
                  </Text>
                </View>
              </TouchableHighlight>  :

              <Text style={{fontSize: 16, color: '#F4F6FC', textAlign: 'center', paddingLeft: theme.gutters.base}}>
                {this.props.pageTitle}
              </Text>
            }
          </View>

          <View flexDirection='row'>
            {/* <Icon.Button
              name={"account"}
              backgroundColor={theme.colors.opaque}
              color={'#F4F6FC'}
              size={20}
            /> */}

            {this.props.additionalIcon &&
              <Icon.Button
                onPress={this.props.additionalIconOnPress}
                name={this.props.additionalIcon}
                backgroundColor={theme.colors.opaque}
                color={'#3BE4A1'}
                size={24}
              />
            }
          </View>
        </View>

      </View>
    );
  }
};

const headerStyle = {
  display: 'flex',
  backgroundColor: '#1551B3',
  paddingTop: theme.gutters.baseMargin + theme.gutters.wide * 2,
  paddingHorizontal: theme.gutters.wide,
  flexDirection: 'row',
  justifyContent: 'space-between'
}
