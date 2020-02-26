import { createStore, applyMiddleware, compose } from "redux";
import logger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import reducer from './reducer'
import rootSaga from './saga'
import { createBrowserHistory, createMemoryHistory } from 'history'
import { routerMiddleware } from 'connected-react-router'
const sagaMiddleware = createSagaMiddleware({
  onError: (e) => {
    console.log('saga error')
    console.error('saga error', e)
    // store.dispatch({ type: 'SET_ERROR_STATE' })
  }
})

export const history = createBrowserHistory()

export default () => {
  // Create the store
  const enhancer =
    process.env.NODE_ENV === 'test'
      ? applyMiddleware(sagaMiddleware, routerMiddleware(history))
      : applyMiddleware(sagaMiddleware, routerMiddleware(history), logger)

  const store = createStore(reducer(history), enhancer)
  sagaMiddleware.run(rootSaga)

  return {
    store,
    history,
  }
}
