import supabase from '@db/supabase'
import moment from 'moment'
import { from, of, retry, tap } from 'rxjs'
import { upsertConfig } from 'src/store/slices/user/config'
import store from 'src/store/store'

export default function () {
	const config = store.getState().config
	console.log(moment(config.validTill).isBefore(moment()))
	if (!(config.token || !config.validTill) || moment(config.validTill).isBefore(moment())) {
		return from(
			supabase.functions.invoke('tuya/token', {
				method: 'GET',
			}),
		).pipe(
			retry(3),
			tap(res => {
				store.dispatch(
					upsertConfig({
						token: res.data.token,
						validTill: moment().add(res.data.validTill, 'seconds'),
					}),
				)
				return res
			}),
		)
	}
	return of(store.getState().config)
}
