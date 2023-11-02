import * as PIXI from 'pixi.js';
import * as Candles from './Candles';
import * as Utils from './Utils';
import * as Render from './Render';
import * as Sequelize from "sequelize";
import { Viewport } from "pixi-viewport";
import { CoolBitmapText, hackBitmapTextDisableMips } from "./CoolBitmapText";
import { Pool, QueryConfig, QueryResult } from 'pg';
import { onDragMoveDefault } from './Draggable';
import * as Ruler from './Ruler';
import * as Overrides from './Overrides';
import { ThroughEventBoundary } from './ThroughEventBoundary';
// export let dragTarget: PIXI.Sprite[] = [];

// const interworff = new URL('/interwoff.fnt', import.meta.url);
// import interwoff from './interwoff.fnt'
const app = new PIXI.Application({
  // background: '#000', 
  backgroundColor: 0x000,
  resizeTo: window
});

document.body.appendChild(app.view);
app.stage.x = 0;
app.stage.y = 0;

let _lockX = 0;
let _lockY = 0;
let _lastRuler = false;


function testf(event) {
  const v = event.viewport;
  console.log(viewports);
  console.log(v.parent.getChildIndex(v));
  const v0 = viewports[0];
  const vh = viewports[1];
  const vv = viewports[2];
  const c0 = v.children[0];
  if (!_lastRuler) {
    vh.scale.set(v0.scale.x);
    vh.x = v0.x;
    // vh.y = 0;
    vv.y = v0.y;
    // vv.x = 0;
    vv.scale.set(v0.scale.y);
  }
  _lastRuler = false;
  vh.children[0].fill();
  vv.children[0].fill();

  // console.log(v.parent.getChildIndex(v));
  // console.log(v.scale);

  // console.log('abioba');
  // console.log(this);
  // console.log(event.viewport);
  // console.log(event.viewport);
  // console.log(event);
  // console.log(dragTarget);
  // console.log(event.viewport.parent.children);
  // dragTarget.forEach(element => {
  //   let i = 0;
  //   // console.log(element);
  //   if (!element instanceof Render.CandlestickRenderer) {
  //     i++;
  //     element.toLocal(new PIXI.Point(
  //       element.vertical ? -  event.viewport.x : 0,
  //       !element.vertical ? - event.viewport.y : 0,
  //       ),
  //       element,element.position);
  // console.log(event.parent.children);
  // event.parent.children.forEach(c => {
  // c.moved(event);
  // c.x = event.screen.x;
  // c.y = event.screen.y;
  // });
  // event.stopPropagate();
  
  // const b = event.viewport.getVisibleBounds();
  // b.x = 0;
  // b.y = 0;
  // event.viewport.forceHitArea = b;

  // event.viewport.parent.children.forEach(c => {
    // c.moved(event);
    // c.children.forEach(ch => {
    //   // ch.moved(event)
    //   // console.log(ch);
    //   ch.toLocal(
    //     new PIXI.Point(
    //       event.viewport.position.x - Ruler.lastPos.x,
    //       // -event.viewport.position.x,
    //       // event.screen.y - Ruler.lastPos.y
    //       0
    //     ),
    //     ch, ch.position
    //     );
    // });
    // console.log(Ruler.lastPos.x, Ruler.lastPos.y);
    // console.log(event.viewport.x, event.viewport.y);
    // console.log("Child::");
    // console.log(c);
    // c.moveCorner(
    // event.viewport.position.x - Ruler.lastPos.x,
    // -event.viewport.position.x,
    // event.screen.y - Ruler.lastPos.y
    // 0
    // );
    // c.position.x = event.viewport.position.x * caches.shiftMask.x;
    // c.position.y = event.viewport.position.y * caches.shiftMask.y;
  // });
  //   }
  //   // if (element.vertical !== undefined){
  //   // }
  //   console.log(i);
  // });
  // dragTarget.forEach(d => {
  // console.log(d.,microshift.x);
  // });
}

