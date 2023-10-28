import * as PIXI from 'pixi.js';
import * as Candles from './Candles';
import * as Utils from './Utils';
import * as Render from './Render';
import * as Sequelize from "sequelize";
import { Buffer } from 'buffer';
import Process from 'process';
import { Viewport } from "pixi-viewport";
import { CoolBitmapText, hackBitmapTextDisableMips } from "./CoolBitmapText";
globalThis.process = Process;
globalThis.Buffer = Buffer;
import { Pool, QueryConfig, QueryResult } from 'pg';
import { onDragMoveDefault } from './Draggable';
import * as Ruler from './Ruler';
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


function testf(event) {
  // console.log('abioba');
  // console.log(this);
  // console.log(event.viewport);
  // console.log(event.viewport);
  console.log(event);
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

  event.viewport.parent.children.forEach(c => {
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
    console.log(Ruler.lastPos.x, Ruler.lastPos.y);
    console.log(event.viewport.x, event.viewport.y);
    console.log("Child::");
    // console.log(c);
    // c.moveCorner(
      // event.viewport.position.x - Ruler.lastPos.x,
      // -event.viewport.position.x,
      // event.screen.y - Ruler.lastPos.y
      // 0
    // );
    // c.position.x = event.viewport.position.x * caches.shiftMask.x;
    // c.position.y = event.viewport.position.y * caches.shiftMask.y;
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

function testf2(event) {
  // console.log('abioba');
  // console.log(this);
  // console.log(event.viewport);
  // console.log(event.viewport);
  // console.log(event)o;
  console.log("TESTF2");
  // console.log(event);

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
  // event.viewport.parent.children.forEach(c => {
  // c.moved(event);
  // console.log("Child::");
  // console.log(c.children);
  // const mask = new PIXI.Point(1, 1);
  // mask.x = c.children[0] instanceof Ruler.Ruler ? c.children[0].vertical : 1;
  // mask.y = c.children[1] instanceof Ruler.Ruler ? c.children[1].vertical : 1;
  // console.log(mask);
  // c.position.x = event.viewport.position.x * c.shiftMask.x;
  // c.position.y = event.viewport.position.y * c.shiftMask.y;
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
type DirType = "all" | 'x' | 'y';
const viewports = new Array<DirType>("all", 'x', 'y').map((direction, i) => {
  const viewport = new Viewport({
    screenWidth: i !== 2 ? window.innerWidth : 200,
    screenHeight: i !== 1 ? window.innerHeight : 200,
    worldWidth: i !== 2 ? 1000 : 200,
    worldHeight: i !== 1 ? 1000 : 200,
    events: app.renderer.events
    // interaction: app.renderer.events
  })
    .on('moved', i === 0 ? testf : testf2)
    .on('drag-start', Ruler.onDragStartRuler);

  viewport.drag().pinch().wheel().decelerate()
    // .clamp({
    //   direction
    // });
  app.stage.addChild(viewport);
  viewport.zIndex = i;

  // console.log(viewport);
  return viewport;
  // viewport.moveCenter(1000,1000);
})

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

  function onDragEndRuler() {
    // this.alpha = 1;
    if (Ruler.dragTarget) {
      // app.stage.off('pointermove', onDragMove);
      Ruler.dragTarget.forEach(d => { d.alpha = 1; });
      while (Ruler.dragTarget.length > 0) {
        dragTarget.pop();
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

  const ruler = new Ruler.Ruler(
    viewports[1],
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
  const rulerH = new Ruler.Ruler(
    viewports[2],
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
    viewports[0],
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
