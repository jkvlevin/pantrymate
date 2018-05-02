import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getInventory: ['inventory'],
  updateInventory: ['inventory']
})

export const ListsTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  inventory: {}
})

/* ------------- Reducers ------------- */

export const get = (state, { inventory }) =>
  state.merge({ inventory: inventory })

export const update = (state, { inventory }) =>
  state.merge({ inventory: inventory })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_INVENTORY]: get,
  [Types.UPDATE_INVENTORY]: update
})
