import { StackNavigator } from 'react-navigation';
import LaunchScreen from '../Containers/LaunchScreen';
import ListsScreen from '../Containers/ListsScreen';
import HomeScreen from '../Containers/HomeScreen';
import InventoryScreen from '../Containers/InventoryScreen';
import NutritionScreen from '../Containers/NutritionScreen';
import NewListScreen from '../Containers/NewListScreen';
import ScannerScreen from '../Containers/ScannerScreen';
import ActiveListScreen from '../Containers/ActiveListScreen';
import ItemNutritionScreen from '../Containers/ItemNutritionScreen';
import RecentListScreen from '../Containers/RecentListScreen';
import AllActiveListsScreen from '../Containers/AllActiveListsScreen';
import AllRecentListsScreen from '../Containers/AllRecentListsScreen';
import styles from './Styles/NavigationStyles'

// Manifest of possible screens
const PrimaryNav = StackNavigator({
  LaunchScreen: { screen: LaunchScreen },
  ListsScreen: { screen: ListsScreen },
  HomeScreen: { screen: HomeScreen },
  InventoryScreen: { screen: InventoryScreen },
  NutritionScreen: { screen: NutritionScreen },
  NewListScreen: { screen: NewListScreen },
  ScannerScreen: { screen: ScannerScreen },
  ActiveListScreen: { screen: ActiveListScreen },
  RecentListScreen: { screen: RecentListScreen },
  ItemNutritionScreen: { screen: ItemNutritionScreen },
  AllActiveListsScreen: { screen: AllActiveListsScreen },
  AllRecentListsScreen: { screen: AllRecentListsScreen },
}, {
  // Default config for all screens
  headerMode: 'none',
  initialRouteName: 'LaunchScreen',
  navigationOptions: {
    headerStyle: styles.header
  },
  transitionConfig: () => ({
    transitionSpec: {
      duration: 0,
    }
  }),
})

export default PrimaryNav
