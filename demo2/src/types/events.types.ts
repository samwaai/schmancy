export interface IFunkhausEvent {
	id: string
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
