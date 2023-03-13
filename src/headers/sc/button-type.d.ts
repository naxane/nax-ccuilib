
export { };

declare global {
	namespace sc {
		namespace ButtonGui {
			interface Type {
				height: number,
				ninepatch: ig.NinePatch;
				highlight: Highlight;
			}

			interface Highlight {
				startX: number,
				endX: number,
				leftWidth: number,
				rightWidth: number,
				offsetY: number,
				gfx: ig.Image,
				pattern: ig.ImagePattern,

			}
		}
	}
}