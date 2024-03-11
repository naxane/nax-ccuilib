import { quickRingUtil as quickRingUtilImport } from "../../ui/quick-menu/quick-menu-preload";

export {};
declare global {
	namespace nax.ccuilib {
		var quickRingUtil: typeof quickRingUtilImport;

		interface QuickRingMenuWidgets extends sc.Model {
			_ringConfiguration: Record<number, string>;
			ringConfiguration: Record<number, string>;
			widgets: Record<string, nax.ccuilib.QuickMenuWidget>;
			lockLayout: boolean;
		}
	}
	namespace sc {
		interface RingMenuButton {
			isAToggle?: boolean;
		}
	}
}
