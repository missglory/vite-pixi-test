import * as PIXI from 'pixi.js';
import * as Utils from './Utils';
import * as Render from './Render';
import { Viewport } from "pixi-viewport";
import * as Globals from './Globals';

export let dragTarget: PIXI.Sprite[] = [];
export let lastPos = new PIXI.Point();

export class Ruler extends PIXI.Container {
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
  start = 0;
  end = 0;
  glue: PIXI.Container;
  constructor(
    parent: Viewport,
    vertical = true,
    offset: PIXI.Point = new PIXI.Point(0, 0),
    initOffset: PIXI.Point = new PIXI.Point(0, 0),
    startValue = 0.01,
    period = 0.1,
    endOffset = new PIXI.Point(0, 0),
    fontSize = 26,
    shiftMask = new PIXI.Point(1, 1),
  ) {
    super();

    // this.cursor = 'pointer';
    // this.eventMode = 'static';
    // this.on('pointerdown', onDragStart, this);
    // this.on('pointerup', onDragEnd);
    // this.on('pointerleave', onDragEnd);
    parent.addChild(this);
    parent.on('moved', testf2)
    this.initOffset = initOffset.clone();
    this.endOffset = endOffset.clone();
    console.log("parent", parent);
    // this.endOffset = new PIXI.Point(parent.screenWidth, parent.screenHeight);
    this.endOffset = new PIXI.Point(parent.worldWidth, parent.worldHeight);
    console.log(this.endOffset);
    this.offset = offset.clone();
    this.vertical = vertical;
    this.y = initOffset.y;
    this.x = initOffset.x;
    this.fontSize = fontSize;
    this.startValue = startValue;
    this.endValue = startValue;
    this.period = period;
    this.shiftMask = shiftMask;
    this.fill();
    this.glue = parent.parent.parent;
  }

  bindLayer(v: Viewport) {
    this.boundLayers.push(v);
  }

  bindLayers(v: Viewport[]) {
    this.boundLayers.push(...v);
  }

  fill() {
    // console.log("fill");
    // const p = this.parent;
    const p = this.toGlobal(this.position);
    // const p = new PIXI.Point(0,0);
    // console.log(p.toGlobal(new PIXI.Point(0, 0)));
    console.log(p);
    console.log("tjos scale ", this.parent.scale);
    while (this.children.length === 0) { this.addToEdge(); }
    let last = this.children.at(-1) ?? null;
    if (last === null) { return; }
    // console.log("scale", this.parent.scale);
    const spp = new PIXI.Point(
      // this.parent.scale.x,
      // this.parent.scale.y,
      // 1, 1
      0, 0
    );
    // const sp = this.parent.scale;
    // const sp = spp;
    const sp = new PIXI.Point(
      1 / this.parent.scale.x,
      1 / this.parent.scale.y,
      // 1, 1
    );

    while ((this.vertical && last.y + this.y + p.y * spp.y < this.endOffset.y * sp.y)
      || (!this.vertical && last.x + this.x + p.x * spp.x < this.endOffset.x * sp.x)
    ) {
      this.addToEdge();
      last = this.children.at(-1) ?? null;
      if (last === null) { return; }
    }

    while ((this.vertical && last.y + this.y + p.y * spp.y > this.endOffset.y * sp.y)
      || (!this.vertical && last.x + this.x + p.x * spp.x > this.endOffset.x * sp.x)
    ) {
      this.remove(-1);
      last = this.children.at(-1) ?? null;
      if (last === null) { return; }
    }

    // console.log(last.x + this.x + p.y, " =>");
    last = this.children.at(0)!;
    // while ((this.vertical && last.y + this.y + p.y * spp.y > - this.offset.y * sp.y)
    // || (!this.vertical && last.x + this.x + p.x * spp.x > - this.offset.x * sp.x)
    while ((this.vertical && last.y + this.y + p.y * spp.y > - 0)//this.offset.y * sp.y)
      || (!this.vertical && last.x + this.x + p.x * spp.x > - 0)//this.offset.x * sp.x)
    ) {
      this.addToEdge(false);
      last = this.children.at(0) ?? null;
      if (last === null) { return; }
    }

    while ((this.vertical && last.y + this.y + p.y * spp.y < -this.offset.y * sp.y)
      || (!this.vertical && last.x + this.x + p.x * spp.x < - this.offset.x * sp.x)
    ) {
      this.remove(0);
      last = this.children.at(0) ?? null;
      if (last === null) { return; }
    }
  }

  calculateRoundedPeriod(start: number, end: number): number {
    if (start >= end) {
      throw new Error("Start must be less than end");
    }
    this.removeChildren();
    this.levels = [];
    this.startValue = start;
    this.start = start;
    this.end = end;

    console.log("realign ", start, end);
    const rangeLength = end - start;
    // const roundedLength = Math.pow(10, Math.floor(Math.log10(rangeLength)));
    // const period = Math.ceil(rangeLength / roundedLength) * roundedLength;
    // console.log("New period: ", period);

    this.period = rangeLength / 4;
    this.fill();
    return this.period;
  }

  ratioConst(): number {
    const c0 = this.children.at(0)!;
    const c1 = this.children.at(1)!;
    const x0 = this.vertical ? c0.y : c0.x;
    const x1 = this.vertical ? c1.y : c1.x;
    const l0 = this.levels.at(0)!;
    return (x1 - x0) / (this.levels.at(1)! - l0);
  }

  ratio(n: number): number {
    const l0 = this.levels.at(0)!;
    return (n - l0) * this.ratioConst();
  }

