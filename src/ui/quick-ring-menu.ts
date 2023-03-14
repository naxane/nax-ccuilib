ig.module("nax-ccuilib.ui.quick-ring-menu")
	.requires(
		"game.feature.quick-menu.gui.circle-menu",
		"nax-ccuilib.ui.quick-menu-button-group"
	)
	.defines(function () {
		sc.QuickRingMenu.inject({
			buttons: [],
			buttonCallbacks: {},
			init() {
				this.hook = new ig.GuiHook(this);

				this.setSize(112, 112);
				this.setPivot(56, 56);

				sc.Model.addObserver(sc.quickmodel, this);

				this.buttongroup = new sc.QuickMenuButtonGroup();

				this.buttongroup.addPressCallback((data: any) => {
					this.buttonCallbacks[data.state].call(this, data);
				});

				//#region vanilla buttons

				// Has to be in order, last arg is false to prevent having to reupdate positions every time.
				this.items = this.addQuickRingButton(
					"items",
					"ITEMS",
					(data) => {
						sc.quickmodel.enterItems();
						this._unfocusAll(data);
					},
					false
				);

				this.check = this.addQuickRingButton(
					"analyze",
					"CHECK",
					() => {
						sc.quickmodel.enterCheck();
						this._unfocusAll();
					},
					false
				);

				this.party = this.addQuickRingButton(
					"party",
					"PARTY",
					(data) => {
						sc.quickmodel.enterParty();
						this._unfocusAll(data);
					},
					false
				);

				this.map = this.addQuickRingButton(
					"map",
					"MAP",
					() => {
						this._unfocusAll();
						sc.menu.setDirectMode(true, sc.MENU_SUBMENU.MAP);
						sc.model.enterMenu(true);
						sc.model.prevSubState = sc.GAME_MODEL_SUBSTATE.RUNNING;
					},
					false
				);

				this.items.addChildGui(new sc.ItemTimerOverlay(this.items));

				this.updateButtonPositions();

				//#endregion

				this.doStateTransition("HIDDEN", true);
			},

			addQuickRingButton(name: string, stateName: string, callback: sc.QuickRingMenuPressCallback, updatePositions?: boolean) {
				updatePositions ||= false;

				// @ts-ignore enum changes at runtime
				sc.QUICK_MENU_STATE[stateName] = this.buttons.length + 1;
				// @ts-ignore enum changes at runtime
				const button = new sc.RingMenuButton(sc.QUICK_MENU_STATE[stateName], 0, 0);
				// @ts-ignore data is passed to the callback that doesn't exist on the ig FocusGui callback type.
				this.buttonCallbacks[sc.QUICK_MENU_STATE[stateName]] = callback;

				button.data = ig.lang.get("sc.gui.quick-menu.description." + name);
				button.name = name;

				this.buttons.push(button);

				this.buttongroup.setButtons(...this.buttons);

				if (updatePositions) {
					this.updateButtonPositions();
				}

				this.addChildGui(button);

				return button;
			},

			getButtonByName(name: string) {
				return this.buttons?.find(button => {
					if (button.name === name) return button;
				});
			},

			updateButtonPositions() {
				const zerothPos = this.getPosition(this.getAngle(0));
				const endPostActive = Vec2.createC(
					Math.floor(zerothPos.x - 16) + 1,
					Math.floor(zerothPos.y - 16) + this.buttons.length + 1,
				);

				this.buttons.forEach((button, i) => {

					let angle = this.getAngle(i);
					let buttonPos = this.getPosition(angle);

					// I have no idea what this property is for beyond transitions.
					button.endPosActive = endPostActive;

					button.endPos.x = Math.floor(buttonPos.x - 16) + 1;
					button.endPos.y = Math.floor(buttonPos.y - 16) + 1;
				});
			},

			removeButtonByName(name: string) {
				let removedButton: sc.RingMenuButton | undefined = undefined;
				this.buttons = this.buttons?.filter(button => {
					if (button.name !== name)
						return button;
					else
						removedButton = button;
				});

				this.buttongroup.setButtons(...this.buttons);
				this.updateButtonPositions();

				return removedButton;
			},

			getAngle(order: number) {
				// @ts-ignore
				return 360 / this.buttons?.length * order;
			},

			getPosition(angle: number) {
				return Vec2.createC(
					56 - 35 * Math.sin(angle * Math.PI / 180),
					56 - 35 * Math.cos(angle * Math.PI / 180),
				);
			}
		});
	});