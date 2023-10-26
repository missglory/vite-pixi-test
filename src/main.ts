import * as PIXI from 'pixi.js';
import * as Candles from './Candles';
import * as Utils from './Utils';
import * as Render from './Render';
import * as Sequelize from "sequelize";
import { Buffer } from 'buffer';
import Process from 'process';
import { Viewport } from "pixi-viewport";
globalThis.process = Process;
globalThis.Buffer = Buffer;
import { Pool, QueryConfig, QueryResult } from 'pg';

const app = new PIXI.Application({
  // background: '#000', 
  backgroundColor: 0x000,
  resizeTo: window
});

document.body.appendChild(app.view);

const viewport = new Viewport({
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight,
  worldWidth: 1000,
  worldHeight: 1000,
  events: app.renderer.events
  // interaction: app.renderer.events
});

viewport.drag().pinch().wheel().decelerate();

app.stage.addChild(viewport);


class Ruler extends PIXI.Sprite {
  initOffset = new PIXI.Point(0, 0);
  endOffset = new PIXI.Point(0, 0);
  vertical = true;
  levels: number[] = [];
  period = 0.1;
  startValue = 0.01;
  endValue = 0.01;
  fontSize = 26;
  offset = new PIXI.Point(0, 0);
  selectedChildren = new PIXI.Point(-1, -1);
  microshift = new PIXI.Point(0, 0);
  shiftMask = new PIXI.Point(0, 0);
  start = 0;
  end = 0;
  constructor(
    parent,
    onDragStart,
    onDragEnd,
    vertical = true,
    offset: PIXI.Point = new PIXI.Point(0, 0),
    initOffset: PIXI.Point = new PIXI.Point(0, 0),
    startValue = 0.01,
    period = 0.1,
    endOffset = new PIXI.Point(0, 0),
    fontSize = 26,
    shiftMask = new PIXI.Point(1, 1),
  ) {
    super();

    this.cursor = 'pointer';
    this.eventMode = 'static';
    this.on('pointerdown', onDragStart, this);
    this.on('pointerup', onDragEnd);
    // this.on('pointerleave', onDragEnd);
    parent.addChild(this);
    this.initOffset = initOffset.clone();
    this.endOffset = endOffset.clone();
    this.offset = offset.clone();
    this.vertical = vertical;
    this.y = initOffset.y;
    this.x = initOffset.x;
    this.fontSize = fontSize;
    this.startValue = startValue;
    this.endValue = startValue;
    this.period = period;
    this.shiftMask = shiftMask;

    this.fill();
  }

  toLocal(...params: any[]) {
    params[0].x *= this.shiftMask.x;
    params[0].y *= this.shiftMask.y;
    this.parent.toLocal(...params);
    this.fill();
  }

  fill() {
    while (this.children.length === 0) { this.addToEdge(); }
    let last = this.children.at(-1) ?? null;
    if (last === null) { return; }
    while ((this.vertical && last.y + this.y < this.endOffset.y - this.offset.y)
      || (!this.vertical && last.x + this.x < this.endOffset.x - this.offset.x)
    ) {
      this.addToEdge();
      last = this.children.at(-1) ?? null;
      if (last === null) { return; }
    }

    while ((this.vertical && last.y + this.y > this.endOffset.y)
      || (!this.vertical && last.x + this.x > this.endOffset.x)
    ) {
      this.remove(-1);
      last = this.children.at(-1) ?? null;
      if (last === null) { return; }
    }

    last = this.children.at(0)!;
    while ((this.vertical && last.y + this.y > this.offset.y)
      || (!this.vertical && last.x + this.x > this.offset.x)
    ) {
      this.addToEdge(false);
      last = this.children.at(0) ?? null;
      if (last === null) { return; }
    }

    while ((this.vertical && last.y + this.y < 0)
      || (!this.vertical && last.x + this.x < 0)
    ) {
      this.remove(0);
      last = this.children.at(0) ?? null;
      if (last === null) { return; }
    }
  }

  calculateRoundedPeriod(start: number, end: number): number {
    if (start >= end) {
      throw new Error("Start must be less than end");
    }
    this.removeChildren();
    this.levels = [];
    this.startValue = start;
    this.start = start;
    this.end = end;

    console.log("realign ", start, end);
    const rangeLength = end - start;
    // const roundedLength = Math.pow(10, Math.floor(Math.log10(rangeLength)));
    // const period = Math.ceil(rangeLength / roundedLength) * roundedLength;
    // console.log("New period: ", period);

    this.period = rangeLength / 4;
    this.fill();
    return this.period;
  }

