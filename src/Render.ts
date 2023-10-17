import * as PIXI from 'pixi.js';
import * as Candles from './Candles';

export class CandlestickRenderer extends PIXI.Sprite {
  private app: PIXI.Application;
  container: PIXI.Container;
  offset = new PIXI.Point(0, 0);
  selectedChildren = new PIXI.Point(-1, -1);
  microshift = new PIXI.Point(0, 0);
  shiftMask = new PIXI.Point(0, 0);

  constructor(app: PIXI.Application, onDragStart, onDragEnd) {
		super();
    this.app = app ? app : new PIXI.Application({ width: 800, height: 600 });
    // document.body.appendChild(this.app.view);

    // this.container = new PIXI.Container();
    this.app.stage.addChild(this);

    this.cursor = 'pointer';
    this.eventMode = 'static';
    this.on('pointerdown', onDragStart, this);
    this.on('pointerup', onDragEnd);
  }

  renderCandlesticks(data: CandlestickData[]) {
    const candleWidth = 10;
    const candleSpacing = 15;

    for (let i = 0; i < data.length; i++) {
      const candle = data[i];
      const x = i * (candleWidth + candleSpacing);
      const color = candle.open < candle.close ? 0x00FF00 : 0xFF0000;
			const _mult = 0.1;

      const candleBody = this.createRect(x, candle.open * _mult, candleWidth, (candle.close - candle.open) * _mult, color);
      const candleWick = this.createLine(x + candleWidth / 2, candle.high * _mult, x + candleWidth / 2, candle.low * _mult, color);

      this.addChild(candleBody, candleWick);
    }
  }

  private createRect(x: number, y: number, width: number, height: number, color: number): PIXI.Graphics {
    const rect = new PIXI.Graphics();
    rect.beginFill(color);
    rect.drawRect(x, y, width, height);
    rect.endFill();
    return rect;
  }

  private createLine(x1: number, y1: number, x2: number, y2: number, color: number): PIXI.Graphics {
    const line = new PIXI.Graphics();
    line.lineStyle(1, color);
    line.moveTo(x1, y1);
    line.lineTo(x2, y2);
    return line;
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