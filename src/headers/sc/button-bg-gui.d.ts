export { };

declare global {
	namespace sc {
		interface ButtonBgGui extends ig.BoxGui {

		}

		interface ButtonBgGuiCon extends ImpactClass<ButtonBgGui> {
			new(width: number, type: sc.ButtonGui.Type | nax.ccuilib.InputFieldType): ButtonBgGui;
		}

		let ButtonBgGui: ButtonBgGuiCon;
	}
}