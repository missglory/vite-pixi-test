import * as PIXI from 'pixi.js';
import * as Logger from './Logger';
import { Viewport } from 'pixi-viewport';

export function move(event: PIXI.FederatedPointerEvent): boolean {
	if (this.paused || !this.options.pressDrag) {
		return false;
	}
	if (this.last && this.current === event.data.pointerId) {
		const x = event.global.x;
		const y = event.global.y;
		const count = this.parent.input.count();

		if (count === 1 || (count > 1 && !this.parent.plugins.get('pinch', true))) {
			const distX = x - this.last.x;
			const distY = y - this.last.y;

			if (this.moved
				|| ((this.xDirection && this.parent.input.checkThreshold(distX))
					|| (this.yDirection && this.parent.input.checkThreshold(distY)))) {
				const newPoint = { x, y };

				if (this.xDirection) {
					this.parent.x += (newPoint.x - this.last.x) * this.options.factor;
				}
				if (this.yDirection) {
					this.parent.y += (newPoint.y - this.last.y) * this.options.factor;
				}
				this.last = newPoint;
				if (!this.moved) {
					this.parent.emit('drag-start', {
						event,
						screen: new PIXI.Point(this.last.x, this.last.y),
						world: this.parent.toWorld(new PIXI.Point(this.last.x, this.last.y)),
						viewport: this.parent
					});
				}
				this.moved = true;
				this.parent.emit('moved', { viewport: this.parent, type: 'drag' });

				// console.log("ovewriten move", event);
				// console.log(event.target.parent.getChildIndex(event.target));
				if (event.target instanceof Viewport) {
					event.target.parent.children.forEach((c, i) => {
						if (event.target.parent.getChildIndex(event.target) === i) {
							return;
						}
						const ev = { ...event, target: c };
						// console.log("plugins", c);
						// console.log(i);
						// c.plugins.move(ev);
					});
				}

				return true
				// return false;;
			}
		}
		else {
			this.moved = false;
		}
	}

	return false;
}