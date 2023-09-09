import * as PIXI from 'pixi.js';

const app = new PIXI.Application({ background: '#444444', resizeTo: window });

document.body.appendChild(app.view);


class Ruler {

  children: PIXI.BitmapText[] = [];
  constructor(parent, onDragStart, onDragEnd, onDragMove, num = 5) {
    let h = 100;
    for (let i = 0; i < num; i++) {
      // const child = new PIXI.Text('Crosterian.woff2', new PIXI.TextStyle({ fontFamily: 'Crosterian', fontSize: 50 }));
      // PIXI.Assets.load('JetBrainsMonoNerdFont-Medium.ttf').then(() => {
      const child = new PIXI.Text(
        'bitmap fonts are supported!\nWoo yay!', {
        fontName: 'Snippet',
        fontSize: 25,
        align: 'left',
        // color: '#ffffff'
      },
      );
      this.children.push(child);
      child.y = h;
      child.x = 50;
      child.cursor = 'pointer';
      child.eventMode = 'static';
      child.on('pointerdown', onDragStart, child);
      child.on('pointerup', onDragEnd);
      // child.on('pointeroutside', onDragEnd);
      parent.stage.addChild(child);

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
    families: ['Snippet'],
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


function init() {
  // Load from any font file!
  PIXI.Assets.addBundle('fonts', {
    ChaChicle: 'https://pixijs.com/assets/webfont-loader/ChaChicle.ttf',
    Lineal: 'https://pixijs.com/assets/webfont-loader/Lineal.otf',
    'Dotrice Regular': 'https://pixijs.com/assets/webfont-loader/Dotrice-Regular.woff',
    Crosterian: 'https://pixijs.com/assets/webfont-loader/Crosterian.woff2',
    // Crosterian: './JetBrainsMonoNerdFont-Medium.ttf',
  });


  PIXI.Assets.loadBundle('fonts').then(() => {
    const text1 = new PIXI.Text('ChaChicle.ttf', new PIXI.TextStyle({ fontFamily: 'ChaChicle', fontSize: 50 }));
    const text2 = new PIXI.Text('Lineal.otf', new PIXI.TextStyle({ fontFamily: 'Lineal', fontSize: 50 }));
    const text3 = new PIXI.Text('Dotrice Regular.woff', new PIXI.TextStyle({ fontFamily: 'Dotrice Regular', fontSize: 50 }));
    const text4 = new PIXI.Text('Crosterian.woff2', new PIXI.TextStyle({ fontFamily: 'Crosterian', fontSize: 50 }));

    text2.y = 150;
    text3.y = 300;
    text4.y = 450;

    app.stage.addChild(text1);
    app.stage.addChild(text2);
    app.stage.addChild(text3);
    app.stage.addChild(text4);

    let dragTarget: PIXI.Sprite[] = [];

    // enable the bunny to be interactive... this will allow it to respond to mouse and touch events
    text1.eventMode = 'static';
    text2.eventMode = 'static';
    text3.eventMode = 'static';
    text4.eventMode = 'static';

    // this button mode will mean the hand cursor appears when you roll over the bunny with your mouse
    text1.cursor = 'pointer';
    text2.cursor = 'pointer';
    text3.cursor = 'pointer';
    text4.cursor = 'pointer';

    // center the bunny's anchor point
    text1.anchor.set(-1.5);
    text2.anchor.set(-1.5);
    text3.anchor.set(-1.5);
    text4.anchor.set(-1.5);

    // make it a bit bigger, so it's easier to grab
    // text1.scale.set(3);
    // text2.scale.set(3);
    // text3.scale.set(3);
    // text4.scale.set(3);

    // setup events for mouse + touch using
    // the pointer events
    text1.on('pointerdown', onDragStart, text1);
    text2.on('pointerdown', onDragStart, text2);
    text3.on('pointerdown', onDragStart, text3);
    text4.on('pointerdown', onDragStart, text4);



    app.stage.eventMode = 'static';
    app.stage.hitArea = app.screen;
    app.stage.on('pointerup', onDragEnd);
    app.stage.on('pointerupoutside', onDragEnd);

    function onDragMove(event) {
      if (dragTarget.length > 0) {
        // dragTarget.parent.toLocal(event.global, null, dragTarget.position);
        dragTarget.forEach(d => { d.toLocal(event.global, undefined, d.position); });
      }
    }

    function onDragStart() {
      // store a reference to the data
      // the reason for this is because of multitouch
      // we want to track the movement of this particular touch
      // this.data = event.data;

      this.alpha = 0.5;
      dragTarget = this;
      app.stage.on('pointermove', onDragMove);
    }

    function onDragEnd() {
      if (dragTarget) {
        app.stage.off('pointermove', onDragMove);
        dragTarget.alpha = 1;
        dragTarget = null;
      }
    }
    const ruler = new Ruler(app, onDragStart, onDragEnd, onDragMove, 5);
  });
}







































































