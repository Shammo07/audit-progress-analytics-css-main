import AuthReducer from './reducers/authReducer'
import UserRightReducer from './reducers/userRightReducer'
import userNameReducer from './reducers/userNameReducer'
import companyNameReducer from './reducers/companyNameReducer'
import superAdminReducer from './reducers/superAdminReducer'
import logoReducer from './reducers/logoReducer'
import { configureStore } from '@reduxjs/toolkit'
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {combineReducers} from 'redux'

const rootReducer = combineReducers({
    authentication: AuthReducer,
    userRight : UserRightReducer,
    userName: userNameReducer,
    companyName : companyNameReducer,
    isSuperAdmin :superAdminReducer,
    logo:logoReducer,
    })

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const initialStore=() =>{
    return configureStore({
        reducer: persistedReducer,
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware({
              serializableCheck: {
                  ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
              },
          }),
    })
}
export const store = initialStore()

export const persistor=persistStore(store)