function testf2(event) {
  // viewports[]
  // console.log('abioba');
  // console.log(this);
  // console.log(event.viewport);
  // console.log(event.viewport);
  // console.log(event)o;
  // console.log("TESTF2");
  // console.log(event);

  const v = event.viewport;
  console.log(viewports);
  console.log(v.parent.getChildIndex(v));
  const v0 = viewports[0];
  const vh = viewports[1];
  const vv = viewports[2];
  const c0 = v.children[0];

  // if (c0.vertical !== undefined) {
    // v0.scale.x = vv.scale.x;
    // v0.scale.y = vh.scale.y;
    // console.log("scale set ", vv.scale.x, vh.scale.y);
    // v0.scale.set(vv.scale.x, vh.scale.y);
  // }
  // vh.scale.set(v0.scale.x);
  v0.x = vh.x;
  v0.y = vv.y;
  // vv.scale.set(v0.scale.y);
  v0.scale.set(vh.scale.x, vv.scale.y);
  _lastRuler = true;


  // vv.x = 0;
  // vh.y = 0;
  // if (v.children[0].vertical) {
  //   v0.y = v.y;
  //   vv.x = v0.x;
  // } else {
  //   v0.x = v.x;
  //   vh.y = v0.y
  // }
  
  // console.log(ch)
  // v.top = 0;
  // v.left = 0;
  // ch.right = ch.worldScreenWidth;
  // ch.bottom = ch.worldScreenHeight;
  
  // const ch = event.viewport.children.at(-1);
  // ch.scale = v.scale;

  // console.log("CH", ch);
  
  const b = event.viewport.getVisibleBounds();
  // ch.x = b.x;
  // ch.y = b.y;
  // b.x = v.x;
  // b.y = v.y;
  
  b.x = 0;
  b.y = 0;
  // b.width = v.width   / v.scale.x;
  // b.height = v.height / v.scale.y;
  
  // b.width = v.width;
  // b.height = v.height;
  // b.
  event.viewport.forceHitArea = b;
  // event.viewport.forceHitArea = null;
  // event.viewport.forceHitArea = null;

  // event.viewport.children.at(-1).x = 0;
  // ch.position.set(0,0);
  // console.log(event.viewport);
  // dragTarget.forEach(element => {
  //   let i = 0;
  //   console.log(element);
  //   if (!element instanceof Render.CandlestickRenderer) {
  //     i++;
  //     element.toLocal(new PIXI.Point(
  //       element.vertical ? -  event.viewport.x : 0,
  //       !element.vertical ? - event.viewport.y : 0,
  //       ),
  //       element,element.position);
  v.children.forEach(c => {
    try{
      if (c.fill) {
        // console.log(c);
        c.fill();
      }
    } catch (e) {
    }
  // c.moved(event);
  // console.log("Child::");
  // console.log(c.children);
  // const mask = new PIXI.Point(1, 1);
  // mask.x = c.children[0] instanceof Ruler.Ruler ? c.children[0].vertical : 1;
  // mask.y = c.children[1] instanceof Ruler.Ruler ? c.children[1].vertical : 1;
  // console.log(mask);
  // c.position.x = event.viewport.position.x * c.shiftMask.x;
  // c.position.y = event.viewport.position.y * c.shiftMask.y;
  });

  //   }
  //   // if (element.vertical !== undefined){
  //   // }
  //   console.log(i);
  // });
  // dragTarget.forEach(d => {
  // console.log(d.,microshift.x);
  // });
}

function defcb(st, event) {
  console.log(st, event);
  // const v = event.viewport;
  // console.log(v.x, v.y, v.width, v.height);
  // console.log(v.getVisibleBounds())
  // console.log(event.clientY);
  // v.left = -600;
  // v.right = -400;
  // v.hitArea = new PIXI.Rectangle(v.x, v.y, v.width, v.height);
  // v.hitArea.x = v.x;
  // v.hitArea.y = v.y;
  // v.hitArea.width = v.width;
  // v.hitArea.height = v.height;
}

// app.renderer.events.rootBoundary = true;
// app.renderer.events.rootBoundary = new ThroughEventBoundary(app.stage);
// console.log(app.renderer.events);
// monitorEvents(window);

const pp = new PIXI.Container();
pp.width = window.innerWidth;
pp.height = window.innerHeight;
pp.interactive = true;
Utils.addBoundingRect(pp, 10, 0x00ff00, false);
app.stage.addChild(pp);

console.log(pp);

