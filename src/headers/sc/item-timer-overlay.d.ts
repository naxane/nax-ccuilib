export { };

declare global {
	namespace sc {
		interface ItemTimerOverlay extends ig.GuiElementBase {
			isActive: boolean,
			numberGui: sc.NumberGui,
			button: sc.RingMenuButton,

			update(this: this): void;
		}

		
		interface ItemTimerOverlayCon extends ImpactClass<ItemTimerOverlay> {
			new(button: sc.RingMenuButton): ItemTimerOverlay;
		}

		
		let ItemTimerOverlay: ItemTimerOverlayCon;
	}
}