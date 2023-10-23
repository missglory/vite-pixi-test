import * as PIXI from 'pixi.js';

export type fvType = Function;

let dragTarget: PIXI.Sprite[] = [];
let lastPos = new PIXI.Point();
export const app = new PIXI.Application({ background: '#000', resizeTo: window });
document.body.appendChild(app.view);
// export const onDragMoveDefault = (event) => {
export function onDragMoveDefault(event) {
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

export function onDragEnd() {
	this.alpha = 1;
	if (dragTarget) {
		dragTarget.forEach(d => { 
			d.alpha = 1;	
			app.stage.off('pointermove', d.onDragMove);
		});
		dragTarget = [];
		lastPos = new PIXI.Point();
	}
}


export function onDragStartRuler(event) {
	for (let i = 0; i < this.children.length; i++) {
		const c = this.children[i];
		if (
			i == this.children.length - 1 || c.y <= event.global.y - this.y && 
			c.y +c.height >= event.global.y - this.y) {
			this.selectedChildren.y = i;
			this.microshift.y = event.global.y - this.y;
			break;
		}
	}
	for (let i = 0; i < this.children.length; i++) {
		const c = this.children[i];
		if (
			i == this.children.length - 1 || c.x <= event.global.x - this.x && 
			c.x + c.width >= event.global.x - this.x) {
			this.selectedChildren.x = i;
			this.microshift.x = event.global.x - this.x;
			break;
		}
	}
}

export function onDragStartWrap(event) {
	this.alpha = 0.5;
	dragTarget = this.parent.children;
	console.log(dragTarget);
	
	if (dragTarget) {
		dragTarget.forEach(t => { 
			t.onDragStart(); 
		});
	}
  this.app.stage.on('pointermove', onDragMoveDefault, this);
	// lastPos = new PIXI.Point(event.global.x, event.global.y);
}

export class Draggable extends PIXI.Sprite {
	onDragMove;
	onDragStart;
	onDragEnd;
  microshift = new PIXI.Point(0, 0);
	app: PIXI.Application;
	constructor(app: PIXI.Application, onDragStart = onDragStartRuler, onDragMove = onDragMoveDefault) {
		super();
		this.app = app;
    this.app.stage.addChild(this);
		// this.onDragMove = onDragMove.bind(this);
		// this.onDragStart = onDragStart.bind(this);
		// this.onDragEnd = onDragEnd.bind(this);
		this.onDragMove = onDragMove;
		this.onDragStart = onDragStart.bind(this);
		this.onDragEnd = onDragEnd;
    this.on('pointerdown', onDragStartWrap, this);
    this.on('pointerup', onDragEnd);
	}
};
