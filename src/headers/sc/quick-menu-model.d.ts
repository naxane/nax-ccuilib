

export { };

declare global {
	namespace sc {
		interface QuickMenuModel extends ig.GameAddon {
			observers: sc.Model.Observer[];
			buttonInteract: ig.ButtonInteractEntry;
			activeState: boolean;
			currentState: QUICK_MENU_STATE;
			previousState: QUICK_MENU_STATE;
			visible: boolean;
			cursorMoved: boolean;
			cursor: Vec2;
			analFocus: QuickMenuTypesBase
			enterItems(this: this): void;
			enterParty(this: this): void;
			enterCheck(this: this): void;
			enterNone(this: this): void;
			setInfoText(this: this, infoText: string, ): void;
			setBuffText(this: this, buffText: string, buffID: number): void;
			setItemBlock(this: this): void;

			isQuickNone(this: this): boolean;
			isQuickItems(this: this): boolean;
			isQuickParty(this: this): boolean;
			isQuickCheck(this: this): boolean;
		}

		interface QuickMenuModelCon extends ImpactClass<QuickMenuModel> {
			new(): QuickMenuModel;
		}

		let quickmodel: QuickMenuModel;
	}
}