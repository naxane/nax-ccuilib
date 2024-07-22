import { Opts as OptsType } from "../../options";

export function initQuickRingUtil() {
	const self = {
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
			return nax.ccuilib.QuickRingMenuWidgets.widgets[self.ringConf[id]];
		},

		ringCountToInit: 3 as const,
		selGridW: 4 as const,
		possibleIds: [] as number[],
		ringConf: {} as Record<number, string>,

		getAllIdsFromRing(ring: number) {
			const keys = Object.keys(self.ringConf);
			const mapped = keys.map(Number);
			const filtered = mapped.filter(id => self.getRingPosFromId(id).ring == ring);
			return filtered;
		},
		saveRingConfig(possibleSelGridIds: number[]) {
			const save = { ...self.ringConf };
			for (const id of Object.keys(save).map(Number)) {
				const name = save[id];
				if (name.startsWith("dummy")) delete save[id];
			}
			for (const id of possibleSelGridIds) delete save[id];

			const Opts = modmanager.options["nax-ccuilib"] as typeof OptsType;
			Opts.ringConfiguration = save;
		},
	};
	// @ts-expect-error
	window.sc = {};
	nax.ccuilib.quickRingUtil = self;
	for (let ring = 0; ring < self.ringCountToInit; ring++) {
		const maxSize = self.getRingMaxSize(ring);
		for (let index = 0; index < maxSize; index++) self.possibleIds.push(self.getIdFromRingPos(ring, index));
	}
	nax.ccuilib.QuickRingMenuWidgets = {
		observers: [],
		widgets: {},
		addWidget: (widget: nax.ccuilib.QuickMenuWidget) => {
			const key = widget.key ?? widget.name;
			if (nax.ccuilib.QuickRingMenuWidgets.widgets[key]) throw new Error(`Widget: "${key}" already assigned.`);
			nax.ccuilib.QuickRingMenuWidgets.widgets[key] = widget;
		},

		isWidgetToggledOn(widget: string) {
			const Opts = modmanager.options["nax-ccuilib"] as typeof OptsType;
			return Opts.buttonPressStatus[widget];
		},
	};
	nax.ccuilib.QUICK_MENU_WIDGET_EVENT = {
		CLICK: 0,
	};

	return self;
}
