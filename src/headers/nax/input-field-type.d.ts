export {};

declare global {
	namespace nax {
		namespace ccuilib {
			interface InputFieldType {
				height: number;
				ninepatch: ig.NinePatch;
				highlight: sc.ButtonGui.Highlight;
			}

			let INPUT_FIELD_TYPE: { [index: string]: InputFieldType };
		}
	}
}
