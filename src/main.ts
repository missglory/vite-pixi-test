import * as PIXI from 'pixi.js';
import * as Candles from './Candles';
import * as Utils from './Utils';
import * as Render from './Render';

const app = new PIXI.Application({ background: '#000', resizeTo: window });

document.body.appendChild(app.view);


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
    shiftMask = new PIXI.Point(1, 1)
  ) {
    super();

    this.cursor = 'pointer';
    this.eventMode = 'static';
    this.on('pointerdown', onDragStart, this);
    this.on('pointerup', onDragEnd);
    // this.on('pointerleave', onDragEnd);
    parent.stage.addChild(this);
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
    // const mainDim = vertical ? window.innerHeight - initOffset.y - endOffset : window.innerWidth - initOffset.x - endOffset;
    // for (let i = 0; i < mainDim / fontSize; i++) {
    // const child = new PIXI.Text((182.01 + i / 100).toFixed(3), new PIXI.TextStyle({ fontFamily: 'JetBrains Mono', fontSize: fontSize }));
    // PIXI.Assets.load('JetBrainsMonoNerdFont-Medium.ttf').then(() => {
    // const child = new PIXI.Text(
    //   'bitmap fonts are supported!\nWoo yay!', {
    //   fontName: 'Lineal',
    //   fontSize: 25,
    //   align: 'left',
    //   // color: '#ffffff'
    // },
    // );
    // child.x = offset.x;
    // child.y = offset.y;
    // offset.x += savedOffset.x;
    // offset.y += savedOffset.y;
    // child.cursor = 'pointer';
    // child.eventMode = 'static';
    // child.on('pointerdown', onDragStart, child);
    // child.on('pointerup', onDragEnd);
    // child.on('pointeroutside', onDragEnd);
    // child.scale.set(0.5);
    // this.addChild(child);
    // this.add();
    // }
    // this.toLocal(new PIXI.Point(), undefined, this.position);
    // this.add();
    // this.add();
    this.fill();
  }
  // }

  toLocal(...params: any[]) {
    params[0].x *= this.shiftMask.x;
    params[0].y *= this.shiftMask.y;

    // console.log(this.parent);
    // Pass the modified argument to this.parent.toLocal
    // this.parent.toLocal(modifiedFirstArg, ...params.slice(1));
    this.parent.toLocal(...params);
    // this.children.forEach(child => {
    // child.x = params[0];
    // child.y = params[1];
    // child.toLocal(...params);
    // });

    this.fill();
  }

  fill() {
    // console.log("fill")
    while (this.children.length === 0) { this.add(); }
    let last = this.children.at(-1) ?? null;
    if (last === null) { return; }
    while ((this.vertical && last.y + this.y < this.endOffset.y - this.offset.y)
      || (!this.vertical && last.x + this.x < this.endOffset.x - this.offset.x)
    ) {
      this.add();
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
      this.add(false);
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
    this.removeChildren();
    this.levels = [];
    this.startValue = start;
    if (start >= end) {
      throw new Error("Start must be less than end");
    }

    const rangeLength = end - start;
    const roundedLength = Math.pow(10, Math.floor(Math.log10(rangeLength)));
    const period = Math.ceil(rangeLength / roundedLength) * roundedLength;
    console.log("New period: ", period);

    this.period = period;
    this.fill();
    return period;
  }

  ratio(n: number): number {
    const range = this.levels.at(-1)! - this.levels.at(0)!;
    return n / range;
  }

  add(tail = true) {
    // const text = this.children.length > 0 ? this.children.at(-1).x this.x.toFixed(3);
    // super.addChild(new PIXI.Text())
    if (this.levels.length > 0) {
      // if (this.vertical) {
      const newLevel = tail ? this.levels.at(-1)! + this.period : this.levels.at(0)! - this.period;
      console.log("New level: ", newLevel);
      const text = this.vertical ? (newLevel).toFixed(3) : Utils.timestampToUtcString(newLevel);
      const newChild = new PIXI.Text(text, new PIXI.TextStyle({ fontFamily: 'JetBrains Mono', fontSize: this.fontSize, fill: this.vertical ? "#83ffff" : "#ffff83" }));
      newChild.scale.set(0.5);
      newChild.x = tail ? this.children.at(-1)!.x + this.offset.x : this.children.at(0)!.x - this.offset.x;
      newChild.y = tail ? this.children.at(-1)!.y + this.offset.y : this.children.at(0)!.y - this.offset.y;
      console.log("set offset" + newChild.x + " " + newChild.y + " " + this.vertical);
      if (tail) {
        this.addChild(newChild);
        this.levels.push(newLevel);
      } else {
        this.addChildAt(newChild, 0);
        // this.levels = [newLevel] + this.levels;
        this.levels.unshift(newLevel);
      }// }
    } else {
      this.levels.push(this.startValue);
      console.log("levels : ", this.levels.length);
      const newChild = new PIXI.Text(this.startValue.toFixed(3), new PIXI.TextStyle({ fontFamily: 'JetBrains Mono', fontSize: this.fontSize, fill: this.vertical ? "#83cccc" : "#cccc83" }));
      newChild.scale.set(0.5);
      // newChild.x = this.initOffset.x;
      // newChild.y = this.initOffset.y;
      this.addChild(newChild);
    }
  }

  remove(ind = 0) {
    const last = this.children.at(ind)!;
    this.levels.pop();
    while (ind < 0) { ind += this.children.length; }
    super.removeChildAt(ind);
  }

  // addChild(child: PIXI.DisplayObject) {
  // super.addChild(child);
  // this.textChildren.push(child);
  // }

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

  function onDragMoveRuler(event) {
    dragTarget.forEach(d => {
      if (d.parent instanceof PIXI.Container) {
        // console.log(d.selectedChildren)
        d.toLocal(new PIXI.Point(
          event.global.x - d.selectedChildren.x * d.offset.x - d.microshift.x,
          event.global.y - d.selectedChildren.y * d.offset.y - d.microshift.y
        ),
          undefined, d.position
        );
      }
    });
  }


  function onDragMove(event) {
    dragTarget.forEach(d => {
      if (d.parent instanceof PIXI.Container) {
        // console.log(d.selectedChildren)
        d.toLocal(new PIXI.Point(
          event.global.x - d.microshift.x,
          event.global.y - d.microshift.y
        ),
          undefined, d.position
        );
      }
    });
  }

  function onDragStart(event) {
    this.alpha = 0.5;
    dragTarget = this.parent.children;
    this.microshift.x = event.global.x;
    this.microshift.y = event.global.y;
    app.stage.on('pointermove', onDragMove);
    lastPos = new PIXI.Point(event.global.x, event.global.y);
  }

  function onDragStartV(event) {
    for (let i = 0; i < this.children.length; i++) {
      if (i == this.children.length - 1 || this.children[i].y < event.global.y - this.y && this.children[i + 1].y > event.global.y - this.y) {
        this.selectedChildren.x = i;
        this.microshift.y = event.global.y - this.children[i].y - this.y;
        break;
      }
    }

    this.alpha = 0.5;
    dragTarget = this.parent.children;
    app.stage.on('pointermove', onDragMoveRuler);
    lastPos = new PIXI.Point(event.global.x, event.global.y);
  }

  function onDragStartH(event) {
    for (let i = 0; i < this.children.length; i++) {
      if (i == this.children.length - 1 || this.children[i].x < event.global.x - this.x && this.children[i + 1].x > event.global.x - this.x) {
        this.selectedChildren.y = i;
        this.microshift.x = event.global.x - this.children[i].x - this.x;
        break;
      }
    }

    this.alpha = 0.5;
    dragTarget = this.parent.children;
    app.stage.on('pointermove', onDragMoveRuler);
    lastPos = new PIXI.Point(event.global.x, event.global.y);
  }

  function onDragEndRuler() {
    this.alpha = 1;
    if (dragTarget) {
      app.stage.off('pointermove', onDragMoveRuler);
      dragTarget.forEach(d => { d.alpha = 1; });
      dragTarget = [];
      lastPos = new PIXI.Point();
    }
  }

  function onDragEnd() {
    this.alpha = 1;
    if (dragTarget) {
      app.stage.off('pointermove', onDragMove);
      dragTarget.forEach(d => { d.alpha = 1; });
      dragTarget = [];
      lastPos = new PIXI.Point();
    }
  }

  const ruler = new Ruler(app, onDragStartH, onDragEndRuler,  false,
    new PIXI.Point(200, 0),
    new PIXI.Point(70, 5), 0.02, 0.2,
    new PIXI.Point(800, 0),
    26,
    new PIXI.Point(1, 0));
  const rulerH = new Ruler(app, onDragStartV, onDragEndRuler,  true,
    new PIXI.Point(0, 200),
    new PIXI.Point(3, 26), 0.1, 0.1,
    new PIXI.Point(0, 800),
    26,
    new PIXI.Point(0, 1));

  // const rulerC = new Ruler(app, onDragStartV, onDragEnd, onDragMove, true,
  //   new PIXI.Point(0, 200),
  //   new PIXI.Point(70, 56), 0.1, 0.1,
  //   new PIXI.Point(0, 800),
  //   26,
  //   new PIXI.Point(1, 1));
  
  const render = new Render.CandlestickRenderer(app, onDragStart, onDragEnd);

  const symbol = 'BTCUSDT'; // Replace with the desired trading pair
  const interval = '1h';    // Replace with the desired interval (e.g., 1m, 5m, 1h, 1d)
  const limit = 1000;       // The maximum number of data points you want to retrieve

  try {
    const fetcher = new Candles.BinanceCandlestickFetcher('', '');
    const candlestickData = await fetcher.fetchCandlestickData(symbol, interval, limit);
    const minMaxData = fetcher.calculateMinMax(candlestickData)
    console.log(minMaxData);
    ruler.calculateRoundedPeriod(
      minMaxData.get('openTime')!.min,
      minMaxData.get('closeTime')!.max
    );
    rulerH.calculateRoundedPeriod(
      minMaxData.get('low')!.min,
      minMaxData.get('high')!.max
    );
    // candlestickData.forEach((candlestick: Candles.CandlestickData) => {
    //   // console.log(candlestick.close);
    //   const bar = new PIXI.Sprite(PIXI.Texture.WHITE);
    //   render.addChild(bar);
    // });
    render.renderCandlesticks(candlestickData);
  } catch (error) {
    console.error(error);
  }
}
