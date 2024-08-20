import type { Opts as OptsType } from "../../options";
import type * as _ from "ccmodmanager/types/gui/manual-enforcer";

ig.module("nax-ccuilib.ui.quick-menu.quick-menu-extension")
	.requires("nax-ccuilib.ui.quick-menu.default-widgets", "nax-ccuilib.ui.quick-menu.button-traversal-patch")
	.defines(() => {
		const quickRingUtil = nax.ccuilib.quickRingUtil;
		const {
			selGridW,
			angleVec,
			getAllIdsFromRing,
			getIdFromRingPos,
			getRingMaxSize,
			getRingPosFromId,
			getWidgetFromId,
			possibleIds,
			ringCountToInit,
			saveRingConfig,
		} = {
			...quickRingUtil,
		};

		const Opts = modmanager.options["nax-ccuilib"] as typeof OptsType;

		sc.QuickRingMenu.inject({
			init() {
				sc.QuickRingMenu.instance = this;
				this.openendAtLeastOnce = false;

				quickRingUtil.ringConf = Opts.ringConfiguration;

				this.currentRingIndex = -1;
				this.nextRing(1);

				this.ringAngles = {};
				for (let ring = 0; ring < ringCountToInit; ring++) {
					const multiplier = (ring + 1) * 35;
					const maxSize = getRingMaxSize(ring);
					for (let angle = 0, index = 0; angle < 360; angle += 360 / maxSize, index++) {
						const pure = angleVec(angle);
						const position = Vec2.addC(Vec2.mulC(Vec2.create(pure), multiplier), 56);
						const id = getIdFromRingPos(ring, index);
						this.ringAngles[id] = { pure, position };
					}
				}

				this.parent();
				this.buttongroup.addPressCallback(button1 => {
					const button = button1 as sc.RingMenuButton;
					const config = getWidgetFromId(button.ringId);
					if (config?.pressEvent) {
						sc.Model.notifyObserver(nax.ccuilib.QuickRingMenuWidgets, nax.ccuilib.QUICK_MENU_WIDGET_EVENT.CLICK, config);
						config.pressEvent(button);
					}
				});

				this.infoBar = new sc.InfoBar();
				this.infoBar.setAlign(ig.GUI_ALIGN.X_LEFT, ig.GUI_ALIGN.Y_BOTTOM);
				this.infoBar.hook.pauseGui = true;
				ig.gui.addGuiElement(this.infoBar);
			},
			onWidgetListUpdate() {
				/* the last ring is not accually a ring, but a selection "menu" */
				const selGridPos: Vec2 = { x: 207, y: -80 };
				this.possibleSelGridIds = Object.keys(nax.ccuilib.QuickRingMenuWidgets.widgets)
					.filter(name => !name.startsWith("dummy"))
					.sort()
					.map((name, i) => {
						const id = getIdFromRingPos(ringCountToInit, i);
						quickRingUtil.ringConf[id] = name;
						const y = Math.floor(i / selGridW);
						const x = (i % selGridW) + (y % 2) / 2;
						const position = Vec2.create(selGridPos);
						Vec2.addC(position, x * 33, y * 17);
						this.ringAngles[id] = { pure: Vec2.create() /* the last ring is a grid, not a ring */, position };
						return id;
					});
			},
			enter() {
				quickRingUtil.ringConf = Opts.ringConfiguration;

				this.selectedToMoveButton = undefined;
				this.exitEditMode();
				this.currentRingIndex = -1;
				this.nextRing(1);
				this.buttongroup.doButtonTraversal(false, this.buttongroup.lastDir);

				if (!this.openendAtLeastOnce) {
					this.createButtons(true);
					this.openendAtLeastOnce = true;
				}
				this.parent();

				const entry = modmanager.optionConfigs["nax-ccuilib"].settings.helpMenu!;
				new modmanager.gui.ManualEnforcer("CCUILib-quickmenu", entry.title, entry.pages);
			},
			exit() {
				this.parent();
				this.infoBar.doStateTransition("HIDDEN");
			},
			nextRing(add): boolean {
				const originalIndex = this.currentRingIndex;
				let maxIte = 10;
				const editModeAdd = this.editModeOn ? 1 : 0;
				do {
					this.currentRingIndex += add;
					if (this.currentRingIndex < 0) {
						this.currentRingIndex = ringCountToInit - 1 + editModeAdd;
					} else if (this.currentRingIndex >= ringCountToInit + editModeAdd) {
						this.currentRingIndex = 0;
					}
					/* prevent freeze */
					maxIte--;
					if (maxIte <= 0) {
						this.currentRingIndex = 0;
						break;
					}
				} while (getAllIdsFromRing(this.currentRingIndex).length == 0);
				return originalIndex != this.currentRingIndex;
			},
			update() {
				this.parent();
				const lastI = ig.interact.entries.last();
				if (
					sc.quickmodel.visible &&
					sc.quickmodel.isQuickNone() &&
					/* make sure that no popup is over the quick menu */
					lastI instanceof ig.ButtonInteractEntry &&
					lastI.buttonGroupStack[0] == this.buttongroup
				) {
					const add = ig.gamepad.isButtonPressed(ig.BUTTONS.LEFT_SHOULDER) ? -1 : ig.gamepad.isButtonPressed(ig.BUTTONS.RIGHT_SHOULDER) ? 1 : 0;
					if (add != 0) {
						if (this.nextRing(add)) sc.BUTTON_SOUND.submit.play();
						this.buttongroup.doButtonTraversal(false, this.buttongroup.lastDir);
					}

					const isGamepad = ig.input.currentDevice == ig.INPUT_DEVICES.GAMEPAD;
					if (!Opts.lockLayout && (isGamepad ? ig.gamepad.isButtonPressed(ig.BUTTONS.FACE2 /* x */) : ig.input.pressed("dash")) /* right click */) {
						if (!this.selectedToMoveButton) {
							if (this.editModeOn) {
								this.selectedToMoveButton = focusedButton;
								sc.BUTTON_SOUND.toggle_on.play();
							} else {
								sc.BUTTON_SOUND.submit.play();
							}
							this.enterEditMode();
						} else {
							const fromB = this.selectedToMoveButton;
							const toB = focusedButton;
							if (toB) {
								let fromWidget: string = quickRingUtil.ringConf[fromB.ringId];
								let toWidget: string = quickRingUtil.ringConf[toB.ringId];

								const fromRing: number = getRingPosFromId(fromB.ringId).ring;
								const toRing: number = getRingPosFromId(toB.ringId).ring;
								if (fromRing == ringCountToInit) {
									if (toRing != ringCountToInit) {
										quickRingUtil.ringConf[toB.ringId] = fromWidget;
									}
								} else {
									if (toRing == ringCountToInit) {
										quickRingUtil.ringConf[fromB.ringId] = `dummy${fromB.ringId}`;
									} else {
										quickRingUtil.ringConf[fromB.ringId] = toWidget;
										quickRingUtil.ringConf[toB.ringId] = fromWidget;
									}
								}

								saveRingConfig(this.possibleSelGridIds);

								this.selectedToMoveButton = undefined;
								sc.BUTTON_SOUND.toggle_off.play();
							}
						}
					}
				}
			},
			createButton(widget) {
				const button = new sc.RingMenuButton(widget.id ?? 0, 0, 0);
				button.title = widget.title ?? ig.lang.get(`sc.gui.quick-menu.title.${widget.name}`) ?? widget.name;
				button.data = widget.description ?? ig.lang.get(`sc.gui.quick-menu.description.${widget.name}`) ?? widget.name;

				const defaultAngle = this.ringAngles[0].position;
				button.endPosActive.x = Math.floor(defaultAngle.x - 16) + 1;
				button.endPosActive.y = Math.floor(defaultAngle.y - 16) + 5;

				widget.additionalInit && widget.additionalInit(button);
				button.keepPressed = !!widget.keepPressed;
				button.isAToggle = !!widget.toggle;

				return button;
			},
			setButtonId(button, id) {
				const positionAngle = this.ringAngles[id].position;
				button.endPos = { x: Math.floor(positionAngle.x - 16) + 1, y: Math.floor(positionAngle.y - 16) + 1 };
				button.setPos(button.endPos.x, button.endPos.y);
				button.ringId = id;
			},
			createButtons(initAll: boolean = false) {
				if (!initAll /* this is false only on the first call by the QuickRingMenu init() function */) {
					/* we only need to init the vanilla buttons */
					for (const widgetName of ["11_items", "11_analyze", "11_party", "11_map"]) {
						this.createButton(nax.ccuilib.QuickRingMenuWidgets.widgets[widgetName]);
					}
					return;
				}
				if (this.buttons) for (const button of this.buttons) this.removeChildGui(button);
				for (let i = 0; i < this.buttongroup.elements[0].length; i++) this.buttongroup.removeFocusGui(0, i);

				this.buttons = possibleIds
					.concat(this.editModeOn ? this.possibleSelGridIds : [])
					.map(id => ({
						id,
						widgetName: quickRingUtil.ringConf[id],
					}))
					.filter(o => o.widgetName)
					.map(o =>
						Object.assign(o, {
							widget: nax.ccuilib.QuickRingMenuWidgets.widgets[o.widgetName],
						})
					)
					.filter(o => {
						if (!o.widget) {
							delete quickRingUtil.ringConf[o.id];
							return false;
						}
						return true;
					})
					.map(({ id, widget }) => {
						const button = this.createButton(widget);
						this.setButtonId(button, id);
						this.addChildGui(button);
						return button;
					});

				this.buttongroup.setButtons(...this.buttons);
			},
			_createRingButton() {
				throw new Error("CCUILib: This way of creating quick menu buttons is not supported.");
			},
			enterEditMode() {
				this.editModeOn = true;
				this.showDummyButtons();
				this.infoBar.doStateTransition("DEFAULT");
				this.infoBar.setText("");
			},
			exitEditMode() {
				this.editModeOn = false;
				this.hideDummyButtons();
				this.infoBar.doStateTransition("HIDDEN");
			},
			showDummyButtons() {
				this.onWidgetListUpdate();
				if (!this.dummyButtonsCreated) {
					for (const id of possibleIds) {
						nax.ccuilib.QuickRingMenuWidgets.addWidget({
							name: `dummy${id}`,
							title: `Replacement button ${id}`,
							description: "",
						});
					}
					this.dummyButtonsCreated = true;
				}
				for (const id of possibleIds) {
					if (quickRingUtil.ringConf[id]) continue;
					quickRingUtil.ringConf[id] = `dummy${id}`;
				}
				this.createButtons(true);
			},
			hideDummyButtons() {
				let anyHidden = false;
				for (const id of possibleIds) {
					const widgetName = quickRingUtil.ringConf[id];
					if (widgetName?.startsWith("dummy")) {
						delete quickRingUtil.ringConf[id];
						anyHidden = true;
					}
				}
				anyHidden && this.createButtons(true);
			},
			_setStateActive(state) {
				if (state == sc.QUICK_MENU_STATE.NONE) {
					this.buttons.forEach(b => b.show(0, true));
					if (sc.quickmodel.isQuickNone() && !ig.input.mouseGuiActive) lastFocusedButton?.focusGained();
					return;
				}
				this.buttons.forEach(b => b.deactivate());
				lastFocusedButton?.activate();
			},
		});

		let focusedButton: sc.RingMenuButton | undefined;
		let lastFocusedButton: sc.RingMenuButton | undefined;
		sc.RingMenuButton.inject({
			init(state, endPosX, endPosY) {
				this.parent(state, endPosX, endPosY);
			},
			isToggleOn() {
				return (this.toggledCache ??= nax.ccuilib.QuickRingMenuWidgets.isWidgetToggledOn(getWidgetFromId(this.ringId).name));
			},
			invokeButtonPress() {
				/* Update the state in case a default widget that uses that variable was just swapped */
				this.state = getWidgetFromId(this.ringId).id ?? 0;

				ig.FocusGui.prototype.invokeButtonPress.call(this);
				if (this.isAToggle) {
					const newConf = { ...Opts.buttonPressStatus };
					newConf[getWidgetFromId(this.ringId).name] = this.toggledCache = !this.isToggleOn();
					Opts.buttonPressStatus = newConf;

					/* Reset all toggle cache on all buttons to prevent multiple of the same button cache states desyncing */
					for (const button of sc.QuickRingMenu.instance.buttons) button.toggledCache = undefined;

					sc.BUTTON_SOUND[this.isToggleOn() ? "toggle_on" : "toggle_off"].play();
				} else sc.BUTTON_SOUND.submit.play();
			},
			focusGained() {
				this.parent();
				focusedButton = this;
				lastFocusedButton = this;
				const widget = getWidgetFromId(this.ringId);
				if (!widget) return;
				sc.QuickRingMenu.instance.infoBar.setText(`${widget.title}${widget.description ? ` - ${widget.description}` : ""}`);
			},
			focusLost() {
				this.parent();
				focusedButton = undefined;
				sc.QuickRingMenu.instance.infoBar.setText("");
			},
			updateDrawables(renderer) {
				const widget = getWidgetFromId(this.ringId);
				if (!widget) return;
				/* stolen */
				renderer.addGfx(this.gfx, 0, 0, 400, 304, 32, 32);
				if (this.active) {
					if ((!this.focus && this.pressed) || this.isToggleOn()) renderer.addGfx(this.gfx, 0, 0, 400, 336, 32, 32);
					else if (this.focus) {
						renderer.addGfx(this.gfx, 0, 0, 400, 336, 32, 32).setAlpha(this.alpha);
					}
				} else {
					if (this.focus) renderer.addGfx(this.gfx, 0, 0, 400, 272, 32, 32);
				}
				/* stolen end */
				if (!("image" in widget)) return;

				let data: ReturnType<nax.ccuilib.QuickMenuWidgetImageConfig>;
				if (!widget.imageNoCache && widget._imageDataCached) {
					data = widget._imageDataCached;
				} else {
					data = widget._imageDataCached = widget.image(this);
				}
				const { pos, srcPos, size } = data;
				renderer.addGfx(data.gfx, pos.x, pos.y, srcPos.x, srcPos.y, size.x, size.y);
			},
		});
	});
