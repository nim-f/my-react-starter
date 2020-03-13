import React from 'react';
import Logo from './images/logo.png'
import { ConnectedRouter } from 'connected-react-router'
import { Provider } from 'react-redux'
import createStore from './reduxConfig'

const { store, history } = createStore()

export default function App() {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <div><img src={Logo} alt="logo" /></div>
      </ConnectedRouter>
    </Provider>
  );
}
