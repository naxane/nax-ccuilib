ig.module("nax-ccuilib.ui.quick-menu-button-group")
	.requires("game.feature.quick-menu.gui.circle-menu")
	.defines(function () {
		sc.QuickMenuButtonGroup.inject({
			setButtons(...args: sc.RingMenuButton[]) {
				args.forEach((button, i) => {
					if (button) {
						this.addFocusGui(button, 0, i + 1);
					}
				});
			}
		});
	});