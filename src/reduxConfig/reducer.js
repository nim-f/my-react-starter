import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import loginReducer, { moduleName as loginModule } from '../ducks/login'

export default history =>
  combineReducers({
    router: connectRouter(history),
    [loginModule]: loginReducer,
  })
