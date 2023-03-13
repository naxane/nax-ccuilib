export { };

declare global {
	namespace sc {
		interface QuickMenuButtonGroup extends ig.ButtonGroup {
			setButtons(this: this, ...buttons: sc.RingMenuButton[]): void;
		}

		interface QuickMenuButtonGroupCon extends ImpactClass<QuickMenuButtonGroup> {
			new(): QuickMenuButtonGroup;
		}

		let QuickMenuButtonGroup: QuickMenuButtonGroupCon;
	}
}