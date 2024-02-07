export const quickRingUtil = {
	localStorageConfigId: "quickMenuConfig" as const,
	lockLayout: false as boolean,

	getRingMaxSize(ring: number) {
		return (ring + 1) * 8;
	},

	angleVec(angle: number): Vec2 {
		angle = (angle + 180) % 360;
		return {
			x: Math.sin((angle * Math.PI) / 180),
			y: Math.cos((angle * Math.PI) / 180),
		};
	},

	getIdFromRingPos(ring: number, index: number): number {
		return ring * 1000 + index;
	},

	getRingPosFromId(id: number) {
		return { ring: Math.floor(id / 1000), index: id % 1000 };
	},

	getWidgetFromId(id: number) {
		return nax.ccuilib.QuickRingMenuWidgets.widgets[nax.ccuilib.QuickRingMenuWidgets.ringConfiguration[id]];
	},

	ringCountToInit: 3 as const,
	possibleIds: [] as number[],

	getAllIdsFromRing(ring: number) {
		const keys = Object.keys(nax.ccuilib.QuickRingMenuWidgets.ringConfiguration);
		const mapped = keys.map(Number);
		const filtered = mapped.filter(id => quickRingUtil.getRingPosFromId(id).ring == ring);
		return filtered;
	},

	loadConfig(): Record<number, string> {
		return JSON.parse(
			localStorage.getItem(quickRingUtil.localStorageConfigId) ??
				JSON.stringify({
					[quickRingUtil.getIdFromRingPos(0, 0)]: "11_items",
					[quickRingUtil.getIdFromRingPos(0, 2)]: "11_analyze",
					[quickRingUtil.getIdFromRingPos(0, 4)]: "11_party",
					[quickRingUtil.getIdFromRingPos(0, 6)]: "11_map",
				})
		);
	},

	saveConfig(possibleSelGridIds: number[]) {
		const save = { ...nax.ccuilib.QuickRingMenuWidgets.ringConfiguration };
		for (const id of Object.keys(save).map(Number)) {
			const name = save[id];
			if (name.startsWith("dummy")) delete save[id];
		}
		for (const id of possibleSelGridIds) delete save[id];
		localStorage.setItem(quickRingUtil.localStorageConfigId, JSON.stringify(save));
	},

	initExtensionVars() {
		// @ts-expect-error
		window.sc = {};
		nax.ccuilib.quickRingUtil = quickRingUtil;
		for (let ring = 0; ring < quickRingUtil.ringCountToInit; ring++) {
			const maxSize = quickRingUtil.getRingMaxSize(ring);
			for (let index = 0; index < maxSize; index++) quickRingUtil.possibleIds.push(quickRingUtil.getIdFromRingPos(ring, index));
		}
		nax.ccuilib.QuickRingMenuWidgets = {
			observers: [],
			widgets: {},
			addWidget: (widget: nax.ccuilib.QuickMenuWidget) => {
				const key = widget.key ?? widget.name;
				if (nax.ccuilib.QuickRingMenuWidgets.widgets[key]) throw new Error(`Widget: "${key}" already assigned.`);
				nax.ccuilib.QuickRingMenuWidgets.widgets[key] = widget;
			},
			ringConfiguration: quickRingUtil.loadConfig(),
			set lockLayout(value: boolean) {
				quickRingUtil.lockLayout = value;
				sc.QuickRingMenu.instance.createButtons(true);
			},
			get lockLayout(): boolean {
				return quickRingUtil.lockLayout;
			},
		};
		nax.ccuilib.QUICK_MENU_WIDGET_EVENT = {
			CLICK: 0,
		};
	},
};