  ratioConst(): number {
    const c0 = this.children.at(0)!;
    const c1 = this.children.at(1)!;
    const x0 = this.vertical ? c0.y : c0.x;
    const x1 = this.vertical ? c1.y : c1.x;
    const l0 = this.levels.at(0)!;
    return (x1 - x0) / (this.levels.at(1)! - l0);
  }

  ratio(n: number): number {
    const l0 = this.levels.at(0)!;
    return (n - l0) * this.ratioConst();
  }

  makeLabel(newLevel: number) {
    return this.vertical ? (newLevel).toFixed(3) : Utils.timestampToUtcString(Math.trunc(newLevel));
  }

  addToEdge(tail = true) {
    // const text = this.children.length > 0 ? this.children.at(-1).x this.x.toFixed(3);
    // super.addChild(new PIXI.Text())
    if (this.levels.length > 0) {
      // if (this.vertical) {
      const newLevel = tail ?
        this.levels.at(-1)! + this.period :
        this.levels.at(0)! - this.period;
      this.addLevel(newLevel, tail);
    } else {
      this.addLevel(this.startValue);
    }
  }

  addLevel(newLevel: number, tail = true) {
    console.log("New level: ", newLevel);
    const text = this.makeLabel(newLevel);
    const newChild = new PIXI.Text(text, new PIXI.TextStyle({ fontFamily: 'JetBrains Mono', fontSize: this.fontSize, fill: this.vertical ? "#83ffff" : "#ffff83" }));
    newChild.scale.set(0.5);
    if (this.children.length > 0) {
      newChild.x = tail ? this.children.at(-1)!.x + this.offset.x : this.children.at(0)!.x - this.offset.x;
      newChild.y = tail ? this.children.at(-1)!.y + this.offset.y : this.children.at(0)!.y - this.offset.y;
      console.log("set offset" + newChild.x + " " + newChild.y + " " + this.vertical);
    } else {
      newChild.x = this.initOffset.x;
      newChild.y = this.initOffset.y;
    }
    if (tail) {
      this.addChild(newChild);
      this.levels.push(newLevel);
    } else {
      this.addChildAt(newChild, 0);
      this.levels.unshift(newLevel);
    }
  }


  remove(ind = 0) {
    // const last = this.children.at(ind)!;
    while (ind < 0) { ind += this.children.length; }
    this.levels.splice(ind, 1);
    super.removeChildAt(ind);
  }

  private calculateXPosition(value: number): number {
    const totalRange = this.end - this.start;
    const normalizedValue = (value - this.start) / totalRange;
    return normalizedValue * this.width;
  }

  private findInsertIndex(newValue: number): number {
    for (let i = 0; i < this.levels.length; i++) {
      const levelValue = Number(this.levels[i]);
      if (newValue >= levelValue) {
        return i;
      }
    }
    return this.levels.length;
  }
};


// Load them google fonts before starting...
window.WebFontConfig = {
  google: {
    families: ['JetBrains Mono'],
  },
  active() {
    init();
  },
};

(function () {
  const wf = document.createElement('script');
  wf.src = `${document.location.protocol === 'https:' ? 'https' : 'http'
    }://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js`;
  wf.type = 'text/javascript';
  wf.async = 'true';
  const s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(wf, s);
}());

let lastPos = new PIXI.Point();

