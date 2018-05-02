import { combineReducers } from 'redux'
import configureStore from './CreateStore'

/* ------------- Assemble The Reducers ------------- */
export const reducers = combineReducers({
  nav: require('./NavigationRedux').reducer,
  auth: require('./AuthRedux').reducer,
  lists: require('./ListsRedux').reducer,
  inventory: require('./InventoryRedux').reducer
})

export default () => {
  let { store } = configureStore(reducers)

  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('./').reducers
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