type DirType = "all" | 'x' | 'y';
const viewports = new Array<DirType>("all", 'x', 'y').map((direction, i) => {
  const viewport = new Viewport({
    screenWidth: i !== 2 ? window.innerWidth : 200,
    screenHeight: i !== 1 ? window.innerHeight : 200,
    worldWidth: i !== 2 ? 1000 : 200,
    worldHeight: i !== 1 ? 1000 : 200,
    events: app.renderer.events,
  })
  // .on('wheel', i === 0 ? testf : Ruler.onDragStartRuler)
  // .on('moved', i === 0 ? testf : Ruler.onDragStartRuler)

  .on('moved', i === 0 ? testf : testf2)
  // .on('wheel', i === 0 ? testf : testf2)
  // .on('drag-start', Ruler.onDragStartRuler)
  // .on('drag-end', Ruler.onDragEndRuler)
  // .on("clicked", (event) => { defcb("clicked", event)})
  // .on("drag-start", (event) => { defcb("drag-start", event)})
  // .on("drag-end", (event) => { defcb("drag-end", event)})
  // .on("drag-remove", (event) => { defcb("drag-remove", event)})
  // .on("pinch-start", (event) => { defcb("pinch-start", event)})
  // .on("pinch-end", (event) => { defcb("pinch-end", event)})
  // .on("pinch-remove", (event) => { defcb("pinch-remove", event)})
  // .on("snap-start", (event) => { defcb("snap-start", event)})
  // .on("snap-end", (event) => { defcb("snap-end", event)})
  // .on("snap-remove", (event) => { defcb("snap-remove", event)})
  // .on("snap-zoom-start", (event) => { defcb("snap-zoom-start", event)})
  // .on("snap-zoom-end", (event) => { defcb("snap-zoom-end", event)})
  // .on("snap-zoom-remove", (event) => { defcb("snap-zoom-remove", event)})
  // .on("bounce-x-start", (event) => { defcb("bounce-x-start", event)})
  // .on("bounce-x-end", (event) => { defcb("bounce-x-end", event)})
  // .on("bounce-y-start", (event) => { defcb("bounce-y-start", event)})
  // .on("bounce-y-end", (event) => { defcb("bounce-y-end", event)})
  // .on("bounce-remove", (event) => { defcb("bounce-remove", event)})
  // .on("wheel-start", (event) => { defcb("wheel-start", event)})
  // .on("wheel-remove", (event) => { defcb("wheel-remove", event)})
  // .on("wheel-scroll", (event) => { defcb("wheel-scroll", event)})
  // .on("wheel-scroll-remove", (event) => { defcb("wheel-scroll-remove", event)})
  // .on("mouse-edge-start", (event) => { defcb("mouse-edge-start", event)})
  // .on("mouse-edge-end", (event) => { defcb("mouse-edge-end", event)})
  // .on("mouse-edge-remove", (event) => { defcb("mouse-edge-remove", event)})
  // .on("moved", (event) => { defcb("moved", event)})
  // .on("moved-end", (event) => { defcb("moved-end", event)})
  // .on("zoomed", (event) => { defcb("zoomed", event)})
  // .on("zoomed-end", (event) => { defcb("zoomed-end", event)})
  // .on("update", (event) => { defcb("update", event)})
  viewport
  .drag()
  .pinch()
  .wheel({
    // smooth: 2,
    // interrupt: false
    // axis: direction
  })
  // .snapZoom()
  .decelerate()
  viewport.plugins.plugins['drag']!.move = Overrides.move;
  // console.log(viewport.plugins.plugins);
  pp.addChild(viewport);
  // viewport.zIndex = i;
  return viewport;
})

// viewports[0].on("moved", (event) => {
  // console.log(viewports[0].x, viewports[0].y);
  // console.log(viewports[0].top, viewports[0].left, viewports[0].right, viewports[0].bottom);
  // viewports[1].emit('moved', {
    // event: event,
    // viewport: viewports[1]
  // });

// });
// let ququ: number[] = [];
// viewports.forEach((viewport, i) => {
  // if (i === 0) { return; }
  // viewport.on("moved", (event) => { 
    // viewports[0].emit("moved", event);
    // viewports[0].x = event.viewport.x;
    // const b = viewports[0].getVisibleBounds();
    // b.x = 0;
    // b.y = 0;
    // viewports[0].forceHitArea = b;
    // viewports[0].forceHitArea.x = event.viewport.x;
    // viewports.forEach(viewport => {
    //   viewport.emit("moved", event);
    // })
  // });
