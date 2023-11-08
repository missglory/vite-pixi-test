import * as PIXI from 'pixi.js';
import * as Utils from './Utils';
import * as Render from './Render';
import { Viewport } from "pixi-viewport";
import * as Ruler from './Ruler';
import * as Overrides from './Overrides';
import * as Candles from './Candles';
import * as Orders from './Orders';

type DirType = "all" | 'x' | 'y';

export class Glue extends PIXI.Container {
	glues: PIXI.Container[] = [];
	lastRuler = false;
	defScale = new PIXI.Point(1, 1);
	defShift = new PIXI.Point(0, 0);
	yMap = new Map<number, Set<number>>;
	constructor(
		parent: PIXI.Container,
		events: PIXI.EventSystem,
		candlestickData: Candles.CandlestickData[]
	) {
		super();
		const viewports = new Array<DirType>("all", 'x', 'y').map((direction, i) => {
			const viewport = new Viewport({
				screenWidth: i !== 2 ? window.innerWidth : 200,
				screenHeight: i !== 1 ? window.innerHeight : 200,
				worldWidth: i !== 2 ? 1000 : 200,
				worldHeight: i !== 1 ? 1000 : 200,
				events: events,
			});
			viewport
				.drag()
				.pinch()
				.wheel()
				.decelerate()
			// this.glue.addChild(viewport);
			const newChild = new PIXI.Container();
			newChild.addChild(viewport);
			this.addChild(newChild);
			// viewport.zIndex = i;
			return viewport;
		});

		parent.addChild(this);
		const render = new Render.CandlestickRenderer(
			viewports.at(0)!,
		);
		const rulerH = new Ruler.Ruler(
			viewports[1],
			false,
			new PIXI.Point(199, 0),
			new PIXI.Point(0, 5),
			1.02,
			1.2,
			new PIXI.Point(2000, 200),
			25,
			new PIXI.Point(1, 0)
		);
		const ruler = new Ruler.Ruler(
			viewports[2],
			true,
			new PIXI.Point(0, 200),
			new PIXI.Point(4, 0),
			1.1,
			1.1,
			new PIXI.Point(200, 1200),
			25,
			new PIXI.Point(0, 1)
		);

		try {
			const minMaxData = Utils.calculateMinMax(candlestickData);
			console.log(minMaxData);
			console.log(candlestickData);
			rulerH.calculateRoundedPeriod(
				(minMaxData.get('openTime')!.min + minMaxData.get('closeTime')!.max
				) / 2,
				minMaxData.get('closeTime')!.max
			);
			ruler.calculateRoundedPeriod(
				minMaxData.get('low')!.min,
				minMaxData.get('high')!.max
			);
			console.log("Ratios:", rulerH.ratioConst(), ruler.ratioConst())
			const scale = new PIXI.Point(rulerH.ratioConst(), ruler.ratioConst());
			const shift = new PIXI.Point(minMaxData.get('openTime')!.min, minMaxData.get('low')!.min);
			render.renderCandlesticks(
				candlestickData,
				scale,
				shift
			);

		} catch (error) {
			console.error(error);
		}
	}

	async addOrders() {
		Orders.fetchOrders()
			.then((orders: Orders.Order[]) => {
				console.log('Fetched orders:', orders);
				render.renderOrders(orders, scale, shift);
				// You can work with the orders array in your frontend application.
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	}

};