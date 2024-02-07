ig.module("nax-ccuilib.ui.quick-menu.quick-menu-extension")
	.requires("nax-ccuilib.ui.quick-menu.default-widgets")
	.defines(() => {
		const { angleVec, getAllIdsFromRing, getIdFromRingPos, getRingMaxSize, getRingPosFromId, getWidgetFromId, possibleIds, ringCountToInit, saveConfig } = {
			...nax.ccuilib.quickRingUtil,
		};
		const selGridW = 4;

		function patchButtonTraversal() {
			sc.QuickMenuButtonGroup.inject({
				init() {
					this.parent();
					this.repeater = new ig.PressRepeater();
				},
				setButtons(...args) {
					args.forEach((btn, i) => btn && this.addFocusGui(btn as ig.FocusGui, 0, i));
				},
				focusButtonByRingId(ringId) {
					for (let i = 0; i < this.elements[0].length; i++) {
						const button = this.elements[0][i];
						if (button?.ringId == ringId) {
							this.focusCurrentButton(0, i);
							break;
						}
					}
				},
				getRepeaterDir(dirVec) {
					if (dirVec.x > 0.7) return "e";
					// if (dirVec.x > 0.4 && dirVec.y > 0.4) return 'se'
					if (dirVec.y > 0.7) return "s";
					// if (dirVec.x < -0.4 && dirVec.y > 0.4) return 'sw'
					if (dirVec.x < -0.7) return "w";
					// if (dirVec.x < -0.4 && dirVec.y < -0.4) return 'nw'
					if (dirVec.y < -0.7) return "n";
					// if (dirVec.y < -0.4 && dirVec.x > 0.4) return 'ne'
				},
				getRepeaterValue(dirVec: Vec2) {
					const dir = this.getRepeaterDir(dirVec);
					dir && this.repeater.setDown(dir);
					return this.repeater.getPressed();
				},
				getRingIdFromDir(dir, id) {
					if (dir == "n") return id - selGridW * 2;
					if (dir == "ne") return id - selGridW + 1;
					if (dir == "e") return id + 1;
					if (dir == "se") return id + selGridW;
					if (dir == "s") return id + selGridW * 2;
					if (dir == "sw") return id + selGridW - 1;
					if (dir == "w") return id - 1;
					if (dir == "nw") return id - selGridW;
					throw new Error();
				},
				doButtonTraversal(inputRegained, dirOverride?: Vec2) {
					if (!inputRegained || dirOverride) {
						sc.control.menuConfirm() && this.invokeCurrentButton();

						const dirVec: Vec2 = dirOverride ?? Vec2.createC(ig.gamepad.getAxesValue(ig.AXES.LEFT_STICK_X), ig.gamepad.getAxesValue(ig.AXES.LEFT_STICK_Y));
						if (Vec2.isZero(dirVec)) return;
						this.lastDir = dirVec;

						const currentRing = sc.QuickRingMenu.instance.currentRingIndex;
						const ids = getAllIdsFromRing(currentRing);
						if (ids.length == 0) return;

						if (currentRing == ringCountToInit) {
							const dir = this.getRepeaterValue(dirVec);
							const currentButton = this.elements[this.current.x][this.current.y];
							const firstId = getIdFromRingPos(ringCountToInit, 0);
							let focusedId = currentButton.ringId;
							if (getRingPosFromId(focusedId).ring != ringCountToInit) focusedId = firstId;
							if (dirOverride) this.focusButtonByRingId(firstId);
							if (dir) {
								const id = this.getRingIdFromDir(dir, focusedId);
								if (id >= firstId) this.focusButtonByRingId(id);
							}
						} else {
							const angles = ids.map(id => sc.QuickRingMenu.instance.ringAngles[id].pure);

							const closestIndex = angles.reduce(
								(acc: [number, number], vec: Vec2, i: number) => {
									const dist = Vec2.distance(dirVec, vec);
									if (dist < acc[0]) return [dist, i] as [number, number];
									return acc;
								},
								[1000, -1]
							)[1];
							const id = ids[closestIndex];
							this.focusButtonByRingId(id);
						}
					}
				},
			});
		}

		/* in prestart */

		patchButtonTraversal();

		sc.QuickRingMenu.inject({
			init() {
				sc.QuickRingMenu.instance = this;
				this.openendAtLeastOnce = false;

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
					.sort()
					.map((name, i) => {
						const id = getIdFromRingPos(ringCountToInit, i);
						nax.ccuilib.QuickRingMenuWidgets.ringConfiguration[id] = name;
						const y = Math.floor(i / selGridW);
						const x = (i % selGridW) + (y % 2) / 2;
						const position = Vec2.create(selGridPos);
						Vec2.addC(position, x * 33, y * 17);
						this.ringAngles[id] = { pure: Vec2.create() /* the last ring is a grid, not a ring */, position };
						return id;
					});
			},
			enter() {
				this.parent();
				this.selectedToMoveButton = undefined;
				this.exitEditMode();
				this.currentRingIndex = -1;
				this.nextRing(1);
				if (!this.openendAtLeastOnce) {
					this.createButtons(true);
					this.openendAtLeastOnce = true;
				}
			},
			exit() {
				this.parent();
				this.infoBar.doStateTransition("HIDDEN");
			},
			nextRing(add) {
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
			},
			update() {
				this.parent();
				if (sc.quickmodel.activeState && sc.quickmodel.isQuickNone()) {
					const add = ig.gamepad.isButtonPressed(ig.BUTTONS.LEFT_SHOULDER) ? -1 : ig.gamepad.isButtonPressed(ig.BUTTONS.RIGHT_SHOULDER) ? 1 : 0;
					if (add != 0) {
						this.nextRing(add);
						this.buttongroup.doButtonTraversal(false, this.buttongroup.lastDir);
						sc.BUTTON_SOUND.submit.play();
					}

					const isGamepad = ig.input.currentDevice == ig.INPUT_DEVICES.GAMEPAD;
					if (
						!nax.ccuilib.QuickRingMenuWidgets.lockLayout && isGamepad
							? ig.gamepad.isButtonPressed(ig.BUTTONS.FACE2 /* x */)
							: ig.input.pressed("dash") /* right click */
					) {
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
								let fromWidget: string = nax.ccuilib.QuickRingMenuWidgets.ringConfiguration[fromB.ringId];
								let toWidget: string = nax.ccuilib.QuickRingMenuWidgets.ringConfiguration[toB.ringId];

								const fromRing: number = getRingPosFromId(fromB.ringId).ring;
								const toRing: number = getRingPosFromId(toB.ringId).ring;
								if (fromRing == ringCountToInit) {
									if (toRing != ringCountToInit) {
										nax.ccuilib.QuickRingMenuWidgets.ringConfiguration[toB.ringId] = fromWidget;
									}
								} else {
									if (toRing == ringCountToInit) {
										nax.ccuilib.QuickRingMenuWidgets.ringConfiguration[fromB.ringId] = `dummy${fromB.ringId}`;
									} else {
										nax.ccuilib.QuickRingMenuWidgets.ringConfiguration[fromB.ringId] = toWidget;
										nax.ccuilib.QuickRingMenuWidgets.ringConfiguration[toB.ringId] = fromWidget;
									}
								}

								saveConfig(this.possibleSelGridIds);

								this.selectedToMoveButton = undefined;
								sc.BUTTON_SOUND.toggle_off.play();
							}
						}
					}
				}
			},
			createButton(widget) {
				const button = new sc.RingMenuButton(widget.id ?? -1, 0, 0);
				button.title = widget.title ?? ig.lang.get(`sc.gui.quick-menu.title.${widget.name}`) ?? widget.name;
				button.data = widget.description ?? ig.lang.get(`sc.gui.quick-menu.description.${widget.name}`) ?? widget.name;

				const defaultAngle = this.ringAngles[0].position;
				button.endPosActive.x = Math.floor(defaultAngle.x - 16) + 1;
				button.endPosActive.y = Math.floor(defaultAngle.y - 16) + 5;

				widget.additionalInit && widget.additionalInit(button);
				button.keepPressed = !!widget.keepPressed;

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
				this.buttons = [];
				for (let i = 0; i < this.buttongroup.elements[0].length; i++) this.buttongroup.removeFocusGui(0, i);

				for (const id of [...possibleIds, ...(this.editModeOn ? this.possibleSelGridIds : [])]) {
					const widgetName = nax.ccuilib.QuickRingMenuWidgets.ringConfiguration[id];
					if (!widgetName) continue;
					const widget = nax.ccuilib.QuickRingMenuWidgets.widgets[widgetName];
					if (!widget) {
						if (initAll) delete nax.ccuilib.QuickRingMenuWidgets.ringConfiguration[id];
						continue;
					}
					const button = this.createButton(widget);
					this.setButtonId(button, id);
					this.addChildGui(button);
					this.buttons.push(button);
				}

				this.buttongroup.setButtons(...this.buttons);
			},
			_createRingButton() {
				throw new Error("cc-quick-menu-ext: This way of creating quick menu buttons is not supported.");
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
				if (!this.dummyButtonsCreated) {
					this.onWidgetListUpdate();
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
					if (nax.ccuilib.QuickRingMenuWidgets.ringConfiguration[id]) continue;
					nax.ccuilib.QuickRingMenuWidgets.ringConfiguration[id] = `dummy${id}`;
				}
				this.createButtons(true);
			},
			hideDummyButtons() {
				let anyHidden = false;
				for (const id of possibleIds) {
					const widgetName = nax.ccuilib.QuickRingMenuWidgets.ringConfiguration[id];
					if (widgetName && widgetName.startsWith("dummy")) {
						delete nax.ccuilib.QuickRingMenuWidgets.ringConfiguration[id];
						anyHidden = true;
					}
				}
				anyHidden && this.createButtons(true);
			},
		});

		let focusedButton: sc.RingMenuButton | undefined;
		sc.RingMenuButton.inject({
			init(state, endPosX, endPosY) {
				this.parent(state, endPosX, endPosY);
			},
			invokeButtonPress() {
				this.parent();
				if (this.keepPressed) this.isOn = !this.isOn;
			},
			focusGained() {
				this.parent();
				focusedButton = this;
				const widget = getWidgetFromId(this.ringId);
				sc.QuickRingMenu.instance.infoBar.setText(`${widget.title}${widget.description ? ` - ${widget.description}` : ""}`);
			},
			focusLost() {
				this.parent();
				focusedButton = undefined;
				sc.QuickRingMenu.instance.infoBar.setText("");
			},
			updateDrawables(renderer) {
				const widget = getWidgetFromId(this.ringId);
				// if ('draw' in widget) return widget.draw(renderer, this)
				/* stolen */
				renderer.addGfx(this.gfx, 0, 0, 400, 304, 32, 32);
				if (this.active) {
					if (this.focus) {
						renderer.addGfx(this.gfx, 0, 0, 400, 336, 32, 32).setAlpha(this.alpha);
					} else {
						if (this.pressed || this.isOn) renderer.addGfx(this.gfx, 0, 0, 400, 336, 32, 32);
					}
				} else {
					if (this.focus) renderer.addGfx(this.gfx, 0, 0, 400, 272, 32, 32);
				}
				/* stolen end */
				if (!("image" in widget)) return;

				let data = (widget._imageDataCached ??= widget.image(this));
				const { pos, srcPos, size } = data;
				renderer.addGfx(data.gfx, pos.x, pos.y, srcPos.x, srcPos.y, size.x, size.y);
			},
		});
	});
