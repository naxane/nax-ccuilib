ig.module("nax-ccuilib.ui.quick-menu.default-widgets").defines(() => {
	function getImageDrawConfig(state: sc.QUICK_MENU_STATE): nax.ccuilib.QuickMenuWidgetImageConfig {
		return button => ({
			gfx: new ig.Image("media/gui/menu.png"),
			srcPos: { x: 432 + (state - 1) * 16, y: 352 + (button.active ? 0 : 16) },
			pos: { x: 8, y: 8 },
			size: { x: 16, y: 16 },
		});
	}

	nax.ccuilib.QuickRingMenuWidgets.addWidget({
		key: "11_items",
		name: "items",
		title: "Items",
		id: sc.QUICK_MENU_STATE.ITEMS,
		image: getImageDrawConfig(sc.QUICK_MENU_STATE.ITEMS),
		additionalInit: button => {
			sc.QuickRingMenu.instance.items = button;
			button.addChildGui(new sc.ItemTimerOverlay(button));
		},
	});
	nax.ccuilib.QuickRingMenuWidgets.addWidget({
		key: "11_analyze",
		name: "analyze",
		title: "Analysis",
		id: sc.QUICK_MENU_STATE.CHECK,
		image: getImageDrawConfig(sc.QUICK_MENU_STATE.CHECK),
		additionalInit: button => {
			sc.QuickRingMenu.instance.check = button;
		},
	});
	nax.ccuilib.QuickRingMenuWidgets.addWidget({
		key: "11_party",
		name: "party",
		title: "Party",
		id: sc.QUICK_MENU_STATE.PARTY,
		image: getImageDrawConfig(sc.QUICK_MENU_STATE.PARTY),
		additionalInit: button => {
			sc.QuickRingMenu.instance.party = button;
		},
	});
	nax.ccuilib.QuickRingMenuWidgets.addWidget({
		key: "11_map",
		name: "map",
		title: "Map",
		id: sc.QUICK_MENU_STATE.MAP,
		image: getImageDrawConfig(sc.QUICK_MENU_STATE.MAP),
		additionalInit: button => {
			sc.QuickRingMenu.instance.map = button;
		},
	});
});
