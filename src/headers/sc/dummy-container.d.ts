export {};

declare global {
	namespace sc {
		interface DummyContainer extends ig.GuiElementBase {

		}

		interface DummyContainerCon extends ImpactClass<DummyContainer> {
			new (child: ig.GuiElementBase): DummyContainer;
		}

		let DummyContainer: DummyContainerCon;
	}
}