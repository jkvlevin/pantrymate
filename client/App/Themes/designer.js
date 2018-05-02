import Metrics from './Metrics';
import {StyleSheet, Dimensions} from 'react-native';

const { width, height } = Dimensions.get('window')

const theme = {
  window: {
    width: width,
    height: height
  },
  gutters: {
    base: 4,
    wide: 12,
    baseMargin: Metrics.baseMargin,
    hairline: StyleSheet.hairlineWidth
  },
  colors: {
    foreground: '#FDFDFD',
    primary: '#51D4A2',
    backgroundLight: '#E8EBED',
    accentLight: '#636694',
    accentNeutral: '#E9E4D9',
    accentDark: '#26285B',
    text: '#262651',
    warning: '#EE4039',
    opaque: 'rgba(0,0,0,0)',
    borderDark: '#AEAFB1',
    borderLight: '#D5D7D9'
  },
  border: {
    radius: 8,
    width: 0.5,
  },
  typography: {
    h5: {
      fontSize: 20,
      fontFamily: 'Avenir-Book',
    },
    input: {
      fontSize: 18,
      fontFamily: 'Avenir-Book',
    },
    headerTitle: {
      fontSize: 18,
      fontFamily: 'Avenir-Book',
      color: '#262651',
      marginTop: 4
    }

  },
  screen: {
    mainContainer: {
      flex: 1,
      backgroundColor: '#F9FAFB'
    },
    backgroundImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    },
    container: {
      flex: 1,
      paddingTop: Metrics.baseMargin,
    },
    section: {
      margin: Metrics.section,
      padding: Metrics.baseMargin
    },
    card: {
      flex: 1,
      padding: 12,
      backgroundColor: '#FDFDFD',
      borderRadius: 12,
      borderWidth: StyleSheet.hairlineWidth,
      borderBottomColor: '#AEAFB1',
      borderTopColor: '#D5D7D9',
      borderLeftColor: '#D5D7D9',
      borderRightColor: '#D5D7D9',
    }
  }
};

export default theme;
