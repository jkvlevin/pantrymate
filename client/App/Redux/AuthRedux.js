import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  authSuccess: ['username', 'uid']
})

export const AuthTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  username: null,
  uid: null
})

/* ------------- Reducers ------------- */

// we've successfully logged in
export const success = (state, { username, uid }) =>
  state.merge({ username, uid })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.AUTH_SUCCESS]: success,
})
