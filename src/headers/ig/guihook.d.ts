export { };

declare global {
	namespace ig {
		interface GuiHookConstructor extends ImpactClass<GuiHook> {
			new(gui: GuiElementBase): GuiHook;
		}

		var GuiHook: GuiHookConstructor;
	}
}