async function init() {
  let dragTarget: PIXI.Sprite[] = [];
  app.stage.eventMode = 'static';
  app.stage.hitArea = app.screen;
  app.stage.on('pointerup', onDragEndRuler);
  app.stage.on('pointerupoutside', onDragEndRuler);

  function onDragMove(event) {
    dragTarget.forEach(d => {
      if (d.parent instanceof PIXI.Container) {
        d.toLocal(new PIXI.Point(
          event.global.x - d.microshift.x,
          event.global.y - d.microshift.y
        ),
          d.parent, d.position
        );
      }
      console.log(d.microshift.x, d.microshift.y)
      console.log(d);
    });
  }

  function onDragStart(event) {
    this.alpha = 0.5;
    dragTarget = this.parent.children;
    dragTarget.forEach(t => {
      t.microshift.x = event.global.x - t.x;
      t.microshift.y = event.global.y - t.y;
    });
    this.microshift.x = event.global.x - this.x;
    this.microshift.y = event.global.y - this.y;
    app.stage.on('pointermove', onDragMove);
    // console.log("onDragStart");
    // console.log(this);
    lastPos = new PIXI.Point(event.global.x, event.global.y);

    for (let i = 0; i < this.children.length; i++) {
      const c = this.children[i];
      if (
        i == this.children.length - 1 ||
        c.x < event.global.x - this.x &&
        this.children[i + 1].x > event.global.x - this.x
      ) {
        this.selectedChildren.y = i;
        c.alpha = 0.5;
        break;
      }
    }

    for (let i = 0; i < this.children.length; i++) {
      const c = this.children[i];
      if (
        i == this.children.length - 1 ||
        this.children[i].x < event.global.x - this.x &&
        this.children[i + 1].x > event.global.x - this.x
      ) {
        this.selectedChildren.y = i;
        c.alpha = 0.5;
        break;
      }
    }
  }

  function onDragEndRuler() {
    this.alpha = 1;
    if (dragTarget) {
      app.stage.off('pointermove', onDragMove);
      dragTarget.forEach(d => { d.alpha = 1; });
      dragTarget = [];
      lastPos = new PIXI.Point();
    }
  }

  function onDragEnd(event) {
    this.alpha = 1;
    if (dragTarget) {
      app.stage.off('pointermove', onDragMove);
      dragTarget.forEach(d => {
        d.alpha = 1;
        d.microshift.x = event.global.x;
        d.microshift.y = event.global.y;
      });
      dragTarget = [];
      lastPos = new PIXI.Point();
    }
  }

  const ruler = new Ruler(
    viewport,
    onDragStart,
    onDragEndRuler,
    false,
    new PIXI.Point(200, 0),
    new PIXI.Point(0, 5),
    0.02,
    0.2,
    new PIXI.Point(2000, 200),
    26,
    new PIXI.Point(1, 0)
  );
  const rulerH = new Ruler(
    viewport,
    onDragStart,
    onDragEndRuler,
    true,
    new PIXI.Point(0, 200),
    new PIXI.Point(5, 0),
    0.1,
    0.1,
    new PIXI.Point(200, 1200),
    26,
    new PIXI.Point(0, 1)
  );

  const render = new Render.CandlestickRenderer(
    viewport,
    onDragStart,
    onDragEnd,
    new PIXI.Point(0, 0),
    new PIXI.Point(2000, 1200)
  );

  const symbol = 'BLZUSDT'; // Replace with the desired trading pair
  const interval = '1m';    // Replace with the desired interval (e.g., 1m, 5m, 1h, 1d)
  const limit = 1000;       // The maximum number of data points you want to retrieve

  try {
    const fetcher = new Candles.BinanceCandlestickFetcher('', '');
    const candlestickData = await fetcher.fetchCandlestickData(symbol, interval, limit);
    const minMaxData = fetcher.calculateMinMax(candlestickData);
    console.log(minMaxData);
    console.log(candlestickData);
    ruler.calculateRoundedPeriod(
      (minMaxData.get('openTime')!.min + minMaxData.get('closeTime')!.max
      ) / 2,
      minMaxData.get('closeTime')!.max
    );
    rulerH.calculateRoundedPeriod(
      minMaxData.get('low')!.min,
      minMaxData.get('high')!.max
    );
    console.log("Ratios:", ruler.ratioConst(), rulerH.ratioConst())
    const scale = new PIXI.Point(ruler.ratioConst(), rulerH.ratioConst());
    const shift = new PIXI.Point(minMaxData.get('openTime')!.min, minMaxData.get('low')!.min);
    render.renderCandlesticks(
      candlestickData,
      scale,
      shift
    );

    async function fetchOrders(): Promise<Order[]> {
      try {
        const response = await fetch('http://195.91.221.88:5001'); // Adjust the URL to match your server endpoint.
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

    // Define the structure of an Order
    interface Order {
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

    // Example usage
    fetchOrders()
      .then((orders) => {
        console.log('Fetched orders:', orders);
        render.renderOrders(orders, scale, shift);
        // You can work with the orders array in your frontend application.
      })
      .catch((error) => {
        console.error('Error:', error);
      });


  } catch (error) {
    console.error(error);
  }
}
