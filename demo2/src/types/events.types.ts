export interface IFunkhausEvent {
	id: number
	image_url: string
	endDate: string
	location: string
	name: string
	startDate: string
	theme: string
	ticketTypes: Array<{
		price: number
		count: number
	}>
}
