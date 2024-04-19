import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { createMigrate, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import migrations from './migrations'
import { User } from './user.interface'

const persistConfig = {
	key: 'zola-user',
	storage,
	version: 1,
	migrate: createMigrate(migrations, { debug: false }),
}

export const userSlice = createSlice({
	name: 'user',
	initialState: new User(),
	reducers: {
		upsertUser: (state, action: PayloadAction<Partial<User>>) => {
			state = { ...state, ...action.payload }
			return state
		},
	},
})

export const persistedUserReducer = persistReducer(persistConfig, userSlice.reducer)

export const { upsertUser } = userSlice.actions
