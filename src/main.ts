import * as PIXI from 'pixi.js';

const app = new PIXI.Application({ background: '#888888', resizeTo: window });

document.body.appendChild(app.view);


class Ruler extends PIXI.Container {

  localOffset = new PIXI.Point(0, 0);
  constructor(
    parent,
    onDragStart,
    onDragEnd,
    onDragMove,
    startOffset = 50,
    endOffset = 50,
    offset: PIXI.Point = new PIXI.Point(0, 0),
    initOffset: PIXI.Point = new PIXI.Point(0, 0),
  ) {
    super();
    parent.stage.addChild(this);
    const savedOffset = offset.clone();
    offset = initOffset.clone();
    this.localOffset = initOffset;
    this.y = startOffset;
    const fontSize = 26;
    const height = window.innerHeight - startOffset - endOffset;
    for (let i = 0; i < height / fontSize; i++) {
      const child = new PIXI.Text((182.01 + i / 100).toFixed(3), new PIXI.TextStyle({ fontFamily: 'JetBrains Mono', fontSize: fontSize }));
      // PIXI.Assets.load('JetBrainsMonoNerdFont-Medium.ttf').then(() => {
      // const child = new PIXI.Text(
      //   'bitmap fonts are supported!\nWoo yay!', {
      //   fontName: 'Lineal',
      //   fontSize: 25,
      //   align: 'left',
      //   // color: '#ffffff'
      // },
      // );
      child.x = offset.x;
      child.y = offset.y;
      offset.x += savedOffset.x;
      offset.y += savedOffset.y;
      child.cursor = 'pointer';
      child.eventMode = 'static';
      child.on('pointerdown', onDragStart, child);
      child.on('pointerup', onDragEnd);
      // child.on('pointeroutside', onDragEnd);
      child.scale.set(0.5);
      this.addChild(child);
    }
  }
  // }

  loLocal(...params: any[]) {
    this.children.forEach(child => {
      // child.x = params[0];
      // child.y = params[1];
      child.parent.toLocal(...params);
    });
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

function init() {
  let dragTarget: PIXI.Sprite[] = [];
  app.stage.eventMode = 'static';
  app.stage.hitArea = app.screen;
  app.stage.on('pointerup', onDragEnd);
  app.stage.on('pointerupoutside', onDragEnd);

  function onDragMoveV(event) {
    // if (dragTarget.length > 0) {
    // dragTarget.parent.toLocal(event.global, null, dragTarget.position);
    dragTarget.forEach(d => {
      if (d.parent instanceof PIXI.Container) {
        d.parent.toLocal(new PIXI.Point(0, event.global.y - lastPos.y), undefined, d.position);
      }
    });
    // }
  }

  function onDragMoveH(event) {
    // if (dragTarget.length > 0) {
    // dragTarget.parent.toLocal(event.global, null, dragTarget.position);
    dragTarget.forEach(d => {
      if (d.parent instanceof PIXI.Container) {
        d.parent.toLocal(new PIXI.Point(event.global.x - lastPos.x, 0), undefined, d.position);
      }
    });
    // }
  }

  function onDragStartV(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    // this.data = event.data;

    this.alpha = 0.5;
    dragTarget = [this.parent];
    app.stage.on('pointermove', onDragMoveV);
    lastPos = new PIXI.Point(event.global.x, event.global.y);
  }

  function onDragStartH(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    // this.data = event.data;

    this.alpha = 0.5;
    dragTarget = [this.parent];
    app.stage.on('pointermove', onDragMoveH);
    lastPos = new PIXI.Point(event.global.x, event.global.y);
  }

  function onDragEnd() {
    this.alpha = 1;
    if (dragTarget) {
      app.stage.off('pointermove', onDragMoveV);
      dragTarget.forEach(d => { d.alpha = 1; });
      dragTarget = [];
    }
    lastPos = new PIXI.Point();
  }
  const ruler = new Ruler(app, onDragStartV, onDragEnd, onDragMoveV, 50, 50,
    new PIXI.Point(0, 13), new PIXI.Point(0, 0));
  const rulerH = new Ruler(app, onDragStartH, onDragEnd, onDragMoveH, 50, 50,
    new PIXI.Point(75, 0), new PIXI.Point(75, 0));
}







































































