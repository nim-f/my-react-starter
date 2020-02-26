import {
  all,
  put,
  takeEvery,
  call,
  select,
} from 'redux-saga/effects'
import { push } from 'connected-react-router'
import cookie from 'react-cookies'
import { api, appName, BASE_URL } from '../config'
import {generateActions} from '../helpers/actions';

export const moduleName = 'login'
const prefix = `${appName}/${moduleName}`

const loginUrl = `${BASE_URL}/login`
const refreshUrl = `${BASE_URL}/token/refresh`

export const LOGIN = generateActions(prefix, 'LOGIN')
export const REFRESH = generateActions(prefix, 'REFRESH')
export const FIXTURES_LOADED = 'FIXTURES_LOADED'
export const LOGOUT = generateActions(prefix, 'LOGOUT')
export const GET_CURRENT_USER = generateActions(prefix, 'GET_CURRENT_USER')

/**
 * Action Creators
 * */

export const loginAction = (email, password) => ({
  type: LOGIN.REQUEST,
  payload: {email, password}
})
export const logOutAction = () => ({
  type: LOGOUT.REQUEST,
})

export const currentUserAction = () => ({
  type: GET_CURRENT_USER.REQUEST,
})

export const fixturesLoaded = () => ({
  type: FIXTURES_LOADED,
})

export const refreshTokenAction = () => ({
  type: REFRESH.REQUEST,

})

/**
 * Reducer
 * */

const defaultState = {
  token: cookie.load('access') || null,
  refresh_token: cookie.load('refresh_token') || null,
  user: null,
  errors: null,
  loading: false,
  fixtures: false
}

export default function reducer(state = defaultState, action) {
  const { type, payload } = action
  switch (type) {
    case FIXTURES_LOADED:
      return {...state, fixtures: true}
    case GET_CURRENT_USER.REQUEST:
    case REFRESH.REQUEST:
    case LOGIN.REQUEST:
      return { ...state, loading: true }
    case GET_CURRENT_USER.SUCCESS:
    case LOGIN.SUCCESS:
    case REFRESH.SUCCESS:
      const { token, refresh_token } = payload
      return { ...state, loading: false, token, refresh_token }
    case GET_CURRENT_USER.ERROR:
    case REFRESH.ERROR:
    case LOGIN.ERROR:
      return { ...state, loading: false, errors: payload }
    default:
      return state
    case LOGOUT.REQUEST:
      return {...defaultState, token: null }
  }
}
/**
 * Selectors
 * */

export const tokenSelector = (state) => state[moduleName].token
export const loadingSelector = (state) => state[moduleName].loading
export const errorsSelector = (state) => state[moduleName].errors
export const userSelector = (state) => state[moduleName].user
export const refreshSelector = (state) => state[moduleName].refresh_token
export const
  fixturesSelector = (state) => state[moduleName].fixtures

/**
 * Requests
 * */
export const logInRequest = (email, password) => {
  return api.post(
    loginUrl,
    {
      email,
      password
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}

const getFixtures = () =>
  api.get('/only-test/load-fixtures')

const refreshRequest = (refresh_token) =>
  api.post(
    refreshUrl,
    {refresh_token},
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    )
/**
 * Saga
 * */
export function* loginSaga({ payload }) {
  try {
    const login = yield call(logInRequest, payload.email, payload.password)
    console.log({login})
    cookie.save('access', login.data.token, { path: '/' })
    cookie.save('refresh_token', login.data.refresh_token, { path: '/' })
    yield put({
      type: LOGIN.SUCCESS,
      payload: login.data
    })
    yield put(push('/'))
  } catch (err) {
    console.log({err: err.response.data})
    const {code, message} =  err.response.data
    const fixt = yield select(fixturesSelector)
    if (code === 401 && message === 'Invalid credentials.' && !fixt) {
      try {
        yield call(getFixtures)
        yield put(fixturesLoaded())
        yield put(loginAction(payload.email, payload.password))
      } catch (err) {
        // const {code, message} =  err.response.data

        yield put({
          type: LOGIN.ERROR,
          payload: {code, message}
        })
      }
    } else if (code === 401 && message === 'Expired JWT Token') {
      yield put(refreshTokenAction())
    } else {
      yield put({
        type: LOGIN.ERROR,
        payload: {code, message}
      })
    }
  }
}


export function* logoutSaga() {
  try {
    yield cookie.remove('access', { path: '/' })
    yield put(push('/login'))
  } catch (err) {
    console.error(err)
  }
}

export function* refreshSaga() {
  try {
    const refresh = yield select(refreshSelector)
    const token = yield call(refreshRequest, refresh)

    console.log({token})
    yield put({
      type: REFRESH.SUCCESS,
      payload: token.data
    })

  } catch (err) {
    yield put(logOutAction())
  }
}

export function* saga() {
  yield all([
    takeEvery(LOGIN.REQUEST, loginSaga),
    takeEvery(LOGOUT.REQUEST, logoutSaga),
    takeEvery(REFRESH.REQUEST, refreshSaga),
  ])
}
