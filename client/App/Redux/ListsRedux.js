import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getListsSuccess: ['lists']
})

export const ListsTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  lists: {}
})

/* ------------- Reducers ------------- */

export const success = (state, { lists }) =>
  state.merge({ lists: lists })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_LISTS_SUCCESS]: success,
})
