ig.module("nax-ccuilib.ui")
	.requires(
		"nax-ccuilib.ui.test-menu",
		"nax-ccuilib.ui.quick-ring-menu",
		"nax-ccuilib.ui.input-field",
	)
	.defines(() => {

		sc.TitleScreenButtonGui.inject({
			init() {
				this.parent();

				// Get the last button that was instanced in the parent init, which is also the button with the highest Y position. 
				let highestButton = this.buttons[this.buttons.length - 1];

				// @ts-ignore
				this.myMenuButton = this._createButton(
					"testMenu",
					highestButton.hook.pos.y + highestButton.hook.size.y + 4, // Four for padding
					6, // Or whatever is the highest unused index (Without any other mods it should be 6)
					// @ts-ignore
					this._enterTestMenu.bind(this),
					"testMenu"
				);

				this.doStateTransition("DEFAULT", true);
			},

			// @ts-ignore
			_enterTestMenu() {
				// @ts-ignore
				sc.menu.setDirectMode(true, sc.MENU_SUBMENU.TEST_MENU);
				sc.model.enterMenu(true);
			}
		});

		nax.ccuilib.registerSubMenu = function (menuName: string, clazz: Function) {
			const enumString = menuName.toUpperCase();
			// @ts-ignore
			sc.MENU_SUBMENU[enumString] = Math.max(...Object.values(sc.MENU_SUBMENU)) + 1;

			// @ts-ignore
			sc.SUB_MENU_INFO[sc.MENU_SUBMENU[enumString]] = {
				Clazz: clazz,
				name: menuName
			};
		}

		nax.ccuilib.registerSubMenu("TEST_MENU", nax.ccuilib.TestMenu);
	});