ig.module("nax-ccuilib.ui.input-field-cursor")
	.requires(
		"impact.feature.gui.gui"
	).defines(() => {
		nax.ccuilib.InputFieldCursor = ig.GuiElementBase.extend({
			colour: "red",
			cursorTick: 0,
			active: false,
			movingTimer: 0,

			init(colour) {
				this.parent();
				this.colour = colour;
				this.hook.size.x = 1;
				this.hook.size.y = 11;
				this.active = false;
			},

			updateDrawables(renderer) {
				if (this.active) {
					this.cursorTick = (this.cursorTick + ig.system.actualTick) % 1;
					this.movingTimer -= ig.system.actualTick;
					if (this.movingTimer > 0 || this.cursorTick > 0.5) {
						renderer.addColor(this.colour, this.hook.pos.x, this.hook.pos.y, this.hook.size.x, this.hook.size.y);
					}
				}
			},
		});
	});