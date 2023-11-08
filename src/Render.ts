import * as PIXI from 'pixi.js';
import * as Candles from './Candles';
import * as Ruler from './Ruler';
import * as Utils from './Utils';
import { Viewport } from 'pixi-viewport';

export class CandlestickRenderer extends PIXI.Container {
  offset = new PIXI.Point(0, 0);
  selectedChildren = new PIXI.Point(0, 0);
  microshift = new PIXI.Point(0, 0);
  shiftMask = new PIXI.Point(0, 0);
  vertical = null;
  fontSize = 15;
  glue: PIXI.Container;

  constructor(
    app: Viewport,
  ) {
    super();
    app.addChild(this);
    app.on("moved", testf);
    // this.x = initOffset.x;
    // this.y = initOffset.y;
    // this.pairRuler = pairRulers;
    // Utils.addBoundingRect(this);
    this.interactive = false;
    this.glue = this.parent.parent;
  }

  renderOrders(data: Order[], scale = new PIXI.Point(1, 1), shift = new PIXI.Point(0, 0)) {
    const orderHeight = 10; // Set the height of the order lines
    // console.log(orders);

    for (let i = 0; i < data.length; i++) {
      const order = data[i];
      const x1 = (order.time - shift.x) * scale.x;
      const x2 = order.cancel_time || order.fill_time ? Math.min(
        (order.cancel_time || order.fill_time) - shift.x,
        // You can add a default value here if necessary.
      ) * scale.x :
        1e9;
      const y = (order.price - shift.y) * scale.y;
      const color = order.amount > 0 ? 0x00FF00 : 0xFF0000; // Green for filled orders, red for canceled orders

      const orderLine = Utils.createLine(x1, y, x2, y, color);
      const text = Utils.objectToStringWithSeparator(order, "|", [
        'amount',
        'price',
        'time',
      ]);
      const newChild = new PIXI.Text(text, new PIXI.TextStyle({
        fontFamily: 'Inter',
        fontSize: this.fontSize,
        fill: color
      }));
      newChild.x = x1;
      newChild.y = y;
      newChild.scale.set(0.5);


      this.addChild(orderLine);
      this.addChild(newChild);
    }
  }

  renderCandlesticks(
    data: CandlestickData[],
    scale = new PIXI.Point(1, 1),
    shift = new PIXI.Point(0, 0)
  ) {
    const candleSpacing = 15;

    for (let i = 0; i < data.length; i++) {
      const candle = data[i];
      const candleWidth = candle.closeTime - candle.openTime;
      const x = candle.openTime;
      const color = candle.open < candle.close ? 0x00FF00 : 0xFF0000;
      const _mult = 0.1;

      const candleBody = Utils.createRect((x - shift.x) * scale.x, (candle.open - shift.y) * scale.y, candleWidth * scale.x, (candle.close - candle.open) * scale.y, color);
      const x_mid = (x + candleWidth / 2 - shift.x) * scale.x;
      const candleWick = Utils.createLine(
        x_mid,
        (candle.high - shift.y) * scale.y,
        x_mid,
        (candle.low - shift.y) * scale.y,
        color
      );

      this.addChild(candleBody, candleWick);
    }
  }
}

function testf(event) {
  const v = event.viewport;
  const pp = v.parent.parent;
  const ch = pp.children;
  const rx = ch[1].children;
  const ry = ch[2].children;
  if (!pp.lastRuler) {
    rx.forEach((c) => {
      c.scale.set(v.scale.x, v.scale.y);
      c.x = v.x;
      c.y = 0;
    });
    ry.forEach((c) => {
      c.scale.set(v.scale.x, v.scale.y);
      c.y = v.y;
      c.x = 0;
    });
  } else {
    v.scale.set(rx[0].scale.x, ry[0].scale.y);
  }
  pp.lastRuler = false;
}