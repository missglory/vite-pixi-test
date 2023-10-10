import * as PIXI from 'pixi.js';

const app = new PIXI.Application({ background: '#000', resizeTo: window });

document.body.appendChild(app.view);


class Ruler extends PIXI.Container {
  initOffset = new PIXI.Point(0, 0);
  endOffset = new PIXI.Point(0, 0);
  offset = new PIXI.Point(0, 0);
  vertical = true;
  levels: number[] = [];
  period = 0.1;
  startValue = 0.01;
  fontSize = 26;
  selectedChildren = [];
  microshift = new PIXI.Point(0, 0);
  constructor(
    parent,
    onDragStart,
    onDragEnd,
    onDragMove,
    vertical = true,
    offset: PIXI.Point = new PIXI.Point(0, 0),
    initOffset: PIXI.Point = new PIXI.Point(0, 0),
    startValue = 0.01,
    period = 0.1,
    endOffset = new PIXI.Point(0, 0),
    fontSize = 26
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
    this.period = period;
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
    // params[0].y += this.y;
    // params[0].x += this.x;
    // super.toLocal(...params);
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
      || (!this.vertical  && last.x + this.x < this.endOffset.x - this.offset.x)
    ) {
      this.add();
      last = this.children.at(-1) ?? null;
      if (last === null) { return; }
    }

    while ((this.vertical && last.y + this.y > this.endOffset.y)
      || (!this.vertical  && last.x + this.x > this.endOffset.x)
    ) {
      this.remove(-1);
      last = this.children.at(-1) ?? null;
      if (last === null) { return; }
    }

    last = this.children.at(0)!;
    while ((this.vertical && last.y + this.y > this.offset.y)
      || (!this.vertical  && last.x + this.x > this.offset.x)
    ) {
      this.add(false);
      last = this.children.at(0) ?? null;
      if (last === null) { return; }
    }

    while ((this.vertical && last.y + this.y < 0)
      || (!this.vertical  && last.x + this.x < 0)
    ) {
      this.remove(0);
      last = this.children.at(0) ?? null;
      if (last === null) { return; }
    }
  }

  add(tail = true) {
    // const text = this.children.length > 0 ? this.children.at(-1).x this.x.toFixed(3);
    // super.addChild(new PIXI.Text())
    if (this.levels.length > 0) {
      // if (this.vertical) {
      const newLevel = tail ? this.levels.at(-1)! + this.period : this.levels.at(0)! - this.period;
      const text = (newLevel).toFixed(3);
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

function init() {
  let dragTarget: PIXI.Sprite[] = [];
  app.stage.eventMode = 'static';
  app.stage.hitArea = app.screen;
  app.stage.on('pointerup', onDragEnd);
  app.stage.on('pointerupoutside', onDragEnd);

  function onDragMoveV(event) {
    dragTarget.forEach(d => {
      if (d.parent instanceof PIXI.Container) {
        // console.log(d.selectedChildren)
        d.toLocal(new PIXI.Point(0, event.global.y - d.selectedChildren[0] * d.offset.y - d.microshift.y), undefined, d.position);
      }
    });
  }

  function onDragMoveH(event) {
    dragTarget.forEach(d => {
      if (d.parent instanceof PIXI.Container) {
        // console.log(d.selectedChildren)
        d.toLocal(new PIXI.Point(event.global.x - d.selectedChildren[0] * d.offset.x - d.microshift.x, 0), undefined, d.position);
        // d.toLocal()
      }
    });
  }

  function onDragStartV(event) {
    for (let i = 0; i < this.children.length; i++) {
      if (i == this.children.length - 1 || this.children[i].y < event.global.y - this.y && this.children[i + 1].y > event.global.y - this.y) {
        this.selectedChildren = [ i ];
        this.microshift.y = event.global.y - this.children[i].y - this.y;
        break;
      }
    }

    this.alpha = 0.5;
    dragTarget = [this];
    app.stage.on('pointermove', onDragMoveV);
    lastPos = new PIXI.Point(event.global.x, event.global.y);
  }

  function onDragStartH(event) {
    for (let i = 0; i < this.children.length; i++) {
      if (i == this.children.length - 1 || this.children[i].x < event.global.x - this.x && this.children[i + 1].x > event.global.x - this.x) {
        this.selectedChildren = [ i ];
        this.microshift.x = event.global.x - this.children[i].x - this.x;
        break;
      }
    }

    this.alpha = 0.5;
    dragTarget = [this];
    app.stage.on('pointermove', onDragMoveH);
    lastPos = new PIXI.Point(event.global.x, event.global.y);
  }

  function onDragEnd() {
    this.alpha = 1;
    if (dragTarget) {
      app.stage.off('pointermove', onDragMoveV);
      dragTarget.forEach(d => { d.alpha = 1; });
      dragTarget = [];
      lastPos = new PIXI.Point();
    }
  }
  const ruler = new Ruler(app, onDragStartH, onDragEnd, onDragMoveH, false,
    new PIXI.Point(200, 0), new PIXI.Point(70, 5), 0.02, 0.2, new PIXI.Point(800, 0));
  const rulerH = new Ruler(app, onDragStartV, onDragEnd, onDragMoveV, true,
    new PIXI.Point(0, 200), new PIXI.Point(3, 26), 0.1, 0.1, new PIXI.Point(0, 800));
}







































































