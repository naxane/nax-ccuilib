export { };

declare global {
	namespace nax {
		namespace ccuilib {
			interface TestMenu extends sc.BaseMenu {
				buttonGroup: sc.ButtonGroup;
				content: ig.GuiElementBase;
				box: sc.CenterBoxGui;
				onBackButtonPress(): void;
				modelChanged(sender: any, event: any, data: any): void;
			}

			interface TestMenuCon extends ImpactClass<TestMenu> {
				new(): TestMenu;
			}

			let TestMenu: TestMenuCon;
		}
	}
}