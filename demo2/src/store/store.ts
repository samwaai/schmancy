import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { PersistPartial } from 'redux-persist/es/persistReducer'
import { Observable, Subject } from 'rxjs'
import { persistedConfigReducer } from './slices/user/config'
import { User } from './slices/user/user.interface'
import { persistedUserReducer } from './slices/user/user.slice'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const rootReducer = combineReducers({
	user: persistedUserReducer,
	config: persistedConfigReducer,
})

const persistConfig = {
	key: 'root',
	storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
	reducer: persistedReducer,
})
export type RootState = ReturnType<typeof store.getState>

export default store

export const $store = new Subject<RootState>()
export const $userStore = new Subject<User & PersistPartial>()

export const $persistor = new Observable(subscriber =>
	persistStore(store, null, () => {}).subscribe(() => subscriber.next()),
)

store.subscribe(() => {
	$store.next(store.getState())
})
