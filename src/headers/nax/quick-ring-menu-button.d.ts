export { };

declare global {
	namespace nax {
		namespace ccuilib {
			interface QuickRingMenuButton {
				name: string;
				button: sc.RingMenuButton;
				angle: number;
				order: number;
				position: Vec2;
			}
		}
	}
}