export { };

declare global {
	namespace sc {
		interface QuickRingMenu extends ig.GuiElementBase {
			buttongroup: QuickMenuButtonGroup;
			buttons: sc.RingMenuButton[];
			buttonCallbacks: {[index: number]: QuickRingMenuPressCallback}

			items: sc.RingMenuButton;
			check: sc.RingMenuButton;
			party: sc.RingMenuButton;
			map: sc.RingMenuButton;

			_unfocusAll(this: this, data?: any): void;
			_createRingButton(this: this, name: string, state: QUICK_MENU_STATE | number, pos: Vec2[], x?: number, y?: number): sc.RingMenuButton;
			_updatePos(this: this): void;
			show(this: this): void;
			hide(this: this): void;
			exit(this: this): void;
			enter(this: this): void;
			modelChanged(this: this, model: QuickMenuModel, event: QUICK_MODEL_EVENT): void;
			addQuickRingButton(this: this, name: string, stateName: string, pressCallback: QuickRingMenuPressCallback, updatePositions: boolean): sc.RingMenuButton;
			updateButtonPositions(this: this): void;
			getButtonByName(this: this, name: string): sc.RingMenuButton | undefined;
			removeButtonByName(this: this, name: string): sc.RingMenuButton | undefined;

			getAngle(this: this, order: number): number;
			getPosition(this: this, angle: number): Vec2;
		}

		interface QuickRingMenuCon extends ImpactClass<QuickRingMenu> {
			new(): QuickRingMenu;
		}

		let QuickRingMenu: QuickRingMenuCon;

		type QuickRingMenuPressCallback = (this: QuickRingMenu, data: any) => void;
	}
}