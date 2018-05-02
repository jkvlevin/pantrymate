// Auth code adapted from https://rationalappdev.com/logging-into-react-native-apps-with-facebook-or-google/

import React, { Component } from 'react';
import { Image, Button, Linking, StyleSheet, Platform, Text, View, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import SafariView from 'react-native-safari-view';
import AuthActions from '../Redux/AuthRedux';

class LaunchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined
    };
  }

  componentWillMount() {
    const user = AsyncStorage.getItem('user', (err, result) => {
      if (result) {
        this.props.authSuccess(JSON.parse(decodeURI(result)).name, JSON.parse(decodeURI(result)).id);
        this.props.navigation.navigate('InventoryScreen')
      }
    });
  }

  componentDidMount() {
    Linking.addEventListener('url', this.handleOpenURL);
    Linking.getInitialURL().then((url) => {
      if (url) {
        this.handleOpenURL({ url });
      }
    });
  };

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURL);
  };

  handleOpenURL = ({ url }) => {
    const [, user_string] = url.match(/user=([^#]+)/);
    if (Platform.OS === 'ios') {
      SafariView.dismiss();
    }

    this.props.authSuccess(JSON.parse(decodeURI(user_string)).name, JSON.parse(decodeURI(user_string)).id);

    AsyncStorage.setItem('user', user_string, (err, result) => {
      if (err) {
        alert('Error loging in, please try again.')
      } else {
        this.props.navigation.navigate('InventoryScreen');
      }
    });
  };

  // Handle Login with Facebook button tap
  loginWithFacebook = () => this.openURL('https://pantry-mate-server.herokuapp.com/login/facebook');

  // Handle Login with Google button tap
  loginWithGoogle = () => this.openURL('https://pantry-mate-server.herokuapp.com/login/google');

  // Open URL in a browser
  openURL = (url) => {
    // Use SafariView on iOS
    if (Platform.OS === 'ios') {
      SafariView.show({
        url: url,
        fromBottom: true,
      });
    }
    // Or Linking.openURL on Android
    else {
      Linking.openURL(url);
    }
  };

  navigateHome = () => {
    this.props.navigation.navigate('HomeScreen');
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={{flex: 0.8, paddingTop: '40%', alignItems: 'center'}}>
          <Image
            style={{height: 168, width: 168}}
            source={require('./logo.png')}
          />
          <View style={{paddingTop: 60, alignItems: 'center'}}>
            <Text style={{fontSize: 24, color: '#f9fafb'}}>Welcome to Pantrymate</Text>
            <Text style={{fontSize: 16, color: '#f9fafb', paddingTop: 12}}>Please login to continue</Text>
          </View>
        </View>


        <View style={styles.buttons}>
          <Icon.Button
            name="facebook"
            backgroundColor="#3b5998"
            onPress={this.loginWithFacebook}
            {...iconStyles}
          >
            Login with Facebook
          </Icon.Button>
          <Icon.Button
            name="google"
            backgroundColor="#DD4B39"
            onPress={this.loginWithGoogle}
            {...iconStyles}
          >
            Or with Google
          </Icon.Button>
        </View>
      </View>
    );
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    authSuccess: (username, uid) => dispatch(AuthActions.authSuccess(username, uid))
  }
}

export default connect(null, mapDispatchToProps)(LaunchScreen)

const iconStyles = {
  borderRadius: 10,
  iconStyle: { paddingVertical: 5 },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1551B3',
  },
  buttons: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    margin: 20,
    marginBottom: 30,
  },
});
