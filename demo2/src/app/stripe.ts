import { SchmancyTheme } from '@schmancy/index'
import { Appearance, Stripe, StripeElements, loadStripe } from '@stripe/stripe-js'
import { BehaviorSubject, Subject, from, map, switchMap, tap } from 'rxjs'

export const PUBLISHABLE_KEY =
	'pk_test_51Om1siKOjLfImK4iEp0wiaXHqcAqid0BI1mxZKe7TO1IRQaeg0tQk56W31lBW8hn2VTAfNADLaRCjDbuX2eeYIMo00QaWMYRtj'

let stripe: Stripe = (await loadStripe(PUBLISHABLE_KEY, {
	locale: 'auto',
})) as Stripe
export const $stripeElements = new BehaviorSubject<StripeElements | undefined>(undefined)
export const $stripe = new Subject<number>()

export function stripeIntent(amount: number) {
	return from(
		fetch(
			import.meta.env.DEV
				? 'http://localhost:8888/api/stripe'
				: 'https://funkhausevents.netlify.app/.netlify/functions/stripe',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ amount }),
			},
		),
	).pipe(
		tap(res => console.log(res)),
		switchMap(res => res.json()),
		map((body: { clientSecret: string }) => body),
	)
}

export function appearance(): Appearance | undefined {
	return {
		theme: 'flat',
		variables: {
			fontFamily: getComputedStyle(document.documentElement).getPropertyValue('--schmancy-font-family'),
			colorPrimary: getComputedStyle(document.documentElement).getPropertyValue(
				SchmancyTheme.sys.color.primary.default.slice(4, -1),
			),
			colorBackground: getComputedStyle(document.documentElement).getPropertyValue(
				SchmancyTheme.sys.color.surface.highest.slice(4, -1),
			),
			borderRadius: '8px',
			blockLogoColor: getComputedStyle(document.documentElement).getPropertyValue(
				SchmancyTheme.sys.color.primary.default.slice(4, -1),
			),
			colorText: getComputedStyle(document.documentElement).getPropertyValue(
				SchmancyTheme.sys.color.primary.default.slice(4, -1),
			),
		},
	}
}
export default stripe
