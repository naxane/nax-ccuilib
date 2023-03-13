export { };

declare global {
	namespace sc {
		interface RingMenuButton extends ig.FocusGui {
				state: sc.QUICK_MENU_STATE;
				alpha: number;
				alphaTimer: number;
				endPos: Vec2;
				origin: Vec2;
				endPosActive: Vec2;
				data: any,
				name: string;
				invokeButtonPress(this: this): void;
				focusGained(this: this): void;
				update(this: this): void;
				// show(this: this, a, b): void;
				hide(this: this): void;
				activate(this: this): void;
				deactivate(this: this): void;
		}

		
		interface RingMenuButtonCon extends ImpactClass<RingMenuButton> {
			new(state: sc.QUICK_MENU_STATE, endPosX: number, endPosY: number): RingMenuButton;
		}

		
		let RingMenuButton: RingMenuButtonCon;
	}
}