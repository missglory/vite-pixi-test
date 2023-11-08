
export interface Order {
	time: Date;
	manual_id: string;
	agent: string;
	exchange: string;
	pair: string;
	price: number;
	amount: number;
	fill_time: Date | null;
	cancel_time: Date | null;
	tv_label: string;
}

export async function fetchOrders(): Promise<Order[]> {
	try {
		// const response = await fetch('http://194.91.221.88:5001'); // Adjust the URL to match your server endpoint.
		const response = await fetch('http://localhost:5000'); // Adjust the URL to match your server endpoint.
		if (!response.ok) {
			throw new Error('Failed to fetch orders');
		}
		const orders = await response.json();

		// Map the fetched data to the desired structure (assuming the server returns an array of orders).
		const structuredOrders: Order[] = orders.map((order: any) => ({
			time: new Date(order.time),
			manual_id: order.manual_id,
			agent: order.agent,
			exchange: order.exchange,
			pair: order.pair,
			price: order.price,
			amount: order.amount,
			fill_time: order.fill_time ? new Date(order.fill_time) : null,
			cancel_time: order.cancel_time ? new Date(order.cancel_time) : null,
			tv_label: order.tv_label,
		}));

		return structuredOrders;
	} catch (error) {
		console.error('Error fetching data:', error);
		throw error;
	}
}