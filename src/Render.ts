import * as PIXI from 'pixi.js';
import * as Candles from './Candles';
import * as Ruler from './Ruler';
import * as Utils from './Utils';

export class CandlestickRenderer extends PIXI.Sprite {
  private app: PIXI.Sprite;
  container: PIXI.Container;
  offset = new PIXI.Point(0, 0);
  selectedChildren = new PIXI.Point(0, 0);
  microshift = new PIXI.Point(0, 0);
  shiftMask = new PIXI.Point(0, 0);
  vertical = null;
  initOffset: PIXI.Point;
  endOffset: PIXI.Point;
  pairRuler: Ruler.Ruler[];
  fontSize = 15;

  constructor(
    app: PIXI.Sprite,
    onDragStart,
    onDragEnd,
    initOffset = new PIXI.Point(0, 0),
    endOffset = new PIXI.Point(0, 0),
    pairRulers: Ruler.Ruler[] = []
  ) {
    super();
    this.app = app;
    this.app.addChild(this);

    // this.cursor = 'pointer';
    // this.eventMode = 'static';
    // this.on('pointerdown', onDragStart, this);
    // this.on('pointerup', onDragEnd);
    this.initOffset = initOffset;
    this.endtOffset = endOffset;
    this.x = initOffset.x;
    this.y = initOffset.y;
    this.pairRuler = pairRulers;
    Utils.addBoundingRect(this);
    this.interactive = false;
  }

  renderOrders(data, scale = new PIXI.Point(1, 1), shift = new PIXI.Point(0, 0)) {
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


  toLocal(...params: any[]) {
    // params[0].x *= this.shiftMask.x;
    // params[0].y *= this.shiftMask.y;

    // console.log(this.parent);
    // Pass the modified argument to this.parent.toLocal
    // this.parent.toLocal(modifiedFirstArg, ...params.slice(1));
    this.parent.toLocal(...params);
    // this.children.forEach(child => {
    // child.x = params[0];
    // child.y = params[1];
    // child.toLocal(...params);
    // });

    // this.fill();
  }

}