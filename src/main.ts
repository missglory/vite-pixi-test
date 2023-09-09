import * as PIXI from 'pixi.js';

const app = new PIXI.Application({ background: '#888888', resizeTo: window });

document.body.appendChild(app.view);


class Ruler extends PIXI.Container {

  constructor(parent, onDragStart, onDragEnd, onDragMove, topOffset = 50, botOffset = 50) {
    super();
    parent.stage.addChild(this);
    this.y = topOffset;
    let h = 0;
    const fontSize = 13;
    const height = window.innerHeight - topOffset - botOffset;
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
      child.y = h;
      child.x = 50;
      child.cursor = 'pointer';
      child.eventMode = 'static';
      child.on('pointerdown', onDragStart, child);
      child.on('pointerup', onDragEnd);
      // child.on('pointeroutside', onDragEnd);
      this.addChild(child);
      h += 50;
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

(function() {
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

    function onDragMove(event) {
      // if (dragTarget.length > 0) {
        // dragTarget.parent.toLocal(event.global, null, dragTarget.position);
        dragTarget.forEach(d => {
          if (d.parent instanceof PIXI.Container) {
            d.parent.toLocal(new PIXI.Point(0, event.global.y - lastPos.y), undefined, d.position);
          }
        });
      // }
    }

    function onDragStart(event) {
      // store a reference to the data
      // the reason for this is because of multitouch
      // we want to track the movement of this particular touch
      // this.data = event.data;

      this.alpha = 0.5;
      dragTarget = [this.parent];
      app.stage.on('pointermove', onDragMove);
      lastPos = new PIXI.Point(event.global.x, event.global.y);
    }

    function onDragEnd() {
      if (dragTarget) {
        app.stage.off('pointermove', onDragMove);
        drag = false;
        dragTarget.forEach(d => { d.alpha = 1; });
        dragTarget = [];
      }
      lastPos = new PIXI.Point();
    }
    const ruler = new Ruler(app, onDragStart, onDragEnd, onDragMove,  50, 50);
}







































































