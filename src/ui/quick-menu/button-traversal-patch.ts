ig.module("nax-ccuilib.ui.quick-menu.button-traversal-patch")
	.requires("game.feature.quick-menu.gui.circle-menu")
	.defines(() => {
		const { selGridW, getAllIdsFromRing, getIdFromRingPos, getRingPosFromId, ringCountToInit } = {
			...nax.ccuilib.quickRingUtil,
		};
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

					if (ig.input.currentDevice == ig.INPUT_DEVICES.GAMEPAD) {
						const currentRing = sc.QuickRingMenu.instance.currentRingIndex;
						const ids = getAllIdsFromRing(currentRing);
						if (ids.length == 0) return;
						const dirVec: Vec2 = dirOverride ?? Vec2.createC(ig.gamepad.getAxesValue(ig.AXES.LEFT_STICK_X), ig.gamepad.getAxesValue(ig.AXES.LEFT_STICK_Y));
						if (Vec2.isZero(dirVec)) return;
						this.lastDir = dirVec;
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
					} else if (ig.input.currentDevice == ig.INPUT_DEVICES.KEYBOARD_AND_MOUSE) {
						const dirs: { cond: () => boolean; id: number }[] = [
							{ cond: () => sc.control.leftDown() && sc.control.upDown(), id: 1 },
							{ cond: () => sc.control.leftDown() && sc.control.downDown(), id: 3 },
							{ cond: () => sc.control.rightDown() && sc.control.downDown(), id: 5 },
							{ cond: () => sc.control.rightDown() && sc.control.upDown(), id: 7 },
							{ cond: () => sc.control.upDown(), id: 0 },
							{ cond: () => sc.control.leftDown(), id: 2 },
							{ cond: () => sc.control.downDown(), id: 4 },
							{ cond: () => sc.control.rightDown(), id: 6 },
						];
						for (const dir of dirs) {
							if (dir.cond()) {
								this.focusButtonByRingId(dir.id);
								break;
							}
						}
					}
				}
			},
		});
	});