// })

window.WebFontConfig = {
  google: {
    families: ['Inter', 'JetBrains Mono'],
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


async function init() {
  // PIXI.Assets.add({
  // alias: 'interwoff', 
  // src: 'assets/interwoff.fnt'
  // });
  // PIXI.BitmapFont.from("assets/interwoff.fnt");
  // PIXI.LoaderResource.setExtensionXhrType('fnt', PIXI.LoaderResource.XHR_RESPONSE_TYPE.TEXT);
  // PIXI.loadBitmapFont('assets/interwoff.fnt');
  // app.stage.eventMode = 'static';
  // app.stage.hitArea = app.screen;
  // app.stage.on('pointerup', onDragEndRuler);
  // app.stage.on('pointerupoutside', onDragEndRuler);

  function onDragMove(event) {
    console.log(this);
    const target = event.children[0];
    console.log();
    if (target.microshift === undefined) {
      return;
    }
    if (target instanceof PIXI.Container) {
      console.log('aboba:(');
      //   this.moveCenter(
      // new PIXI.Point(
      // this.x + this.microshift.x,
      // this.y + this.microshift.y
      //  this.vertical ? this.microshift.x : 0,
      // !this.vertical ? this.microshift.y : 0
      // ),
      // this, this.position
      // );
    }
    // dragTarget.forEach(d => {
    // if (!(d instanceof PIXI.Container)) { return; }
    // if (d.parent instanceof PIXI.Container) {
    //   // d.toLocal(new PIXI.Point(
    //     //  d.vertical ? - d.x + d.microshift.x : 0,
    //     // !d.vertical ? - d.y + d.microshift.y : 0
    //   // ),
    //     // d.parent, d.position
    //   // );
    // d.moveCenter(
    //     // d.microshift.x, d.microshift.y);
    //  d.vertical ? - d.x + d.microshift.x : 0,
    // !d.vertical ? - d.y + d.microshift.y : 0
    // );;
    // }
    // console.log(d.microshift.x, d.microshift.y)
    // console.log(d);
    // }
    // );
  }

  function onDragStart(event) {
    console.log(event.parent.parent);
    event.parent.parent.children.forEach(p => {
      Ruler.dragTarget.push(p.children);
    })
    // dragTarget.forEach(t => {
    //   t.microshift.x = t.x;
    //   t.microshift.y = t.y;
    // });
    this.microshift.x = this.x;
    this.microshift.y = this.y;
    // app.stage.on('pointermove', onDragMove);
    // console.log("onDragStart");
    // console.log(this);

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


  function onDragEnd(event) {
    // this.alpha = 1;
    if (dragTarget) {
      // app.stage.off('pointermove', onDragMove);
      dragTarget.forEach(d => {
        d.alpha = 1;
        d.microshift.x = event.global.x;
        d.microshift.y = event.global.y;
      });
      // dragTarget = new Array<PIXI.Sprite>();
      while (dragTarget.length > 0) {
        dragTarget.pop();
      }
    }
  }

  const render = new Render.CandlestickRenderer(
    viewports[0],
    onDragStart,
    onDragEnd,
    new PIXI.Point(0, 0),
    new PIXI.Point(2000, 1200)
  );
  const ruler = new Ruler.Ruler(
    viewports[1],
    onDragStart,
    Ruler.onDragEndRuler,
    false,
    new PIXI.Point(200, 0),
    new PIXI.Point(0, 5),
    0.02,
    0.2,
    new PIXI.Point(2000, 200),
    26,
    new PIXI.Point(1, 0)
  );
  const rulerH = new Ruler.Ruler(
    viewports[2],
    onDragStart,
    Ruler.onDragEndRuler,
    true,
    new PIXI.Point(0, 200),
    new PIXI.Point(5, 0),
    0.1,
    0.1,
    new PIXI.Point(200, 1200),
    26,
    new PIXI.Point(0, 1)
  );


  const symbol = 'BLZUSDT'; // Replace with the desired trading pair
  const interval = '15m';    // Replace with the desired interval (e.g., 1m, 5m, 1h, 1d)
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
        // const response = await fetch('http://195.91.221.88:5001'); // Adjust the URL to match your server endpoint.
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
