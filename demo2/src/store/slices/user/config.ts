import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { Moment } from 'moment'
import { createMigrate, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import migrations from './migrations'

type Config = {
	token: string | null
	validTill: number | null | Moment
	[key: string]: any
}

const persistConfig = {
	key: 'zola-config',
	storage,
	version: 1,
	migrate: createMigrate(migrations, { debug: false }),
}

export const configSlice = createSlice({
	name: 'config',
	initialState: {
		token: null as string | null,
		validTill: 0 as number | null | Moment,
	},
	reducers: {
		upsertConfig: (state, action: PayloadAction<Partial<Config>>) => {
			state = { ...state, ...action.payload }
			return state
		},
	},
})

export const persistedConfigReducer = persistReducer(persistConfig, configSlice.reducer)

export const { upsertConfig } = configSlice.actions
