export {};

declare global {
	namespace sc {
		interface ButtonHighlightGui extends ig.GuiElementBase {
			focusWeight: number;
			gfx: ig.Image;
			pattern: ig.ImagePattern;
			flipped: boolean;
			highlight: sc.ButtonGui.Highlight;
		}

		interface ButtonHighlightGuiCon extends ImpactClass<ButtonHighlightGui> {
			new (width: number, type: sc.ButtonGui.Type | nax.ccuilib.InputFieldType): ButtonHighlightGui;
		}

		let ButtonHighlightGui: ButtonHighlightGuiCon;
	}
}