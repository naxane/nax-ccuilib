import type { initQuickRingUtil } from "../../ui/quick-menu/quick-menu-preload";

export {};
declare global {
	namespace nax.ccuilib {
		var quickRingUtil: ReturnType<typeof initQuickRingUtil>;

		interface QuickRingMenuWidgets extends sc.Model {
			widgets: Record<string, nax.ccuilib.QuickMenuWidget>;
		}
	}
}
