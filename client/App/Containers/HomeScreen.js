import React, { Component } from 'react';
import { View, Text, AsyncStorage } from 'react-native';
import { connect } from 'react-redux'
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import InventoryActions from '../Redux/InventoryRedux';
import theme from '../Themes/designer';


class HomeScreen extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    const user = AsyncStorage.getItem('user', (err, result) => {
      if (err) {
        this.props.navigation.navigate('LaunchScreen');
      } else {
        this.setState({user: JSON.parse(decodeURI(result))});
        fetch("https://pantry-mate-server.herokuapp.com/inventory/get", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            uid: this.props.uid
          })
        }).then(response => response.json())
        .then((data) => {
          fetch("https://pantry-mate-server.herokuapp.com/expiration/update", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              uid: this.props.uid,
              inv: data
            })
          }).then(response => response.json())
          .then(data2 => {
            this.props.getInventory(data2)
          })
        }).catch(error => this.props.getInventory({inventoryItems: []}))
      }
    });
  }

  handleRouting = (nav) => () => {
    this.props.navigation.navigate(nav);
  }
  render () {
    return (
      <View style={theme.screen.mainContainer}>

        <View style={{backgroundColor: '#1551B3', paddingTop: theme.gutters.baseMargin + theme.gutters.wide * 2, padding: theme.gutters.wide * 2}}>
          <Text style={{color: '#F9FAFB', fontSize: 20}}>Welcome {this.props.username}</Text>
        </View>

        {/* <View style={{padding: theme.gutters.base, backgroundColor: '#D6D4D7'}}>
          <Text>EXPIRING</Text>
        </View> */}
        <View style={{flex: 1, backgroundColor: '#F9FAFB'}}>

        </View>

        <Footer selected='home' onPress={this.handleRouting}/>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    username: state.auth.username,
    uid: state.auth.uid,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getInventory: (inventory) => dispatch(InventoryActions.getInventory(inventory))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