  makeLabel(newLevel: number) {
    return this.vertical ? (newLevel).toFixed(3) : Utils.timestampToUtcString(Math.trunc(newLevel));
  }

  addToEdge(tail = true) {
    // const text = this.children.length > 0 ? this.children.at(-1).x this.x.toFixed(3);
    // super.addChild(new PIXI.Text())
    if (this.levels.length > 0) {
      // if (this.vertical) {
      const newLevel = tail ?
        this.levels.at(-1)! + this.period :
        this.levels.at(0)! - this.period;
      this.addLevel(newLevel, tail);
    } else {
      this.addLevel(this.startValue);
    }
  }

  addLevel(newLevel: number, tail = true) {
    // console.log("New level: ", newLevel);
    const text = this.makeLabel(newLevel);
    const newChild = new PIXI.Text(text, new PIXI.TextStyle({ fontFamily: 'Inter', fontSize: this.fontSize, fill: this.vertical ? "#83ffff" : "#ffff83" }));
    // const newChild = new CoolBitmapText(text,
    // {
    // tint: this.vertical ? 0x83ffff : 0xffff83,
    // tint: 0x223344,
    // fontFamily: "JetBrains Mono",
    // }
    // );
    // bitmapFontText2.y = 300;
    // viewport.addChild(bitmapFontText2);

    newChild.scale.set(0.5);
    if (this.children.length > 0) {
      newChild.x = tail ? this.children.at(-1)!.x + this.offset.x : this.children.at(0)!.x - this.offset.x;
      newChild.y = tail ? this.children.at(-1)!.y + this.offset.y : this.children.at(0)!.y - this.offset.y;
      // console.log("set offset" + newChild.x + " " + newChild.y + " " + this.vertical);
    } else {
      newChild.x = this.initOffset.x;
      newChild.y = this.initOffset.y;
    }
    if (tail) {
      this.addChild(newChild);
      this.levels.push(newLevel);
    } else {
      this.addChildAt(newChild, 0);
      this.levels.unshift(newLevel);
    }
  }

  remove(ind = 0) {
    // const last = this.children.at(ind)!;
    while (ind < 0) { ind += this.children.length; }
    this.levels.splice(ind, 1);
    super.removeChildAt(ind);
  }

  private calculateXPosition(value: number): number {
    const totalRange = this.end - this.start;
    const normalizedValue = (value - this.start) / totalRange;
    return normalizedValue * this.width;
  }

  private findInsertIndex(newValue: number): number {
    for (let i = 0; i < this.levels.length; i++) {
      const levelValue = Number(this.levels[i]);
      if (newValue >= levelValue) {
        return i;
      }
    }
    return this.levels.length;
  }
};


export function onDragEndRuler(event) {
  // this.alpha = 1;
  console.log("onDragEndR");
  console.log(event);
  // if (Ruler.dragTarget) {
  // app.stage.off('pointermove', onDragMove);
  // Ruler.dragTarget.forEach(d => { d.alpha = 0.5; });
  // while (Ruler.dragTarget.length > 0) {
  // Ruler.dragTarget.pop();
  // }
  // }
  const v = event.viewport;

  // console.log(event);
  const ch = event.viewport.children.at(-1);

  const b = event.viewport.getVisibleBounds();
  // ch.scale = v.scale;
  // b.x = v.x;
  // b.y = v.y;
  // b.x = 0;
  // b.y = 0;
  // b.width = v.width   / v.scale.x;
  // b.height = v.height / v.scale.y;
  // b.width = v.width;
  // b.height = v.height;
  b.x = event.world.x;
  b.y = event.world.y;
  console.log(b);
  event.viewport.forceHitArea = b;
  ch.x = 0;
  ch.y = 0;
}

export function onDragStartRuler(event) {
  console.log('onDragStartRuler');
  // dragTarget = event.viewport.parent.children;
  // event.viewport.parent.children.forEach(d => {
  // dragTarget.push(...d.children);
  // dragTarget.push(d.children);
  // });
  // console.log("dragTarget: ")
  // console.log(dragTarget);
  console.log(event);

  const v = event.viewport;

  // console.log(event);
  // const ch = event.viewport.children.at(-1);

  const b = event.viewport.getVisibleBounds();
  // ch.scale = v.scale;
  // ch.x = b.x;
  // ch.y = b.y;
  // b.x = v.x;
  // b.y = v.y;
  b.x = 0;
  b.y = 0;
  b.width = v.width / v.scale.x;
  b.height = v.height / v.scale.y;
}


function testf2(event) {
  const v = event.viewport;
  // console.log(v.parent.getChildIndex(v));
  // const c0 = v.children[0];
  // c0.glue.lastRuler = true;
  const pp = v.parent.parent;
  pp.lastRuler = true;
  const ch = pp.children;
  const rx = ch[1].children[0];
  const ry = ch[2].children[0];
  ch[0].children.forEach((c) => {
    c.scale.set(rx.scale.x, ry.scale.y);
    c.x = rx.x;
    c.y = ry.y;
  });
  // ch[2].children.forEach((c) => { c.y = v.y; });
  // ch[1].children.forEach((c) => { c.scale.set(v.scale.x, v.scale.y); });
  // ch[2].children.forEach((c) => { c.scale.set(v.scale.x, v.scale.y); });

  const b = event.viewport.getVisibleBounds();
  // ch.x = b.x;
  // ch.y = b.y;
  // b.x = v.x;
  // b.y = v.y;
  b.x = 0;
  b.y = 0;
  event.viewport.forceHitArea = b;
  v.children.forEach(c => {
    try {
      if (c.fill) {
        // console.log(c);
        c.fill();
      }
    } catch (e) {
    }
  });
}